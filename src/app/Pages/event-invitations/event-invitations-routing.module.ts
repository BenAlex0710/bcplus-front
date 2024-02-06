import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventInvitationsPage } from './event-invitations.page';

const routes: Routes = [
  {
    path: '',
    component: EventInvitationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventInvitationsPageRoutingModule {}
