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

export const Scene5PBKSAnalysis: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Animations
	const topBannerSpring = spring({
		frame: frame - 10,
		fps,
		config: { damping: 14, mass: 0.8 },
	});

	const prosSpring = spring({
		frame: frame - 50,
		fps,
		config: { damping: 14, mass: 0.8 },
	});

	const consSpring = spring({
		frame: frame - 110,
		fps,
		config: { damping: 14, mass: 0.8 },
	});

	return (
		<AbsoluteFill style={{ backgroundColor: '#070B14' }}>
			<StadiumBackground />

			<BrandLogo tag="TEAM IMPACT: PBKS" />

			<HeaderBar
				sceneNumber="05 / 06"
				title="పంజాబ్ కింగ్స్ కు లాభమా? నష్టమా?"
				subtitle="Hardik Pandya 3-in-1 Captaincy & Finisher vs Losing 111-Wicket Arshdeep"
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
						background: '#ED1B24',
						color: '#FFFFFF',
						fontFamily: montserratFont,
						fontWeight: 900,
						fontSize: 14,
						padding: '6px 14px',
						borderRadius: 8,
						letterSpacing: 2,
					}}
				>
					PUNJAB KINGS ANALYSIS
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
					ఒకే దెబ్బకు 3 సమస్యలు తీరాయి... కానీ బిగ్ రిస్క్!
				</h1>
			</div>

			{/* TOP BANNER: HARDIK PANDYA PBKS CAPTAINCY GRAPHIC */}
			<div
				style={{
					position: 'absolute',
					top: 215,
					left: 80,
					right: 80,
					background: 'linear-gradient(135deg, rgba(153, 27, 27, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
					borderRadius: 22,
					border: '2.5px solid #ED1B24',
					padding: '18px 36px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					boxShadow: '0 20px 50px rgba(220, 38, 38, 0.5), 0 0 30px rgba(237, 27, 36, 0.3)',
					transform: `scale(${interpolate(topBannerSpring, [0, 1], [0.92, 1])})`,
					opacity: topBannerSpring,
					zIndex: 75,
				}}
			>
				{/* Left: Hardik Avatar & PBKS Logo */}
				<div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
					<div style={{ position: 'relative' }}>
						<div
							style={{
								width: 100,
								height: 100,
								borderRadius: '50%',
								border: '3px solid #FACC15',
								overflow: 'hidden',
								boxShadow: '0 0 25px rgba(250, 204, 21, 0.7)',
							}}
						>
							<Img
								src={staticFile('cricket/hardik_avatar.png')}
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							/>
						</div>
						{/* Captain Armband Badge */}
						<div
							style={{
								position: 'absolute',
								bottom: -6,
								left: '50%',
								transform: 'translateX(-50%)',
								background: '#FACC15',
								color: '#0F172A',
								fontFamily: montserratFont,
								fontSize: 10,
								fontWeight: 900,
								padding: '2px 8px',
								borderRadius: 10,
								whiteSpace: 'nowrap',
							}}
						>
							CAPTAIN (C)
						</div>
					</div>

					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<div
							style={{
								fontFamily: montserratFont,
								fontSize: 12,
								fontWeight: 900,
								color: '#FACC15',
								letterSpacing: 2,
							}}
						>
							PBKS NEW LEADER & MARQUEE ICON 👑
						</div>
						<div
							style={{
								fontFamily: ramaFont,
								fontSize: 30,
								color: '#FFFFFF',
								marginTop: 2,
							}}
						>
							పంజాబ్ కింగ్స్ కు ప్రూవెన్ ఇండియన్ కెప్టెన్!
						</div>
						<div
							style={{
								fontFamily: anekFont,
								fontSize: 15,
								color: '#FECACA',
							}}
						>
							ఆల్-రౌండర్ స్థిరత్వం + భారీ బ్రాండ్ వ్యాల్యూ + మ్యాచ్ ఫినిషింగ్ సామర్థ్యం
						</div>
					</div>
				</div>

				{/* Right: PBKS Logo & 3-in-1 Badge */}
				<div
					style={{
						background: 'rgba(255, 255, 255, 0.08)',
						border: '1.5px solid rgba(255, 255, 255, 0.2)',
						borderRadius: 16,
						padding: '12px 24px',
						display: 'flex',
						alignItems: 'center',
						gap: 16,
					}}
				>
					<Img
						src={staticFile('cricket/pbks_logo.png')}
						style={{ width: 42, height: 50, objectFit: 'contain' }}
					/>
					<div style={{ textAlign: 'right' }}>
						<div
							style={{
								fontFamily: montserratFont,
								fontSize: 11,
								fontWeight: 900,
								color: '#F87171',
								letterSpacing: 1.5,
							}}
						>
							PERFECT FIX
						</div>
						<div
							style={{
								fontFamily: montserratFont,
								fontSize: 24,
								fontWeight: 900,
								color: '#FFFFFF',
							}}
						>
							3-IN-1 IMPACT
						</div>
					</div>
				</div>
			</div>

			{/* BOTTOM SPLIT: 3 PROS (LEFT) vs BIGGEST RISK CON (RIGHT) */}
			<div
				style={{
					position: 'absolute',
					top: 385,
					left: 80,
					right: 80,
					display: 'grid',
					gridTemplateColumns: '1.2fr 0.8fr',
					gap: 36,
					zIndex: 75,
				}}
			>
				{/* 3 WINS CARD (GREEN THEME) */}
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
						gap: 12,
					}}
				>
					{/* Title */}
					<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
						<div
							style={{
								background: '#10B981',
								width: 34,
								height: 34,
								borderRadius: 10,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 18,
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
								fontSize: 28,
								color: '#34D399',
							}}
						>
							ఒకే దెబ్బకు తీరిన 3 అతిపెద్ద సమస్యలు!
						</h3>
					</div>

					{/* Point 1 */}
					<div
						style={{
							background: 'rgba(255, 255, 255, 0.05)',
							borderRadius: 12,
							padding: '10px 16px',
							borderLeft: '4px solid #10B981',
						}}
					>
						<span style={{ fontFamily: ramaFont, fontSize: 18, color: '#FACC15' }}>
							1. ట్రోఫీ గెలిచిన లీడర్‌షిప్:{' '}
						</span>
						<span style={{ fontFamily: anekFont, fontSize: 15, color: '#E2E8F0' }}>
							గుజరాత్ టైటాన్స్ ను మొదటి సీజన్ లోనే ఛాంపియన్ గా నిలిపిన సక్సెస్ ఫుల్ కెప్టెన్.
						</span>
					</div>

					{/* Point 2 */}
					<div
						style={{
							background: 'rgba(255, 255, 255, 0.05)',
							borderRadius: 12,
							padding: '10px 16px',
							borderLeft: '4px solid #10B981',
						}}
					>
						<span style={{ fontFamily: ramaFont, fontSize: 18, color: '#FACC15' }}>
							2. పవర్-హిట్టింగ్ ఫినిషర్:{' '}
						</span>
						<span style={{ fontFamily: anekFont, fontSize: 15, color: '#E2E8F0' }}>
							మిడిల్ & డెత్ ఓవర్లలో 146+ స్ట్రైక్ రేట్ తో మ్యాచ్ లను ఒంటిచేత్తో గెలిపించే వీరుడు.
						</span>
					</div>

					{/* Point 3 */}
					<div
						style={{
							background: 'rgba(255, 255, 255, 0.05)',
							borderRadius: 12,
							padding: '10px 16px',
							borderLeft: '4px solid #10B981',
						}}
					>
						<span style={{ fontFamily: ramaFont, fontSize: 18, color: '#FACC15' }}>
							3. 3-4 ఓవర్లు వేసే ఇండియన్ పేసర్:{' '}
						</span>
						<span style={{ fontFamily: anekFont, fontSize: 15, color: '#E2E8F0' }}>
							టీమ్ కాంబినేషన్ లో విలువైన బౌలింగ్ ఆప్షన్ అందించే ఆల్-రౌండర్.
						</span>
					</div>
				</div>

				{/* THE BIG RISK CARD (RED THEME) */}
				<div
					style={{
						background: 'linear-gradient(135deg, rgba(127, 29, 29, 0.5) 0%, rgba(15, 23, 42, 0.95) 100%)',
						borderRadius: 22,
						border: '2px solid #EF4444',
						padding: '24px 28px',
						boxShadow: '0 20px 40px rgba(239, 68, 68, 0.3)',
						transform: `translateY(${interpolate(consSpring, [0, 1], [40, 0])}px)`,
						opacity: consSpring,
						display: 'flex',
						flexDirection: 'column',
						gap: 16,
					}}
				>
					{/* Title */}
					<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
						<div
							style={{
								background: '#EF4444',
								width: 34,
								height: 34,
								borderRadius: 10,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 18,
								color: '#FFFFFF',
								fontWeight: 900,
							}}
						>
							⚠️
						</div>
						<h3
							style={{
								margin: 0,
								fontFamily: ramaFont,
								fontSize: 28,
								color: '#F87171',
							}}
						>
							పంజాబ్ చేసిన బిగ్గెస్ట్ రిస్క్!
						</h3>
					</div>

					{/* Risk Details */}
					<div
						style={{
							background: 'rgba(255, 255, 255, 0.05)',
							borderRadius: 14,
							padding: '14px 18px',
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
							అర్ష్‌దీప్ సింగ్ (111 వికెట్లు) దూరం!
						</div>
						<div
							style={{
								fontFamily: anekFont,
								fontSize: 15,
								color: '#FECACA',
								marginTop: 6,
								lineHeight: 1.4,
							}}
						>
							గత 8 ఏళ్లుగా పంజాబ్ బౌలింగ్ భారాన్ని మోసిన స్టార్ పేసర్ లేడు. ముల్లన్‌పూర్ హోమ్ గ్రౌండ్‌లో డెత్ ఓవర్లలో అర్ష్‌దీప్ లోటు స్పష్టంగా కనిపిస్తుంది.
						</div>
					</div>

					<div
						style={{
							background: 'rgba(239, 68, 68, 0.15)',
							borderRadius: 12,
							padding: '10px 16px',
							border: '1px dashed #EF4444',
						}}
					>
						<span
							style={{
								fontFamily: anekFont,
								fontSize: 14,
								color: '#FCA5A5',
								fontWeight: 700,
							}}
						>
							💡 మినీ ఆక్షన్ లో పంజాబ్ ఒక క్వాలిటీ డెత్ ఓవర్ బౌలర్ కోసం భారీగా ఖర్చు పెట్టక తప్పదు!
						</span>
					</div>
				</div>
			</div>

			<SubtitleBar
				pillText="PBKS RISK"
				mainText="హార్దిక్ రాకతో కెప్టెన్సీ & ఫినిషింగ్ బలం వచ్చినా — 8 ఏళ్ల బౌలింగ్ పిల్లర్"
				highlight="అర్ష్‌దీప్‌ను వదులుకోవడం అతిపెద్ద గ్యాంబుల్!"
				themeColor="#ED1B24"
			/>
		</AbsoluteFill>
	);
};

