import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendeesListPage } from './attendees-list.page';

const routes: Routes = [
  {
    path: '',
    component: AttendeesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendeesListPageRoutingModule {}
