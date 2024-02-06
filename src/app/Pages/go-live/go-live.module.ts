import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GoLivePageRoutingModule } from './go-live-routing.module';
import { GoLivePage } from './go-live.page';
import { CustomComponentsModule } from 'src/app/Components/custom-components.module';
import { TranslateModule } from '@ngx-translate/core';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CustomComponentsModule,
        TranslateModule,
        IonicModule,
        ShareButtonsModule,
        ShareIconsModule,
        GoLivePageRoutingModule
    ],
    declarations: [GoLivePage]
})
export class GoLivePageModule { }
