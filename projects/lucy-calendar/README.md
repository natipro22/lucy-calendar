# LucyCalendar

LucyCalendar is a powerful and flexible date picker library for Angular applications, specifically designed for Ethiopian dates. It provides a user-friendly interface for selecting dates and supports various customization options to fit your needs.

## Features

- **Easy integration**: Seamlessly integrate LucyCalendar into your Angular applications with minimal setup.
- **Customizable Ethiopian date formats**: Display dates in various Ethiopian date formats to suit your application's requirements.
- **Support for Ethiopian date ranges**: Easily select and manage date ranges within the Ethiopian calendar.

## Installation

To install LucyCalendar, run the following command:

```sh
npm install lucy-calendar
```

## Usage

Import the LucyCalendar component into your Angular application:

```typescript
import { Component } from '@angular/core';
import { LucyCalendarComponent } from 'lucy-calendar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LucyDateComponent, LucyCalendarDirective],
  template: `
    <lucy-date label="Event date" placeholder="Enter date" dateFormat="dd/mm/yyyy" [max]="today" [min]="min"
      [readonly]="false" [default]="min"></lucy-date>
    <lucy-date label="Birth date" placeholder="Enter Birth date"></lucy-date>

    // or 
    <input lucyCalendar readonly [max]="today" [min]="min" />
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  today: Date = new Date();
  min: Date = new Date(2025, 0, 1);
}
```

