import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { RestService } from 'src/app/Services/rest.service';

@Component({
    selector: 'app-block-list',
    templateUrl: './block-list.page.html',
    styleUrls: ['./block-list.page.scss'],
})
export class BlockListPage implements OnInit {

    Friendlist = [];
    param = {
        page: 1,
        event: '',
        user: ''
    };
    loadMoreBtn = false;

    constructor(
        public app: AppComponent,
        private rest: RestService,
    ) { }


    loadMore() {
        this.param.page++;
        this.getDashboardData();
    }

    getDashboardData() {
        this.rest.getBlockList(this.app.userinfo.id).subscribe((res) => {
            console.log(res)
            // if (!this.Friendlist.length) {
                console.log(res.friends)
                
                this.Friendlist = res.friends;
            // } 
        })
    }
    acceptFriendRequest(id) {
        let obj = {
          status: 'accepted',
        };
    
        this.rest.acceptFriendRequest(id, obj).subscribe((res) => {
          if (res.friend_request) {
            this.getDashboardData()
          }
        });
      }
     

    ionViewWillEnter() {
        this.app.setPageTitle('friend_list_page.page_title');
        this.getDashboardData();
    }

    ionViewWillLeave() {
        this.param.page = 1;
        this.param.event = '';
        this.param.user = '';
        this.Friendlist = undefined;
    }

    ngOnInit() {
    }


}