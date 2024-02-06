import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { RestService } from 'src/app/Services/rest.service';

@Component({
    selector: 'app-attendees-list',
    templateUrl: './attendees-list.page.html',
    styleUrls: ['./attendees-list.page.scss'],
})
export class AttendeesListPage implements OnInit {

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
        this.attendees = false;
        this.getDashboardData();
    }

    loadMore() {
        this.attendees_parms.page++;
        this.getDashboardData();
    }

    getDashboardData() {
        this.rest.getAttendeesList(this.attendees_parms).subscribe((res) => {
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
        })
    }

    ionViewWillEnter() {
        this.app.setPageTitle('attendees_page.page_title');
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
