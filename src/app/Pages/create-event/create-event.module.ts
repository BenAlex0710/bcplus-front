import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreateEventPageRoutingModule } from './create-event-routing.module';
import { CreateEventPage } from './create-event.page';
import { TranslateModule } from '@ngx-translate/core';
import { CustomComponentsModule } from 'src/app/Components/custom-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CustomComponentsModule,
        ReactiveFormsModule,
        TranslateModule,
        CreateEventPageRoutingModule
    ],
    declarations: [CreateEventPage]
})
export class CreateEventPageModule { }
