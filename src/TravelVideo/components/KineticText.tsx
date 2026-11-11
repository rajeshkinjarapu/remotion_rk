import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

interface KineticTextProps {
	tag?: string;
	title: string;
	highlightWord?: string;
	highlightColor?: string;
	subtitle?: string;
	startFrame?: number;
	align?: 'center' | 'left';
	fontSize?: number;
}

export const KineticText: React.FC<KineticTextProps> = ({
	tag,
	title,
	highlightWord,
	highlightColor = '#2563EB',
	subtitle,
	startFrame = 0,
	align = 'center',
	fontSize = 58,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const textSpring = spring({
		frame: frame - startFrame,
		fps,
		config: {damping: 14, mass: 0.8},
	});

	const opacity = interpolate(textSpring, [0, 1], [0, 1]);
	const translateY = interpolate(textSpring, [0, 1], [35, 0]);
	const scale = interpolate(textSpring, [0, 1], [0.94, 1]);

	// Format highlight
	let titleContent: React.ReactNode = title;
	if (highlightWord && title.includes(highlightWord)) {
		const parts = title.split(highlightWord);
		titleContent = (
			<>
				{parts[0]}
				<span
					style={{
						color: highlightColor,
						fontWeight: 900,
					}}
				>
					{highlightWord}
				</span>
				{parts[1]}
			</>
		);
	}

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: align === 'center' ? 'center' : 'flex-start',
				textAlign: align,
				transform: `translateY(${translateY}px) scale(${scale})`,
				opacity,
			}}
		>
			{tag && (
				<div
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: 8,
						background: '#EFF6FF',
						border: '1.5px solid #BFDBFE',
						borderRadius: 999,
						padding: '6px 20px',
						fontSize: 16,
						fontWeight: 900,
						letterSpacing: '0.12em',
						color: '#1D4ED8',
						textTransform: 'uppercase',
						marginBottom: 14,
						boxShadow: '0 2px 8px rgba(37, 99, 235, 0.1)',
					}}
				>
					{tag}
				</div>
			)}

			<h1
				style={{
					margin: 0,
					fontSize,
					fontWeight: 900,
					color: '#0F172A',
					lineHeight: 1.25,
					letterSpacing: '0.01em',
				}}
			>
				{titleContent}
			</h1>

			{subtitle && (
				<p
					style={{
						margin: '12px 0 0 0',
						fontSize: 26,
						fontWeight: 700,
						color: '#475569',
						lineHeight: 1.45,
						maxWidth: 950,
					}}
				>
					{subtitle}
				</p>
			)}
		</div>
	);
};
