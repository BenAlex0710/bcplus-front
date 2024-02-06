import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IndexPageRoutingModule } from './index-routing.module';
import { IndexPage } from './index.page';
import { CustomComponentsModule } from 'src/app/Components/custom-components.module';
import { TranslateModule } from '@ngx-translate/core';
import { SwiperModule } from 'swiper/angular';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        SwiperModule,
        CustomComponentsModule,
        IndexPageRoutingModule
    ],
    declarations: [IndexPage]
})
export class IndexPageModule { }
