import type { TypographyVariantsOptions } from '@mui/material/styles';
import type { CSSProperties } from 'react';

import type { CustomTypographyVariant } from './typography.d';

type AppTypographyVariantsOptions = TypographyVariantsOptions &
	Partial<Record<CustomTypographyVariant, CSSProperties>>;

export const typography: AppTypographyVariantsOptions = {
	fontFamily: '"Rubik", "Roboto", "Helvetica", "Arial", sans-serif',
	Logo: {
		fontFamily: '"Molle", cursive',
		fontSize: 56,
		fontWeight: 400,
		lineHeight: 1,
		letterSpacing: 0,
		color: '#000000',
		padding: '8px 16px',
	},
	M40: {
		fontSize: 40,
		fontWeight: 500,
		lineHeight: 1,
		letterSpacing: 0,
	},
	M32: {
		fontSize: 32,
		fontWeight: 500,
		lineHeight: 1,
		letterSpacing: 0,
	},
	M24: {
		fontSize: 24,
		fontWeight: 500,
		lineHeight: 1,
		letterSpacing: 0,
	},
	M20: {
		fontSize: 20,
		fontWeight: 500,
		lineHeight: 1,
		letterSpacing: 0,
	},
	M16: {
		fontSize: 16,
		fontWeight: 500,
		lineHeight: 1,
		letterSpacing: 0,
	},
	M12: {
		fontSize: 12,
		fontWeight: 500,
		lineHeight: 1,
		letterSpacing: 0,
	},
	R48: {
		fontSize: 48,
		fontWeight: 400,
		lineHeight: 1,
		letterSpacing: 0,
	},
	R20: {
		fontSize: 20,
		fontWeight: 400,
		lineHeight: 1,
		letterSpacing: 0,
	},
	R16: {
		fontSize: 16,
		fontWeight: 400,
		lineHeight: 1,
		letterSpacing: 0,
	},
	R12: {
		fontSize: 12,
		fontWeight: 400,
		lineHeight: 1,
		letterSpacing: 0,
	},
	L24: {
		fontSize: 24,
		fontWeight: 300,
		lineHeight: 1,
		letterSpacing: 0,
	},
	L20: {
		fontSize: 20,
		fontWeight: 300,
		lineHeight: 1,
		letterSpacing: 0,
	},
	L16: {
		fontSize: 16,
		fontWeight: 300,
		lineHeight: 1,
		letterSpacing: 0,
	},
	L12: {
		fontSize: 12,
		fontWeight: 300,
		lineHeight: 1,
		letterSpacing: 0,
	},
};
