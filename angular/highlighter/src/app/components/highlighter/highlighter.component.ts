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
    selectedIndex: new Set<[number, number]>
  };

  wordsList: string[] = [];

  isSelecting: boolean = false;
  startIndex: number = -1;
  endIndex: number = -1;

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




  startSelection(event: MouseEvent) {
    event.preventDefault();
    let target = event.target as HTMLElement;
    let index = parseInt(target.id);

    if (this.removeRangeIfIndexInRange(index)) return;

    this.isSelecting = true;
    this.startIndex = index;
    this.endIndex = index;

  }

  removeRangeIfIndexInRange(index: number): boolean {
    console.log(index)
    for (let range of this.formData.selectedIndex) {
      let [start, end] = range;

      if (index >= start && index <= end) {
        console.log(start, end)
        this.formData.selectedIndex.delete(range);
        return true;
      }
    }
    return false;
  }

  updateSelection(event: MouseEvent) {
    event.preventDefault();
    if (!this.isSelecting) return;
    let target = event.target as HTMLElement;
    let index = parseInt(target.id);
    this.endIndex = index;
  }

  stopSelection(event: MouseEvent) {
    event.preventDefault();

    if (!this.isSelecting) return;
    this.isSelecting = false;

    let [start, end] = this.getStartEnd();

    this.formData.selectedIndex.add([start, end]);
    this.dataHandler.updateData(this.formData)

    this.startIndex = -1;
    this.endIndex = -1;

  }

  getStartEnd() {
    let start = Math.min(this.startIndex, this.endIndex)
    let end = Math.max(this.startIndex, this.endIndex)
    return [start, end];
  }

  shouldSpaceBeSelected(index: number) {
    if (index < 0 || index > this.wordsList.length - 1) return;

    if (this.isSelected(index) && this.isSelected(index + 1)) {
      return true;
    }
    return false;

  }

  isSelected(index: number): boolean {

    if (this.isInRange(index)) return true;

    let [start, end] = this.getStartEnd();

    if (index >= start && index <= end) {
      return true;
    }

    return false;
  }


  isInRange(index: number) {

    for (let range of this.formData.selectedIndex) {
      let [start, end] = range; // Destructure the start and end of the range

      // Check if the index lies within the current range
      if (index >= start && index <= end) {
        return true;
      }


    }


    return false;
  }



  getRange(index: number):[number,number] {
  
    for (let range of this.formData.selectedIndex) {
      let [start, end] = range; // Destructure the start and end of the range

      // Check if the index lies within the current range
      if (index >= start && index <= end) {
        return [start,end];
      }

    }

    return [-1,-1]
  }




}
