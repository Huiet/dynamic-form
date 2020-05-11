import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DynamicFormContainerComponent } from './dynamic-form-container/dynamic-form-container.component';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFieldDirective } from './dynamic-form-ui-creation/dynamic-field.directive';
import { DynamicHeadersDirective } from './dynamic-form-ui-creation/dynamic-headers.directive';
import { DynamicFormComponent } from './dynamic-form-ui-creation/dynamic-form/dynamic-form.component';
import { DynamicContainerComponent } from './dynamic-form-ui-creation/dynamic-container/dynamic-container.component';
import { DynInputComponent } from './dynamic-form-ui-creation/components/dyn-input/dyn-input.component';
import { DynSelectComponent } from './dynamic-form-ui-creation/components/dyn-select/dyn-select.component';

@NgModule({
  declarations: [
    AppComponent,
    DynamicFormContainerComponent,
    DynamicFieldDirective,
    DynamicHeadersDirective,
    DynamicFormComponent,
    DynamicContainerComponent,
    DynInputComponent,
    DynSelectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    DynInputComponent,
    DynSelectComponent,
    DynamicContainerComponent
  ]
})
export class AppModule { }
