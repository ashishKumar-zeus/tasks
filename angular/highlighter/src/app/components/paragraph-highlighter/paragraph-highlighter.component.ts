import { Component , Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paragraph-highlighter',
  templateUrl: './paragraph-highlighter.component.html',
  styleUrls: ['./paragraph-highlighter.component.scss']
})
export class ParagraphHighlighterComponent {

  @Input() textPhrase : string = '';

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.textPhrase)
  }
}
