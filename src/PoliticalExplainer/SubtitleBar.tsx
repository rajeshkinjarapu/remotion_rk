import React from 'react';

export const SubtitleBar: React.FC<{
	text: string;
	highlight?: string;
}> = ({ text, highlight }) => {
	return (
		<div
			style={{
				position: 'absolute',
				bottom: 36,
				left: 0,
				right: 0,
				display: 'flex',
				justifyContent: 'center',
				zIndex: 60,
			}}
		>
			<div
				style={{
					backgroundColor: '#0A1220',
					border: '1.5px solid rgba(255, 255, 255, 0.12)',
					padding: '12px 28px',
					borderRadius: 14,
					boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
					display: 'flex',
					alignItems: 'center',
					gap: 14,
				}}
			>
				<span
					style={{
						color: '#FFFFFF',
						fontSize: 28,
						fontWeight: 800,
						fontFamily: '"Anek Telugu", "Noto Sans Telugu", sans-serif',
						letterSpacing: '0.3px',
					}}
				>
					{text}
				</span>

				{highlight && (
					<span
						style={{
							backgroundColor: '#FACC15',
							color: '#000000',
							fontSize: 30,
							fontWeight: 900,
							padding: '3px 14px',
							borderRadius: 8,
							boxShadow: '0 2px 8px rgba(250, 204, 21, 0.4)',
							fontFamily: '"Anek Telugu", "Noto Sans Telugu", sans-serif',
						}}
					>
						{highlight}
					</span>
				)}
			</div>
		</div>
	);
};

