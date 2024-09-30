import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-word-highlighter',
  templateUrl: './word-highlighter.component.html',
  styleUrls: ['./word-highlighter.component.scss']
})
export class WordHighlighterComponent implements OnChanges {


    @Input() textPhrase : string = '';

    ngOnChanges(changes: SimpleChanges): void {
      console.log(this.textPhrase)
    }
}
