import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EasternGhatsView} from '../components/EasternGhatsView';
import {KineticText} from '../components/KineticText';
import {OdishaBilingualSign} from '../components/OdishaBilingualSign';

export const Scene5EasternGhats: React.FC = () => {
	const frame = useCurrentFrame();

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
			{/* Phase 1: Eastern Ghats View */}
			{frame < 650 && (
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
						tag="⛰️ EASTERN GHATS PARADISE"
						title="బొబ్బిలి, పార్వతీపురం మీదుగా పచ్చని కొండల మధ్య రైలు ప్రయాణం!"
						highlightWord="పచ్చని కొండల మధ్య"
						highlightColor="#059669"
						subtitle="వర్షాకాలం లేదా శీతాకాలంలో కెమెరాలు సైతం బంధించలేని అసలైన ప్రకృతి సౌందర్యం!"
						startFrame={10}
						fontSize={54}
					/>
					<EasternGhatsView />
				</div>
			)}

			{/* Phase 2: Odisha Border & Bhimpur Telugu Board */}
			{frame >= 650 && (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 32,
						zIndex: 10,
					}}
				>
					<KineticText
						tag="🚩 AP - ODISHA BORDER"
						title="ఒడిశా రాష్ట్రంలోకి ప్రవేశించినా... స్వాగతం పలికే తెలుగు బోర్డులు!"
						highlightWord="తెలుగు బోర్డులు"
						highlightColor="#2563EB"
						subtitle="సరిహద్దు దాటగానే ఎదురయ్యే మొదటి స్టేషన్ 'భీముడు పేట' వద్ద ప్రత్యేక ఆకర్షణ"
						startFrame={650}
						fontSize={54}
					/>
					<OdishaBilingualSign
						stationTe="భీముడు పేట"
						stationOdia="ଭୀମପୁର"
						stationEn="BHIMPUR"
						stationHi="भीमपुर"
						elevation="180 M"
						subnote="ఆంధ్రప్రదేశ్ - ఒడిశా సరిహద్దు స్టేషన్ (AP-Odisha Border)"
					/>
				</div>
			)}
		</AbsoluteFill>
	);
};
