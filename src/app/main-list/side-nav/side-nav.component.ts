import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  @Input() listName: string[] = [];

  @Output() onClose = new EventEmitter<boolean>(false);
  @Output() onReset = new EventEmitter<boolean>(false);
  @Output() onApply = new EventEmitter<string | null>();

  name = new FormControl('');

  constructor() {}

  ngOnInit(): void {}

  close() {
    this.onClose.emit();
  }

  reset() {
    this.onReset.emit();
  }

  apply() {
    this.onApply.emit(this.name?.value);

    this.close();
  }
}
