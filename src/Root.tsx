import React from 'react';
import {Composition, Folder} from 'remotion';
import {
	TeluguQuiz,
	TeluguQuizSeries,
	teluguQuizSchema,
	QUIZ_QUESTIONS,
} from './TeluguQuiz';

export const Root: React.FC = () => {
	return (
		<>
			{/* Default Single Composition */}
			<Composition
				id="TeluguQuiz"
				component={TeluguQuiz}
				durationInFrames={630}
				fps={30}
				width={1920}
				height={1080}
				schema={teluguQuizSchema}
				defaultProps={{
					quizIndex: 0,
				}}
			/>

			{/* Full 50-Question Combined Series */}
			<Composition
				id="TeluguQuiz-Series"
				component={TeluguQuizSeries}
				durationInFrames={630 * QUIZ_QUESTIONS.length}
				fps={30}
				width={1920}
				height={1080}
			/>

			{/* Folder of individual 50 Questions */}
			<Folder name="TeluguCricket50">
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
						}}
					/>
				))}
			</Folder>
		</>
	);
};

