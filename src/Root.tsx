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

export const Root: React.FC = () => {
	return (
		<>
			{/* ================= TELUGU QUIZ (ALL 20 MCQs IN ONE FULL VIDEO) ================= */}
			{/* Master 20-MCQ Full Video (All 20 MCQs continuous YouTube Video) */}
			<Composition
				id="TeluguQuiz-20MCQ-FullVideo"
				component={TeluguQuizSeries}
				durationInFrames={TOTAL_QUIZ_FRAMES}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					templateId: DEFAULT_TEMPLATE_ID,
					bgMusic: DEFAULT_BG_MUSIC,
				}}
			/>

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
		</>
	);
};

export const RemotionRoot = Root;

