import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { LucyCalendarComponent } from '../lucy-calendar.component';
import { FormsModule } from '@angular/forms';
import { toEthiopian } from '../date-convertor';

@Component({
    selector: 'lucy-date',
    standalone: true,
    imports: [CommonModule, LucyCalendarComponent, FormsModule],
    templateUrl: './lucy-date.component.html',
    styleUrls: ['./lucy-date.component.css']
})
export class LucyDateComponent implements OnChanges {
    @Input() label: string = '';
    @Input() placeholder: string | null = null;
    @Input() dateFormat: string = 'DD/MM/YYYY';
    @Input() selectedDay: number = 0;
    @Input() selectedYear: number = 0;
    @Input() selectedMonth: number = 0;
    @Input() readonly: boolean = true;
    @Input() disabled: boolean = false;
    @Input() value: string | null = null;
    @Output() valueChange: EventEmitter<string | null> = new EventEmitter<string | null>();
    @Input() dateValue: Date | null = new Date();
    @Output() dateValueChange: EventEmitter<Date | null> = new EventEmitter<Date | null>();

    showCalendar: boolean = false;
    toggleCalendar() {
        this.showCalendar = !this.showCalendar;
    }

    dateChange(date: Date | null) {
        if (date === null) return;
        const et = toEthiopian(date);
        this.valueChange.emit(this.formatDate(et.year, et.month, et.day));
        this.dateValueChange.emit(date);
    }

    formatDate(year: number, month: number, day: number): string {
        const formattedMonth = this.padZero(month);
        const formattedDay = this.padZero(day);
        return this.dateFormat
            .replace(/YYYY/i, year.toString())
            .replace(/MM/i, formattedMonth)
            .replace(/dd/i, formattedDay);
    }
    padZero(num: number): string {
        return num.toString().padStart(2, '0');
    }


    ngOnChanges(changes: SimpleChanges) {
        if (changes['dateValue']) {
            this.dateValue = changes['dateValue'].currentValue;
        }
    }


}
