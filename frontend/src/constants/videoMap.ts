export const VIDEO_MAP: Record<string, string> = {
  'AKARI_ALPHA_1': 'Akari_alpha_1.mp4',
  'AKARI_ALPHA_2': 'Akari_alpha_2.mp4',
  'AKARI_BETA_1': 'Akari_beta_1.mp4',
  'AKARI_BETA_2': 'Akari_beta_2.mp4',
  'AKARI_SENRI_ALPHA_1': 'Akari_Senri_alpha_1.mp4',
  'AKARI_SENRI_ALPHA_2': 'Akari_Senri_alpha_2.mp4',
  'AKARI_SENRI_BETA_1': 'Akari_Senri_beta_1.mp4',
  'AKARI_SENRI_BETA_2': 'Akari_Senri_beta_2.mp4',
  'KAIRI_ALPHA_1': 'Kairi_alpha_1.mp4',
  'KAIRI_ALPHA_2': 'Kairi_alpha_2.mp4',
  'KAIRI_BETA_1': 'Kairi_beta_1.mp4',
  'KAIRI_BETA_2': 'Kairi_beta_2.mp4',
  'KAIRI_NOAH_ALPHA_1': 'Kairi_Noah_alpha_1.mp4',
  'KAIRI_NOAH_ALPHA_2': 'Kairi_Noah_alpha_2.mp4',
  'KAIRI_NOAH_BETA_1': 'Kairi_Noah_beta_1.mp4',
  'KAIRI_NOAH_BETA_2': 'Kairi_Noah_beta_2.mp4',
  'KINAIRYU_ALPHA_1': 'Kinryu_alpha_1.mp4',
  'KINRYU_ALPHA_2': 'Kinryu_alpha_2.mp4',
  'KINRYU_BETA_1': 'Kinryu_beta_1.mp4',
  'KINRYU_BETA_2': 'Kinryu_beta_2.mp4',
  'KINRYU_MARI_ALPHA_1': 'Kinryu_Mari_alpha_1.mp4',
  'KINRYU_MARI_ALPHA_2': 'Kinryu_Mari_alpha_2.mp4',
  'KINRYU_MARI_BETA_1': 'Kinryu_Mari_beta_1.mp4',
  'KINRYU_MARI_BETA_2': 'Kinryu_Mari_beta_2.mp4',
  'MARI_ALPHA_1': 'Mari_alpha_1.mp4',
  'MARI_ALPHA_2': 'Mari_alpha_2.mp4',
  'MARI_BETA_1': 'Mari_beta_1.mp4',
  'MARI_BETA_2': 'Mari_beta_2.mp4',
  'MARI_KINRYU_ALPHA_1': 'Mari_Kinryu_alpha_1.mp4',
  'MARI_KINRYU_ALPHA_2': 'Mari_Kinryu_alpha_2.mp4',
  'MARI_KINRYU_BETA_1': 'Mari_Kinryu_beta_1.mp4',
  'MARI_KINRYU_BETA_2': 'Mari_Kinryu_beta_2.mp4',
  'NOAH_ALPHA_1': 'Noah_alpha_1.mp4',
  'NOAH_ALPHA_2': 'Noah_alpha_2.mp4',
  'NOAH_BETA_1': 'Noah_beta_1.mp4',
  'NOAH_BETA_2': 'Noah_beta_2.mp4',
  'NOAH_KAIRI_ALPHA_1': 'Noah_Kairi_alpha_1.mp4',
  'NOAH_KAIRI_ALPHA_2': 'Noah_Kairi_alpha_2.mp4',
  'NOAH_KAIRI_BETA_1': 'Noah_Kairi_beta_1.mp4',
  'NOAH_KAIRI_BETA_2': 'Noah_Kairi_beta_2.mp4',
  'SENRI_AKARI_ALPHA_1': 'Senri_Akari_alpha_1.mp4',
  'SENRI_AKARI_ALPHA_2': 'Senri_Akari_alpha_2.mp4',
  'SENRI_AKARI_BETA_1': 'Senri_Akari_beta_1.mp4',
  'SENRI_AKARI_BETA_2': 'Senri_Akari_beta_2.mp4',
  'SENRI_ALPHA_1': 'Senri_alpha_1.mp4',
  'SENRI_ALPHA_2': 'Senri_alpha_2.mp4',
  'SENRI_BETA_1': 'Senri_beta_1.mp4',
  'SENRI_BETA_2': 'Senri_beta_2.mp4',
};

export function getVideoFileForCategory(category: string): string | undefined {
  // 診断キーを必ず全て「半角英数大文字アンダースコア（例：MARI_ALPHA_2）」に変換して渡すこと
  const key = category
    .replace(/\s+/g, '')         // 空白削除
    .replace('α', 'ALPHA')
    .replace('β', 'BETA')
    .replace('-', '_')
    .replace('ー', '_')
    .replace('–', '_')
    .toUpperCase();              // 完全大文字化
  return VIDEO_MAP[key];
}
