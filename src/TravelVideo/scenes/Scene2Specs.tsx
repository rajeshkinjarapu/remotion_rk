import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {RouteMapSVG} from '../components/RouteMapSVG';

export const Scene2Specs: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const mapProgress = interpolate(frame, [0, 1200], [0.0, 0.22], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const cardSpring = spring({
		frame,
		fps,
		config: {damping: 14, mass: 0.8},
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#F8FAFC',
				color: '#0F172A',
				overflow: 'hidden',
				padding: '40px 56px',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
			}}
		>
			{/* Main Split Layout: Left Info HUD, Right Animated Route Map */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '0.95fr 1.05fr',
					gap: 36,
					height: '100%',
					alignItems: 'center',
				}}
			>
				{/* LEFT: SPECS & TIMETABLE HUD */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 20,
						transform: `translateY(${interpolate(cardSpring, [0, 1], [35, 0])}px)`,
						opacity: interpolate(cardSpring, [0, 1], [0, 1]),
					}}
				>
					{/* Train Header Tag */}
					<div
						style={{
							background: '#FFFFFF',
							border: '1.5px solid #E2E8F0',
							borderLeft: '8px solid #2563EB',
							borderRadius: 20,
							padding: '20px 28px',
							boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
						}}
					>
						<div style={{fontSize: 14, fontWeight: 900, color: '#2563EB', letterSpacing: '0.1em'}}>
							DAILY EXPRESS SERVICE
						</div>
						<h2 style={{margin: '4px 0 0 0', fontSize: 44, fontWeight: 900, color: '#0F172A'}}>
							రైలు సంఖ్య: <span style={{color: '#2563EB'}}>17243</span>
						</h2>
					</div>

					{/* 4 Essential Stats Grid */}
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: 16,
						}}
					>
						{/* Timing Box */}
						<div
							style={{
								background: '#FFFFFF',
								border: '1.5px solid #E2E8F0',
								borderRadius: 18,
								padding: '18px 22px',
								boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
							}}
						>
							<div style={{fontSize: 13, fontWeight: 800, color: '#64748B'}}>ప్రయాణ వేళలు</div>
							<div style={{fontSize: 22, fontWeight: 900, color: '#0F172A', marginTop: 4}}>
								11:20 PM ➔ 1:40 PM
							</div>
							<div style={{fontSize: 13, color: '#059669', fontWeight: 800, marginTop: 2}}>
								మరుసటి రోజు మధ్యాహ్నం
							</div>
						</div>

						{/* Duration & Stops */}
						<div
							style={{
								background: '#FFFFFF',
								border: '1.5px solid #E2E8F0',
								borderRadius: 18,
								padding: '18px 22px',
								boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
							}}
						>
							<div style={{fontSize: 13, fontWeight: 800, color: '#64748B'}}>నిడివి & స్టేషన్లు</div>
							<div style={{fontSize: 22, fontWeight: 900, color: '#0F172A', marginTop: 4}}>
								14 గం. 30 ని.
							</div>
							<div style={{fontSize: 13, color: '#D97706', fontWeight: 800, marginTop: 2}}>
								మొత్తం 30 స్టేషన్లు
							</div>
						</div>

						{/* Coach Type */}
						<div
							style={{
								background: '#FFFFFF',
								border: '1.5px solid #E2E8F0',
								borderRadius: 18,
								padding: '18px 22px',
								boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
							}}
						>
							<div style={{fontSize: 13, fontWeight: 800, color: '#64748B'}}>కోచ్‌ల రకం (COACHES)</div>
							<div style={{fontSize: 20, fontWeight: 900, color: '#0F172A', marginTop: 4}}>
								ICF కోచ్‌లు
							</div>
							<div style={{fontSize: 13, color: '#64748B', fontWeight: 700, marginTop: 2}}>
								3AC, స్లీపర్, జనరల్
							</div>
						</div>

						{/* Rake Sharing */}
						<div
							style={{
								background: '#FFFFFF',
								border: '1.5px solid #E2E8F0',
								borderRadius: 18,
								padding: '18px 22px',
								boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
							}}
						>
							<div style={{fontSize: 13, fontWeight: 800, color: '#64748B'}}>రేక్ షేరింగ్ (RSA)</div>
							<div style={{fontSize: 18, fontWeight: 900, color: '#0F172A', marginTop: 4}}>
								కాచిగూడ - మెదక్
							</div>
							<div style={{fontSize: 13, color: '#2563EB', fontWeight: 700, marginTop: 2}}>
								Kacheguda - Medak Exp
							</div>
						</div>
					</div>

					{/* Route Summary Pill */}
					<div
						style={{
							background: '#EFF6FF',
							border: '1.5px solid #BFDBFE',
							borderRadius: 16,
							padding: '16px 22px',
							display: 'flex',
							alignItems: 'center',
							gap: 12,
						}}
					>
						<span style={{fontSize: 26}}>🚅</span>
						<div style={{fontSize: 16, fontWeight: 700, color: '#1E293B', lineHeight: 1.4}}>
							గుంటూరు నుండి విజయవాడ, ఏలూరు, రాజమండ్రి, సామర్లకోట, వైజాగ్, బొబ్బిలి మీదుగా రాయగడ వరకు ప్రయాణం.
						</div>
					</div>
				</div>

				{/* RIGHT: ANIMATED ROUTE MAP */}
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<RouteMapSVG progress={mapProgress} activeStationIndex={mapProgress < 0.1 ? 0 : mapProgress < 0.18 ? 2 : 3} />
				</div>
			</div>
		</AbsoluteFill>
	);
};
