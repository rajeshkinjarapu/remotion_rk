import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

interface OdishaBilingualSignProps {
	stationTe: string;
	stationOdia: string;
	stationEn: string;
	stationHi: string;
	elevation?: string;
	subnote?: string;
}

export const OdishaBilingualSign: React.FC<OdishaBilingualSignProps> = ({
	stationTe,
	stationOdia,
	stationEn,
	stationHi,
	elevation = '145 M',
	subnote = 'ఒడిశా రాష్ట్రంలో తెలుగు బోర్డులు!',
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({
		frame,
		fps,
		config: {damping: 14, mass: 0.8},
	});

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 20,
				transform: `scale(${entrance})`,
				opacity: entrance,
			}}
		>
			{/* Classic Indian Railways Yellow Station Signboard */}
			<div
				style={{
					background: 'linear-gradient(180deg, #FACC15 0%, #EAB308 100%)',
					border: '8px solid #000000',
					borderRadius: 16,
					padding: '28px 56px',
					boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.15)',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					minWidth: 800,
					position: 'relative',
				}}
			>
				{/* Corner Bolts */}
				<div style={{position: 'absolute', top: 12, left: 16, width: 14, height: 14, borderRadius: '50%', background: '#000000'}} />
				<div style={{position: 'absolute', top: 12, right: 16, width: 14, height: 14, borderRadius: '50%', background: '#000000'}} />
				<div style={{position: 'absolute', bottom: 12, left: 16, width: 14, height: 14, borderRadius: '50%', background: '#000000'}} />
				<div style={{position: 'absolute', bottom: 12, right: 16, width: 14, height: 14, borderRadius: '50%', background: '#000000'}} />

				{/* 4 Languages Grid */}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						gap: '16px 40px',
						width: '100%',
						textAlign: 'center',
						borderBottom: '4px solid #000000',
						paddingBottom: 20,
					}}
				>
					{/* Telugu Name */}
					<div
						style={{
							fontSize: 48,
							fontWeight: 900,
							color: '#000000',
							lineHeight: 1.1,
						}}
					>
						{stationTe}
					</div>

					{/* Odia Name */}
					<div
						style={{
							fontSize: 46,
							fontWeight: 900,
							color: '#000000',
							lineHeight: 1.1,
						}}
					>
						{stationOdia}
					</div>

					{/* English Name */}
					<div
						style={{
							fontSize: 38,
							fontWeight: 900,
							color: '#000000',
							letterSpacing: '0.08em',
							textTransform: 'uppercase',
						}}
					>
						{stationEn}
					</div>

					{/* Hindi Name */}
					<div
						style={{
							fontSize: 38,
							fontWeight: 900,
							color: '#000000',
						}}
					>
						{stationHi}
					</div>
				</div>

				{/* Station Details Footer */}
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
						paddingTop: 12,
						fontSize: 14,
						fontWeight: 900,
						color: '#000000',
						letterSpacing: '0.06em',
					}}
				>
					<span>ECoR • EAST COAST RAILWAY</span>
					<span>సముద్ర మట్టానికి: {elevation}</span>
					<span>DIVISION: WALTAIR / RAYAGADA</span>
				</div>
			</div>

			{/* Subtitle / Culture Callout */}
			<div
				style={{
					background: '#EFF6FF',
					border: '1.5px solid #BFDBFE',
					borderRadius: 999,
					padding: '8px 24px',
					fontSize: 18,
					fontWeight: 800,
					color: '#1D4ED8',
					display: 'flex',
					alignItems: 'center',
					gap: 10,
					boxShadow: '0 2px 8px rgba(37, 99, 235, 0.1)',
				}}
			>
				<span>🇮🇳</span>
				<span>{subnote}</span>
			</div>
		</div>
	);
};
