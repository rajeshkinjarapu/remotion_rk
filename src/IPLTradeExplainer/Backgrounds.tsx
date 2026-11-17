import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';

interface BackgroundProps {
	variant?: 'stadium' | 'mi_blue' | 'pbks_red' | 'matrix';
}

export const StadiumBackground: React.FC<BackgroundProps> = ({
	variant = 'stadium',
}) => {
	const frame = useCurrentFrame();

	// Dynamic stadium lighting animation
	const lightAngle = Math.sin(frame / 60) * 15;
	const glowPulse = Math.sin(frame / 20) * 0.15 + 0.85;

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#070B14',
				overflow: 'hidden',
			}}
		>
			{/* Blurred Stadium Image Underlay */}
			<Img
				src={staticFile('cricket/IPL.jpg')}
				style={{
					position: 'absolute',
					width: '110%',
					height: '110%',
					top: '-5%',
					left: '-5%',
					objectFit: 'cover',
					filter: 'brightness(0.22) contrast(1.2) blur(4px)',
					transform: `scale(${1 + Math.sin(frame / 120) * 0.03})`,
				}}
			/>

			{/* Dual Team Glow Beams */}
			{/* Left Blue Glow (Mumbai Indians) */}
			<div
				style={{
					position: 'absolute',
					top: '-20%',
					left: '-10%',
					width: '60vw',
					height: '80vh',
					background:
						'radial-gradient(circle, rgba(0, 102, 204, 0.35) 0%, rgba(0, 50, 120, 0.1) 50%, transparent 75%)',
					filter: 'blur(50px)',
					opacity: glowPulse,
				}}
			/>

			{/* Right Red Glow (Punjab Kings) */}
			<div
				style={{
					position: 'absolute',
					top: '-20%',
					right: '-10%',
					width: '60vw',
					height: '80vh',
					background:
						'radial-gradient(circle, rgba(220, 38, 38, 0.32) 0%, rgba(150, 20, 20, 0.1) 50%, transparent 75%)',
					filter: 'blur(50px)',
					opacity: glowPulse,
				}}
			/>

			{/* Center Stadium Floodlight Beam */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: '50%',
					width: '80vw',
					height: '100vh',
					background:
						'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(250, 204, 21, 0.03) 40%, transparent 80%)',
					transform: `translateX(-50%) rotate(${lightAngle * 0.3}deg)`,
					transformOrigin: 'top center',
					pointerEvents: 'none',
				}}
			/>

			{/* Geometric Tech Grid Lines */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					backgroundImage: `
						linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
						linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
					`,
					backgroundSize: '80px 80px',
					maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 20%, transparent 75%)',
				}}
			/>

			{/* Vignette Overlay for cinematic focus */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					boxShadow: 'inset 0 0 160px rgba(0, 0, 0, 0.85)',
					pointerEvents: 'none',
				}}
			/>
		</AbsoluteFill>
	);
};

