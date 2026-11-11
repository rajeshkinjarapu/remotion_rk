import React from 'react';
import {AbsoluteFill, Audio, Series, staticFile, useCurrentFrame} from 'remotion';
import {loadFont} from '@remotion/google-fonts/AnekTelugu';
import {Scene1Hook} from './scenes/Scene1Hook';
import {Scene2Specs} from './scenes/Scene2Specs';
import {Scene3Godavari} from './scenes/Scene3Godavari';
import {Scene4VizagHack} from './scenes/Scene4VizagHack';
import {Scene5EasternGhats} from './scenes/Scene5EasternGhats';
import {Scene6Outro} from './scenes/Scene6Outro';
import {VoiceSyncCaptions} from './components/VoiceSyncCaptions';
import {TOTAL_FRAMES} from './types';

const {fontFamily: teluguFont} = loadFont();

export const TravelVideo: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#F8FAFC',
				fontFamily: `${teluguFont}, 'Segoe UI', system-ui, sans-serif`,
				color: '#0F172A',
				overflow: 'hidden',
			}}
		>
			{/* Master Voiceover Audio Track (Entire 4m 33s duration) */}
			<Audio src={staticFile('Travel Video/Guntur rayagada.wav')} volume={1.0} />

			{/* 6 Seamless Narrative Acts */}
			<Series>
				{/* Scene 1: The April Fool Hook & Intro (0:00 - 0:40) */}
				<Series.Sequence durationInFrames={1200}>
					<Scene1Hook />
				</Series.Sequence>

				{/* Scene 2: Train Specs & Official Route Map (0:40 - 1:20) */}
				<Series.Sequence durationInFrames={1200}>
					<Scene2Specs />
				</Series.Sequence>

				{/* Scene 3: Godavari Sunrise, High Speed Overtakes & Sigma Board (1:20 - 2:20) */}
				<Series.Sequence durationInFrames={1800}>
					<Scene3Godavari />
				</Series.Sequence>

				{/* Scene 4: Vizag Loco Reversal & Secret Confirm Ticket Hack (2:20 - 3:20) */}
				<Series.Sequence durationInFrames={1800}>
					<Scene4VizagHack />
				</Series.Sequence>

				{/* Scene 5: Eastern Ghats Nature & Odisha Border (3:20 - 4:00) */}
				<Series.Sequence durationInFrames={1200}>
					<Scene5EasternGhats />
				</Series.Sequence>

				{/* Scene 6: Rayagada Destination & YouTube Subscribe Outro (4:00 - 4:33.44) */}
				<Series.Sequence durationInFrames={1004}>
					<Scene6Outro />
				</Series.Sequence>
			</Series>

			{/* ================= VOICE SYNCHRONIZED TELUGU CAPTIONS BAR ================= */}
			<VoiceSyncCaptions globalFrameOverride={frame} />
		</AbsoluteFill>
	);
};

// Scene Wrappers with Voice Synchronized Subtitles for Individual Remotion Previews
export const Scene1Preview: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Audio src={staticFile('Travel Video/Guntur rayagada.wav')} />
			<Scene1Hook />
			<VoiceSyncCaptions globalFrameOverride={frame + 0} />
		</AbsoluteFill>
	);
};

export const Scene2Preview: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Audio src={staticFile('Travel Video/Guntur rayagada.wav')} startFrom={1200} />
			<Scene2Specs />
			<VoiceSyncCaptions globalFrameOverride={frame + 1200} />
		</AbsoluteFill>
	);
};

export const Scene3Preview: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Audio src={staticFile('Travel Video/Guntur rayagada.wav')} startFrom={2400} />
			<Scene3Godavari />
			<VoiceSyncCaptions globalFrameOverride={frame + 2400} />
		</AbsoluteFill>
	);
};

export const Scene4Preview: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Audio src={staticFile('Travel Video/Guntur rayagada.wav')} startFrom={4200} />
			<Scene4VizagHack />
			<VoiceSyncCaptions globalFrameOverride={frame + 4200} />
		</AbsoluteFill>
	);
};

export const Scene5Preview: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Audio src={staticFile('Travel Video/Guntur rayagada.wav')} startFrom={6000} />
			<Scene5EasternGhats />
			<VoiceSyncCaptions globalFrameOverride={frame + 6000} />
		</AbsoluteFill>
	);
};

export const Scene6Preview: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Audio src={staticFile('Travel Video/Guntur rayagada.wav')} startFrom={7200} />
			<Scene6Outro />
			<VoiceSyncCaptions globalFrameOverride={frame + 7200} />
		</AbsoluteFill>
	);
};

// Exports
export {VoiceSyncCaptions} from './components/VoiceSyncCaptions';
export {TOTAL_FRAMES} from './types';
