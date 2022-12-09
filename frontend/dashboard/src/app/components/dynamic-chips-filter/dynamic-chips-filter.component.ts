import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';



@Component({
  selector: 'dynamic-chips-filter',
  templateUrl: './dynamic-chips-filter.component.html',
  styleUrls: ['./dynamic-chips-filter.component.scss']
})
export class DynamicChipsFilterComponent implements OnInit {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() strictOptions: boolean = false;
  @Input() selection: string[] = [];
  @Input() options: string[] = [];
  @Input() unique: boolean = false;

  @Output() onOptionChange = new EventEmitter<string[]>();

  separatorKeysCodes: number[] = [ENTER, COMMA];

  formCtrl = new FormControl('');
  filteredOptions: Observable<string[]>;

  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  constructor() {
    this.filteredOptions = this.formCtrl.valueChanges.pipe(
      startWith(null),
      map((option: string | null) => this._filter(option)),
    );
  }

  ngOnInit(): void {
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (!value || (this.strictOptions && !this.options.includes(value)) || this.selection.includes(value)) {
      return;
    }

    if(this.unique) {
      this.selection = [];
    }
    this.selection.push(value);
    event.chipInput!.clear();
    this.formCtrl.setValue(null);
    this.onOptionChange.emit(this.selection);
  }

  remove(option: string): void {
    const index = this.selection.indexOf(option);
    if (index >= 0) {
      this.selection.splice(index, 1);
    }
    this.formCtrl.setValue(null);
    this.onOptionChange.emit(this.selection);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selection.push(event.option.viewValue);
    this.input.nativeElement.value = '';
    this.formCtrl.setValue(null);
    this.onOptionChange.emit(this.selection);
  }

  private _filter(value: string | null): string[] {
    const availableOptions = this.options.filter(option => !this.selection.includes(option));
    if(!value) {
      return availableOptions
    }
    const filterValue = value.toLowerCase();
    return availableOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

}
