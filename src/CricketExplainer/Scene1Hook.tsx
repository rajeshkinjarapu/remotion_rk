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
import { StadiumNavyBackground } from './Backgrounds';
import { HeaderBar } from './HeaderBar';
import { SubtitleBar } from './SubtitleBar';
import { anekFont, ramaFont } from './fonts';

export const Scene1Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Photo Card entrance
	const photoSpring = spring({
		frame: frame - 4,
		fps,
		config: { damping: 13, stiffness: 85 },
	});

	// Strikethrough text animation
	const strikeSpring = spring({
		frame: frame - 22,
		fps,
		config: { damping: 14, stiffness: 90 },
	});
	const strikeLineWidth = interpolate(strikeSpring, [0, 1], [0, 105]);

	// Giant 8,004 runs text entrance
	const amountSpring = spring({
		frame: frame - 40,
		fps,
		config: { damping: 12, stiffness: 95 },
	});

	return (
		<AbsoluteFill>
			<StadiumNavyBackground />
			<HeaderBar
				title="ఐపీఎల్: అసలైన రికార్డుల రారాజు ఎవరు?"
				category="మెగా అనాలసిస్"
				theme="dark"
			/>

			{/* Center 16:9 Showcase */}
			<div
				style={{
					position: 'absolute',
					top: 140,
					left: 100,
					right: 100,
					bottom: 120,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 80,
				}}
			>
				{/* LEFT: Candidate Photo with Camera Focus Brackets */}
				<div
					style={{
						flex: '0 0 460px',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						transform: `scale(${interpolate(photoSpring, [0, 1], [0.85, 1])})`,
						opacity: interpolate(photoSpring, [0, 1], [0, 1]),
					}}
				>
					<div
						style={{
							position: 'relative',
							width: 440,
							height: 480,
							backgroundColor: '#FFFFFF',
							padding: 14,
							borderRadius: 8,
							boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
						}}
					>
						{/* Camera Focus Brackets (┌ ┐ └ ┘) */}
						<div
							style={{
								position: 'absolute',
								top: 26,
								left: 26,
								width: 28,
								height: 28,
								borderTop: '4px solid #FFFFFF',
								borderLeft: '4px solid #FFFFFF',
								zIndex: 20,
							}}
						/>
						<div
							style={{
								position: 'absolute',
								top: 26,
								right: 26,
								width: 28,
								height: 28,
								borderTop: '4px solid #FFFFFF',
								borderRight: '4px solid #FFFFFF',
								zIndex: 20,
							}}
						/>
						<div
							style={{
								position: 'absolute',
								bottom: 26,
								left: 26,
								width: 28,
								height: 28,
								borderBottom: '4px solid #FFFFFF',
								borderLeft: '4px solid #FFFFFF',
								zIndex: 20,
							}}
						/>
						<div
							style={{
								position: 'absolute',
								bottom: 26,
								right: 26,
								width: 28,
								height: 28,
								borderBottom: '4px solid #FFFFFF',
								borderRight: '4px solid #FFFFFF',
								zIndex: 20,
							}}
						/>

						{/* Photo Container */}
						<div
							style={{
								width: '100%',
								height: '100%',
								overflow: 'hidden',
								backgroundColor: '#0F172A',
								borderRadius: 4,
							}}
						>
							<Img
								src={staticFile('cricket/kohli_avatar.png')}
								style={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
									objectPosition: 'center top',
								}}
							/>
						</div>
					</div>

					{/* Player identity caption below */}
					<div
						style={{
							marginTop: 18,
							backgroundColor: '#0F172A',
							border: '1.5px solid #334155',
							padding: '8px 26px',
							borderRadius: 30,
							color: '#F8FAFC',
							fontSize: 24,
							fontWeight: 900,
							fontFamily: ramaFont,
						}}
					>
						విరాట్ కోహ్లీ (రాయల్ ఛాలెంజర్స్ బెంగళూరు)
					</div>
				</div>

				{/* RIGHT: Big High-Impact Typography & Narrative */}
				<div
					style={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						gap: 30,
					}}
				>
					{/* Strikethrough Drama: 'సాధారణ రికార్డులు కాదు' */}
					<div
						style={{
							opacity: interpolate(strikeSpring, [0, 1], [0, 1]),
							transform: `translateX(${interpolate(strikeSpring, [0, 1], [40, 0])}px)`,
							display: 'flex',
							alignItems: 'center',
							gap: 24,
						}}
					>
						<div style={{ position: 'relative', display: 'inline-block' }}>
							<span
								style={{
									fontSize: 58,
									fontWeight: 900,
									color: '#FFFFFF',
									fontFamily: ramaFont,
									letterSpacing: '1px',
								}}
							>
								సాధారణ రికార్డులు
							</span>
							<div
								style={{
									position: 'absolute',
									top: '55%',
									left: '-4%',
									width: `${strikeLineWidth}%`,
									height: 8,
									backgroundColor: '#EF4444',
									transform: 'translateY(-50%) rotate(-3deg)',
									borderRadius: 4,
									boxShadow: '0 2px 10px rgba(239, 68, 68, 0.8)',
								}}
							/>
						</div>

						<div
							style={{
								backgroundColor: '#EF4444',
								color: '#FFFFFF',
								fontSize: 32,
								fontWeight: 900,
								padding: '4px 18px',
								borderRadius: 8,
								fontFamily: ramaFont,
								boxShadow: '0 4px 14px rgba(239, 68, 68, 0.5)',
							}}
						>
							కాదు!
						</div>
					</div>

					{/* The Official Announcement Header */}
					<div
						style={{
							opacity: interpolate(amountSpring, [0, 1], [0, 1]),
							transform: `translateY(${interpolate(amountSpring, [0, 1], [30, 0])}px)`,
						}}
					>
						<div
							style={{
								fontSize: 28,
								fontWeight: 700,
								color: '#94A3B8',
								fontFamily: anekFont,
								marginBottom: 8,
							}}
						>
							ఐపీఎల్ చరిత్రలోనే సరికొత్త సంచలనం:
						</div>

						{/* GIGANTIC GOLD NUMBER & WHITE TEXT */}
						<div
							style={{
								display: 'flex',
								alignItems: 'baseline',
								gap: 16,
								lineHeight: 1,
							}}
						>
							<span
								style={{
									fontSize: 104,
									fontWeight: 900,
									color: '#FACC15',
									fontFamily: 'system-ui, -apple-system, sans-serif',
									letterSpacing: '-2px',
									textShadow: '0 6px 20px rgba(250, 204, 21, 0.35)',
								}}
							>
								8,004
							</span>
							<span
								style={{
									fontSize: 56,
									fontWeight: 900,
									color: '#FFFFFF',
									fontFamily: ramaFont,
								}}
							>
								పరుగులు!
							</span>
						</div>
					</div>

					{/* Callout Pill */}
					<div
						style={{
							opacity: interpolate(amountSpring, [0, 1], [0, 1]),
							display: 'inline-flex',
							alignItems: 'center',
							gap: 14,
							backgroundColor: 'rgba(255, 255, 255, 0.08)',
							border: '2px solid rgba(255, 255, 255, 0.2)',
							padding: '16px 28px',
							borderRadius: 16,
							width: 'fit-content',
						}}
					>
						<div
							style={{
								backgroundColor: '#F59E0B',
								color: '#000000',
								fontWeight: 900,
								fontSize: 16,
								padding: '6px 14px',
								borderRadius: 8,
							}}
						>
							నెంబర్ 1
						</div>
						<div
							style={{
								color: '#F8FAFC',
								fontSize: 28,
								fontWeight: 800,
								fontFamily: anekFont,
							}}
						>
							ఈ ఘనత సాధించిన ప్రపంచంలోనే ఏకైక బ్యాటర్!
						</div>
					</div>
				</div>
			</div>

			<SubtitleBar
				text="ఐపీఎల్ లో అసలైన రికార్డుల రారాజు ఎవరు? ఎవరి పరుగులు ఎంత?"
				highlight="8,004 పరుగులు"
			/>
		</AbsoluteFill>
	);
};

