import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { CommonService } from 'src/app/Services/common.service';
import { RestService } from 'src/app/Services/rest.service';

@Component({
    selector: 'app-event-invitations',
    templateUrl: './event-invitations.page.html',
    styleUrls: ['./event-invitations.page.scss'],
})
export class EventInvitationsPage implements OnInit {

    event_invitations;
    params = {
        page: 1
    }
    loadMoreBtn = false;

    constructor(
        public app: AppComponent,
        private rest: RestService,
        private commonService: CommonService,
        private translate: TranslateService,
    ) { }

    acceptInvitation(invitation) {
        combineLatest([
            this.translate.get('event_invitations.accept_confirm_popup.header'),
            this.translate.get('event_invitations.accept_confirm_popup.message')
        ]).subscribe((res) => {
            this.commonService.presentAlertConfirm({
                header: res[0],
                message: res[1],
            }, () => {
                this.rest.acceptInvitation(invitation.id).subscribe((res) => {
                    this.commonService.showToast(res.message, res.status);
                    if (res.status) {
                        invitation.status = '1';
                    }
                });
            })
        })
    }
    rejectInvitation(invitation) {
        combineLatest([
            this.translate.get('event_invitations.reject_confirm_popup.header'),
            this.translate.get('event_invitations.reject_confirm_popup.message')
        ]).subscribe((res) => {
            this.commonService.presentAlertConfirm({
                header: res[0],
                message: res[1],
            }, () => {
                this.rest.rejectInvitation(invitation.id).subscribe((res) => {
                    this.commonService.showToast(res.message, res.status);
                    if (res.status) {
                        invitation.status = '2';
                    }
                });
            })
        })
    }

    loadMore() {
        this.params.page++;
        this.getEventInvitations();
    }

    getEventInvitations() {
        this.rest.getEventInvitations(this.params).subscribe((res) => {
            if (res.status) {
                if (!this.event_invitations) {
                    this.event_invitations = res.data.event_invitations;
                } else {
                    for (const invitation of res.data.event_invitations) {
                        this.event_invitations.push(invitation);
                    }
                }
                if (res.data.event_invitations.length == 20) {
                    this.loadMoreBtn = true
                } else {
                    this.loadMoreBtn = false
                }
            }
        })
    }

    ionViewWillEnter() {
        this.app.setPageTitle('event_invitations.page_title');
        this.getEventInvitations();
    }

    ionViewWillLeave() {
        this.params.page == 1;
        this.event_invitations = undefined;
    }

    ngOnInit() {
    }

}
