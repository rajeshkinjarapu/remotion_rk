import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { anekFont, montserratFont, ramaFont } from './fonts';

interface HeaderBarProps {
	sceneNumber: string;
	title: string;
	subtitle?: string;
	tag?: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
	sceneNumber,
	title,
	subtitle,
	tag = 'IPL 2027 MEGA TRADE',
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const anim = spring({
		frame,
		fps,
		config: { damping: 15, mass: 0.9 },
	});

	return (
		<div
			style={{
				position: 'absolute',
				top: 36,
				right: 60,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'flex-end',
				zIndex: 90,
				transform: `translateY(${interpolate(anim, [0, 1], [-20, 0])}px)`,
				opacity: anim,
			}}
		>
			{/* Tag & Scene Badge */}
			<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
				<div
					style={{
						background: '#FACC15',
						color: '#0F172A',
						fontFamily: montserratFont,
						fontWeight: 900,
						fontSize: 12,
						padding: '4px 10px',
						borderRadius: 6,
						letterSpacing: 1.5,
					}}
				>
					{tag}
				</div>
				<div
					style={{
						background: 'rgba(255, 255, 255, 0.12)',
						backdropFilter: 'blur(8px)',
						color: '#E2E8F0',
						fontFamily: montserratFont,
						fontWeight: 700,
						fontSize: 12,
						padding: '4px 10px',
						borderRadius: 6,
						letterSpacing: 1,
					}}
				>
					{sceneNumber}
				</div>
			</div>

			{/* Main Telugu Title */}
			<h2
				style={{
					margin: 0,
					fontFamily: ramaFont,
					fontSize: 32,
					color: '#FFFFFF',
					textAlign: 'right',
					textShadow: '0 4px 15px rgba(0, 0, 0, 0.8)',
					lineHeight: 1.2,
				}}
			>
				{title}
			</h2>

			{/* Subtitle */}
			{subtitle && (
				<span
					style={{
						fontFamily: anekFont,
						fontWeight: 600,
						fontSize: 16,
						color: '#94A3B8',
						marginTop: 2,
					}}
				>
					{subtitle}
				</span>
			)}
		</div>
	);
};

