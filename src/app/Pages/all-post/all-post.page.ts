import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { RestService } from 'src/app/Services/rest.service';

@Component({
    selector: 'app-all-post',
    templateUrl: './all-post.page.html',
    styleUrls: ['./all-post.page.scss'],
})
export class AllPostPage implements OnInit {

postList=[]
    constructor(
        public app: AppComponent,
        private rest: RestService,
    ) { }


    getposts = ()=> {
        this.rest.getuserposts({user_id:this.app.userinfo.id}).subscribe((res) => {
            console.log(res)
            // if (!this.Friendlist.length) {
                // console.log(res.)
                
                this.postList = res;
            // } 
        })
    };




    ionViewWillEnter() {
        this.app.setPageTitle('friend_list_page.page_title');
        this.getposts()
    }

    ionViewWillLeave() {
    }

    ngOnInit() {
    }


}
