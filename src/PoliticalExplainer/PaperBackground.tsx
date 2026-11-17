import React from 'react';
import { AbsoluteFill } from 'remotion';

export const PaperBackground: React.FC<{ watermark?: string }> = ({
	watermark = '@thepoliticalroom_',
}) => {
	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#F6F3EC',
				backgroundImage: `
					radial-gradient(circle at 50% 50%, rgba(255,255,255,0.7) 0%, rgba(235, 230, 218, 0.95) 100%),
					linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
					linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
				`,
				backgroundSize: '100% 100%, 36px 36px, 36px 36px',
				overflow: 'hidden',
			}}
		>
			{/* Vintage Vignette */}
			<AbsoluteFill
				style={{
					boxShadow: 'inset 0 0 120px rgba(70, 50, 20, 0.15)',
					pointerEvents: 'none',
				}}
			/>

			{/* Faint Center Channel Watermark */}
			<div
				style={{
					position: 'absolute',
					top: '48%',
					left: '50%',
					transform: 'translate(-50%, -50%) rotate(-12deg)',
					fontSize: 64,
					fontWeight: 900,
					letterSpacing: '12px',
					color: 'rgba(0, 0, 0, 0.035)',
					textTransform: 'uppercase',
					userSelect: 'none',
					whiteSpace: 'nowrap',
					fontFamily: 'system-ui, -apple-system, sans-serif',
				}}
			>
				{watermark}
			</div>
		</AbsoluteFill>
	);
};

