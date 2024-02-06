import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { RestService } from 'src/app/Services/rest.service';
import { InviteGuestsModalPage } from '../invite-guests-modal/invite-guests-modal.page';

@Component({
    selector: 'app-events',
    templateUrl: './events.page.html',
    styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

    events;
    loadMoreBtn = false;
    params = {
        page: 1
    }

    constructor(
        public app: AppComponent,
        private rest: RestService,
        private modalController: ModalController,
    ) { }


    loadMore() {
        this.params.page++;
        this.getEvents();
    }

    getEvents() {
        this.rest.getEvents(this.params).subscribe((res) => {
            if (res.status) {
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
            }
        })
    }


    async openInviteGuestModal(event_info) {
        const myModal = await this.modalController.create({
            component: InviteGuestsModalPage,
            cssClass: 'invite-guests-modal',
            componentProps: {
                event_info: event_info
            }
        });
        return await myModal.present();
    }


    ionViewWillEnter() {
        this.app.setPageTitle('events.page_title');
        this.getEvents();
    }

    ionViewWillLeave() {
        this.params.page = 1;
        this.events = undefined
    }

    ngOnInit() {
    }
}
