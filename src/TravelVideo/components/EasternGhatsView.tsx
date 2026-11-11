import React from 'react';
import {useCurrentFrame} from 'remotion';

export const EasternGhatsView: React.FC = () => {
	const frame = useCurrentFrame();

	const bgMountainShift = Math.sin(frame / 60) * 15;
	const midMountainShift = Math.sin(frame / 45) * 25;
	const mistShift = (frame * 1.5) % 1200;
	const trainShift = (frame * 4) % 1400 - 200;

	return (
		<div
			style={{
				position: 'relative',
				width: 1100,
				height: 520,
				borderRadius: 28,
				overflow: 'hidden',
				border: '2px solid #E2E8F0',
				boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.03)',
				background: 'linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 40%, #DCFCE7 100%)',
			}}
		>
			{/* Bright Sun Glow */}
			<div
				style={{
					position: 'absolute',
					top: 20,
					right: 120,
					width: 100,
					height: 100,
					borderRadius: '50%',
					background: 'radial-gradient(circle, #FEF08A 20%, rgba(254, 240, 138, 0.3) 70%, transparent 100%)',
				}}
			/>

			{/* Background Mountain Peaks */}
			<svg
				width="1200"
				height="400"
				style={{
					position: 'absolute',
					bottom: 120,
					left: bgMountainShift - 50,
					opacity: 0.6,
				}}
			>
				<polygon points="0,400 150,140 320,400" fill="#A7F3D0" />
				<polygon points="250,400 450,90 650,400" fill="#6EE7B7" />
				<polygon points="580,400 780,110 980,400" fill="#A7F3D0" />
				<polygon points="900,400 1080,150 1250,400" fill="#6EE7B7" />
			</svg>

			{/* Floating Monsoon Mist / Clouds Layer 1 */}
			<div
				style={{
					position: 'absolute',
					bottom: 160,
					left: -mistShift,
					width: 2400,
					height: 100,
					backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.6) 0%, transparent 70%)',
					backgroundSize: '400px 100px',
					pointerEvents: 'none',
				}}
			/>

			{/* Foreground Lush Green Mountain Slopes */}
			<svg
				width="1200"
				height="350"
				style={{
					position: 'absolute',
					bottom: 60,
					left: midMountainShift - 50,
					opacity: 0.9,
				}}
			>
				<path
					d="M 0 350 Q 200 150 450 260 T 900 180 Q 1050 220 1200 350 Z"
					fill="#10B981"
				/>
				<polygon points="120,350 280,180 440,350" fill="#059669" opacity="0.8" />
				<polygon points="680,350 840,160 1020,350" fill="#047857" opacity="0.85" />
			</svg>

			{/* Floating Monsoon Mist Layer 2 */}
			<div
				style={{
					position: 'absolute',
					bottom: 80,
					left: mistShift * 0.8 - 600,
					width: 2400,
					height: 80,
					backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.5) 0%, transparent 70%)',
					backgroundSize: '500px 80px',
					pointerEvents: 'none',
				}}
			/>

			{/* Railway Track on Embankment */}
			<div
				style={{
					position: 'absolute',
					bottom: 35,
					left: 0,
					right: 0,
					height: 14,
					background: '#E2E8F0',
					borderTop: '2px solid #94A3B8',
					borderBottom: '2px solid #CBD5E1',
				}}
			>
				{/* Sleepers */}
				<div
					style={{
						position: 'absolute',
						inset: 0,
						backgroundImage: 'repeating-linear-gradient(90deg, #64748B 0px, #64748B 4px, transparent 4px, transparent 16px)',
					}}
				/>
			</div>

			{/* Animated Train Gliding along the Valley */}
			<div
				style={{
					position: 'absolute',
					bottom: 42,
					left: trainShift,
					display: 'flex',
					alignItems: 'center',
					gap: 4,
				}}
			>
				{/* WAP-7 Engine */}
				<div
					style={{
						background: 'linear-gradient(135deg, #FFFFFF, #EF4444)',
						borderRadius: '4px 10px 10px 4px',
						padding: '4px 10px',
						fontSize: 11,
						fontWeight: 900,
						color: '#000000',
						boxShadow: '0 2px 8px rgba(15, 23, 42, 0.2)',
						border: '1px solid #CBD5E1',
					}}
				>
					⚡ WAP-7
				</div>
				{/* Coaches */}
				{[1, 2, 3, 4, 5, 6].map((c) => (
					<div
						key={c}
						style={{
							background: '#1D4ED8',
							border: '1px solid #60A5FA',
							borderRadius: 3,
							width: 32,
							height: 16,
							boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
						}}
					/>
				))}
			</div>

			{/* Top Feature Tag */}
			<div
				style={{
					position: 'absolute',
					top: 24,
					left: 28,
					display: 'flex',
					alignItems: 'center',
					gap: 10,
					background: 'rgba(255, 255, 255, 0.92)',
					backdropFilter: 'blur(12px)',
					border: '1.5px solid #A7F3D0',
					borderRadius: 999,
					padding: '6px 20px',
					fontSize: 15,
					fontWeight: 800,
					color: '#047857',
					boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
				}}
			>
				<span>⛰️</span> తూర్పు కనుమల కొండలు & లోయల గుండా రైలు ప్రయాణం
			</div>
		</div>
	);
};
