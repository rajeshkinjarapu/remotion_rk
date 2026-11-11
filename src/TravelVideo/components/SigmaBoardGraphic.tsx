import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const SigmaBoardGraphic: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({
		frame,
		fps,
		config: {damping: 14, mass: 0.8},
	});

	// Fog animation
	const fogShift = Math.sin(frame / 30) * 40;

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 50,
				background: '#FFFFFF',
				border: '2px solid #E2E8F0',
				borderTop: '5px solid #F59E0B',
				borderRadius: 28,
				padding: '36px 48px',
				boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.03)',
				transform: `scale(${entrance})`,
				opacity: entrance,
				position: 'relative',
				overflow: 'hidden',
				maxWidth: 1100,
			}}
		>
			{/* Subtle ambient fog animation layer */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: fogShift - 50,
					right: -50,
					bottom: 0,
					background: 'radial-gradient(ellipse at 30% 50%, rgba(241, 245, 249, 0.8) 0%, transparent 70%)',
					pointerEvents: 'none',
				}}
			/>

			{/* Left: Physical Indian Railways Sigma Board Visual */}
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					position: 'relative',
					flexShrink: 0,
				}}
			>
				{/* Yellow Board */}
				<div
					style={{
						width: 170,
						height: 170,
						borderRadius: 24,
						background: 'linear-gradient(135deg, #FACC15 0%, #EAB308 100%)',
						border: '5px solid #000000',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
						transform: 'rotate(-5deg)',
					}}
				>
					{/* Greek Sigma Symbol (∑) */}
					<span
						style={{
							fontSize: 110,
							fontWeight: 900,
							color: '#000000',
							lineHeight: 1,
							fontFamily: 'serif',
						}}
					>
						∑
					</span>
				</div>
				{/* Metal Post */}
				<div
					style={{
						width: 18,
						height: 90,
						background: 'linear-gradient(90deg, #94A3B8, #CBD5E1, #64748B)',
						border: '2px solid #000000',
						borderTop: 'none',
					}}
				/>
				{/* Ground base */}
				<div
					style={{
						width: 90,
						height: 14,
						background: '#64748B',
						borderRadius: 6,
					}}
				/>
			</div>

			{/* Right: Technical Explanation */}
			<div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 12}}>
				<div
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: 10,
						background: '#FEF3C7',
						border: '1px solid #FDE68A',
						borderRadius: 999,
						padding: '4px 16px',
						alignSelf: 'flex-start',
					}}
				>
					<span style={{fontSize: 16}}>💡</span>
					<span style={{fontSize: 14, fontWeight: 900, color: '#92400E', letterSpacing: '0.08em'}}>
						INDIAN RAILWAYS TRIVIA
					</span>
				</div>

				<h2
					style={{
						margin: 0,
						fontSize: 36,
						fontWeight: 900,
						color: '#0F172A',
						lineHeight: 1.25,
					}}
				>
					ట్రాక్ పక్కన <span style={{color: '#D97706'}}>సిగ్మా (∑) బోర్డ్</span> రహస్యం!
				</h2>

				<p
					style={{
						margin: 0,
						fontSize: 22,
						fontWeight: 700,
						color: '#334155',
						lineHeight: 1.5,
					}}
				>
					చలికాలంలో దట్టమైన పొగమంచు (Dense Fog) ఉన్నప్పుడు, ట్రాక్ సిగ్నల్ ఎంత దూరంలో ఉందో లోకో పైలట్ ముందుగానే గుర్తించడానికి ఈ సిగ్మా బోర్డులు అత్యంత కీలకమైన హెచ్చరికగా పనిచేస్తాయి.
				</p>

				<div
					style={{
						display: 'flex',
						gap: 16,
						marginTop: 8,
					}}
				>
					<div
						style={{
							background: '#EFF6FF',
							border: '1px solid #BFDBFE',
							borderRadius: 12,
							padding: '8px 16px',
							display: 'flex',
							alignItems: 'center',
							gap: 8,
							fontSize: 15,
							fontWeight: 800,
							color: '#1D4ED8',
						}}
					>
						<span>🌫️</span> Fog Warning Indicator
					</div>
					<div
						style={{
							background: '#ECFDF5',
							border: '1px solid #A7F3D0',
							borderRadius: 12,
							padding: '8px 16px',
							display: 'flex',
							alignItems: 'center',
							gap: 8,
							fontSize: 15,
							fontWeight: 800,
							color: '#047857',
						}}
					>
						<span>🎯</span> Sighting Distance Assist
					</div>
				</div>
			</div>
		</div>
	);
};
