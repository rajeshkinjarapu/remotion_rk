import { loadFont as loadAnek } from '@remotion/google-fonts/AnekTelugu';
import { loadFont as loadRamabhadra } from '@remotion/google-fonts/Ramabhadra';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';

const anek = loadAnek('normal', {
	weights: ['600', '700', '800'],
});

const rama = loadRamabhadra();

const montserrat = loadMontserrat('normal', {
	weights: ['700', '800', '900'],
});

export const anekFont = anek.fontFamily;
export const ramaFont = rama.fontFamily;
export const montserratFont = montserrat.fontFamily;

