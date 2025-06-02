import baseData from './features/catch_base.json';
import giumeriData from './features/catch_giumeri.json';

export interface Acronym {
  letter: string;
  meaning_en: string;
}

export interface ComponentAcronym {
  baseTypeNameJp: string;
  acronymSourceNameEn: string;
  keywords: Acronym[];
}

export interface FeatureInfo {
  catch: string;
  description: string;
  acronyms?: Acronym[];
  componentAcronyms?: ComponentAcronym[];
}

export interface DetailedFeatureInfo {
  catch: string;
  baseDescription: string;
  mainTypeNameJp?: string; // ★追加
  variantTitle: string;
  variant_description_sub_title_explanation: string; // 元の variantDescription
  variant_description_main?: string; // 新しく追加する解説文
  subTitle: string;
  sub_type_description_sub_title_explanation: string; // 元の subDescription
  sub_type_description_main?: string; // 新しく追加する解説文
  acronyms?: Acronym[];
  componentAcronyms?: ComponentAcronym[];
}

function extractKey(name: string): string {
  return name.split('(')[0].trim().replace(/\s+/g, '');
}

function findBaseEntry(typeKey: string) {
  return baseData.hexacodex_types.find(
    (e) => extractKey(e.type_name_jp) === typeKey
  );
}

function findGiumeriEntry(typeKey: string) {
  return giumeriData.jumeri_types.find(
    (e) => extractKey(e.jumeri_type_name_jp) === typeKey
  );
}

export function getInitialFeature(starType: string): FeatureInfo | null {
  const [baseKey, variant] = starType.split('_');
  const entry = findBaseEntry(baseKey) || findGiumeriEntry(baseKey);
  if (!entry) return null;
  const variantInfo = entry[variant === 'α' ? 'alpha_variant' : 'beta_variant'];
  const baseAcronyms = (entry as any).new_keywords_acronym;
  const giumeriAcronyms = (entry as any).component_acronyms;
  return {
    catch: (entry as any).new_catchphrase_jp,
    description: variantInfo.new_description_jp,
    acronyms: baseAcronyms,
    componentAcronyms: giumeriAcronyms,
  };
}

export function getDetailedFeature(finalKey: string): DetailedFeatureInfo | null {
  const match = finalKey.match(/([^_]+)_([αβ])-(\d)/);
  if (!match) return null;
  const [, baseKey, variantChar, subIdxStr] = match;
  const subIdx = parseInt(subIdxStr, 10) - 1;

  const entry = findBaseEntry(baseKey) || findGiumeriEntry(baseKey);
  if (!entry) return null;

  // 型アサーションを強化
  const variantInfo = entry[variantChar === 'α' ? 'alpha_variant' : 'beta_variant'] as {
    original_title_jp: string;
    new_title_jp: string;
    variant_description?: string; // ★オプショナルで追加
    new_description_jp: string;
    sub_types?: Array<{
      original_title_jp: string;
      new_title_jp: string;
      sub_type_description?: string; // ★オプショナルで追加
      new_description_jp: string;
    }>;
  } | undefined;

  if (!variantInfo) return null;

  // 型アサーションを強化
  const sub = variantInfo.sub_types?.[subIdx] as {
    original_title_jp: string;
    new_title_jp: string;
    sub_type_description?: string; // ★オプショナルで追加
    new_description_jp: string;
  } | undefined;

  if (!sub) return null;

  const baseAcro = (entry as any).new_keywords_acronym;
  const compAcro = (entry as any).component_acronyms;

  return {
    catch: (entry as any).new_catchphrase_jp,
    baseDescription: (entry as any).new_description_jp,
    mainTypeNameJp: (entry as any).type_name_jp || (entry as any).jumeri_type_name_jp, // ★追加： entry.type_name_jp または entry.jumeri_type_name_jp を想定
    variantTitle: variantInfo.new_title_jp,
    variant_description_sub_title_explanation: variantInfo.new_description_jp,
    variant_description_main: variantInfo.variant_description,
    subTitle: sub.new_title_jp,
    sub_type_description_sub_title_explanation: sub.new_description_jp,
    sub_type_description_main: sub.sub_type_description,
    acronyms: baseAcro,
    componentAcronyms: compAcro,
  };
}

const defaultExport = {};
export default defaultExport;
