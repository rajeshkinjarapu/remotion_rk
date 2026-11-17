import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { anekFont, montserratFont } from './fonts';

interface SubtitleBarProps {
	pillText: string;
	mainText: string;
	highlight?: string;
	themeColor?: string;
}

export const SubtitleBar: React.FC<SubtitleBarProps> = ({
	pillText,
	mainText,
	highlight,
	themeColor = '#FACC15',
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const anim = spring({
		frame,
		fps,
		config: { damping: 15, mass: 0.8 },
	});

	return (
		<div
			style={{
				position: 'absolute',
				bottom: 40,
				left: 60,
				right: 60,
				display: 'flex',
				justifyContent: 'center',
				zIndex: 90,
				transform: `translateY(${interpolate(anim, [0, 1], [30, 0])}px)`,
				opacity: anim,
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 18,
					background: 'rgba(15, 23, 42, 0.92)',
					backdropFilter: 'blur(16px)',
					border: '1.5px solid rgba(255, 255, 255, 0.15)',
					borderRadius: 50,
					padding: '12px 28px',
					boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 0, 0, 0.4)',
					maxWidth: '85%',
				}}
			>
				{/* Pill Badge */}
				<div
					style={{
						backgroundColor: themeColor,
						color: '#0F172A',
						fontFamily: montserratFont,
						fontWeight: 900,
						fontSize: 14,
						padding: '6px 16px',
						borderRadius: 30,
						letterSpacing: 1.5,
						whiteSpace: 'nowrap',
						boxShadow: `0 0 15px ${themeColor}60`,
					}}
				>
					{pillText}
				</div>

				{/* Main Text */}
				<div
					style={{
						fontFamily: anekFont,
						fontSize: 22,
						fontWeight: 700,
						color: '#F8FAFC',
						lineHeight: 1.3,
					}}
				>
					{mainText}{' '}
					{highlight && (
						<span
							style={{
								color: themeColor,
								fontWeight: 800,
								textDecoration: 'underline',
								textUnderlineOffset: '4px',
							}}
						>
							{highlight}
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

