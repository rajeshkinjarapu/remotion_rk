import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { montserratFont, ramaFont } from './fonts';

interface BrandLogoProps {
	tag?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
	tag = 'SPECIAL REPORT',
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const enter = spring({
		frame,
		fps,
		config: { damping: 14, mass: 0.8 },
	});

	const pulse = Math.sin(frame / 10) * 0.2 + 0.8;

	return (
		<div
			style={{
				position: 'absolute',
				top: 40,
				left: 60,
				display: 'flex',
				alignItems: 'center',
				gap: 16,
				zIndex: 100,
				transform: `scale(${interpolate(enter, [0, 1], [0.85, 1])}) translateY(${interpolate(enter, [0, 1], [-20, 0])}px)`,
				opacity: enter,
			}}
		>
			{/* Brand Box */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
					border: '2px solid rgba(250, 204, 21, 0.4)',
					borderRadius: 14,
					padding: '8px 20px',
					boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
					gap: 12,
				}}
			>
				{/* Cricket Ball Icon */}
				<div
					style={{
						width: 32,
						height: 32,
						borderRadius: '50%',
						background: 'radial-gradient(circle at 35% 35%, #EF4444 0%, #991B1B 80%)',
						border: '2px solid #FFFFFF',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 16,
						boxShadow: '0 0 12px rgba(239, 68, 68, 0.6)',
					}}
				>
					🏏
				</div>

				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<span
						style={{
							fontFamily: montserratFont,
							fontSize: 20,
							fontWeight: 900,
							letterSpacing: 2,
							color: '#FFFFFF',
							lineHeight: 1.1,
						}}
					>
						RK CRICKET <span style={{ color: '#FACC15' }}>TELUGU</span>
					</span>
					<span
						style={{
							fontFamily: ramaFont,
							fontSize: 12,
							color: '#94A3B8',
							letterSpacing: 1,
						}}
					>
						విశ్లేషణాత్మక క్రికెట్ వార్తలు
					</span>
				</div>
			</div>

			{/* Status pill */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 8,
					background: 'rgba(239, 68, 68, 0.15)',
					border: '1px solid rgba(239, 68, 68, 0.4)',
					padding: '6px 14px',
					borderRadius: 20,
				}}
			>
				<div
					style={{
						width: 10,
						height: 10,
						borderRadius: '50%',
						backgroundColor: '#EF4444',
						opacity: pulse,
						boxShadow: '0 0 10px #EF4444',
					}}
				/>
				<span
					style={{
						fontFamily: montserratFont,
						fontSize: 12,
						fontWeight: 800,
						color: '#FCA5A5',
						letterSpacing: 1.5,
					}}
				>
					{tag}
				</span>
			</div>
		</div>
	);
};

