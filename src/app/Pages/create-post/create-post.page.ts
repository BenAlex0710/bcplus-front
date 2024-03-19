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

    myFormGroup: FormGroup;

    constructor(
        public app: AppComponent,
        private formBuilder: FormBuilder,
        private rest: RestService,
        private translate: TranslateService,
        private commonService: CommonService,
        private router: Router,
    ) { 
        
    }

    get formControls() {
        return this.myFormGroup.controls;
    }
    showBannerPreview(event, previewImg) {
        if (event.target.files.length) {
            let max_size = 2;
            let invalid_image_error, invalid_image_size_error = "";
            this.translate.get('invalid_image_error').subscribe((res) => {
                invalid_image_error = res;
            });
            this.translate.get('invalid_image_size_error', { max_size: max_size }).subscribe((res) => {
                invalid_image_size_error = res;
            });

            const file = event.target.files[0];
            const size = file.size / 1048576;
            if (size > max_size) {
                this.commonService.showToast(invalid_image_size_error, false);
                return false;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                var image = new Image();
                image.setAttribute('src', e.target.result.toString());
                // console.log(image.naturalHeight, image.naturalWidth);
                image.onload = (imgEvent) => {
                    // console.log(this)
                    // console.log(e);
                    let imgObj = <HTMLImageElement>imgEvent.target;
                    if (imgObj.naturalHeight > 0 && imgObj.naturalWidth > 0) {
                        previewImg.src = e.target.result;
                        console.log(e.target.result)
                        this.myFormGroup.get('post_media').setValue(e.target.result);
                        // this.form.get('post_image_name').setValue(file.name);
                    }
                };
                image.onerror = (error) => {
                    this.commonService.showToast(invalid_image_error, false);
                    return false;
                }
            }
            reader.onerror = (error) => {
            }
        }
    }
    submitPost = (event: Event)=> {
        // event.preventDefault()
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
            console.log(this.myFormGroup.value)
                this.rest.createpost({...this.myFormGroup.value,user_id:this.app.userinfo.id}).subscribe((res) => {

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
        this.myFormGroup = this.formBuilder.group({
            title: [''],
            post_media: [''],
            content: [''],
            timezone: [''],
        });
    }


}
