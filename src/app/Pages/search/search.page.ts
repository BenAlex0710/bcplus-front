import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { CommonService } from 'src/app/Services/common.service';
import { RestService } from 'src/app/Services/rest.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

    params = {
        page: 1,
        keywords: '',
        timing: '',
        event_type: ''
    };

    events;
    loadMoreBtn;
    subscription;

    constructor(
        public app: AppComponent,
        private rest: RestService,
        private activatedRoute: ActivatedRoute,
        private commonService: CommonService,
    ) {
    }

    loadMore() {
        this.params.page++;
        this.searchEvents();
    }

    filterByTiming(timing) {
        this.params.timing = timing;
        this.params.page = 1;
        this.updateQueryParams();
    }

    filterByEventType(event_type) {
        this.params.event_type = event_type;
        this.params.page = 1;
        this.updateQueryParams();
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

        this.app.setPageTitle("search_page.page_title");

        let params = this.activatedRoute.snapshot.queryParamMap;
        this.params.keywords = params.get('keywords') ? params.get('keywords') : '';
        this.params.timing = params.get('timing') ? params.get('timing') : '';
        this.params.event_type = params.get('event_type') ? params.get('event_type') : '';
        this.searchEvents();

        this.subscription = this.app.notifyObservable.subscribe((res) => {
            // console.log('subscription', res);
            this.params.keywords = res.keywords ? res.keywords : '';
            this.params.timing = res.timing ? res.timing : '';
            this.params.page = 1;
            this.events = false;
            this.searchEvents();
        });
    }

    updateQueryParams() {
        let queryParams = {
            keywords: this.params.keywords,
            timing: this.params.timing,
            event_type: this.params.event_type
        };
        history.replaceState(null, null, this.commonService.setParams('/search', queryParams));
        this.events = false;
        this.searchEvents();
    }

    ionViewWillLeave() {
        this.params.page = 1;
        this.params.keywords = '';
        this.params.event_type = '';
        this.params.timing = '';
        this.events = false;
        this.subscription.unsubscribe();
    }

    ngOnInit() {
    }

}
