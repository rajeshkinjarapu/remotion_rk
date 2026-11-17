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
import { StadiumNavyBackground } from './Backgrounds';
import { HeaderBar } from './HeaderBar';
import { SubtitleBar } from './SubtitleBar';
import { anekFont, ramaFont } from './fonts';

const PLAYERS = [
	{
		id: 'rohit',
		name: 'రోహిత్ శర్మ',
		team: 'ముంబై ఇండియన్స్',
		teamColor: '#0284C7',
		runs: 6628,
		runsDisplay: '6,628',
		avatar: 'cricket/rohit_avatar.png',
		barHeightMax: 390,
	},
	{
		id: 'kohli',
		name: 'విరాట్ కోహ్లీ',
		team: 'రాయల్ ఛాలెంజర్స్ బెంగళూరు',
		teamColor: '#E11D48',
		runs: 8004,
		runsDisplay: '8,004',
		avatar: 'cricket/kohli_avatar.png',
		barHeightMax: 500,
		highlight: true,
	},
	{
		id: 'dhoni',
		name: 'ఎంఎస్ ధోని',
		team: 'చెన్నై సూపర్ కింగ్స్',
		teamColor: '#EAB308',
		runs: 5243,
		runsDisplay: '5,243',
		avatar: 'cricket/dhoni_avatar.png',
		barHeightMax: 310,
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
			<StadiumNavyBackground />
			<HeaderBar
				title="ఐపీఎల్: మొత్తం పరుగులు - ఆల్-టైమ్ రికార్డులు"
				category="ప్లేయర్స్ పోలిక"
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

				{PLAYERS.map((player, idx) => {
					const delay = 12 + idx * 16;
					const barSpring = spring({
						frame: frame - delay,
						fps,
						config: { damping: 14, stiffness: 85 },
					});

					const currentBarHeight = interpolate(
						barSpring,
						[0, 1],
						[0, player.barHeightMax],
					);
					const currentRuns = Math.round(
						interpolate(barSpring, [0, 1], [0, player.runs]),
					).toLocaleString('en-IN');
					const contentOpacity = interpolate(barSpring, [0, 0.3, 1], [0, 0.7, 1]);

					return (
						<div
							key={player.id}
							style={{
								flex: '0 0 280px',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								position: 'relative',
								opacity: contentOpacity,
								height: '100%',
								justifyContent: 'flex-end',
							}}
						>
							{/* ABOVE BASELINE: Runs Counter + Vertical Bar */}
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									marginBottom: 200,
									width: '100%',
								}}
							>
								{/* GIGANTIC GOLDEN RUNS TEXT */}
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
											fontSize: player.highlight ? 64 : 48,
											fontWeight: 900,
											fontFamily: 'system-ui, -apple-system, sans-serif',
											letterSpacing: '-1px',
											textShadow: '0 4px 14px rgba(250, 204, 21, 0.4)',
										}}
									>
										{currentRuns}
									</span>
									<span
										style={{
											color: '#FACC15',
											fontSize: player.highlight ? 32 : 26,
											fontWeight: 900,
											fontFamily: ramaFont,
										}}
									>
										రన్స్
									</span>
								</div>

								{/* MINIMALIST SLEEK VERTICAL BAR */}
								<div
									style={{
										width: 170,
										height: currentBarHeight,
										backgroundColor: player.highlight ? '#B91C1C' : '#3B82F6',
										borderRadius: '6px 6px 0 0',
										boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
										borderTop: '2px solid rgba(255, 255, 255, 0.3)',
									}}
								/>
							</div>

							{/* BELOW BASELINE: Circular Avatar + Name + Team Pill */}
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
								{/* Circular Avatar with Team Color Ring */}
								<div
									style={{
										width: 115,
										height: 115,
										borderRadius: '50%',
										border: `4px solid ${player.teamColor}`,
										overflow: 'hidden',
										boxShadow: `0 8px 24px rgba(0, 0, 0, 0.6)`,
										backgroundColor: '#0F172A',
										transform: `translateY(-30px) scale(${interpolate(barSpring, [0, 1], [0.7, 1])})`,
										zIndex: 20,
									}}
								>
									<Img
										src={staticFile(player.avatar)}
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover',
											objectPosition: 'center top',
										}}
									/>
								</div>

								{/* Player Telugu Name */}
								<div
									style={{
										color: '#FFFFFF',
										fontSize: 30,
										fontWeight: 900,
										textAlign: 'center',
										fontFamily: ramaFont,
										marginTop: -16,
										whiteSpace: 'nowrap',
										textShadow: '0 2px 8px rgba(0,0,0,0.6)',
									}}
								>
									{player.name}
								</div>

								{/* Team Pill Badge */}
								<div
									style={{
										marginTop: 8,
										backgroundColor: player.teamColor,
										color: player.id === 'dhoni' ? '#000000' : '#FFFFFF',
										fontSize: 15,
										fontWeight: 900,
										padding: '4px 16px',
										borderRadius: 20,
										fontFamily: anekFont,
										letterSpacing: '0.5px',
										boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
									}}
								>
									{player.team}
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<SubtitleBar
				text="ఐపీఎల్ చరిత్రలో విరాట్ కోహ్లీ 8,004 పరుగులతో నంబర్ 1 గా నిలిచారు..."
				highlight="8,004 పరుగులు"
			/>
		</AbsoluteFill>
	);
};

