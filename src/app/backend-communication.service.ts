import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { formCreateMock } from './mock-payloads/form-create-mock';

@Injectable({
  providedIn: 'root'
})
export class BackendCommunicationService {

  constructor() { }


  getPayload() {
    return of(formCreateMock);
  }
}
