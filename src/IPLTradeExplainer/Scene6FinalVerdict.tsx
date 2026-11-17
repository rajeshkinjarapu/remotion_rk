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
import { StadiumBackground } from './Backgrounds';
import { BrandLogo } from './BrandLogo';
import { HeaderBar } from './HeaderBar';
import { SubtitleBar } from './SubtitleBar';
import { anekFont, montserratFont, ramaFont } from './fonts';

export const Scene6FinalVerdict: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Animations
	const verdictSpring = spring({
		frame: frame - 10,
		fps,
		config: { damping: 14, mass: 0.8 },
	});

	const voteBoxSpring = spring({
		frame: frame - 160,
		fps,
		config: { damping: 14, mass: 0.8 },
	});

	const subscribeSpring = spring({
		frame: frame - 400,
		fps,
		config: { damping: 12, mass: 0.7 },
	});

	// Pulsating subscribe button
	const pulse = Math.sin(frame / 8) * 0.05 + 1;

	// Animated score progress bars
	const miProgress = interpolate(frame, [30, 90], [0, 85], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const pbksProgress = interpolate(frame, [50, 110], [0, 80], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{ backgroundColor: '#070B14' }}>
			<StadiumBackground />

			<BrandLogo tag="FINAL VERDICT" />

			<HeaderBar
				sceneNumber="06 / 06"
				title="ఫైనల్ తీర్పు & సబ్స్‌క్రైబ్ చేయండి!"
				subtitle="Trade Rating: MI 8.5/10 (55% Edge) vs PBKS 8.0/10 (45% Edge)"
			/>

			{/* SECTION TITLE & BADGE */}
			<div
				style={{
					position: 'absolute',
					top: 135,
					left: 80,
					zIndex: 80,
					display: 'flex',
					alignItems: 'center',
					gap: 16,
				}}
			>
				<div
					style={{
						background: '#FACC15',
						color: '#0F172A',
						fontFamily: montserratFont,
						fontWeight: 900,
						fontSize: 14,
						padding: '6px 14px',
						borderRadius: 8,
						letterSpacing: 2,
					}}
				>
					EXPERT VERDICT
				</div>
				<h1
					style={{
						margin: 0,
						fontFamily: ramaFont,
						fontSize: 44,
						color: '#FFFFFF',
						textShadow: '0 4px 20px rgba(0,0,0,0.8)',
					}}
				>
					విన్-విన్ డీల్... కానీ ఎడ్జ్ ఎవరికి?
				</h1>
			</div>

			{/* TWO RATING CARDS (MI 8.5 vs PBKS 8.0) */}
			<div
				style={{
					position: 'absolute',
					top: 215,
					left: 80,
					right: 80,
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
					gap: 36,
					zIndex: 75,
					transform: `translateY(${interpolate(verdictSpring, [0, 1], [30, 0])}px)`,
					opacity: verdictSpring,
				}}
			>
				{/* MI SCORE CARD (55% EDGE) */}
				<div
					style={{
						background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
						borderRadius: 22,
						border: '2.5px solid #00A3E0',
						padding: '22px 28px',
						boxShadow: '0 20px 45px rgba(0, 75, 160, 0.5)',
						display: 'flex',
						flexDirection: 'column',
						gap: 14,
					}}
				>
					{/* Top Header */}
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
							<Img
								src={staticFile('cricket/mi_logo.png')}
								style={{ width: 44, height: 32, objectFit: 'contain' }}
							/>
							<div>
								<div
									style={{
										fontFamily: montserratFont,
										fontSize: 12,
										fontWeight: 900,
										color: '#38BDF8',
										letterSpacing: 2,
									}}
								>
									MUMBAI INDIANS
								</div>
								<h3
									style={{
										margin: 0,
										fontFamily: ramaFont,
										fontSize: 26,
										color: '#FFFFFF',
									}}
								>
									బౌలింగ్ డామినెన్స్
								</h3>
							</div>
						</div>

						{/* Score Pill */}
						<div
							style={{
								background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
								borderRadius: 14,
								padding: '8px 20px',
								textAlign: 'center',
								boxShadow: '0 0 20px rgba(56, 189, 248, 0.5)',
							}}
						>
							<div
								style={{
									fontFamily: montserratFont,
									fontSize: 32,
									fontWeight: 900,
									color: '#FFFFFF',
									lineHeight: 1,
								}}
							>
								8.5 <span style={{ fontSize: 16, color: '#E0F2FE' }}>/ 10</span>
							</div>
							<div
								style={{
									fontFamily: montserratFont,
									fontSize: 11,
									fontWeight: 800,
									color: '#F0F9FF',
									letterSpacing: 1.5,
								}}
							>
								55% WIN EDGE 🏆
							</div>
						</div>
					</div>

					{/* Score Bar */}
					<div
						style={{
							height: 10,
							background: 'rgba(255, 255, 255, 0.1)',
							borderRadius: 5,
							overflow: 'hidden',
						}}
					>
						<div
							style={{
								width: `${miProgress}%`,
								height: '100%',
								background: 'linear-gradient(90deg, #0284C7 0%, #38BDF8 100%)',
								borderRadius: 5,
							}}
						/>
					</div>

					<div
						style={{
							fontFamily: anekFont,
							fontSize: 15,
							color: '#CBD5E1',
							lineHeight: 1.4,
						}}
					>
						వాంఖడే లాంటి హై-స్కోరింగ్ పిచ్ పై బుమ్రాకు తోడుగా అర్ష్‌దీప్ సింగ్ లాంటి లెఫ్ట్-ఆర్మ్ క్వాలిటీ పేసర్ దొరకడం వల్ల ముంబైకి కొంచెం ఎక్కువ ఎడ్జ్ ఉంది.
					</div>
				</div>

				{/* PBKS SCORE CARD (45% EDGE) */}
				<div
					style={{
						background: 'linear-gradient(135deg, rgba(153, 27, 27, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
						borderRadius: 22,
						border: '2.5px solid #ED1B24',
						padding: '22px 28px',
						boxShadow: '0 20px 45px rgba(220, 38, 38, 0.5)',
						display: 'flex',
						flexDirection: 'column',
						gap: 14,
					}}
				>
					{/* Top Header */}
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
							<Img
								src={staticFile('cricket/pbks_logo.png')}
								style={{ width: 34, height: 42, objectFit: 'contain' }}
							/>
							<div>
								<div
									style={{
										fontFamily: montserratFont,
										fontSize: 12,
										fontWeight: 900,
										color: '#F87171',
										letterSpacing: 2,
									}}
								>
									PUNJAB KINGS
								</div>
								<h3
									style={{
										margin: 0,
										fontFamily: ramaFont,
										fontSize: 26,
										color: '#FFFFFF',
									}}
								>
									లీడర్‌షిప్ & ఫినిషింగ్
								</h3>
							</div>
						</div>

						{/* Score Pill */}
						<div
							style={{
								background: 'linear-gradient(135deg, #DC2626 0%, #F87171 100%)',
								borderRadius: 14,
								padding: '8px 20px',
								textAlign: 'center',
								boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
							}}
						>
							<div
								style={{
									fontFamily: montserratFont,
									fontSize: 32,
									fontWeight: 900,
									color: '#FFFFFF',
									lineHeight: 1,
								}}
							>
								8.0 <span style={{ fontSize: 16, color: '#FEE2E2' }}>/ 10</span>
							</div>
							<div
								style={{
									fontFamily: montserratFont,
									fontSize: 11,
									fontWeight: 800,
									color: '#FFF1F2',
									letterSpacing: 1.5,
								}}
							>
								45% WIN EDGE ⚔️
							</div>
						</div>
					</div>

					{/* Score Bar */}
					<div
						style={{
							height: 10,
							background: 'rgba(255, 255, 255, 0.1)',
							borderRadius: 5,
							overflow: 'hidden',
						}}
					>
						<div
							style={{
								width: `${pbksProgress}%`,
								height: '100%',
								background: 'linear-gradient(90deg, #DC2626 0%, #F87171 100%)',
								borderRadius: 5,
							}}
						/>
					</div>

					<div
						style={{
							fontFamily: anekFont,
							fontSize: 15,
							color: '#CBD5E1',
							lineHeight: 1.4,
						}}
					>
						పంజాబ్ కింగ్స్ కు ట్రోఫీ గెలిచే కెప్టెన్ మరియు అద్భుతమైన ఫినిషర్ దొరికినప్పటికీ, అర్ష్‌దీప్ లాంటి డెత్ బౌలర్ లేని లోటు కొంచెం రిస్క్ గా మారుతుంది.
					</div>
				</div>
			</div>

			{/* BOTTOM INTERACTIVE CARD: YOUTUBE COMMENT POLL & SUBSCRIBE CTA */}
			<div
				style={{
					position: 'absolute',
					top: 430,
					left: 80,
					right: 80,
					background: 'rgba(15, 23, 42, 0.95)',
					backdropFilter: 'blur(16px)',
					borderRadius: 22,
					border: '2px solid rgba(250, 204, 21, 0.3)',
					padding: '20px 32px',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					zIndex: 75,
					boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7)',
					transform: `translateY(${interpolate(voteBoxSpring, [0, 1], [40, 0])}px)`,
					opacity: voteBoxSpring,
				}}
			>
				{/* Poll question */}
				<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
						<span style={{ fontSize: 24 }}>💬</span>
						<span
							style={{
								fontFamily: ramaFont,
								fontSize: 26,
								color: '#FACC15',
							}}
						>
							మీ ఓటు ఎవరికి? కింద కామెంట్ సెక్షన్ లో చెప్పండి!
						</span>
					</div>
					<div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
						<div
							style={{
								background: 'rgba(0, 163, 224, 0.2)',
								border: '1.5px solid #00A3E0',
								borderRadius: 12,
								padding: '8px 20px',
								color: '#38BDF8',
								fontFamily: montserratFont,
								fontWeight: 800,
								fontSize: 15,
							}}
						>
							[A] MUMBAI INDIANS (MI) 🔵
						</div>
						<div
							style={{
								background: 'rgba(237, 27, 36, 0.2)',
								border: '1.5px solid #ED1B24',
								borderRadius: 12,
								padding: '8px 20px',
								color: '#F87171',
								fontFamily: montserratFont,
								fontWeight: 800,
								fontSize: 15,
							}}
						>
							[B] PUNJAB KINGS (PBKS) 🔴
						</div>
					</div>
				</div>

				{/* Animated Subscribe Button */}
				<div
					style={{
						transform: `scale(${interpolate(subscribeSpring, [0, 1], [0.8, 1]) * pulse})`,
						opacity: subscribeSpring,
					}}
				>
					<div
						style={{
							background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
							borderRadius: 18,
							padding: '16px 36px',
							border: '2px solid #FFFFFF',
							boxShadow: '0 0 35px rgba(220, 38, 38, 0.8), 0 10px 25px rgba(0,0,0,0.6)',
							display: 'flex',
							alignItems: 'center',
							gap: 14,
							cursor: 'pointer',
						}}
					>
						<span style={{ fontSize: 24 }}>🔔</span>
						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<span
								style={{
									fontFamily: montserratFont,
									fontSize: 20,
									fontWeight: 900,
									color: '#FFFFFF',
									letterSpacing: 2,
								}}
							>
								SUBSCRIBE NOW
							</span>
							<span
								style={{
									fontFamily: montserratFont,
									fontSize: 11,
									fontWeight: 800,
									color: '#FCA5A5',
									letterSpacing: 1.5,
								}}
							>
								RK CRICKET TELUGU
							</span>
						</div>
					</div>
				</div>
			</div>

			<SubtitleBar
				pillText="YOUR OPINION"
				mainText="హార్దిక్-అర్ష్‌దీప్ ట్రేడ్‌లో ఎవరు ఎక్కువ లాభపడ్డారు? మీ అభిప్రాయాన్ని"
				highlight="కింద కామెంట్ చేయండి & ఛానెల్‌ను సబ్స్‌క్రైబ్ చేసుకోండి!"
				themeColor="#FACC15"
			/>
		</AbsoluteFill>
	);
};

