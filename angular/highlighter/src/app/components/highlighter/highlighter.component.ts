import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { QuestionModel } from 'src/app/models/questionModel';
import { DataHandlingService } from 'src/app/services/data-handling.service';

@Component({
  selector: 'app-highlighter',
  templateUrl: './highlighter.component.html',
  styleUrls: ['./highlighter.component.scss']
})
export class HighlighterComponent {

  //inital data
  formData: QuestionModel = {
    question: '',
    textPhrase: '',
    selectedOption: '',
    selectedIndex: []
  };

  wordsList: string[] = []; 
  isSelecting: boolean = false;
  startIndex:string = '';
  endIndex:string = '';


  constructor(private dataHandler: DataHandlingService) {
    //data handler
    this.dataHandler = dataHandler;
  }

  ngOnInit() {
    //subscribing to data handlers data
    this.dataHandler.currentDataObservable.subscribe(data => {
      this.formData = { ...data };
      this.wordsList = this.getWords(this.formData.textPhrase);
      console.log(this.wordsList)

    });
  }
  getWords(text: string): string[] {
    if (text === '') return []
    return text.trim().split(/\s+/).filter(word => word.length > 0);
  }


}
