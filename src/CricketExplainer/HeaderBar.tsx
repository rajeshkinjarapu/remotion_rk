import React from 'react';
import { BrandLogo } from './BrandLogo';
import { anekFont, ramaFont } from './fonts';

export const HeaderBar: React.FC<{
	title?: string;
	category?: string;
	theme?: 'dark' | 'light';
}> = ({
	title = 'ఐపీఎల్: అసలైన రికార్డుల రారాజు ఎవరు?',
	category = 'స్పెషల్ అనాలసిస్',
	theme = 'dark',
}) => {
	const isDark = theme === 'dark';
	const textColor = isDark ? '#FFFFFF' : '#0B172E';
	const lineColor = isDark ? '#F59E0B' : '#0B172E';

	return (
		<div
			style={{
				position: 'absolute',
				top: 36,
				left: 70,
				right: 70,
				zIndex: 50,
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					paddingBottom: 14,
				}}
			>
				{/* Left: Brand Logo + Giant Title */}
				<div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
					<BrandLogo size={1.05} />
					<div
						style={{
							color: textColor,
							fontSize: 46,
							fontWeight: 900,
							letterSpacing: '0.2px',
							fontFamily: ramaFont,
						}}
					>
						{title}
					</div>
				</div>

				{/* Right: Category badge */}
				{category && (
					<div
						style={{
							color: '#E11D48',
							fontSize: 24,
							fontWeight: 800,
							fontFamily: anekFont,
						}}
					>
						{category}
					</div>
				)}
			</div>

			{/* Clean Divider Line */}
			<div
				style={{
					width: '100%',
					height: 3,
					backgroundColor: lineColor,
					opacity: isDark ? 0.9 : 0.85,
				}}
			/>
		</div>
	);
};

