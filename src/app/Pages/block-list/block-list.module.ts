import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BlockListPageRoutingModule } from './block-list-routing.module';
import { BlockListPage } from './block-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { CustomComponentsModule } from 'src/app/Components/custom-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        CustomComponentsModule,
        BlockListPageRoutingModule
    ],
    declarations: [BlockListPage]
})
export class BlockListPageModule { }
