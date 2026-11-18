import {NewComposition} from './NewComposition';
import React from 'react';
import {Composition, Folder} from 'remotion';
import {
	KohliVsBabarVideo,
	KOHLI_BABAR_FPS,
	KOHLI_BABAR_TOTAL_FRAMES,
} from './KohliVsBabar';
import {
	NarasannapetaVideo,
	ActPreview,
	NARASANNAPETA_TOTAL_FRAMES,
	CHAPTERS,
	ACTS,
} from './Narasannapeta';
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


			{/* Full Video Master Series */}

			{/* Individual Scene Previews for Quick Review */}

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
			{/* ================= NARASANNAPETA POLITICAL MATRIX (45 CHAPTERS · 6 ACTS) ================= */}
			<Composition
				id="Narasannapeta"
				component={NarasannapetaVideo}
				durationInFrames={15725}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{ timeScale: 524.18 / 578 }}
			/>

			{/* Act-by-Act Quick Previews */}
			<Folder name="Narasannapeta-Acts">
				{ACTS.map((act, idx) => {
					const actNum = idx + 1;
					// Accurate synced frame counts matching the Telugu audio per Act
					const actSyncedFrames = [2925, 1968, 4119, 2537, 1883, 2175];
					return (
						<Composition
							key={act.key}
							id={`Narasannapeta-Act${actNum}-${act.key}`}
							component={ActPreview}
							durationInFrames={actSyncedFrames[idx]}
							fps={30}
							width={1920}
							height={1080}
							defaultProps={{ actNumber: actNum }}
						/>
					);
				})}
			</Folder>

			{/* ================= VIRAT KOHLI VS BABAR AZAM (36 CHAPTERS · 6 ACTS) ================= */}
			<Composition
				id="KohliVsBabar"
				component={KohliVsBabarVideo}
				durationInFrames={KOHLI_BABAR_TOTAL_FRAMES}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{ timeScale: 1 }}
			/>

			<Composition
				id="KohliVsBabar-15Min"
				component={KohliVsBabarVideo}
				durationInFrames={KOHLI_BABAR_TOTAL_FRAMES}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{ timeScale: 1 }}
			/>

			<Composition
				id="NewComposition"
				component={NewComposition}
				durationInFrames={16150}
				fps={30}
				width={1920}
				height={1080}
			/>
		</>
	);
};

export const RemotionRoot = Root;

