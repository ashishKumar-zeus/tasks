import { Component, OnInit } from '@angular/core';
import { DataHandlingService } from 'src/app/services/data-handling.service';
import { QuestionModel } from 'src/app/models/questionModel';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  //inital data
  formData: QuestionModel = {
    question: '',
    textPhrase: '',
    selectedOption: '',
    selectedIndex: new Set<[number,number]>
  };

  constructor(private dataHandler: DataHandlingService) {
    this.dataHandler = dataHandler;
  }

  ngOnInit() {
    this.dataHandler.currentDataObservable.subscribe(data => {
      this.formData = { ...data };
    });
    console.log(this.formData);
    this.handleEvents();

  }

  onInputChange() {
    this.dataHandler.updateData(this.formData);
  }

  handleEvents() {
    const textArea = document.querySelectorAll('.textarea') as NodeListOf<Element>;
    for (let i = 0; i < textArea.length; i++) {
      const element = textArea[i] as HTMLElement;

      element?.addEventListener('input', (e) => {
        element.style.height = 'auto'; // Reset the height
        element.style.height = `${Math.min(element.scrollHeight, 100)}px`; // Limit height to 100px
      });
    }

  }

}