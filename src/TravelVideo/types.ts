export interface StationInfo {
	id: string;
	nameTe: string;
	nameEn: string;
	progress: number; // 0 to 1
	code: string;
	highlight?: string;
}

export const STATIONS: StationInfo[] = [
	{id: 'gnt', nameTe: 'గుంటూరు', nameEn: 'Guntur Jn', progress: 0.0, code: 'GNT', highlight: 'Start: 11:20 PM'},
	{id: 'mag', nameTe: 'మంగళగిరి', nameEn: 'Mangalagiri', progress: 0.06, code: 'MAG'},
	{id: 'bza', nameTe: 'విజయవాడ', nameEn: 'Vijayawada Jn', progress: 0.12, code: 'BZA', highlight: 'Heavy Rush'},
	{id: 'ee', nameTe: 'ఏలూరు', nameEn: 'Eluru', progress: 0.22, code: 'EE'},
	{id: 'tdd', nameTe: 'తాడేపల్లిగూడెం', nameEn: 'Tadepalligudem', progress: 0.30, code: 'TDD'},
	{id: 'rjy', nameTe: 'రాజమండ్రి', nameEn: 'Rajahmundry', progress: 0.40, code: 'RJY', highlight: '🌅 గోదావరి నది'},
	{id: 'slo', nameTe: 'సామర్లకోట', nameEn: 'Samalkot Jn', progress: 0.48, code: 'SLO', highlight: 'Split Point'},
	{id: 'anv', nameTe: 'అన్నవరం', nameEn: 'Annavaram', progress: 0.54, code: 'ANV'},
	{id: 'tuni', nameTe: 'తుని', nameEn: 'Tuni', progress: 0.60, code: 'TUNI'},
	{id: 'vskp', nameTe: 'విశాఖపట్నం', nameEn: 'Visakhapatnam', progress: 0.70, code: 'VSKP', highlight: '🔄 లోకో రివర్సల్ (WAP-7)'},
	{id: 'vzm', nameTe: 'విజయనగరం', nameEn: 'Vizianagaram Jn', progress: 0.78, code: 'VZM'},
	{id: 'vbl', nameTe: 'బొబ్బిలి', nameEn: 'Bobbili Jn', progress: 0.86, code: 'VBL', highlight: '⛰️ తూర్పు కనుమలు'},
	{id: 'pvp', nameTe: 'పార్వతీపురం', nameEn: 'Parvathipuram', progress: 0.92, code: 'PVP'},
	{id: 'bmp', nameTe: 'భీముడు పేట', nameEn: 'Bhimpur (Odisha)', progress: 0.96, code: 'BMP', highlight: '🇮🇳 ఒడిశా సరిహద్దు'},
	{id: 'rgda', nameTe: 'రాయగడ', nameEn: 'Rayagada', progress: 1.0, code: 'RGDA', highlight: '🏁 1:40 PM గమ్యం'},
];

export const SCENE_TIMELINES = {
	scene1: {from: 0, duration: 1200},      // 0:00 - 0:40 (40s = 1200 frames)
	scene2: {from: 1200, duration: 1200},   // 0:40 - 1:20 (40s = 1200 frames)
	scene3: {from: 2400, duration: 1800},   // 1:20 - 2:20 (60s = 1800 frames)
	scene4: {from: 4200, duration: 1800},   // 2:20 - 3:20 (60s = 1800 frames)
	scene5: {from: 6000, duration: 1200},   // 3:20 - 4:00 (40s = 1200 frames)
	scene6: {from: 7200, duration: 1004},   // 4:00 - 4:33.44 (33.44s = 1004 frames)
};

export const TOTAL_FRAMES = 8204;

