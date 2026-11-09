import React, {useMemo} from 'react';
import {
	AbsoluteFill,
	Audio,
	Img,
	Sequence,
	Series,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	interpolateColors,
} from 'remotion';
import {z} from 'zod';
import questionsData from './questions.json';
import {QUIZ_THEMES, QuizTheme} from './themes';

export interface QuizQuestionItem {
	category: string;
	question: string;
	theme?: string;
	questionImage: string;
	questionImageTag: string;
	answerImage: string;
	answerImageTag: string;
	options: string[];
	correctIndex: number;
	correctLetter: string;
	explanation: {
		title: string;
		description: string;
		points: Array<{
			icon: string;
			label: string;
			text: string;
		}>;
	};
}

export const QUIZ_QUESTIONS: QuizQuestionItem[] =
	questionsData as unknown as QuizQuestionItem[];

export const teluguQuizSchema = z.object({
	quizIndex: z
		.number()
		.min(0)
		.max(QUIZ_QUESTIONS.length - 1)
		.default(0),
	showPhotos: z.boolean().default(false),
});

export type TeluguQuizProps = z.infer<typeof teluguQuizSchema>;

export const TeluguQuiz: React.FC<TeluguQuizProps> = ({
	quizIndex = 0,
	showPhotos = false,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const currentQuiz = QUIZ_QUESTIONS[quizIndex] || QUIZ_QUESTIONS[0];

	// 20 Automatic Dynamic Themes (Rotates automatically across 20 distinct themes per question)
	const themeIndex = quizIndex % QUIZ_THEMES.length;
	const currentTheme = useMemo(() => {
		if (currentQuiz.theme) {
			const found = QUIZ_THEMES.find(
				(t) =>
					t.id === currentQuiz.theme ||
					t.name.toLowerCase() === currentQuiz.theme?.toLowerCase(),
			);
			if (found) return found;
		}
		return QUIZ_THEMES[themeIndex] || QUIZ_THEMES[0];
	}, [currentQuiz.theme, themeIndex]);

	// ==================== TIMELINE DEFINITION ====================
	// PAGE 1: Question, 1-by-1 Options, Question Image, 5s Countdown Timer (Frames 0 to 330)
	// - 0 to 25: Header Drop
	// - 25 to 85: Question Typewriter (Increased 52px font!)
	// - 90 to 170: Options arrive ONE BY ONE vertically (90, 110, 130, 150)
	// - 170 to 320: 5-Second Countdown Timer (5, 4, 3, 2, 1)
	// - 320 to 335: Time Up chime
	// TRANSITION: Frames 330 to 360
	// PAGE 2: Answer & Full Explanation with Answer Image & Large 58px Answer Text! (Frames 345 to 630)

	const page1End = 335;
	const transitionStart = 330;
	const isPage2Active = frame >= transitionStart;

	// Question Typewriter calculation using Intl.Segmenter for proper Telugu graphemes
	const graphemes = useMemo(() => {
		if (typeof Intl !== 'undefined' && Intl.Segmenter) {
			const segmenter = new Intl.Segmenter('te', {granularity: 'grapheme'});
			return Array.from(
				segmenter.segment(currentQuiz.question),
				(s) => s.segment,
			);
		}
		return Array.from(currentQuiz.question);
	}, [currentQuiz.question]);

	const typeStart = 25;
	const typeDuration = 60; // 2 seconds to type full question
	const typedProgress = interpolate(
		frame,
		[typeStart, typeStart + typeDuration],
		[0, graphemes.length],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);
	const visibleCharCount = Math.floor(typedProgress);
	const displayedQuestion = graphemes.slice(0, visibleCharCount).join('');
	const isTyping = frame >= typeStart && frame < typeStart + typeDuration;

	// Timer calculation on Page 1 (Frames 170 to 320 = 150 frames = 5 seconds)
	const timerStart = 170;
	const timerDuration = 150;
	const timerEnd = timerStart + timerDuration; // 320
	const isTimeUp = frame >= timerEnd;

	const remainingSeconds = Math.max(1, Math.ceil((timerEnd - frame) / 30));

	const ringProgress = interpolate(frame, [timerStart, timerEnd], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const circumference = 2 * Math.PI * 48;
	const strokeDashoffset = circumference * (1 - ringProgress);

	const tickPulse =
		frame >= timerStart && frame < timerEnd
			? 1 + Math.sin((((frame - timerStart) % 30) / 30) * Math.PI) * 0.12
			: 1;

	// Page transitions
	const page1Opacity = interpolate(
		frame,
		[transitionStart, transitionStart + 15],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);
	const page1Scale = interpolate(
		frame,
		[transitionStart, transitionStart + 15],
		[1, 0.94],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	const page2Spring = spring({
		frame: frame - (transitionStart + 5),
		fps,
		config: {damping: 13, mass: 0.9},
	});

	// Option timings (One by one vertical stack!)
	const optionEntryFrames = [90, 110, 130, 150];

	// Right Image Entrance
	const imageSpring = spring({
		frame: frame - 45,
		fps,
		config: {damping: 13, mass: 0.9},
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#ffffff',
				fontFamily: "'Anek Telugu', sans-serif",
				color: '#0f172a',
				overflow: 'hidden',
			}}
		>
			{/* Fonts */}
			<style>{`
				@font-face {
					font-family: 'Anek Telugu';
					src: url('${staticFile('Youtube Video/AnekTelugu-Bold.ttf')}') format('truetype');
					font-weight: 700;
					font-style: normal;
				}
				@font-face {
					font-family: 'Mandali';
					src: url('${staticFile('Youtube Video/Mandali.ttf')}') format('truetype');
					font-weight: 700;
					font-style: normal;
				}
			`}</style>

			{/* ================= 16:9 ELEGANT WHITE STUDIO BROADCAST BACKGROUND ================= */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse 95% 75% at 50% 15%, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)',
				}}
			/>

			{/* Soft Ambient Studio Beams */}
			<div
				style={{
					position: 'absolute',
					top: -100,
					left: '10%',
					width: 580,
					height: 1250,
					background:
						'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
					transform: 'rotate(-25deg)',
					pointerEvents: 'none',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: -100,
					right: '10%',
					width: 580,
					height: 1250,
					background:
						'linear-gradient(-135deg, rgba(245, 158, 11, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
					transform: 'rotate(25deg)',
					pointerEvents: 'none',
				}}
			/>

			{/* Subtle Micro Dots Texture */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					backgroundImage:
						'radial-gradient(rgba(100, 116, 139, 0.18) 1.5px, transparent 1.5px)',
					backgroundSize: '36px 36px',
					opacity: 0.65,
				}}
			/>

			{/* ================= PAGE 1: QUESTION + VERTICAL 1-BY-1 OPTIONS + QUESTION IMAGE + TIMER ================= */}
			{frame <= page1End + 15 && (
				<AbsoluteFill
					style={{
						opacity: page1Opacity,
						transform: `scale(${page1Scale})`,
						pointerEvents: frame > page1End ? 'none' : 'auto',
					}}
				>
					{/* Top Header Row: Left-Aligned Question Number & Centered Category */}
					{/* Top Header: Centered Category / Heading Ribbon */}
					<div
						style={{
							position: 'absolute',
							top: 18,
							left: 40,
							right: 40,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							zIndex: 10,
						}}
					>
						<div
							style={{
								background: '#ffffff',
								border: '2px solid #cbd5e1',
								borderTop: '3px solid #2563eb',
								padding: '8px 44px',
								borderRadius: 30,
								fontSize: 24,
								fontWeight: 900,
								color: '#0f172a',
								letterSpacing: 1.5,
								boxShadow: '0 6px 20px rgba(15, 23, 42, 0.08)',
								display: 'flex',
								alignItems: 'center',
								gap: 12,
							}}
						>
							<span style={{fontSize: 26}}>🏏</span>
							<span>{currentQuiz.category}</span>
						</div>
					</div>

					{/* ================= AUDIO: TIMER TICKS & TIME UP CHIME ================= */}
					{[170, 200, 230, 260, 290].map((tickFrame, i) => (
						<Sequence key={`tick-${i}`} from={tickFrame} durationInFrames={15}>
							<Audio src={staticFile('Youtube Video/timer_tick.wav')} volume={0.8} />
						</Sequence>
					))}
					<Sequence from={320} durationInFrames={45}>
						<Audio src={staticFile('Youtube Video/time_up.wav')} volume={0.9} />
					</Sequence>

					{/* 16:9 Question Banner: Pristine White Floating Card (EXPANDED HEIGHT) */}
					<div
						style={{
							position: 'absolute',
							top: 72,
							left: 40,
							right: 40,
							zIndex: 10,
						}}
					>
						<div
							style={{
								background: '#ffffff',
								borderRadius: 24,
								padding: '28px 50px',
								border: '2px solid #cbd5e1',
								borderTop: '5px solid #2563eb',
								boxShadow:
									'0 12px 35px rgba(15, 23, 42, 0.08), 0 3px 8px rgba(15, 23, 42, 0.04)',
								textAlign: 'center',
								position: 'relative',
								height: 250,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
							}}
						>
							{/* Question Text: Large, Bold, with Q.NO in front */}
							<div
								style={{
									fontSize:
										currentQuiz.question.length > 65
											? 60
											: currentQuiz.question.length > 45
												? 68
												: 76,
									fontWeight: 900,
									color: '#0f172a',
									lineHeight: 1.34,
									letterSpacing: 0.3,
									display: 'inline-block',
								}}
							>
								<span
									style={{
										color: '#2563eb',
										marginRight: 16,
										fontWeight: 900,
									}}
								>
									{quizIndex + 1}.
								</span>
								{displayedQuestion}
								{/* Blinking Typewriter Cursor */}
								{isTyping && (
									<span
										style={{
											color: '#2563eb',
											fontWeight: 900,
											marginLeft: 4,
											opacity: frame % 10 < 5 ? 1 : 0,
										}}
									>
										|
									</span>
								)}
							</div>
						</div>
					</div>

					{/* ================= 2x2 KBC-STYLE OPTIONS GRID (COMPACT SLEEK HEIGHT) ================= */}
					<div
						style={{
							position: 'absolute',
							top: 365,
							left: 40,
							right: 40,
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gridTemplateRows: '260px 260px',
							rowGap: 50,
							columnGap: 60,
							zIndex: 10,
						}}
					>
						{currentQuiz.options.map((option, idx) => {
							const entryFrame = optionEntryFrames[idx];
							const optionSpring = spring({
								frame: frame - entryFrame,
								fps,
								config: {damping: 12, mass: 0.8},
							});

							const letters = ['A', 'B', 'C', 'D'];
							const isCorrect = idx === currentQuiz.correctIndex;

							// Elegant White Card Styling
							let buttonBg = '#ffffff';
							let borderColor = '#e2e8f0';
							let borderTop = '2px solid #ffffff';
							let bottomBevel = '#cbd5e1';
							let opacity = 1;
							let scale = 1;
							let letterBg =
								'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
							let letterBorder = '#93c5fd';
							let textColor = '#0f172a';
							let glow = '0 6px 20px rgba(15, 23, 42, 0.06)';

							if (isTimeUp) {
								if (isCorrect) {
									buttonBg =
										'linear-gradient(135deg, #15803d 0%, #166534 100%)';
									borderColor = '#4ade80';
									borderTop = '3px solid #86efac';
									bottomBevel = '#052e16';
									letterBg =
										'linear-gradient(180deg, #22c55e 0%, #15803d 100%)';
									letterBorder = '#86efac';
									textColor = '#ffffff';
									scale = 1.02;
									glow = '0 6px 0 #052e16, 0 0 35px rgba(34, 197, 94, 0.5)';
								} else {
									opacity = 0.32;
									buttonBg = '#f8fafc';
									borderColor = '#e2e8f0';
									bottomBevel = '#f1f5f9';
									borderTop = 'none';
									textColor = '#64748b';
								}
							}

							return (
								<div
									key={idx}
									style={{
										transform: `translateY(${interpolate(
											optionSpring,
											[0, 1],
											[40, 0],
										)}px) scale(${interpolate(optionSpring, [0, 1], [0.94, 1]) * scale})`,
										opacity: interpolate(optionSpring, [0, 1], [0, opacity]),
										background: buttonBg,
										border: `2px solid ${borderColor}`,
										borderTop,
										borderBottom: `6px solid ${bottomBevel}`,
										borderRadius: 24,
										padding: '0 40px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										boxShadow: glow,
									}}
								>
									<div style={{display: 'flex', alignItems: 'center', gap: 28}}>
										{/* Metallic Blue / Green Coin */}
										<div
											style={{
												width: 82,
												height: 82,
												borderRadius: 24,
												background: letterBg,
												border: `2px solid ${letterBorder}`,
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												fontSize: 44,
												fontWeight: 900,
												color: '#ffffff',
												boxShadow:
													'0 6px 14px rgba(0,0,0,0.18), inset 0 2px 0 rgba(255,255,255,0.4)',
												flexShrink: 0,
											}}
										>
											{letters[idx]}
										</div>

										{/* Option Text: Deep High Contrast Slate Black (48px to 52px font) */}
										<div
											style={{
												fontSize: option.length > 25 ? 44 : 50,
												fontWeight: 900,
												color: textColor,
												letterSpacing: 0.3,
												lineHeight: 1.25,
											}}
										>
											{option}
										</div>
									</div>

									{isTimeUp && isCorrect && (
										<div
											style={{
												fontSize: 54,
												filter:
													'drop-shadow(0 0 12px rgba(74, 222, 128, 0.95))',
											}}
										>
											✅
										</div>
									)}
								</div>
							);
						})}
					</div>

					{/* ================= CENTER CIRCULAR COUNTDOWN TIMER (BROADCAST HUB) ================= */}
					<div
						style={{
							position: 'absolute',
							top: 645,
							left: '50%',
							transform: `translate(-50%, -50%) scale(${
								interpolate(
									frame,
									[timerStart - 15, timerStart],
									[0.3, 1],
									{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
								) * tickPulse
							})`,
							zIndex: 40,
							opacity: interpolate(
								frame,
								[timerStart - 15, timerStart],
								[0, 1],
								{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
							),
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						{/* Premium Glowing Hub Chassis */}
						<div
							style={{
								width: 180,
								height: 180,
								borderRadius: '50%',
								background:
									'radial-gradient(circle at 35% 35%, #ffffff 0%, #f8fafc 70%, #e2e8f0 100%)',
								border: isTimeUp
									? '4px solid #4ade80'
									: remainingSeconds <= 2
										? '4px solid #f87171'
										: '4px solid #93c5fd',
								boxShadow: isTimeUp
									? '0 0 0 10px rgba(34, 197, 94, 0.25), 0 20px 50px rgba(22, 163, 74, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.9)'
									: remainingSeconds <= 2
										? '0 0 0 10px rgba(239, 68, 68, 0.25), 0 20px 50px rgba(239, 68, 68, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.9)'
										: '0 0 0 10px rgba(37, 99, 235, 0.2), 0 20px 50px rgba(15, 23, 42, 0.25), inset 0 2px 4px rgba(255, 255, 255, 0.9)',
								position: 'relative',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							{/* Animated Circular SVG Ring */}
							<svg
								width="180"
								height="180"
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									transform: 'rotate(-90deg)',
								}}
							>
								<circle
									cx="90"
									cy="90"
									r="78"
									stroke="rgba(226, 232, 240, 0.8)"
									strokeWidth="10"
									fill="none"
								/>
								<circle
									cx="90"
									cy="90"
									r="78"
									stroke={
										isTimeUp
											? '#16a34a'
											: remainingSeconds <= 2
												? '#ef4444'
												: '#2563eb'
									}
									strokeWidth="10"
									fill="none"
									strokeDasharray={2 * Math.PI * 78}
									strokeDashoffset={2 * Math.PI * 78 * (1 - ringProgress)}
									strokeLinecap="round"
									style={{
										filter: isTimeUp
											? 'drop-shadow(0 0 14px rgba(34, 197, 94, 0.85))'
											: remainingSeconds <= 2
												? 'drop-shadow(0 0 14px rgba(239, 68, 68, 0.85))'
												: 'drop-shadow(0 0 12px rgba(37, 99, 235, 0.65))',
									}}
								/>
							</svg>

							{/* Center Digital Counter */}
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									zIndex: 2,
								}}
							>
								<span
									style={{
										fontSize: 13,
										fontWeight: 900,
										letterSpacing: 2.5,
										color: isTimeUp
											? '#16a34a'
											: remainingSeconds <= 2
												? '#ef4444'
												: '#1e40af',
										textTransform: 'uppercase',
										marginBottom: -4,
									}}
								>
									{isTimeUp ? 'TIME UP' : 'TIMER'}
								</span>

								<span
									style={{
										fontSize: isTimeUp ? 46 : 72,
										fontWeight: 900,
										color: isTimeUp
											? '#16a34a'
											: remainingSeconds <= 2
												? '#ef4444'
												: '#0f172a',
										lineHeight: 1,
										fontVariantNumeric: 'tabular-nums',
									}}
								>
									{isTimeUp ? '0' : remainingSeconds}
								</span>

								<span
									style={{
										fontSize: 12,
										fontWeight: 900,
										letterSpacing: 2.5,
										color: '#64748b',
										textTransform: 'uppercase',
										marginTop: 2,
									}}
								>
									{isTimeUp ? 'BELL 🔔' : 'SEC'}
								</span>
							</div>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* ================= PAGE 2: ANSWER & IN-DEPTH EXPLANATION PAGE (EXPANDED TO EDGES, NO TOP/BOTTOM BARS) ================= */}
			{isPage2Active && (
				<AbsoluteFill
					style={{
						opacity: page2Spring,
						transform: `translateY(${interpolate(
							page2Spring,
							[0, 1],
							[50, 0],
						)}px) scale(${interpolate(page2Spring, [0, 1], [0.96, 1])})`,
						zIndex: 30,
						padding: '24px 36px 24px 36px',
						display: 'flex',
						flexDirection: 'column',
						gap: 20,
					}}
				>
					{/* Winner Answer Big Card (STARTS RIGHT FROM TOP, EXPANDED TO EDGES!) */}
					<div
						style={{
							background:
								'linear-gradient(135deg, #15803d 0%, #166534 60%, #14532d 100%)',
							borderRadius: 24,
							border: '3px solid #4ade80',
							borderTop: '4px solid #86efac',
							borderBottom: '8px solid #052e16',
							padding: '20px 44px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							boxShadow:
								'0 12px 0 #052e16, 0 0 45px rgba(34, 197, 94, 0.5), 0 20px 40px rgba(0,0,0,0.8)',
							transform: `scale(${1 + Math.sin(frame / 6) * 0.01})`,
						}}
					>
						<div style={{display: 'flex', alignItems: 'center', gap: 32}}>
							{/* Large Glowing Coin */}
							<div
								style={{
									width: 92,
									height: 92,
									borderRadius: 26,
									background:
										'linear-gradient(180deg, #22c55e 0%, #15803d 100%)',
									border: '3px solid #86efac',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									fontSize: 52,
									fontWeight: 900,
									color: '#ffffff',
									boxShadow:
										'0 6px 14px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.4)',
								}}
							>
								{currentQuiz.correctLetter}
							</div>

							<div>
								<div
									style={{
										fontSize: 20,
										fontWeight: 900,
										color: '#86efac',
										letterSpacing: 2,
										textTransform: 'uppercase',
									}}
								>
									CORRECT ANSWER
								</div>
								{/* Winner Answer Text: LARGE 76px EXTRA BOLD */}
								<div
									style={{
										fontSize: 76,
										fontWeight: 900,
										color: '#ffffff',
										textShadow: '0 3px 14px rgba(0,0,0,0.9)',
										letterSpacing: 0.5,
									}}
								>
									{currentQuiz.options[currentQuiz.correctIndex]}
								</div>
							</div>
						</div>

						<div
							style={{
								fontSize: 70,
								filter: 'drop-shadow(0 0 16px rgba(134, 239, 172, 1))',
							}}
						>
							✅
						</div>
					</div>

					{/* Question Recap Strip */}
					<div
						style={{
							background: '#eff6ff',
							border: '2px solid #bfdbfe',
							borderLeft: '8px solid #2563eb',
							borderRadius: 20,
							padding: '16px 36px',
							display: 'flex',
							alignItems: 'center',
							gap: 16,
							boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
						}}
					>
						<span style={{fontSize: 32}}>❓</span>
						<span
							style={{
								fontSize: 38,
								fontWeight: 900,
								color: '#1e3a8a',
								lineHeight: 1.3,
							}}
						>
							<span style={{color: '#2563eb', marginRight: 10}}>
								ప్రశ్న {quizIndex + 1}:
							</span>
							{currentQuiz.question}
						</span>
					</div>

					{/* Explanation Area: Full-Width Pristine White Card (Zero Small Cards, Rich Explanation) */}
					<div
						style={{
							background: '#ffffff',
							borderRadius: 24,
							border: '2px solid #cbd5e1',
							borderTop: '6px solid #16a34a',
							padding: '36px 48px',
							boxShadow: '0 12px 35px rgba(15, 23, 42, 0.08)',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between',
							flex: 1,
						}}
					>
						<div>
							{/* Section Header */}
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 16,
									marginBottom: 24,
								}}
							>
								<span style={{fontSize: 42}}>📖</span>
								<h2
									style={{
										margin: 0,
										fontSize: 40,
										fontWeight: 900,
										color: '#15803d',
										letterSpacing: 0.5,
									}}
								>
									{currentQuiz.explanation.title}
								</h2>
							</div>

							{/* Main Detailed Explanation */}
							<div
								style={{
									background: '#f0fdf4',
									border: '2px solid #bbf7d0',
									borderLeft: '10px solid #16a34a',
									borderRadius: 18,
									padding: '28px 36px',
									marginBottom: 24,
								}}
							>
								<p
									style={{
										fontSize: 50,
										fontWeight: 900,
										color: '#0f172a',
										lineHeight: 1.55,
										margin: 0,
									}}
								>
									{currentQuiz.explanation.description}
								</p>
							</div>

							{/* In-depth Context & Highlights Box (fills the page beautifully) */}
							<div
								style={{
									background: '#f8fafc',
									border: '2px solid #e2e8f0',
									borderLeft: '10px solid #2563eb',
									borderRadius: 18,
									padding: '24px 36px',
									display: 'flex',
									flexDirection: 'column',
									gap: 10,
								}}
							>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 12,
									}}
								>
									<span style={{fontSize: 28}}>⚡</span>
									<span
										style={{
											fontSize: 24,
											fontWeight: 900,
											color: '#1e40af',
											letterSpacing: 1.5,
											textTransform: 'uppercase',
										}}
									>
										విశేషాలు & ప్రాముఖ్యత (KEY INSIGHT)
									</span>
								</div>
								<p
									style={{
										fontSize: 38,
										fontWeight: 800,
										color: '#334155',
										lineHeight: 1.5,
										margin: 0,
									}}
								>
									ఈ ప్రశ్నకు సరైన సమాధానం{' '}
									<span style={{color: '#16a34a', fontWeight: 900}}>
										"{currentQuiz.options[currentQuiz.correctIndex]}"
									</span>
									. భారత క్రికెట్ జట్టు మరియు టీ20 / ఐపీఎల్ టోర్నమెంట్లలో ఈ అంశం ఎంతో ప్రాముఖ్యత కలిగినది.
								</p>
							</div>
						</div>

						{/* Footer Tag */}
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								borderTop: '2px solid #f1f5f9',
								paddingTop: 16,
							}}
						>
							<span
								style={{
									fontSize: 20,
									fontWeight: 900,
									color: '#64748b',
									letterSpacing: 1.5,
								}}
							>
								🏏 INDIAN CRICKET TRIVIA • QUESTION #{quizIndex + 1}
							</span>
							<span
								style={{
									fontSize: 20,
									fontWeight: 900,
									color: '#15803d',
								}}
							>
								100% VERIFIED ANSWER ✅
							</span>
						</div>
					</div>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

export const TeluguQuizSeries: React.FC = () => {
	return (
		<AbsoluteFill>
			<Series>
				{QUIZ_QUESTIONS.map((_, i) => (
					<Series.Sequence key={i} durationInFrames={630}>
						<TeluguQuiz quizIndex={i} />
					</Series.Sequence>
				))}
			</Series>
		</AbsoluteFill>
	);
};
