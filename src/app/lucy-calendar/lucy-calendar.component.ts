import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toEthiopian, toGregorian } from '../../types/date-convertor';

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


  calendarVisible: boolean = false;
  monthYearSelectionVisible: boolean = true;
  dropdownVisible: boolean = true;
  currentDate: Date = new Date();
  selectedDate: Date | null = null;
  selectedYear: number = toEthiopian(this.currentDate)[0];
  selectedMonth: number = 0; // Start with Meskerem (January in Ethiopian calendar)
  monthNames: string[] = [
    "መስከረም", "ጥቅምት", "ህዳር", "ታህሳስ", "ጥር", "የካቲት",
    "መጋቢት", "ሚይዚያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
  ];
  dayNames: string[] = ["እሁድ", "ሰኞ", "ማክሰኞ ", " ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"];

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
    this.selectedMonth = (this.selectedMonth - 1 + 13) % 13;
    this.currentDate = toGregorian({ year: this.selectedYear, month: this.selectedMonth, day: 1 });

  }

  nextMonth() {
    // console.log(this.selectedMonth);
    this.selectedMonth = (this.selectedMonth + 1) % 13;
    console.log('month', this.selectedMonth);
    this.currentDate = toGregorian({ year: this.selectedYear, month: this.selectedMonth + 1, day: 1 });
    console.log('current date', this.currentDate);

  }

  getLeadingEmptyDays(): any[] {
    // console.log(this.selectedYear, this.selectedMonth);
    const firstDay = toGregorian({ year: this.selectedYear, month: this.selectedMonth + 1, day: 1 });
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
    this.selectedDate = toGregorian({ year: this.selectedYear, month: this.selectedMonth, day: day });
    this.calendarVisible = false;
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
}
