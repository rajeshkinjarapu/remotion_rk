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

export const Scene2PurseCalculation: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Animations
	const card1Spring = spring({
		frame: frame - 10,
		fps,
		config: { damping: 14, mass: 0.8 },
	});

	const card2Spring = spring({
		frame: frame - 25,
		fps,
		config: { damping: 14, mass: 0.8 },
	});

	const hikeSpring = spring({
		frame: frame - 55,
		fps,
		config: { damping: 12, mass: 0.6 },
	});

	const bottomImpactSpring = spring({
		frame: frame - 140,
		fps,
		config: { damping: 14, mass: 0.85 },
	});

	// Animated bar widths
	const miBarProgress = interpolate(frame, [160, 220], [0, 100], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const pbksBarProgress = interpolate(frame, [180, 240], [0, 100], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{ backgroundColor: '#070B14' }}>
			<StadiumBackground />

			<BrandLogo tag="PURSE & CONTRACTS" />

			<HeaderBar
				sceneNumber="02 / 06"
				title="ట్రేడ్ లెక్కలు & పర్స్ బ్యాలెన్స్"
				subtitle="Hardik Fee Hike vs Mumbai Indians Extra Purse Spend"
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
						background: '#10B981',
						color: '#064E3B',
						fontFamily: montserratFont,
						fontWeight: 900,
						fontSize: 14,
						padding: '6px 14px',
						borderRadius: 8,
						letterSpacing: 2,
					}}
				>
					FINANCIAL BREAKDOWN
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
					కాంట్రాక్ట్ & పర్స్ లెక్కల అసలు గుట్టు!
				</h1>
			</div>

			{/* TWO-COLUMN CONTRACT CARDS */}
			<div
				style={{
					position: 'absolute',
					top: 215,
					left: 80,
					right: 80,
					display: 'flex',
					gap: 40,
					zIndex: 75,
				}}
			>
				{/* LEFT CARD: HARDIK PANDYA (+₹1.65 CR HIKE) */}
				<div
					style={{
						flex: 1,
						background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
						borderRadius: 24,
						border: '2px solid rgba(0, 163, 224, 0.4)',
						padding: '24px 30px',
						boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6)',
						transform: `translateY(${interpolate(card1Spring, [0, 1], [40, 0])}px)`,
						opacity: card1Spring,
						display: 'flex',
						flexDirection: 'column',
						gap: 16,
					}}
				>
					{/* Header with Avatar */}
					<div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
						<div
							style={{
								width: 85,
								height: 85,
								borderRadius: '50%',
								border: '3px solid #00A3E0',
								overflow: 'hidden',
								boxShadow: '0 0 20px rgba(0, 163, 224, 0.5)',
							}}
						>
							<Img
								src={staticFile('cricket/hardik_avatar.png')}
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							/>
						</div>

						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<span
								style={{
									fontFamily: montserratFont,
									fontSize: 12,
									fontWeight: 800,
									color: '#38BDF8',
									letterSpacing: 2,
								}}
							>
								MUMBAI INDIANS ➔ PUNJAB KINGS
							</span>
							<h3
								style={{
									margin: 0,
									fontFamily: ramaFont,
									fontSize: 34,
									color: '#FFFFFF',
									lineHeight: 1.15,
								}}
							>
								హార్దిక్ పాండ్యా
							</h3>
						</div>
					</div>

					{/* Numbers Matrix */}
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: 16,
							marginTop: 6,
						}}
					>
						{/* Old Fee */}
						<div
							style={{
								background: 'rgba(255, 255, 255, 0.05)',
								borderRadius: 16,
								padding: '14px 18px',
								border: '1px solid rgba(255, 255, 255, 0.1)',
							}}
						>
							<div
								style={{
									fontFamily: montserratFont,
									fontSize: 12,
									fontWeight: 700,
									color: '#94A3B8',
									letterSpacing: 1.5,
								}}
							>
								MI 2026 FEE
							</div>
							<div
								style={{
									fontFamily: montserratFont,
									fontSize: 32,
									fontWeight: 900,
									color: '#E2E8F0',
									marginTop: 4,
								}}
							>
								₹16.35 Cr
							</div>
							<div style={{ fontFamily: anekFont, fontSize: 13, color: '#64748B' }}>
								పాత కాంట్రాక్ట్ మొత్తం
							</div>
						</div>

						{/* New Fee */}
						<div
							style={{
								background: 'rgba(245, 158, 11, 0.1)',
								borderRadius: 16,
								padding: '14px 18px',
								border: '1.5px solid #F59E0B',
							}}
						>
							<div
								style={{
									fontFamily: montserratFont,
									fontSize: 12,
									fontWeight: 700,
									color: '#FBBF24',
									letterSpacing: 1.5,
								}}
							>
								PBKS 2027 FEE
							</div>
							<div
								style={{
									fontFamily: montserratFont,
									fontSize: 32,
									fontWeight: 900,
									color: '#FACC15',
									marginTop: 4,
								}}
							>
								₹18.00 Cr
							</div>
							<div style={{ fontFamily: anekFont, fontSize: 13, color: '#FCD34D' }}>
								కొత్త కాంట్రాక్ట్ మొత్తం
							</div>
						</div>
					</div>

					{/* Big Hike Badge */}
					<div
						style={{
							background: 'linear-gradient(90deg, #059669 0%, #10B981 100%)',
							borderRadius: 16,
							padding: '12px 20px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
							transform: `scale(${interpolate(hikeSpring, [0, 1], [0.8, 1])})`,
							opacity: hikeSpring,
						}}
					>
						<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
							<span style={{ fontSize: 24 }}>🚀</span>
							<span
								style={{
									fontFamily: ramaFont,
									fontSize: 22,
									color: '#FFFFFF',
								}}
							>
								హార్దిక్ ఫీజు హైక్:
							</span>
						</div>
						<div
							style={{
								fontFamily: montserratFont,
								fontSize: 26,
								fontWeight: 900,
								color: '#FFFFFF',
								letterSpacing: 1,
							}}
						>
							+₹1.65 కోట్లు (+10.1%)
						</div>
					</div>
				</div>

				{/* RIGHT CARD: ARSHDEEP SINGH (SAME ₹18 CR FEE) */}
				<div
					style={{
						flex: 1,
						background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
						borderRadius: 24,
						border: '2px solid rgba(237, 27, 36, 0.4)',
						padding: '24px 30px',
						boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6)',
						transform: `translateY(${interpolate(card2Spring, [0, 1], [40, 0])}px)`,
						opacity: card2Spring,
						display: 'flex',
						flexDirection: 'column',
						gap: 16,
					}}
				>
					{/* Header with Avatar */}
					<div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
						<div
							style={{
								width: 85,
								height: 85,
								borderRadius: '50%',
								border: '3px solid #ED1B24',
								overflow: 'hidden',
								boxShadow: '0 0 20px rgba(237, 27, 36, 0.5)',
							}}
						>
							<Img
								src={staticFile('cricket/arshdeep_avatar.png')}
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							/>
						</div>

						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<span
								style={{
									fontFamily: montserratFont,
									fontSize: 12,
									fontWeight: 800,
									color: '#F87171',
									letterSpacing: 2,
								}}
							>
								PUNJAB KINGS ➔ MUMBAI INDIANS
							</span>
							<h3
								style={{
									margin: 0,
									fontFamily: ramaFont,
									fontSize: 34,
									color: '#FFFFFF',
									lineHeight: 1.15,
								}}
							>
								అర్ష్‌దీప్ సింగ్
							</h3>
						</div>
					</div>

					{/* Numbers Matrix */}
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: 16,
							marginTop: 6,
						}}
					>
						{/* Old Fee */}
						<div
							style={{
								background: 'rgba(255, 255, 255, 0.05)',
								borderRadius: 16,
								padding: '14px 18px',
								border: '1px solid rgba(255, 255, 255, 0.1)',
							}}
						>
							<div
								style={{
									fontFamily: montserratFont,
									fontSize: 12,
									fontWeight: 700,
									color: '#94A3B8',
									letterSpacing: 1.5,
								}}
							>
								PBKS 2026 FEE
							</div>
							<div
								style={{
									fontFamily: montserratFont,
									fontSize: 32,
									fontWeight: 900,
									color: '#E2E8F0',
									marginTop: 4,
								}}
							>
								₹18.00 Cr
							</div>
							<div style={{ fontFamily: anekFont, fontSize: 13, color: '#64748B' }}>
								పంజాబ్ కాంట్రాక్ట్
							</div>
						</div>

						{/* New Fee */}
						<div
							style={{
								background: 'rgba(0, 163, 224, 0.1)',
								borderRadius: 16,
								padding: '14px 18px',
								border: '1.5px solid #00A3E0',
							}}
						>
							<div
								style={{
									fontFamily: montserratFont,
									fontSize: 12,
									fontWeight: 700,
									color: '#38BDF8',
									letterSpacing: 1.5,
								}}
							>
								MI 2027 FEE
							</div>
							<div
								style={{
									fontFamily: montserratFont,
									fontSize: 32,
									fontWeight: 900,
									color: '#38BDF8',
									marginTop: 4,
								}}
							>
								₹18.00 Cr
							</div>
							<div style={{ fontFamily: anekFont, fontSize: 13, color: '#7DD3FC' }}>
								అదే ఫీజుతో ముంబైకి
							</div>
						</div>
					</div>

					{/* Same Fee Status Badge */}
					<div
						style={{
							background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)',
							borderRadius: 16,
							padding: '12px 20px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)',
						}}
					>
						<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
							<span style={{ fontSize: 24 }}>⚖️</span>
							<span
								style={{
									fontFamily: ramaFont,
									fontSize: 22,
									color: '#FFFFFF',
								}}
							>
								కాంట్రాక్ట్ మార్పు:
							</span>
						</div>
						<div
							style={{
								fontFamily: montserratFont,
								fontSize: 24,
								fontWeight: 900,
								color: '#FFFFFF',
								letterSpacing: 1,
							}}
						>
							NO CHANGE (SAME ₹18 CR)
						</div>
					</div>
				</div>
			</div>

			{/* BOTTOM IMPACT: MUMBAI EXTRA PURSE INVESTMENT */}
			<div
				style={{
					position: 'absolute',
					top: 575,
					left: 80,
					right: 80,
					background: 'rgba(15, 23, 42, 0.95)',
					backdropFilter: 'blur(16px)',
					borderRadius: 20,
					border: '2px solid rgba(250, 204, 21, 0.3)',
					padding: '20px 32px',
					zIndex: 75,
					transform: `translateY(${interpolate(bottomImpactSpring, [0, 1], [30, 0])}px)`,
					opacity: bottomImpactSpring,
					boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
				}}
			>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					{/* Title & Takeaway */}
					<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
							<span
								style={{
									background: '#EF4444',
									color: '#FFFFFF',
									fontFamily: montserratFont,
									fontSize: 11,
									fontWeight: 900,
									padding: '3px 8px',
									borderRadius: 4,
								}}
							>
								PURSE IMPACT
							</span>
							<span
								style={{
									fontFamily: ramaFont,
									fontSize: 24,
									color: '#FACC15',
								}}
							>
								ముంబై ఇండియన్స్ అదనంగా ₹1.65 కోట్లు పర్స్ నుంచి ఖర్చు పెట్టింది!
							</span>
						</div>
						<div
							style={{
								fontFamily: anekFont,
								fontSize: 16,
								color: '#CBD5E1',
								fontWeight: 600,
							}}
						>
							దీన్ని బట్టే అర్ష్‌దీప్ సింగ్ కోసం ముంబై మేనేజ్‌మెంట్ ఎంత తీవ్రంగా ప్రయత్నించిందో స్పష్టమవుతోంది!
						</div>
					</div>

					{/* Extra Spend Tag */}
					<div
						style={{
							background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
							padding: '12px 24px',
							borderRadius: 14,
							border: '2px solid #F87171',
							textAlign: 'center',
						}}
					>
						<div
							style={{
								fontFamily: montserratFont,
								fontSize: 11,
								fontWeight: 800,
								color: '#FECACA',
								letterSpacing: 1.5,
							}}
						>
							MI PURSE DEDUCTION
						</div>
						<div
							style={{
								fontFamily: montserratFont,
								fontSize: 30,
								fontWeight: 900,
								color: '#FFFFFF',
							}}
						>
							+₹1.65 CRORE
						</div>
					</div>
				</div>

				{/* Progress Visual Bar */}
				<div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
					{/* MI Bar */}
					<div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
						<span
							style={{
								width: 140,
								fontFamily: montserratFont,
								fontSize: 13,
								fontWeight: 800,
								color: '#38BDF8',
							}}
						>
							MI PURSE DRAIN
						</span>
						<div
							style={{
								flex: 1,
								height: 12,
								background: 'rgba(255,255,255,0.1)',
								borderRadius: 6,
								overflow: 'hidden',
							}}
						>
							<div
								style={{
									width: `${miBarProgress}%`,
									height: '100%',
									background: 'linear-gradient(90deg, #0284C7 0%, #38BDF8 100%)',
									borderRadius: 6,
								}}
							/>
						</div>
						<span
							style={{
								fontFamily: montserratFont,
								fontSize: 13,
								fontWeight: 900,
								color: '#38BDF8',
							}}
						>
							-₹1.65 Cr Added
						</span>
					</div>

					{/* PBKS Bar */}
					<div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
						<span
							style={{
								width: 140,
								fontFamily: montserratFont,
								fontSize: 13,
								fontWeight: 800,
								color: '#34D399',
							}}
						>
							PBKS PURSE GAIN
						</span>
						<div
							style={{
								flex: 1,
								height: 12,
								background: 'rgba(255,255,255,0.1)',
								borderRadius: 6,
								overflow: 'hidden',
							}}
						>
							<div
								style={{
									width: `${pbksBarProgress}%`,
									height: '100%',
									background: 'linear-gradient(90deg, #059669 0%, #34D399 100%)',
									borderRadius: 6,
								}}
							/>
						</div>
						<span
							style={{
								fontFamily: montserratFont,
								fontSize: 13,
								fontWeight: 900,
								color: '#34D399',
							}}
						>
							+₹1.65 Cr Saved
						</span>
					</div>
				</div>
			</div>

			<SubtitleBar
				pillText="PURSE ANALYSIS"
				mainText="హార్దిక్ ఫీజు ₹16.35 కోట్ల నుంచి ₹18 కోట్లకు జంప్ — ముంబై అదనంగా"
				highlight="₹1.65 కోట్లు చెల్లించి అర్ష్‌దీప్‌ను తెచ్చుకుంది!"
				themeColor="#10B981"
			/>
		</AbsoluteFill>
	);
};

