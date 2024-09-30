import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  question: string = '';
  textPhrase: string = '';
  selectedOption: string = 'word';

  constructor() {

  }

  ngOnInit() {
    this.handleEvents();
  }


  handleEvents() {
    // const textPhraseInput = document.getElementById('textPhrase');
    // const questionInput = document.getElementById('question');

    // textPhraseInput?.addEventListener('input', (e) => {
    //   textPhraseInput.style.height = 'auto'; // Reset the height
    //   textPhraseInput.style.height = `${Math.min(textPhraseInput.scrollHeight, 100)}px`; // Limit height to 100px
    // });

    // questionInput?.addEventListener('input', (e) => {
    //   questionInput.style.height = 'auto'; // Reset the height
    //   questionInput.style.height = `${Math.min(questionInput.scrollHeight, 100)}px`; // Limit height to 100px
    // });


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
