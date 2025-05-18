export const VIDEO_MAP: Record<string, string> = {
  'MARI_α-1': 'Mari_alpha_1.mp4',
  'MARI_α-2': 'Mari_alpha_2.mp4',
  'MARI_β-1': 'Mari_beta_1.mp4',
  'MARI_β-2': 'Mari_beta_2.mp4',
  'AKARI_α-1': 'Akari_alpha_1.mp4',
  'AKARI_α-2': 'Akari_alpha_2.mp4',
};

export function getVideoFileForCategory(category: string): string | undefined {
  const key = category.replace(/\s+/g, '').toUpperCase();
  return VIDEO_MAP[key];
}
