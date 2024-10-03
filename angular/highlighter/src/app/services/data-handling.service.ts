import { Injectable } from '@angular/core';
import { QuestionModel } from '../models/questionModel';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataHandlingService {

  // BehaviorSubject to hold the current state of the data
  //define a questions data model with initial values

  private questionsData = new BehaviorSubject<QuestionModel>({
    question: '',
    textPhrase: '',
    selectedOption: 'word',
    selectedIndex: new Set<[number, number]>(),
  });

  // Observable for components to subscribe to
  currentDataObservable = this.questionsData.asObservable();

  constructor() { }

  // Update the data from components
  updateData(newData: QuestionModel): void {
    this.questionsData.next(newData);
    console.log("updated to latest")
  }

  getData(): QuestionModel {
    return this.questionsData.getValue();
  }

}
