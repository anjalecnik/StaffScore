import { IQuestion } from "./IQuestion";

export interface ISurvey {
    id: string;
    name: string;
    questions : IQuestion;
  }