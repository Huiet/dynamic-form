import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicFormContainerComponent } from './dynamic-form-container/dynamic-form-container.component';
import { DynamicFormResolver } from './resolvers/dynamic-from.resolver';


const routes: Routes = [
  { path: '', redirectTo: 'dynamic-form', pathMatch: 'full' },
  {
    path: 'dynamic-form', component: DynamicFormContainerComponent,
    resolve: {
      payload: DynamicFormResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    DynamicFormResolver
  ]
})
export class AppRoutingModule { }
