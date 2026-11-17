export interface CandidateAsset {
	name: string;
	role: string;
	party: string;
	partyColor: string;
	partyBg: string;
	amountCr: number;
	amountText: string;
	avatarImg: string;
	highlight?: boolean;
}

export interface ExplainerTimings {
	scene1: { durSec: number; frames: number };
	scene2: { durSec: number; frames: number };
	scene3: { durSec: number; frames: number };
}

