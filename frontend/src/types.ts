export interface Question {
  id: number;
  question: string;
  optionYes: string;
  optionNo: string;
}

export interface CategoryQuestions {
  [category: string]: Question[];
}

export interface FeatureInfo {
  catch: string;
  description: string;
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
}
