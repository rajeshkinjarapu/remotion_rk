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
import { ParchmentBackground } from './Backgrounds';
import { HeaderBar } from './HeaderBar';
import { SubtitleBar } from './SubtitleBar';

export const Scene3Breakdown: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Left Photo Card Spring
	const photoSpring = spring({
		frame: frame - 6,
		fps,
		config: { damping: 14, stiffness: 85 },
	});

	// Receipt Card Drop Spring
	const receiptSpring = spring({
		frame: frame - 16,
		fps,
		config: { damping: 13, stiffness: 80 },
	});

	// Twist Highlight Spring (frames 60+)
	const twistSpring = spring({
		frame: frame - 55,
		fps,
		config: { damping: 14, stiffness: 90 },
	});
	const twistMarkerWidth = interpolate(twistSpring, [0, 1], [0, 100]);

	return (
		<AbsoluteFill>
			<ParchmentBackground />
			<HeaderBar
				title="విజయవాడ"
				category="మేయర్ అభ్యర్థులు"
				theme="light"
			/>

			{/* Center Split Screen: Photo on Left, Official Receipt on Right */}
			<div
				style={{
					position: 'absolute',
					top: 140,
					left: 90,
					right: 90,
					bottom: 110,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 60,
				}}
			>
				{/* LEFT: Candidate Photo Card with Camera Focus Brackets */}
				<div
					style={{
						flex: '0 0 420px',
						transform: `scale(${interpolate(photoSpring, [0, 1], [0.85, 1])})`,
						opacity: interpolate(photoSpring, [0, 1], [0, 1]),
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<div
						style={{
							position: 'relative',
							width: 400,
							height: 480,
							backgroundColor: '#FFFFFF',
							padding: 14,
							borderRadius: 8,
							boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
							border: '1px solid #E2E8F0',
						}}
					>
						{/* Camera Focus Brackets (┌ ┐ └ ┘) */}
						<div
							style={{
								position: 'absolute',
								top: 24,
								left: 24,
								width: 26,
								height: 26,
								borderTop: '4px solid #FFFFFF',
								borderLeft: '4px solid #FFFFFF',
								zIndex: 20,
							}}
						/>
						<div
							style={{
								position: 'absolute',
								top: 24,
								right: 24,
								width: 26,
								height: 26,
								borderTop: '4px solid #FFFFFF',
								borderRight: '4px solid #FFFFFF',
								zIndex: 20,
							}}
						/>
						<div
							style={{
								position: 'absolute',
								bottom: 24,
								left: 24,
								width: 26,
								height: 26,
								borderBottom: '4px solid #FFFFFF',
								borderLeft: '4px solid #FFFFFF',
								zIndex: 20,
							}}
						/>
						<div
							style={{
								position: 'absolute',
								bottom: 24,
								right: 24,
								width: 26,
								height: 26,
								borderBottom: '4px solid #FFFFFF',
								borderRight: '4px solid #FFFFFF',
								zIndex: 20,
							}}
						/>

						{/* Candidate Photo */}
						<div
							style={{
								width: '100%',
								height: '100%',
								overflow: 'hidden',
								borderRadius: 4,
								backgroundColor: '#F1F5F9',
							}}
						>
							<Img
								src={staticFile('political/abv_polaroid.png')}
								style={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
									objectPosition: 'center 15%',
								}}
							/>
						</div>
					</div>

					{/* Candidate Info Pill */}
					<div
						style={{
							marginTop: 18,
							display: 'flex',
							alignItems: 'center',
							gap: 12,
							backgroundColor: '#FFFFFF',
							padding: '8px 24px',
							borderRadius: 30,
							boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
							border: '1px solid #CBD5E1',
						}}
					>
						<span
							style={{
								color: '#0F172A',
								fontSize: 22,
								fontWeight: 900,
								fontFamily: '"Anek Telugu", "Noto Sans Telugu", sans-serif',
							}}
						>
							ఏబీ వెంకటేశ్వరరావు
						</span>
						<span
							style={{
								backgroundColor: '#475569',
								color: '#FFFFFF',
								fontSize: 13,
								fontWeight: 800,
								padding: '4px 12px',
								borderRadius: 14,
							}}
						>
							స్వతంత్ర
						</span>
					</div>
				</div>

				{/* RIGHT: OFFICIAL AFFIDAVIT RECEIPT CARD (Exact replica of ref_vid1_s35.jpg) */}
				<div
					style={{
						flex: 1,
						maxWidth: 780,
						transform: `translateY(${interpolate(receiptSpring, [0, 1], [40, 0])}px)`,
						opacity: interpolate(receiptSpring, [0, 1], [0, 1]),
						position: 'relative',
					}}
				>
					<div
						style={{
							backgroundColor: '#FFFFFF',
							borderRadius: '12px 12px 0 0',
							borderTop: '7px solid #002244',
							padding: '30px 40px',
							boxShadow: '0 20px 50px rgba(0, 0, 0, 0.12)',
							borderLeft: '1px solid #E2E8F0',
							borderRight: '1px solid #E2E8F0',
							position: 'relative',
						}}
					>
						{/* Receipt Header */}
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								paddingBottom: 16,
							}}
						>
							<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
								<span
									style={{
										fontSize: 38,
										fontWeight: 900,
										color: '#0B172E',
										fontFamily: '"Anek Telugu", "Noto Sans Telugu", sans-serif',
									}}
								>
									ఏబీ వెంకటేశ్వరరావు
								</span>
								<span
									style={{
										backgroundColor: '#0284C7',
										color: '#FFFFFF',
										fontSize: 14,
										fontWeight: 900,
										padding: '4px 14px',
										borderRadius: 6,
									}}
								>
									అఫిడవిట్
								</span>
							</div>

							<span
								style={{
									fontSize: 18,
									fontWeight: 700,
									color: '#64748B',
									fontFamily: '"Anek Telugu", "Noto Sans Telugu", sans-serif',
								}}
							>
								ఎన్నికల సంఘం ప్రకారం
							</span>
						</div>

						{/* Dashed Divider Line */}
						<div
							style={{
								width: '100%',
								borderBottom: '2px dashed #CBD5E1',
								marginBottom: 20,
							}}
						/>

						{/* Row 1: Total Family Wealth */}
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'baseline',
								padding: '12px 0',
							}}
						>
							<span
								style={{
									fontSize: 28,
									fontWeight: 800,
									color: '#0F172A',
									fontFamily: '"Anek Telugu", "Noto Sans Telugu", sans-serif',
								}}
							>
								కుటుంబ మొత్తం ఆస్తులు
							</span>
							<div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
								<span
									style={{
										fontSize: 52,
										fontWeight: 900,
										color: '#0B172E',
										fontFamily: 'system-ui, -apple-system, sans-serif',
										letterSpacing: '-1px',
									}}
								>
									₹21.55
								</span>
								<span
									style={{
										fontSize: 28,
										fontWeight: 900,
										color: '#DC2626',
										fontFamily: '"Anek Telugu", "Noto Sans Telugu", sans-serif',
									}}
								>
									కోట్లు
								</span>
							</div>
						</div>

						{/* Row 2: Immovable Assets */}
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'baseline',
								padding: '12px 0',
								borderTop: '1px solid #F1F5F9',
							}}
						>
							<span
								style={{
									fontSize: 24,
									fontWeight: 700,
									color: '#334155',
									fontFamily: '"Anek Telugu", "Noto Sans Telugu", sans-serif',
								}}
							>
								స్థిరాస్తులు (భూములు & ఇళ్లు)
							</span>
							<div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
								<span
									style={{
										fontSize: 38,
										fontWeight: 900,
										color: '#0F172A',
										fontFamily: 'system-ui, sans-serif',
									}}
								>
									₹18.20
								</span>
								<span
									style={{
										fontSize: 22,
										fontWeight: 800,
										color: '#475569',
										fontFamily: '"Anek Telugu", sans-serif',
									}}
								>
									కోట్లు
								</span>
							</div>
						</div>

						{/* Row 3: Gold Assets */}
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								padding: '12px 0',
								borderTop: '1px solid #F1F5F9',
							}}
						>
							<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
								<span
									style={{
										fontSize: 24,
										fontWeight: 700,
										color: '#334155',
										fontFamily: '"Anek Telugu", sans-serif',
									}}
								>
									కుటుంబం వద్ద బంగారం
								</span>
								<span
									style={{
										backgroundColor: '#FEF3C7',
										color: '#92400E',
										fontSize: 13,
										fontWeight: 800,
										padding: '3px 10px',
										borderRadius: 6,
										border: '1px solid #FCD34D',
									}}
								>
									ఆభరణాలు
								</span>
							</div>
							<span
								style={{
									fontSize: 34,
									fontWeight: 900,
									color: '#B45309',
									fontFamily: '"Anek Telugu", sans-serif',
								}}
							>
								3 కిలోలకు పైగా
							</span>
						</div>

						{/* Row 4: THE BIG TWIST - Bank Balance */}
						<div
							style={{
								position: 'relative',
								marginTop: 10,
								padding: '16px 20px',
								backgroundColor: '#FEF2F2',
								borderRadius: 10,
								border: '2px solid #EF4444',
								overflow: 'hidden',
							}}
						>
							{/* Yellow Highlighter Marker Sweep Animation */}
							<div
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									bottom: 0,
									width: `${twistMarkerWidth}%`,
									backgroundColor: 'rgba(250, 204, 21, 0.45)',
									pointerEvents: 'none',
									zIndex: 1,
								}}
							/>

							<div
								style={{
									position: 'relative',
									zIndex: 2,
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<div>
									<div
										style={{
											display: 'inline-block',
											backgroundColor: '#DC2626',
											color: '#FFFFFF',
											fontSize: 12,
											fontWeight: 900,
											padding: '2px 8px',
											borderRadius: 4,
											textTransform: 'uppercase',
											letterSpacing: '1px',
											marginBottom: 4,
										}}
									>
										బిగ్ ట్విస్ట్!
									</div>
									<div
										style={{
											fontSize: 26,
											fontWeight: 900,
											color: '#991B1B',
											fontFamily: '"Anek Telugu", "Noto Sans Telugu", sans-serif',
										}}
									>
										బ్యాంక్ ఖాతాలో నగదు నిల్వ:
									</div>
								</div>

								{/* Giant Red Number */}
								<div
									style={{
										fontSize: 48,
										fontWeight: 900,
										color: '#DC2626',
										fontFamily: 'system-ui, -apple-system, sans-serif',
										letterSpacing: '-1px',
									}}
								>
									₹3,935!
								</div>
							</div>
						</div>
					</div>

					{/* ZIG-ZAG TEAR PAPER BOTTOM EDGE */}
					<div
						style={{
							width: '100%',
							height: 18,
							backgroundImage: `
								linear-gradient(135deg, #FFFFFF 33.333%, transparent 33.333%),
								linear-gradient(225deg, #FFFFFF 33.333%, transparent 33.333%)
							`,
							backgroundSize: '24px 18px',
							backgroundRepeat: 'repeat-x',
							filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.06))',
						}}
					/>
				</div>
			</div>

			<SubtitleBar
				text="అసలైన ట్విస్ట్: 21 కోట్లకు పైగా ఆస్తులు ఉన్నా, బ్యాంక్ ఖాతాలో నగదు కేవలం"
				highlight="₹3,935 మాత్రమే!"
			/>
		</AbsoluteFill>
	);
};
