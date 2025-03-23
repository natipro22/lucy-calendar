import {
    Directive, ElementRef, HostListener, Input, ViewContainerRef,
    ComponentRef, Output, EventEmitter, Renderer2, OnInit, OnDestroy,
    SimpleChanges,
    OnChanges
} from '@angular/core';
import { LucyCalendarComponent } from './lucy-calendar.component';

@Directive({
    selector: '[lucyCalendar]',
    standalone: true,
})
export class LucyCalendarDirective implements OnInit, OnChanges, OnDestroy {
    @Input() label: string = 'Select Date';
    @Input() value: string | null = null;
    @Output() valueChange: EventEmitter<string | null> = new EventEmitter<string | null>();
    @Input() dateValue: Date | null = null;
    @Output() dateValueChange: EventEmitter<Date | null> = new EventEmitter<Date | null>();
    @Input() placeholder: string | null = null;
    @Input() min: Date | null = null;
    @Input() max: Date | null = null;
    @Input() dateFormat: string = 'dd/mm/yyyy';
    // @Input() disabled: boolean = false;
    // @Input() readonly: boolean = true;

    private componentRef: ComponentRef<LucyCalendarComponent>;
    private isCalendarOpen = false; // Track open/closed state
    private calendarElement: HTMLElement | null = null;

    constructor(
        private el: ElementRef,
        private viewContainerRef: ViewContainerRef,
        private renderer: Renderer2
    ) {
        this.componentRef = this.viewContainerRef.createComponent(LucyCalendarComponent);
        this.calendarElement = this.componentRef.location.nativeElement;
    }

    // Open/close on input click
    @HostListener('click') onClick() {
        this.componentRef.instance.toggleCalendar();
    }

    // Close when clicking outside the input or calendar
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const clickedInsideInput = this.el.nativeElement.contains(target);
        const clickedInsideCalendar = this.calendarElement?.contains(target);

        if (!clickedInsideInput && !clickedInsideCalendar && this.isCalendarOpen) {
            this.closeCalendar();
        }
    }

    ngOnInit() {

        // Create the button element
        const button = this.renderer.createElement('button');
        // this.renderer.setAttribute(button, 'type', 'button');
        if (this.el.nativeElement.disabled) {
            this.renderer.setAttribute(button, 'disabled', 'true');
        }
        if (this.el.nativeElement.readonly) {
            this.renderer.setAttribute(button, 'readonly', 'true');
        }
        this.renderer.setAttribute(button, 'class', 'absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300');

        // Create the SVG element
        const svg = this.renderer.createElement('svg', 'svg');
        this.renderer.setAttribute(svg, 'xmlns', 'http://www.w3.org/2000/svg');
        this.renderer.setAttribute(svg, 'fill', 'none');
        this.renderer.setAttribute(svg, 'viewBox', '0 0 24 24');
        this.renderer.setAttribute(svg, 'stroke-width', '1.5');
        this.renderer.setAttribute(svg, 'stroke', 'currentColor');
        this.renderer.setAttribute(svg, 'class', 'h-6 w-6 text-gray-500 hover:text-gray-700 calendar-icon');
        // set the SVG attributes
        const path = this.renderer.createElement('path', 'svg');
        this.renderer.setAttribute(path, 'class', 'calendar-icon');
        this.renderer.setAttribute(path, 'stroke-linecap', 'round');
        this.renderer.setAttribute(path, 'stroke-linejoin', 'round');
        this.renderer.setAttribute(path, 'd', 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z');

        // Append the path to the SVG
        this.renderer.appendChild(svg, path);
        // Append the SVG to the button
        this.renderer.appendChild(button, svg);


        // append class to the host element
        this.renderer.addClass(this.el.nativeElement, 'block');
        this.renderer.addClass(this.el.nativeElement, 'lucy-host');

        const parentDiv = this.renderer.createElement('div');
        this.renderer.addClass(parentDiv, 'relative');
        const computedWidth = window.getComputedStyle(this.el.nativeElement).width;
        this.renderer.setStyle(parentDiv, 'width', computedWidth);

        const parent = this.renderer.parentNode(this.el.nativeElement);
        this.renderer.insertBefore(parent, parentDiv, this.el.nativeElement);
        this.renderer.appendChild(parentDiv, this.el.nativeElement);
        this.renderer.appendChild(parentDiv, button);

        this.renderer.appendChild(this.el.nativeElement.parentElement, this.calendarElement);

        this.renderer.listen(button, 'click', () => {
            this.componentRef!.instance.toggleCalendar();
            this.renderer.appendChild(this.el.nativeElement.parentElement, this.calendarElement);
        });
        this.openCalendar();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['dateValue'] && !changes['dateValue'].firstChange) {
            this.componentRef.instance.ngOnChanges(changes);
        }
    }

    ngOnDestroy() {
        this.closeCalendar();
    }

    private openCalendar() {

        // Pass inputs to the calendar component
        // this.componentRef.instance.label = this.label;
        // this.componentRef.instance.value = this.value;
        this.componentRef.instance.dateValue = this.dateValue;
        this.componentRef.instance.placeholder = this.placeholder;
        this.componentRef.instance.min = this.min;
        this.componentRef.instance.max = this.max;
        this.componentRef.instance.dateFormat = this.dateFormat;

        // Handle outputs
        // this.componentRef.instance.valueChange.subscribe((value: string | null) => {
        //     this.renderer.setProperty(this.el.nativeElement, 'value', value ?? this.placeholder ?? this.dateFormat);
        //     if (value === this.value) return
        //     this.valueChange.emit(value);
        // });
        this.componentRef.instance.dateValueChange.subscribe((date: Date | null) => {
            // setTimeout(() => {
            //     this.value = this.componentRef.instance.formatDate();
            // });
            const et = date !== null ? this.componentRef.instance.formatDate() : null;
            this.renderer.setProperty(this.el.nativeElement, 'value', et ?? this.placeholder ?? this.dateFormat);
            // this.valueChange.emit(this.value);
            this.dateValueChange.emit(date);
            this.valueChange.emit(et);
        });
        this.componentRef.instance.emitChange();

        // Append to the input's parent (not document.body)
        this.renderer.appendChild(this.el.nativeElement.parentElement, this.calendarElement);
        // }
    }

    private closeCalendar() {
        this.componentRef.destroy();
    }
}
