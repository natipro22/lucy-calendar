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
  @Input() selected!: T; // Selected value
  @Output() selectedChange = new EventEmitter<T>(); // Event when selection changes

  /**
   * Optional function to convert an option to a displayable string.
   */
  @Input() displayFn?: (option: T) => string;

  dropdownOpen: boolean = false;

  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    if (!this.selected && this.options.length > 0) {
      this.selected = this.options[0]; // Default to first option if no selection
    }
    // Scroll to the selected option if it exists
    setTimeout(() => {
      if (this.selected) {
        const selectedIndex = this.options.indexOf(this.selected);
        if (selectedIndex >= 0) {
          const dropdownElement = this.dropdownContainer.nativeElement;
          const selectedElement = dropdownElement.children[selectedIndex];
          if (selectedElement) {
            selectedElement.scrollIntoView({ block: 'nearest' });
          }
        }
      }
    });
  }

  toggleDropdown(event: Event): void {
    console.log('Dropdown clicked. Selected item:', this.selected);
    this.dropdownOpen = !this.dropdownOpen;

    if (this.dropdownOpen && this.selected) {
      setTimeout(() => {
        const selectedIndex = this.options.indexOf(this.selected);
        if (selectedIndex >= 0) {
          const dropdownElement = this.dropdownContainer.nativeElement.querySelector('ul');
          const showedItems = 6;
          const selectedElement = dropdownElement.children[selectedIndex];
          if (selectedElement) {
            selectedElement.scrollIntoView({ block: 'nearest' });
          }
        }
      });
    }
  }

  onOptionClick(option: T, index: number): void {
    this.selected = option;
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
