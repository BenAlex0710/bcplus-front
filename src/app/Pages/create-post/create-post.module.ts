import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreatePostPageRoutingModule } from './create-post-routing.module';
import { CreatePostPage } from './create-post.page';
import { TranslateModule } from '@ngx-translate/core';
import { CustomComponentsModule } from 'src/app/Components/custom-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        ReactiveFormsModule,
        CustomComponentsModule,
        CreatePostPageRoutingModule
    ],
    declarations: [CreatePostPage]
})
export class CreatePostPageModule { }
