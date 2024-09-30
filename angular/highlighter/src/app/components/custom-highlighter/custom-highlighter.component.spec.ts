import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomHighlighterComponent } from './custom-highlighter.component';

describe('CustomHighlighterComponent', () => {
  let component: CustomHighlighterComponent;
  let fixture: ComponentFixture<CustomHighlighterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomHighlighterComponent]
    });
    fixture = TestBed.createComponent(CustomHighlighterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
