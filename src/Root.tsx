import {NewComposition} from './NewComposition';
import React from 'react';
import {Composition, Folder} from 'remotion';
import {
	TeluguQuiz,
	TeluguQuizSeries,
	teluguQuizSchema,
	QUIZ_QUESTIONS,
	QUIZ_TIMINGS,
	TOTAL_QUIZ_FRAMES,
	DEFAULT_TEMPLATE_ID,
	DEFAULT_BG_MUSIC,
	QUIZ_VIDEOS,
} from './TeluguQuiz';
import {
	ViratVsSmithVideo,
	ViratVsSmithSingleScene,
	ViratVsSmithCyberDark,
	TOTAL_KOHLI_VS_SMITH_FRAMES,
	Scene1Intro,
	Scene2OverallStats,
	Scene3SenaMap,
	Scene4ImpactStyle,
	Scene5VerdictOutro,
} from './KohliVsSmith';

export const Root: React.FC = () => {
	return (
		<>
			{/* ================= VIRAT KOHLI VS STEVE SMITH (BROADCAST MOTION GRAPHICS) ================= */}
			{/* Complete Single Scene Full Video with Single Master Audio (Luxury White Studio Edition) */}
			<Composition
				id="ViratVsSmith-SingleScene"
				component={ViratVsSmithSingleScene}
				durationInFrames={TOTAL_KOHLI_VS_SMITH_FRAMES}
				fps={30}
				width={1920}
				height={1080}
			/>

			{/* Cyber Holographic 3D Dark Edition (Dark Stadium & Neon Mode) */}
			<Composition
				id="ViratVsSmith-CyberDark"
				component={ViratVsSmithCyberDark}
				durationInFrames={TOTAL_KOHLI_VS_SMITH_FRAMES}
				fps={30}
				width={1920}
				height={1080}
			/>

			{/* Full Video Master Series */}
			<Composition
				id="ViratVsSmith-ModernGreats"
				component={ViratVsSmithVideo}
				durationInFrames={TOTAL_KOHLI_VS_SMITH_FRAMES}
				fps={30}
				width={1920}
				height={1080}
			/>

			{/* Individual Scene Previews for Quick Review */}
			<Composition
				id="KohliVsSmith-Scene1-Intro"
				component={Scene1Intro}
				durationInFrames={1380}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{ hasAudio: true }}
			/>
			<Composition
				id="KohliVsSmith-Scene2-Stats"
				component={Scene2OverallStats}
				durationInFrames={1686}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{ hasAudio: true }}
			/>
			<Composition
				id="KohliVsSmith-Scene3-SENA"
				component={Scene3SenaMap}
				durationInFrames={3013}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{ hasAudio: true }}
			/>
			<Composition
				id="KohliVsSmith-Scene4-Style"
				component={Scene4ImpactStyle}
				durationInFrames={1085}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{ hasAudio: true }}
			/>
			<Composition
				id="KohliVsSmith-Scene5-Verdict"
				component={Scene5VerdictOutro}
				durationInFrames={1283}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{ hasAudio: true }}
			/>

			{/* ================= TELUGU QUIZ (ALL 20 MCQs IN ONE FULL VIDEO) ================= */}
			{/* Master 20-MCQ Full Video (All 20 MCQs continuous YouTube Video) */}

			{/* Quick Preview for a Single Question */}


			{/* All 50 Cricket Questions Individual Compositions */}
			{QUIZ_QUESTIONS.map((_, idx) => (
				<Composition
					key={idx}
					id={`Cricket-Q${idx + 1}`}
					component={TeluguQuiz}
					durationInFrames={630}
					fps={30}
					width={1920}
					height={1080}
					defaultProps={{
						quizIndex: idx,
						templateId: DEFAULT_TEMPLATE_ID,
						bgMusic: DEFAULT_BG_MUSIC,
					}}
				/>
			))}

			{/* ================= BATCH QUIZ VIDEOS (ALL VIDEOS DEFINED IN quiz_videos.json) ================= */}
			<Folder name="TeluguQuiz-BatchVideos">
				{QUIZ_VIDEOS.map((vid) => {
					const sanitizedId = vid.id.replace(/_/g, '-');
					const totalFrames = vid.timings && vid.timings.length > 0
						? vid.timings.reduce((acc, t) => acc + t.durationInFrames, 0)
						: vid.questions.length * 370;

					return (
						<Composition
							key={sanitizedId}
							id={`TeluguQuiz-${sanitizedId}`}
							component={TeluguQuizSeries}
							durationInFrames={totalFrames}
							fps={30}
							width={1920}
							height={1080}
							defaultProps={{
								templateId: vid.themeId,
								bgMusic: vid.bgMusic,
								questions: vid.questions,
								timings: vid.timings,
							}}
						/>
					);
				})}
			</Folder>
			<Composition
				id="NewComposition"
				component={NewComposition}
				durationInFrames={8447}
				fps={30}
				width={1920}
				height={1080}
			/>
		</>
	);
};

export const RemotionRoot = Root;

