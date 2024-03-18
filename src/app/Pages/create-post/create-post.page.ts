import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { CommonService } from 'src/app/Services/common.service';
import { RestService } from 'src/app/Services/rest.service';

@Component({
    selector: 'app-create-post',
    templateUrl: './create-post.page.html',
    styleUrls: ['./create-post.page.scss'],
})
export class CreatePostPage implements OnInit {

    form: FormGroup;

    constructor(
        public app: AppComponent,
        private formBuilder: FormBuilder,
        private rest: RestService,
        private translate: TranslateService,
        private commonService: CommonService,
        private router: Router,
    ) { 
        this.form = this.formBuilder.group({
            title: [''],
            post_media: [''],
            content: [''],
            timezone: [''],
        });
    }

    get formControls() {
        return this.form.controls;
    }
    submitPost = ()=> {
        event.preventDefault()
        // if (this.createPostForm.$valid) {
            // let obj postTitle,postContent,postImage= {
            //     user_id:this.app.userinfo.id,
            //     post_media: postImage.files[0],
            //     title:postTitle.value,
            //     content:postContent.value,
            // }
            // let formdata = new FormData()
            // formdata.append("user_id",this.app.userinfo.id)
            // formdata.append("post_media", postImage.files[0])
            // formdata.append("title",postTitle.value)
            // formdata.append("content",postContent.value)
            console.log(this.form.value)
                this.rest.createpost(this.form.value).subscribe((res) => {

                    console.log(res)
                  });
            // $upload.upload({
            //     url: 'https://your-api-endpoint.com/upload',
            //     data: { title: this.post.title, content: this.post.content },
            //     file: file
            // }).then(function(response) {
            //     console.log('Post created:', response.data);
            //     // Add code here to save the post to your database
            // });
        // }
    };




    ionViewWillEnter() {
        console.log(this.app.userinfo)
        this.app.setPageTitle('friend_list_page.page_title');
    }

    ionViewWillLeave() {
    }

    ngOnInit() {
    }


}
