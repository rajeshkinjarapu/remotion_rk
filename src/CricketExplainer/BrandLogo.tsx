import React from 'react';

export const BrandLogo: React.FC<{ size?: number }> = ({ size = 1 }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				backgroundColor: '#0A1424',
				borderRadius: 6 * size,
				border: `${1.5 * size}px solid #1E293B`,
				boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
				overflow: 'hidden',
				width: 110 * size,
				userSelect: 'none',
			}}
		>
			{/* Top Filmstrip Dashes */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					gap: 4 * size,
					paddingTop: 4 * size,
					paddingBottom: 2 * size,
					width: '100%',
				}}
			>
				{[...Array(4)].map((_, i) => (
					<div
						key={i}
						style={{
							width: 13 * size,
							height: 4 * size,
							backgroundColor: '#FACC15',
							borderRadius: 1 * size,
						}}
					/>
				))}
			</div>

			{/* Main Channel Name */}
			<div
				style={{
					padding: `${3 * size}px ${6 * size}px`,
					textAlign: 'center',
					lineHeight: 1.05,
				}}
			>
				<div
					style={{
						color: '#FFFFFF',
						fontSize: 10 * size,
						fontWeight: 900,
						letterSpacing: 1.2 * size,
						fontFamily: 'system-ui, -apple-system, sans-serif',
					}}
				>
					THE
				</div>
				<div
					style={{
						color: '#FACC15',
						fontSize: 12 * size,
						fontWeight: 900,
						letterSpacing: 0.8 * size,
						fontFamily: 'system-ui, -apple-system, sans-serif',
					}}
				>
					CRICKET
				</div>
				<div
					style={{
						color: '#FFFFFF',
						fontSize: 13 * size,
						fontWeight: 900,
						letterSpacing: 1.8 * size,
						fontFamily: 'system-ui, -apple-system, sans-serif',
					}}
				>
					ROOM
				</div>
			</div>

			{/* Bottom Red Pill */}
			<div
				style={{
					width: '100%',
					backgroundColor: '#E11D48',
					color: '#FFFFFF',
					fontSize: 9 * size,
					fontWeight: 900,
					textAlign: 'center',
					padding: `${2 * size}px 0`,
					letterSpacing: 1.5 * size,
					fontFamily: 'system-ui, -apple-system, sans-serif',
				}}
			>
				TELUGU
			</div>
		</div>
	);
};

