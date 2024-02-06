import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GuestsListPageRoutingModule } from './guests-list-routing.module';
import { GuestsListPage } from './guests-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { CustomComponentsModule } from 'src/app/Components/custom-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        CustomComponentsModule,
        GuestsListPageRoutingModule
    ],
    declarations: [GuestsListPage]
})
export class GuestsListPageModule { }
