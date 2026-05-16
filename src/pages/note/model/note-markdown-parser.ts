export type NoteMarkdownHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type NoteInlineToken =
	| {
			type: 'text';
			value: string;
	  }
	| {
			type: 'strong' | 'emphasis';
			children: NoteInlineToken[];
	  }
	| {
			type: 'code';
			value: string;
	  };

export type NoteMarkdownCodeBlockPosition =
	| 'single'
	| 'start'
	| 'middle'
	| 'end';

export type NoteMarkdownLine =
	| {
			type: 'blank';
			rawMarkdown: string;
	  }
	| {
			type: 'paragraph';
			rawMarkdown: string;
			content: NoteInlineToken[];
	  }
	| {
			type: 'heading';
			rawMarkdown: string;
			level: NoteMarkdownHeadingLevel;
			content: NoteInlineToken[];
	  }
	| {
			type: 'unordered-list-item';
			rawMarkdown: string;
			content: NoteInlineToken[];
	  }
	| {
			type: 'ordered-list-item';
			rawMarkdown: string;
			marker: string;
			content: NoteInlineToken[];
	  }
	| {
			type: 'code-block';
			rawMarkdown: string;
			content: string;
			codeBlockId: number;
			position: NoteMarkdownCodeBlockPosition;
	  }
	| {
			type: 'code-fence';
			rawMarkdown: string;
	  };

const ESCAPABLE_MARKDOWN_CHARACTERS = new Set([
	'\\',
	'#',
	'-',
	'.',
	'*',
	'_',
	'`',
]);

const isEscapableMarkdownCharacter = (character: string | undefined) =>
	character !== undefined && ESCAPABLE_MARKDOWN_CHARACTERS.has(character);

const appendTextToken = (tokens: NoteInlineToken[], value: string) => {
	if (!value) {
		return;
	}

	const previousToken = tokens.at(-1);

	if (previousToken?.type === 'text') {
		previousToken.value += value;
		return;
	}

	tokens.push({
		type: 'text',
		value,
	});
};

const unescapeMarkdownText = (markdown: string) => {
	let text = '';
	let index = 0;

	while (index < markdown.length) {
		const character = markdown[index];
		const nextCharacter = markdown[index + 1];

		if (
			character === '\\' &&
			isEscapableMarkdownCharacter(nextCharacter)
		) {
			text += nextCharacter;
			index += 2;
			continue;
		}

		text += character;
		index += 1;
	}

	return text;
};

const findClosingDelimiter = (
	markdown: string,
	delimiter: '*' | '_' | '`',
	startIndex: number,
) => {
	for (let index = startIndex; index < markdown.length; index += 1) {
		if (
			markdown[index] === '\\' &&
			isEscapableMarkdownCharacter(markdown[index + 1])
		) {
			index += 1;
			continue;
		}

		if (markdown[index] === delimiter) {
			return index;
		}
	}

	return -1;
};

const parseInlineMarkdown = (markdown: string): NoteInlineToken[] => {
	const tokens: NoteInlineToken[] = [];
	let textBuffer = '';
	let index = 0;

	const flushText = () => {
		appendTextToken(tokens, textBuffer);
		textBuffer = '';
	};

	while (index < markdown.length) {
		const character = markdown[index];
		const nextCharacter = markdown[index + 1];

		if (
			character === '\\' &&
			isEscapableMarkdownCharacter(nextCharacter)
		) {
			textBuffer += nextCharacter;
			index += 2;
			continue;
		}

		if (character === '*' || character === '_' || character === '`') {
			const closingIndex = findClosingDelimiter(
				markdown,
				character,
				index + 1,
			);

			if (closingIndex > index + 1) {
				const content = markdown.slice(index + 1, closingIndex);

				flushText();

				if (character === '`') {
					tokens.push({
						type: 'code',
						value: unescapeMarkdownText(content),
					});
				} else {
					tokens.push({
						type: character === '*' ? 'strong' : 'emphasis',
						children: parseInlineMarkdown(content),
					});
				}

				index = closingIndex + 1;
				continue;
			}
		}

		textBuffer += character;
		index += 1;
	}

	flushText();

	return tokens;
};

const isCodeFenceLine = (markdownLine: string) => {
	const trimmedLineStart = markdownLine.trimStart();

	return (
		trimmedLineStart.startsWith('```') &&
		!trimmedLineStart.startsWith('\\```')
	);
};

const parsePreviewLine = (
	rawMarkdown: string,
	codeBlockId: number,
	isInsideCodeBlock: boolean,
): NoteMarkdownLine => {
	if (isInsideCodeBlock) {
		return {
			type: 'code-block',
			rawMarkdown,
			content: rawMarkdown,
			codeBlockId,
			position: 'single',
		};
	}

	if (!rawMarkdown.trim()) {
		return {
			type: 'blank',
			rawMarkdown,
		};
	}

	const headingMatch = /^(#{1,6})[ \t]+(.*)$/.exec(rawMarkdown);

	if (headingMatch) {
		return {
			type: 'heading',
			rawMarkdown,
			level: headingMatch[1].length as NoteMarkdownHeadingLevel,
			content: parseInlineMarkdown(headingMatch[2]),
		};
	}

	const unorderedListItemMatch = /^-[ \t]+(.*)$/.exec(rawMarkdown);

	if (unorderedListItemMatch) {
		return {
			type: 'unordered-list-item',
			rawMarkdown,
			content: parseInlineMarkdown(unorderedListItemMatch[1]),
		};
	}

	const orderedListItemMatch = /^(\d+)\.[ \t]+(.*)$/.exec(rawMarkdown);

	if (orderedListItemMatch) {
		return {
			type: 'ordered-list-item',
			rawMarkdown,
			marker: `${orderedListItemMatch[1]}.`,
			content: parseInlineMarkdown(orderedListItemMatch[2]),
		};
	}

	return {
		type: 'paragraph',
		rawMarkdown,
		content: parseInlineMarkdown(rawMarkdown),
	};
};

const applyCodeBlockPositions = (
	parsedLines: NoteMarkdownLine[],
): NoteMarkdownLine[] =>
	parsedLines.map((line, index) => {
		if (line.type !== 'code-block') {
			return line;
		}

		const previousLine = parsedLines[index - 1];
		const nextLine = parsedLines[index + 1];
		const hasPreviousCodeLine =
			previousLine?.type === 'code-block' &&
			previousLine.codeBlockId === line.codeBlockId;
		const hasNextCodeLine =
			nextLine?.type === 'code-block' &&
			nextLine.codeBlockId === line.codeBlockId;

		if (!hasPreviousCodeLine && !hasNextCodeLine) {
			return {
				...line,
				position: 'single',
			};
		}

		if (!hasPreviousCodeLine) {
			return {
				...line,
				position: 'start',
			};
		}

		if (!hasNextCodeLine) {
			return {
				...line,
				position: 'end',
			};
		}

		return {
			...line,
			position: 'middle',
		};
	});

export const parseNoteMarkdownLines = (
	markdownLines: readonly string[],
): NoteMarkdownLine[] => {
	let isInsideCodeBlock = false;
	let codeBlockId = 0;

	const parsedLines = markdownLines.map((rawMarkdown) => {
		if (isCodeFenceLine(rawMarkdown)) {
			if (!isInsideCodeBlock) {
				codeBlockId += 1;
			}

			isInsideCodeBlock = !isInsideCodeBlock;

			return {
				type: 'code-fence' as const,
				rawMarkdown,
			};
		}

		return parsePreviewLine(
			rawMarkdown,
			codeBlockId,
			isInsideCodeBlock,
		);
	});

	return applyCodeBlockPositions(parsedLines);
};
