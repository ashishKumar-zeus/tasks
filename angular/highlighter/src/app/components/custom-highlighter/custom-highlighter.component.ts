import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-custom-highlighter',
  templateUrl: './custom-highlighter.component.html',
  styleUrls: ['./custom-highlighter.component.scss']
})
export class CustomHighlighterComponent {

  @Input() textPhrase : string = '';

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.textPhrase)
  }
}
