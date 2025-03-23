import { Directive, ElementRef, Renderer2, OnInit, ComponentRef, ViewContainerRef, ChangeDetectorRef, NgModuleRef, EventEmitter, Output, Input, SimpleChanges, OnChanges } from '@angular/core';
import { LucyCalendarComponent } from './lucy-calendar.component';
import { CommonModule } from '@angular/common';

@Directive({
    selector: '[lucyIcon]',
    standalone: true,
})
export class LucyIconDirective implements OnInit, OnChanges {
    @Input() value: string | null = null;
    @Input() dateValue: Date | null = null;
    @Output() valueChange: EventEmitter<string | null> = new EventEmitter<string | null>();
    @Output() dateValueChange: EventEmitter<Date | null> = new EventEmitter<Date | null>();
    private componentRef: ComponentRef<LucyCalendarComponent> | null = null;
    private calendarElement: HTMLElement | null = null;

    constructor(private el: ElementRef, private renderer: Renderer2, private viewContainerRef: ViewContainerRef) {
        // Create the component reference
        this.componentRef = this.viewContainerRef.createComponent(LucyCalendarComponent);
        this.calendarElement = this.componentRef.location.nativeElement;
    }

    ngOnInit() {
        const button = this.renderer.createElement('button');
        // this.renderer.setAttribute(button, 'type', 'button');
        if (this.el.nativeElement.disabled) {
            this.renderer.setAttribute(button, 'disabled', 'true');
        }
        if (this.el.nativeElement.readonly) {
            this.renderer.setAttribute(button, 'readonly', 'true');
        }
        this.renderer.addClass(button, 'absolute');
        this.renderer.addClass(button, 'inset-y-0');
        this.renderer.addClass(button, 'right-0');
        this.renderer.addClass(button, 'flex');
        this.renderer.addClass(button, 'items-center');
        this.renderer.addClass(button, 'pr-3');
        this.renderer.addClass(button, 'cursor-pointer');

        // this.renderer.addClass(this.el.nativeElement, 'w-full');

        this.renderer.addClass(button, 'disabled:cursor-not-allowed');
        this.renderer.addClass(button, 'disabled:text-gray-300');
        const svg = this.renderer.createElement('svg', 'svg');
        this.renderer.setAttribute(svg, 'xmlns', 'http://www.w3.org/2000/svg');
        this.renderer.setAttribute(svg, 'fill', 'none');
        this.renderer.setAttribute(svg, 'viewBox', '0 0 24 24');
        this.renderer.setAttribute(svg, 'stroke-width', '1.5');
        this.renderer.setAttribute(svg, 'stroke', 'currentColor');
        this.renderer.setAttribute(svg, 'class', 'h-6 w-6 text-gray-500 hover:text-gray-700 calendar-icon');
        const path = this.renderer.createElement('path', 'svg');
        this.renderer.setAttribute(path, 'class', 'calendar-icon');
        this.renderer.setAttribute(path, 'stroke-linecap', 'round');
        this.renderer.setAttribute(path, 'stroke-linejoin', 'round');
        this.renderer.setAttribute(path, 'd', 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z');
        this.renderer.appendChild(svg, path);
        this.renderer.appendChild(button, svg);


        const parentDiv = this.renderer.createElement('div');
        const computedWidth = window.getComputedStyle(this.el.nativeElement).width;
        this.renderer.setStyle(parentDiv, 'width', computedWidth);

        this.renderer.addClass(parentDiv, 'relative');
        this.renderer.addClass(this.el.nativeElement, 'block');
        const parent = this.renderer.parentNode(this.el.nativeElement);
        this.renderer.insertBefore(parent, parentDiv, this.el.nativeElement);
        this.renderer.appendChild(parentDiv, this.el.nativeElement);
        this.renderer.appendChild(parentDiv, button);
        this.renderer.listen(button, 'click', () => {
            this.componentRef!.instance.toggleCalendar();
            this.renderer.appendChild(this.el.nativeElement.parentElement, this.calendarElement);
        });
        this.renderer.listen(this.el.nativeElement, 'click', () => {
            this.componentRef!.instance.toggleCalendar();
        });

        // Handle outputs
        this.componentRef!.instance.valueChange.subscribe((value: string | null) => {
            // console.log(this.value);
            // this.el.nativeElement.value = this.value = value;//  bad
            this.valueChange.emit(value);
        });
        this.componentRef!.instance.dateValueChange.subscribe((date: Date | null) => {
            this.dateValueChange.emit(date);
        });

        // Append to the input's parent (not document.body)
        this.renderer.addClass(this.el.nativeElement, 'lucy-host');
        this.renderer.appendChild(this.el.nativeElement.parentElement, this.calendarElement);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['value']) {
            this.renderer.setProperty(this.el.nativeElement, 'value', this.value);
        }
    }
}
