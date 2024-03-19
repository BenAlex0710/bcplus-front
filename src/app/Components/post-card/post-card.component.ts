import { Component, Input, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'app-post-card',
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent implements OnInit {
    @Input('postData') postData: any;
    @Input('userData') userData: any;
    @Input('like_post') like_post: any;
    @Input('comment_post') comment_post: any;
    postDate;
    constructor(    
        public app: AppComponent,
    ) { }
    ngOnInit() {
        // console.log(this.app.userinfo , this.postData);
        this.postDate = new Date(this.postData.created_at).toDateString()
    }
}
