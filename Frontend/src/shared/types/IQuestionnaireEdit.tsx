export interface IQuestionnaireEdit {
  id: string;
  name: string;
  questions: Question[];
}

interface Question {
  // Optional attributes because of different models used in QuestionnaireEditForm
  question_id?: string;
  weight?: string;
  id?: number;
  type?: string;
  question?: string;
  qType?: string;
  optimalResponse?: string;
}
