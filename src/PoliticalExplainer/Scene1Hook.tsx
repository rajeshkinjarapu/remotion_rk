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
import { NavyBackground } from './Backgrounds';
import { HeaderBar } from './HeaderBar';
import { SubtitleBar } from './SubtitleBar';

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

	// Giant 21 Crore text entrance
	const amountSpring = spring({
		frame: frame - 40,
		fps,
		config: { damping: 12, stiffness: 95 },
	});

	// Dynamic blur on photo: starts blurred with '?', unblurs at frame 60
	const unblurProgress = spring({
		frame: frame - 65,
		fps,
		config: { damping: 15, stiffness: 80 },
	});
	const blurAmount = interpolate(unblurProgress, [0, 1], [10, 0]);
	const questionOpacity = interpolate(unblurProgress, [0, 0.7, 1], [1, 0.3, 0]);

	return (
		<AbsoluteFill>
			<NavyBackground />
			<HeaderBar
				title="విజయవాడ: ఎవరి ఆస్తులు ఎంత?"
				category="ఎన్నికల అఫిడవిట్"
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
				{/* LEFT: Candidate Photo with Camera Brackets & '?' Sticker */}
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
							boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65)',
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
								backgroundColor: '#1E293B',
								borderRadius: 4,
								position: 'relative',
							}}
						>
							<Img
								src={staticFile('political/abv_polaroid.png')}
								style={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
									objectPosition: 'center 15%',
									filter: `blur(${blurAmount}px)`,
									transform: 'scale(1.05)',
								}}
							/>

							{/* Yellow Question Mark Sticker */}
							{questionOpacity > 0 && (
								<div
									style={{
										position: 'absolute',
										top: '40%',
										left: '50%',
										transform: 'translate(-50%, -50%)',
										width: 110,
										height: 110,
										borderRadius: '50%',
										backgroundColor: '#FACC15',
										color: '#000000',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: 72,
										fontWeight: 900,
										boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
										opacity: questionOpacity,
										zIndex: 30,
										border: '4px solid #FFFFFF',
									}}
								>
									?
								</div>
							)}
						</div>
					</div>

					{/* Candidate identity caption below */}
					<div
						style={{
							marginTop: 18,
							backgroundColor: '#0F172A',
							border: '1.5px solid #334155',
							padding: '8px 24px',
							borderRadius: 30,
							color: '#F8FAFC',
							fontSize: 22,
							fontWeight: 800,
							fontFamily: '"Anek Telugu", "Noto Sans Telugu", sans-serif',
						}}
					>
						ఏబీ వెంకటేశ్వరరావు (రిటైర్డ్ ఐపీఎస్)
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
					{/* Strikethrough Drama: 'షుకార్లు కాదు' */}
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
									fontSize: 64,
									fontWeight: 900,
									color: '#FFFFFF',
									fontFamily: '"Anek Telugu", "Noto Sans Telugu", sans-serif',
									letterSpacing: '1px',
								}}
							>
								షుకార్లు
							</span>
							{/* Red Strikethrough Bar */}
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

						{/* Red badge 'కాదు' */}
						<div
							style={{
								backgroundColor: '#EF4444',
								color: '#FFFFFF',
								fontSize: 32,
								fontWeight: 900,
								padding: '4px 18px',
								borderRadius: 8,
								fontFamily: '"Anek Telugu", "Noto Sans Telugu", sans-serif',
								boxShadow: '0 4px 14px rgba(239, 68, 68, 0.5)',
							}}
						>
							కాదు
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
								fontFamily: '"Anek Telugu", "Noto Sans Telugu", sans-serif',
								marginBottom: 8,
							}}
						>
							ఎన్నికల సంఘం అఫిడవిట్ నివేదిక ప్రకారం:
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
									fontSize: 98,
									fontWeight: 900,
									color: '#FACC15',
									fontFamily: 'system-ui, -apple-system, sans-serif',
									letterSpacing: '-2px',
									textShadow: '0 6px 20px rgba(250, 204, 21, 0.3)',
								}}
							>
								₹21.55
							</span>
							<span
								style={{
									fontSize: 54,
									fontWeight: 900,
									color: '#FFFFFF',
									fontFamily: '"Anek Telugu", "Noto Sans Telugu", sans-serif',
								}}
							>
								కోట్ల ఆస్తులు!
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
							padding: '16px 26px',
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
							టాప్ 1
						</div>
						<div
							style={{
								color: '#F8FAFC',
								fontSize: 28,
								fontWeight: 800,
								fontFamily: '"Anek Telugu", "Noto Sans Telugu", sans-serif',
							}}
						>
							ఏ పార్టీ వారు కాదు — స్వతంత్ర అభ్యర్థి!
						</div>
					</div>
				</div>
			</div>

			<SubtitleBar
				text="విజయవాడ మేయర్ రేస్ లో ఎవరి ఆస్తులు ఎంత? అఫిడవిట్ నివేదిక ప్రకారం..."
				highlight="₹21.55 కోట్లు"
			/>
		</AbsoluteFill>
	);
};
