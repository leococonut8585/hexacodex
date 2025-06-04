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
  // Existing fields (can be deprecated or re-mapped if needed)
  catch: string; // Potentially old main catchphrase or title
  baseDescription: string; // Potentially old main description
  mainTypeNameJp?: string; // Original name from JSON for reference
  variantTitle: string; // Potentially old variant title
  variant_description_sub_title_explanation: string; // Potentially old variant description part 1
  variant_description_main?: string; // Potentially old variant description part 2
  subTitle: string; // Potentially old sub-type title
  sub_type_description_sub_title_explanation: string; // Potentially old sub-type description part 1
  sub_type_description_main?: string; // Potentially old sub-type description part 2
  acronyms?: Acronym[]; // Old acronyms field
  componentAcronyms?: ComponentAcronym[]; // Old component acronyms field

  // New comprehensive fields
  mainTypeTitle: string;
  mainTypeCatchphrase: string;
  mainTypeAcronyms: Acronym[] | ComponentAcronym[] | undefined;
  mainTypeDescription: string;
  alphaBetaTypeFullTitle: string;
  alphaBetaTypeCatchphrase: string;
  alphaBetaTypeDescription: string;
  oneTwoTypeFullTitle: string;
  oneTwoTypeCatchphrase: string;
  oneTwoTypeDescription: string;
}

function extractKey(name: string): string {
  return name.split('(')[0].trim().replace(/\s+/g, '');
}

// Helper function to extract catchphrase from titles like "TITLE 「CATCHPHRASE」"
function extractCatchphrase(fullTitle: string): string {
  const match = fullTitle.match(/「([^」]+)」/);
  if (match && match[1]) {
    return match[1];
  }
  return fullTitle; // Return the full title if no 「」 pattern is found
}

const baseEntries = baseData.hexacodex_types.map(entry => ({ ...entry, __source: 'base' as const }));
const giumeriEntries = giumeriData.jumeri_types.map(entry => ({ ...entry, __source: 'giumeri' as const }));
const allEntries = [...baseEntries, ...giumeriEntries];

function findEntry(typeKey: string): (typeof baseEntries[number] | typeof giumeriEntries[number]) | undefined {
  return allEntries.find(
    (e) => extractKey((e as any).type_name_jp || (e as any).jumeri_type_name_jp) === typeKey
  );
}


export function getInitialFeature(starType: string): FeatureInfo | null {
  const [baseKey, variant] = starType.split('_');
  // Preserve existing find logic for getInitialFeature if it's different or simpler
  const entry = baseData.hexacodex_types.find(e => extractKey(e.type_name_jp) === baseKey) ||
                giumeriData.jumeri_types.find(e => extractKey(e.jumeri_type_name_jp) === baseKey);

  if (!entry) return null;
  const variantInfo = (entry as any)[variant === 'α' ? 'alpha_variant' : 'beta_variant'];
  if (!variantInfo) return null; // Ensure variantInfo exists

  const baseAcronyms = (entry as any).new_keywords_acronym;
  const giumeriAcronyms = (entry as any).component_acronyms;

  // Determine description based on source, similar to getDetailedFeature
  let description = '';
  if ('hexacodex_types' in baseData && (baseData.hexacodex_types as any[]).includes(entry)) {
    description = variantInfo.variant_description || variantInfo.new_description_jp; // Fallback if variant_description is empty
  } else if ('jumeri_types' in giumeriData && (giumeriData.jumeri_types as any[]).includes(entry)) {
    description = variantInfo.new_description_jp;
  }

  return {
    catch: (entry as any).new_catchphrase_jp || (entry as any).original_title_jp,
    description: description,
    acronyms: baseAcronyms,
    componentAcronyms: giumeriAcronyms,
  };
}

export function getDetailedFeature(finalKey: string): DetailedFeatureInfo | null {
  const match = finalKey.match(/([^_]+)_([αβ])-(\d)/);
  if (!match) return null;
  const [, baseKey, variantChar, subIdxStr] = match;
  const subIdx = parseInt(subIdxStr, 10) - 1;

  const entry = findEntry(baseKey);
  if (!entry) return null;

  const variantInfo = entry[variantChar === 'α' ? 'alpha_variant' : 'beta_variant'];
  if (!variantInfo) return null;

  const sub = variantInfo.sub_types?.[subIdx];
  if (!sub) return null;

  const mainTypeAcronyms = (entry as any).new_keywords_acronym || (entry as any).component_acronyms;
  const mainTypeNameJp = (entry as any).type_name_jp || (entry as any).jumeri_type_name_jp;
  const mainTypeTitle = (entry as any).new_catchphrase_jp || mainTypeNameJp; // Fallback to original name if new_catchphrase_jp is missing

  // Determine descriptions based on the source of the entry
  let alphaBetaTypeDescription = '';
  let oneTwoTypeDescription = '';

  if (entry.__source === 'base') {
    // Access variant_description only if entry is from base and variantInfo exists
    if (variantInfo && 'variant_description' in variantInfo && typeof variantInfo.variant_description === 'string') {
      alphaBetaTypeDescription = variantInfo.variant_description;
    } else if (variantInfo && 'new_description_jp' in variantInfo && typeof variantInfo.new_description_jp === 'string') {
      // Fallback for base if variant_description is missing but new_description_jp (unexpected case, but safe)
      alphaBetaTypeDescription = variantInfo.new_description_jp;
    } else {
      alphaBetaTypeDescription = ''; // Ensure it's always a string
    }

    // Access sub_type_description only if entry is from base and sub exists
    if (sub && 'sub_type_description' in sub && typeof sub.sub_type_description === 'string') {
      oneTwoTypeDescription = sub.sub_type_description;
    } else if (sub && 'new_description_jp' in sub && typeof sub.new_description_jp === 'string') {
      // Fallback for base if sub_type_description is missing
      oneTwoTypeDescription = sub.new_description_jp;
    } else {
      oneTwoTypeDescription = ''; // Ensure it's always a string
    }
  } else if (entry.__source === 'giumeri') {
    // Access new_description_jp if entry is from giumeri and variantInfo exists
    if (variantInfo && 'new_description_jp' in variantInfo && typeof variantInfo.new_description_jp === 'string') {
      alphaBetaTypeDescription = variantInfo.new_description_jp;
    } else {
      alphaBetaTypeDescription = ''; // Ensure it's always a string
    }

    // Access new_description_jp if entry is from giumeri and sub exists
    if (sub && 'new_description_jp' in sub && typeof sub.new_description_jp === 'string') {
      oneTwoTypeDescription = sub.new_description_jp;
    } else {
      oneTwoTypeDescription = ''; // Ensure it's always a string
    }
  }

  return {
    // Deprecated / Old fields (populated for compatibility if needed, or remove)
    catch: mainTypeTitle,
    baseDescription: (entry as any).new_description_jp,
    mainTypeNameJp: mainTypeNameJp,
    variantTitle: variantInfo.new_title_jp,
    variant_description_sub_title_explanation: alphaBetaTypeDescription, // Or map to a specific part if applicable
    variant_description_main: alphaBetaTypeDescription, // Or map to a specific part
    subTitle: sub.new_title_jp,
    sub_type_description_sub_title_explanation: oneTwoTypeDescription, // Or map to a specific part
    sub_type_description_main: oneTwoTypeDescription, // Or map to a specific part
    acronyms: (entry as any).new_keywords_acronym,
    componentAcronyms: (entry as any).component_acronyms,

    // New comprehensive fields
    mainTypeTitle: mainTypeTitle,
    mainTypeCatchphrase: mainTypeTitle, // As per instruction: "mainTypeTitle を優先的に設定"
    mainTypeAcronyms: mainTypeAcronyms,
    mainTypeDescription: (entry as any).new_description_jp,
    alphaBetaTypeFullTitle: variantInfo.new_title_jp,
    alphaBetaTypeCatchphrase: extractCatchphrase(variantInfo.new_title_jp),
    alphaBetaTypeDescription: alphaBetaTypeDescription,
    oneTwoTypeFullTitle: sub.new_title_jp,
    oneTwoTypeCatchphrase: extractCatchphrase(sub.new_title_jp),
    oneTwoTypeDescription: oneTwoTypeDescription,
  };
}

const defaultExport = {};
export default defaultExport;
