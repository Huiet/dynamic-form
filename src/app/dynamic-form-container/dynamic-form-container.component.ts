import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FormCreationService } from '../form-creation.service';
import { Subscription } from 'rxjs';
import { UtilitiesService } from '../utilities.service';
import { takeWhile, debounceTime } from 'rxjs/operators';
import {isEmpty} from 'lodash';
import { DataService } from '../data.service';



@Component({
  selector: 'app-dynamic-form-container',
  templateUrl: './dynamic-form-container.component.html',
  styleUrls: ['./dynamic-form-container.component.scss']
})
export class DynamicFormContainerComponent implements OnInit {

  configPayload: any;
  dataPayload: any;
  formGroup: FormGroup;
  currentFormGroupValue: any;
  formChangeSub: Subscription;
  alive = true;
  constructor(private route: ActivatedRoute,
              private formCreationService: FormCreationService,
              private utilitiesService: UtilitiesService,
              private dataService: DataService) {
    const routerData = this.route.snapshot.data;
    this.configPayload = routerData.payload.config;
    this.dataPayload = routerData.payload.dataPayload;
  }

  ngOnInit(): void {
    this.formCreationService.data = this.dataPayload;
    // builds the formgroup
    console.log(this.configPayload);
    // this.formCreationService.buildFormFromSpec(this.configPayload.itemDetails, this.formGroup, this.configPayload.groupName);
    this.formGroup = this.formCreationService.buildFormFromConfig(this.configPayload.elements);
    console.log(this.formGroup.getRawValue());
    this.currentFormGroupValue = this.formGroup.value;
    if (this.formChangeSub) {
      this.formChangeSub.unsubscribe();
    }

// subscribe to form changes, when one occurs, we find the changes that ocurred via diff and flat,
// and send those changes to our dataservice.updateData which keeps our data object in sync
    this.formChangeSub = this.formGroup.valueChanges.pipe(takeWhile(x => this.alive), debounceTime(200)).subscribe(value => {
      const updateMap: any = {};
      // value: the form value coming from the change subscription
      // currentFormGroupValue: the value we store to represent the value as we know it before any emits.
      const diff = this.utilitiesService.difference(value, this.currentFormGroupValue);
      const flat = this.utilitiesService.flatten(diff);

      for (const changeValue in flat) {
             // explicit check for existence of changevalue property helps avoid emitting
        if (flat.hasOwnProperty(changeValue) && this.formCreationService.formControlToSourcePathMap[changeValue]) {
                // when spec elements are not tracked here (ex: underliers/things in untrackedConfigTypes[])
          updateMap[this.formCreationService.formControlToSourcePathMap[changeValue]] = flat[changeValue];
        }
      }
      this.currentFormGroupValue = value;
      if (!isEmpty(updateMap)) {
        // end up emitting a dictionary of [sourcepath] = value for things that need to change/update
        this.dataService.updateData(updateMap);
      }
    });


  }
}
