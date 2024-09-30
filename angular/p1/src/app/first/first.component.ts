import { Component , Output, Input, EventEmitter } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { AakashPipe } from '../customPipes/aakash.pipe';

@Component({
  selector: 'app-first',
  standalone: true,
  imports: [UpperCasePipe,AakashPipe],
  templateUrl: './first.component.html',
  styleUrl: './first.component.scss'
})
export class FirstComponent {

  @Input() data : string = "data";

  @Output() eventSender = new EventEmitter<string>();

  updateDataToParent(){
    this.data = "new updated data"
    this.eventSender.emit(this.data);
  }


}


