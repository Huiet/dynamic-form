import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { BackendCommunicationService } from '../backend-communication.service';

@Injectable()
export class DynamicFormResolver implements Resolve<Observable<any>> {

  constructor(private backendApi: BackendCommunicationService) { }

  resolve(route: ActivatedRouteSnapshot) {
     // return this.cusipService.getDefaultProductDetails(route.params.cusip);
     return this.backendApi.getPayload();
  }
}
