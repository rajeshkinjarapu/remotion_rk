import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const TopHeadline: React.FC<{
	tag?: string;
	title?: string;
}> = ({
	tag = 'AP POLITICS EXPLAINER',
	title = 'విజయవాడ మేయర్ రేస్: ఎవరి ఆస్తులు ఎంత? - ఎన్నికల అఫిడవిట్ నివేదిక',
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const drop = spring({
		frame,
		fps,
		config: { damping: 14, stiffness: 100 },
	});

	const translateY = interpolate(drop, [0, 1], [-80, 0]);
	const opacity = interpolate(drop, [0, 1], [0, 1]);

	return (
		<div
			style={{
				position: 'absolute',
				top: 36,
				left: 60,
				right: 60,
				transform: `translateY(${translateY}px)`,
				opacity,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: '14px 28px',
				backgroundColor: '#1E242B',
				borderRadius: 14,
				boxShadow: '0 12px 30px rgba(0, 0, 0, 0.18)',
				borderBottom: '4px solid #D32F2F',
				zIndex: 100,
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
				{/* Tag pill */}
				<div
					style={{
						backgroundColor: '#D32F2F',
						color: '#FFFFFF',
						fontWeight: 800,
						fontSize: 15,
						letterSpacing: '1.5px',
						padding: '6px 14px',
						borderRadius: 6,
						textTransform: 'uppercase',
					}}
				>
					{tag}
				</div>

				{/* Telugu Title */}
				<div
					style={{
						color: '#FFFFFF',
						fontSize: 26,
						fontWeight: 800,
						letterSpacing: '0.2px',
						fontFamily: 'Noto Sans Telugu, "Gautami", sans-serif',
					}}
				>
					{title}
				</div>
			</div>

			{/* Channel brand mark */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 10,
					backgroundColor: 'rgba(255, 255, 255, 0.08)',
					padding: '6px 14px',
					borderRadius: 30,
					border: '1px solid rgba(255, 255, 255, 0.15)',
				}}
			>
				<div
					style={{
						width: 10,
						height: 10,
						borderRadius: '50%',
						backgroundColor: '#EF4444',
						boxShadow: '0 0 8px #EF4444',
					}}
				/>
				<span
					style={{
						color: '#F1F5F9',
						fontSize: 14,
						fontWeight: 700,
						letterSpacing: '1px',
					}}
				>
					@thepoliticalroom_
				</span>
			</div>
		</div>
	);
};

