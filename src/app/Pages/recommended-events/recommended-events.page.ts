import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { RestService } from 'src/app/Services/rest.service';

@Component({
    selector: 'app-recommended-events',
    templateUrl: './recommended-events.page.html',
    styleUrls: ['./recommended-events.page.scss'],
})
export class RecommendedEventsPage implements OnInit {

    params = {
        page: 1,
        recommended: 1,
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
        this.app.setPageTitle("recommended_events_page.page_title");
        this.searchEvents();
    }

    ionViewWillLeave() {
        this.params.page = 1;
        this.events = false;
    }

    ngOnInit() {
    }
}
