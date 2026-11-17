import React from 'react';
import {
	AbsoluteFill,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import { Backgrounds, StadiumBackground } from './Backgrounds';
import { BrandLogo } from './BrandLogo';
import { HeaderBar } from './HeaderBar';
import { SubtitleBar } from './SubtitleBar';
import { anekFont, montserratFont, ramaFont } from './fonts';

export const Scene1Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Animations
	const bannerEnter = spring({
		frame,
		fps,
		config: { damping: 12, mass: 0.9 },
	});

	// Hardik slides from left
	const hardikSlide = spring({
		frame: frame - 15,
		fps,
		config: { damping: 14, mass: 0.9 },
	});

	// Arshdeep slides from right
	const arshdeepSlide = spring({
		frame: frame - 25,
		fps,
		config: { damping: 14, mass: 0.9 },
	});

	// ₹18 CRORE MEGA SWAP badge pops in
	const swapSpring = spring({
		frame: frame - 50,
		fps,
		config: { damping: 12, mass: 0.7 },
	});

	// Bottom Dilemma Cards (frames 450+)
	const dilemmaSpring = spring({
		frame: frame - 480,
		fps,
		config: { damping: 14, mass: 0.8 },
	});

	// Counter animation for ₹18 Crore (from 0 to 18)
	const countVal = Math.min(
		18,
		Math.floor(
			interpolate(frame, [60, 110], [0, 18], {
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			})
		)
	);

	// Electric spark lightning flash around frame 40-55 and 150-160
	const flash1 = frame >= 45 && frame <= 52 ? 0.35 : 0;
	const flash2 = frame >= 140 && frame <= 145 ? 0.25 : 0;
	const lightningGlow = flash1 + flash2;

	return (
		<AbsoluteFill style={{ backgroundColor: '#070B14' }}>
			<StadiumBackground />

			{/* Lightning White Flash Overlay */}
			{lightningGlow > 0 && (
				<div
					style={{
						position: 'absolute',
						inset: 0,
						backgroundColor: '#FFFFFF',
						opacity: lightningGlow,
						zIndex: 50,
						pointerEvents: 'none',
					}}
				/>
			)}

			<BrandLogo tag="BREAKING TRADE" />

			<HeaderBar
				sceneNumber="01 / 06"
				title="IPL 2027 మెగా ట్రేడ్ డీల్!"
				subtitle="Hardik Pandya ⇄ Arshdeep Singh Direct Swap"
			/>

			{/* TOP CENTER BREAKING BANNER */}
			<div
				style={{
					position: 'absolute',
					top: 140,
					left: '50%',
					transform: `translateX(-50%) scale(${interpolate(bannerEnter, [0, 1], [0.7, 1])})`,
					opacity: bannerEnter,
					zIndex: 80,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 8,
				}}
			>
				{/* Warning Strip */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						background: 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)',
						color: '#FFFFFF',
						padding: '8px 28px',
						borderRadius: 30,
						border: '2px solid rgba(255, 255, 255, 0.4)',
						boxShadow: '0 0 35px rgba(220, 38, 38, 0.7)',
					}}
				>
					<span style={{ fontSize: 18 }}>⚡</span>
					<span
						style={{
							fontFamily: montserratFont,
							fontWeight: 900,
							fontSize: 16,
							letterSpacing: 3,
						}}
					>
						OFFICIAL MEGA TRADE CONFIRMED
					</span>
					<span style={{ fontSize: 18 }}>⚡</span>
				</div>

				<h1
					style={{
						margin: 0,
						fontFamily: ramaFont,
						fontSize: 52,
						color: '#FACC15',
						textAlign: 'center',
						textShadow: '0 6px 30px rgba(0, 0, 0, 0.9), 0 0 40px rgba(250, 204, 21, 0.4)',
						lineHeight: 1.15,
						letterSpacing: 1,
					}}
				>
					క్రికెట్ ప్రపంచాన్ని షేక్ చేసిన అతిపెద్ద స్వాప్ డీల్!
				</h1>
			</div>

			{/* CENTRAL STAGE: HARDIK (LEFT) vs ARSHDEEP (RIGHT) */}
			<div
				style={{
					position: 'absolute',
					top: 270,
					left: 120,
					right: 120,
					bottom: 150,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					zIndex: 70,
				}}
			>
				{/* LEFT: HARDIK PANDYA (MI ➔ PBKS) */}
				<div
					style={{
						width: 480,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						transform: `translateX(${interpolate(hardikSlide, [0, 1], [-120, 0])}px) scale(${interpolate(hardikSlide, [0, 1], [0.85, 1])})`,
						opacity: hardikSlide,
					}}
				>
					{/* Portrait Card */}
					<div
						style={{
							position: 'relative',
							width: 320,
							height: 380,
							borderRadius: 24,
							overflow: 'hidden',
							background: 'linear-gradient(180deg, #1E3A8A 0%, #0F172A 100%)',
							border: '3px solid #00A3E0',
							boxShadow: '0 25px 50px rgba(0, 75, 160, 0.5), 0 0 30px rgba(0, 163, 224, 0.4)',
						}}
					>
						<Img
							src={staticFile('cricket/hardik_portrait.png')}
							style={{
								width: '100%',
								height: '100%',
								objectFit: 'cover',
								objectPosition: 'center 15%',
							}}
						/>

						{/* MI Team Badge top-right */}
						<div
							style={{
								position: 'absolute',
								top: 14,
								right: 14,
								background: 'rgba(15, 23, 42, 0.85)',
								backdropFilter: 'blur(8px)',
								padding: '4px 10px',
								borderRadius: 10,
								border: '1px solid #00A3E0',
								display: 'flex',
								alignItems: 'center',
								gap: 6,
							}}
						>
							<Img
								src={staticFile('cricket/mi_logo.png')}
								style={{ width: 28, height: 20, objectFit: 'contain' }}
							/>
							<span
								style={{
									fontFamily: montserratFont,
									fontSize: 13,
									fontWeight: 900,
									color: '#00A3E0',
								}}
							>
								MI
							</span>
						</div>

						{/* Bottom Transfer Ribbon */}
						<div
							style={{
								position: 'absolute',
								bottom: 0,
								left: 0,
								right: 0,
								background: 'linear-gradient(0deg, #0B0F19 0%, rgba(11, 15, 25, 0.8) 70%, transparent 100%)',
								padding: '30px 16px 14px',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
							}}
						>
							<span
								style={{
									fontFamily: montserratFont,
									fontSize: 12,
									fontWeight: 800,
									color: '#ED1B24',
									letterSpacing: 2,
								}}
							>
								TRADED TO PBKS ➔
							</span>
							<span
								style={{
									fontFamily: ramaFont,
									fontSize: 28,
									color: '#FFFFFF',
									textShadow: '0 2px 10px rgba(0,0,0,0.8)',
								}}
							>
								హార్దిక్ పాండ్యా
							</span>
						</div>
					</div>

					{/* Role pill */}
					<div
						style={{
							marginTop: 14,
							background: 'rgba(0, 163, 224, 0.15)',
							border: '1px solid #00A3E0',
							borderRadius: 20,
							padding: '6px 18px',
							color: '#38BDF8',
							fontFamily: anekFont,
							fontWeight: 700,
							fontSize: 16,
						}}
					>
						MI Captain ➔ Now Punjab Kings Finisher
					</div>
				</div>

				{/* CENTER: SWAP MECHANISM & ₹18 CRORE COUNTER */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						zIndex: 85,
						transform: `scale(${interpolate(swapSpring, [0, 1], [0.6, 1])})`,
						opacity: swapSpring,
					}}
				>
					{/* Animated Swap Circle */}
					<div
						style={{
							width: 100,
							height: 100,
							borderRadius: '50%',
							background: 'radial-gradient(circle, #FACC15 0%, #D97706 100%)',
							border: '4px solid #FFFFFF',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow: '0 0 40px rgba(250, 204, 21, 0.8)',
							transform: `rotate(${frame * 2}deg)`,
						}}
					>
						<span style={{ fontSize: 44, color: '#0F172A', fontWeight: 900 }}>⇄</span>
					</div>

					{/* ₹18 CRORE MEGA BOX */}
					<div
						style={{
							marginTop: 20,
							background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
							border: '3px solid #FACC15',
							borderRadius: 22,
							padding: '16px 36px',
							textAlign: 'center',
							boxShadow: '0 15px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(250, 204, 21, 0.3)',
						}}
					>
						<div
							style={{
								fontFamily: montserratFont,
								fontSize: 14,
								fontWeight: 900,
								color: '#94A3B8',
								letterSpacing: 3,
							}}
						>
							DIRECT PLAYER-FOR-PLAYER
						</div>
						<div
							style={{
								fontFamily: montserratFont,
								fontSize: 54,
								fontWeight: 900,
								color: '#FACC15',
								letterSpacing: 2,
								textShadow: '0 0 20px rgba(250, 204, 21, 0.6)',
							}}
						>
							₹{countVal} CRORE
						</div>
						<div
							style={{
								fontFamily: ramaFont,
								fontSize: 22,
								color: '#E2E8F0',
								marginTop: 2,
							}}
						>
							అతి భారీ స్వాప్ డీల్!
						</div>
					</div>
				</div>

				{/* RIGHT: ARSHDEEP SINGH (PBKS ➔ MI) */}
				<div
					style={{
						width: 480,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						transform: `translateX(${interpolate(arshdeepSlide, [0, 1], [120, 0])}px) scale(${interpolate(arshdeepSlide, [0, 1], [0.85, 1])})`,
						opacity: arshdeepSlide,
					}}
				>
					{/* Portrait Card */}
					<div
						style={{
							position: 'relative',
							width: 320,
							height: 380,
							borderRadius: 24,
							overflow: 'hidden',
							background: 'linear-gradient(180deg, #991B1B 0%, #0F172A 100%)',
							border: '3px solid #ED1B24',
							boxShadow: '0 25px 50px rgba(220, 38, 38, 0.5), 0 0 30px rgba(237, 27, 36, 0.4)',
						}}
					>
						<Img
							src={staticFile('cricket/arshdeep_portrait.png')}
							style={{
								width: '100%',
								height: '100%',
								objectFit: 'cover',
								objectPosition: 'center 10%',
							}}
						/>

						{/* PBKS Team Badge top-right */}
						<div
							style={{
								position: 'absolute',
								top: 14,
								right: 14,
								background: 'rgba(15, 23, 42, 0.85)',
								backdropFilter: 'blur(8px)',
								padding: '4px 10px',
								borderRadius: 10,
								border: '1px solid #ED1B24',
								display: 'flex',
								alignItems: 'center',
								gap: 6,
							}}
						>
							<Img
								src={staticFile('cricket/pbks_logo.png')}
								style={{ width: 22, height: 26, objectFit: 'contain' }}
							/>
							<span
								style={{
									fontFamily: montserratFont,
									fontSize: 13,
									fontWeight: 900,
									color: '#ED1B24',
								}}
							>
								PBKS
							</span>
						</div>

						{/* Bottom Transfer Ribbon */}
						<div
							style={{
								position: 'absolute',
								bottom: 0,
								left: 0,
								right: 0,
								background: 'linear-gradient(0deg, #0B0F19 0%, rgba(11, 15, 25, 0.8) 70%, transparent 100%)',
								padding: '30px 16px 14px',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
							}}
						>
							<span
								style={{
									fontFamily: montserratFont,
									fontSize: 12,
									fontWeight: 800,
									color: '#00A3E0',
									letterSpacing: 2,
								}}
							>
								TRADED TO MI ➔
							</span>
							<span
								style={{
									fontFamily: ramaFont,
									fontSize: 28,
									color: '#FFFFFF',
									textShadow: '0 2px 10px rgba(0,0,0,0.8)',
								}}
							>
								అర్ష్‌దీప్ సింగ్
							</span>
						</div>
					</div>

					{/* Role pill */}
					<div
						style={{
							marginTop: 14,
							background: 'rgba(237, 27, 36, 0.15)',
							border: '1px solid #ED1B24',
							borderRadius: 20,
							padding: '6px 18px',
							color: '#F87171',
							fontFamily: anekFont,
							fontWeight: 700,
							fontSize: 16,
						}}
					>
						PBKS Lead Bowler ➔ Now Mumbai Indians Pace King
					</div>
				</div>
			</div>

			{/* DILEMMA CARDS (Triggered during second half of scene when voiceover questions the deal) */}
			{frame > 460 && (
				<div
					style={{
						position: 'absolute',
						bottom: 125,
						left: '50%',
						transform: `translateX(-50%) translateY(${interpolate(dilemmaSpring, [0, 1], [30, 0])}px)`,
						opacity: dilemmaSpring,
						display: 'flex',
						gap: 30,
						zIndex: 85,
					}}
				>
					{/* Card 1 */}
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 12,
							background: 'rgba(15, 23, 42, 0.95)',
							border: '2px solid #00A3E0',
							borderRadius: 16,
							padding: '10px 24px',
							boxShadow: '0 10px 30px rgba(0, 75, 160, 0.5)',
						}}
					>
						<span style={{ fontSize: 24 }}>🎯</span>
						<span
							style={{
								fontFamily: ramaFont,
								fontSize: 22,
								color: '#FFFFFF',
							}}
						>
							ముంబై చేసిన మాస్టర్ స్ట్రోకా?
						</span>
					</div>

					{/* Card 2 */}
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 12,
							background: 'rgba(15, 23, 42, 0.95)',
							border: '2px solid #ED1B24',
							borderRadius: 16,
							padding: '10px 24px',
							boxShadow: '0 10px 30px rgba(220, 38, 38, 0.5)',
						}}
					>
						<span style={{ fontSize: 24 }}>⚠️</span>
						<span
							style={{
								fontFamily: ramaFont,
								fontSize: 22,
								color: '#FFFFFF',
							}}
						>
							లేక పంజాబ్ కింగ్స్ చేసిన బిగ్ రిస్కా?
						</span>
					</div>
				</div>
			)}

			<SubtitleBar
				pillText="BREAKING NEWS"
				mainText="హార్దిక్ పాండ్యా ⇄ అర్ష్‌దీప్ సింగ్ ₹18 కోట్ల స్వాప్ డీల్ అధికారికం!"
				highlight="పూర్తి లెక్కల విశ్లేషణ!"
				themeColor="#FACC15"
			/>
		</AbsoluteFill>
	);
};

