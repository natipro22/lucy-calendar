import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, HostListener, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isEthiopianLeapYear, toEthiopian, toGregorian } from './date-convertor';
import { DropdownComponent } from './custom-dropdown/custom-dropdown.component';
import { LucyDateComponent } from './lucy-date/lucy-date.component';

@Component({
  selector: 'lucy-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownComponent],
  templateUrl: './lucy-calendar.component.html',
  styleUrl: './lucy-calendar.component.css'
})
export class LucyCalendarComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['value'] && !changes['value'].firstChange) {
    //   this.value = changes['value'].currentValue;
    //   this.parseDate();
    //   // this.valueChange.emit(this.value);
    //   this.dateValue = toGregorian({ year: this.selectedYear, month: this.selectedMonth, day: this.selectedDay });
    //   this.emitChange();
    // }
    // else 
    if (changes['dateValue'] && !changes['dateValue'].firstChange && changes['dateValue'].currentValue?.getTime() !== this.dateValue?.getTime()) {
      this.dateValue = changes['dateValue'].currentValue;
      if (this.dateValue === null)
        return;
      const et = toEthiopian(this.dateValue);
      this.selectedYear = et.year;
      this.selectedMonth = et.month;
      this.selectedDay = et.day;
      // this.dateValueChange.emit(this.dateValue);
      // this.value = this.formatDate();
      this.emitChange();
    }
  }
  ngOnInit(): void {
    if (this.dateValue) {
      this.selectedYear = this.dateValue.getFullYear();
      this.selectedMonth = this.dateValue.getMonth();
      this.selectedDay = this.dateValue.getDate();
    }
    // if (this.value) {
    //   this.parseDate();
    // }
    // if (this.selectedDay !== 0) {
    //   this.selectDate(this.selectedDay);
    // } else {
    //   this.value = '';
    // }
    this.filteredMonths = this.availableMonths.filter(m => !this.isMonthOptionDisabled(m));
    this.filteredYears = this.availableYears.filter(y => !this.isYearOptionDisabled(y));
  }
  @Input() label: string = 'Select Date';
  // @Input() value: string | null = null; // New input for value
  @Output() valueChange: EventEmitter<string | null> = new EventEmitter<string | null>(); // Output event emitter for value
  @Input() dateValue: Date | null = null;
  @Output() dateValueChange: EventEmitter<Date | null> = new EventEmitter<Date | null>(); // Output event emitter for grValue

  @Input() placeholder: string | null = null;
  @Input() min: Date | null = null;
  @Input() max: Date | null = null;
  @Input() dateFormat: string = 'DD/MM/YYYY'; // New input for date format
  // @Input() disabled: boolean = false; // New input for disabled state
  // @Input() readonly: boolean = true; // New input for readonly state

  @Input() calendarVisible: boolean = false;

  currentDate: Date = new Date();
  selectedYear: number = toEthiopian(this.currentDate).year; // Start with 2015 (Ethiopian year 2008)
  selectedMonth: number = 1; // Start with Meskerem (January in Ethiopian calendar)
  selectedDay: number = 0;
  monthNames: string[] = [
    "መስከረም", "ጥቅምት", "ህዳር", "ታህሳስ", "ጥር", "የካቲት",
    "መጋቢት", "ሚይዚያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
  ];
  dayNames: string[] = ["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"];

  availableYears: number[] = Array.from({ length: 101 }, (_, i) => this.currentDate.getFullYear() - 50 + i);
  filteredYears = this.availableYears.filter(y => !this.isYearOptionDisabled(y));
  availableMonths = Array.from({ length: 13 }, (_, i) => i + 1);
  filteredMonths = this.availableMonths.filter(month => !this.isMonthOptionDisabled(month));


  refreshMonthOptions() {
    this.filteredMonths = this.availableMonths.filter(month => !this.isMonthOptionDisabled(month));
  };
  refreshYearOptions(): void {
    this.filteredYears = this.availableYears.filter(y => !this.isYearOptionDisabled(y));
  }

  emitChange() {
    this.dateValueChange.emit(this.dateValue); // Emit the new date value
    // this.valueChange.emit(this.value);
  }

  toggleCalendar() {
    this.calendarVisible = !this.calendarVisible;
    if (this.dateValue) {
      const et = toEthiopian(this.dateValue);
      this.selectedYear = et.year;
      this.selectedMonth = et.month;
      this.selectedDay = et.day;
    }
    // if (this.value) {
    //   this.parseDate();
    // }
  }

  monthDisplay = (month: number): string => this.monthNames[month - 1]; /* Month numbers are 1-indexed so adjust for array (0-indexed)*/

  selectMonthYear(month: number, year: number) {
    this.selectedMonth = month;
    this.selectedYear = year;
    this.dateValue = toGregorian({ year, month, day: 1 });
    // this.value = this.formatDate();
    this.emitChange();
  }

  onMonthChanges(month: number) {
    this.selectMonthYear(month, this.selectedYear);
    this.refreshYearOptions();
  }

  onYearChanges(year: number) {
    this.selectMonthYear(this.selectedMonth, year);
    this.refreshMonthOptions();
  }

  prevMonth() {
    this.selectedMonth = (this.selectedMonth - 1 + 13) % 13 || 13;
    this.dateValue = toGregorian({ year: this.selectedYear, month: this.selectedMonth, day: 1 });
    // this.value = this.formatDate();
    this.emitChange()
  }

  nextMonth() {
    this.selectedMonth = (this.selectedMonth + 1) % 13 || 13;
    this.dateValue = toGregorian({ year: this.selectedYear, month: this.selectedMonth, day: 1 });
    // this.value = this.formatDate();
    this.emitChange();
  }

  getLeadingEmptyDays(): any[] {
    const firstDay = toGregorian({ year: this.selectedYear, month: this.selectedMonth, day: 1 });
    return Array(firstDay.getDay()).fill(null);
  }

  get daysInMonth(): number[] {
    const daysInEthiopianMonth = this.selectedMonth === 13 ? (isEthiopianLeapYear(this.selectedYear) ? 6 : 5) : 30; // Pagumē has 6 days in a leap year
    return Array.from({ length: daysInEthiopianMonth }, (_, i) => i + 1);
  }

  selectDate(day: number) {
    this.selectedDay = day;
    this.dateValue = toGregorian({ year: this.selectedYear, month: this.selectedMonth, day: day });
    // this.value = this.formatDate();
    this.calendarVisible = false;
    this.emitChange();
  }

  clearDate() {
    // if (this.disabled) return; // Prevent clearing date if disabled
    this.dateValue = null;
    // this.value = null;
    this.selectedDay = 0;
    this.calendarVisible = false;
    this.emitChange();
  }

  selectToday() {
    const today = toEthiopian(new Date());
    this.selectedYear = today.year;
    this.selectedMonth = today.month;
    this.selectedDay = today.day;
    this.selectDate(today.day);
  }

  isDayDisabled(day: number): boolean {
    if (this.max === null)
      return false;
    const date = toGregorian({ year: this.selectedYear, month: this.selectedMonth, day: day });
    return date > this.max;
  }

  isNextMonthDisabled(): boolean {
    if (this.max === null)
      return false;
    const nextMonthDate = toGregorian({ year: this.selectedYear, month: this.selectedMonth + 1, day: 1 });
    return nextMonthDate > this.max;
  }

  isPrevMonthDisabled(): boolean {
    if (this.min === null)
      return false;
    const prevMonthDate = toGregorian({ year: this.selectedYear, month: this.selectedMonth - 1, day: 1 });
    return prevMonthDate < this.min;
  }

  isMonthOptionDisabled(monthIndex: number): boolean {
    const monthDate = toGregorian({ year: this.selectedYear, month: monthIndex, day: 1 });
    return (this.max !== null && (monthDate > this.max || (this.selectedYear === this.max.getFullYear() && monthIndex > this.max.getMonth())))
      || (this.min !== null && (monthDate < this.min || (this.selectedYear === this.min.getFullYear() && monthIndex < this.min.getMonth())));
  }

  isYearOptionDisabled(year: number): boolean {
    const yearDate = toGregorian({ year: year, month: 1, day: 1 });
    return (this.max !== null && yearDate > this.max) || (this.min !== null && yearDate < this.min);
  }

  formatDate(): string {
    const formattedMonth = this.padZero(this.selectedMonth);
    const formattedDay = this.padZero(this.selectedDay);
    return this.dateFormat
      .replace(/YYYY/i, this.selectedYear.toString())
      .replace(/MM/i, formattedMonth)
      .replace(/dd/i, formattedDay);
  }

  // parseDate() {
  //   if (!this.value || !this.dateFormat) return;

  //   // Detect separator from dateFormat (supports /, -, ., and others)
  //   const separator = this.dateFormat.match(/[^a-zA-Z0-9]/)?.[0] || '/';
  //   const dateParts = this.value.split(separator).map(Number);
  //   const formatParts = this.dateFormat.split(separator);

  //   if (dateParts.length !== formatParts.length) {
  //     console.error('Date format mismatch');
  //     return;
  //   }

  //   formatParts.forEach((part, index) => {
  //     const partType = part.toUpperCase()[0];
  //     switch (partType) {
  //       case 'Y':
  //         this.selectedYear = dateParts[index];
  //         break;
  //       case 'M':
  //         this.selectedMonth = dateParts[index];
  //         break;
  //       case 'D':
  //         this.selectedDay = dateParts[index];
  //         break;
  //     }
  //   });
  // }

  padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative') && !target.closest('lucy-calendar') && !target.classList.contains('calendar-icon') && !target.classList.contains('lucy-host')) {
      this.calendarVisible = false;
    }
  }
}
