import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleEventPage } from './single-event.page';

const routes: Routes = [
  {
    path: '',
    component: SingleEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleEventPageRoutingModule {}
