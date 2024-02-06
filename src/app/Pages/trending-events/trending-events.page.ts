import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { RestService } from 'src/app/Services/rest.service';

@Component({
    selector: 'app-trending-events',
    templateUrl: './trending-events.page.html',
    styleUrls: ['./trending-events.page.scss'],
})
export class TrendingEventsPage implements OnInit {

    params = {
        page: 1,
        trending: 1
    };

    events;
    loadMoreBtn;

    constructor(
        public app: AppComponent,
        private rest: RestService
    ) {
    }

    loadMore() {
        this.params.page++;
        this.searchEvents();
    }

    searchEvents() {
        this.rest.searchEvents(this.params).subscribe((res) => {
            if (res.status) {
                // this.rooms = res.data.rooms
                if (res.data.events.length == 12) {
                    this.loadMoreBtn = true;
                } else {
                    this.loadMoreBtn = false;
                }
                if (this.events) {
                    for (const event of res.data.events) {
                        this.events.push(event);
                    }
                } else {
                    this.events = res.data.events;
                }
            } else {
                this.events = [];
            }
        });
    }

    ionViewWillEnter() {
        this.app.setPageTitle("trending_page.page_title");
        this.searchEvents();
    }

    ionViewWillLeave() {
        this.params.page = 1;
        this.events = false;
    }

    ngOnInit() {
    }

}
