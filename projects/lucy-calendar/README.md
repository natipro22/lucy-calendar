# LucyCalendar

LucyCalendar is a powerful and flexible date picker library for Angular applications, specifically designed for Ethiopian dates. It provides a user-friendly interface for selecting dates and supports various customization options to fit your needs.

## Features

- **Easy integration**: Seamlessly integrate LucyCalendar into your Angular applications with minimal setup.
- **Customizable Ethiopian date formats**: Display dates in various Ethiopian date formats to suit your application's requirements.
- **Support for Ethiopian date ranges**: Easily select and manage date ranges within the Ethiopian calendar.
- **Localization support**: Localize the date picker to support different languages and regions.
- **Theming options**: Customize the appearance of the date picker to match your application's theme.

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
  imports: [LucyCalendarComponent],
  template: `
    <lucy-calendar label="Event date" placeholder="Enter date" dateFormat="dd/mm/yyyy" [max]="today" [min]="min"
      [readonly]="false" [default]="min"></lucy-calendar>
    <lucy-calendar label="Birth date" placeholder="Enter Birth date"></lucy-calendar>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  today: Date = new Date();
  min: Date = new Date(2025, 0, 1);
}
```

## Code scaffolding

Run `ng generate component component-name --project lucy-calendar` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project lucy-calendar`.
> Note: Don't forget to add `--project lucy-calendar` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build lucy-calendar` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build lucy-calendar`, go to the dist folder `cd dist/lucy-calendar` and run `npm publish`.

## Running unit tests

Run `ng test lucy-calendar` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
