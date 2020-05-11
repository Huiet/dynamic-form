import { Directive, OnInit, OnChanges, OnDestroy, ComponentFactoryResolver, ViewContainerRef, SimpleChanges, Input } from '@angular/core';
import { DynInputComponent } from './components/dyn-input/dyn-input.component';
import { DynSelectComponent } from './components/dyn-select/dyn-select.component';
import { FormGroup } from '@angular/forms';
import { DynamicContainerComponent } from './dynamic-container/dynamic-container.component';

const components = {
  input: DynInputComponent,
  select: DynSelectComponent,
  container: DynamicContainerComponent
};

@Directive({
  selector: '[appDynamicField]'
})
export class DynamicFieldDirective implements OnInit, OnChanges, OnDestroy {
  @Input() config;
  @Input() group: FormGroup;
  @Input() headerActionValue;

  component;

  constructor(private resolver: ComponentFactoryResolver,
              private container: ViewContainerRef) {}

  ngOnInit() {
    const component = components[this.config.itemDetails.type];
    // component factory code to create a component, associate it to the template, and set it's properties.
    const factory = this.resolver.resolveComponentFactory<any>(component);
    this.component = this.container.createComponent(factory);
    this.component.instance.config = this.config.itemDetails;
    if (this.config.itemDetails.name) {                                          // check whether this is a component or a group
      this.component.instance.group = this.group;
    } else {
      this.component.instance.group = this.group.get([this.config.groupName]);
    }
    // potential code to add classes to the actual components (ex: app-mat-input)
    // if(this.config.itemDetails.componentRole) {
    //   this.renderer.addClass(this.component.location.nativeElement, this.config.itemDetails.componentRole);
    // }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.component) {
      // todo: this MAY not work, but it should allow us to update the spec (haven't tested 100% of the way).
      this.component.instance.config = this.config.itemDetails;
      // if (this.config.itemDetails.name) {
      //   this.component.instance.group = this.group;
      // } else {
      //   this.component.instance.group = this.group.get([this.config.name]);
      // }
      if (this.component.instance.headerActionListener) {
        this.component.instance.headerActionListener(this.headerActionValue);
      }
    }
  }

  ngOnDestroy() {
    if (this.component) {
      this.component.destroy();
    }
  }
}

