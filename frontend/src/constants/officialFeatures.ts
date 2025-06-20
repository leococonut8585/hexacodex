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

interface KAIRIFeature {
  catch: string;
  description: string;
}

interface KAIRISubType {
  main: KAIRIFeature; // alpha または beta の主要なキャッチコピーと説明
  type1: KAIRIFeature; // 1型 のキャッチコピーと説明
  type2: KAIRIFeature; // 2型 のキャッチコピーと説明
}

interface KAIRIData {
  alpha: KAIRISubType;
  beta: KAIRISubType;
}

interface JumeriFeatureDetail { // KAIRIFeatureなどと共通化も可能だが、明確化のため別名に
  catch: string;
  description: string;
}

interface JumeriSubTypeData {
  main: JumeriFeatureDetail;
  type1: JumeriFeatureDetail;
  type2: JumeriFeatureDetail;
}

interface JumeriVariantData {
  alpha: JumeriSubTypeData;
  beta: JumeriSubTypeData;
}

// JUMERI_FEATURES定数の型 (キーは "TYPE1×TYPE2" 形式)
interface AllJumeriData {
  [jumeriKey: string]: JumeriVariantData;
}

function normalizeKey(key: string): string {
  let normalized = key;

  // 全角タイプ名を半角大文字に (既存の置換もここに含める)
  normalized = normalized
    .replace(/ＫＡＩＲＩ/g, 'KAIRI')
    .replace(/ＮＯＡＨ/g, 'NOAH')
    .replace(/ＳＥＮＲＩ/g, 'SENRI')
    .replace(/ＡＫＡＲＩ/g, 'AKARI')
    .replace(/ＭＡＲＩ/g, 'MARI')
    .replace(/ＫＩＮＲＹＵ/g, 'KINRYU')
    .toUpperCase(); // 一旦全て大文字に

  // 区切り文字の正規化: アンダースコアや様々なスペース、"x"などを半角"×"に統一
  // まずスペースを削除し、その後アンダースコアや'X'を'×'に置換
  normalized = normalized.replace(/\s+/g, ''); // 全てのスペースを削除
  normalized = normalized.replace(/_/g, '×');   // アンダースコアを×に
  normalized = normalized.replace(/X/g, '×');    // 半角大文字Xを×に (小文字xはtoUpperCaseでXになっているはず)

  // 念のため、連続する×記号があれば1つにまとめる（例: TYPE1××TYPE2 -> TYPE1×TYPE2）
  normalized = normalized.replace(/×+/g, '×');

  // タイプ名が直接連結している場合(例: AKARISENRI)への対応は、
  // 明確な区切り文字がないと誤判定のリスクが高いため、
  // 現状の正規表現 `([^_]+)_([αβ])-(\d)` で `baseKey` が
  // "AKARI×SENRI" や "AKARI_SENRI" のように区切り文字付きで渡されることを前提とします。
  // もし "AKARISENRI_alpha-1" のようなキーが実際に存在するなら、
  // `finalKey.match` の正規表現自体も見直す必要があります。
  // 今回は normalizeKey で対応できる範囲に留めます。

  return normalized;
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
  },
  "AKARI×SENRI": {
    alpha: {
      main: {
        catch: "情熱を武器に、世界を鮮烈にデザインする、閃光のストラテジスト",
        description: "ＡＫＡＲＩ　×　ＳＥＮＲＩ　ａｌｐｈａタイプは、この感性主導型戦略を外向的で積極的な形で表現する人格である。彼らは「情熱的革命家」とでも呼ぶべき存在で、その燃えるような創造性と巧妙な戦略的思考を武器に、既存の価値観や社会構造に果敢に挑戦していく。"
      },
      type1: {
        catch: "情熱の開拓アーティスト",
        description: "このサブタイプは「閃きを羅針盤に、未知の表現領域を切り拓く先駆者」として機能する。"
      },
      type2: {
        catch: "戦略的カリスマデザイナー",
        description: "このサブタイプは「美と知略で常識を挑発し、社会を覚醒させる扇動の芸術家」として機能する。"
      }
    },
    beta: {
      main: {
        catch: "内なる炎を秘め、深遠なる言葉と美で静かに世界を刺す、孤高の戦略的詩人",
        description: "ＡＫＡＲＩ　×　ＳＥＮＲＩ　ｂｅｔａタイプは、この感性主導型戦略を内向的で深遠な形で表現する人格である。彼らは「静寂の革命家」として機能し、表面的には控えめでありながら、その内に秘めた情熱と戦略的洞察によって、文化や思想の深層部分に持続的な影響を与え続ける。"
      },
      type1: {
        catch: "孤高の錬金術的参謀",
        description: "このサブタイプは「秘めたる美意識と深慮遠謀で、真価を静かに創造する者」として機能する。"
      },
      type2: {
        catch: "夢幻の戦略的吟遊詩人",
        description: "このサブタイプは「秘めたる反骨と幻想のヴェールで、静かに時代を覚醒させる者」として機能する。"
      }
    }
  },
  "SENRI×AKARI": {
    alpha: {
      main: {
        catch: "戦略を纏い、閃光を放つ、孤高のカリスマティック・イノベーター",
        description: "ＳＥＮＲＩ　×　ＡＫＡＲＩ　ａｌｐｈａタイプは、この複雑なジュメリ特性を外向的で積極的な形で表現する人格である。彼らは「カリスマティック・ディスラプター」とでも呼ぶべき存在で、その圧倒的な存在感と予測不可能な創造性で、社会に根本的な変革をもたらそうとする。"
      },
      type1: {
        catch: "戦略的閃光アーティスト",
        description: "このサブタイプは「華麗なる一撃の開拓者」として機能する。彼らは瞬間的なインスピレーションを緻密な戦略に変換し、それを芸術的な美しさで包装して世界に提示する。"
      },
      type2: {
        catch: "知略の革命デザイナー",
        description: "このサブタイプは「カリスマ的扇動者」としての側面を強く持つ。彼らは美学と戦略を巧妙に組み合わせることで、社会構造そのものに挑戦する新しい価値観をデザインする。"
      }
    },
    beta: {
      main: {
        catch: "深淵なる知性と秘めたる情熱、影で世界を操るミスティック・ストラテジスト",
        description: "ＳＥＮＲＩ　×　ＡＫＡＲＩ　ｂｅｔａタイプは、このジュメリ特性を内向的で深遠な形で表現する人格である。彼らは「影の支配者」「孤高の芸術家」として機能し、表面的には目立たないが、深いレベルで世界に持続的な影響を与え続ける。"
      },
      type1: {
        catch: "深淵のアルケミスト",
        description: "このサブタイプは「真理と美の結晶を錬成する者」として機能する。彼らは孤独な探求の果てに、時代を超えた価値を持つ作品や思想を生み出す。"
      },
      type2: {
        catch: "影の詩的改革者",
        description: "このサブタイプは「ミステリアスな異端児」として機能する。彼らは幻想のベールで現実を刺す詩的表現を通じて、人々の心に静かな革命を起こす。その手法は直接的な主張ではなく、美しい比喩や象徴を通じた間接的な覚醒である。"
      }
    }
  },
  "MARI×KINRYU": {
    alpha: {
      main: {
        catch: "陽光をまとう堅実なリーダー：信頼と笑顔で、未来を育むコミュニティビルダー",
        description: "ＭＡＲＩ　×　ＫＩＮＲＹＵ　ａｌｐｈａタイプは、この堅実的創造性を外向的で積極的な形で表現する人格である。彼らは「太陽のような守護者」とでも呼ぶべき存在で、その確固たる信頼性と明るい魅力を武器に、コミュニティや組織の中心となって多くの人々を結びつけ、共に成長していく環境を創造する。"
      },
      type1: {
        catch: "信頼と冒険のハーモニー・リーダー",
        description: "このサブタイプは「堅実な航路に、未知の喜びを運ぶ船長」として機能する。"
      },
      type2: {
        catch: "育むエンターテイナー・マイスター",
        description: "このサブタイプは「確かな技術と遊び心で、才能を開花させる演出家」として機能する。"
      }
    },
    beta: {
      main: {
        catch: "縁の下の輝く支援者：控えめな誠実さの奥に、個性的な輝きを秘めた癒し手",
        description: "ＭＡＲＩ　×　ＫＩＮＲＹＵ　ｂｅｔａタイプは、この堅実的創造性を内向的で静謐な形で表現する人格である。彼らは「静かな安心感と心地よい刺激を与える存在」として機能し、表面的には控えめでありながら、その確実な支援と独特の感性によって、周囲の人々に深い安らぎと密やかな喜びをもたらす。"
      },
      type1: {
        catch: "静寂の自由なる守護者",
        description: "このタイプは「不動の誠実さに、型破りな美学を秘めたガーディアン」として機能する。"
      },
      type2: {
        catch: "微笑みの縁結びイノベーター",
        description: "このサブタイプは「温かな絆と斬新なアイデアで、調和と変革を静かに紡ぐ者」として機能する。"
      }
    }
  },
  "KINRYU×MARI": {
    alpha: {
      main: {
        catch: "太陽の実行者：輝きと誠実さで、人々を巻き込み未来を照らすリーダー",
        description: "ＫＩＮＲＹＵ　×　ＭＡＲＩ　ａｌｐｈａタイプは、この魅力的信頼構築を外向的で積極的な形で表現する人格である。彼らは「行動する希望そのもの」とでも呼ぶべき存在で、その圧倒的な魅力と確実な実行力を武器に、多くの人々を巻き込みながら革新的なプロジェクトや社会変革を推進していく。"
      },
      type1: {
        catch: "陽気な信頼のパイオニア",
        description: "このサブタイプは「自由な魂と誠実な心で、未知の喜びを共に切り拓くリーダー」として機能する。"
      },
      type2: {
        catch: "変幻自在の育成エンターテイナー",
        description: "このサブタイプは「華麗な演出と温かな眼差しで、才能を解き放つマジシャン」として機能する。"
      }
    },
    beta: {
      main: {
        catch: "静かなる華やぎの奉仕者：独自のセンスと誠意で、心に寄り添い貢献する",
        description: "ＫＩＮＲＹＵ　×　ＭＡＲＩ　ｂｅｔａタイプは、この魅力的信頼構築を内向的で静謐な形で表現する人格である。彼らは「静かな喜びと確かな安心感を与える存在」として機能し、表面的には控えめでありながら、その独特のセンスと確実な配慮によって、周囲の人々の日常に豊かさと安定をもたらす。"
      },
      type1: {
        catch: "自由なる魂の堅実な守り手",
        description: "このサブタイプは「独自の美学と確かな誠意で、静かに個性を守り育むガーディアン」として機能する。"
      },
      type2: {
        catch: "静かなる絆のイノベーター",
        description: "このサブタイプは「型破りな発想と温かな配慮で、人と未来を繋ぐ発明家」として機能する。"
      }
    }
  }
};

const JUMERI_FEATURES: AllJumeriData = {
  "NOAH×KAIRI": { // 正規化後のキー
    alpha: {
      main: {
        catch: "才知と慈愛で、人々を導き育む、灯台の如きビジョンあるリーダー",
        description: "ＮＯＡＨ　×　ＫＡＩＲＩ　ａｌｐｈａタイプは、この慈愛的才覚を外向的で積極的な形で表現する人格である。彼らは「理想実現型リーダー」とでも呼ぶべき存在で、その温かい人間性と明確なビジョンを武器に、多くの人々を理想的な未来に向けて導いていこうとする。"
      },
      type1: {
        catch: "夢の建築家",
        description: "このサブタイプは「慈愛と戦略で、理想の未来図を描き築き上げる構築者」として機能する。"
      },
      type2: {
        catch: "信念と魂の育成者",
        description: "このサブタイプは「温かな導きと揺るぎない理想で、個と組織の成長を加速させる触媒」として機能する。"
      }
    },
    beta: {
      main: {
        catch: "深い共感と知恵で、個の成長と調和を支える、静かなる洞察の守護者",
        description: "ＮＯＡＨ　×　ＫＡＩＲＩ　ｂｅｔａタイプは、この慈愛的知性を内向的で深遠な形で表現する人格である。彼らは「静寂の賢者」として機能し、表面的には控えめでありながら、その深い洞察力と温かい共感によって、周囲の人々の心の奥深くに持続的な影響を与え続ける。"
      },
      type1: {
        catch: "静かなる理想の職人",
        description: "このサブタイプは「深い共感と揺るぎない探求心で、本質的な癒しと完成を追求する者」として機能する。"
      },
      type2: {
        catch: "思索する守護の哲学者",
        description: "このサブタイプは「静かな眼差しと深い知恵で、本質的な価値と心の平和を見守る賢者」として機能する。"
      }
    }
  },
  "KAIRI×NOAH": { // 正規化後のキー
    alpha: {
      main: {
        catch: "理想を現実に根付かせる育成者：知性と温情で、希望の未来をデザインするリーダー",
        description: "ＫＡＩＲＩ　×　ＮＯＡＨ　ａｌｐｈａタイプは、この知的愛情主義を外向的で積極的な形で表現する人格である。彼らは「啓蒙的建設者」とでも呼ぶべき存在で、その深い知性と温かい人間性を武器に、理想的な社会や組織の構築に向けて積極的に行動していく。"
      },
      type1: {
        catch: "理想の架け橋を築く賢者",
        description: "このサブタイプは「知性と温情で、希望ある未来図を現実化するリーダー」として機能する。"
      },
      type2: {
        catch: "信念を育む賢明な指導者",
        description: "このサブタイプは「理想への情熱と温かな眼差しで、個と社会の成長を促す探求者」として機能する。"
      }
    },
    beta: {
      main: {
        catch: "内省する慈愛の探求者：静かな知恵と深い共感で、本質的な成長と調和を育む賢人",
        description: "ＫＡＩＲＩ　×　ＮＯＡＨ　ｂｅｔａタイプは、この知的愛情主義を内向的で深遠な形で表現する人格である。彼らは「静寂の導師」として機能し、表面的には控えめでありながら、その深い洞察力と温かい理解によって、周囲の人々の心の深奥に持続的で根本的な変化をもたらす。"
      },
      type1: {
        catch: "静かなる育成のアルチザン",
        description: "このサブタイプは「孤高の探求と深い共感で、本質的な才能と癒しを育む職人」として機能する。"
      },
      type2: {
        catch: "内省する守護の灯台守",
        description: "このサブタイプは「深い洞察と静かな愛情で、本質的な価値と心の平和を見守る賢者」として機能する。"
      }
    }
  }
};

const KAIRI_FEATURES: KAIRIData = {
  alpha: {
    main: {
      catch: "理想を掲げ、現実を切り拓く賢者",
      description: "ＫＡＩＲＩ　ａｌｐｈａタイプは、ＫＡＩＲＩの基本的特質に外向性と行動力が加わった、極めて野心的で影響力のある人格である。彼らは「才能あふれるカリスマ」とでも呼ぶべき存在で、その分析力と理想主義を武器に、社会に大きなインパクトを与えようとする。"
    },
    type1: {
      catch: "理想構築型",
      description: "ＫＡＩＲＩ　ａｌｐｈａ　１型は、「理想を描き出す設計士」とでも呼ぶべき存在である。彼らは抽象的な理想を具体的な実行可能な計画に落とし込む能力に長けており、ビジョンを持ったリーダーとしての資質を持っている。「未来志向性」と「システム思考」を高度に発達させた人格である。"
    },
    type2: {
      catch: "信念探求型",
      description: "ＫＡＩＲＩ　ａｌｐｈａ〠２型は、「革命的思想家」としての側面を強く持つ人格である。彼らは既存の価値観や社会システムに疑問を投げかけ、より良い世界を目指して絶えず思考と行動を続ける。心理学的には「批判的思考」と「変革への意志」を併せ持った人格である。"
    }
  },
  beta: {
    main: {
      catch: "静かに理想を抱き、孤高を歩む探究者",
      description: "ＫＡＩＲＩ　ｂｅｔａタイプは、ＫＡＩＲＩの基本的特質を内向的で静謐な形で表現する人格である。彼らは「孤高の思索者」とでも呼ぶべき存在で、表立った行動よりも深い思考と内的探求を通じて自分なりの真理を追求する。"
    },
    type1: {
      catch: "孤高の職人型",
      description: "ＫＡＩＲＩ　ｂｅｔａ　１型は、「完璧主義の芸術家」とでも形容すべき存在である。彼らは自分が選んだ専門分野において、妥協を許さない完璧性を追求し続ける。いわゆる「フロー状態」に入りやすい人格であり、集中力と持続力において並外れた能力を発揮する。"
    },
    type2: {
      catch: "静かな哲学者型",
      description: "ＫＡＩＲＩ　ｂｅｔａ ２型は、「内省的賢者」として機能する人格である。彼らは世界の本質や人生の意味について深く思索し、独自の哲学的洞察を発達させる。心理学的には「実存的知性」と「形而上学的思考」を併せ持った人格である。"
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
  let [, baseKey, variantChar, subIdxStr] = match;
  const subTypeNum = parseInt(subIdxStr, 10);

  const normalizedBaseKey = normalizeKey(baseKey); // ★ キーを正規化 ★

  // ジュメリタイプの処理を最初に行う
  if (JUMERI_FEATURES[normalizedBaseKey]) {
    const jumeriData = JUMERI_FEATURES[normalizedBaseKey];
    const variantData = variantChar === 'α' ? jumeriData.alpha : jumeriData.beta;
    if (!variantData) return null;

    let typeSpecificFeature: JumeriFeatureDetail;
    if (subTypeNum === 1) typeSpecificFeature = variantData.type1;
    else if (subTypeNum === 2) typeSpecificFeature = variantData.type2;
    else return null;

    // jumeri_type_name_jp を JUMERI_FEATURES から取得するか、または finalKey から再構築
    // 例: normalizedBaseKey が "NOAH×KAIRI" の場合
    const nameParts = normalizedBaseKey.split('×');
    const type1Name = nameParts[0];
    const type2Name = nameParts[1];

    // 表示用の名前 (全角等、ユーザー指示書に合わせる)
    // 注意: ここでのreplaceは単純な例。より多くのタイプに対応するには改善が必要。
    const displayType1Name = type1Name
      .replace("AKARI", "ＡＫＡＲＩ")
      .replace("SENRI", "ＳＥＮＲＩ")
      .replace("NOAH", "ＮＯＡＨ")
      .replace("KAIRI", "ＫＡＩＲＩ")
      .replace("MARI", "ＭＡＲＩ")
      .replace("KINRYU", "ＫＩＮＲＹＵ");
    const displayType2Name = type2Name
      .replace("AKARI", "ＡＫＡＲＩ")
      .replace("SENRI", "ＳＥＮＲＩ")
      .replace("NOAH", "ＮＯＡＨ")
      .replace("KAIRI", "ＫＡＩＲＩ")
      .replace("MARI", "ＭＡＲＩ")
      .replace("KINRYU", "ＫＩＮＲＹＵ");

    const mainTypeNameJp = `${displayType1Name}　×　${displayType2Name}`; // 全角スペースと全角×を使用
    const mainTypeBaseCatchphrase = variantData.main.catch;
    // タイトルはキーから再構築するのではなく、jumeri_type_name_jp のようなフィールドを JUMERI_FEATURES に持たせる方が良いかもしれないが、今回は指示に従い組み立てる。
    // ユーザー指示書では alpha/beta のキャッチコピーがそのまま使われているため、それに倣う。
    const mainTypeTitle = `${mainTypeNameJp} ${variantChar === 'α' ? 'ａｌｐｈａ' : 'ｂｅｔａ'}`;


    return {
      mainTypeTitle: `${mainTypeNameJp} ${variantChar === 'α' ? 'ａｌｐｈａ' : 'ｂｅｔａ'} 「${variantData.main.catch}」`, // 指示書の形式に合わせる
      mainTypeCatchphrase: variantData.main.catch, // αまたはβのメインキャッチ
      mainTypeDescription: variantData.main.description, // αまたはβのメイン解説
      mainTypeAcronyms: undefined,

      alphaBetaTypeFullTitle: `${mainTypeNameJp} ${variantChar === 'α' ? 'ａｌｐｈａ' : 'ｂｅｔａ'} 「${variantData.main.catch}」`,
      alphaBetaTypeCatchphrase: variantData.main.catch,
      alphaBetaTypeDescription: variantData.main.description,

      oneTwoTypeFullTitle: `${mainTypeNameJp} ${variantChar === 'α' ? 'ａｌｐｈａ' : 'ｂｅｔａ'} ${subTypeNum === 1 ? '１型' : '２型'} 「${typeSpecificFeature.catch}」`,
      oneTwoTypeCatchphrase: typeSpecificFeature.catch,
      oneTwoTypeDescription: typeSpecificFeature.description,

      catch: `${mainTypeNameJp} ${variantChar === 'α' ? 'ａｌｐｈａ' : 'ｂｅｔａ'} 「${variantData.main.catch}」`,
      baseDescription: variantData.main.description,
      mainTypeNameJp: normalizedBaseKey,
      variantTitle: variantData.main.catch,
      variant_description_sub_title_explanation: variantData.main.description,
      subTitle: typeSpecificFeature.catch,
      sub_type_description_sub_title_explanation: typeSpecificFeature.description,
      acronyms: undefined,
      componentAcronyms: undefined, // 必要なら catch_giumeri.json から取得するロジック
    };
  } else if (normalizedBaseKey.toUpperCase() === 'KAIRI') {
    const variant = variantChar === 'α' ? KAIRI_FEATURES.alpha : KAIRI_FEATURES.beta;
    if (!variant) return null;

    let typeSpecificFeature: KAIRIFeature;
    if (subTypeNum === 1) typeSpecificFeature = variant.type1;
    else if (subTypeNum === 2) typeSpecificFeature = variant.type2;
    else return null;

    const mainTypeNameJp = "KAIRI (カイリ)";
    const mainTypeBaseCatchphrase = "知性と理想の探求者"; // KAIRIの基本キャッチ
    const mainTypeTitle = `【ＫＡＩＲＩ（カイリ） ${mainTypeBaseCatchphrase}】`; // 全角で統一
    const mainTypeDescription = "「ＫＡＩＲＩ」タイプは、知的好奇心と真実への探求を象徴します。彼らは論理的な思考と深い洞察力を持ち、複雑な問題を解決することに長けています。しかし、時にはその知性が他者との間に距離を生むこともあります。"; // catch_base.jsonから取得したKAIRIの基本説明

    return {
      mainTypeTitle: mainTypeTitle,
      mainTypeCatchphrase: mainTypeBaseCatchphrase,
      mainTypeDescription: mainTypeDescription,
      mainTypeAcronyms: undefined, // KAIRI用のアクロニムがあれば設定
      alphaBetaTypeFullTitle: `ＫＡＩＲＩ ${variantChar === 'α' ? 'ａｌｐｈａ' : 'ｂｅｔａ'} 「${variant.main.catch}」`, // 全角で統一
      alphaBetaTypeCatchphrase: variant.main.catch,
      alphaBetaTypeDescription: variant.main.description,
      oneTwoTypeFullTitle: `ＫＡＩＲＩ ${variantChar === 'α' ? 'ａｌｐｈａ' : 'ｂｅｔａ'} ${subTypeNum === 1 ? '１型' : '２型'} 「${typeSpecificFeature.catch}」`, // 全角で統一
      oneTwoTypeCatchphrase: typeSpecificFeature.catch,
      oneTwoTypeDescription: typeSpecificFeature.description,
      catch: mainTypeTitle,
      baseDescription: mainTypeDescription,
      mainTypeNameJp: mainTypeNameJp,
      variantTitle: variant.main.catch,
      variant_description_sub_title_explanation: variant.main.description,
      subTitle: typeSpecificFeature.catch,
      sub_type_description_sub_title_explanation: typeSpecificFeature.description,
      acronyms: undefined,
      componentAcronyms: undefined,
    };
  } else if (normalizedBaseKey.toUpperCase() === 'AKARI') {
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
  } else if (normalizedBaseKey.toUpperCase() === 'SENRI') {
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
  } else if (normalizedBaseKey.toUpperCase() === 'NOAH') {
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

  // === 以下はジュメリでも基本タイプでもない場合の既存のロジック (変更なし) ===
  const entry = findEntry(normalizedBaseKey); // ★ 正規化されたキーを使用 ★
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
