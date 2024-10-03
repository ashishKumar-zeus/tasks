export interface QuestionModel {
    question: string;
    textPhrase: string;
    selectedOption: string;
    selectedIndex: Set<[number, number]>;
  }
