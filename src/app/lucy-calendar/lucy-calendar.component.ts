import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isEthiopianLeapYear, toEthiopian, toGregorian } from '../../types/date-convertor';

@Component({
  selector: 'app-lucy-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lucy-calendar.component.html',
  styleUrl: './lucy-calendar.component.css'
})
export class LucyCalendarComponent implements OnInit {
  ngOnInit(): void {
    if (this.selectedDate) {
      this.selectedYear = this.selectedDate.getFullYear();
      this.selectedMonth = this.selectedDate.getMonth();
      this.selectedDay = this.selectedDate.getDay();
    }
    if (this.selectedDay !== 0) {
      this.selectDate(this.selectedDay);
    }
  }
  @Input() label: string = 'Select Date';
  @Input() value: Date = new Date();
  @Input() placeholder: string = 'DD/MM/YYYY';
  @Input() min: Date = new Date();
  @Input() max: Date = new Date();


  calendarVisible: boolean = false;
  monthYearSelectionVisible: boolean = true;
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

  availableYears: number[] = Array.from({ length: 101 }, (_, i) => this.currentDate.getFullYear() - 50 + i)
    .filter(year => year <= toEthiopian(this.max).year);

  toggleCalendar() {
    this.calendarVisible = !this.calendarVisible;
    if (this.selectedDate) {
      const et = toEthiopian(this.selectedDate);
      this.selectedYear = et.year;
      this.selectedMonth = et.month;
      this.selectedDay = et.day;
    }
  }

  toggleMonthYearSelection() {
    this.monthYearSelectionVisible = !this.monthYearSelectionVisible;
  }

  selectMonthYear(month: number, year: number) {
    this.selectedMonth = month;
    this.selectedYear = year;
    this.currentDate = toGregorian({ year, month, day: 1 });
    // this.monthYearSelectionVisible = false;
    // this.dropdownVisible = false;
  }

  onMonthChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const month = parseInt(target.value, 10);
    this.selectMonthYear(month, this.selectedYear);
  }

  onYearChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const year = parseInt(target.value, 10);
    this.selectMonthYear(this.selectedMonth, year);
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
    console.log('firstDay', firstDay.getDay());
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
    const date = toGregorian({ year: this.selectedYear, month: this.selectedMonth, day: day });
    if (date > this.max) {
      console.log(date);
    }
    return date > this.max;
  }

  isNextMonthDisabled(): boolean {
    const nextMonthDate = toGregorian({ year: this.selectedYear, month: this.selectedMonth + 1, day: 1 });
    return nextMonthDate > this.max;
  }

  isMonthDisabled(): boolean {
    const monthDate = toGregorian({ year: this.selectedYear, month: this.selectedMonth, day: 1 });
    return monthDate > this.max || (this.selectedYear === this.max.getFullYear() && this.selectedMonth > this.max.getMonth() + 1);
  }

  isYearDisabled(): boolean {
    const yearDate = toGregorian({ year: this.selectedYear, month: 1, day: 1 });
    return yearDate > this.max;
  }

  isMonthOptionDisabled(monthIndex: number): boolean {
    const monthDate = toGregorian({ year: this.selectedYear, month: monthIndex + 1, day: 1 });
    if (monthIndex === 6) {
      const dis = monthDate > this.max;
      console.log(dis);
    }
    return monthDate > this.max || (this.selectedYear === this.max.getFullYear() && monthIndex > this.max.getMonth());
  }

  isYearOptionDisabled(year: number): boolean {
    const yearDate = toGregorian({ year: year, month: 1, day: 1 });
    return yearDate > this.max;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.calendarVisible = false;
    }
  }
}
