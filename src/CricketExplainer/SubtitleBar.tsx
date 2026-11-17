import React from 'react';
import { anekFont } from './fonts';

export const SubtitleBar: React.FC<{
	text: string;
	highlight?: string;
}> = ({ text, highlight }) => {
	return (
		<div
			style={{
				position: 'absolute',
				bottom: 34,
				left: 0,
				right: 0,
				display: 'flex',
				justifyContent: 'center',
				zIndex: 60,
			}}
		>
			<div
				style={{
					backgroundColor: '#07101E',
					border: '1.5px solid rgba(255, 255, 255, 0.15)',
					padding: '12px 30px',
					borderRadius: 14,
					boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
					display: 'flex',
					alignItems: 'center',
					gap: 16,
				}}
			>
				<span
					style={{
						color: '#FFFFFF',
						fontSize: 28,
						fontWeight: 800,
						fontFamily: anekFont,
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
							padding: '4px 16px',
							borderRadius: 8,
							boxShadow: '0 2px 10px rgba(250, 204, 21, 0.4)',
							fontFamily: anekFont,
						}}
					>
						{highlight}
					</span>
				)}
			</div>
		</div>
	);
};

