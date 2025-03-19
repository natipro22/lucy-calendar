import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isEthiopianLeapYear, toEthiopian, toGregorian } from './date-convertor';
import { DropdownComponent } from './custom-dropdown/custom-dropdown.component';

@Component({
  selector: 'lucy-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownComponent],
  templateUrl: './lucy-calendar.component.html',
  styleUrl: './lucy-calendar.component.css'
})
export class LucyCalendarComponent implements OnInit {
  ngOnInit(): void {
    if (this.grValue) {
      this.selectedYear = this.grValue.getFullYear();
      this.selectedMonth = this.grValue.getMonth();
      this.selectedDay = this.grValue.getDate();
    }
    // else {
    //   const today = toEthiopian(this.grValue);
    //   this.selectedYear = today.year;
    //   this.selectedMonth = today.month;
    //   this.selectedDay = today.day;
    // }
    if (this.selectedDay !== 0) {
      this.selectDate(this.selectedDay);
    }
    this.filteredMonths = this.availableMonths.filter(m => !this.isMonthOptionDisabled(m));
    this.filteredYears = this.availableYears.filter(y => !this.isYearOptionDisabled(y));
  }
  @Input() label: string = 'Select Date';
  @Input() grValue: Date | null = new Date();
  @Output() grValueChange: EventEmitter<Date | null> = new EventEmitter<Date | null>(); // Output event emitter for grValue

  @Input() placeholder: string = 'DD/MM/YYYY';
  @Input() min: Date | null = null;
  @Input() max: Date | null = null;
  @Input() dateFormat: string = 'YYYY/MM/dd'; // New input for date format
  @Input() disabled: boolean = false; // New input for disabled state
  @Input() readonly: boolean = true; // New input for readonly state

  calendarVisible: boolean = false;
  currentDate: Date = new Date();
  // grValue: Date | null = null;
  selectedDateEt: string | null = null;
  selectedYear: number = toEthiopian(this.currentDate).year;
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

  toggleCalendar() {
    // if (this.disabled) return; // Prevent toggling if disabled
    this.calendarVisible = !this.calendarVisible;
    if (this.grValue) {
      const et = toEthiopian(this.grValue);
      this.selectedYear = et.year;
      this.selectedMonth = et.month;
      this.selectedDay = et.day;
    }
  }

  monthDisplay = (month: number): string => this.monthNames[month - 1]; /* Month numbers are 1-indexed so adjust for array (0-indexed)*/

  selectMonthYear(month: number, year: number) {
    this.selectedMonth = month;
    this.selectedYear = year;
    this.currentDate = toGregorian({ year, month, day: 1 });
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
    this.currentDate = toGregorian({ year: this.selectedYear, month: this.selectedMonth, day: 1 });

  }

  nextMonth() {
    this.selectedMonth = (this.selectedMonth + 1) % 13 || 13;
    this.currentDate = toGregorian({ year: this.selectedYear, month: this.selectedMonth, day: 1 });
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
    // if (this.disabled) return; // Prevent selecting date if disabled
    this.selectedDay = day;
    this.grValue = toGregorian({ year: this.selectedYear, month: this.selectedMonth, day: day });
    this.selectedDateEt = `${this.selectedYear}/${this.padZero(this.selectedMonth)}/${this.padZero(day)}`;
    this.calendarVisible = false;
    this.grValueChange.emit(this.grValue); // Emit the new value
  }

  clearDate() {
    // if (this.disabled) return; // Prevent clearing date if disabled
    this.grValue = null;
    this.selectedDateEt = null;
    this.selectedDay = 0;
    this.calendarVisible = false;
    this.grValueChange.emit(this.grValue); // Emit the new value
  }

  selectToday() {
    const today = toEthiopian(new Date());
    this.selectedYear = today.year;
    this.selectedMonth = today.month;
    this.selectedDay = today.day;
    this.selectDate(today.day);
    this.grValueChange.emit(this.grValue); // Emit the new value
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

  padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.calendarVisible = false;
    }
  }
}
