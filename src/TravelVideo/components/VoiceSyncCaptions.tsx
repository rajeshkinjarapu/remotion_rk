import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {VOICE_CAPTIONS, CaptionItem} from '../captionsData';

interface VoiceSyncCaptionsProps {
	globalFrameOverride?: number;
}

export const VoiceSyncCaptions: React.FC<VoiceSyncCaptionsProps> = ({
	globalFrameOverride,
}) => {
	const currentFrame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const frame = globalFrameOverride !== undefined ? globalFrameOverride : currentFrame;

	// Find the active caption cue
	const activeCaption: CaptionItem | undefined = VOICE_CAPTIONS.find(
		(cap) => frame >= cap.from && frame < cap.to,
	);

	if (!activeCaption) {
		return null;
	}

	// Calculate spring entrance for the current caption
	const captionAge = frame - activeCaption.from;
	const entrance = spring({
		frame: captionAge,
		fps,
		config: {damping: 14, mass: 0.7},
	});

	// Pulsing soundwave bars animation
	const bar1 = Math.abs(Math.sin(frame * 0.4 + 0)) * 22 + 6;
	const bar2 = Math.abs(Math.sin(frame * 0.5 + 1)) * 26 + 6;
	const bar3 = Math.abs(Math.sin(frame * 0.35 + 2)) * 20 + 6;
	const bar4 = Math.abs(Math.sin(frame * 0.45 + 3)) * 24 + 6;

	// Render text with highlighted keywords
	const renderFormattedText = () => {
		const text = activeCaption.text;
		const keywords = activeCaption.keywords || [];

		if (keywords.length === 0) {
			return <span>{text}</span>;
		}

		// Split by the first matching keyword for vivid styling
		for (const kw of keywords) {
			if (text.includes(kw)) {
				const parts = text.split(kw);
				return (
					<>
						<span>{parts[0]}</span>
						<span
							style={{
								color: '#2563EB',
								background: '#EFF6FF',
								border: '1px solid #BFDBFE',
								borderRadius: 8,
								padding: '2px 8px',
								fontWeight: 900,
								margin: '0 4px',
							}}
						>
							{kw}
						</span>
						<span>{parts.slice(1).join(kw)}</span>
					</>
				);
			}
		}

		return <span>{text}</span>;
	};

	return (
		<div
			style={{
				position: 'absolute',
				bottom: 32,
				left: '50%',
				transform: `translateX(-50%) translateY(${interpolate(entrance, [0, 1], [25, 0])}px) scale(${interpolate(entrance, [0, 1], [0.94, 1])})`,
				opacity: interpolate(entrance, [0, 1], [0, 1]),
				zIndex: 200,
				display: 'flex',
				alignItems: 'center',
				gap: 20,
				background: 'rgba(255, 255, 255, 0.97)',
				backdropFilter: 'blur(20px)',
				WebkitBackdropFilter: 'blur(20px)',
				border: '2px solid #E2E8F0',
				borderTop: '4px solid #2563EB',
				borderRadius: 22,
				padding: '16px 36px',
				boxShadow:
					'0 20px 45px -10px rgba(15, 23, 42, 0.12), 0 4px 12px rgba(15, 23, 42, 0.05)',
				maxWidth: 1600,
			}}
		>
			{/* Left: Animated Audio Equalizer Soundwave */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 4,
					height: 32,
					paddingRight: 14,
					borderRight: '1.5px solid #E2E8F0',
					flexShrink: 0,
				}}
			>
				{[bar1, bar2, bar3, bar4].map((h, i) => (
					<div
						key={i}
						style={{
							width: 4.5,
							height: h,
							borderRadius: 3,
							background: 'linear-gradient(180deg, #2563EB 0%, #10B981 100%)',
							boxShadow: '0 0 6px rgba(37, 99, 235, 0.4)',
						}}
					/>
				))}
			</div>

			{/* Center: Topic Tag Pill if available */}
			{activeCaption.tag && (
				<div
					style={{
						background: '#EFF6FF',
						border: '1.5px solid #BFDBFE',
						borderRadius: 8,
						padding: '4px 12px',
						fontSize: 13,
						fontWeight: 900,
						color: '#1D4ED8',
						letterSpacing: '0.08em',
						whiteSpace: 'nowrap',
						flexShrink: 0,
					}}
				>
					{activeCaption.tag}
				</div>
			)}

			{/* Right: Crystal Clear Telugu Spoken Text with Keyword Highlights */}
			<div
				style={{
					fontSize: 38,
					fontWeight: 800,
					color: '#0F172A',
					lineHeight: 1.35,
					letterSpacing: '0.01em',
					textAlign: 'center',
				}}
			>
				{renderFormattedText()}
			</div>
		</div>
	);
};
