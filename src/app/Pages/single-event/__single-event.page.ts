import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { AgoraService } from 'src/app/Services/agora.service';
import { CommonService } from 'src/app/Services/common.service';
import { RestService } from 'src/app/Services/rest.service';
import { SocketService } from 'src/app/Services/socket.service';
import { StripeModalPage } from '../stripe-modal/stripe-modal.page';
import videojs from 'video.js';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-single-event',
    templateUrl: './single-event.page.html',
    styleUrls: ['./single-event.page.scss'],
})
export class SingleEventPage implements OnInit {

    event_info;
    rtc_token;
    rtc_channel;
    hostIsLive = false;
    raw_info;
    start_timer;
    start_timer_interval;
    end_timer;
    end_timer_interval;
    enableStream = false;
    enableJoining = false;
    canPublish = false;
    canPublishGuest = false;
    messages: any;
    comments: any;
    room: any;
    messageSubscriptions: any;
    commentLoadMoreBtn;
    attendees;
    guests;
    guestRecord;
    enrollementRecord;
    reviewForm: FormGroup;
    fbStreamFrom: FormGroup;
    ytStreamFrom: FormGroup;
    joined = false;
    live_data;
    rtc_uid: any;
    fbStreaming = false;
    ytStreaming = false;

    stars = new Array(5);

    reviewLoadMoreBtn = false;
    reviewParams = {
        page: 1
    };
    review_posted;

    commentParams = {
        page: 1
    }
    fbModal: boolean;
    ytModal: boolean;

    constructor(
        public app: AppComponent,
        private rest: RestService,
        private commonService: CommonService,
        private socketService: SocketService,
        public agora: AgoraService,
        public translate: TranslateService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private modalController: ModalController,
    ) {
        this.agora.playerID = "streamPlayer";

        this.reviewForm = this.formBuilder.group({
            review: [''],
            stars: [],
        });

        this.fbStreamFrom = this.formBuilder.group({
            stream_key: ['', [Validators.required]],
            server_url: ['', [Validators.required]],
        });

        this.ytStreamFrom = this.formBuilder.group({
            stream_key: ['', [Validators.required]],
            server_url: ['', [Validators.required]],
        });

        for (let index = 0; index < 5; index++) {
            this.stars[index] = "bi-star";
        }

    }

    get reviewFormControls() {
        return this.reviewForm.controls;
    }
    get fbStreamFromControls() {
        return this.fbStreamFrom.controls;
    }
    get ytStreamFromControls() {
        return this.ytStreamFrom.controls;
    }

    newUserJoinSubscription() {
        this.socketService.newUserJoinedEvent().subscribe((data) => {
            console.log('newUserJoinSubscription', data);
            if (data.user_id == this.event_info.performer.id) {
                this.event_info.live_status = 'live';
                this.join();
            }
        })
    }

    userLeavedSubscription() {
        this.socketService.userLeavedEvent().subscribe((data) => {
            console.log('userLeavedEvent', data);
            if (data.user_id == this.event_info.performer.id) {
                this.leave();
                this.getEventInfo(this.event_info.id);
            }
        })
    }

    setStarsValue(current) {
        // console.log(current);
        this.reviewForm.get('stars').setValue(current + 1)
        for (let index = 0; index < 5; index++) {
            if (index < current + 1) {
                this.stars[index] = 'bi-star-fill';
            } else {
                this.stars[index] = "bi-star";
            }
        }
    }

    addReview() {
        this.rest.addEventReview(this.event_info.id, this.reviewForm.value).subscribe((res) => {
            if (res.status) {
                this.getEventInfo(this.event_info.id);
                // res.data.review.reviewer = this.app.userinfo;
                // this.event_info.reviews.unshift(res.data.review);
                // this.reviewForm.reset();
                // for (let index = 0; index < 5; index++) {
                //     this.stars[index] = "bi-star";
                // }
            } else {
                this.commonService.setFormErrors(this.reviewForm, res);
            }
        });
    }


    loadMoreReviews() {
        this.reviewParams.page++;
        this.rest.getPerformerReviewList(this.event_info.id, this.reviewParams).subscribe((res) => {
            if (res.status) {
                if (res.data.reviews.length == 20) {
                    this.reviewLoadMoreBtn = true;
                } else {
                    this.reviewLoadMoreBtn = false;
                }
                for (const review of res.data.reviews) {
                    this.event_info.reviews.push(review);
                }
            }
        });
    }

    setStartTimers() {
        let diff_in_days, diff_in_hours, diff_in_min, rest_hours, rest_seconds, rest_mins, time_out;
        let date = new Date();
        let current_time = (date.getTime() + (date.getTimezoneOffset() * 60000)) / 1000;
        let start_time = new Date(this.raw_info.start_time).getTime() / 1000;

        time_out = start_time - current_time;

        if (time_out <= this.app.eventsTimeOptions.stream_early_time) {
            if (this.app.userinfo && this.event_info.user_id == this.app.userinfo.id) {
                this.enableStream = true;
            } else {
                this.enableJoining = true;
            }
        }

        this.start_timer_interval = setInterval(() => {
            diff_in_days = parseInt((time_out / (60 * 60 * 24)).toString());
            /*  if (diff_in_days >= 1) {
                 this.start_timer = diff_in_days + ' days';
                 clearInterval(timer);
                 return;
             } */
            rest_hours = parseInt((time_out % (60 * 60 * 24)).toString());
            diff_in_hours = parseInt((rest_hours / (60 * 60)).toString());
            rest_mins = parseInt((time_out % (60 * 60)).toString());
            diff_in_min = parseInt((rest_mins / 60).toString());
            rest_seconds = parseInt((time_out % 60).toString());

            this.start_timer = diff_in_days + 'd ' + diff_in_hours.toString().padStart(2, 0) + 'h ' + diff_in_min.toString().padStart(2, 0) + 'm ' + rest_seconds.toString().padStart(2, 0) + 's';
            if (time_out <= this.app.eventsTimeOptions.stream_early_time) {
                if (this.app.userinfo && this.event_info.user_id == this.app.userinfo.id) {
                    this.enableStream = true;
                } else {
                    this.enableJoining = true;
                }
            }
            // console.log('sdhgsd', time_out);
            if (time_out <= 0) {
                this.start_timer = undefined;
                clearInterval(this.start_timer_interval);
                return;
            }
            time_out--;
        }, 1000);
    }

    setEndTimers() {
        let diff_in_hours, diff_in_min, rest_seconds, rest_mins, time_out;
        let date = new Date();
        let current_time = (date.getTime() + (date.getTimezoneOffset() * 60000)) / 1000;
        let end_time = new Date(this.raw_info.end_time).getTime() / 1000;

        time_out = end_time - current_time;

        this.end_timer_interval = setInterval(() => {
            diff_in_hours = parseInt((time_out / (60 * 60)).toString());
            rest_mins = parseInt((time_out % (60 * 60)).toString());
            diff_in_min = parseInt((rest_mins / 60).toString());
            rest_seconds = parseInt((time_out % 60).toString());

            if (time_out <= this.app.eventsTimeOptions.stream_auto_leave_timeout && !this.start_timer) {
                this.end_timer = diff_in_hours.toString().padStart(2, 0) + ':' + diff_in_min.toString().padStart(2, 0) + ':' + rest_seconds.toString().padStart(2, 0);
            }
            // console.log('sdhgsd', time_out);
            if (time_out <= 0) {
                this.end_timer = undefined;
                this.enableStream = false;
                // this.enableStream = true;
                this.enableJoining = false;
                clearInterval(this.end_timer_interval);
                return;
            }
            time_out--;
        }, 1000);
    }

    async startVideoStream() {
        this.canPublish = true;
        await this.agora.startVideoStream(this.rtc_token, this.rtc_channel);
        // .then(result => {
        //     console.warn(result);
        // });
    }

    async cancelPreview() {
        this.canPublish = false;
        this.event_info.live_status = 'upcoming';
        this.agora.cancelPreview();
    }

    publishVideoStream() {
        this.socketService.joinEvent({
            user_id: this.app.userinfo.id.toString(),
            event_id: this.event_info.id.toString()
        }, (data, error) => {
            // console.log(data, error)
            if (error) {
                this.enableStream = false;
                this.translate.get('single_event.you_are_already_live').subscribe((res) => {
                    this.commonService.showToast(res, false);
                })
            } else {
                this.agora.publishStream().then(() => {
                    this.rest.eventStartStream(this.event_info.id).subscribe((res) => {
                        if (res.status) {
                            this.event_info.live_status = 'live';
                        }
                        this.commonService.showToast(res.message, res.status);
                    })
                });
            }
        });
    }

    async publishToSocial(type) {
        if (type == 'facebook') {
            if (this.fbStreamFrom.valid) {
                let url = this.fbStreamFrom.get('server_url').value;
                let key = this.fbStreamFrom.get('stream_key').value;
                let full_url = url + key;
                // this.commonService.showLoader();
                this.agora.publishOnSocial(this.rtc_uid, full_url);
                this.fbStreaming = true;
                this.fbModal = false;
            }
        }
        if (type == 'youtube') {
            if (this.ytStreamFrom.valid) {
                let url = this.ytStreamFrom.get('server_url').value;
                let key = this.ytStreamFrom.get('stream_key').value;
                let full_url = url + key;
                this.agora.publishOnSocial(this.rtc_uid, full_url);
                this.ytStreaming = true;
                this.ytModal = false;
            }
        }
    }

    stopSocialStreaming(type) {
        if (type == 'facebook') {
            this.fbStreaming = false;
            let url = this.fbStreamFrom.get('server_url').value;
            let key = this.fbStreamFrom.get('stream_key').value;
            let full_url = url + key;
            this.agora.stopPublishOnSocial(full_url);
        }
        if (type == 'youtube') {
            this.ytStreaming = false;
            let url = this.ytStreamFrom.get('server_url').value;
            let key = this.ytStreamFrom.get('stream_key').value;
            let full_url = url + key;
            this.agora.stopPublishOnSocial(full_url);
        }
    }

    endStream() {
        this.rest.eventEndStream(this.event_info.id).subscribe((res) => {
            if (res.status) {
                this.agora.leave().then(() => {
                    this.getEventInfo(this.event_info.id);
                    this.socketService.leaveEvent({
                        user_id: this.app.userinfo.id.toString(),
                        event_id: this.event_info.id.toString()
                    }, (data, error) => {
                        console.log('leaveEvent', data, error)
                    });
                });
            }
            this.commonService.showToast(res.message, res.status);
        });

    }

    async join() {
        this.joined = true;
        await this.agora.join(this.rtc_token, this.rtc_channel);
        // if (Object.prototype.hasOwnProperty.call(this.agora.remoteUsers, 'uid')) {
        //     console.warn(this.agora.remoteUsers['uid']);
        // }
    }

    async startVideoStreamGuest() {
        this.canPublishGuest = true;
        await this.agora.join(this.rtc_token, this.rtc_channel);
    }

    publishVideoStreamGuest() {
        this.socketService.joinEvent({
            user_id: this.app.userinfo.id.toString(),
            event_id: this.event_info.id.toString()
        }, (data, error) => {
            // console.log(data, error)
            if (error) {
                this.enableStream = false;
                this.translate.get('single_event.you_are_already_live').subscribe((res) => {
                    this.commonService.showToast(res, false);
                })
            } else {
                this.agora.publishStream().then(() => {
                    this.rest.eventStartStreamGuest(this.event_info.id).subscribe((res) => {
                        if (res.status) {
                            this.event_info.live_status = 'live';
                        }
                        this.commonService.showToast(res.message, res.status);
                    })
                });
            }
        });
    }

    async leave() {
        await this.agora.leave();
    }

    sendMessage(chatMsgInput, chatMsgInputWrapper) {
        // console.log(chatMsgInput.value);
        if (chatMsgInput.value.trim() == '') {
            return;
        }
        if (!this.messages) {
            this.messages = [];
        }
        let message_data = {
            id: "",
            message: chatMsgInput.value.trim(),
            room: this.event_info.id,
            user: this.app.userinfo
        }
        // this.socketService.sendChatMessage(message_data);

        let data = {
            message: chatMsgInput.value.trim(),
            parent_comment_id: 0
        }

        this.rest.insertEventComment(this.event_info.id, data).subscribe((res) => {
            if (res.status) {
                message_data.id = res.data.message_id;
                this.socketService.sendChatMessage(message_data);
            } else {
                this.messages.pop();
                this.commonService.showToast(res.message, false);
            }
        });

        this.messages.push(message_data);
        this.autoScroll();
        chatMsgInput.value = "";
        setTimeout(() => {
            this.textAreaAdjust(chatMsgInput, chatMsgInputWrapper)
        }, 100);
    }

    textAreaAdjust(chatMsgInput, chatMsgInputWrapper) {
        // console.log(chatMsgInput);
        // return;
        let height = chatMsgInput.scrollHeight;
        if (chatMsgInput.value.length == "0") {
            height = 40;
            // chatMsgInput.scrollHeight = height;
        }
        // console.log('chat input', chatMsgInput)
        // chatMsgInput.style.height = "1px";
        chatMsgInput.style.height = height + "px";
        // chatMsgInputWrapper.style.height = "1px";
        chatMsgInputWrapper.style.height = (height + 30) + "px";
    }

    autoScroll() {
        setTimeout(() => {
            let scrollabale = document.querySelector('.chat-messages');
            if (scrollabale) {
                scrollabale.scrollTo({
                    top: scrollabale.scrollHeight,
                    left: 0,
                    behavior: 'smooth'
                });
            }
        }, 100);
        // console.log(scrollabale.scrollHeight)
    }

    messageScrolled(scrollabale) {
        if (scrollabale.scrollTop == 0 && this.commentLoadMoreBtn) {
            this.commentParams.page++;
            this.rest.getEventCommentsList(this.event_info.id, this.commentParams).subscribe((res) => {
                if (res.status) {
                    if (res.data.comments.length == 20) {
                        this.commentLoadMoreBtn = true;
                    } else {
                        this.commentLoadMoreBtn = false;
                    }
                    for (const comment of res.data.comments) {
                        this.messages.unshift(comment);
                    }
                }
            });
        }
    }

    addComment(input, button, parent_comment = null) {
        if (input.value.trim() == '' || !this.app.userinfo) {
            return false;
        }
        input.readOnly = true;
        button.disabled = true;
        let parent_comment_id = 0;
        // console.log(input, button);
        if (parent_comment != null) {
            parent_comment_id = parent_comment.id
        }
        let data = {
            message: input.value,
            parent_comment_id: parent_comment_id
        }
        this.rest.insertEventComment(this.event_info.id, data).subscribe((res) => {
            if (res.status) {
                if (parent_comment != null) {
                    parent_comment.replies.unshift({
                        id: res.data.id,
                        message: input.value,
                        room: this.event_info.id,
                        user: this.app.userinfo,
                        created_at: new Date()
                    })
                    parent_comment.reply_box = false;
                } else {
                    this.comments.unshift(res.data.comment)
                }
            } else {
                this.commonService.showToast(res.message, false);
            }
            input.readOnly = false;
            input.value = '';
            button.disabled = false;
        });
    }

    loadMoreComments() {
        this.commentParams.page++;
        this.rest.getEventCommentsList(this.event_info.id, this.commentParams).subscribe((res) => {
            if (res.status) {
                if (res.data.comments.length == 20) {
                    this.commentLoadMoreBtn = true;
                } else {
                    this.commentLoadMoreBtn = false;
                }
                for (const comment of res.data.comments) {
                    this.comments.push(comment);
                }
            }
        });
    }

    async enrollasAttendee() {
        const myModal = await this.modalController.create({
            component: StripeModalPage,
            cssClass: 'stripe-cc-form',
            componentProps: {
                eventData: this.event_info
            }
        });
        return await myModal.present();
    }

    getEventInfo(event_id) {
        this.rest.getEventInfo(event_id).subscribe((res) => {
            if (!res.status) {
                this.router.navigate(['/error']);
            } else {
                this.raw_info = res.data.raw_data;
                this.event_info = res.data.event_info;
                this.rtc_token = res.data.rtc_token;
                this.rtc_channel = res.data.rtc_channel;
                this.comments = this.event_info.comments;
                this.attendees = res.data.attendees;
                this.guests = res.data.guests;
                this.review_posted = res.data.review_posted;
                this.live_data = res.data.live_data;
                this.rtc_uid = res.data.rtc_uid;

                this.agora.setAppId(res.data.app_id);

                this.newUserJoinSubscription();
                this.userLeavedSubscription();
                // https://bcplus-live-streaming.s3.amazonaws.com/03232022FirstTestEvent/ea28dcbec148dc9cc20f6fb0a9b7a1f6_c4ca4238a0b923820dcc509a6f75849b.m3u8

                // this.live_data.forEach((video, index) => {
                //     this.live_data[index].video_url = 'https://bcplus-live-streaming.s3.amazonaws.com/03232022FirstTestEvent/' + video.sid + '_' + this.rtc_channel + '.m3u8';
                // });
                // console.log(this.live_data);

                this.attendees.forEach(attendee => {
                    if (this.app.userinfo && attendee.user_id == this.app.userinfo.id) {
                        this.enrollementRecord = attendee;
                    }
                });
                this.guests.forEach(guest => {
                    if (this.app.userinfo && guest.user_id == this.app.userinfo.id) {
                        this.guestRecord = guest;
                    }
                });

                if (this.event_info.live_status == 'live') {

                    if (this.event_info.user_id == this.app.userinfo.id) {
                        this.startVideoStream();
                        setTimeout(() => {
                            this.publishVideoStream();
                        }, 3000);
                    }

                    if (this.enrollementRecord) {
                        setTimeout(() => {
                            this.join();
                        }, 5000);
                    }
                    if (this.guestRecord) {
                        this.startVideoStreamGuest();
                        setTimeout(() => {
                            this.publishVideoStreamGuest();
                        }, 3000);
                    }

                }

                if (this.event_info.live_status == 'published') {
                    setTimeout(() => {
                        videojs("#my-video");
                    }, 500);
                }

                this.messages = this.event_info.comments.slice().reverse();
                this.autoScroll();

                if (this.comments.length == 20) {
                    this.commentLoadMoreBtn = true
                }

                this.app.setPageTitle(this.event_info.title);
                this.setStartTimers();
                this.setEndTimers();

                if (this.app.userinfo) {
                    this.socketService.joinChatRoom({ username: this.app.userinfo.username, room: this.event_info.id });
                }

                this.messageSubscriptions = this.socketService.onNewMessage().subscribe((message: any) => {
                    // message.user = message.username;
                    // delete message.username;
                    console.log(message);
                    if (message.room != this.event_info.id) {
                        return;
                    }

                    if (!this.messages) {
                        this.messages = [];
                    }
                    // return;
                    this.messages.push(message);
                    this.autoScroll();
                });
            }
        })
    }

    ionViewWillEnter() {
        let event_id = this.activatedRoute.snapshot.paramMap.get('id');
        this.getEventInfo(event_id);
    }

    ionViewWillLeave() {
        if (this.app.userinfo) {
            this.socketService.leaveChatRoom({ username: this.app.userinfo.username, room: this.event_info.id });
        }
        this.event_info = undefined;
        this.raw_info = undefined;
        clearInterval(this.start_timer_interval);
        clearInterval(this.end_timer_interval);
        this.enrollementRecord = false;
    }

    ngOnInit() {
    }

}
