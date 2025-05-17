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
  variantTitle: string;
  variantDescription: string;
  subTitle: string;
  subDescription: string;
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
  const [, baseKey, variant, subIdxStr] = match;
  const subIdx = parseInt(subIdxStr, 10) - 1;
  const entry = findBaseEntry(baseKey) || findGiumeriEntry(baseKey);
  if (!entry) return null;
  const variantInfo = entry[variant === 'α' ? 'alpha_variant' : 'beta_variant'];
  const sub = variantInfo.sub_types[subIdx];
  if (!sub) return null;
  const baseAcronyms = (entry as any).new_keywords_acronym;
  const compAcronyms = (entry as any).component_acronyms;
  return {
    catch: (entry as any).new_catchphrase_jp,
    baseDescription: (entry as any).new_description_jp,
    variantTitle: variantInfo.new_title_jp,
    variantDescription: variantInfo.new_description_jp,
    subTitle: sub.new_title_jp,
    subDescription: sub.new_description_jp,
    acronyms: baseAcronyms,
    componentAcronyms: compAcronyms,
  };
}

export default {};
