import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export const LocoReversalGraphic: React.FC = () => {
	const frame = useCurrentFrame();

	const oldEngineDetach = interpolate(frame, [60, 130], [0, -180], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const newEngineAttach = interpolate(frame, [140, 210], [180, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const isCoupled = frame >= 210;
	const clackSpark = frame >= 205 && frame <= 225;

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 24,
				background: '#FFFFFF',
				border: '2px solid #E2E8F0',
				borderTop: '5px solid #2563EB',
				borderRadius: 28,
				padding: '36px 44px',
				boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.03)',
				width: 1050,
			}}
		>
			{/* Top Header */}
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
					<span style={{fontSize: 32}}>🔄</span>
					<div>
						<h3 style={{margin: 0, fontSize: 28, fontWeight: 900, color: '#0F172A'}}>
							విశాఖపట్నం జంక్షన్ • లోకో రివర్సల్ (LOCO REVERSAL)
						</h3>
						<span style={{fontSize: 16, fontWeight: 700, color: '#2563EB'}}>
							{isCoupled ? '✅ నూతన WAP-7 హై-పవర్ ఎలక్ట్రిక్ ఇంజిన్ అటాచ్ చేయబడింది!' : '⚙️ ఇంజిన్ మార్పు ప్రక్రియ కొనసాగుతోంది...'}
						</span>
					</div>
				</div>

				<div
					style={{
						background: '#FEE2E2',
						border: '1.5px solid #EF4444',
						borderRadius: 12,
						padding: '6px 16px',
						fontSize: 14,
						fontWeight: 900,
						color: '#DC2626',
						textTransform: 'uppercase',
					}}
				>
					VSKP PLATFORM 1
				</div>
			</div>

			{/* Railway Track & Train Schematic Canvas */}
			<div
				style={{
					position: 'relative',
					width: 950,
					height: 180,
					background: '#F8FAFC',
					border: '1.5px solid #E2E8F0',
					borderRadius: 20,
					overflow: 'hidden',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{/* Parallel Tracks */}
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: 110,
						height: 8,
						background: '#94A3B8',
						borderTop: '2px solid #CBD5E1',
						borderBottom: '2px solid #64748B',
					}}
				/>
				{/* Sleepers */}
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: 95,
						height: 38,
						backgroundImage: 'repeating-linear-gradient(90deg, #CBD5E1 0px, #CBD5E1 6px, transparent 6px, transparent 24px)',
						opacity: 0.8,
					}}
				/>

				{/* Train Composition (Left to Right) */}
				<div style={{display: 'flex', alignItems: 'center', position: 'relative', zIndex: 10}}>
					{/* Old Detached Engine moving away to the left */}
					<div
						style={{
							transform: `translateX(${oldEngineDetach}px)`,
							opacity: frame > 130 ? 0.35 : 1,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							marginRight: 14,
						}}
					>
						<div
							style={{
								background: 'linear-gradient(135deg, #DC2626, #991B1B)',
								border: '2px solid #FCA5A5',
								borderRadius: '12px 4px 4px 12px',
								padding: '8px 14px',
								color: '#FFFFFF',
								fontSize: 15,
								fontWeight: 900,
								display: 'flex',
								alignItems: 'center',
								gap: 6,
								boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
							}}
						>
							<span>🚂</span> OLD LOCO
						</div>
						<span style={{fontSize: 11, color: '#DC2626', fontWeight: 800, marginTop: 4}}>
							{frame > 80 ? '⬅️ డిటాచ్ అయ్యింది' : 'ఆగిన ఇంజిన్'}
						</span>
					</div>

					{/* 3 ICF Passenger Coaches (Sleeper / 3AC) */}
					<div style={{display: 'flex', gap: 6}}>
						{['ICF SL', 'ICF 3AC', 'ICF GEN'].map((coach, idx) => (
							<div
								key={idx}
								style={{
									background: 'linear-gradient(180deg, #1D4ED8 0%, #1E40AF 100%)',
									border: '2px solid #60A5FA',
									borderRadius: 6,
									padding: '12px 16px',
									color: '#FFFFFF',
									fontSize: 14,
									fontWeight: 900,
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 4,
									boxShadow: '0 4px 10px rgba(15, 23, 42, 0.12)',
								}}
							>
								<span>🚃</span>
								<span>{coach}</span>
							</div>
						))}
					</div>

					{/* Coupling Spark */}
					{clackSpark && (
						<div
							style={{
								position: 'absolute',
								right: -10,
								top: '30%',
								fontSize: 24,
								color: '#D97706',
								fontWeight: 900,
							}}
						>
							⚡ CLACK!
						</div>
					)}

					{/* New WAP-7 Engine moving in from right to attach */}
					<div
						style={{
							transform: `translateX(${newEngineAttach}px)`,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							marginLeft: 14,
						}}
					>
						<div
							style={{
								background: 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 50%, #DC2626 50%, #991B1B 100%)',
								border: '2.5px solid #10B981',
								borderRadius: '4px 14px 14px 4px',
								padding: '8px 18px',
								color: '#0F172A',
								fontSize: 16,
								fontWeight: 900,
								display: 'flex',
								alignItems: 'center',
								gap: 8,
								boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
							}}
						>
							<span style={{fontSize: 20}}>⚡</span>
							<span style={{color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,0.6)'}}>WAP-7 LOCO</span>
						</div>
						<span style={{fontSize: 12, color: isCoupled ? '#059669' : '#D97706', fontWeight: 900, marginTop: 4}}>
							{isCoupled ? '✅ కపుల్డ్ (Ready to Go!)' : '➡️ అటాచ్ అవుతోంది...'}
						</span>
					</div>
				</div>
			</div>

			{/* Bottom Note */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					width: '100%',
					fontSize: 15,
					fontWeight: 700,
					color: '#64748B',
				}}
			>
				<span>💡 వైజాగ్ స్టేషన్ టెర్మినల్ తరహాలో ఉండటంతో అన్ని రైళ్లకు ఇంజిన్ రివర్సల్ తప్పనిసరి.</span>
				<span style={{color: '#059669', fontWeight: 800}}>⚡ 6000 HP ఎలక్ట్రిక్ పవర్</span>
			</div>
		</div>
	);
};
