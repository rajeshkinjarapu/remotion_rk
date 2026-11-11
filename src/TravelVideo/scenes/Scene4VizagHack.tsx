import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {LocoReversalGraphic} from '../components/LocoReversalGraphic';
import {TicketHackGraphic} from '../components/TicketHackGraphic';

export const Scene4VizagHack: React.FC = () => {
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
			{/* Phase 1: Loco Reversal */}
			{frame < 900 && (
				<div style={{zIndex: 10}}>
					<LocoReversalGraphic />
				</div>
			)}

			{/* Phase 2: Confirm Ticket Hack */}
			{frame >= 900 && (
				<div style={{zIndex: 10}}>
					<TicketHackGraphic />
				</div>
			)}
		</AbsoluteFill>
	);
};
