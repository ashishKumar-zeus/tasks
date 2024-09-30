import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParagraphHighlighterComponent } from './paragraph-highlighter.component';

describe('ParagraphHighlighterComponent', () => {
  let component: ParagraphHighlighterComponent;
  let fixture: ComponentFixture<ParagraphHighlighterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParagraphHighlighterComponent]
    });
    fixture = TestBed.createComponent(ParagraphHighlighterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
