import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LucyCalendarComponent } from "../../projects/lucy-calendar/src/lib/lucy-calendar.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { dayNames, monthNames, toEthiopian } from '../../projects/lucy-calendar/src/lib/date-convertor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LucyCalendarComponent, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'myapp';
  date: Date | null = null;
  lucyDate: string | null = null;
  etDate: string = '';
  grDate: string = '';
  availableYears: number[] = Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - 50 + i);

  onDateChange(value: string | Date | null) {
    if (typeof value === 'string') {
      this.date = new Date(value);
      this.etDate = value;
    }
    else if (value instanceof Date) {
      this.date = value;
      this.grDate = value.toISOString().split('T')[0];
    }
    if (!this.date) {
      return;
    }
    const dateEt = toEthiopian(this.date); // Call the conversion function
    this.etDate = `${dayNames[this.date.getDay()]}, ${monthNames[dateEt.month - 1]} ${this.padZero(dateEt.day)} ${dateEt.year}`;
  }

  padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }

}
