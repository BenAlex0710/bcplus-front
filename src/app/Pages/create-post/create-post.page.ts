import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { RestService } from 'src/app/Services/rest.service';

@Component({
    selector: 'app-create-post',
    templateUrl: './create-post.page.html',
    styleUrls: ['./create-post.page.scss'],
})
export class CreatePostPage implements OnInit {


    constructor(
        public app: AppComponent,
        private rest: RestService,
    ) { }


    submitPost = (postTitle,postContent,postImage)=> {
        // if (this.createPostForm.$valid) {
            console.log({
                    // url: 'https://your-api-endpoint.com/upload',
                    // data: { title: this.post.title, content: this.post.content },
                    file: postImage.files[0],
                    postTitle:postTitle.value,
                    postContent:postContent.value,
                })
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
        this.app.setPageTitle('friend_list_page.page_title');
    }

    ionViewWillLeave() {
    }

    ngOnInit() {
    }


}
