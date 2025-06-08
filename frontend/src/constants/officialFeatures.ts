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

interface SENRIFeature {
  catch: string;
  description: string;
}

interface SENRISubType {
  main: SENRIFeature; // alpha または beta の主要なキャッチコピーと説明
  type1: SENRIFeature; // 1型 のキャッチコピーと説明
  type2: SENRIFeature; // 2型 のキャッチコピーと説明
}

interface SENRIData {
  alpha: SENRISubType;
  beta: SENRISubType;
}

interface NOAHFeature {
  catch: string;
  description: string;
}

interface NOAHSubType {
  main: NOAHFeature; // alpha または beta の主要なキャッチコピーと説明
  type1: NOAHFeature; // 1型 のキャッチコピーと説明
  type2: NOAHFeature; // 2型 のキャッチコピーと説明
}

interface NOAHData {
  alpha: NOAHSubType;
  beta: NOAHSubType;
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

const NOAH_FEATURES: NOAHData = {
  alpha: {
    main: {
      catch: "明るく育み、未来を拓く希望の使者",
      description: "ＮＯＡＨ　ａｌｐｈａタイプは、ＮＯＡＨの基本的特質に外向性と行動力が加わった、極めてダイナミックな人格である。彼らは「愛情のカリスマ」とでも呼ぶべき存在で、その明るいエネルギーと献身的な姿勢で多くの人々を魅了し、同時に影響下に置く。"
    },
    type1: {
      catch: "希望の架け橋型",
      description: "ＮＯＡＨ　ａｌｐｈａ　１型は、「希望の架け橋」とも呼ぶべき存在である。彼らは単に明るく振る舞うだけでなく、具体的な希望のビジョンを描き、それを現実化するための道筋を示すことができる。強い「未来志向性」と「建設的楽観主義」を併せ持った人格である。"
    },
    type2: {
      catch: "成長促進型",
      description: "ＮＯＡＨ　ａｌｐｈａ　２型は、「才能の錬金術師」とでも呼ぶべき特殊な能力を持っている。彼らは他者の隠れた才能や可能性を発見し、それを開花させることに並外れた情熱を注ぐ。心理学的には「メンタリング能力」と「育成本能」が高度に発達した人格である。"
    }
  },
  beta: {
    main: {
      catch: "静かに寄り添い、温もりを灯す癒し手",
      description: "ＮＯＡＨ　ｂｅｔａタイプは、ＮＯＡＨの基本的特質を内向的で静謐な形で表現する人格である。彼らは「静かなる治療者」とでも呼ぶべき存在で、表立った行動よりも深い共感と理解を通じて他者に影響を与える。"
    },
    type1: {
      catch: "静かな癒し型",
      description: "ＮＯＡＨ　ｂｅｔａ　１型は、「沈黙の治療者」とでも形容すべき存在である。彼らは言葉よりも存在感で、行動よりも共感で、周囲の人々に深い癒しをもたらす。心理学的には「非言語的コミュニケーション」の達人であり、相手の微細な感情の変化を敏感に察知し、適切に対応する能力を持っている。"
    },
    type2: {
      catch: "慎重な守護型",
      description: "ＮＯＡＨ　ｂｅｔａ　２型は、「賢明なる保護者」として機能する人格である。彼らは急激な変化を避け、安定性と継続性を重視しながら、周囲の人々を守り育てていく。「安全基地」としての機能を果たしており、他者が外的世界で挑戦する際の心の支えとなっている。"
    }
  }
};

const SENRI_FEATURES: SENRIData = {
  alpha: {
    main: {
      catch: "自ら切り拓く孤高の冒険者",
      description: "ＳＥＮＲＩ　ａｌｐｈａタイプは、ＳＥＮＲＩの基本的特質に外向性と行動力が加わった、極めてダイナミックで影響力のある人格である。彼らは「カリスマティック・サイコパス」とでも呼ぶべき存在で、その圧倒的な存在感と実行力で多くの人々を魅了し、同時に自分の野心的目標の実現に巻き込んでいく。"
    },
    type1: {
      catch: "孤高の開拓者型",
      description: "ＳＥＮＲＩ　ａｌｐｈａ　１型は、「破壊的イノベーター」とでも形容すべき存在である。彼らは未知の領域に単身で乗り込み、既存の常識やルールを無視して新しい道を切り拓いていく。心理学的には「境界線人格障害」の衝動性と「反社会性人格障害」の規則軽視が、建設的な方向に昇華された人格である。"
    },
    type2: {
      catch: "策士イノベーター型",
      description: "ＳＥＮＲＩ　ａｌｐｈａ　２型は、「マキャベリアン・ジーニアス」とでも呼ぶべき特殊な能力を持っている。彼らは表面的には革新的で建設的な活動を行いながら、実際には極めて巧妙で長期的な戦略を展開し、最終的に絶大な影響力を獲得しようとする。"
    }
  },
  beta: {
    main: {
      catch: "策略を練り、勝機を掴む静かな革命者",
      description: "ＳＥＮＲＩ　ｂｅｔａタイプは、ＳＥＮＲＩの基本的特質を内向的で静謐な形で表現する人格である。彼らは「沈黙の策略家」とでも呼ぶべき存在で、表立った行動よりも、緻密な計画と巧妙な操作を通じて自分の目標を達成していく。"
    },
    type1: {
      catch: "沈黙の参謀型",
      description: "ＳＥＮＲＩ　ｂｅｔａ　１型は、「影の軍師」とでも形容すべき存在である。彼らは表舞台に立つことを避けながら、裏方として組織や集団の戦略を立案し、実行を指揮する。「回避性パーソナリティ」の社会的機能が特殊な形で発達した人格である。"
    },
    type2: {
      catch: "孤高の改革者型",
      description: "ＳＥＮＲＩ　ｂｅｔａ　２型は、「孤独な革命家」とでも呼ぶべき特異な存在である。彼らは既存のシステムや価値観に対する根深い不満を抱きながらも、直接的な対立ではなく、独自の方法論で静かな変革を推し進めていく。「シゾイド的創造性」と「反体制的思考」を併せ持った人格である。"
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
  let [, baseKey, variantChar, subIdxStr] = match; // baseKeyをletで宣言していることを確認
  const subTypeNum = parseInt(subIdxStr, 10); // 1 or 2

  // baseKeyの正規化処理を追加
  if (baseKey === "ＮＯＡＨ") { // 全角のＮＯＡＨかどうかをチェック
    baseKey = "NOAH"; // 半角のNOAHに置き換える
  }

  // 以降の if-else if ブロックは、この正規化された baseKey を使って判定する
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
  } else if (baseKey.toUpperCase() === 'SENRI') { // SENRIタイプの処理を追加
    const variant = variantChar === 'α' ? SENRI_FEATURES.alpha : SENRI_FEATURES.beta;
    if (!variant) return null;

    let typeSpecificFeature: SENRIFeature;
    if (subTypeNum === 1) {
      typeSpecificFeature = variant.type1;
    } else if (subTypeNum === 2) {
      typeSpecificFeature = variant.type2;
    } else {
      return null; // Invalid subTypeNum
    }
    const mainTypeNameJp = "SENRI (センリ)"; // SENRI用の日本語名
    const mainTypeTitle = `【${mainTypeNameJp} 戦略と革新の開拓者】`; // SENRI用の基本タイトル（catch_base.jsonから参照または固定）

    return {
      mainTypeTitle: mainTypeTitle,
      mainTypeCatchphrase: mainTypeTitle, // SENRI全体のキャッチ (SENRI_FEATURES.alpha.main.catch や beta.main.catch を使うべきかもしれない)
      mainTypeDescription: "ＳＥＮＲＩコードは、「戦略性」と「革新性」を体現する。このコードの人々は、既存の枠組みを突破し、新しい可能性を切り拓く力を持っている。\n彼らは冷静で合理的だが、その裏には強い野心と孤独感が隠されている。まるで氷山のように、表面的な冷たさの下に巨大なエネルギーを秘めている。", // SENRI全体の基本説明 (catch_base.jsonから参照または固定)
      mainTypeAcronyms: undefined, // SENRI用のアクロニムがあれば設定
      alphaBetaTypeFullTitle: `${mainTypeNameJp} ${variantChar === 'α' ? 'alpha' : 'beta'} 「${variant.main.catch}」`,
      alphaBetaTypeCatchphrase: variant.main.catch,
      alphaBetaTypeDescription: variant.main.description,
      oneTwoTypeFullTitle: `${mainTypeNameJp} ${variantChar === 'α' ? 'alpha' : 'beta'}-${subTypeNum} 「${typeSpecificFeature.catch}」`,
      oneTwoTypeCatchphrase: typeSpecificFeature.catch,
      oneTwoTypeDescription: typeSpecificFeature.description,
      // 以下は旧フィールドまたは互換性のためのフィールド（AKARIと同様に設定）
      catch: mainTypeTitle,
      baseDescription: "SENRI base description", // 必要なら適切な値に
      mainTypeNameJp: mainTypeNameJp,
      variantTitle: variant.main.catch,
      variant_description_sub_title_explanation: variant.main.description,
      subTitle: typeSpecificFeature.catch,
      sub_type_description_sub_title_explanation: typeSpecificFeature.description,
      acronyms: undefined,
      componentAcronyms: undefined,
    };
  } else if (baseKey.toUpperCase() === 'NOAH') { // NOAHタイプの処理を追加
    const variant = variantChar === 'α' ? NOAH_FEATURES.alpha : NOAH_FEATURES.beta;
    if (!variant) return null;

    let typeSpecificFeature: NOAHFeature;
    if (subTypeNum === 1) {
      typeSpecificFeature = variant.type1;
    } else if (subTypeNum === 2) {
      typeSpecificFeature = variant.type2;
    } else {
      return null; // Invalid subTypeNum
    }
    // NOAHの基本情報を設定 (catch_base.json の NOAH エントリを参照するか、固定値を使用)
    // ユーザー指示書にある「慈愛と調和の体現者」を基本キャッチとして使用
    const mainTypeNameJp = "NOAH (ノア)"; // 全角ＮＯＡＨは表示時にゆだねるか、ここで定義
    const mainTypeBaseCatchphrase = "慈愛と調和の体現者";
    const mainTypeTitle = `【ＮＯＡＨ（ノア） ${mainTypeBaseCatchphrase}】`; // 全角で統一
    const mainTypeDescription = "「ＮＯＡＨ」コードは、人間の本能的な「育成性」と「愛情性」を表現する。このコードを持つ人々は、他者を守り、育て、調和をもたらすことに深い喜びを感じる。しかし、その愛情は時として支配的で独善的な側面も持つ。まるで大きな母なる木のように、多くの生命を包み込みながらも、その影響下に置こうとする本能を持っている。"; // catch_base.json から取得したNOAHの基本説明

    return {
      mainTypeTitle: mainTypeTitle,
      mainTypeCatchphrase: mainTypeBaseCatchphrase, // 「【】」なしのキャッチ
      mainTypeDescription: mainTypeDescription,
      mainTypeAcronyms: undefined, // NOAH用のアクロニムがあれば設定
      alphaBetaTypeFullTitle: `ＮＯＡＨ ${variantChar === 'α' ? 'ａｌｐｈａ' : 'ｂｅｔａ'} 「${variant.main.catch}」`, // 全角で統一
      alphaBetaTypeCatchphrase: variant.main.catch,
      alphaBetaTypeDescription: variant.main.description,
      oneTwoTypeFullTitle: `ＮＯＡＨ ${variantChar === 'α' ? 'ａｌｐｈａ' : 'ｂｅｔａ'} ${subTypeNum === 1 ? '１型' : '２型'} 「${typeSpecificFeature.catch}」`, // 全角で統一
      oneTwoTypeCatchphrase: typeSpecificFeature.catch,
      oneTwoTypeDescription: typeSpecificFeature.description,
      // 以下は旧フィールドまたは互換性のためのフィールド
      catch: mainTypeTitle,
      baseDescription: mainTypeDescription,
      mainTypeNameJp: mainTypeNameJp, // "NOAH (ノア)"
      variantTitle: variant.main.catch,
      variant_description_sub_title_explanation: variant.main.description,
      subTitle: typeSpecificFeature.catch,
      sub_type_description_sub_title_explanation: typeSpecificFeature.description,
      acronyms: undefined,
      componentAcronyms: undefined,
    };
  }

  // === 以下は AKARI, SENRI, NOAH 以外の場合の既存のロジック (変更なし) ===
  const entry = findEntry(baseKey);
  // ... (残りの既存ロジックは変更しない) ...
  if (!entry) return null;

  const variantInfo = entry[variantChar === 'α' ? 'alpha_variant' : 'beta_variant'];
  if (!variantInfo) return null;

  const sub = variantInfo.sub_types?.[parseInt(subIdxStr, 10) - 1];
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
