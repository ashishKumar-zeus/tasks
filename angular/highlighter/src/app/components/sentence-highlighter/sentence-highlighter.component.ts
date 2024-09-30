import { Component,Input,SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-sentence-highlighter',
  templateUrl: './sentence-highlighter.component.html',
  styleUrls: ['./sentence-highlighter.component.scss']
})
export class SentenceHighlighterComponent {

  @Input() textPhrase : string = '';

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.textPhrase)
  }
}
