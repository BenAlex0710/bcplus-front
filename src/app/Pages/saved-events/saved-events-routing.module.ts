import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SavedEventsPage } from './saved-events.page';

const routes: Routes = [
  {
    path: '',
    component: SavedEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SavedEventsPageRoutingModule {}
