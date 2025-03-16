import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomDateConverter } from '../../types/ethiopian-date';
import { EthioDate } from '../../types/date-convertor';
// // Helper functions for Ethiopian calendar (simplified)
// function gregorianToEthiopian(date: Date): { year: number, month: number, day: number } {
//   // Conversion logic here
//   // This is a placeholder; actual conversion logic needs to be implemented
//   return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
// }

// function ethiopianToGregorian(year: number, month: number, day: number): Date {
//   // Conversion logic here
//   // This is a placeholder; actual conversion logic needs to be implemented
//   let date = new Date(year, month, day);
//   return date;
// }

// const ethiopianDate = new CustomDateConverter();
@Component({
  selector: 'app-lucy-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lucy-calendar.component.html',
  styleUrl: './lucy-calendar.component.css'
})
export class LucyCalendarComponent {
  @Input() label: string = 'Select Date';
  @Input() value: Date = new Date();
  @Input() placeholder: string = 'DD/MM/YYYY';
  @Input() min: Date = new Date();
  @Input() max: Date = new Date();

  /**
   *
   */
  constructor(private custom: CustomDateConverter, private ethiopianDate: EthioDate) {
    this.selectedYear = this.ethiopianDate.toEthiopian(this.currentDate)[0];
  }

  calendarVisible: boolean = false;
  monthYearSelectionVisible: boolean = true;
  dropdownVisible: boolean = true;
  currentDate: Date = new Date();
  selectedDate: Date | null = null;
  selectedYear: number;
  selectedMonth: number = 0; // Start with Meskerem (January in Ethiopian calendar)
  monthNames: string[] = [
    "መስከረም", "ጥቅምት", "ህዳር", "ታህሳስ", "ጥር", "የካቲት",
    "መጋቢት", "ሚይዚያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
  ];
  dayNames: string[] = ["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"];

  availableYears: number[] = Array.from({ length: 101 }, (_, i) => this.currentDate.getFullYear() - 50 + i);

  toggleCalendar() {
    this.calendarVisible = !this.calendarVisible;
  }

  toggleMonthYearSelection() {
    this.monthYearSelectionVisible = !this.monthYearSelectionVisible;
    this.toggleDropdown();
  }

  selectMonthYear(month: number, year: number) {
    this.selectedMonth = month;
    this.selectedYear = year;
    this.currentDate = this.ethiopianDate.toGregorian({ year, month, day: 1 });
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
    this.selectedMonth = (this.selectedMonth - 1 + 13) % 13;
    this.currentDate = this.ethiopianDate.toGregorian({ year: this.selectedYear, month: this.selectedMonth, day: 1 });

  }

  nextMonth() {
    // console.log(this.selectedMonth);
    this.selectedMonth = (this.selectedMonth + 1) % 13;
    console.log('month', this.selectedMonth);
    this.currentDate = this.ethiopianDate.toGregorian({ year: this.selectedYear, month: this.selectedMonth + 1, day: 1 });
    console.log('current date', this.currentDate);

  }

  getLeadingEmptyDays(): any[] {
    // console.log(this.selectedYear, this.selectedMonth);
    const firstDay = this.ethiopianDate.toGregorian({ year: this.selectedYear, month: this.selectedMonth + 1, day: 1 });
    console.log('firstDay', firstDay.getDay());
    return Array(firstDay.getDay()).fill(null);
  }

  get daysInMonth(): number[] {
    const days = [];
    const daysInEthiopianMonth = this.selectedMonth === 12 ? 6 : 30; // Pagumē has 6 days in a leap year
    for (let i = 1; i <= daysInEthiopianMonth; i++) {
      days.push(i);
    }
    return days;
  }

  selectDate(day: number) {
    this.selectedDate = this.ethiopianDate.toGregorian({ year: this.selectedYear, month: this.selectedMonth, day: day });
    this.calendarVisible = false;
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
}
