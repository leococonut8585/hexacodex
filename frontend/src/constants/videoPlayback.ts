export const VIDEO_PLAYBACK_RATE: Record<string, number> = {
  'MARI_ALPHA_2': 1.5,
  'MARI_BETA_1': 1.3,
  'SENRI_ALPHA_2': 1.5,
};

export function getPlaybackRateForCategory(category: string): number {
  const key = category
    .replace(/\s+/g, '')
    .replace('α', 'ALPHA')
    .replace('β', 'BETA')
    .replace('-', '_')
    .replace('ー', '_')
    .replace('–', '_')
    .toUpperCase();
  return VIDEO_PLAYBACK_RATE[key] || 1;
}
