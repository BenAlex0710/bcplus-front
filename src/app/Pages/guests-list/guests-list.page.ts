import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { RestService } from 'src/app/Services/rest.service';

@Component({
    selector: 'app-guests-list',
    templateUrl: './guests-list.page.html',
    styleUrls: ['./guests-list.page.scss'],
})
export class GuestsListPage implements OnInit {

    guests;
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
        this.rest.getGuestsList(this.param).subscribe((res) => {
            if (!this.guests) {
                this.guests = res.data.guests;
            } else {
                for (const guest of res.data.guests) {
                    this.guests.push(guest);
                }
            }
            if (res.data.guests.length == 20) {
                this.loadMoreBtn = true
            } else {
                this.loadMoreBtn = false
            }
        })
    }

    ionViewWillEnter() {
        this.app.setPageTitle('guests_list_page.page_title');
        this.getDashboardData();
    }

    ionViewWillLeave() {
        this.param.page = 1;
        this.param.event = '';
        this.param.user = '';
        this.guests = undefined;
    }

    ngOnInit() {
    }


}
