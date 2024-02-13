import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FriendListPageRoutingModule } from './friend-list-routing.module';
import { FirendListPage } from './friend-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { CustomComponentsModule } from 'src/app/Components/custom-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        CustomComponentsModule,
        FriendListPageRoutingModule
    ],
    declarations: [FirendListPage]
})
export class FriendListPageModule { }
