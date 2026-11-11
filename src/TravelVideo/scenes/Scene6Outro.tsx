import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {KineticText} from '../components/KineticText';
import {OdishaBilingualSign} from '../components/OdishaBilingualSign';

export const Scene6Outro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const ctaSpring = spring({
		frame: frame - 500,
		fps,
		config: {damping: 12, mass: 0.8},
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#F8FAFC',
				color: '#0F172A',
				overflow: 'hidden',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			{/* Phase 1: Arrival at Rayagada (0 - 500 frames) */}
			{frame < 500 && (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 28,
						zIndex: 10,
					}}
				>
					<KineticText
						tag="🏁 DESTINATION REACHED"
						title="చివరిగా కొండల మధ్య ఒడిశాలోని రాయగడ చేరుకున్నాం!"
						highlightWord="రాయగడ"
						highlightColor="#2563EB"
						subtitle="రాయగడ పట్టణంలో విశేషంగా నివసించే తెలుగు ప్రజలు • మధ్యాహ్నం 3:30 కి తిరుగు ప్రయాణం"
						startFrame={10}
						fontSize={56}
					/>
					<OdishaBilingualSign
						stationTe="రాయగడ"
						stationOdia="ରାୟଗଡା"
						stationEn="RAYAGADA"
						stationHi="रायगड़ा"
						elevation="207 M"
						subnote="WALTAIR DIVISION • EAST COAST RAILWAY (ECoR)"
					/>
				</div>
			)}

			{/* Phase 2: Channel Outro & Engagement CTA (500 - 1004 frames) */}
			{frame >= 500 && (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 32,
						zIndex: 10,
						transform: `scale(${interpolate(ctaSpring, [0, 1], [0.92, 1])})`,
						opacity: interpolate(ctaSpring, [0, 1], [0, 1]),
					}}
				>
					<KineticText
						tag="❤️ TRAVEL VERDICT"
						title="బడ్జెట్లో ప్రకృతిని ఆస్వాదించే వారికి ఒక బెస్ట్ రైలు జర్నీ!"
						highlightWord="బెస్ట్ రైలు జర్నీ"
						highlightColor="#059669"
						subtitle="మరి ఈ వర్చువల్ జర్నీ మీకు ఎలా అనిపించింది? మీరు ఎప్పుడైనా ఇందులో ప్రయాణించారా?"
						startFrame={500}
						fontSize={54}
					/>

					{/* YouTube Community & Subscribe Master Card */}
					<div
						style={{
							background: '#FFFFFF',
							border: '2px solid #E2E8F0',
							borderTop: '5px solid #EF4444',
							borderRadius: 28,
							padding: '36px 64px',
							boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.03)',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 24,
						}}
					>
						{/* Comment Prompt Pill */}
						<div
							style={{
								background: '#EFF6FF',
								border: '1.5px solid #BFDBFE',
								borderRadius: 999,
								padding: '8px 26px',
								display: 'flex',
								alignItems: 'center',
								gap: 10,
								fontSize: 20,
								fontWeight: 800,
								color: '#1D4ED8',
							}}
						>
							<span>💬</span> మీ ప్రయాణ అనుభవాలను కింద కామెంట్స్ లో పంచుకోండి!
						</div>

						{/* Action Buttons Row */}
						<div style={{display: 'flex', alignItems: 'center', gap: 24}}>
							{/* Like Button */}
							<div
								style={{
									background: '#F8FAFC',
									border: '1.5px solid #CBD5E1',
									borderRadius: 18,
									padding: '14px 28px',
									display: 'flex',
									alignItems: 'center',
									gap: 12,
									fontSize: 22,
									fontWeight: 900,
									color: '#0F172A',
									boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
								}}
							>
								<span>👍</span> LIKE
							</div>

							{/* Big Red Pulsing Subscribe Button */}
							<div
								style={{
									background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
									border: '2px solid #FCA5A5',
									borderRadius: 20,
									padding: '16px 44px',
									display: 'flex',
									alignItems: 'center',
									gap: 14,
									fontSize: 26,
									fontWeight: 900,
									color: '#FFFFFF',
									boxShadow: '0 4px 18px rgba(239, 68, 68, 0.4)',
									transform: `scale(${1 + Math.sin(frame / 10) * 0.03})`,
								}}
							>
								<span>🔔</span> SUBSCRIBE NOW
							</div>

							{/* Share Button */}
							<div
								style={{
									background: '#F8FAFC',
									border: '1.5px solid #CBD5E1',
									borderRadius: 18,
									padding: '14px 28px',
									display: 'flex',
									alignItems: 'center',
									gap: 12,
									fontSize: 22,
									fontWeight: 900,
									color: '#0F172A',
									boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
								}}
							>
								<span>🚀</span> SHARE
							</div>
						</div>

						{/* Outro Sign-off */}
						<div
							style={{
								fontSize: 20,
								fontWeight: 800,
								color: '#D97706',
								letterSpacing: '0.08em',
								textTransform: 'uppercase',
								marginTop: 4,
							}}
						>
							✨ మరో అద్భుతమైన జర్నీ తో మళ్ళీ కలుద్దాం • KEEP EXPLORING! ✨
						</div>
					</div>
				</div>
			)}
		</AbsoluteFill>
	);
};
