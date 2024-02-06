import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InviteGuestsModalPage } from './invite-guests-modal.page';

const routes: Routes = [
  {
    path: '',
    component: InviteGuestsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InviteGuestsModalPageRoutingModule {}
