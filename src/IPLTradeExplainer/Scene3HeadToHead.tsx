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

export const Scene3HeadToHead: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Animations for entries
	const leftColSpring = spring({
		frame: frame - 10,
		fps,
		config: { damping: 14, mass: 0.8 },
	});

	const rightColSpring = spring({
		frame: frame - 25,
		fps,
		config: { damping: 14, mass: 0.8 },
	});

	// Time-based phase highlights:
	// Phase 1 (0 - 450): General Career & Matches
	// Phase 2 (450 - 950): Hardik Batting & 5 Titles
	// Phase 3 (950 - 1450): Arshdeep 111 Wickets & PBKS Record
	// Phase 4 (1450 - 1859): Recent Form 2025-2026 & Death Bowling
	const isPhase1 = frame < 450;
	const isPhase2 = frame >= 450 && frame < 950;
	const isPhase3 = frame >= 950 && frame < 1450;
	const isPhase4 = frame >= 1450;

	return (
		<AbsoluteFill style={{ backgroundColor: '#070B14' }}>
			<StadiumBackground />

			<BrandLogo tag="HEAD-TO-HEAD MATRIX" />

			<HeaderBar
				sceneNumber="03 / 06"
				title="IPL కెరీర్ గణాంకాల పోలిక"
				subtitle="Hardik Pandya (All-Rounder) vs Arshdeep Singh (Pace Bowler)"
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
						background: '#3B82F6',
						color: '#FFFFFF',
						fontFamily: montserratFont,
						fontWeight: 900,
						fontSize: 14,
						padding: '6px 14px',
						borderRadius: 8,
						letterSpacing: 2,
					}}
				>
					STATISTICAL BREAKDOWN
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
					ఇద్దరి కెరీర్ రికార్డులు & రీసెంట్ ఫామ్!
				</h1>
			</div>

			{/* MAIN 3-COLUMN MATRIX LAYOUT */}
			<div
				style={{
					position: 'absolute',
					top: 210,
					left: 70,
					right: 70,
					display: 'grid',
					gridTemplateColumns: '320px 1fr 320px',
					gap: 24,
					alignItems: 'stretch',
					zIndex: 75,
				}}
			>
				{/* LEFT COLUMN: HARDIK PANDYA PROFILE */}
				<div
					style={{
						background: 'linear-gradient(180deg, rgba(30, 58, 138, 0.7) 0%, rgba(15, 23, 42, 0.95) 100%)',
						borderRadius: 24,
						border: isPhase2 ? '3px solid #FACC15' : '2px solid rgba(0, 163, 224, 0.5)',
						padding: '24px 20px',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						boxShadow: isPhase2
							? '0 0 40px rgba(250, 204, 21, 0.4), 0 20px 40px rgba(0, 0, 0, 0.8)'
							: '0 20px 40px rgba(0, 0, 0, 0.6)',
						transform: `translateX(${interpolate(leftColSpring, [0, 1], [-40, 0])}px)`,
						opacity: leftColSpring,
						transition: 'border 0.3s ease, box-shadow 0.3s ease',
					}}
				>
					{/* Avatar */}
					<div
						style={{
							width: 130,
							height: 130,
							borderRadius: '50%',
							border: '4px solid #00A3E0',
							overflow: 'hidden',
							boxShadow: '0 0 25px rgba(0, 163, 224, 0.6)',
						}}
					>
						<Img
							src={staticFile('cricket/hardik_avatar.png')}
							style={{ width: '100%', height: '100%', objectFit: 'cover' }}
						/>
					</div>

					<h3
						style={{
							margin: '14px 0 2px 0',
							fontFamily: ramaFont,
							fontSize: 32,
							color: '#FFFFFF',
							textAlign: 'center',
						}}
					>
						హార్దిక్ పాండ్యా
					</h3>

					<span
						style={{
							fontFamily: montserratFont,
							fontSize: 13,
							fontWeight: 800,
							color: '#38BDF8',
							letterSpacing: 2,
						}}
					>
						PACE ALL-ROUNDER
					</span>

					{/* Trophy & Experience Badges */}
					<div
						style={{
							marginTop: 18,
							width: '100%',
							background: 'rgba(250, 204, 21, 0.12)',
							border: '1px solid rgba(250, 204, 21, 0.35)',
							borderRadius: 14,
							padding: '12px 14px',
							textAlign: 'center',
						}}
					>
						<div
							style={{
								fontFamily: montserratFont,
								fontSize: 12,
								fontWeight: 900,
								color: '#FACC15',
								letterSpacing: 1.5,
							}}
						>
							🏆 5x IPL TROPHIES
						</div>
						<div
							style={{
								fontFamily: anekFont,
								fontSize: 13,
								color: '#E2E8F0',
								marginTop: 4,
							}}
						>
							4 with MI (2015,17,19,20) + 1 with GT (2022)
						</div>
					</div>

					{/* Batting Prowess Highlight Card */}
					<div
						style={{
							marginTop: 12,
							width: '100%',
							background: 'rgba(0, 163, 224, 0.1)',
							border: '1px solid rgba(0, 163, 224, 0.3)',
							borderRadius: 14,
							padding: '12px 14px',
							textAlign: 'center',
						}}
					>
						<div
							style={{
								fontFamily: montserratFont,
								fontSize: 12,
								fontWeight: 800,
								color: '#38BDF8',
							}}
						>
							DEATH FINISHER
						</div>
						<div
							style={{
								fontFamily: ramaFont,
								fontSize: 18,
								color: '#FFFFFF',
								marginTop: 2,
							}}
						>
							146.28 కెరీర్ స్ట్రైక్ రేట్!
						</div>
					</div>
				</div>

				{/* CENTER: COMPARISON MATRIX ROWS */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 14,
						justifyContent: 'center',
					}}
				>
					{/* ROW 1: MATCHES */}
					<div
						style={{
							background: isPhase1
								? 'linear-gradient(90deg, rgba(30, 58, 138, 0.5) 0%, rgba(15, 23, 42, 0.9) 50%, rgba(153, 27, 27, 0.5) 100%)'
								: 'rgba(15, 23, 42, 0.85)',
							border: isPhase1 ? '2px solid #FACC15' : '1px solid rgba(255, 255, 255, 0.1)',
							borderRadius: 16,
							padding: '12px 24px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							boxShadow: isPhase1 ? '0 0 25px rgba(250, 204, 21, 0.3)' : 'none',
						}}
					>
						<div style={{ textAlign: 'left', width: 90 }}>
							<span
								style={{
									fontFamily: montserratFont,
									fontSize: 34,
									fontWeight: 900,
									color: '#38BDF8',
								}}
							>
								162
							</span>
							<div style={{ fontFamily: anekFont, fontSize: 12, color: '#94A3B8' }}>మ్యాచ్‌లు</div>
						</div>

						<div style={{ textAlign: 'center' }}>
							<div
								style={{
									fontFamily: montserratFont,
									fontSize: 12,
									fontWeight: 900,
									color: isPhase1 ? '#FACC15' : '#94A3B8',
									letterSpacing: 2,
								}}
							>
								IPL MATCHES PLAYED
							</div>
							<div style={{ fontFamily: ramaFont, fontSize: 16, color: '#CBD5E1' }}>
								అనుభవం & ప్రదర్శన
							</div>
						</div>

						<div style={{ textAlign: 'right', width: 90 }}>
							<span
								style={{
									fontFamily: montserratFont,
									fontSize: 34,
									fontWeight: 900,
									color: '#F87171',
								}}
							>
								96
							</span>
							<div style={{ fontFamily: anekFont, fontSize: 12, color: '#94A3B8' }}>మ్యాచ్‌లు</div>
						</div>
					</div>

					{/* ROW 2: BATTING STATS */}
					<div
						style={{
							background: isPhase2
								? 'linear-gradient(90deg, rgba(30, 58, 138, 0.7) 0%, rgba(15, 23, 42, 0.95) 100%)'
								: 'rgba(15, 23, 42, 0.85)',
							border: isPhase2 ? '2.5px solid #FACC15' : '1px solid rgba(255, 255, 255, 0.1)',
							borderRadius: 16,
							padding: '12px 24px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							boxShadow: isPhase2 ? '0 0 30px rgba(250, 204, 21, 0.4)' : 'none',
						}}
					>
						<div style={{ textAlign: 'left', width: 140 }}>
							<div
								style={{
									fontFamily: montserratFont,
									fontSize: 30,
									fontWeight: 900,
									color: '#38BDF8',
								}}
							>
								2,955
							</div>
							<div style={{ fontFamily: anekFont, fontSize: 13, color: '#CBD5E1' }}>
								146.28 SR • 10 50s
							</div>
						</div>

						<div style={{ textAlign: 'center' }}>
							<div
								style={{
									fontFamily: montserratFont,
									fontSize: 12,
									fontWeight: 900,
									color: isPhase2 ? '#FACC15' : '#94A3B8',
									letterSpacing: 2,
								}}
							>
								CAREER RUNS & STRIKE RATE
							</div>
							<div style={{ fontFamily: ramaFont, fontSize: 16, color: '#FACC15' }}>
								హార్దిక్ స్పష్టమైన ఆధిపత్యం
							</div>
						</div>

						<div style={{ textAlign: 'right', width: 140 }}>
							<div
								style={{
									fontFamily: montserratFont,
									fontSize: 22,
									fontWeight: 800,
									color: '#94A3B8',
								}}
							>
								Tailender
							</div>
							<div style={{ fontFamily: anekFont, fontSize: 13, color: '#64748B' }}>
								నంబర్ 10 / 11 బ్యాటర్
							</div>
						</div>
					</div>

					{/* ROW 3: WICKETS TAKEN */}
					<div
						style={{
							background: isPhase3
								? 'linear-gradient(90deg, rgba(15, 23, 42, 0.95) 0%, rgba(153, 27, 27, 0.7) 100%)'
								: 'rgba(15, 23, 42, 0.85)',
							border: isPhase3 ? '2.5px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.1)',
							borderRadius: 16,
							padding: '12px 24px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							boxShadow: isPhase3 ? '0 0 30px rgba(239, 68, 68, 0.4)' : 'none',
						}}
					>
						<div style={{ textAlign: 'left', width: 130 }}>
							<div
								style={{
									fontFamily: montserratFont,
									fontSize: 32,
									fontWeight: 900,
									color: '#94A3B8',
								}}
							>
								82 Wkts
							</div>
							<div style={{ fontFamily: anekFont, fontSize: 13, color: '#64748B' }}>
								ఆల్-రౌండర్ కోటా
							</div>
						</div>

						<div style={{ textAlign: 'center' }}>
							<div
								style={{
									fontFamily: montserratFont,
									fontSize: 12,
									fontWeight: 900,
									color: isPhase3 ? '#EF4444' : '#94A3B8',
									letterSpacing: 2,
								}}
							>
								IPL CAREER WICKETS
							</div>
							<div style={{ fontFamily: ramaFont, fontSize: 16, color: '#F87171' }}>
								పంజాబ్ ఆల్-టైమ్ #1 వికెట్ టేకర్!
							</div>
						</div>

						<div style={{ textAlign: 'right', width: 130 }}>
							<div
								style={{
									fontFamily: montserratFont,
									fontSize: 34,
									fontWeight: 900,
									color: '#F87171',
								}}
							>
								111 Wkts
							</div>
							<div style={{ fontFamily: anekFont, fontSize: 13, color: '#FCA5A5' }}>
								9.19 ఎకానమీ
							</div>
						</div>
					</div>

					{/* ROW 4: RECENT FORM (IPL 2025 & 2026) */}
					<div
						style={{
							background: isPhase4
								? 'linear-gradient(90deg, rgba(30, 41, 59, 0.95) 0%, rgba(153, 27, 27, 0.6) 100%)'
								: 'rgba(15, 23, 42, 0.85)',
							border: isPhase4 ? '2.5px solid #10B981' : '1px solid rgba(255, 255, 255, 0.1)',
							borderRadius: 16,
							padding: '12px 24px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							boxShadow: isPhase4 ? '0 0 30px rgba(16, 185, 129, 0.4)' : 'none',
						}}
					>
						<div style={{ textAlign: 'left', width: 140 }}>
							<div
								style={{
									fontFamily: montserratFont,
									fontSize: 22,
									fontWeight: 900,
									color: '#CBD5E1',
								}}
							>
								206 Runs, 4 Wkts
							</div>
							<div style={{ fontFamily: anekFont, fontSize: 12, color: '#94A3B8' }}>
								2026 లో కేవలం 10 మ్యాచ్‌లు
							</div>
						</div>

						<div style={{ textAlign: 'center' }}>
							<div
								style={{
									fontFamily: montserratFont,
									fontSize: 12,
									fontWeight: 900,
									color: isPhase4 ? '#10B981' : '#94A3B8',
									letterSpacing: 2,
								}}
							>
								RECENT FORM (2025 & 2026)
							</div>
							<div style={{ fontFamily: ramaFont, fontSize: 16, color: '#34D399' }}>
								అర్ష్‌దీప్ 35 వికెట్లు (21 + 14)
							</div>
						</div>

						<div style={{ textAlign: 'right', width: 140 }}>
							<div
								style={{
									fontFamily: montserratFont,
									fontSize: 30,
									fontWeight: 900,
									color: '#34D399',
								}}
							>
								35 Wickets
							</div>
							<div style={{ fontFamily: anekFont, fontSize: 12, color: '#A7F3D0' }}>
								2025 ఫైనల్స్ హీరో
							</div>
						</div>
					</div>
				</div>

				{/* RIGHT COLUMN: ARSHDEEP SINGH PROFILE */}
				<div
					style={{
						background: 'linear-gradient(180deg, rgba(153, 27, 27, 0.7) 0%, rgba(15, 23, 42, 0.95) 100%)',
						borderRadius: 24,
						border: isPhase3 || isPhase4 ? '3px solid #ED1B24' : '2px solid rgba(237, 27, 36, 0.5)',
						padding: '24px 20px',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						boxShadow:
							isPhase3 || isPhase4
								? '0 0 40px rgba(237, 27, 36, 0.4), 0 20px 40px rgba(0, 0, 0, 0.8)'
								: '0 20px 40px rgba(0, 0, 0, 0.6)',
						transform: `translateX(${interpolate(rightColSpring, [0, 1], [40, 0])}px)`,
						opacity: rightColSpring,
						transition: 'border 0.3s ease, box-shadow 0.3s ease',
					}}
				>
					{/* Avatar */}
					<div
						style={{
							width: 130,
							height: 130,
							borderRadius: '50%',
							border: '4px solid #ED1B24',
							overflow: 'hidden',
							boxShadow: '0 0 25px rgba(237, 27, 36, 0.6)',
						}}
					>
						<Img
							src={staticFile('cricket/arshdeep_avatar.png')}
							style={{ width: '100%', height: '100%', objectFit: 'cover' }}
						/>
					</div>

					<h3
						style={{
							margin: '14px 0 2px 0',
							fontFamily: ramaFont,
							fontSize: 32,
							color: '#FFFFFF',
							textAlign: 'center',
						}}
					>
						అర్ష్‌దీప్ సింగ్
					</h3>

					<span
						style={{
							fontFamily: montserratFont,
							fontSize: 13,
							fontWeight: 800,
							color: '#F87171',
							letterSpacing: 2,
						}}
					>
						LEFT-ARM DEATH PACER
					</span>

					{/* Wickets Milestone Card */}
					<div
						style={{
							marginTop: 18,
							width: '100%',
							background: 'rgba(237, 27, 36, 0.15)',
							border: '1px solid rgba(237, 27, 36, 0.4)',
							borderRadius: 14,
							padding: '12px 14px',
							textAlign: 'center',
						}}
					>
						<div
							style={{
								fontFamily: montserratFont,
								fontSize: 12,
								fontWeight: 900,
								color: '#FCA5A5',
								letterSpacing: 1.5,
							}}
						>
							🔥 PBKS ALL-TIME NO. 1
						</div>
						<div
							style={{
								fontFamily: ramaFont,
								fontSize: 18,
								color: '#FFFFFF',
								marginTop: 4,
							}}
						>
							111 వికెట్లతో రికార్డు!
						</div>
					</div>

					{/* Skills Highlight Card */}
					<div
						style={{
							marginTop: 12,
							width: '100%',
							background: 'rgba(16, 185, 129, 0.1)',
							border: '1px solid rgba(16, 185, 129, 0.3)',
							borderRadius: 14,
							padding: '12px 14px',
							textAlign: 'center',
						}}
					>
						<div
							style={{
								fontFamily: montserratFont,
								fontSize: 12,
								fontWeight: 800,
								color: '#34D399',
							}}
						>
							SWING & YORKER SPECIALIST
						</div>
						<div
							style={{
								fontFamily: anekFont,
								fontSize: 14,
								color: '#E2E8F0',
								marginTop: 2,
							}}
						>
							ఇండియా నంబర్ 1 లెఫ్ట్ ఆర్మ్ పేసర్
						</div>
					</div>
				</div>
			</div>

			<SubtitleBar
				pillText="HEAD TO HEAD"
				mainText={
					isPhase1
						? 'హార్దిక్ 162 మ్యాచ్‌లు vs అర్ష్‌దీప్ 96 మ్యాచ్‌లు — ఇద్దరి సమగ్ర పోలిక!'
						: isPhase2
							? 'హార్దిక్ ఖాతాలో 2,955 పరుగులు మరియు 5 ఐపీఎల్ ట్రోఫీలు!'
							: isPhase3
								? 'పంజాబ్ చరిత్రలోనే అత్యధికంగా 111 వికెట్లు తీసిన బౌలర్ అర్ష్‌దీప్!'
								: 'గత రెండు సీజన్లలో ఏకంగా 35 వికెట్లు తీసిన అర్ష్‌దీప్ సింగ్!'
				}
				highlight={isPhase2 ? '146.28 Strike Rate' : isPhase3 ? '111 Wickets' : 'India #1 Pacer'}
				themeColor={isPhase2 ? '#FACC15' : isPhase3 ? '#EF4444' : '#10B981'}
			/>
		</AbsoluteFill>
	);
};

