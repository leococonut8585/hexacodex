export interface Question {
  id: number;
  question: string;
  optionYes: string;
  optionNo: string;
}

export interface CategoryQuestions {
  [category: string]: Question[];
}

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

export interface Features {
  [category: string]: FeatureInfo;
}

export interface AnswerState {
  [category: string]: {
    [questionId: number]: boolean | undefined;
  };
}

export interface DiagnosisResult {
  category: string;
  catch: string;
  description: string;
  acronyms?: Acronym[];
  componentAcronyms?: ComponentAcronym[];
}

export interface ApiDiagnosis {
  zodiac: string;
  star_type: string;
  jumeri: string;
}

export interface DetailedDiagnosisResult extends DetailedFeatureInfo {
  category: string;
  subType: string;
}
