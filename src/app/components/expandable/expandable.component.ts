import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-expandable',
  templateUrl: './expandable.component.html',
  styleUrls: ['./expandable.component.scss'],
})
export class ExpandableComponent {
  private readonly TAG = 'ExpandableComponent';

  @Input() title: string;
  @Input() color: string;
  @Input() @HostBinding('class.expanded') expanded: boolean;

  get internalColor() {
    return this.color ? this.color : 'light';
  }

  constructor() {}

  toggle() {
    this.expanded = !this.expanded;
  }
}
