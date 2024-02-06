import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { CommonService } from 'src/app/Services/common.service';
import { RestService } from 'src/app/Services/rest.service';

@Component({
    selector: 'app-saved-events',
    templateUrl: './saved-events.page.html',
    styleUrls: ['./saved-events.page.scss'],
})
export class SavedEventsPage implements OnInit {

    events;
    params = {
        page: 1,
        event: '',
        user: ''
    };
    loadMoreBtn = false;

    constructor(
        public app: AppComponent,
        private rest: RestService,
        private commonService: CommonService,
    ) { }



    loadMore() {
        this.params.page++;
        this.getSavedEvents();
    }

    getSavedEvents() {
        this.rest.getSavedEvents(this.params).subscribe((res) => {
            if (!res.data.events) {
              this.loadMoreBtn = false;
              return;
            }
            if (!this.events) {
                this.events = res.data.events;
            } else {
                for (const event of res.data.events) {
                    this.events.push(event);
                }
            }
            if (res.data.events.length == 20) {
                this.loadMoreBtn = true
            } else {
                this.loadMoreBtn = false
            }
        })
    }

    removeEvent(event) {
        this.rest.removeEvent(event.id).subscribe((res) => {
            this.commonService.showToast(res.message, res.status);
            for (const key in this.events) {
                if (Object.prototype.hasOwnProperty.call(this.events, key)) {
                    if (this.events[key] == event) {
                        this.events.splice(key, 1)
                    }
                }
            }
        });
    }

    ionViewWillEnter() {
        this.app.setPageTitle('saved_events.page_title');
        this.getSavedEvents();
    }

    ionViewWillLeave() {
        this.params.page = 1;
        this.params.event = '';
        this.params.user = '';
        this.events = undefined;
    }

    ngOnInit() {
    }

}
