import { Injectable, OnDestroy } from '@angular/core';
import { throwError } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';

// designates config.itemDetails.types that should not be tracked by form changes (explicitly interact with state outside of form)
const untrackedConfigTypes = [
  'chipsAutocomplete'
];


// designates config.itemDetails.types that are dates, needed for setting the correct value with the dynamic form creation
const dateConfigTypes = [
  'datePicker'
];

@Injectable({
  providedIn: 'root'
})
export class FormCreationService implements OnDestroy {
  alive = true;
  formControlToSourcePathMap: any[] = [];            // { name: string , path: string}
  data: any;
  constructor(private fb: FormBuilder) { }


  buildFormFromSpec(spec: any, formGroup: any, groupName: string) {
    const group = this.fb.group({});       // create a group that will be appended to the incoming group.
    spec.forEach(control => {              // for each config item add a control to the group OR add a group (via recursive buildform).
      if (control.itemDetails.spec) {
        this.buildFormFromSpec(control.itemDetails.spec, group, control.groupName);
      } else if (control.itemDetails.name) {
        if (group.get(control.itemDetails.name)) {
          throwError('duplicate control!');
        }
        group.addControl(control.itemDetails.name, this.createControl(control));
      }
    });
    formGroup.addControl(groupName, group);                             // append to the formGroup coming in.
  }

  createControl(config: any) {
    let validation = null;
    if (config.itemDetails.validators) {
      validation = this.addControlValidation(config.itemDetails.validators);
    }
    const control = this.fb.control({ disabled: config.itemDetails.disabled, value: null }, validation);
    let controlValue = this.getDynamicControlValueFromData(config.itemDetails.sourcePath);
    if (dateConfigTypes.includes(config.itemDetails.type)) {
      controlValue = new Date(controlValue).toISOString();
    }
    // add an association between name, value, and path in data for state updates.
    if (!untrackedConfigTypes.includes(config.itemDetails.type)) {      // Todo: REPLACE THIS WITH CONFIG VARIABLE
      this.formControlToSourcePathMap[config.itemDetails.name] = config.itemDetails.sourcePath;
    }
    control.setValue(controlValue);
    return control;
  }

  /*
      Get data out of the data model and return it to set the form control value
  */
  getDynamicControlValueFromData(path: string) {
    let temp: any;
    if (path) {
      try {
        const pathVariables = path.split('.');
        temp = JSON.parse(JSON.stringify(this.data));
        for (const pathVar of pathVariables) {
          temp = temp[pathVar];
        }
      } catch {
        temp = null;
      }
    }
    if (Array.isArray(temp)) {
      temp = temp[0];
    }
    return temp;
  }

  /*
      Add validation.
  */
  addControlValidation(validators: any[]) {
    const validatorList: any[] = [];
    for (const val of validators) {
      if (val.custom) {                                          // distinguish expected 'custom' validators to be referenced.
        if (val.validatorArgument) {
          validatorList.push(this[val.validator](val.validatorArgument));
        } else {
          validatorList.push(this[val.validator]());
        }
      } else {
        if (val.validatorArgument) {
          validatorList.push(Validators[val.validator](val.validatorArgument));
        } else {
          validatorList.push(Validators[val.validator]);
        }
      }
    }
    return Validators.compose(validatorList);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
