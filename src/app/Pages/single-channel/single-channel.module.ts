import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingleChannelPageRoutingModule } from './single-channel-routing.module';

import { SingleChannelPage } from './single-channel.page';
import { TranslateModule } from '@ngx-translate/core';
import { CustomComponentsModule } from 'src/app/Components/custom-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        CustomComponentsModule,
        TranslateModule,
        SingleChannelPageRoutingModule
    ],
    declarations: [SingleChannelPage]
})
export class SingleChannelPageModule { }
