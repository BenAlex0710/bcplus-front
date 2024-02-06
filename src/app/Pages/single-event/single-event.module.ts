import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingleEventPageRoutingModule } from './single-event-routing.module';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { SingleEventPage } from './single-event.page';
import { TranslateModule } from '@ngx-translate/core';
import { CustomComponentsModule } from 'src/app/Components/custom-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        ShareButtonsModule,
        ShareIconsModule,
        CustomComponentsModule,
        ReactiveFormsModule,
        SingleEventPageRoutingModule
    ],
    declarations: [SingleEventPage]
})
export class SingleEventPageModule { }
