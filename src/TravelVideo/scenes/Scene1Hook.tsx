import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {KineticText} from '../components/KineticText';

export const Scene1Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Calendar Flip Spring
	const calSpring = spring({
		frame: frame - 40,
		fps,
		config: {damping: 12, mass: 0.8},
	});

	// Grand Title Spring
	const titleSpring = spring({
		frame: frame - 600,
		fps,
		config: {damping: 13, mass: 0.85},
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#F8FAFC',
				color: '#0F172A',
				overflow: 'hidden',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>


			{/* Soft Studio Ambient Lighting */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: '50%',
					transform: 'translateX(-50%)',
					width: 1500,
					height: 600,
					background: 'radial-gradient(ellipse at 50% 0%, #EFF6FF 0%, rgba(255, 255, 255, 0) 80%)',
					pointerEvents: 'none',
				}}
			/>

			{/* Studio Dot Grid */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					backgroundImage: 'radial-gradient(#E2E8F0 1.5px, transparent 1.5px)',
					backgroundSize: '36px 36px',
					opacity: 0.7,
					pointerEvents: 'none',
				}}
			/>

			{/* ================= STAGE 1: THE APRIL FOOL HOOK (0 - 580 frames) ================= */}
			{frame < 580 && (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 36,
						zIndex: 10,
						padding: '0 80px',
						textAlign: 'center',
					}}
				>
					<KineticText
						tag="🚂 RAILWAY MYSTERY STORY"
						title="ఒకప్పుడు ప్యాసింజర్ గా ఉండి... ఏప్రిల్ 1న ఎక్స్‌ప్రెస్ గా మారిన రైలు!"
						highlightWord="ఏప్రిల్ 1న ఎక్స్‌ప్రెస్ గా"
						highlightColor="#2563EB"
						subtitle="ప్రయాణికులు అందర్నీ ఆశ్చర్యానికి గురిచేసిన ఒక అద్భుతమైన రైలు జర్నీ విశేషాలు"
						startFrame={15}
						fontSize={60}
					/>

					{/* 3D Calendar Card & Train Transformation Graphic */}
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 32,
							transform: `scale(${interpolate(calSpring, [0, 1], [0.8, 1])})`,
							opacity: interpolate(calSpring, [0, 1], [0, 1]),
						}}
					>
						{/* April 1 Calendar */}
						<div
							style={{
								width: 220,
								background: '#FFFFFF',
								borderRadius: 22,
								overflow: 'hidden',
								boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.12), 0 4px 12px rgba(15, 23, 42, 0.04)',
								border: '2px solid #E2E8F0',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
							}}
						>
							<div
								style={{
									width: '100%',
									background: '#DC2626',
									color: '#FFFFFF',
									fontSize: 18,
									fontWeight: 900,
									textAlign: 'center',
									padding: '8px 0',
									letterSpacing: '0.12em',
								}}
							>
								APRIL 1ST
							</div>
							<div
								style={{
									padding: '16px 0',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
								}}
							>
								<span style={{fontSize: 70, fontWeight: 900, color: '#0F172A', lineHeight: 1}}>
									01
								</span>
								<span style={{fontSize: 14, fontWeight: 800, color: '#DC2626', marginTop: 4}}>
									EXPRESS CONVERSION
								</span>
							</div>
						</div>

						{/* Transformation Arrow */}
						<div
							style={{
								fontSize: 40,
								color: '#2563EB',
								animation: 'pulse 1s infinite',
							}}
						>
							➔
						</div>

						{/* Old vs New Card */}
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: 12,
							}}
						>
							<div
								style={{
									background: '#FEF2F2',
									border: '1.5px solid #FCA5A5',
									borderRadius: 16,
									padding: '14px 24px',
									display: 'flex',
									alignItems: 'center',
									gap: 12,
								}}
							>
								<span style={{fontSize: 22}}>⏳</span>
								<span style={{fontSize: 20, fontWeight: 800, color: '#991B1B'}}>
									గతంలో: నిదానమైన ప్యాసింజర్ బండి
								</span>
							</div>

							<div
								style={{
									background: '#F0FDF4',
									border: '1.5px solid #86EFAC',
									borderRadius: 16,
									padding: '14px 24px',
									display: 'flex',
									alignItems: 'center',
									gap: 12,
									boxShadow: '0 4px 14px rgba(16, 185, 129, 0.12)',
								}}
							>
								<span style={{fontSize: 22}}>⚡</span>
								<span style={{fontSize: 22, fontWeight: 900, color: '#059669'}}>
									ఇప్పుడు: డైనమిక్ ఎక్స్‌ప్రెస్ సర్వీస్!
								</span>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* ================= STAGE 2: GRAND TITLE REVEAL (580 - 1200 frames) ================= */}
			{frame >= 580 && (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 28,
						zIndex: 10,
						padding: '0 80px',
						textAlign: 'center',
						transform: `translateY(${interpolate(titleSpring, [0, 1], [40, 0])}px) scale(${interpolate(
							titleSpring,
							[0, 1],
							[0.92, 1],
						)})`,
						opacity: interpolate(titleSpring, [0, 1], [0, 1]),
					}}
				>
					{/* Route Tag */}
					<div
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 12,
							background: '#EFF6FF',
							border: '2px solid #93C5FD',
							borderRadius: 999,
							padding: '8px 28px',
							boxShadow: '0 2px 10px rgba(37, 99, 235, 0.1)',
						}}
					>
						<span style={{fontSize: 22}}>🚆</span>
						<span style={{fontSize: 20, fontWeight: 900, color: '#1D4ED8', letterSpacing: '0.08em'}}>
							ANDHRA PRADESH ➔ ODISHA
						</span>
					</div>

					{/* Giant Radiant Telugu Title */}
					<h1
						style={{
							margin: 0,
							fontSize: 82,
							fontWeight: 900,
							color: '#0F172A',
							lineHeight: 1.15,
						}}
					>
						గుంటూరు - రాయగడ ఎక్స్‌ప్రెస్
					</h1>

					<span
						style={{
							fontSize: 34,
							fontWeight: 800,
							color: '#2563EB',
							letterSpacing: '0.04em',
						}}
					>
						GUNTUR RAYAGADA EXPRESS • TRAIN NO: 17243
					</span>

					{/* 3 Core Highlights Banner Grid */}
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(3, 1fr)',
							gap: 24,
							marginTop: 18,
							width: 1050,
						}}
					>
						<div
							style={{
								background: '#FFFFFF',
								border: '1.5px solid #E2E8F0',
								borderTop: '4px solid #2563EB',
								borderRadius: 20,
								padding: '20px 24px',
								display: 'flex',
								alignItems: 'center',
								gap: 16,
								boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.06)',
							}}
						>
							<span style={{fontSize: 40}}>🌅</span>
							<div style={{textAlign: 'left'}}>
								<div style={{fontSize: 14, fontWeight: 800, color: '#64748B'}}>ఉదయాన్నే దృశ్యాలు</div>
								<div style={{fontSize: 22, fontWeight: 900, color: '#0F172A', marginTop: 2}}>
									గోదావరి నది అందాలు
								</div>
							</div>
						</div>

						<div
							style={{
								background: '#FFFFFF',
								border: '1.5px solid #E2E8F0',
								borderTop: '4px solid #F59E0B',
								borderRadius: 20,
								padding: '20px 24px',
								display: 'flex',
								alignItems: 'center',
								gap: 16,
								boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.06)',
							}}
						>
							<span style={{fontSize: 40}}>🔄</span>
							<div style={{textAlign: 'left'}}>
								<div style={{fontSize: 14, fontWeight: 800, color: '#64748B'}}>వైజాగ్ జంక్షన్ వద్ద</div>
								<div style={{fontSize: 22, fontWeight: 900, color: '#0F172A', marginTop: 2}}>
									WAP-7 లోకో రివర్సల్
								</div>
							</div>
						</div>

						<div
							style={{
								background: '#FFFFFF',
								border: '1.5px solid #E2E8F0',
								borderTop: '4px solid #10B981',
								borderRadius: 20,
								padding: '20px 24px',
								display: 'flex',
								alignItems: 'center',
								gap: 16,
								boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.06)',
							}}
						>
							<span style={{fontSize: 40}}>⛰️</span>
							<div style={{textAlign: 'left'}}>
								<div style={{fontSize: 14, fontWeight: 800, color: '#64748B'}}>ఒడిశా సరిహద్దు</div>
								<div style={{fontSize: 22, fontWeight: 900, color: '#0F172A', marginTop: 2}}>
									తూర్పు కనుమల ప్రయాణం
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</AbsoluteFill>
	);
};
