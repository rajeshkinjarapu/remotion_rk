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

export const Scene4MIAnalysis: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Animations
	const topBannerSpring = spring({
		frame: frame - 10,
		fps,
		config: { damping: 14, mass: 0.8 },
	});

	const prosSpring = spring({
		frame: frame - 60,
		fps,
		config: { damping: 14, mass: 0.8 },
	});

	const consSpring = spring({
		frame: frame - 120,
		fps,
		config: { damping: 14, mass: 0.8 },
	});

	return (
		<AbsoluteFill style={{ backgroundColor: '#070B14' }}>
			<StadiumBackground />

			<BrandLogo tag="TEAM IMPACT: MI" />

			<HeaderBar
				sceneNumber="04 / 06"
				title="ముంబై ఇండియన్స్ కు లాభమా? నష్టమా?"
				subtitle="Jasprit Bumrah + Arshdeep Singh Deadly Pace Combo & SKY Captaincy"
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
						background: '#00A3E0',
						color: '#070B14',
						fontFamily: montserratFont,
						fontWeight: 900,
						fontSize: 14,
						padding: '6px 14px',
						borderRadius: 8,
						letterSpacing: 2,
					}}
				>
					MUMBAI INDIANS ANALYSIS
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
					బుమ్రా + అర్ష్‌దీప్ డెడ్లీ కాంబో & ప్లస్-మైనస్‌లు!
				</h1>
			</div>

			{/* TOP FEATURED BANNER: BUMRAH + ARSHDEEP PACE ATTACK */}
			<div
				style={{
					position: 'absolute',
					top: 215,
					left: 80,
					right: 80,
					background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
					borderRadius: 22,
					border: '2.5px solid #00A3E0',
					padding: '20px 36px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					boxShadow: '0 20px 50px rgba(0, 75, 160, 0.5), 0 0 30px rgba(0, 163, 224, 0.3)',
					transform: `scale(${interpolate(topBannerSpring, [0, 1], [0.92, 1])})`,
					opacity: topBannerSpring,
					zIndex: 75,
				}}
			>
				{/* Left: Duo Photos */}
				<div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
					{/* Bumrah Photo */}
					<div style={{ position: 'relative' }}>
						<div
							style={{
								width: 100,
								height: 100,
								borderRadius: '50%',
								border: '3px solid #38BDF8',
								overflow: 'hidden',
								boxShadow: '0 0 20px rgba(56, 189, 248, 0.6)',
							}}
						>
							<Img
								src={staticFile('cricket/bumrah_avatar.png')}
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							/>
						</div>
						<div
							style={{
								position: 'absolute',
								bottom: -6,
								left: '50%',
								transform: 'translateX(-50%)',
								background: '#0284C7',
								color: '#FFFFFF',
								fontFamily: montserratFont,
								fontSize: 10,
								fontWeight: 900,
								padding: '2px 8px',
								borderRadius: 10,
								whiteSpace: 'nowrap',
							}}
						>
							BUMRAH
						</div>
					</div>

					{/* Plus Sign */}
					<div
						style={{
							fontFamily: montserratFont,
							fontSize: 36,
							fontWeight: 900,
							color: '#FACC15',
							textShadow: '0 0 15px rgba(250, 204, 21, 0.8)',
						}}
					>
						+
					</div>

					{/* Arshdeep Photo */}
					<div style={{ position: 'relative' }}>
						<div
							style={{
								width: 100,
								height: 100,
								borderRadius: '50%',
								border: '3px solid #F87171',
								overflow: 'hidden',
								boxShadow: '0 0 20px rgba(248, 113, 113, 0.6)',
							}}
						>
							<Img
								src={staticFile('cricket/arshdeep_avatar.png')}
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							/>
						</div>
						<div
							style={{
								position: 'absolute',
								bottom: -6,
								left: '50%',
								transform: 'translateX(-50%)',
								background: '#DC2626',
								color: '#FFFFFF',
								fontFamily: montserratFont,
								fontSize: 10,
								fontWeight: 900,
								padding: '2px 8px',
								borderRadius: 10,
								whiteSpace: 'nowrap',
							}}
						>
							ARSHDEEP
						</div>
					</div>

					{/* Label Info */}
					<div style={{ marginLeft: 16 }}>
						<div
							style={{
								fontFamily: montserratFont,
								fontSize: 12,
								fontWeight: 900,
								color: '#FACC15',
								letterSpacing: 2,
							}}
						>
							T20 WORLD CUP WINNING PAIR 🏆
						</div>
						<div
							style={{
								fontFamily: ramaFont,
								fontSize: 28,
								color: '#FFFFFF',
								marginTop: 2,
							}}
						>
							వాంఖడే స్టేడియం లో 8 ఓవర్ల డెత్ ప్యాక్!
						</div>
						<div
							style={{
								fontFamily: anekFont,
								fontSize: 15,
								color: '#94A3B8',
							}}
						>
							రైట్-ఆర్మ్ పేస్ (బుమ్రా) + లెఫ్ట్-ఆర్మ్ స్వింగ్ & యార్కర్లు (అర్ష్‌దీప్)
						</div>
					</div>
				</div>

				{/* Right: Lockdown Pill */}
				<div
					style={{
						background: 'rgba(250, 204, 21, 0.15)',
						border: '2px solid #FACC15',
						borderRadius: 16,
						padding: '12px 24px',
						textAlign: 'center',
					}}
				>
					<div
						style={{
							fontFamily: montserratFont,
							fontSize: 12,
							fontWeight: 900,
							color: '#FDE047',
							letterSpacing: 1.5,
						}}
					>
						LOCKDOWN EFFECT
					</div>
					<div
						style={{
							fontFamily: montserratFont,
							fontSize: 28,
							fontWeight: 900,
							color: '#FFFFFF',
							marginTop: 2,
						}}
					>
						8 OVERS LOCKED 🔒
					</div>
				</div>
			</div>

			{/* BOTTOM SPLIT: PROS ✅ VS CONS ⚠️ */}
			<div
				style={{
					position: 'absolute',
					top: 385,
					left: 80,
					right: 80,
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
					gap: 36,
					zIndex: 75,
				}}
			>
				{/* PROS CARD (GREEN THEME) */}
				<div
					style={{
						background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.4) 0%, rgba(15, 23, 42, 0.95) 100%)',
						borderRadius: 22,
						border: '2px solid #10B981',
						padding: '24px 28px',
						boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)',
						transform: `translateY(${interpolate(prosSpring, [0, 1], [40, 0])}px)`,
						opacity: prosSpring,
						display: 'flex',
						flexDirection: 'column',
						gap: 16,
					}}
				>
					{/* Card Title */}
					<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
						<div
							style={{
								background: '#10B981',
								width: 36,
								height: 36,
								borderRadius: 10,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 20,
								color: '#064E3B',
								fontWeight: 900,
							}}
						>
							✓
						</div>
						<h3
							style={{
								margin: 0,
								fontFamily: ramaFont,
								fontSize: 30,
								color: '#34D399',
							}}
						>
							ముంబైకి కలిగే లాభాలు (PROS)
						</h3>
					</div>

					{/* Pro 1 */}
					<div
						style={{
							background: 'rgba(255, 255, 255, 0.05)',
							borderRadius: 14,
							padding: '12px 18px',
							borderLeft: '4px solid #10B981',
						}}
					>
						<div
							style={{
								fontFamily: ramaFont,
								fontSize: 20,
								color: '#FFFFFF',
							}}
						>
							1. డెడ్లీ పేస్ జోడీ (బుమ్రా + అర్ష్‌దీప్):
						</div>
						<div
							style={{
								fontFamily: anekFont,
								fontSize: 15,
								color: '#CBD5E1',
								marginTop: 4,
							}}
						>
							పవర్‌ప్లేలో స్వింగ్, డెత్ ఓవర్లలో పిన్‌పాయింట్ యార్కర్లతో ప్రత్యర్థి బ్యాటర్లకు చుక్కలు చూపిస్తారు.
						</div>
					</div>

					{/* Pro 2 */}
					<div
						style={{
							background: 'rgba(255, 255, 255, 0.05)',
							borderRadius: 14,
							padding: '12px 18px',
							borderLeft: '4px solid #10B981',
						}}
					>
						<div
							style={{
								fontFamily: ramaFont,
								fontSize: 20,
								color: '#FFFFFF',
							}}
						>
							2. కెప్టెన్సీ వివాదాలకు ఫుల్‌స్టాప్:
						</div>
						<div
							style={{
								fontFamily: anekFont,
								fontSize: 15,
								color: '#CBD5E1',
								marginTop: 4,
							}}
						>
							సూర్యకుమార్ యాదవ్ ఇప్పుడు పూర్తి స్వేచ్ఛతో, డ్రెస్సింగ్ రూమ్ ప్రశాంతతతో జట్టును నడిపించగలడు.
						</div>
					</div>
				</div>

				{/* CONS CARD (RED THEME) */}
				<div
					style={{
						background: 'linear-gradient(135deg, rgba(127, 29, 29, 0.4) 0%, rgba(15, 23, 42, 0.95) 100%)',
						borderRadius: 22,
						border: '2px solid #EF4444',
						padding: '24px 28px',
						boxShadow: '0 20px 40px rgba(239, 68, 68, 0.2)',
						transform: `translateY(${interpolate(consSpring, [0, 1], [40, 0])}px)`,
						opacity: consSpring,
						display: 'flex',
						flexDirection: 'column',
						gap: 16,
					}}
				>
					{/* Card Title */}
					<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
						<div
							style={{
								background: '#EF4444',
								width: 36,
								height: 36,
								borderRadius: 10,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 20,
								color: '#FFFFFF',
								fontWeight: 900,
							}}
						>
							!
						</div>
						<h3
							style={{
								margin: 0,
								fontFamily: ramaFont,
								fontSize: 30,
								color: '#F87171',
							}}
						>
							ముంబైకి ఎదురయ్యే సవాళ్లు (CONS)
						</h3>
					</div>

					{/* Con 1 */}
					<div
						style={{
							background: 'rgba(255, 255, 255, 0.05)',
							borderRadius: 14,
							padding: '12px 18px',
							borderLeft: '4px solid #EF4444',
						}}
					>
						<div
							style={{
								fontFamily: ramaFont,
								fontSize: 20,
								color: '#FFFFFF',
							}}
						>
							1. ఇండియన్ పేస్ ఆల్-రౌండర్ లోటు:
						</div>
						<div
							style={{
								fontFamily: anekFont,
								fontSize: 15,
								color: '#CBD5E1',
								marginTop: 4,
							}}
						>
							హార్దిక్ పాండ్యా లాంటి క్వాలిటీ ఫాస్ట్ బౌలింగ్ ఆల్-రౌండర్ స్థానాన్ని భర్తీ చేయడం అత్యంత కష్టం.
						</div>
					</div>

					{/* Con 2 */}
					<div
						style={{
							background: 'rgba(255, 255, 255, 0.05)',
							borderRadius: 14,
							padding: '12px 18px',
							borderLeft: '4px solid #EF4444',
						}}
					>
						<div
							style={{
								fontFamily: ramaFont,
								fontSize: 20,
								color: '#FFFFFF',
							}}
						>
							2. డిసెంబర్ మినీ ఆక్షన్ పై ఆధారపడటం:
						</div>
						<div
							style={{
								fontFamily: anekFont,
								fontSize: 15,
								color: '#CBD5E1',
								marginTop: 4,
							}}
						>
							లోయర్-ఆర్డర్ లో భారీ సిక్సర్లు కొట్టే నాణ్యమైన ఫినిషర్ ను ఆక్షన్ లో తప్పనిసరిగా కొనుక్కోవాలి.
						</div>
					</div>
				</div>
			</div>

			<SubtitleBar
				pillText="MI ADVANTAGE"
				mainText="బుమ్రా + అర్ష్‌దీప్ డెడ్లీ కాంబోతో బౌలింగ్ పటిష్టం — సూర్యకుమార్ యాదవ్ కు"
				highlight="పూర్తి కెప్టెన్సీ స్వేచ్ఛ!"
				themeColor="#00A3E0"
			/>
		</AbsoluteFill>
	);
};

