import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, output, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  templateUrl: './custom-dropdown.component.html',
  imports: [CommonModule],
  styleUrls: ['./custom-dropdown.component.css']
})
export class DropdownComponent<T> implements OnInit {
  @Input() options: T[] = []; // List of dropdown options
  // @Output() optionsChange = new EventEmitter<T[]>(); // List of dropdown options
  @Input() selected!: T; // Selected value
  @Output() selectedChange = new EventEmitter<T>(); // Event when selection changes
  filteredOptions: T[] = [];
  /**
   * Optional function to convert an option to a displayable string.
   */
  @Input() displayFn?: (option: T) => string;

  @Input() filterFn: (options: T[]) => T[] = (options) => [...options]; // Default: return all options

  applyFilter(): void {
    if (this.filterFn) {
      this.filteredOptions = this.filterFn(this.options);
    } else {
      this.filteredOptions = this.options.filter(option =>
        this.displayFn ? this.displayFn(option) : option
      );
    }
  }

  /**
   * Optional function to determine if an option should be disabled.
   * If provided, it receives the option (and its index) and should return true if disabled.
   */
  @Input() isOptionDisabled?: (option: T, index?: number) => boolean;

  dropdownOpen: boolean = false;

  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    if (!this.selected && this.options.length > 0) {
      this.selected = this.options[0]; // Default to first option if no selection
    }
  }

  toggleDropdown(event: Event): void {
    // Stop propagation so that the document click listener doesn't immediately close the dropdown.
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }
  getOptionClasses(option: T, index: number): string {
    const disabled = this.isOptionDisabled ? this.isOptionDisabled(option, index) : false;
    return `px-4 py-2 ${disabled ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer hover:bg-gray-100'}`;
  }
  onOptionClick(option: T, index: number): void {
    if (this.isOptionDisabled && this.isOptionDisabled(option, index)) {
      return; // Option is disabled—do nothing.
    }
    this.selected = option;
    this.selectedChange.emit(option);
    this.dropdownOpen = false;
  }



  selectOption(option: T): void {
    this.selected = option;
    // this.optionsChange.emit(this.options);
    this.selectedChange.emit(option);
    this.dropdownOpen = false;
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.dropdownContainer && !this.dropdownContainer.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }
}
