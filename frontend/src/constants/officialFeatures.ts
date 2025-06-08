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

interface AKARIFeature {
  catch: string;
  description: string;
}

interface AKARISubType {
  main: AKARIFeature; // alpha または beta の主要なキャッチコピーと説明
  type1: AKARIFeature; // 1型 のキャッチコピーと説明
  type2: AKARIFeature; // 2型 のキャッチコピーと説明
}

interface AKARIData {
  alpha: AKARISubType;
  beta: AKARISubType;
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

const AKARI_FEATURES: AKARIData = {
  alpha: {
    main: {
      catch: "情熱と感性で世界を彩る革命児",
      description: "ＡＫＡＲＩ〠ａｌｐｈａタイプは、ＡＫＡＲＩの基本的特質に外向性と行動力が加わった、極めてダイナミックで影響力のある人格である。彼らは「感情的カリスマ」とでも呼ぶべき存在で、その豊かな感受性と表現力で多くの人々を魅了し、同時に自分の価値観や美的感覚を社会に浸透させようとする。"
    },
    type1: {
      catch: "閃光アーティスト型",
      description: "「感情的花火師」とでも形容すべき存在である。彼らは瞬間的なインスピレーションを華麗な表現に変換し、周囲の人々を魅了する。心理学的には「躁状態の創造性」と「注意欠陥の衝動性」を併せ持った人格である。"
    },
    type2: {
      catch: "革命デザイナー型",
      description: "ＡＫＡＲＩ ａｌｐｈａ ２型は、「美的テロリスト」とでも呼ぶべき特殊な能力を持っている。彼らは美しさや感性を武器として、既存の社会構造や価値観に挑戦し、新しい美的秩序を確立しようとする。"
    }
  },
  beta: {
    main: {
      catch: "孤高の直感で美を紡ぐ隠者",
      description: "ＡＫＡＲＩ ｂｅｔａタイプは、ＡＫＡＲＩの基本的特質を内向的で静謐な形で表現する人格である。彼らは「感受性の隠者」とでも呼ぶべき存在で、表立った表現活動よりも、内的世界の深化と純粋な美の追求を通じて自分なりの価値を創造していく。"
    },
    type1: {
      catch: "隠者アーティスト型",
      description: "ＡＫＡＲＩ ｂｅｔａ １型は、「完璧主義の囚人」とでも形容すべき存在である。彼らは自分だけの内なる世界で絶対的な美や完璧性を追求し続けるが、その追求は往々にして終わりのない自己折磨の過程となる。"
    },
    type2: {
      catch: "夢見の詩人型",
      description: "ＡＫＡＲＩ ｂｅｔａ ２型は、「現実逃避の芸術家」とでも呼ぶべき特異な存在である。彼らは現実世界の厳しさや複雑さから身を守るために、幻想的で美しい内的世界を構築し、その中で生きることを選択する。"
    }
  }
};

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
  const subTypeNum = parseInt(subIdxStr, 10); // 1 or 2

  if (baseKey.toUpperCase() === 'AKARI') {
    const variant = variantChar === 'α' ? AKARI_FEATURES.alpha : AKARI_FEATURES.beta;
    if (!variant) return null;

    let typeSpecificFeature: AKARIFeature;
    if (subTypeNum === 1) {
      typeSpecificFeature = variant.type1;
    } else if (subTypeNum === 2) {
      typeSpecificFeature = variant.type2;
    } else {
      return null; // Invalid subTypeNum
    }

    // AKARIのメインのキャッチコピーと説明は variant.main を使う
    // DetailedFeatureInfo の各フィールドにマッピングする
    // このマッピングは既存の Personality.tsx でどのようにデータが使われているかに依存する
    // 既存の戻り値の構造を参考に、必要な情報を埋める
    // alphaBetaType が main に相当し、oneTwoType が type1/type2 に相当すると仮定する

    // 仮の mainTypeNameJp と mainTypeTitle (これらは AKARI 専用に設定する必要があるかもしれない)
    const mainTypeNameJp = "AKARI (アカリ)"; // これは例。必要なら調整
    const mainTypeTitle = `【${mainTypeNameJp} 感性と閃きの表現者】`; // 例

    return {
      // 既存の DetailedFeatureInfo のフィールドを埋める
      // mainTypeTitle, mainTypeCatchphrase, mainTypeDescription はAKARIの総合的な情報（現状はAKARI_FEATURESにはないが、必要なら追加）
      // 今回の修正で重要なのは alphaBetaType と oneTwoType のキャッチコピーと説明
      mainTypeTitle: mainTypeTitle, // AKARI全体のタイトル (例)
      mainTypeCatchphrase: mainTypeTitle, // AKARI全体のキャッチ (例)
      mainTypeDescription: "ＡＫＡＲＩコードは、「芸術性」と「直感性」の領域を司る。このコードを持つ人々は、世界を感性で捉え、美しいものや意味あるものを創造する天賦の才を持っている。ただし、その繊細さゆえに、現実世界の粗雑さに傷つきやすく、完璧主義と現実逃避の間で揺れ動く傾向がある。", // AKARI全体の基本説明 (例)
      mainTypeAcronyms: undefined, // AKARI用のアクロニムがあれば設定

      alphaBetaTypeFullTitle: `${mainTypeNameJp} ${variantChar === 'α' ? 'alpha' : 'beta'} 「${variant.main.catch}」`, // 例: AKARI alpha 「情熱と感性で世界を彩る革命児」
      alphaBetaTypeCatchphrase: variant.main.catch,
      alphaBetaTypeDescription: variant.main.description,

      oneTwoTypeFullTitle: `${mainTypeNameJp} ${variantChar === 'α' ? 'alpha' : 'beta'}-${subTypeNum} 「${typeSpecificFeature.catch}」`, // 例: AKARI alpha-1 「閃光アーティスト型」
      oneTwoTypeCatchphrase: typeSpecificFeature.catch,
      oneTwoTypeDescription: typeSpecificFeature.description,

      // 以下は旧フィールドまたは互換性のためのフィールド（必要に応じて設定）
      catch: mainTypeTitle,
      baseDescription: "AKARI base description", // 必要なら適切な値に
      mainTypeNameJp: mainTypeNameJp,
      variantTitle: variant.main.catch, // alpha/beta のキャッチ
      variant_description_sub_title_explanation: variant.main.description,
      subTitle: typeSpecificFeature.catch, // 1型/2型 のキャッチ
      sub_type_description_sub_title_explanation: typeSpecificFeature.description,
      acronyms: undefined, // 必要なら設定
      componentAcronyms: undefined, // 必要なら設定
    };
  }

  // === 以下は AKARI 以外の場合の既存のロジック (変更なし) ===
  const subIdx = parseInt(subIdxStr, 10) - 1; // Existing logic uses 0-based index
  const entry = findEntry(baseKey);
  if (!entry) return null;

  const variantInfo = entry[variantChar === 'α' ? 'alpha_variant' : 'beta_variant'];
  if (!variantInfo) return null;

  const sub = variantInfo.sub_types?.[subIdx];
  if (!sub) return null;

  const mainTypeAcronyms = (entry as any).new_keywords_acronym || (entry as any).component_acronyms;
  const currentMainTypeNameJp = (entry as any).type_name_jp || (entry as any).jumeri_type_name_jp;
  const currentMainTypeTitle = (entry as any).new_catchphrase_jp || currentMainTypeNameJp;

  let alphaBetaTypeDescription = '';
  let oneTwoTypeDescription = '';

  if (entry.__source === 'base') {
    if (variantInfo && 'variant_description' in variantInfo && typeof variantInfo.variant_description === 'string') {
      alphaBetaTypeDescription = variantInfo.variant_description;
    } else if (variantInfo && 'new_description_jp' in variantInfo && typeof variantInfo.new_description_jp === 'string') {
      alphaBetaTypeDescription = variantInfo.new_description_jp;
    } else {
      alphaBetaTypeDescription = '';
    }

    if (sub && 'sub_type_description' in sub && typeof sub.sub_type_description === 'string') {
      oneTwoTypeDescription = sub.sub_type_description;
    } else if (sub && 'new_description_jp' in sub && typeof sub.new_description_jp === 'string') {
      oneTwoTypeDescription = sub.new_description_jp;
    } else {
      oneTwoTypeDescription = '';
    }
  } else if (entry.__source === 'giumeri') {
    if (variantInfo && 'new_description_jp' in variantInfo && typeof variantInfo.new_description_jp === 'string') {
      alphaBetaTypeDescription = variantInfo.new_description_jp;
    } else {
      alphaBetaTypeDescription = '';
    }

    if (sub && 'new_description_jp' in sub && typeof sub.new_description_jp === 'string') {
      oneTwoTypeDescription = sub.new_description_jp;
    } else {
      oneTwoTypeDescription = '';
    }
  }

  return {
    catch: currentMainTypeTitle,
    baseDescription: (entry as any).new_description_jp,
    mainTypeNameJp: currentMainTypeNameJp,
    variantTitle: variantInfo.new_title_jp,
    variant_description_sub_title_explanation: alphaBetaTypeDescription,
    variant_description_main: alphaBetaTypeDescription,
    subTitle: sub.new_title_jp,
    sub_type_description_sub_title_explanation: oneTwoTypeDescription,
    sub_type_description_main: oneTwoTypeDescription,
    acronyms: (entry as any).new_keywords_acronym,
    componentAcronyms: (entry as any).component_acronyms,

    mainTypeTitle: currentMainTypeTitle,
    mainTypeCatchphrase: currentMainTypeTitle,
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
