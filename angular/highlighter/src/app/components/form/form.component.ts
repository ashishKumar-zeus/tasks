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
    // this.handleEvents();
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
