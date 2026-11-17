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

export const POLITICAL_TIMINGS = timingsData;
export const TOTAL_POLITICAL_FRAMES =
	timingsData.scene1.frames +
	timingsData.scene2.frames +
	timingsData.scene3.frames;

export const PoliticalExplainer: React.FC = () => {
	return (
		<AbsoluteFill style={{ backgroundColor: '#F6F3EC' }}>
			{/* Optional subtle background tension music */}
			<Audio
				src={staticFile('Youtube Free Musics/smooth_ambient_quiz_bgm.mp3')}
				volume={0.12}
				loop
			/>

			<Series>
				{/* SCENE 1: Hook & Candidate Polaroid Intro */}
				<Series.Sequence durationInFrames={timingsData.scene1.frames}>
					<Scene1Hook subtitle="విజయవాడ మేయర్ రేస్ లో ఎవరి ఆస్తులు ఎంత? అఫిడవిట్ నివేదిక రాష్ట్రవ్యాప్తంగా సంచలనం సృష్టిస్తోంది." />
					<Audio
						src={staticFile('audio/political_sample/scene1_hook.wav')}
						volume={1.0}
						startFrom={0}
					/>
				</Series.Sequence>

				{/* SCENE 2: Comparison Bar Chart */}
				<Series.Sequence durationInFrames={timingsData.scene2.frames}>
					<Scene2ComparisonChart subtitle="ఏబీ వెంకటేశ్వరరావు ₹21.55 కోట్లతో టాప్ లో ఉండగా, వైసీపీ భాగ్యలక్ష్మి ₹6 కోట్లు, వంగవీటి రాధా ₹3.20 కోట్లతో ఉన్నారు." />
					<Audio
						src={staticFile('audio/political_sample/scene2_chart.wav')}
						volume={1.0}
						startFrom={0}
					/>
				</Series.Sequence>

				{/* SCENE 3: Deep Dive Twist Breakdown */}
				<Series.Sequence durationInFrames={timingsData.scene3.frames}>
					<Scene3Breakdown subtitle="అసలైన ట్విస్ట్: ₹21 కోట్లకు పైగా ఆస్తులు ఉన్నా, బ్యాంక్ ఖాతాలో నగదు బ్యాలెన్స్ కేవలం ₹3,935 మాత్రమే!" />
					<Audio
						src={staticFile('audio/political_sample/scene3_twist.wav')}
						volume={1.0}
						startFrom={0}
					/>
				</Series.Sequence>
			</Series>
		</AbsoluteFill>
	);
};
