import { Component, Renderer2, Input, ChangeDetectionStrategy, ViewChild, AfterContentInit, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-dynamic-container',
  templateUrl: './dynamic-container.component.html',
  styleUrls: ['./dynamic-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicContainerComponent implements AfterContentInit {
  @Input() config: any;
  @Input() group: FormGroup;
  @ViewChild('contentContainerDiv', { static: true }) contentContainerDiv: ElementRef;

  actionValue;

  constructor(private renderDuece: Renderer2) { }

  classGenerator() {

    if (this.config.role) {
      return `${(this.config.role !== null && this.config.role !== 'content-zone-container') ? 'content-zone' : ''} ${this.config.role}`;
    }
    return '';
  }

  headerAction(event) {
    this.actionValue = event;
  }

  ngAfterContentInit() {
    if (this.contentContainerDiv) {
      this.renderDuece.addClass(this.contentContainerDiv.nativeElement.parentNode, `dyn-component-${this.config.role}`);
    }
  }
}