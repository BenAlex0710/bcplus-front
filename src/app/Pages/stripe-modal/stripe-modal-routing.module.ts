import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StripeModalPage } from './stripe-modal.page';

const routes: Routes = [
  {
    path: '',
    component: StripeModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StripeModalPageRoutingModule {}
