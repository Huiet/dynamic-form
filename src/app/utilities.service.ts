import { Injectable } from '@angular/core';
import { transform, isEqual, isEmpty, isObject } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {


  constructor() { }

  difference(object, base) {
    // tslint:disable-next-line: no-shadowed-variable
    function changes(object, base) {
      if (typeof object.toISOString === 'function' || object._isAMomentObject) {          // special case for date strings
        object = object.toISOString();
        return object;
      }
      if (Array.isArray(object)) {
        return object;
      }
      return transform(object, (result, value, key) => {
        if (!isEqual(value, base[key])) {
          if (value === null) {
            result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
          } else {
            result[key] = (isObject(value) && isObject(base[key]) ||
              value.hasOwnProperty('_isAMomentObject') ||
              typeof object.toISOString === 'function') ? changes(value, base[key]) : value;
          }
        }
      });
    }
    return changes(object, base);
  }

  // original code snip differences, from https://gist.github.com/penguinboy/762197:
  // (remove this slash)/? { ...prev, ...flatten(object[element], `${prefix}${element}.`) }
  // : { ...prev, ...{ [`${prefix}${element}`]: object[element] } },
  flatten = (object, prefix = '') =>
    Object.keys(object).reduce(
      (prev, element) =>
        object[element] &&
          typeof object[element] === 'object' &&
          !Array.isArray(object[element])
          ? { ...prev, ...this.flatten(object[element], ``) }
          : { ...prev, ...{ [`${prefix}${element}`]: object[element] } },
      {},
    )
}
