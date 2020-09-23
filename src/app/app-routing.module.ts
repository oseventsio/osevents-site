import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

@Component({ template: '' })
export class EmptyComponent {

}

const routes: Routes = [
  { path: '', component: EmptyComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
