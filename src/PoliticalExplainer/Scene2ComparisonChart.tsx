import React from 'react';
import {
	AbsoluteFill,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import { NavyBackground } from './Backgrounds';
import { HeaderBar } from './HeaderBar';
import { SubtitleBar } from './SubtitleBar';

const CANDIDATES = [
	{
		id: 'bhagya',
		name: 'రాయన భాగ్యలక్ష్మి',
		party: 'వైసీపీ',
		partyColor: '#0284C7',
		amountCr: 6.0,
		amountDisplay: '₹6.00',
		avatar: 'political/bhagya_avatar.png',
		barHeightMax: 240,
		order: 1,
	},
	{
		id: 'abv',
		name: 'ఏబీ వెంకటేశ్వరరావు',
		party: 'స్వతంత్ర',
		partyColor: '#64748B',
		amountCr: 21.55,
		amountDisplay: '₹21.55',
		avatar: 'political/abv_avatar.png',
		barHeightMax: 480,
		order: 2,
	},
	{
		id: 'radha',
		name: 'వంగవీటి రాధా',
		party: 'జనసేన',
		partyColor: '#DC2626',
		amountCr: 3.2,
		amountDisplay: '₹3.20',
		avatar: 'political/bhagya_avatar.png', // Or placeholder
		barHeightMax: 160,
		order: 3,
	},
];

export const Scene2ComparisonChart: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Baseline entrance
	const lineSpring = spring({
		frame: frame - 5,
		fps,
		config: { damping: 14, stiffness: 90 },
	});
	const lineWidth = interpolate(lineSpring, [0, 1], [0, 100]);

	return (
		<AbsoluteFill>
			<NavyBackground />
			<HeaderBar
				title="విజయవాడ: ఎవరి ఆస్తులు ఎంత?"
				category="మేయర్ అభ్యర్థులు"
				theme="dark"
			/>

			{/* Comparison Stage (16:9 Landscape Layout) */}
			<div
				style={{
					position: 'absolute',
					top: 150,
					left: 80,
					right: 80,
					bottom: 120,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'flex-end',
					gap: 160,
				}}
			>
				{/* WHITE BASELINE LINE SPANNING THE FULL STAGE */}
				<div
					style={{
						position: 'absolute',
						bottom: 200,
						left: 0,
						width: `${lineWidth}%`,
						height: 4,
						backgroundColor: '#FFFFFF',
						boxShadow: '0 2px 10px rgba(255, 255, 255, 0.4)',
						zIndex: 10,
					}}
				/>

				{CANDIDATES.map((cand, idx) => {
					// Stagger animation: ABV enters first or in sequence
					const delay = 12 + idx * 16;
					const barSpring = spring({
						frame: frame - delay,
						fps,
						config: { damping: 14, stiffness: 85 },
					});

					const currentBarHeight = interpolate(
						barSpring,
						[0, 1],
						[0, cand.barHeightMax],
					);
					const currentAmount = interpolate(
						barSpring,
						[0, 1],
						[0, cand.amountCr],
					).toFixed(2);
					const contentOpacity = interpolate(barSpring, [0, 0.3, 1], [0, 0.7, 1]);

					return (
						<div
							key={cand.id}
							style={{
								flex: '0 0 260px',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								position: 'relative',
								opacity: contentOpacity,
								height: '100%',
								justifyContent: 'flex-end',
							}}
						>
							{/* ABOVE BASELINE: Rupee Counter + Vertical Bar */}
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									marginBottom: 200, // Anchored directly on top of the 200px baseline
									width: '100%',
								}}
							>
								{/* GIGANTIC GOLDEN RUPEE TEXT */}
								<div
									style={{
										marginBottom: 14,
										display: 'flex',
										alignItems: 'baseline',
										gap: 6,
										transform: `scale(${interpolate(barSpring, [0, 1], [0.6, 1])})`,
									}}
								>
									<span
										style={{
											color: '#FACC15',
											fontSize: cand.id === 'abv' ? 62 : 46,
											fontWeight: 900,
											fontFamily: 'system-ui, -apple-system, sans-serif',
											letterSpacing: '-1px',
											textShadow: '0 4px 14px rgba(250, 204, 21, 0.4)',
										}}
									>
										₹{currentAmount}
									</span>
									<span
										style={{
											color: '#FACC15',
											fontSize: cand.id === 'abv' ? 34 : 26,
											fontWeight: 900,
											fontFamily: '"Anek Telugu", "Noto Sans Telugu", sans-serif',
										}}
									>
										కోట్లు
									</span>
								</div>

								{/* MINIMALIST SLEEK GREY VERTICAL BAR (Exact replica of ref_vid1_s25.jpg) */}
								<div
									style={{
										width: 170,
										height: currentBarHeight,
										backgroundColor: cand.id === 'abv' ? '#6B7C93' : '#4E5F75',
										borderRadius: '4px 4px 0 0',
										boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
										borderTop: '2px solid rgba(255, 255, 255, 0.2)',
									}}
								/>
							</div>

							{/* BELOW BASELINE: Circular Avatar + Name + Party Pill */}
							<div
								style={{
									position: 'absolute',
									bottom: 0,
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									width: '100%',
								}}
							>
								{/* Circular Avatar with Party Color Ring */}
								<div
									style={{
										width: 110,
										height: 110,
										borderRadius: '50%',
										border: `4px solid ${cand.partyColor}`,
										overflow: 'hidden',
										boxShadow: `0 8px 24px rgba(0, 0, 0, 0.5)`,
										backgroundColor: '#0F172A',
										transform: `translateY(-30px) scale(${interpolate(barSpring, [0, 1], [0.7, 1])})`,
										zIndex: 20,
									}}
								>
									<Img
										src={staticFile(cand.avatar)}
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover',
											objectPosition: 'center top',
										}}
									/>
								</div>

								{/* Candidate Telugu Name */}
								<div
									style={{
										color: '#FFFFFF',
										fontSize: 28,
										fontWeight: 900,
										textAlign: 'center',
										fontFamily: '"Anek Telugu", "Noto Sans Telugu", sans-serif',
										marginTop: -16,
										whiteSpace: 'nowrap',
										textShadow: '0 2px 8px rgba(0,0,0,0.6)',
									}}
								>
									{cand.name}
								</div>

								{/* Party Pill Badge */}
								<div
									style={{
										marginTop: 8,
										backgroundColor: cand.partyColor,
										color: '#FFFFFF',
										fontSize: 16,
										fontWeight: 900,
										padding: '4px 18px',
										borderRadius: 20,
										fontFamily: '"Anek Telugu", "Noto Sans Telugu", sans-serif',
										letterSpacing: '0.5px',
										boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
									}}
								>
									{cand.party}
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<SubtitleBar
				text="ఏబీ వెంకటేశ్వరరావు ₹21.55 కోట్లతో టాప్ లో ఉండగా, వైసీపీ ₹6 కోట్లు..."
				highlight="₹21.55 కోట్లు"
			/>
		</AbsoluteFill>
	);
};
