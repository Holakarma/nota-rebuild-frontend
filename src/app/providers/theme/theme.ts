import { createTheme } from '@mui/material';

import { typography } from './config/typography';

const designColors = {
	black: '#000000',
	white: '#ffffff',
	textSecondary: '#454545',
	disabled: '#4c4c4c',
	pressedText: '#7c7c7c',
	placeholder: '#8b8b8b',
	containedHoverText: '#c3c3c3',
	pressedBackground: '#d4d4d4',
	selectedBackground: '#eaeaea',
	hoverBackground: '#ededed',
	subtleHoverBackground: '#f7f7f7',
};

export const theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: designColors.black,
			contrastText: designColors.white,
		},
		/* common: {
			black: designColors.black,
			white: designColors.white,
		},
		background: {
			default: designColors.white,
			paper: designColors.white,
		},
		text: {
			primary: designColors.black,
			secondary: designColors.textSecondary,
			disabled: designColors.disabled,
		},
		divider: designColors.black,
		grey: {
			50: designColors.subtleHoverBackground,
			100: designColors.hoverBackground,
			200: designColors.selectedBackground,
			300: designColors.pressedBackground,
			400: designColors.containedHoverText,
			500: designColors.placeholder,
			600: designColors.pressedText,
			700: designColors.disabled,
			800: designColors.textSecondary,
			900: '#222222',
		},
		action: {
			active: designColors.black,
			hover: designColors.hoverBackground,
			selected: designColors.selectedBackground,
			disabled: designColors.disabled,
			disabledBackground: designColors.disabled,
		}, */
	},

	typography,
	components: {
		MuiCssBaseline: {
			styleOverrides: `
				@font-face {
					font-family: 'Rubik';
					font-style: normal;
					font-display: swap;
					font-weight: 300 900;
					src: url('/fonts/Rubik/Rubik-VariableFont_wght.ttf') format('truetype');
				}

				@font-face {
					font-family: 'Rubik';
					font-style: italic;
					font-display: swap;
					font-weight: 300 900;
					src: url('/fonts/Rubik/Rubik-Italic-VariableFont_wght.ttf') format('truetype');
				}

				@font-face {
					font-family: 'Molle';
					font-style: normal;
					font-display: swap;
					font-weight: 400;
					src: url('/fonts/Molle/Molle_400Regular_Italic.ttf') format('truetype');
				}
				`,
		},
		MuiListItemButton: {
			defaultProps: {
				disableRipple: true,
				disableTouchRipple: true
			},
		},
		MuiButton: {
			defaultProps: {
				disableElevation: true,
				disableRipple: true,
				disableFocusRipple: true,
				disableTouchRipple: true
			},
			// 		styleOverrides: {
			// 			root: {
			// 				minHeight: 36,
			// 				borderRadius: 0,
			// 				boxSizing: 'border-box',
			// 				display: 'inline-flex',
			// 				alignItems: 'center',
			// 				justifyContent: 'center',
			// 				gap: 8,
			// 				padding: '8px 16px',
			// 				fontFamily: 'Rubik',
			// 				fontSize: 20,
			// 				fontWeight: 300,
			// 				lineHeight: 1,
			// 				letterSpacing: 0,
			// 				textDecoration: 'none',
			// 				textTransform: 'none',
			// 				boxShadow: 'none',
			// 				'&:hover': {
			// 					boxShadow: 'none',
			// 				},
			// 				'&:active': {
			// 					boxShadow: 'none',
			// 				},
			// 				'& img, & svg': {
			// 					width: 24,
			// 					height: 24,
			// 					display: 'block',
			// 					fontSize: 24,
			// 				},
			// 				'&.Mui-focusVisible': {
			// 					outline: `1px solid ${designColors.black}`,
			// 					outlineOffset: 2,
			// 				},
			// 			},
			// 			contained: {
			// 				border: '1px solid transparent',
			// 				backgroundColor: designColors.black,
			// 				color: designColors.white,
			// 				'&:hover': {
			// 					backgroundColor: designColors.black,
			// 					color: designColors.containedHoverText,
			// 				},
			// 				'&:active': {
			// 					backgroundColor: designColors.black,
			// 					color: designColors.pressedText,
			// 				},
			// 				'&.Mui-disabled': {
			// 					backgroundColor: designColors.disabled,
			// 					color: designColors.white,
			// 				},
			// 			},
			// 			outlined: {
			// 				border: `1px solid ${designColors.black}`,
			// 				backgroundColor: designColors.white,
			// 				color: designColors.black,
			// 				'&:hover': {
			// 					border: `1px solid ${designColors.black}`,
			// 					backgroundColor: designColors.hoverBackground,
			// 				},
			// 				'&:active': {
			// 					border: `1px solid ${designColors.black}`,
			// 					backgroundColor: designColors.pressedBackground,
			// 				},
			// 				'&.Mui-disabled': {
			// 					border: `1px solid ${designColors.disabled}`,
			// 					color: designColors.disabled,
			// 				},
			// 			},
			// 			text: {
			// 				color: designColors.black,
			// 				backgroundColor: 'transparent',
			// 				'&:hover': {
			// 					backgroundColor: 'transparent',
			// 					boxShadow: `inset 0 -1px 0 ${designColors.black}`,
			// 				},
			// 				'&:active': {
			// 					backgroundColor: designColors.pressedBackground,
			// 					boxShadow: 'none',
			// 				},
			// 				'&.Mui-disabled': {
			// 					color: designColors.disabled,
			// 				},
			// 			},
			// 			startIcon: {
			// 				margin: 0,
			// 			},
			// 			endIcon: {
			// 				margin: 0,
			// 			},
			// 		},
		},
		MuiIconButton: {
			defaultProps: {
				disableRipple: true,
				disableFocusRipple: true,
				disableTouchRipple: true
			},
			// 		styleOverrides: {
			// 			root: {
			// 				minHeight: 36,
			// 				borderRadius: 0,
			// 				padding: '8px 16px',
			// 				color: designColors.black,
			// 				'&:hover': {
			// 					backgroundColor: designColors.hoverBackground,
			// 				},
			// 				'&:active': {
			// 					backgroundColor: designColors.pressedBackground,
			// 				},
			// 				'&.Mui-disabled': {
			// 					color: designColors.disabled,
			// 				},
			// 				'& img, & svg': {
			// 					width: 24,
			// 					height: 24,
			// 					display: 'block',
			// 					fontSize: 24,
			// 				},
			// 			},
			// 		},
			// 	},
			// 	MuiInputBase: {
			// 		styleOverrides: {
			// 			root: {
			// 				width: '100%',
			// 				border: `1px solid ${designColors.black}`,
			// 				borderRadius: 0,
			// 				boxSizing: 'border-box',
			// 				backgroundColor: designColors.white,
			// 				fontFamily: 'Rubik',
			// 				fontSize: 20,
			// 				fontWeight: 400,
			// 				lineHeight: 1,
			// 				letterSpacing: 0,
			// 				color: designColors.black,
			// 				'&.Mui-focused': {
			// 					outline: `1px solid ${designColors.black}`,
			// 					outlineOffset: 2,
			// 				},
			// 			},
			// 			input: {
			// 				paddingBlock: 10,
			// 			},
			// 		},
		},
		// 	MuiCard: {
		// 		styleOverrides: {
		// 			root: {
		// 				border: `1px solid ${designColors.black}`,
		// 				borderRadius: 0,
		// 				boxShadow: 'none',
		// 				backgroundColor: designColors.white,
		// 				color: designColors.black,
		// 			},
		// 		},
		// 	},
		// 	MuiCardContent: {
		// 		styleOverrides: {
		// 			root: {
		// 				padding: '16px 32px',
		// 				'&:last-child': {
		// 					paddingBottom: 16,
		// 				},
		// 			},
		// 		},
		// 	},
		// 	MuiListItemButton: {
		// 		styleOverrides: {
		// 			root: {
		// 				padding: '8px 16px',
		// 				borderRadius: 0,
		// 				color: designColors.black,
		// 				'&:hover': {
		// 					backgroundColor: designColors.hoverBackground,
		// 				},
		// 				'&.Mui-selected': {
		// 					backgroundColor: designColors.selectedBackground,
		// 					'&:hover': {
		// 						backgroundColor: designColors.selectedBackground,
		// 					},
		// 				},
		// 			},
		// 		},
		// 	},
		// 	MuiListItemText: {
		// 		styleOverrides: {
		// 			primary: {
		// 				fontFamily: 'Rubik',
		// 				fontSize: 24,
		// 				fontWeight: 300,
		// 				lineHeight: 1,
		// 				letterSpacing: 0,
		// 			},
		// 		},
		// 	},
	},
});
