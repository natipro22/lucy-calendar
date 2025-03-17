import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LucyCalendarComponent } from "./lucy-calendar/lucy-calendar.component";
import { DropdownComponent } from './custom-dropdown/custom-dropdown.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LucyCalendarComponent, DropdownComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'myapp';
  selectedYear: number = 2017;
  today: Date = new Date();
  min: Date = new Date(2025, 0, 1);
  availableYears: number[] = Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - 50 + i);

}
