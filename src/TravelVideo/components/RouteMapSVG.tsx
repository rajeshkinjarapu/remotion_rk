import React from 'react';
import {useCurrentFrame} from 'remotion';

interface RouteMapSVGProps {
	progress: number; // 0 to 1
	activeStationIndex?: number;
}

export const RouteMapSVG: React.FC<RouteMapSVGProps> = ({
	progress,
	activeStationIndex,
}) => {
	const frame = useCurrentFrame();

	// Map coordinates for the railway line on a 1200x650 canvas
	const trackPoints = [
		{x: 180, y: 560, nameTe: 'గుంటూరు', nameEn: 'Guntur', code: 'GNT'},
		{x: 230, y: 520, nameTe: 'మంగళగిరి', nameEn: 'Mangalagiri', code: 'MAG'},
		{x: 290, y: 490, nameTe: 'విజయవాడ', nameEn: 'Vijayawada', code: 'BZA', river: 'కృష్ణా నది'},
		{x: 370, y: 440, nameTe: 'ఏలూరు', nameEn: 'Eluru', code: 'EE'},
		{x: 460, y: 390, nameTe: 'తాడేపల్లిగూడెం', nameEn: 'Tadepalligudem', code: 'TDD'},
		{x: 540, y: 340, nameTe: 'రాజమండ్రి', nameEn: 'Rajahmundry', code: 'RJY', river: 'గోదావరి నది 🌊'},
		{x: 620, y: 300, nameTe: 'సామర్లకోట', nameEn: 'Samalkot', code: 'SLO'},
		{x: 700, y: 260, nameTe: 'అన్నవరం', nameEn: 'Annavaram', code: 'ANV'},
		{x: 770, y: 230, nameTe: 'తుని', nameEn: 'Tuni', code: 'TUNI'},
		{x: 880, y: 210, nameTe: 'విశాఖపట్నం', nameEn: 'Vizag', code: 'VSKP', coast: true},
		{x: 830, y: 150, nameTe: 'విజయనగరం', nameEn: 'Vizianagaram', code: 'VZM'},
		{x: 760, y: 110, nameTe: 'బొబ్బిలి', nameEn: 'Bobbili', code: 'VBL'},
		{x: 690, y: 80, nameTe: 'పార్వతీపురం', nameEn: 'Parvathipuram', code: 'PVP'},
		{x: 640, y: 55, nameTe: 'భీముడు పేట', nameEn: 'Bhimpur (Odisha)', code: 'BMP', border: true},
		{x: 590, y: 40, nameTe: 'రాయగడ', nameEn: 'Rayagada (Odisha)', code: 'RGDA'},
	];

	// Create smooth SVG path
	const pathD = trackPoints.reduce((acc, pt, i) => {
		if (i === 0) return `M ${pt.x} ${pt.y}`;
		const prev = trackPoints[i - 1];
		const midX = (prev.x + pt.x) / 2;
		const midY = (prev.y + pt.y) / 2;
		return `${acc} Q ${prev.x} ${prev.y}, ${midX} ${midY} T ${pt.x} ${pt.y}`;
	}, '');

	// Current train head position based on progress
	const totalSegments = trackPoints.length - 1;
	const currentFloatIndex = Math.min(progress * totalSegments, totalSegments);
	const lowerIndex = Math.floor(currentFloatIndex);
	const upperIndex = Math.min(lowerIndex + 1, totalSegments);
	const segmentFraction = currentFloatIndex - lowerIndex;

	const p1 = trackPoints[lowerIndex];
	const p2 = trackPoints[upperIndex];
	const trainX = p1.x + (p2.x - p1.x) * segmentFraction;
	const trainY = p1.y + (p2.y - p1.y) * segmentFraction;

	// Animated beacon pulse
	const beaconPulse = Math.sin(frame / 6) * 0.3 + 1;

	return (
		<div
			style={{
				position: 'relative',
				width: 1200,
				height: 650,
				background: '#FFFFFF',
				border: '2px solid #E2E8F0',
				borderRadius: 28,
				boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.03)',
				overflow: 'hidden',
			}}
		>
			{/* Waterbody: Bay of Bengal Soft Blue Overlay on Right */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					right: 0,
					bottom: 0,
					width: 360,
					background: 'radial-gradient(ellipse at 100% 50%, #E0F2FE 0%, transparent 80%)',
					pointerEvents: 'none',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					bottom: 180,
					right: 40,
					fontSize: 16,
					fontWeight: 900,
					letterSpacing: '0.2em',
					color: '#0284C7',
					transform: 'rotate(-45deg)',
					textTransform: 'uppercase',
					opacity: 0.7,
				}}
			>
				🌊 BAY OF BENGAL
			</div>

			{/* Eastern Ghats Mountain Accent on Top Left */}
			<div
				style={{
					position: 'absolute',
					top: 20,
					left: 450,
					fontSize: 15,
					fontWeight: 900,
					letterSpacing: '0.15em',
					color: '#059669',
					textTransform: 'uppercase',
				}}
			>
				⛰️ EASTERN GHATS (తూర్పు కనుమలు)
			</div>

			{/* Andhra - Odisha Border Line */}
			<div
				style={{
					position: 'absolute',
					top: 45,
					left: 630,
					display: 'flex',
					alignItems: 'center',
					gap: 6,
					background: '#FEE2E2',
					border: '1px dashed #EF4444',
					borderRadius: 8,
					padding: '4px 10px',
					fontSize: 12,
					fontWeight: 900,
					color: '#DC2626',
				}}
			>
				<span>🚩 AP - ODISHA BORDER</span>
			</div>

			{/* SVG Map Canvas */}
			<svg width="1200" height="650" style={{position: 'absolute', inset: 0}}>
				<defs>
					<linearGradient id="trackGradLight" x1="0%" y1="100%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="#2563EB" />
						<stop offset="50%" stopColor="#D97706" />
						<stop offset="100%" stopColor="#10B981" />
					</linearGradient>
				</defs>

				{/* Full Railway Track Background (Subtle Dash) */}
				<path
					d={pathD}
					fill="none"
					stroke="#E2E8F0"
					strokeWidth="7"
					strokeDasharray="8 8"
					strokeLinecap="round"
				/>

				{/* Active Glow Trail based on progress */}
				<path
					d={pathD}
					fill="none"
					stroke="url(#trackGradLight)"
					strokeWidth="6"
					strokeLinecap="round"
					style={{
						strokeDasharray: 2200,
						strokeDashoffset: 2200 * (1 - progress),
					}}
				/>

				{/* Stations Pins */}
				{trackPoints.map((pt, i) => {
					const isPast = progress >= i / totalSegments;
					const isCurrent =
						activeStationIndex !== undefined
							? activeStationIndex === i
							: Math.abs(progress - i / totalSegments) < 0.04;

					const pinColor = isCurrent ? '#2563EB' : isPast ? '#10B981' : '#CBD5E1';

					return (
						<g key={i}>
							{/* Current Station Radar Wave */}
							{isCurrent && (
								<circle
									cx={pt.x}
									cy={pt.y}
									r={16 * beaconPulse}
									fill="none"
									stroke="#2563EB"
									strokeWidth="2"
									opacity={0.8 / beaconPulse}
								/>
							)}

							{/* Station Circle */}
							<circle
								cx={pt.x}
								cy={pt.y}
								r={isCurrent ? 9 : 6}
								fill={pinColor}
								stroke="#FFFFFF"
								strokeWidth="2.5"
							/>

							{/* Station Label */}
							<text
								x={pt.x + (i % 2 === 0 ? 14 : -14)}
								y={pt.y + (i % 2 === 0 ? 4 : -10)}
								textAnchor={i % 2 === 0 ? 'start' : 'end'}
								fill={isCurrent ? '#2563EB' : isPast ? '#0F172A' : '#64748B'}
								fontSize={isCurrent ? 17 : 13}
								fontWeight={isCurrent ? 900 : 700}
								fontFamily="sans-serif"
							>
								{pt.nameTe}
							</text>

							{/* River / Feature Annotation */}
							{pt.river && (
								<text
									x={pt.x - 10}
									y={pt.y + 24}
									textAnchor="middle"
									fill="#0284C7"
									fontSize={12}
									fontWeight={800}
								>
									{pt.river}
								</text>
							)}
						</g>
					);
				})}

				{/* Active Moving Train Head */}
				<g transform={`translate(${trainX}, ${trainY})`}>
					<circle
						cx="0"
						cy="0"
						r={14 * beaconPulse}
						fill="none"
						stroke="#2563EB"
						strokeWidth="2.5"
						opacity={0.7}
					/>
					<circle cx="0" cy="0" r="10" fill="#2563EB" stroke="#FFFFFF" strokeWidth="3" />
					<text x="0" y="4" textAnchor="middle" fontSize="12">
						🚅
					</text>
				</g>
			</svg>
		</div>
	);
};
