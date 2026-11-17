import { loadFont as loadAnek } from '@remotion/google-fonts/AnekTelugu';
import { loadFont as loadRamabhadra } from '@remotion/google-fonts/Ramabhadra';

const anek = loadAnek('normal', {
	weights: ['700', '800'],
});

const rama = loadRamabhadra();

export const anekFont = anek.fontFamily;
export const ramaFont = rama.fontFamily;

