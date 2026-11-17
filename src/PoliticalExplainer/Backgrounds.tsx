import React from 'react';
import { AbsoluteFill } from 'remotion';

export const NavyBackground: React.FC = () => {
	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#071326',
				backgroundImage: `
					radial-gradient(ellipse at 50% 40%, #0E2243 0%, #061021 100%)
				`,
				overflow: 'hidden',
			}}
		>
			{/* Massive Faint Channel Watermark */}
			<div
				style={{
					position: 'absolute',
					top: '46%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					textAlign: 'center',
					userSelect: 'none',
					pointerEvents: 'none',
					lineHeight: 0.95,
				}}
			>
				<div
					style={{
						fontSize: 160,
						fontWeight: 900,
						letterSpacing: '14px',
						color: 'rgba(255, 255, 255, 0.032)',
						fontFamily: 'system-ui, -apple-system, sans-serif',
					}}
				>
					THE
				</div>
				<div
					style={{
						fontSize: 190,
						fontWeight: 900,
						letterSpacing: '10px',
						color: 'rgba(255, 255, 255, 0.032)',
						fontFamily: 'system-ui, -apple-system, sans-serif',
					}}
				>
					POLITICAL
				</div>
				<div
					style={{
						fontSize: 210,
						fontWeight: 900,
						letterSpacing: '18px',
						color: 'rgba(255, 255, 255, 0.032)',
						fontFamily: 'system-ui, -apple-system, sans-serif',
					}}
				>
					ROOM
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const ParchmentBackground: React.FC = () => {
	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#F5EFE4',
				backgroundImage: `
					radial-gradient(circle at 50% 45%, #FBF8F2 0%, #EFE8DA 100%),
					linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
					linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
				`,
				backgroundSize: '100% 100%, 40px 40px, 40px 40px',
				overflow: 'hidden',
			}}
		>
			{/* Faint Channel Watermark */}
			<div
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					textAlign: 'center',
					userSelect: 'none',
					pointerEvents: 'none',
					lineHeight: 0.95,
				}}
			>
				<div
					style={{
						fontSize: 150,
						fontWeight: 900,
						letterSpacing: '14px',
						color: 'rgba(0, 0, 0, 0.035)',
						fontFamily: 'system-ui, -apple-system, sans-serif',
					}}
				>
					THE
				</div>
				<div
					style={{
						fontSize: 180,
						fontWeight: 900,
						letterSpacing: '10px',
						color: 'rgba(0, 0, 0, 0.035)',
						fontFamily: 'system-ui, -apple-system, sans-serif',
					}}
				>
					POLITICAL
				</div>
				<div
					style={{
						fontSize: 200,
						fontWeight: 900,
						letterSpacing: '16px',
						color: 'rgba(0, 0, 0, 0.035)',
						fontFamily: 'system-ui, -apple-system, sans-serif',
					}}
				>
					ROOM
				</div>
			</div>
		</AbsoluteFill>
	);
};

