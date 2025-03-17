import { TestBed } from '@angular/core/testing';

import { LucyCalendarService } from './lucy-calendar.service';

describe('LucyCalendarService', () => {
  let service: LucyCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LucyCalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
