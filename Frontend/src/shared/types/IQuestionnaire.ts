import { IQuestionWithWeight } from './IQuestionWithWeight';

export interface IQuestionnaire {
  id: string;
  name: string;
  questions: IQuestionWithWeight[];
}
