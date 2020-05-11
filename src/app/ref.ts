// import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { takeWhile, debounceTime } from 'rxjs/operators';
// import { transform, isEqual, isEmpty, isObject } from 'lodash';
// import { throwError, Subscription } from 'rxjs';
// import { MatDialog, MatDialogConfig } from '@angular/material';
// import { DraftRequestSaveModalComponent } from '../modals/draft-request-save-modal/draft-request-save-modal.component';
// import { DynStateInteractionService } from '../dyn-state-interaction.service';

// // todo: move difference and flatten into some sort of utility class? perhaps.
// function difference(object, base) {
//     // tslint:disable-next-line: no-shadowed-variable
//     function changes(object, base) {
//         if (typeof object.toISOString === 'function' || object._isAMomentObject) {          // special case for date strings
//             object = object.toISOString();
//             return object;
//         }
//         if (Array.isArray(object)) {
//             return object;
//         }
//         return transform(object, (result, value, key) => {
//             if (!isEqual(value, base[key])) {
//                 if(value === null) {
//                     result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
//                 } else {
//                     result[key] = (isObject(value) && isObject(base[key]) ||
//                                   value.hasOwnProperty('_isAMomentObject') ||
//                                   typeof object.toISOString === 'function') ? changes(value, base[key]) : value; }
//             }
//         });
//     }
//     return changes(object, base);
// }

// // original code snip differences, from https://gist.github.com/penguinboy/762197:
// // (remove this slash)/? { ...prev, ...flatten(object[element], `${prefix}${element}.`) }
// // : { ...prev, ...{ [`${prefix}${element}`]: object[element] } },
// const flatten = (object, prefix = '') =>
//     Object.keys(object).reduce(
//         (prev, element) =>
//             object[element] &&
//                 typeof object[element] === 'object' &&
//                 !Array.isArray(object[element])
//                 ? { ...prev, ...flatten(object[element], ``) }
//                 : { ...prev, ...{ [`${prefix}${element}`]: object[element] } },
//         {},
//     );



// // designates config.itemDetails.types that should not be tracked by form changes (explicitly interact with state outside of form)
// const untrackedConfigTypes = [
//     'chipsAutocomplete'
// ];


// // designates config.itemDetails.types that are dates, needed for setting the correct value with the dynamic form creation
// const dateConfigTypes = [
//     'datePicker'
// ];

// @Component({
//     selector: 'app-dynamic-form-container',
//     templateUrl: './dynamic-form-container.component.html',
//     styleUrls: ['./dynamic-form-container.component.scss'],
//     changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class DynamicFormContainerComponent implements OnInit, OnChanges, OnDestroy {

//     formGroup: FormGroup;
//     currentFormGroupValue: any;
//     alive = true;                                       //    formcontrolName, sourcePath
//     formControlToSourcePathMap: any[] = [];            // { name: string , path: string}
//     formChangeSub: Subscription;
//     showCreateDraftRequestButtons = false;

//     @Input() data;
//     @Output() formChange = new EventEmitter<any>();
//     @Output() saveState = new EventEmitter<any>();
//     @Output() cancelDraft = new EventEmitter<any>();

//     constructor(private fb: FormBuilder,
//                 private dialog: MatDialog,
//                 private dynStateInteractionService: DynStateInteractionService) {}

//     /* When the inputs change, assuming both are present, initially build the formgroup from the spec, associate valuechange listener, and emit the new form value to keep the container up to date */
//     ngOnChanges() {
//         if (this.data && this.dynStateInteractionService.reinit) {
//             this.showCreateDraftRequestButtons = this.data.configSpec.itemDetails.hasOwnProperty('showCreateDraftRequestButtons') ?
//                                                         this.data.configSpec.itemDetails.showCreateDraftRequestButtons : this.showCreateDraftRequestButtons;
//             const tempFormGroup = new FormGroup({});       // using a new formgroup because we want to make sure we never replace object this.formgroup since it's passed down to child components.
//             this.buildFormFromSpec(this.data.configSpec.itemDetails.spec, tempFormGroup, this.data.configSpec.groupName);
//             if (this.formGroup) {
//                 this.formGroup.reset(tempFormGroup.getRawValue());
//             } else {
//                 this.formGroup = tempFormGroup;
//             }
//             this.currentFormGroupValue = this.formGroup.value;
//             if (this.formChangeSub) {
//                 this.formChangeSub.unsubscribe();
//             }
//             this.formChangeSub = this.formGroup.valueChanges.pipe(takeWhile(x => this.alive), debounceTime(200)).subscribe(value => {
//                 const updateMap: any = {};
//                 const diff = difference(value, this.currentFormGroupValue);             // get a flat list of the properties that have changed, and the values that they now are.
//                 const flat = flatten(diff);                                             // this will be used in conjunction with the productDataToFormControlMap we generate on init.
//                 for (const changeValue in flat) {
//                     if (flat.hasOwnProperty(changeValue) && this.formControlToSourcePathMap[changeValue]) {     // explicit check for existence of changevalue property helps avoid emitting
//                         updateMap[this.formControlToSourcePathMap[changeValue]] = flat[changeValue];      // when spec elements are not tracked here (ex: underliers/things in untrackedConfigTypes[])
//                     }
//                 }
//                 this.currentFormGroupValue = value;
//                 if (!isEmpty(updateMap)) {
//                     this.formChange.emit(updateMap);        // end up emitting a dictionary of [sourcepath] = value for things that need to change/update
//                 }
//             });
//             this.dynStateInteractionService.reinit = false;
//         }
//     }

//     cancel() {
//         if (this.data.productRequest.requestId) {
//             const dialogConfig = new MatDialogConfig();
//             dialogConfig.panelClass = ['draft-confirmation-modal'];
//             dialogConfig.disableClose = true;
//             dialogConfig.autoFocus = true;
//             dialogConfig.data = {
//                 title: 'Cancel Draft Request',
//                 message: 'Please confirm you would like to cancel this draft Request.'
//             };
//             const dialogRef = this.dialog.open(DraftRequestSaveModalComponent, dialogConfig);
//             dialogRef.afterClosed()
//                 .subscribe((confirmed) => {
//                     if (confirmed === 'confirm') {
//                         this.dynStateInteractionService.reinit = true;
//                         this.cancelDraft.emit();
//                     }
//                 });
//         } else {
//             this.dynStateInteractionService.reinit = true;
//             this.cancelDraft.emit();
//         }
//     }

//     ngOnInit() {
//         this.dynStateInteractionService.reinit = true;
//     }

//     validateForm(): boolean {
//         // && this.quotes && this.quotes.timeleft != 0 // todo
//         if (this.formGroup.valid) {
//             return false;
//         } else {
//             return true;
//         }
//     }

//     saveDraftRequest() {
//         const dialogConfig = new MatDialogConfig();
//         dialogConfig.panelClass = ['draft-confirmation-modal'];
//         dialogConfig.disableClose = true;
//         dialogConfig.autoFocus = true;
//         dialogConfig.data = {
//             title: 'Save Draft Request',
//             message: 'Please confirm you would like to save this draft.'
//         };
//         const dialogRef = this.dialog.open(DraftRequestSaveModalComponent, dialogConfig);
//         dialogRef.afterClosed()
//             .subscribe((confirmed) => {
//                 if (confirmed === 'confirm') {
//                     this.dynStateInteractionService.reinit = true;
//                     this.saveState.emit();
//                 }
//             });
//     }

//     buildFormFromSpec(spec: any, formGroup: any, groupName: string) {
//         const group = this.fb.group({});                                    // create a group that will be appended to the incoming group.
//         spec.forEach(control => {                                           // for each config item add a control to the group OR add a group (via recursive buildform).
//             if (control.itemDetails.spec) {
//                 this.buildFormFromSpec(control.itemDetails.spec, group, control.groupName);
//             } else if (control.itemDetails.name) {
//                 if (group.get(control.itemDetails.name)) {
//                     throwError('duplicate control!');
//                 }
//                 group.addControl(control.itemDetails.name, this.createControl(control));
//             }
//         });
//         formGroup.addControl(groupName, group);                             // append to the formGroup coming in.

//     }

//     createControl(config: any) {
//         let validation = null;
//         if (config.itemDetails.validators) {
//             validation = this.addControlValidation(config.itemDetails.validators);
//         }
//         const control = this.fb.control({ disabled: config.itemDetails.disabled, value: null }, validation);
//         let controlValue = this.getDynamicControlValueFromData(config.itemDetails.sourcePath);
//         if (dateConfigTypes.includes(config.itemDetails.type)) {
//             controlValue = new Date(controlValue).toISOString();
//         }
//         // add an association between name, value, and path in data for state updates.
//         if (!untrackedConfigTypes.includes(config.itemDetails.type)) {      // Todo: REPLACE THIS WITH CONFIG VARIABLE
//             this.formControlToSourcePathMap[config.itemDetails.name] = config.itemDetails.sourcePath;
//         }
//         control.setValue(controlValue);
//         return control;
//     }

//     /*
//         Get data out of the data model and return it to set the form control value
//     */
//     getDynamicControlValueFromData(path: string) {
//         let temp: any;
//         if (path) {
//             try {
//                 const pathVariables = path.split('.');
//                 temp = JSON.parse(JSON.stringify(this.data));
//                 for (const pathVar of pathVariables) {
//                     temp = temp[pathVar];
//                 }
//             } catch {
//                 temp = null;
//             }
//         }
//         if (Array.isArray(temp)) {
//             temp = temp[0];
//         }
//         return temp;
//     }

//     /*
//         Add validation.
//     */
//     addControlValidation(validators: any[]) {
//         const validatorList: any[] = [];
//         for (const val of validators) {
//             if (val.custom) {                                                               // distinguish expected 'custom' validators to be referenced.
//                 if (val.validatorArgument) {                                                // Todo: instead of this[valName], move to a 'validator service'
//                     validatorList.push(this[val.validator](val.validatorArgument));
//                 } else {
//                     validatorList.push(this[val.validator]());
//                 }
//             } else {
//                 if (val.validatorArgument) {
//                     validatorList.push(Validators[val.validator](val.validatorArgument));
//                 } else {
//                     validatorList.push(Validators[val.validator]);
//                 }
//             }
//         }
//         return Validators.compose(validatorList);
//     }

//     ngOnDestroy() {
//         this.alive = false;
//     }
// }




































// <div *ngIf="formGroup && data.configSpec">
//     <app-dyn-form [config]="data.configSpec" [group]="formGroup"></app-dyn-form>
//     <div class="main-actions-row" *ngIf="showCreateDraftRequestButtons">
//         <button (click)="cancel()" class="content-zone__link button tertiary-call-to-action">CANCEL</button>
//         <button [disabled]="validateForm()" class="content-zone__link button primary-call-to-action" (click)="saveDraftRequest()">SAVE</button>
//         <button [disabled]="true" class="content-zone__link button primary-call-to-action">PROCEED TO OFFERING</button>
//     </div>
// </div>

















// <app-dynamic-form-container
//         (formChange)="onFormChange($event)"
//         (cancelDraft)="cancelDraft()"
//         (saveState)="saveFormState()"
//         [data]="currentData"
// ></app-dynamic-form-container>











// import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
// import { Subscription } from 'rxjs';
// import { DraftRequestService } from '../../draft-request-create/draft-request.service';
// import { DynStateInteractionService } from '../dyn-state-interaction.service';
// import { environment } from '@environments/environment';
// import { Router } from '@angular/router';

// /*
// This component is a 'container' (smart/dumb component Design pattern). It's job is to talk to the NgRx store, as well as keep an up to date model of the current form data.
// */
// @Component({
//   selector: 'app-dynamic-form-container-parent',
//   templateUrl: './dynamic-form-container-parent.component.html',
//   styleUrls: ['./dynamic-form-container-parent.component.scss']
// })
// export class DynamicFormContainerParentComponent implements OnInit, OnDestroy {


//   @Input() data: any; // data coming from routerOutlet in parent component

//   currentData: any;
//   currentDataSub: Subscription;
//   currentDelta: any;
//   currentDeltaSub: Subscription;
//   currentArraySub: Subscription;
//   requestId: string;
//   @ViewChild('reqId', {static: true}) requestIdElement: ElementRef;

//   constructor(private draftRequestService: DraftRequestService,
//               private dynStateInteractionService: DynStateInteractionService,
//               private router: Router) { }

//   ngOnInit() {
//     this.currentDataSub = this.dynStateInteractionService.data$.subscribe(data => {
//       this.currentData = data;
//     });
//     this.currentDeltaSub = this.dynStateInteractionService.delta$.subscribe(delta => {
//       this.currentDelta = delta;
//     });
//     this.dynStateInteractionService.data$.next(this.data);
//   }

//   /*
//   This method recieves a list of elements:
//   [key: sourcePath that needs to update]: value: value to change the dataobject[sourcepath] to
//   */
//   onFormChange(deltas: any) {
//     if (environment.environmentName !== 'cce') {
//       console.log('form changed, you have a sourcePath set correctly.');
//       console.log('deltas passed in: ', deltas);
//     }
//     this.dynStateInteractionService.delta$.next(deltas);
//     for (const delta in deltas) {
//       if (deltas.hasOwnProperty(delta)) {
//         const splitPath = delta.split('.');
//         let tempStateSegment = this.currentData;
//         let finalPathVar = ``;
//         for (const pathVar of splitPath) {                // walk through the path given
//           if (splitPath[splitPath.length - 1] === pathVar) {
//             finalPathVar = pathVar;
//             continue;
//           }
//           tempStateSegment = tempStateSegment[pathVar];
//         }
//         const updatedValue = (Array.isArray(tempStateSegment[finalPathVar])) ? [deltas[delta]] : deltas[delta];
//         tempStateSegment[finalPathVar] = updatedValue;     // set the value in this local variable to what it is based on the deltas.value
//         this.dynStateInteractionService.data$.next(this.currentData);
//       }
//     }
//     // determine if we have externalFilters that need updating...

//   }

//   saveFormState() {
//     this.draftRequestService.saveDraftRequest(this.currentData).subscribe(res => {
//       this.requestId = res.productRequest.requestId;
//       if (this.requestId) {
//         this.router.navigate(['/luma-creation-hub/create-draft-request'], {queryParams: { editRequestId : this.requestId}});
//       }
//     });
//   }

//   cancelDraft() {
//     if (this.requestId) {
//       this.draftRequestService.cancelDraftRequest(this.requestId).subscribe(res => {
//         this.router.navigate(['/luma-creation-hub/create-draft-request']);
//       });
//     } else {
//       this.router.navigate(['/luma-creation-hub/create-draft-request']);
//     }
//   }

//   ngOnDestroy() {
//     if (this.currentDataSub) {
//       this.currentDataSub.unsubscribe();
//     }
//     if (this.currentDeltaSub) {
//       this.currentDeltaSub.unsubscribe();
//     }
//     if (this.currentArraySub) {
//       this.currentArraySub.unsubscribe();
//     }
//   }
// }






















// marketplace

// import { Injectable, OnDestroy } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
// import { takeWhile } from 'rxjs/operators';
// import * as moment from 'moment-timezone';
// @Injectable({
//     providedIn: 'root'
// })
// export class OrderFormDynFieldService implements OnDestroy {

//     alive = true;
//     dynamicFieldsExist = false;
//     orderId: number = null;
//     fullPayloadData: any;
//     constructor(private fb: FormBuilder) { }

//     addDynamicFields(data: any, form: any, spec: any, configOptions: any) {
//         const group = this.fb.group({});
//         spec.forEach(control => {
//             if (control.itemType === 'dynamic') {
//                 this.dynamicFieldsExist = true;
//                 const path = control.itemDetails.sourcePath.split('.');
//                 if (path[0] === 'dynamicFields') {
//                     group.addControl(control.itemDetails.name, this.createControl(control, data));
//                 } else {
//                     form.addControl(control.itemDetails.name, this.createControl(control, data));
//                 }
//             } else {
//                 configOptions[control.itemDetails.bindProperty] = { value: control.itemDetails.bindValue || null, state: control.itemDetails.state || '' };
//                 if (control.itemDetails.state === 'disabled') {
//                     form.get(control.itemDetails.bindProperty).disable();
//                 } else if (control.itemDetails.validators && control.itemDetails.validators.length > 0 && control.itemDetails.state !== 'hidden') {
//                     form.get(control.itemDetails.bindProperty).setValidators(this.addControlValidation(control.itemDetails.validators));
//                 }
//                 if (control.itemDetails.bindValue && form.get(control.itemDetails.bindProperty)) {
//                     form.get(control.itemDetails.bindProperty).setValue(control.itemDetails.bindValue);
//                 }
//             }
//         });
//         form.addControl('dynamicFields', group);
//         spec.forEach(control => {
//             if (control.itemDetails.changeDetection) {
//                 this.addChangeDetection(control, form, configOptions);
//             }
//         });
//         return group;
//     }

//     createControl(config: any, data: any) {
//         let validation = null;
//         if (config.itemDetails.validators && config.itemDetails.state !== 'hidden') {
//             validation = this.addControlValidation(config.itemDetails.validators);
//         }
//         const control = this.fb.control({ disabled: false, value: null }, validation);
//         control.setValue(this.getDynamicControlValueFromData(config.itemDetails.sourcePath, data));
//         return control;
//     }

//     getDynamicControlValueFromData(path: string, data) {
//         const pathVariables = path.split('.');
//         let temp: any = JSON.parse(JSON.stringify(data));
//         try {
//             for (const pathVar of pathVariables) {
//                 temp = temp[pathVar];
//             }
//         } catch {
//             temp = null;
//         }
//         return temp;
//     }

//     getControlFromSourcePath(formControl: any, sourcePath: string) {
//         const controlPath = sourcePath.split('.');
//         let newControl = formControl;
//         for (const c of controlPath) {                                      // getting the control designated by changesOn
//             if (c === controlPath[controlPath.length - 1]) {
//                 newControl = newControl.get(c);
//             } else {
//                 newControl = newControl.get(c) as FormGroup;
//             }
//         }
//         return newControl;
//     }

//     addControlValidation(validators: any[]) {
//         const validatorList: any[] = [];
//         for (const val of validators) {
//             if (val.custom) {
//                 if (val.validatorArgument) {
//                     validatorList.push(this[val.validator](val.validatorArgument));
//                 } else {
//                     validatorList.push(this[val.validator]());
//                 }
//             } else {
//                 if (val.validatorArgument) {
//                     validatorList.push(Validators[val.validator](val.validatorArgument));
//                 } else {
//                     validatorList.push(Validators[val.validator]);
//                 }
//             }
//         }
//         return Validators.compose(validatorList);
//     }

//     addChangeDetection(control: any, form: any, configOptions: any) {
//         if (control.itemDetails.changeDetection) {
//             for (const changeDetector of control.itemDetails.changeDetection) { // looping through all possible change detectors
//                 let formControl = form;
//                 formControl = this.getControlFromSourcePath(formControl, changeDetector.bindProperty);      // getting the control to watch for changes on
//                 if (formControl) {
//                     let currentControl: any;
//                     if (control.itemType === 'dynamic') {                                                           // getting our current control
//                         currentControl = form;
//                         currentControl = this.getControlFromSourcePath(currentControl, control.itemDetails.sourcePath);

//                     } else {
//                         currentControl = form.get(control.itemDetails.bindProperty);
//                     }
//                     formControl.valueChanges.pipe(takeWhile(x => this.alive)).subscribe(value => {          // react to changes on the 'bindproperty' control
//                         if (changeDetector.valueMapping) {
//                             // console.log('value changed to ', formControl.value);
//                             if(changeDetector.valueMapping[value]) {
//                                 currentControl.setValue(changeDetector.valueMapping[value]);
//                             } else if(changeDetector.valueMapping._defaultValue) {
//                                 currentControl.setValue(changeDetector.valueMapping._defaultValue);
//                             }
//                         }
//                         if (changeDetector.validationMapping) {
//                             currentControl.clearValidators();
//                             if (changeDetector.validationMapping[value]) {
//                                 currentControl.setValidators(this.addControlValidation(changeDetector.validationMapping[value].validators));
//                                 // console.log('validation for ', formControl.value);
//                             }
//                             currentControl.updateValueAndValidity();
//                         }
//                         if (changeDetector.stateMapping) {
//                             // console.log('state change for ', formControl.value);
//                             configOptions[control.itemDetails.bindProperty].state = changeDetector.stateMapping[value];
//                             if (changeDetector.stateMapping[value] === 'hidden') {
//                                 currentControl.reset(control.itemDetails.bindValue || null);
//                             }
//                         }
//                     });
//                 }
//             }
//         }
//     }

//     /** A hero's name can't match the given regular expression */
//     beforeOrEqualToCurrentDate(timeControlName: null): ValidatorFn {
//         return (control: AbstractControl): { [key: string]: any } | null => {
//             if (control.value == null) {
//                 return { invalidDate: 'Delivery Date and Time must be past or current.' };
//             }
//             const controlDate = moment(control.value, 'YYYY-MM-DD', false);
//             if (!controlDate.isValid()) {
//                 return { invalidDate: 'Delivery Date and Time must be past or current.' };
//             }
//             const validationDate = moment().format('YYYY-MM-DD');
//             if(timeControlName) {
//                 control.root.get(timeControlName).updateValueAndValidity();
//             }
//             return controlDate.isAfter(validationDate) ?
//                 { invalidDate: `Delivery Date and Time must be past or current.` } : null;
//         };
//     }

//     beforeOrEqualToCurrentTime(): ValidatorFn {
//         return (control: AbstractControl): { [key: string]: any } | null => {
//             const dateInput = control.root.get('prospectusAcknowledgmentDate').value;
//             if (control.value == null || dateInput == null) {
//                 return { invalidDate: 'Delivery Date and Time must be past or current.' };
//             }
//             const d = new Date();
//             d.setHours(23);
//             d.setMinutes(59);
//             const validationDate = moment.tz(d.toISOString(), 'America/New_York');
//             const dateInputMoment = moment(dateInput);
//             const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
//             if (!timePattern.test(control.value)) {
//                 return { invalidDate: 'Delivery Date and Time must be past or current.'};
//             }
//             if(dateInputMoment.isAfter(validationDate)) {
//                 return { invalidDate: 'Delivery Date and Time must be past or current.'};
//             }
//             let valid = true;
//             if(dateInputMoment.isSame(validationDate, 'day') && dateInputMoment.isSame(validationDate, 'month') && dateInputMoment.isSame(validationDate, 'year') ) {
//                 if (Number(validationDate.hour()) < Number(control.value.substring(0, 2))) {
//                     valid = false;
//                 } else if ((Number(validationDate.hour()) === Number(control.value.substring(0, 2)) ||
//                     Number(validationDate.hour()) === Number(control.value.substring(1, 2))) &&
//                     Number(validationDate.minute()) < Number((control.value.substring(3, 5)))) {
//                         {
//                             valid = false;
//                         }
//                 }
//             }
//             return valid ? null :
//                 { invalidDate: `Delivery time must be past or current` };
//         };
//     }

//     ngOnDestroy() {
//         this.alive = false;
//     }
// }
