import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleChannelPage } from './single-channel.page';

const routes: Routes = [
  {
    path: '',
    component: SingleChannelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleChannelPageRoutingModule {}
