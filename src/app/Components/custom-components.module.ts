import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventBlockComponent } from './event-block/event-block.component';
import { ChannelBlockComponent } from './channel-block/channel-block.component';
import { FooterComponent } from './footer/footer.component';
import { PostCardComponent } from './post-card/post-card.component';
import { SearchableSelectComponent } from './searchable-select/searchable-select.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        IonicModule
    ],
    declarations: [
        EventBlockComponent,
        FooterComponent,
        ChannelBlockComponent,
        PostCardComponent,
        SearchableSelectComponent
    ],
    exports: [
        EventBlockComponent,
        FooterComponent,
        ChannelBlockComponent,
        PostCardComponent,
        SearchableSelectComponent
    ]
})
export class CustomComponentsModule { }
