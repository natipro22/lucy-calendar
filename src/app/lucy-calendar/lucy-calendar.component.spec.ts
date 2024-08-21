import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LucyCalendarComponent } from './lucy-calendar.component';

describe('LucyCalendarComponent', () => {
  let component: LucyCalendarComponent;
  let fixture: ComponentFixture<LucyCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LucyCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LucyCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
