export interface QuizTheme {
	id: string;
	name: string;
	bgGradient: string;
	beam1Color: string;
	beam2Color: string;
	badgeBg: string;
	badgeBorder: string;
	badgeGlow: string;
	letterCoinBg: string;
	letterCoinBorder: string;
	accent: string;
}

export const QUIZ_THEMES: QuizTheme[] = [
	// 1. Royal Blue (Classic Cricket Broadcast)
	{
		id: 'royal-blue',
		name: 'Royal Blue',
		bgGradient:
			'radial-gradient(ellipse 95% 70% at 50% 20%, #1e3a8a 0%, #0f172a 55%, #020617 100%)',
		beam1Color: 'rgba(56, 189, 248, 0.16)',
		beam2Color: 'rgba(234, 179, 8, 0.14)',
		badgeBg: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)',
		badgeBorder: '#fef08a',
		badgeGlow: 'rgba(217, 119, 6, 0.6)',
		letterCoinBg: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)',
		letterCoinBorder: '#60a5fa',
		accent: '#38bdf8',
	},
	// 2. Stadium Emerald (Lush Cricket Ground)
	{
		id: 'stadium-emerald',
		name: 'Stadium Emerald',
		bgGradient:
			'radial-gradient(ellipse 95% 70% at 50% 20%, #064e3b 0%, #022c22 55%, #02120d 100%)',
		beam1Color: 'rgba(52, 211, 153, 0.18)',
		beam2Color: 'rgba(250, 204, 21, 0.14)',
		badgeBg: 'linear-gradient(180deg, #10b981 0%, #047857 100%)',
		badgeBorder: '#a7f3d0',
		badgeGlow: 'rgba(16, 185, 129, 0.6)',
		letterCoinBg: 'linear-gradient(180deg, #059669 0%, #047857 100%)',
		letterCoinBorder: '#6ee7b7',
		accent: '#34d399',
	},
	// 3. Imperial Purple (KBC Megastar Royalty)
	{
		id: 'imperial-purple',
		name: 'Imperial Purple',
		bgGradient:
			'radial-gradient(ellipse 95% 70% at 50% 20%, #4c1d95 0%, #2e1065 55%, #090214 100%)',
		beam1Color: 'rgba(192, 132, 252, 0.18)',
		beam2Color: 'rgba(251, 191, 36, 0.15)',
		badgeBg: 'linear-gradient(180deg, #8b5cf6 0%, #6d28d9 100%)',
		badgeBorder: '#ddd6fe',
		badgeGlow: 'rgba(139, 92, 246, 0.6)',
		letterCoinBg: 'linear-gradient(180deg, #7c3aed 0%, #5b21b6 100%)',
		letterCoinBorder: '#c4b5fd',
		accent: '#c084fc',
	},
	// 4. Crimson Ruby (High Energy & Passion)
	{
		id: 'crimson-ruby',
		name: 'Crimson Ruby',
		bgGradient:
			'radial-gradient(ellipse 95% 70% at 50% 20%, #881337 0%, #4c0519 55%, #150106 100%)',
		beam1Color: 'rgba(244, 63, 94, 0.18)',
		beam2Color: 'rgba(251, 191, 36, 0.15)',
		badgeBg: 'linear-gradient(180deg, #e11d48 0%, #be123c 100%)',
		badgeBorder: '#fecdd3',
		badgeGlow: 'rgba(225, 29, 72, 0.6)',
		letterCoinBg: 'linear-gradient(180deg, #f43f5e 0%, #be123c 100%)',
		letterCoinBorder: '#fda4af',
		accent: '#fb7185',
	},
	// 5. Midnight Cyan (Neo Stadium & Night Lights)
	{
		id: 'midnight-cyan',
		name: 'Midnight Cyan',
		bgGradient:
			'radial-gradient(ellipse 95% 70% at 50% 20%, #164e63 0%, #083344 55%, #021118 100%)',
		beam1Color: 'rgba(34, 211, 238, 0.20)',
		beam2Color: 'rgba(251, 191, 36, 0.12)',
		badgeBg: 'linear-gradient(180deg, #0891b2 0%, #0e7490 100%)',
		badgeBorder: '#cffafe',
		badgeGlow: 'rgba(8, 145, 178, 0.6)',
		letterCoinBg: 'linear-gradient(180deg, #06b6d4 0%, #0e7490 100%)',
		letterCoinBorder: '#67e8f9',
		accent: '#22d3ee',
	},
	// 6. Golden Amber (Grand Trophy Gala)
	{
		id: 'golden-amber',
		name: 'Golden Amber',
		bgGradient:
			'radial-gradient(ellipse 95% 70% at 50% 20%, #78350f 0%, #451a03 55%, #180901 100%)',
		beam1Color: 'rgba(251, 191, 36, 0.22)',
		beam2Color: 'rgba(245, 158, 11, 0.16)',
		badgeBg: 'linear-gradient(180deg, #f59e0b 0%, #b45309 100%)',
		badgeBorder: '#fef08a',
		badgeGlow: 'rgba(245, 158, 11, 0.6)',
		letterCoinBg: 'linear-gradient(180deg, #d97706 0%, #92400e 100%)',
		letterCoinBorder: '#fde68a',
		accent: '#fbbf24',
	},
	// 7. Deep Indigo (Prime Time Television)
	{
		id: 'deep-indigo',
		name: 'Deep Indigo',
		bgGradient:
			'radial-gradient(ellipse 95% 70% at 50% 20%, #312e81 0%, #1e1b4b 55%, #08061a 100%)',
		beam1Color: 'rgba(129, 140, 248, 0.18)',
		beam2Color: 'rgba(56, 189, 248, 0.14)',
		badgeBg: 'linear-gradient(180deg, #6366f1 0%, #4338ca 100%)',
		badgeBorder: '#c7d2fe',
		badgeGlow: 'rgba(99, 102, 241, 0.6)',
		letterCoinBg: 'linear-gradient(180deg, #4f46e5 0%, #3730a3 100%)',
		letterCoinBorder: '#a5b4fc',
		accent: '#818cf8',
	},
	// 8. Sunset Orange (Sunrisers & T20 Explosiveness)
	{
		id: 'sunset-orange',
		name: 'Sunset Orange',
		bgGradient:
			'radial-gradient(ellipse 95% 70% at 50% 20%, #7c2d12 0%, #431407 55%, #1a0601 100%)',
		beam1Color: 'rgba(251, 146, 60, 0.22)',
		beam2Color: 'rgba(234, 179, 8, 0.16)',
		badgeBg: 'linear-gradient(180deg, #ea580c 0%, #c2410c 100%)',
		badgeBorder: '#ffedd5',
		badgeGlow: 'rgba(234, 88, 12, 0.6)',
		letterCoinBg: 'linear-gradient(180deg, #f97316 0%, #c2410c 100%)',
		letterCoinBorder: '#fed7aa',
		accent: '#fb923c',
	},
	// 9. Teal Twilight (Ocean Breeze Arena)
	{
		id: 'teal-twilight',
		name: 'Teal Twilight',
		bgGradient:
			'radial-gradient(ellipse 95% 70% at 50% 20%, #134e4a 0%, #042f2e 55%, #011413 100%)',
		beam1Color: 'rgba(45, 212, 191, 0.20)',
		beam2Color: 'rgba(56, 189, 248, 0.14)',
		badgeBg: 'linear-gradient(180deg, #0d9488 0%, #0f766e 100%)',
		badgeBorder: '#ccfbf1',
		badgeGlow: 'rgba(13, 148, 136, 0.6)',
		letterCoinBg: 'linear-gradient(180deg, #14b8a6 0%, #0f766e 100%)',
		letterCoinBorder: '#5eead4',
		accent: '#2dd4bf',
	},
	// 10. Royal Violet (Championship Majesty)
	{
		id: 'royal-violet',
		name: 'Royal Violet',
		bgGradient:
			'radial-gradient(ellipse 95% 70% at 50% 20%, #581c87 0%, #3b0764 55%, #10011c 100%)',
		beam1Color: 'rgba(216, 180, 254, 0.18)',
		beam2Color: 'rgba(244, 114, 182, 0.14)',
		badgeBg: 'linear-gradient(180deg, #9333ea 0%, #7e22ce 100%)',
		badgeBorder: '#f3e8ff',
		badgeGlow: 'rgba(147, 51, 234, 0.6)',
		letterCoinBg: 'linear-gradient(180deg, #a855f7 0%, #7e22ce 100%)',
		letterCoinBorder: '#e9d5ff',
		accent: '#d8b4fe',
	},
	// 11. Electric Blue (Floodlit Arena)
	{
		id: 'electric-blue',
		name: 'Electric Blue',
		bgGradient:
			'radial-gradient(ellipse 95% 70% at 50% 20%, #0369a1 0%, #0c4a6e 55%, #021a29 100%)',
		beam1Color: 'rgba(14, 165, 233, 0.22)',
		beam2Color: 'rgba(99, 102, 241, 0.15)',
		badgeBg: 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)',
		badgeBorder: '#e0f2fe',
		badgeGlow: 'rgba(2, 132, 199, 0.6)',
		letterCoinBg: 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)',
		letterCoinBorder: '#7dd3fc',
		accent: '#38bdf8',
	},
	// 12. Forest Green (Classic Test Match)
	{
		id: 'forest-green',
		name: 'Forest Green',
		bgGradient:
			'radial-gradient(ellipse 95% 70% at 50% 20%, #14532d 0%, #052e16 55%, #011308 100%)',
		beam1Color: 'rgba(74, 222, 128, 0.18)',
		beam2Color: 'rgba(250, 204, 21, 0.14)',
		badgeBg: 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)',
		badgeBorder: '#dcfce7',
		badgeGlow: 'rgba(22, 163, 74, 0.6)',
		letterCoinBg: 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)',
		letterCoinBorder: '#86efac',
		accent: '#4ade80',
	},
	// 13. Rose Quartz / Magenta (Cinema & Entertainment)
	{
		id: 'rose-magenta',
		name: 'Rose Magenta',
		bgGradient:
			'radial-gradient(ellipse 95% 70% at 50% 20%, #701a75 0%, #4a044e 55%, #18001a 100%)',
		beam1Color: 'rgba(232, 121, 249, 0.18)',
		beam2Color: 'rgba(251, 146, 60, 0.14)',
		badgeBg: 'linear-gradient(180deg, #c026d3 0%, #9333ea 100%)',
		badgeBorder: '#fae8ff',
		badgeGlow: 'rgba(192, 38, 211, 0.6)',
		letterCoinBg: 'linear-gradient(180deg, #d946ef 0%, #a855f7 100%)',
		letterCoinBorder: '#f0abfc',
		accent: '#e879f9',
	},
	// 14. Steel Slate (Sophisticated News Studio)
	{
		id: 'steel-slate',
		name: 'Steel Slate',
		bgGradient:
			'radial-gradient(ellipse 95% 70% at 50% 20%, #334155 0%, #1e293b 55%, #090d16 100%)',
		beam1Color: 'rgba(148, 163, 184, 0.18)',
		beam2Color: 'rgba(56, 189, 248, 0.14)',
		badgeBg: 'linear-gradient(180deg, #64748b 0%, #475569 100%)',
		badgeBorder: '#f1f5f9',
		badgeGlow: 'rgba(100, 116, 139, 0.6)',
		letterCoinBg: 'linear-gradient(180deg, #64748b 0%, #334155 100%)',
		letterCoinBorder: '#cbd5e1',
		accent: '#94a3b8',
	},
	// 15. Copper Bronze (Antique Championship Trophy)
	{
		id: 'copper-bronze',
		name: 'Copper Bronze',
		bgGradient:
			'radial-gradient(ellipse 95% 70% at 50% 20%, #713f12 0%, #3f2206 55%, #180b01 100%)',
		beam1Color: 'rgba(234, 179, 8, 0.20)',
		beam2Color: 'rgba(251, 113, 133, 0.14)',
		badgeBg: 'linear-gradient(180deg, #b45309 0%, #78350f 100%)',
		badgeBorder: '#fef3c7',
		badgeGlow: 'rgba(180, 83, 9, 0.6)',
		letterCoinBg: 'linear-gradient(180deg, #d97706 0%, #92400e 100%)',
		letterCoinBorder: '#fef08a',
		accent: '#f59e0b',
	},
	// 16. Arctic Frost (Glacial Ice Blue)
	{
		id: 'arctic-frost',
		name: 'Arctic Frost',
		bgGradient:
			'radial-gradient(ellipse 95% 70% at 50% 20%, #155e75 0%, #0e3d4f 55%, #03141b 100%)',
		beam1Color: 'rgba(103, 232, 249, 0.20)',
		beam2Color: 'rgba(192, 132, 252, 0.13)',
		badgeBg: 'linear-gradient(180deg, #0e7490 0%, #155e75 100%)',
		badgeBorder: '#cffafe',
		badgeGlow: 'rgba(14, 116, 144, 0.6)',
		letterCoinBg: 'linear-gradient(180deg, #0891b2 0%, #0e7490 100%)',
		letterCoinBorder: '#a5f3fc',
		accent: '#67e8f9',
	},
	// 17. Berry Wine (Deep Maroon & Velvet)
	{
		id: 'berry-wine',
		name: 'Berry Wine',
		bgGradient:
			'radial-gradient(ellipse 95% 70% at 50% 20%, #831843 0%, #500724 55%, #19010a 100%)',
		beam1Color: 'rgba(244, 114, 182, 0.18)',
		beam2Color: 'rgba(251, 191, 36, 0.15)',
		badgeBg: 'linear-gradient(180deg, #be185d 0%, #9d174d 100%)',
		badgeBorder: '#fce7f3',
		badgeGlow: 'rgba(190, 24, 93, 0.6)',
		letterCoinBg: 'linear-gradient(180deg, #db2777 0%, #9d174d 100%)',
		letterCoinBorder: '#fbcfe8',
		accent: '#f472b6',
	},
	// 18. Night Obsidian (Stealth Black & Pure Gold)
	{
		id: 'night-obsidian',
		name: 'Night Obsidian',
		bgGradient:
			'radial-gradient(ellipse 95% 70% at 50% 20%, #1c1917 0%, #0c0a09 55%, #000000 100%)',
		beam1Color: 'rgba(251, 191, 36, 0.22)',
		beam2Color: 'rgba(234, 179, 8, 0.16)',
		badgeBg: 'linear-gradient(180deg, #d97706 0%, #78350f 100%)',
		badgeBorder: '#fef08a',
		badgeGlow: 'rgba(217, 119, 6, 0.6)',
		letterCoinBg: 'linear-gradient(180deg, #d97706 0%, #78350f 100%)',
		letterCoinBorder: '#fde047',
		accent: '#facc15',
	},
	// 19. Lime Energy (Electric Neon Sports)
	{
		id: 'lime-energy',
		name: 'Lime Energy',
		bgGradient:
			'radial-gradient(ellipse 95% 70% at 50% 20%, #365314 0%, #1a2e05 55%, #091201 100%)',
		beam1Color: 'rgba(163, 230, 53, 0.20)',
		beam2Color: 'rgba(56, 189, 248, 0.14)',
		badgeBg: 'linear-gradient(180deg, #65a30d 0%, #4d7c0f 100%)',
		badgeBorder: '#ecfccb',
		badgeGlow: 'rgba(101, 163, 13, 0.6)',
		letterCoinBg: 'linear-gradient(180deg, #65a30d 0%, #3f6212 100%)',
		letterCoinBorder: '#bef264',
		accent: '#a3e635',
	},
	// 20. Ultramarine Sapphire (Deep Oceanic Luxury)
	{
		id: 'ultramarine-sapphire',
		name: 'Ultramarine Sapphire',
		bgGradient:
			'radial-gradient(ellipse 95% 70% at 50% 20%, #1e1b4b 0%, #172554 55%, #030712 100%)',
		beam1Color: 'rgba(96, 165, 250, 0.20)',
		beam2Color: 'rgba(232, 121, 249, 0.14)',
		badgeBg: 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)',
		badgeBorder: '#dbeafe',
		badgeGlow: 'rgba(37, 99, 235, 0.6)',
		letterCoinBg: 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)',
		letterCoinBorder: '#93c5fd',
		accent: '#60a5fa',
	},
];
