// import { Injectable, NgZone, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
// import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
// import { Router } from '@angular/router';
// import { UserService } from '@common/services/user.service';
// import { takeWhile } from 'rxjs/operators';
// import { IdleTimeoutActions, IDLE_LOGOUT_TIME_MS, IDLE_TIMEOUT_ACTION, IDLE_TIMEOUT_TIME_MS, STORAGE_CHECKING_INTERVAL_MS } from './IdleTimeoutActions';
// import { InactivityTimeoutModalComponent } from './inactivity-timeout-modal/inactivity-timeout-modal.component';


// @Injectable({
//   providedIn: 'root'
// })
// export class IdleTimeoutService implements OnDestroy {


//   clearListenerScroll;
//   clearListenerMouseMove;
//   clearListenerKeydown;
//   clearListenerStorage;

//   listenersExist = false;
//   alive = true;
//   interval;
//   timeoutSetExpiredTime;



//   inactivityDialogRef: MatDialogRef<InactivityTimeoutModalComponent>;
//   dialogConfig: MatDialogConfig = {
//     panelClass: ['confirmation-dialog', 'l-w400'],
//     disableClose: true
//   };
//   dialogOpen = false;
//   private renderer: Renderer2;

//   constructor(private dialog: MatDialog,
//               private userService: UserService,
//               private zone: NgZone,
//               private rendererFactory: RendererFactory2,
//               private router: Router) {
//                 this.renderer = rendererFactory.createRenderer(null, null);
//               }

//   init() {
//     // this kicks off idle timeout when the user is updated. Should only be updated on ~login
//     this.userService.$user.pipe(takeWhile(x => this.alive)).subscribe(user=> {
//       if(user) {
//         if(this.getIdleTimeoutAction() ===  IdleTimeoutActions.LOGOUT) { // if the user is logged in, reset the idletimeoutactions to null
//           localStorage.setItem(IDLE_TIMEOUT_ACTION, null);
//         }
//         this.clearListenerStorage?.();
//         this.clearListenerStorage = this.renderer.listen('window', 'storage', this.onIdleTimeoutAction);
//         this.startTrackingIdleTime();
//       } else if (this.listenersExist) { // not logged in
//         this.removeListeners();
//       }
//     });
//   }

//   /**
//    * Starts the interval that checks localstorage to determine if the idle expired time is at it's limit
//    */
//   startTrackingIdleTime() {
//     if(this.getIdleTimeoutAction() !== IdleTimeoutActions.IDLE_TRIGGERED) {
//       this.updateExpiredTime(null, true);
//     }
//     this.addListeners();
//     if(this.interval) {
//       clearInterval(this.interval);
//     }
//     this.interval = setInterval(() => {
//       const expiredTime = parseInt(localStorage.getItem('_expiredTime'), 10);
//       if(expiredTime + (IDLE_LOGOUT_TIME_MS) < Date.now()) {
//         this.triggerLogout();
//       } else if (expiredTime < Date.now()) {
//         if(!this.dialogOpen) {
//           localStorage.setItem(IDLE_TIMEOUT_ACTION, IdleTimeoutActions.IDLE_TRIGGERED);
//           this.openIdleDialog();
//         }
//       }
//     }, STORAGE_CHECKING_INTERVAL_MS);
//   }


//   triggerLogout() {
//     this.removeListeners();
//     this.dialog.closeAll();
//     this.userService.logout();
//   }

//   /**
//    * Update the _exporedTime localStorage variable with a new time (timeout used to throttle)
//    */
//   updateExpiredTime = (event, skipTimeout = false) => {
//     if(localStorage.getItem(IDLE_TIMEOUT_ACTION) !== IdleTimeoutActions.IDLE_TRIGGERED) {
//       if (this.timeoutSetExpiredTime) {
//         clearTimeout(this.timeoutSetExpiredTime);
//       }
//       if(skipTimeout) {
//           localStorage.setItem('_expiredTime', '' + (Date.now() + (IDLE_TIMEOUT_TIME_MS)));
//       } else {
//         this.timeoutSetExpiredTime = setTimeout(() => {
//             localStorage.setItem('_expiredTime', '' + (Date.now() + (IDLE_TIMEOUT_TIME_MS)));
//         }, 300);
//       }
//     }
//   }

//   addListeners() {
//     this.listenersExist = true;
//     this.zone.runOutsideAngular(() => {
//       this.clearListenerMouseMove = this.renderer.listen('window', 'mousemove', this.updateExpiredTime);
//       this.clearListenerScroll = this.renderer.listen('window', 'scroll', this.updateExpiredTime);
//       this.clearListenerKeydown = this.renderer.listen('window', 'keydown', this.updateExpiredTime);
//     });
//   }

//   removeListeners() {
//     this.listenersExist = false;
//     this.zone.runOutsideAngular(() => {
//       this.clearListenerMouseMove();
//       this.clearListenerScroll();
//       this.clearListenerKeydown();
//       this.clearListenerStorage();
//     });
//     clearInterval(this.interval);
//   }



//   openIdleDialog() {
//     this.dialogOpen = true;
//     this.inactivityDialogRef = this.dialog.open(InactivityTimeoutModalComponent, this.dialogConfig);
//     this.inactivityDialogRef.afterClosed().subscribe(action => {
//       if(action === IdleTimeoutActions.CONTINUE) {
//         // trigger other tabs to close the modal
//         localStorage.setItem(IDLE_TIMEOUT_ACTION, IdleTimeoutActions.CONTINUE);
//         localStorage.setItem(IDLE_TIMEOUT_ACTION, null);
//         this.updateExpiredTime(null, true);
//       } else if(action === IdleTimeoutActions.LOGOUT){
//         this.triggerLogout();
//       }
//       this.dialogOpen = false;
//     });
//   }

//   onIdleTimeoutAction = (event) => {
//     if (event.storageArea === localStorage) {
//       if(this.dialogOpen) {
//         const action = localStorage.getItem(IDLE_TIMEOUT_ACTION);
//         if(action === IdleTimeoutActions.LOGOUT) {
//           this.removeListeners();
//           this.dialog.closeAll();
//           this.router.navigate(['login']);
//         } else if (action === IdleTimeoutActions.CONTINUE) {
//           this.updateExpiredTime(null, true);
//           this.inactivityDialogRef?.close(IdleTimeoutActions.CONTINUE);
//         }
//       }
//     }
//   }

//   getIdleTimeoutAction() {
//     return localStorage.getItem(IDLE_TIMEOUT_ACTION);
//   }

//   ngOnDestroy() {
//     this.removeListeners();
//     this.alive = false;
//   }
// }
