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
} from './TeluguQuiz';
import {
	TravelVideo,
	Scene1Preview,
	Scene2Preview,
	Scene3Preview,
	Scene4Preview,
	Scene5Preview,
	Scene6Preview,
	TOTAL_FRAMES,
} from './TravelVideo';

export const Root: React.FC = () => {
	return (
		<>
			{/* ================= GUNTUR - RAYAGADA TRAVEL VIDEO ================= */}
			{/* Master Full Video (4m 33s / 8204 frames with Full Audio & Voice-Synced Telugu Captions) */}
			<Composition
				id="GunturRayagada-Full"
				component={TravelVideo}
				durationInFrames={TOTAL_FRAMES}
				fps={30}
				width={1920}
				height={1080}
			/>

			{/* Fast Preview Scenes Folder (Review individual acts with matching voice audio & subtitles) */}
			<Folder name="TravelVideo-Scenes">
				<Composition
					id="Scene1-Hook-AprilFool"
					component={Scene1Preview}
					durationInFrames={1200}
					fps={30}
					width={1920}
					height={1080}
				/>
				<Composition
					id="Scene2-Specs-RouteMap"
					component={Scene2Preview}
					durationInFrames={1200}
					fps={30}
					width={1920}
					height={1080}
				/>
				<Composition
					id="Scene3-Godavari-SigmaBoard"
					component={Scene3Preview}
					durationInFrames={1800}
					fps={30}
					width={1920}
					height={1080}
				/>
				<Composition
					id="Scene4-Vizag-TicketHack"
					component={Scene4Preview}
					durationInFrames={1800}
					fps={30}
					width={1920}
					height={1080}
				/>
				<Composition
					id="Scene5-EasternGhats-Odisha"
					component={Scene5Preview}
					durationInFrames={1200}
					fps={30}
					width={1920}
					height={1080}
				/>
				<Composition
					id="Scene6-Rayagada-Outro"
					component={Scene6Preview}
					durationInFrames={1004}
					fps={30}
					width={1920}
					height={1080}
				/>
			</Folder>

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
			<Composition
				id="TeluguQuiz-SinglePreview"
				component={TeluguQuiz}
				durationInFrames={QUIZ_TIMINGS[0].durationInFrames}
				fps={30}
				width={1920}
				height={1080}
				schema={teluguQuizSchema}
				defaultProps={{
					quizIndex: 0,
					templateId: DEFAULT_TEMPLATE_ID,
					bgMusic: DEFAULT_BG_MUSIC,
				}}
			/>
		</>
	);
};
