import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const TicketHackGraphic: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({
		frame,
		fps,
		config: {damping: 14, mass: 0.8},
	});

	const directOpacity = interpolate(frame, [10, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const split1Opacity = interpolate(frame, [45, 65], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const split2Opacity = interpolate(frame, [70, 90], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 22,
				background: '#FFFFFF',
				border: '2px solid #E2E8F0',
				borderTop: '5px solid #10B981',
				borderRadius: 28,
				padding: '36px 44px',
				boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.03)',
				transform: `scale(${entrance})`,
				opacity: entrance,
				width: 1050,
			}}
		>
			{/* Header */}
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
					<div
						style={{
							width: 48,
							height: 48,
							borderRadius: 14,
							background: 'linear-gradient(135deg, #10B981, #059669)',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							fontSize: 26,
							color: '#FFFFFF',
							boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
						}}
					>
						🎫
					</div>
					<div>
						<h3 style={{margin: 0, fontSize: 30, fontWeight: 900, color: '#0F172A'}}>
							రాయగడ కన్ఫర్మ్ టికెట్ సీక్రెట్ ట్రిక్! (CONFIRM TICKET HACK)
						</h3>
						<span style={{fontSize: 16, fontWeight: 700, color: '#059669'}}>
							డైరెక్ట్ వెయిట్‌లిస్ట్ ఉన్నా... ఈ స్ప్లిట్ టికెట్ పద్ధతితో కన్ఫర్మ్ సీట్ పొందండి
						</span>
					</div>
				</div>

				<div
					style={{
						background: '#ECFDF5',
						border: '1.5px solid #A7F3D0',
						borderRadius: 999,
						padding: '6px 18px',
						fontSize: 14,
						fontWeight: 900,
						color: '#047857',
						letterSpacing: '0.08em',
					}}
				>
					95% SUCCESS RATE ✅
				</div>
			</div>

			{/* Comparison: Direct vs Split */}
			<div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20}}>
				{/* 1. Direct Booking (Waitlisted Fail) */}
				<div
					style={{
						opacity: directOpacity,
						background: '#FEF2F2',
						border: '2px dashed #FCA5A5',
						borderRadius: 20,
						padding: '24px',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
					}}
				>
					<div>
						<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
							<span style={{fontSize: 13, fontWeight: 900, color: '#DC2626', letterSpacing: '0.08em'}}>
								DIRECT BOOKING ❌
							</span>
							<span style={{fontSize: 20}}>🚫</span>
						</div>
						<div style={{fontSize: 20, fontWeight: 900, color: '#991B1B'}}>గుంటూరు ➔ రాయగడ</div>
						<div style={{fontSize: 14, color: '#64748B', marginTop: 4}}>GNT to RGDA (Full Route)</div>
					</div>

					<div
						style={{
							marginTop: 18,
							background: '#FEE2E2',
							border: '1.5px solid #EF4444',
							borderRadius: 12,
							padding: '10px 14px',
							textAlign: 'center',
						}}
					>
						<span style={{fontSize: 15, fontWeight: 900, color: '#DC2626'}}>
							WAITLIST / REGRET (WL 48)
						</span>
					</div>
				</div>

				{/* 2. Split Booking (Two Confirmed Tickets) */}
				<div
					style={{
						background: '#F0FDF4',
						border: '2px solid #BBF7D0',
						borderRadius: 20,
						padding: '24px',
						display: 'flex',
						flexDirection: 'column',
						gap: 14,
					}}
				>
					<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
						<span style={{fontSize: 14, fontWeight: 900, color: '#047857', letterSpacing: '0.08em'}}>
							PRO HACK: SPLIT BOOKING (రెండు టికెట్లుగా బుక్ చేయండి) ⭐
						</span>
						<span style={{fontSize: 18}}>💡</span>
					</div>

					<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14}}>
						{/* Split Ticket 1 */}
						<div
							style={{
								opacity: split1Opacity,
								background: '#FFFFFF',
								border: '1.5px solid #86EFAC',
								borderRadius: 14,
								padding: '14px 18px',
								boxShadow: '0 2px 8px rgba(16, 185, 129, 0.12)',
							}}
						>
							<div style={{fontSize: 12, fontWeight: 800, color: '#059669'}}>TICKET #1 (రాత్రి జర్నీ)</div>
							<div style={{fontSize: 18, fontWeight: 900, color: '#0F172A', marginTop: 2}}>
								గుంటూరు ➔ సామర్లకోట
							</div>
							<div
								style={{
									marginTop: 10,
									display: 'inline-flex',
									alignItems: 'center',
									gap: 6,
									background: '#10B981',
									borderRadius: 8,
									padding: '4px 10px',
									fontSize: 13,
									fontWeight: 900,
									color: '#FFFFFF',
								}}
							>
								✓ CNF S4-23 (కన్ఫర్మ్)
							</div>
						</div>

						{/* Split Ticket 2 */}
						<div
							style={{
								opacity: split2Opacity,
								background: '#FFFFFF',
								border: '1.5px solid #86EFAC',
								borderRadius: 14,
								padding: '14px 18px',
								boxShadow: '0 2px 8px rgba(16, 185, 129, 0.12)',
							}}
						>
							<div style={{fontSize: 12, fontWeight: 800, color: '#059669'}}>TICKET #2 (పగటి జర్నీ)</div>
							<div style={{fontSize: 18, fontWeight: 900, color: '#0F172A', marginTop: 2}}>
								సామర్లకోట ➔ రాయగడ
							</div>
							<div
								style={{
									marginTop: 10,
									display: 'inline-flex',
									alignItems: 'center',
									gap: 6,
									background: '#10B981',
									borderRadius: 8,
									padding: '4px 10px',
									fontSize: 13,
									fontWeight: 900,
									color: '#FFFFFF',
								}}
							>
								✓ CNF S4-27 (కన్ఫర్మ్)
							</div>
						</div>
					</div>

					<div style={{fontSize: 14, fontWeight: 700, color: '#475569', lineHeight: 1.45}}>
						వైజాగ్ స్టేషన్ దాటాక ప్రయాణికులు దిగిపోవడంతో ట్రైన్ చాలా వరకు ఖాళీ అవుతుంది. కాబట్టి ఈ రెండు టికెట్లతో ఒకే సీటు లేదా పక్కపక్క బెర్త్‌లు చాలా సులభంగా కన్ఫర్మ్ అవుతాయి!
					</div>
				</div>
			</div>
		</div>
	);
};
