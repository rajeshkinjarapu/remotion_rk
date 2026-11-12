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
} from 'remotion';
import {z} from 'zod';
import questionsData from './questions.json';
import quizTimingsData from './quiz_timings.json';
import quizVideosData from './quiz_videos.json';
import {QUIZ_THEMES, QuizTheme} from './themes';

export interface QuizQuestionItem {
	category: string;
	question: string;
	theme?: string;
	questionImage?: string;
	questionImageTag?: string;
	answerImage?: string;
	answerImageTag?: string;
	options: string[];
	correctIndex: number;
	correctLetter: string;
	explanation: {
		title: string;
		description: string;
		points?: Array<{
			icon: string;
			label: string;
			text: string;
		}>;
	};
}

export interface QuizTimingItem {
	quizIndex: number;
	qAudio?: string;
	qDurSec?: number;
	qFrames?: number;
	qAudioStart?: number;
	timerStart?: number;
	timerEnd?: number;
	ansAudio?: string;
	ansDurSec?: number;
	ansFrames?: number;
	ansAudioStart?: number;
	holdFrames?: number;
	durationInFrames: number;
}

export interface QuizVideoBundle {
	id: string;
	title: string;
	themeId: string;
	bgMusic: string;
	timings?: QuizTimingItem[];
	questions: QuizQuestionItem[];
}

export const QUIZ_QUESTIONS: QuizQuestionItem[] =
	questionsData as unknown as QuizQuestionItem[];

export const QUIZ_TIMINGS: QuizTimingItem[] =
	quizTimingsData as unknown as QuizTimingItem[];

export const TOTAL_QUIZ_FRAMES = QUIZ_TIMINGS && QUIZ_TIMINGS.length > 0
	? QUIZ_TIMINGS.reduce((acc, t) => acc + (t.durationInFrames || 630), 0)
	: QUIZ_QUESTIONS.length * 630;

export const DEFAULT_TEMPLATE_ID = 'cricket-blue';
export const DEFAULT_BG_MUSIC = 'Youtube Free Musics/smooth_ambient_quiz_bgm.mp3';

export const QUIZ_VIDEOS: QuizVideoBundle[] =
	quizVideosData as unknown as QuizVideoBundle[];

export const teluguQuizSchema = z.object({
	quizIndex: z
		.number()
		.min(0)
		.max(QUIZ_QUESTIONS.length - 1)
		.default(0),
	templateId: z.string().default(DEFAULT_TEMPLATE_ID),
	bgMusic: z.string().default(DEFAULT_BG_MUSIC),
	showPhotos: z.boolean().default(false),
});

export type TeluguQuizProps = {
	quizIndex?: number;
	templateId?: string;
	includeBgMusic?: boolean;
	bgMusic?: string;
	showPhotos?: boolean;
	questions?: QuizQuestionItem[];
	timings?: QuizTimingItem[];
};

export const TeluguQuiz: React.FC<TeluguQuizProps> = ({
	quizIndex = 0,
	templateId = DEFAULT_TEMPLATE_ID,
	includeBgMusic = false,
	bgMusic = DEFAULT_BG_MUSIC,
	showPhotos = false,
	questions,
	timings,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const questionsList = questions || QUIZ_QUESTIONS;
	const timingsList = timings || QUIZ_TIMINGS;
	const currentQuiz = questionsList[quizIndex] || questionsList[0];
	const currentTiming = timingsList && timingsList[quizIndex] ? timingsList[quizIndex] : null;

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

	// ==================== TIMELINE CONFIGURATION ====================
	// If timing object is provided (e.g. from voiceover generation), use dynamic sync
	// Otherwise use the standard 630 frames (Page 1 = 330 frames, Page 2 = 300 frames)
	const page1End = currentTiming?.timerEnd ? currentTiming.timerEnd + 15 : 335;
	const transitionStart = currentTiming?.timerEnd || 330;
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

	const typeStart = 20;
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

	// Timer calculation on Page 1 (5 seconds countdown)
	const timerStart = currentTiming?.timerStart || 170;
	const timerEnd = currentTiming?.timerEnd || 320;
	const isTimeUp = frame >= timerEnd;

	const remainingSeconds = isTimeUp
		? 0
		: Math.max(1, Math.ceil((timerEnd - frame) / 30));

	const ringProgress = interpolate(frame, [timerStart, timerEnd], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

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

	// Option timings (One by one vertical entry)
	const optionEntryFrames = [90, 110, 130, 150];

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

			{/* ================= PAGE 1: QUESTION + 2x2 OPTIONS + BOTTOM TIMER ================= */}
			{frame <= page1End + 15 && (
				<AbsoluteFill
					style={{
						opacity: page1Opacity,
						transform: `scale(${page1Scale})`,
						pointerEvents: frame > page1End ? 'none' : 'auto',
					}}
				>
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
					{[0, 30, 60, 90, 120].map((offset, i) => (
						<Sequence
							key={`tick-${i}`}
							from={timerStart + offset}
							durationInFrames={15}
						>
							<Audio src={staticFile('Youtube Video/timer_tick.wav')} volume={0.8} />
						</Sequence>
					))}
					<Sequence from={timerEnd} durationInFrames={45}>
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
							{/* Question Box Content: Dedicated Starting Q.NO Badge + Text */}
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 28,
									width: '100%',
								}}
							>
								{/* Dedicated Q.NO Starting Badge Box */}
								<div
									style={{
										background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
										color: '#ffffff',
										borderRadius: 18,
										border: '3px solid #93c5fd',
										padding: '12px 28px',
										fontSize: 48,
										fontWeight: 900,
										boxShadow: '0 6px 16px rgba(37, 99, 235, 0.35)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										flexShrink: 0,
										letterSpacing: 1,
									}}
								>
									Q.{quizIndex + 1}
								</div>

								{/* Question Text */}
								<div
									style={{
										fontSize:
											currentQuiz.question.length > 65
												? 56
												: currentQuiz.question.length > 45
													? 64
													: 72,
										fontWeight: 900,
										color: '#0f172a',
										lineHeight: 1.34,
										letterSpacing: 0.3,
										textAlign: 'left',
									}}
								>
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
					</div>

					{/* ================= 2x2 KBC-STYLE OPTIONS GRID ================= */}
					<div
						style={{
							position: 'absolute',
							top: 325,
							left: 40,
							right: 40,
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gridTemplateRows: '220px 220px',
							rowGap: 24,
							columnGap: 40,
							zIndex: 10,
						}}
					>
						{currentQuiz.options.map((option, idx) => {
							const entryFrame = optionEntryFrames[idx] || 90;
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

										{/* Option Text */}
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

					{/* ================= BOTTOM COUNTDOWN TIMER (SITS ABOVE GREEN TICKER) ================= */}
					<div
						style={{
							position: 'absolute',
							bottom: 84,
							left: '50%',
							transform: `translateX(-50%) scale(${tickPulse})`,
							zIndex: 20,
							display: 'flex',
							alignItems: 'center',
							gap: 20,
							background: '#ffffff',
							border: '2px solid #cbd5e1',
							borderTop: isTimeUp
								? '4px solid #16a34a'
								: remainingSeconds <= 2
									? '4px solid #ef4444'
									: '4px solid #2563eb',
							borderRadius: 50,
							padding: '8px 36px',
							boxShadow: isTimeUp
								? '0 8px 30px rgba(22, 163, 74, 0.25)'
								: '0 8px 30px rgba(15, 23, 42, 0.12)',
							opacity: interpolate(
								frame,
								[timerStart - 15, timerStart],
								[0, 1],
								{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
							),
						}}
					>
						<span
							style={{
								fontSize: 24,
								fontWeight: 900,
								color: '#1e40af',
								letterSpacing: 1.5,
							}}
						>
							⏳ COUNTDOWN
						</span>

						{/* Circular Timer Ring */}
						<div
							style={{
								width: 64,
								height: 64,
								position: 'relative',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<svg
								width="64"
								height="64"
								style={{transform: 'rotate(-90deg)'}}
							>
								<circle
									cx="32"
									cy="32"
									r="26"
									stroke="#e2e8f0"
									strokeWidth="6"
									fill="none"
								/>
								<circle
									cx="32"
									cy="32"
									r="26"
									stroke={
										isTimeUp
											? '#16a34a'
											: remainingSeconds <= 2
												? '#ef4444'
												: '#2563eb'
									}
									strokeWidth="6"
									fill="none"
									strokeDasharray={2 * Math.PI * 26}
									strokeDashoffset={2 * Math.PI * 26 * (1 - ringProgress)}
									strokeLinecap="round"
									style={{
										filter: isTimeUp
											? 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.7))'
											: remainingSeconds <= 2
												? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.7))'
												: 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.5))',
									}}
								/>
							</svg>
							<span
								style={{
									position: 'absolute',
									fontSize: isTimeUp ? 15 : 28,
									fontWeight: 900,
									color: isTimeUp
										? '#16a34a'
										: remainingSeconds <= 2
											? '#ef4444'
											: '#0f172a',
									lineHeight: 1,
								}}
							>
								{isTimeUp ? '0' : remainingSeconds}
							</span>
						</div>

						<span
							style={{
								fontSize: 22,
								fontWeight: 900,
								color: isTimeUp
									? '#16a34a'
									: remainingSeconds <= 2
										? '#ef4444'
										: '#d97706',
								letterSpacing: 1.5,
							}}
						>
							{isTimeUp ? 'TIME UP! 🔔' : `${remainingSeconds} SECONDS`}
						</span>
					</div>
				</AbsoluteFill>
			)}

			{/* ================= PAGE 2: ANSWER & IN-DEPTH EXPLANATION PAGE ================= */}
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
						padding: '20px 40px 86px 40px',
						display: 'flex',
						flexDirection: 'column',
						gap: 16,
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
								{/* Winner Answer Text */}
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

					{/* Explanation Area: Full-Width Pristine White Card */}
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
									{currentQuiz.explanation?.title || 'సరైన సమాధానం వివరణ'}
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
									{currentQuiz.explanation?.description || `${currentQuiz.options[currentQuiz.correctIndex]} సరైన సమాధానం.`}
								</p>
							</div>

							{/* In-depth Context & Highlights Box */}
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
									. ఈ అంశం పోటీ పరీక్షలు మరియు జనరల్ నాలెడ్జ్ పరంగా ఎంతో ముఖ్యమైనది.
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
								🏏 TELUGU QUIZ • QUESTION #{quizIndex + 1}
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

			{/* ================= PERSISTENT BOTTOM GREEN TICKER: SUBSCRIBE MARQUEE (TELUGU) ================= */}
			<div
				style={{
					position: 'absolute',
					bottom: 16,
					left: 40,
					right: 40,
					height: 56,
					background:
						'linear-gradient(135deg, #15803d 0%, #16a34a 50%, #15803d 100%)',
					border: '2px solid #86efac',
					borderRadius: 18,
					boxShadow: '0 6px 20px rgba(22, 163, 74, 0.35)',
					display: 'flex',
					alignItems: 'center',
					overflow: 'hidden',
					zIndex: 50,
					padding: '0 12px',
				}}
			>
				{/* Fixed Subscribe Badge */}
				<div
					style={{
						background: '#dc2626',
						color: '#ffffff',
						borderRadius: 12,
						padding: '6px 18px',
						fontSize: 18,
						fontWeight: 900,
						display: 'flex',
						alignItems: 'center',
						gap: 8,
						flexShrink: 0,
						boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
						zIndex: 2,
						letterSpacing: 1,
					}}
				>
					<span>🔔</span>
					<span>SUBSCRIBE</span>
				</div>

				{/* Smooth Scrolling Marquee (Right to Left in Telugu) */}
				<div
					style={{
						flex: 1,
						overflow: 'hidden',
						whiteSpace: 'nowrap',
						position: 'relative',
						height: '100%',
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<div
						style={{
							display: 'inline-block',
							whiteSpace: 'nowrap',
							fontSize: 26,
							fontWeight: 900,
							color: '#ffffff',
							letterSpacing: 1,
							textShadow: '0 2px 4px rgba(0,0,0,0.4)',
							transform: `translateX(${1800 - ((frame * 4.5) % 3600)}px)`,
						}}
					>
						🏏 ఇలాంటి మరిన్ని క్విజ్ సంబంధించిన వీడియోల కోసం మన ఛానెల్‌ని ఇప్పుడే సబ్‌స్క్రైబ్ చేసుకోండి! 👍 లైక్ చేయండి & మీ మిత్రులతో షేర్ చేయండి! 🔔 Please Subscribe & Support! 🌟
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const TeluguQuizSeries: React.FC<{
	templateId?: string;
	bgMusic?: string;
	questions?: QuizQuestionItem[];
	timings?: QuizTimingItem[];
}> = ({
	templateId = DEFAULT_TEMPLATE_ID,
	bgMusic = DEFAULT_BG_MUSIC,
	questions,
	timings,
}) => {
	const questionsList = questions || QUIZ_QUESTIONS;
	const timingsList = timings || QUIZ_TIMINGS;

	return (
		<AbsoluteFill>
			{/* Continuous Smooth Background Music Across Full Video */}
			{bgMusic && (
				<Audio
					src={staticFile(bgMusic)}
					volume={(f) =>
						interpolate(f, [0, 60], [0, 0.11], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						})
					}
					loop
				/>
			)}
			<Series>
				{questionsList.map((_, i) => {
					const timing = timingsList && timingsList[i] ? timingsList[i] : null;
					const dur = timing?.durationInFrames || 630;
					return (
						<Series.Sequence key={i} durationInFrames={dur}>
							<TeluguQuiz
								quizIndex={i}
								templateId={templateId}
								includeBgMusic={false}
								questions={questionsList}
								timings={timingsList}
							/>
						</Series.Sequence>
					);
				})}
			</Series>
		</AbsoluteFill>
	);
};
