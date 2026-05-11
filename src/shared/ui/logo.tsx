import { Typography, type TypographyProps } from '@mui/material';

type LogoProps = Omit<TypographyProps, 'children' | 'variant'>;

export const Logo = (props: LogoProps) => {
	return (
		<Typography
			{...props}
			variant="Logo"
			component={props.component ?? 'div'}
		>
			Nota
		</Typography>
	);
};
