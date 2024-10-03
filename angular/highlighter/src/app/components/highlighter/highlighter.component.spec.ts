import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlighterComponent } from './highlighter.component';

describe('HighlighterComponent', () => {
  let component: HighlighterComponent;
  let fixture: ComponentFixture<HighlighterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HighlighterComponent]
    });
    fixture = TestBed.createComponent(HighlighterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
