import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeypadPageComponent } from './keypad-page.component';

describe('KeypadPageComponent', () => {
  let component: KeypadPageComponent;
  let fixture: ComponentFixture<KeypadPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeypadPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeypadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
