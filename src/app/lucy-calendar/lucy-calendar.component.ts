import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isEthiopianLeapYear, toEthiopian, toGregorian } from '../../types/date-convertor';
import { DropdownComponent } from '../custom-dropdown/custom-dropdown.component';

@Component({
  selector: 'app-lucy-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownComponent],
  templateUrl: './lucy-calendar.component.html',
  styleUrl: './lucy-calendar.component.css'
})
export class LucyCalendarComponent implements OnInit {
  ngOnInit(): void {
    if (this.selectedDate) {
      this.selectedYear = this.selectedDate.getFullYear();
      this.selectedMonth = this.selectedDate.getMonth();
      this.selectedDay = this.selectedDate.getDate();
    }
    else {
      const today = toEthiopian(this.default);
      this.selectedYear = today.year;
      this.selectedMonth = today.month;
      this.selectedDay = today.day;
    }
    if (this.selectedDay !== 0) {
      this.selectDate(this.selectedDay);
    }
    this.filteredMonths = this.availableMonths.filter(m => !this.isMonthOptionDisabled(m));
    this.filteredYears = this.availableYears.filter(y => !this.isYearOptionDisabled(y));
  }
  @Input() label: string = 'Select Date';
  @Input() default: Date = new Date();
  @Input() placeholder: string = 'DD/MM/YYYY';
  @Input() min: Date | null = null;
  @Input() max: Date | null = null;
  @Input() dateFormat: string = 'YYYY/MM/dd'; // New input for date format

  calendarVisible: boolean = false;
  currentDate: Date = new Date();
  selectedDate: Date | null = null;
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
    this.calendarVisible = !this.calendarVisible;
    if (this.selectedDate) {
      const et = toEthiopian(this.selectedDate);
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
    this.selectedDay = day;
    this.selectedDate = toGregorian({ year: this.selectedYear, month: this.selectedMonth, day: day });
    this.selectedDateEt = `${this.selectedYear}/${this.selectedMonth.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
    this.calendarVisible = false;
  }

  clearDate() {
    this.selectedDate = null;
    this.selectedDateEt = null;
    this.selectedDay = 0;
    this.calendarVisible = false;
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
    const formattedMonth = ('0' + this.selectedMonth).slice(-2);
    const formattedDay = ('0' + this.selectedDay).slice(-2);
    return this.dateFormat
      .replace(/YYYY/i, this.selectedYear.toString())
      .replace(/MM/i, formattedMonth)
      .replace(/dd/i, formattedDay);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.calendarVisible = false;
    }
  }
}
