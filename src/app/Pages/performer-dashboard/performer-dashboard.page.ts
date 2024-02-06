import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { RestService } from 'src/app/Services/rest.service';

@Component({
    selector: 'app-performer-dashboard',
    templateUrl: './performer-dashboard.page.html',
    styleUrls: ['./performer-dashboard.page.scss'],
})
export class PerformerDashboardPage implements OnInit {

    attendees;
    events;
    users
    attendees_parms = {
        page: 1,
        event: '',
        user: ''
    };
    loadMoreBtn = false;

    constructor(
        public app: AppComponent,
        private rest: RestService,
    ) { }

    filterAttendees(event, user) {
        this.attendees_parms.page = 1;
        this.attendees_parms.event = event;
        this.attendees_parms.user = user;
        this.getDashboardData();
    }

    loadMore() {
        this.attendees_parms.page++;
        this.getDashboardData();
    }

    getDashboardData() {
        /* this.rest.getPerformerDashboard(this.attendees_parms).subscribe((res) => {

            this.events = res.data.events;
            this.users = res.data.users;

            if (!this.attendees) {
                this.attendees = res.data.attendees;
            } else {
                for (const attendee of res.data.attendees) {
                    this.attendees.push(attendee);
                }
            }
            if (res.data.attendees.length == 20) {
                this.loadMoreBtn = true
            } else {
                this.loadMoreBtn = false
            }
        }) */
    }

    ionViewWillEnter() {
        this.app.setPageTitle('dashboard.page_title');
        this.getDashboardData();
    }

    ionViewWillLeave() {
        this.attendees_parms.page = 1;
        this.attendees_parms.event = '';
        this.attendees_parms.user = '';
        this.attendees = undefined;
    }

    ngOnInit() {
    }

}
