import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AllFriendListPageRoutingModule } from './all-friend-list-routing.module';
import { AllFirendListPage } from './all-friend-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { CustomComponentsModule } from 'src/app/Components/custom-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        CustomComponentsModule,
        AllFriendListPageRoutingModule
    ],
    declarations: [AllFirendListPage]
})
export class AllFriendListPageModule { }
