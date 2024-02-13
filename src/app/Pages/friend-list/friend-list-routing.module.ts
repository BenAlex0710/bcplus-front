import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FirendListPage } from './friend-list.page';

const routes: Routes = [
  {
    path: '',
    component: FirendListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendListPageRoutingModule {}
