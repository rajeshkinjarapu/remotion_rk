import React, {useMemo} from 'react';
import {
	AbsoluteFill,
	Audio,
	Sequence,
	Series,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {loadFont} from '@remotion/google-fonts/AnekTelugu';
import {z} from 'zod';
import questionsData from './questions.json';
import quizTimingsData from './quiz_timings.json';
import quizVideosData from './quiz_videos.json';
import {QUIZ_THEMES, QuizTheme} from './themes';

const {fontFamily: teluguFont} = loadFont();

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
	qAudio: string;
	qDurSec: number;
	qFrames: number;
	qAudioStart: number;
	timerStart: number;
	timerEnd: number;
	ansAudio: string;
	ansDurSec: number;
	ansFrames: number;
	ansAudioStart: number;
	holdFrames: number;
	durationInFrames: number;
}

export const QUIZ_QUESTIONS: QuizQuestionItem[] = (
	questionsData as unknown as QuizQuestionItem[]
).slice(0, 20);

export const QUIZ_TIMINGS: QuizTimingItem[] = quizTimingsData as QuizTimingItem[];

export const TOTAL_QUIZ_FRAMES = QUIZ_TIMINGS.reduce(
	(acc, t) => acc + t.durationInFrames,
	0,
);

export const DEFAULT_TEMPLATE_ID = 'royal-blue';
export const DEFAULT_BG_MUSIC = 'Youtube Free Musics/smooth_ambient_quiz_bgm.mp3';

export const teluguQuizSchema = z.object({
	quizIndex: z
		.number()
		.min(0)
		.max(QUIZ_QUESTIONS.length - 1)
		.default(0),
	templateId: z.string().default(DEFAULT_TEMPLATE_ID),
	bgMusic: z.string().default(DEFAULT_BG_MUSIC),
});

export interface QuizVideoBundle {
	id: string;
	title: string;
	themeId: string;
	bgMusic: string;
	questions: QuizQuestionItem[];
}

export const QUIZ_VIDEOS: QuizVideoBundle[] = quizVideosData as unknown as QuizVideoBundle[];

export type TeluguQuizProps = {
	quizIndex?: number;
	templateId?: string;
	includeBgMusic?: boolean;
	bgMusic?: string;
	questions?: QuizQuestionItem[];
	timings?: QuizTimingItem[];
};

export const TeluguQuiz: React.FC<TeluguQuizProps> = ({
	quizIndex = 0,
	templateId = DEFAULT_TEMPLATE_ID,
	includeBgMusic = true,
	bgMusic = DEFAULT_BG_MUSIC,
	questions,
	timings,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const questionsList = questions || QUIZ_QUESTIONS;
	const timingsList = timings || QUIZ_TIMINGS;
	const currentQuiz = questionsList[quizIndex] || questionsList[0];
	const currentTiming = timingsList[quizIndex] || timingsList[0];

	// ==================== SINGLE CONSISTENT TEMPLATE FOR ENTIRE VIDEO ====================
	const currentTheme: QuizTheme = useMemo(() => {
		const found = QUIZ_THEMES.find(
			(t) => t.id === templateId || t.name.toLowerCase() === templateId.toLowerCase(),
		);
		return found || QUIZ_THEMES[0];
	}, [templateId]);

	// ==================== DYNAMIC TIMINGS SYNCED WITH AUDIO ====================
	const {
		qAudio,
		qAudioStart,
		qFrames,
		timerStart,
		timerEnd,
		ansAudio,
		ansAudioStart,
		ansFrames,
		durationInFrames,
	} = currentTiming;

	const isTimeUp = frame >= timerEnd;
	const isTimerActive = frame >= timerStart && frame < timerEnd;

	// Timer remaining seconds (5, 4, 3, 2, 1, 0)
	const remainingSeconds = isTimeUp
		? 0
		: frame < timerStart
			? 5
			: Math.max(1, Math.ceil((timerEnd - frame) / 30));

	const ringProgress = interpolate(frame, [timerStart, timerEnd], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Dynamic tick pulse on each second
	const tickPulse = isTimerActive
		? 1 + Math.sin((((frame - timerStart) % 30) / 30) * Math.PI) * 0.18
		: 1;

	// Question Typewriter
	const graphemes = useMemo(() => {
		if (typeof Intl !== 'undefined' && Intl.Segmenter) {
			const segmenter = new Intl.Segmenter('te', {granularity: 'grapheme'});
			return Array.from(segmenter.segment(currentQuiz.question), (s) => s.segment);
		}
		return Array.from(currentQuiz.question);
	}, [currentQuiz.question]);

	const typeStart = 10;
	const typeDuration = Math.min(qFrames, 70);
	const typedProgress = interpolate(
		frame,
		[typeStart, typeStart + typeDuration],
		[0, graphemes.length],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);
	const visibleCharCount = Math.floor(typedProgress);
	const displayedQuestion = graphemes.slice(0, visibleCharCount).join('');
	const isTyping = frame >= typeStart && frame < typeStart + typeDuration;


	// 4 Letter Badges with Distinct Colors
	const optionLetterStyles = [
		{
			bg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
			border: '#38bdf8',
			glow: 'rgba(56, 189, 248, 0.5)',
		},
		{
			bg: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
			border: '#fde047',
			glow: 'rgba(250, 204, 21, 0.5)',
		},
		{
			bg: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
			border: '#c084fc',
			glow: 'rgba(192, 132, 252, 0.5)',
		},
		{
			bg: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
			border: '#fb7185',
			glow: 'rgba(251, 113, 133, 0.5)',
		},
	];

	// Timer theme color transitions
	const timerAccentColor = isTimeUp
		? '#10B981'
		: remainingSeconds <= 2
			? '#EF4444'
			: remainingSeconds <= 3
				? '#F59E0B'
				: '#38BDF8';

	const timerGlowColor = isTimeUp
		? 'rgba(16, 185, 129, 0.65)'
		: remainingSeconds <= 2
			? 'rgba(239, 68, 68, 0.65)'
			: remainingSeconds <= 3
				? 'rgba(245, 158, 11, 0.55)'
				: 'rgba(56, 189, 248, 0.5)';

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#090D1A',
				fontFamily: `${teluguFont}, 'Segoe UI', system-ui, sans-serif`,
				color: '#FFFFFF',
				overflow: 'hidden',
			}}
		>
			{/* ================= AUDIO: SMOOTH AMBIENT BACKGROUND MUSIC ================= */}
			{includeBgMusic && bgMusic && (
				<Audio
					src={staticFile(bgMusic)}
					volume={(f) =>
						interpolate(f, [0, 45], [0, 0.11], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						})
					}
					loop
				/>
			)}

			{/* ================= AUDIO: QUESTION VOICEOVER ================= */}
			<Sequence from={qAudioStart} durationInFrames={qFrames}>
				<Audio src={staticFile(qAudio)} volume={1} />
			</Sequence>

			{/* ================= AUDIO: 5-SECOND TIMER TICKS ================= */}
			{[0, 30, 60, 90, 120].map((offset, i) => (
				<Sequence
					key={`tick-${i}`}
					from={timerStart + offset}
					durationInFrames={18}
				>
					<Audio src={staticFile('Quiz Video/timer_tick.wav')} volume={0.8} />
				</Sequence>
			))}

			{/* ================= AUDIO: TIME-UP BUZZER CHIME ================= */}
			<Sequence from={timerEnd} durationInFrames={45}>
				<Audio src={staticFile('Quiz Video/time_up.wav')} volume={0.85} />
			</Sequence>

			{/* ================= AUDIO: CORRECT ANSWER VOICEOVER ================= */}
			<Sequence from={ansAudioStart} durationInFrames={ansFrames}>
				<Audio src={staticFile(ansAudio)} volume={1} />
			</Sequence>

			{/* ================= CINEMATIC BACKGROUND ================= */}
			<AbsoluteFill
				style={{
					background: currentTheme.bgGradient,
				}}
			/>

			{/* Left Spotlight Beam */}
			<div
				style={{
					position: 'absolute',
					top: -180,
					left: -140,
					width: 900,
					height: 900,
					borderRadius: '50%',
					background: currentTheme.beam1Color,
					filter: 'blur(130px)',
					opacity: 0.9,
				}}
			/>

			{/* Right Spotlight Beam */}
			<div
				style={{
					position: 'absolute',
					bottom: -180,
					right: -140,
					width: 900,
					height: 900,
					borderRadius: '50%',
					background: currentTheme.beam2Color,
					filter: 'blur(130px)',
					opacity: 0.85,
				}}
			/>

			{/* Vignette */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background:
						'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.65) 100%)',
					pointerEvents: 'none',
				}}
			/>

			{/* ================= TOP PERSISTENT BROADCAST HEADING BADGE ================= */}
			<div
				style={{
					position: 'absolute',
					top: 18,
					left: '50%',
					transform: 'translateX(-50%)',
					height: 64,
					zIndex: 50,
					display: 'inline-flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 16,
					background:
						'linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 41, 59, 0.96) 100%)',
					backdropFilter: 'blur(20px)',
					WebkitBackdropFilter: 'blur(20px)',
					border: `2.5px solid ${currentTheme.accent}`,
					borderRadius: 999,
					padding: '0 42px',
					boxShadow: `0 0 30px rgba(56, 189, 248, 0.4), 0 10px 25px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
				}}
			>
				<span style={{fontSize: 30, filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))'}}>
					🏏
				</span>
				<span
					style={{
						fontSize: 28,
						fontWeight: 900,
						color: '#FFFFFF',
						letterSpacing: '0.04em',
						textShadow:
							'0 2px 12px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 255, 255, 0.2)',
						whiteSpace: 'nowrap',
					}}
				>
					{currentQuiz.category}
				</span>
			</div>

			{/* ================= MAIN CONTENT CONTAINER (NO EMPTY MIDDLE SPACE) ================= */}
			<div
				style={{
					position: 'absolute',
					top: 98,
					left: 56,
					right: 56,
					display: 'flex',
					flexDirection: 'column',
					gap: 26,
					zIndex: 30,
				}}
			>
				{/* 1. HERO QUESTION CARD (Enlarged Height, Elegant 2-Line Wrap, Sharp Typography) */}
				<div
					style={{
						height: 320,
						background:
							'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
						backdropFilter: 'blur(20px)',
						WebkitBackdropFilter: 'blur(20px)',
						borderRadius: 26,
						border: '1.5px solid rgba(255, 255, 255, 0.15)',
						borderTop: `5px solid ${currentTheme.accent}`,
						boxShadow: `0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px ${currentTheme.badgeGlow}`,
						padding: '28px 60px',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						textAlign: 'center',
						position: 'relative',
					}}
				>
					{/* Clean Number Badge: "1." instead of "ప్రశ్న 1" */}
					<div
						style={{
							position: 'absolute',
							top: -18,
							left: 44,
							background: currentTheme.badgeBg,
							border: `1.5px solid ${currentTheme.badgeBorder}`,
							borderRadius: 14,
							padding: '6px 22px',
							fontSize: 24,
							fontWeight: 900,
							color: '#FFFFFF',
							boxShadow: `0 8px 20px ${currentTheme.badgeGlow}`,
							letterSpacing: '0.04em',
						}}
					>
						{`${quizIndex + 1}.`}
					</div>

					{/* Question Text: Graceful 2-Line Wrapping with Optimal Line Height */}
					<div
						style={{
							fontFamily: teluguFont,
							fontSize:
								currentQuiz.question.length > 50
									? 58
									: currentQuiz.question.length > 32
										? 64
										: 70,
							fontWeight: 800,
							color: '#FFFFFF',
							lineHeight: 1.45,
							maxWidth: 1600,
							width: '100%',
							textAlign: 'center',
							wordBreak: 'break-word',
							whiteSpace: 'normal',
							textShadow:
								'0 2px 14px rgba(0, 0, 0, 0.8), 0 0 25px rgba(255, 255, 255, 0.1)',
						}}
					>
						{displayedQuestion}
						{isTyping && (
							<span
								style={{
									color: currentTheme.accent,
									fontWeight: 900,
									marginLeft: 4,
									opacity: frame % 10 < 5 ? 1 : 0,
									textShadow: `0 0 10px ${currentTheme.accent}`,
								}}
							>
								|
							</span>
						)}
					</div>
				</div>

				{/* 2. LOWER SECTION: 4 OPTIONS (ALL 4 IDENTICALLY ALIGNED IN SYMMETRICAL 2x2 GRID) */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 26,
					}}
				>
					{/* ROW 1: OPTION A (LEFT) & OPTION B (RIGHT) - EXACT SAME WIDTH */}
					<div
						style={{
							display: 'flex',
							gap: 40,
							height: 272,
						}}
					>
						{renderOptionBox(0, 'A', currentQuiz.options[0], optionLetterStyles[0])}
						{renderOptionBox(1, 'B', currentQuiz.options[1], optionLetterStyles[1])}
					</div>

					{/* ROW 2: OPTION C (LEFT) & OPTION D (RIGHT) - EXACT SAME WIDTH WITH COMPACT ROUND TIMER */}
					<div
						style={{
							display: 'flex',
							gap: 40,
							height: 272,
						}}
					>
						{renderOptionBox(2, 'C', currentQuiz.options[2], optionLetterStyles[2])}
						{renderOptionBox(3, 'D', currentQuiz.options[3], optionLetterStyles[3], true)}
					</div>
				</div>
			</div>

		</AbsoluteFill>
	);

	// Helper function to render each balanced option card
	function renderOptionBox(
		index: number,
		letter: string,
		text: string,
		letterStyle: {bg: string; border: string; glow: string},
		hasTimer: boolean = false,
	) {
		const isCorrect = currentQuiz.correctIndex === index;
		const showCorrectHighlight = isTimeUp && isCorrect;
		const showDim = isTimeUp && !isCorrect;

		// Staggered entry animation
		const entryFrame = 25 + index * 10;
		const optSpring = spring({
			frame: frame - entryFrame,
			fps,
			config: {damping: 16, stiffness: 130},
		});

		return (
			<div
				key={index}
				style={{
					flex: 1,
					opacity: showDim ? 0.35 : optSpring,
					transform: `scale(${interpolate(optSpring, [0, 1], [0.94, 1])}) translateY(${interpolate(
						optSpring,
						[0, 1],
						[20, 0],
					)}px)`,
					background: showCorrectHighlight
						? 'linear-gradient(135deg, rgba(6, 78, 59, 0.95) 0%, rgba(6, 95, 70, 0.98) 100%)'
						: 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.94) 100%)',
					backdropFilter: 'blur(16px)',
					WebkitBackdropFilter: 'blur(16px)',
					borderRadius: 24,
					border: showCorrectHighlight
						? '3px solid #10B981'
						: '1.5px solid rgba(255, 255, 255, 0.14)',
					boxShadow: showCorrectHighlight
						? '0 16px 45px rgba(0, 0, 0, 0.6), 0 0 35px rgba(16, 185, 129, 0.65)'
						: '0 12px 30px rgba(0, 0, 0, 0.4)',
					padding: '0 36px',
					display: 'flex',
					alignItems: 'center',
					gap: 24,
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				{/* Top-Right Glow Accent for Winning Answer */}
				{showCorrectHighlight && (
					<div
						style={{
							position: 'absolute',
							top: -50,
							right: -50,
							width: 140,
							height: 140,
							borderRadius: '50%',
							background: 'rgba(16, 185, 129, 0.5)',
							filter: 'blur(40px)',
						}}
					/>
				)}

				{/* Letter Badge Coin */}
				<div
					style={{
						width: 82,
						height: 82,
						minWidth: 82,
						borderRadius: 22,
						background: showCorrectHighlight
							? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
							: letterStyle.bg,
						border: `2.5px solid ${
							showCorrectHighlight ? '#A7F3D0' : letterStyle.border
						}`,
						boxShadow: `0 0 25px ${
							showCorrectHighlight ? 'rgba(16, 185, 129, 0.8)' : letterStyle.glow
						}`,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						fontSize: 42,
						fontWeight: 900,
						color: '#FFFFFF',
					}}
				>
					{letter}
				</div>

				{/* Option Text */}
				<div
					style={{
						flex: 1,
						fontFamily: teluguFont,
						fontSize: text.length > 25 ? 42 : text.length > 15 ? 48 : 54,
						fontWeight: 800,
						color: showCorrectHighlight ? '#A7F3D0' : '#FFFFFF',
						lineHeight: 1.25,
						letterSpacing: '0.01em',
						textShadow: showCorrectHighlight
							? '0 0 20px rgba(16, 185, 129, 0.5)'
							: '0 2px 10px rgba(0, 0, 0, 0.7)',
					}}
				>
					{text}
				</div>

				{/* Compact Round Circular Timer at the right end of Option D */}
				{hasTimer && !showCorrectHighlight && (
					<div
						style={{
							width: 76,
							height: 76,
							minWidth: 76,
							borderRadius: '50%',
							background: 'rgba(15, 23, 42, 0.92)',
							border: `2.5px solid ${timerAccentColor}`,
							boxShadow: `0 0 18px ${timerGlowColor}`,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							position: 'relative',
							transform: `scale(${tickPulse})`,
							transition: 'all 0.15s ease-out',
						}}
					>
						{/* Outer Rotating Dotted Orbit Ring */}
						<svg
							width="76"
							height="76"
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								transform: `rotate(${frame * 3}deg)`,
							}}
						>
							<circle
								cx="38"
								cy="38"
								r="34"
								stroke="rgba(255, 255, 255, 0.15)"
								strokeWidth="1.5"
								strokeDasharray="3 6"
								fill="none"
							/>
						</svg>

						{/* SVG Countdown Depleting Arc */}
						<svg
							width="76"
							height="76"
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								transform: 'rotate(-90deg)',
							}}
						>
							<circle
								cx="38"
								cy="38"
								r="28"
								stroke="rgba(255, 255, 255, 0.1)"
								strokeWidth="5"
								fill="none"
							/>
							<circle
								cx="38"
								cy="38"
								r="28"
								stroke={timerAccentColor}
								strokeWidth="5"
								fill="none"
								strokeLinecap="round"
								strokeDasharray={2 * Math.PI * 28}
								strokeDashoffset={2 * Math.PI * 28 * (1 - ringProgress)}
								style={{
									filter: `drop-shadow(0 0 6px ${timerAccentColor})`,
								}}
							/>
						</svg>

						{/* Center Countdown Second Digits */}
						<span
							style={{
								fontSize: 30,
								fontWeight: 900,
								color: '#FFFFFF',
								lineHeight: 1,
								textShadow: `0 0 12px ${timerAccentColor}`,
								zIndex: 5,
								fontVariantNumeric: 'tabular-nums',
							}}
						>
							{isTimeUp ? '0' : remainingSeconds}
						</span>
					</div>
				)}

				{/* Winning Answer Checkmark Badge */}
				{showCorrectHighlight && (
					<div
						style={{
							width: 62,
							height: 62,
							minWidth: 62,
							borderRadius: '50%',
							background: '#10B981',
							border: '2px solid #A7F3D0',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							color: '#FFFFFF',
							fontSize: 36,
							fontWeight: 900,
							boxShadow: '0 0 25px rgba(16, 185, 129, 0.85)',
						}}
					>
						✓
					</div>
				)}
			</div>
		);
	}
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
					const timing = timingsList[i] || timingsList[0];
					return (
						<Series.Sequence key={i} durationInFrames={timing.durationInFrames}>
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
