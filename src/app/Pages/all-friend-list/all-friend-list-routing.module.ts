import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllFirendListPage } from './all-friend-list.page';

const routes: Routes = [
  {
    path: '',
    component: AllFirendListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllFriendListPageRoutingModule {}
