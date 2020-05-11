import { Directive, Input, ComponentFactoryResolver, ViewContainerRef, OnInit, SimpleChanges, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DynBasicHeaderComponent } from './dynamic-form-components/header-components/dyn-basic-header/dyn-basic-header.component';
import { Subscription } from 'rxjs';

/*
  A map of expected backend variables (config.itemDetails.type) that associate it to a specific component.
  ## Be sure to add them to the entryComponents array inside dynamic-form-generator.module.ts so they can be used via componentFactory.
*/
const headerComponents = {
  basicHeader: DynBasicHeaderComponent
};

@Directive({
  selector: '[appDynamicHeaders]'
})
export class DynamicHeadersDirective implements OnInit, OnChanges, OnDestroy {

  @Input() headerConfig;
  @Output() headerAction = new EventEmitter<any>();
  headerComponent;
  headerActionSub: Subscription;

  constructor(private resolver: ComponentFactoryResolver,
              private container: ViewContainerRef) { }

  ngOnInit() {
    const component = headerComponents[this.headerConfig.type];
    const factory = this.resolver.resolveComponentFactory<any>(component);      // component factory code to create a component, associate it to the template, and set it's properties.
    this.headerComponent = this.container.createComponent(factory);
    this.headerComponent.instance.config = this.headerConfig;
    this.headerActionSub = this.headerComponent.instance.headerAction.subscribe(action => this.headerAction.emit(action));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.headerComponent) {
      this.headerComponent.instance.config = this.headerConfig;
    }
  }

  ngOnDestroy() {
    if(this.headerActionSub) {
      this.headerActionSub.unsubscribe();
    }
    if(this.headerComponent) {
      this.headerComponent.destroy();
    }
  }
}
