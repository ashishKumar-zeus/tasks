import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentenceHighlighterComponent } from './sentence-highlighter.component';

describe('SentenceHighlighterComponent', () => {
  let component: SentenceHighlighterComponent;
  let fixture: ComponentFixture<SentenceHighlighterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SentenceHighlighterComponent]
    });
    fixture = TestBed.createComponent(SentenceHighlighterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
