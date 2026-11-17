import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Series,
	staticFile,
} from 'remotion';
import { Scene1Hook } from './Scene1Hook';
import { Scene2PurseCalculation } from './Scene2PurseCalculation';
import { Scene3HeadToHead } from './Scene3HeadToHead';
import { Scene4MIAnalysis } from './Scene4MIAnalysis';
import { Scene5PBKSAnalysis } from './Scene5PBKSAnalysis';
import { Scene6FinalVerdict } from './Scene6FinalVerdict';

// Exact frame counts generated from Smallest.ai TTS voiceover
export const IPL_TRADE_TIMINGS = {
	scene1: { frames: 1135, audio: 'audio/ipl_trade/scene1.wav' },
	scene2: { frames: 1156, audio: 'audio/ipl_trade/scene2.wav' },
	scene3: { frames: 1859, audio: 'audio/ipl_trade/scene3.wav' },
	scene4: { frames: 1424, audio: 'audio/ipl_trade/scene4.wav' },
	scene5: { frames: 1140, audio: 'audio/ipl_trade/scene5.wav' },
	scene6: { frames: 1000, audio: 'audio/ipl_trade/scene6.wav' },
	totalFrames: 7714,
};

export const IPLTradeExplainer: React.FC = () => {
	return (
		<AbsoluteFill style={{ backgroundColor: '#070B14' }}>
			{/* Dramatic Sports Background Music (ducked so Telugu voiceover is crystal clear) */}
			<Audio
				src={staticFile('Youtube Free Musics/Beat Your Competition - Vibe Tracks.mp3')}
				volume={0.12}
				loop
			/>

			{/* Scene-by-Scene Visuals & Synchronized Voiceovers */}
			<Series>
				{/* Scene 1: Hook & Breaking News */}
				<Series.Sequence durationInFrames={IPL_TRADE_TIMINGS.scene1.frames}>
					<Audio src={staticFile(IPL_TRADE_TIMINGS.scene1.audio)} volume={1.0} />
					<Scene1Hook />
				</Series.Sequence>

				{/* Scene 2: Trade Mechanics & Purse Calculation */}
				<Series.Sequence durationInFrames={IPL_TRADE_TIMINGS.scene2.frames}>
					<Audio src={staticFile(IPL_TRADE_TIMINGS.scene2.audio)} volume={1.0} />
					<Scene2PurseCalculation />
				</Series.Sequence>

				{/* Scene 3: Head-to-Head Stats Comparison */}
				<Series.Sequence durationInFrames={IPL_TRADE_TIMINGS.scene3.frames}>
					<Audio src={staticFile(IPL_TRADE_TIMINGS.scene3.audio)} volume={1.0} />
					<Scene3HeadToHead />
				</Series.Sequence>

				{/* Scene 4: Mumbai Indians (MI) Analysis */}
				<Series.Sequence durationInFrames={IPL_TRADE_TIMINGS.scene4.frames}>
					<Audio src={staticFile(IPL_TRADE_TIMINGS.scene4.audio)} volume={1.0} />
					<Scene4MIAnalysis />
				</Series.Sequence>

				{/* Scene 5: Punjab Kings (PBKS) Analysis */}
				<Series.Sequence durationInFrames={IPL_TRADE_TIMINGS.scene5.frames}>
					<Audio src={staticFile(IPL_TRADE_TIMINGS.scene5.audio)} volume={1.0} />
					<Scene5PBKSAnalysis />
				</Series.Sequence>

				{/* Scene 6: Final Verdict & Outro */}
				<Series.Sequence durationInFrames={IPL_TRADE_TIMINGS.scene6.frames}>
					<Audio src={staticFile(IPL_TRADE_TIMINGS.scene6.audio)} volume={1.0} />
					<Scene6FinalVerdict />
				</Series.Sequence>
			</Series>
		</AbsoluteFill>
	);
};

