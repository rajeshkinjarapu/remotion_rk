import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {KineticText} from '../components/KineticText';
import {SigmaBoardGraphic} from '../components/SigmaBoardGraphic';

export const Scene3Godavari: React.FC = () => {
	const frame = useCurrentFrame();

	const sunriseGlow = Math.sin(frame / 40) * 0.15 + 0.85;
	const overtakeShift = (frame * 12) % 2400 - 800;
	const cameraShake = frame >= 650 && frame <= 1200 ? Math.sin(frame * 1.8) * 3 : 0;

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
				transform: `translate(${cameraShake}px, ${cameraShake * 0.5}px)`,
			}}
		>


			{/* ================= PHASE 1: GODAVARI RIVER SUNRISE (0 - 650 frames) ================= */}
			{frame < 650 && (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 36,
						zIndex: 10,
					}}
				>
					<KineticText
						tag="🌅 తెల్లవారుజామున రాజమండ్రి"
						title="రైలు కిటికీలోంచి విశాలమైన గోదావరి నది అందాలు!"
						highlightWord="గోదావరి నది"
						highlightColor="#0284C7"
						subtitle="హాయిగా నిద్రలేచేసరికి నదిపై వంతెన దాటుతూ గోల్డెన్ సూర్యోదయాన్ని చూడడం ఒక మధురమైన అనుభూతి"
						startFrame={15}
						fontSize={56}
					/>

					{/* Godavari Bridge & Sunrise Graphic */}
					<div
						style={{
							position: 'relative',
							width: 1050,
							height: 380,
							background:
								'linear-gradient(180deg, #F0F9FF 0%, #FEF3C7 45%, #BAE6FD 75%, #0284C7 100%)',
							borderRadius: 24,
							border: '2px solid #E2E8F0',
							boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.03)',
							overflow: 'hidden',
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						{/* Radiant Rising Sun */}
						<div
							style={{
								position: 'absolute',
								top: 60,
								left: '50%',
								transform: 'translateX(-50%)',
								width: 130,
								height: 130,
								borderRadius: '50%',
								background: 'radial-gradient(circle, #FEF08A 20%, #F59E0B 80%)',
								boxShadow: '0 0 40px rgba(245, 158, 11, 0.6)',
								opacity: sunriseGlow,
							}}
						/>

						{/* Arch Bridge Silhouette */}
						<svg
							width="1100"
							height="180"
							style={{
								position: 'absolute',
								bottom: 70,
								left: 0,
								opacity: 0.9,
							}}
						>
							<path
								d="M 0 180 Q 90 60 180 180 M 180 180 Q 270 60 360 180 M 360 180 Q 450 60 540 180 M 540 180 Q 630 60 720 180 M 720 180 Q 810 60 900 180 M 900 180 Q 990 60 1080 180"
								fill="none"
								stroke="#1E293B"
								strokeWidth="8"
							/>
							<line x1="0" y1="180" x2="1100" y2="180" stroke="#1E293B" strokeWidth="12" />
						</svg>

						{/* River Water Waves Reflection */}
						<div
							style={{
								position: 'absolute',
								bottom: 0,
								left: 0,
								right: 0,
								height: 75,
								background: '#0284C7',
								borderTop: '2px solid #BAE6FD',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								fontSize: 16,
								fontWeight: 900,
								color: '#FFFFFF',
								letterSpacing: '0.15em',
							}}
						>
							🌊 THE MIGHTY GODAVARI RIVER (రాజమండ్రి రైల్-కమ్-రోడ్ బ్రిడ్జ్)
						</div>
					</div>
				</div>
			)}

			{/* ================= PHASE 2: HIGH SPEED OVERTAKES (650 - 1200 frames) ================= */}
			{frame >= 650 && frame < 1200 && (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 32,
						zIndex: 10,
					}}
				>
					<KineticText
						tag="⚡ HIGH-SPEED CORRIDOR"
						title="జెట్ స్పీడ్ తో దూసుకుపోయే బడాబడా ట్రైన్స్!"
						highlightWord="జెట్ స్పీడ్"
						highlightColor="#DC2626"
						subtitle="అన్నవరం, తుని మార్గంలో గరీబ్ రథ్, ఉదయ ఎక్స్‌ప్రెస్, హౌరా మెయిల్ మన బండిని ఓవర్‌టేక్ చేసే దృశ్యాలు!"
						startFrame={650}
						fontSize={56}
					/>

					{/* High Speed Train Crossing Track Visual */}
					<div
						style={{
							position: 'relative',
							width: 1050,
							height: 380,
							background: '#FFFFFF',
							borderRadius: 24,
							border: '2px solid #E2E8F0',
							borderTop: '5px solid #EF4444',
							boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.03)',
							overflow: 'hidden',
						}}
					>
						{/* Track lines background */}
						<div
							style={{
								position: 'absolute',
								inset: 0,
								backgroundImage:
									'repeating-linear-gradient(90deg, #F1F5F9 0px, #F1F5F9 40px, transparent 40px, transparent 120px)',
							}}
						/>

						{/* Track 1: Our Slow & Scenic Guntur Rayagada Train */}
						<div
							style={{
								position: 'absolute',
								top: 70,
								left: 40,
								display: 'flex',
								alignItems: 'center',
								gap: 16,
							}}
						>
							<div
								style={{
									background: '#EFF6FF',
									border: '1.5px solid #BFDBFE',
									borderRadius: 14,
									padding: '8px 18px',
									fontSize: 16,
									fontWeight: 900,
									color: '#1D4ED8',
								}}
							>
								🚆 17243 గుంటూరు రాయగడ ఎక్స్‌ప్రెస్ (Track 1)
							</div>
							<span style={{fontSize: 14, color: '#64748B', fontWeight: 700}}>Speed: 70 km/h</span>
						</div>

						{/* Track 2: The Fast Superfast Overtaker blasting past */}
						<div
							style={{
								position: 'absolute',
								bottom: 80,
								left: overtakeShift,
								display: 'flex',
								alignItems: 'center',
								gap: 12,
							}}
						>
							{/* Bullet Loco */}
							<div
								style={{
									background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
									border: '2px solid #FCA5A5',
									borderRadius: '8px 24px 24px 8px',
									padding: '16px 28px',
									color: '#FFFFFF',
									fontSize: 22,
									fontWeight: 900,
									display: 'flex',
									alignItems: 'center',
									gap: 10,
									boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
								}}
							>
								<span>⚡</span>
								<span>హౌరా మెయిల్ / గరీబ్ రథ్ (130 KM/H)</span>
							</div>
							{/* Trailing coaches */}
							{[1, 2, 3, 4].map((c) => (
								<div
									key={c}
									style={{
										background: '#047857',
										border: '1.5px solid #6EE7B7',
										borderRadius: 8,
										width: 90,
										height: 52,
										boxShadow: '0 2px 6px rgba(15, 23, 42, 0.1)',
									}}
								/>
							))}
						</div>

						{/* Bottom Notice */}
						<div
							style={{
								position: 'absolute',
								bottom: 16,
								left: 40,
								fontSize: 14,
								fontWeight: 800,
								color: '#475569',
								display: 'flex',
								alignItems: 'center',
								gap: 8,
							}}
						>
							<span>🔥</span>
							<span>విశాఖపట్నం - విజయవాడ హై-స్పీడ్ మెయిన్ లైన్ పై వేగవంతమైన క్రాసింగ్స్</span>
						</div>
					</div>
				</div>
			)}

			{/* ================= PHASE 3: THE SIGMA BOARD MYSTERY (1200 - 1800 frames) ================= */}
			{frame >= 1200 && (
				<div style={{zIndex: 10}}>
					<SigmaBoardGraphic />
				</div>
			)}
		</AbsoluteFill>
	);
};
