import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Series,
	staticFile,
} from 'remotion';
import { Scene1Hook } from './Scene1Hook';
import { Scene2ComparisonChart } from './Scene2ComparisonChart';
import { Scene3Breakdown } from './Scene3Breakdown';
import timingsData from './timings.json';

export { Scene1Hook } from './Scene1Hook';
export { Scene2ComparisonChart } from './Scene2ComparisonChart';
export { Scene3Breakdown } from './Scene3Breakdown';

export const CRICKET_TIMINGS = timingsData;
export const TOTAL_CRICKET_FRAMES =
	timingsData.scene1.frames +
	timingsData.scene2.frames +
	timingsData.scene3.frames;

export const CricketExplainer: React.FC = () => {
	return (
		<AbsoluteFill style={{ backgroundColor: '#06101E' }}>
			{/* Ambient background music */}
			<Audio
				src={staticFile('Youtube Free Musics/smooth_ambient_quiz_bgm.mp3')}
				volume={0.12}
				loop
			/>

			<Series>
				{/* SCENE 1: Hook & Hero Reveal */}
				<Series.Sequence durationInFrames={timingsData.scene1.frames}>
					<Scene1Hook />
					<Audio
						src={staticFile('audio/cricket_sample/scene1_hook.wav')}
						volume={1.0}
						startFrom={0}
					/>
				</Series.Sequence>

				{/* SCENE 2: 3-Player All-Time Runs Comparison Chart */}
				<Series.Sequence durationInFrames={timingsData.scene2.frames}>
					<Scene2ComparisonChart />
					<Audio
						src={staticFile('audio/cricket_sample/scene2_chart.wav')}
						volume={1.0}
						startFrom={0}
					/>
				</Series.Sequence>

				{/* SCENE 3: Official IPL Career Scorecard & Twist */}
				<Series.Sequence durationInFrames={timingsData.scene3.frames}>
					<Scene3Breakdown />
					<Audio
						src={staticFile('audio/cricket_sample/scene3_twist.wav')}
						volume={1.0}
						startFrom={0}
					/>
				</Series.Sequence>
			</Series>
		</AbsoluteFill>
	);
};

