import React from 'react';
import { AbsoluteFill } from 'remotion';

export const StadiumNavyBackground: React.FC = () => {
	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#06101E',
				backgroundImage: `
					radial-gradient(ellipse at 50% 30%, #0E2448 0%, #050D1A 100%)
				`,
				overflow: 'hidden',
			}}
		>
			{/* Faint Cricket Stadium Floodlight Beam Glows */}
			<div
				style={{
					position: 'absolute',
					top: -120,
					left: '15%',
					width: 400,
					height: 400,
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
					filter: 'blur(40px)',
					pointerEvents: 'none',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: -120,
					right: '15%',
					width: 400,
					height: 400,
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(250, 204, 21, 0.08) 0%, transparent 70%)',
					filter: 'blur(40px)',
					pointerEvents: 'none',
				}}
			/>

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
						color: 'rgba(255, 255, 255, 0.03)',
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
						color: 'rgba(255, 255, 255, 0.03)',
						fontFamily: 'system-ui, -apple-system, sans-serif',
					}}
				>
					CRICKET
				</div>
				<div
					style={{
						fontSize: 200,
						fontWeight: 900,
						letterSpacing: '18px',
						color: 'rgba(255, 255, 255, 0.03)',
						fontFamily: 'system-ui, -apple-system, sans-serif',
					}}
				>
					ROOM
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const ScorecardBackground: React.FC = () => {
	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#F5EFE4',
				backgroundImage: `
					radial-gradient(circle at 50% 45%, #FAF6EE 0%, #EDE5D6 100%),
					linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
					linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
				`,
				backgroundSize: '100% 100%, 40px 40px, 40px 40px',
				overflow: 'hidden',
			}}
		>
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
						color: 'rgba(0, 0, 0, 0.032)',
						fontFamily: 'system-ui, -apple-system, sans-serif',
					}}
				>
					THE
				</div>
				<div
					style={{
						fontSize: 175,
						fontWeight: 900,
						letterSpacing: '10px',
						color: 'rgba(0, 0, 0, 0.032)',
						fontFamily: 'system-ui, -apple-system, sans-serif',
					}}
				>
					CRICKET
				</div>
				<div
					style={{
						fontSize: 195,
						fontWeight: 900,
						letterSpacing: '16px',
						color: 'rgba(0, 0, 0, 0.032)',
						fontFamily: 'system-ui, -apple-system, sans-serif',
					}}
				>
					ROOM
				</div>
			</div>
		</AbsoluteFill>
	);
};

