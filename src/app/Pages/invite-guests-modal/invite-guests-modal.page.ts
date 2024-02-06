import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { CommonService } from 'src/app/Services/common.service';
import { RestService } from 'src/app/Services/rest.service';

@Component({
    selector: 'app-invite-guests-modal',
    templateUrl: './invite-guests-modal.page.html',
    styleUrls: ['./invite-guests-modal.page.scss'],
})
export class InviteGuestsModalPage implements OnInit {

    @Input() event_info;
    guests;
    param = {
        page: 1,
        event: '',
        user: ''
    };
    loadMoreBtn = false;
    invitationForm: FormGroup;

    constructor(
        private rest: RestService,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private commonService: CommonService,
        private modalController: ModalController
    ) {
        this.invitationForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            full_name: ['', [Validators.required]],
            event_id: ['', [Validators.required]]
        });
    }

    loadMore() {
        this.param.page++;
        this.getDashboardData();
    }


    get formControls() {
        return this.invitationForm.controls;
    }
    getDashboardData() {
        this.param.event = this.event_info.id;
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

    sendInvitation() {
        this.invitationForm.get('event_id').setValue(this.event_info.id);
        this.rest.sendEventInvitations(this.invitationForm.value).subscribe((res) => {
            if (!res.status) {
                this.commonService.setFormErrors(this.invitationForm, res);
            } else {
                this.commonService.showToast(res.message, true);
                this.closeModal();
            }
        });
    }
    sendEventInvitationsMailAgain(id) {
        this.rest.sendEventInvitationsMailAgain(id).subscribe((res) => {
            this.commonService.showToast(res.message, res.status);
        });
    }



    deleteEventInvitation(id) {
        combineLatest([
            this.translate.get('guests_list_page.delete_invitation_popup.header'),
            this.translate.get('guests_list_page.delete_invitation_popup.message')
        ]).subscribe((res) => {
            this.commonService.presentAlertConfirm({
                header: res[0],
                message: res[1],
            }, () => {
                this.rest.deleteEventInvitation(id).subscribe((res) => {
                    this.commonService.showToast(res.message, res.status);
                    if (res.status) {
                        for (const key in this.guests) {
                            if (Object.prototype.hasOwnProperty.call(this.guests, key)) {
                                const element = this.guests[key];
                                if (element.id == id) {
                                    this.guests.splice(key, 1);
                                }

                            }
                        }

                    }
                });
            })
        })
    }

    async closeModal() {
        (await this.modalController.getTop()).dismiss();
    }

    ionViewWillEnter() {
        // console.log(this.invitationForm);
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
