import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirstComponent } from "./first/first.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FirstComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


export class AppComponent {
  title: string;
  buttonStatus: string;
  dataToSend: string;

  constructor() {

      this.title = 'Text';
      this.buttonStatus = 'Hide'
      this.dataToSend = "akshay"

  }

  buttonClicked() {
    this.buttonStatus === 'Hide' ? this.buttonStatus = 'Show' : this.buttonStatus = 'Hide'
    this.buttonStatus === 'Hide' ? this.title = 'Text' : this.title = ''
  }


  @Input() setItem(eventMessage: string) {
    console.log("got update")
    this.dataToSend = eventMessage
  }



  updateValueOfParent(newItem: string) {
    this.dataToSend = newItem;
  }


}
