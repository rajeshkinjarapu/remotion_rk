import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {STATIONS, TOTAL_FRAMES} from '../types';

interface HUDProps {
	sectionTitle: string;
	sectionIcon?: string;
	progressOverride?: number;
}

export const HUD: React.FC<HUDProps> = ({
	sectionTitle,
	sectionIcon = '🚆',
	progressOverride,
}) => {
	const frame = useCurrentFrame();

	const autoProgress = interpolate(frame, [0, TOTAL_FRAMES], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const currentProgress = progressOverride !== undefined ? progressOverride : autoProgress;

	// Calculate simulated journey clock time from 11:20 PM to 1:40 PM (14.33 hours = 860 minutes)
	const totalMinutes = 860;
	const elapsedMinutes = Math.floor(currentProgress * totalMinutes);
	const startHour = 23;
	const startMinute = 20;
	const currentTotalMinutes = (startHour * 60 + startMinute + elapsedMinutes) % (24 * 60);
	const clockHour24 = Math.floor(currentTotalMinutes / 60);
	const clockMinutes = currentTotalMinutes % 60;
	const isPM = clockHour24 >= 12;
	const clockHour12 = clockHour24 % 12 === 0 ? 12 : clockHour24 % 12;
	const timeString = `${String(clockHour12).padStart(2, '0')}:${String(clockMinutes).padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;

	// Find nearest station
	let activeStation = STATIONS[0];
	for (const st of STATIONS) {
		if (currentProgress >= st.progress) {
			activeStation = st;
		}
	}

	return (
		<div
			style={{
				position: 'absolute',
				top: 24,
				left: 48,
				right: 48,
				height: 68,
				zIndex: 100,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				background: 'rgba(255, 255, 255, 0.95)',
				backdropFilter: 'blur(20px)',
				WebkitBackdropFilter: 'blur(20px)',
				border: '1.5px solid #E2E8F0',
				borderTop: '3px solid #2563EB',
				borderRadius: 20,
				padding: '0 28px',
				boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.03)',
			}}
		>
			{/* Left: Train ID & Current Section */}
			<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
				{/* Flashing Live Dot */}
				<div
					style={{
						width: 14,
						height: 14,
						borderRadius: '50%',
						background: '#10B981',
						boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)',
					}}
				/>
				<div style={{display: 'flex', flexDirection: 'column'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 8}}>
						<span style={{fontSize: 20, fontWeight: 900, color: '#0F172A', letterSpacing: '0.08em'}}>
							TRAIN 17243
						</span>
						<span style={{color: '#94A3B8'}}>•</span>
						<span style={{fontSize: 16, fontWeight: 800, color: '#2563EB', letterSpacing: '0.04em'}}>
							GUNTUR ➔ RAYAGADA EXP
						</span>
					</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 6, marginTop: 2}}>
						<span style={{fontSize: 16}}>{sectionIcon}</span>
						<span style={{fontSize: 16, fontWeight: 700, color: '#334155'}}>
							{sectionTitle}
						</span>
					</div>
				</div>
			</div>

			{/* Center: Miniature Route Progress Tracker */}
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 6,
					width: 440,
				}}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						width: '100%',
						fontSize: 12,
						fontWeight: 800,
						color: '#64748B',
						letterSpacing: '0.06em',
					}}
				>
					<span>GNT (గుంటూరు)</span>
					<span style={{color: '#2563EB', fontWeight: 900}}>
						{activeStation.nameTe} ({activeStation.code})
					</span>
					<span>RGDA (రాయగడ)</span>
				</div>
				<div
					style={{
						width: '100%',
						height: 8,
						background: '#E2E8F0',
						borderRadius: 999,
						position: 'relative',
						overflow: 'visible',
					}}
				>
					{/* Progress Fill */}
					<div
						style={{
							width: `${currentProgress * 100}%`,
							height: '100%',
							background: 'linear-gradient(90deg, #2563EB, #F59E0B, #10B981)',
							borderRadius: 999,
							boxShadow: '0 0 8px rgba(37, 99, 235, 0.4)',
						}}
					/>
					{/* Train Marker */}
					<div
						style={{
							position: 'absolute',
							top: -6,
							left: `calc(${currentProgress * 100}% - 10px)`,
							width: 20,
							height: 20,
							borderRadius: '50%',
							background: '#FFFFFF',
							border: '3px solid #2563EB',
							boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							fontSize: 10,
						}}
					>
						🚅
					</div>
				</div>
			</div>

			{/* Right: Live Simulated Clock & Speed */}
			<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
				{/* Clock Badge */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 8,
						background: '#F1F5F9',
						border: '1px solid #E2E8F0',
						borderRadius: 12,
						padding: '6px 14px',
					}}
				>
					<span style={{fontSize: 16}}>🕒</span>
					<span
						style={{
							fontSize: 18,
							fontWeight: 900,
							color: '#0F172A',
							fontVariantNumeric: 'tabular-nums',
							letterSpacing: '0.04em',
						}}
					>
						{timeString}
					</span>
				</div>

				{/* Progress % */}
				<div
					style={{
						background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
						border: '1px solid #6EE7B7',
						borderRadius: 12,
						padding: '6px 16px',
						fontSize: 16,
						fontWeight: 900,
						color: '#FFFFFF',
						boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
					}}
				>
					{Math.round(currentProgress * 100)}%
				</div>
			</div>
		</div>
	);
};
