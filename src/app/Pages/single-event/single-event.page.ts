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
import { EmojiButton } from '@joeattardi/emoji-button';


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
    guestRecord;
    enrollementRecord;
    reviewForm: FormGroup;
    fbStreamFrom: FormGroup;
    ytStreamFrom: FormGroup;
    joined = false;
    joinedAsGuest = false;
    rtc_uid: any;
    fbStreaming = false;
    ytStreaming = false;
    liveUsers = 0;

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
    emojiPicker;
    sel;
    range;

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

        this.emojiPicker = new EmojiButton({
            position: 'bottom-start',
            style: 'twemoji',
            theme: 'dark',
            autoHide: false,
            autoFocusSearch: false
        });

        this.emojiPicker.on('emoji', (selection) => {
            let ele = document.getElementById('chat-input-div');
            // console.log(ele);
            this.restoreSelection();
            ele.focus();
            // ele.innerHTML = ele.innerHTML + '<img class="let_moji" src="' + selection.url + '">';
            let imgTag = document.createElement('img');
            imgTag.setAttribute('src', selection.url);
            imgTag.classList.add('let_moji');
            // console.log(this.sel)
            if (
                this.sel.anchorNode.parentNode.id == 'chat-input-div' ||
                this.sel.anchorNode.id == 'chat-input-div' ||
                this.sel.anchorNode.nodeName == '#text'
            ) {
                this.insertTextAtCaret(imgTag);
                let eventInput = document.createEvent('Event');
                eventInput.initEvent('input', true, true);
                ele.dispatchEvent(eventInput);
            } else {
                // console.log(this.sel)
            }

            // this.insertTextAtCaret(imgTag);
            // ele.contentEditable = "true";
            // ele.focus();
            // console.log(selection);
        });

        this.emojiPicker.on('hidden', () => {
            let ele = document.getElementById('chat-input-div');
            ele.contentEditable = "true";
        });

    }

    animateAnnouncement() {
        setTimeout(() => {

            let element = document.getElementById('marquee-item');
            if (!element) {
                return;
            }
            // console.log(element);
            let elementWidth = element.offsetWidth;
            let parentWidth = element.parentElement.offsetWidth;
            console.log(parentWidth);
            let flag = 0;

            setInterval(() => {
                element.style.marginLeft = --flag + "px";

                if (elementWidth == -flag) {
                    flag = parentWidth;
                }
            }, 10);
        }, 1000);
    }


    insertTextAtCaret(elem) {
        if (window.getSelection) {
            this.sel = window.getSelection();
            if (this.sel.getRangeAt && this.sel.rangeCount) {
                this.range = this.sel.getRangeAt(0);
                this.range.deleteContents();
                var el = document.createElement("div");
                el.appendChild(elem);
                var frag = document.createDocumentFragment(), node, lastNode;
                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                this.range.insertNode(frag);

                // console.log('lastNode', lastNode);
                if (lastNode) {
                    this.range = this.range.cloneRange();
                    this.range.setStartAfter(lastNode);
                    this.range.collapse(true);
                    this.sel.removeAllRanges();
                    this.sel.addRange(this.range);
                }
            }
        }
    }

    restoreSelection() {
        // console.log('this.restoreSelection');
        if (this.range) {
            if (window.getSelection) {
                // console.log(this.range)
                this.sel = window.getSelection();
                this.sel.removeAllRanges();
                this.sel.addRange(this.range);
            }
        }
    }

    saveSelection() {
        // console.log('this.saveSelection');
        if (window.getSelection) {
            this.sel = window.getSelection();
            if (this.sel.getRangeAt && this.sel.rangeCount) {
                // console.log(this.sel.getRangeAt(0));
                this.range = this.sel.getRangeAt(0);
                // console.log('save', this.sel, this.range);
                this.sel.anchorNode
                return this.sel.getRangeAt(0);

            }
        }
        return null;
    }

    initEmojiPicker(ele) {
        // console.log(ele);
        let editDiv = document.getElementById('chat-input-div');
        // editDiv.focus();
        this.saveSelection();
        this.emojiPicker.togglePicker(ele);
        // editDiv.contentEditable = "false";
    }

    filterPasteContent(event) {
        event.preventDefault();
        // console.log(event.clipboardData.getData('Text'))
        var span = document.createElement('span');
        span.innerHTML = event.clipboardData.getData('Text');
        this.insertTextAtCaret(span);
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
            this.liveUsers = data.total_users;
            // alert('newUserJoinSubscription' + data.toString());
            console.log('newUserJoinSubscription', data);
            if (data.user_id == this.event_info.performer.id) {
                this.event_info.live = true;
                this.animateAnnouncement();
                setTimeout(() => {
                    this.adjustVideoDimensions();
                }, 100);
            }
        })
    }

    userLeavedSubscription() {
        this.socketService.userLeavedEvent().subscribe((data) => {
            this.liveUsers = data.total_users;
            console.log('userLeavedEvent', data);
            if (data.user_id == this.event_info.performer.id) {
                this.leave();
                // this.getEventInfo(this.event_info.id);
                window.location.reload();
            }
        })
    }

    saveEvent() {
        this.rest.saveEvent({ event_id: this.event_info.id }).subscribe((res) => {
            this.commonService.showToast(res.message, res.status)
            if (res.status) {
                this.event_info.is_saved = true;
            }
        })
    }

    checkEventLiveStatus() {
        // console.warn('sdfhkjsdhfkj');
        this.socketService.checkLiveStatus({
            user_id: this.event_info.performer.id.toString(),
            room: this.event_info.id.toString()
        }, (user) => {
            // console.warn('check_live_already', user);
            if (user && user.user_id != this.app.userinfo.id) {
                this.event_info.live = true;
                this.animateAnnouncement();
                if (this.enrollementRecord || this.guestRecord) {
                    this.join();
                }
                setTimeout(() => {
                    this.adjustVideoDimensions();
                }, 100);
            } else {
                // console.log('dddd', this.event_info);
                if (this.event_info.live_status == 'published') {
                    // console.log('ffff', this.enrollementRecord, this.guestRecord, this.app.userinfo.id, this.event_info.performer.id)
                    if (this.enrollementRecord || this.guestRecord || this.app.userinfo.id == this.event_info.performer.id) {
                        setTimeout(() => {
                            videojs("#my-video");
                        }, 500);
                    }
                } else {
                    if (this.enrollementRecord || this.guestRecord) {
                        this.join();
                    }
                }
            }
        });
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
            // console.log(this.app.eventsTimeOptions.stream_auto_leave_timeout, time_out);
            if (time_out <= this.app.eventsTimeOptions.stream_auto_leave_timeout && !this.start_timer) {
                this.end_timer = diff_in_hours.toString().padStart(2, 0) + ':' + diff_in_min.toString().padStart(2, 0) + ':' + rest_seconds.toString().padStart(2, 0);
            }
            // console.log('sdhgsd', time_out);
            if (time_out <= 0) {
                this.end_timer = undefined;
                this.enableStream = false;
                // this.enableStream = true;
                this.enableJoining = false;
                if (this.event_info.live) {
                    this.endStream();
                }
                clearInterval(this.end_timer_interval);
                return;
            }
            time_out--;
        }, 1000);
    }

    startVideoStream() {
        this.canPublish = true;
        this.agora.startVideoStream(this.rtc_token, this.rtc_channel)
            .then(() => {
                this.adjustVideoDimensions();
                this.animateAnnouncement();
            });
    }

    cancelPreview() {
        this.canPublish = false;
        this.agora.leave();
    }

    publishVideoStream() {
        if (this.agora.cameraAvailable && this.agora.cameraPermission && this.agora.microphoneAvailable && this.agora.microphonePermission) {
            this.socketService.checkLiveStatus({
                user_id: this.app.userinfo.id.toString(),
                room: this.event_info.id.toString()
            }, (user) => {
                console.warn('check_live_already', user);
                if (!user) {
                    this.agora.publishStream().then(() => {
                        this.rest.eventStartStream(this.event_info.id, { uid: this.agora.options.uid }).subscribe((res) => {
                            if (res.status) {
                                this.event_info.live = true;
                                this.socketService.joinEvent({
                                    user_id: this.app.userinfo.id.toString(),
                                    room: this.event_info.id.toString()
                                }, (data, error) => {
                                    // console.warn(data, error)
                                    if (error.total_users) {
                                        this.liveUsers = error.total_users;
                                    }
                                });
                            }
                            this.commonService.showToast(res.message, res.status);
                        })
                    });

                } else {
                    this.translate.get('single_event.you_are_already_live').subscribe((res) => {
                        this.commonService.showToast(res, false);
                    })
                }
            });
        } else {
            this.translate.get('single_event.allow_permissions').subscribe((res) => {
                this.commonService.showToast(res, false);
            })
        }
    }

    publishToSocial(type) {
        if (type == 'facebook') {
            if (this.fbStreamFrom.valid) {
                let url = this.fbStreamFrom.get('server_url').value;
                let key = this.fbStreamFrom.get('stream_key').value;
                let full_url = url + key;
                // this.commonService.showLoader();
                this.agora.publishOnSocial(full_url);
                this.fbStreaming = true;
                this.fbModal = false;
            }
        }
        if (type == 'youtube') {
            if (this.ytStreamFrom.valid) {
                let url = this.ytStreamFrom.get('server_url').value;
                let key = this.ytStreamFrom.get('stream_key').value;
                let full_url = url + key;
                this.agora.publishOnSocial(full_url);
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
                    this.canPublish = false;

                    this.commonService.presentAlertConfirm(
                        {
                            header: 'Thank you for creating your event with BCPlus news',
                            message: '',
                            cancelBtn: false
                        },
                        () => {
                            window.location.reload();

                        }
                    );

                    // window.location.reload();
                    // this.getEventInfo(this.event_info.id);
                    // setTimeout(() => {
                    //     videojs("#my-video");
                    // }, 500);
                    // this.socketService.leaveEvent({
                    //     user_id: this.app.userinfo.id.toString(),
                    //     room: this.event_info.id.toString()
                    // }, (data, error) => {
                    //     // console.log('leaveEvent', data, error)
                    // });
                });
            }
            this.commonService.showToast(res.message, res.status);
        });

    }

    startVideoStreamGuest() {
        this.canPublishGuest = true;
        this.agora.leave().then(() => {
            this.agora.startVideoStream(this.rtc_token, this.rtc_channel)
                .then(() => {
                    this.adjustVideoDimensions();
                });
        })
    }

    cancelPreviewGuest() {
        this.canPublishGuest = false;
        this.agora.leave().then(() => {
            this.agora.join(this.rtc_token, this.rtc_channel)
        });
    }

    publishVideoStreamGuest() {
        if (this.agora.cameraAvailable && this.agora.cameraPermission && this.agora.microphoneAvailable && this.agora.microphonePermission) {
            this.socketService.checkLiveStatus({
                user_id: 'guest_' + this.app.userinfo.id + '_' + this.event_info.id.toString(),
                room: this.event_info.id.toString()
            }, (user) => {
                console.warn('guest_live_already', user);
                if (!user) {
                    this.agora.publishStream().then(() => {
                        this.joinedAsGuest = true;
                        console.error('publishVideoStreamGuest', this.joinedAsGuest);

                        this.socketService.leaveEvent({
                            user_id: this.app.userinfo.id.toString(),
                            room: this.event_info.id.toString()
                        }, (data, error) => {
                            // console.log('leaveEvent', data, error)
                        });

                        this.socketService.joinEvent({
                            user_id: 'guest_' + this.app.userinfo.id + '_' + this.event_info.id.toString(),
                            room: this.event_info.id.toString()
                        }, (data, error) => {
                            // console.log(data, error)
                            if (error.total_users) {
                                this.liveUsers = error.total_users;
                            }
                        });
                    });

                } else {
                    this.translate.get('single_event.you_are_already_live').subscribe((res) => {
                        this.commonService.showToast(res, false);
                    })
                }
            });
        } else {
            this.translate.get('single_event.allow_permissions').subscribe((res) => {
                this.commonService.showToast(res, false);
            })
        }
    }

    endStreamGuest() {
        this.agora.leave().then(() => {
            this.joinedAsGuest = false;
            this.canPublishGuest = false;
            this.socketService.leaveEvent({
                user_id: 'guest_' + this.app.userinfo.id + '_' + this.event_info.id.toString(),
                room: this.event_info.id.toString()
            }, (data, error) => {
                // console.log('leaveEvent', data, error)
            });
            this.join();
        });
    }

    join() {
        // console.log('join_function');
        if (this.event_info.live_status == 'upcoming' || this.event_info.live) {
            this.joined = true;
            this.agora.join(this.rtc_token, this.rtc_channel).then(() => {
                this.socketService.joinEvent({
                    user_id: this.app.userinfo.id.toString(),
                    room: this.event_info.id.toString()
                }, (data, error) => {
                    console.warn('Join Event', data, error);
                    if (error.total_users) {
                        this.liveUsers = error.total_users;
                    }
                })
            })
        }
    }

    leave() {
        this.agora.leave();
    }

    sendMessage(chatMsgInput, chatMsgInputWrapper) {
        // console.log(chatMsgInput.innerHTML);
        // return;
        let message = chatMsgInput.innerHTML.trim();
        if (message == '') {
            return;
        }
        if (!this.messages) {
            this.messages = [];
        }
        let message_data = {
            id: "",
            message: message,
            room: this.event_info.id,
            user: this.app.userinfo
        }
        // this.socketService.sendChatMessage(message_data);

        let data = {
            message: message,
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
        chatMsgInput.innerHTML = "";
        setTimeout(() => {
            this.textAreaAdjust(chatMsgInput, chatMsgInputWrapper)
        }, 100);
    }

    textAreaAdjust(chatMsgInput, chatMsgInputWrapper) {
        // console.log(chatMsgInput);
        // return;
        let height = chatMsgInput.scrollHeight;
        if (chatMsgInput.InnerHtml.length == "0") {
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
                this.review_posted = res.data.review_posted;
                this.rtc_uid = res.data.rtc_uid;

                this.agora.setAppId(res.data.app_id);

                this.newUserJoinSubscription();
                this.userLeavedSubscription();

                this.event_info.attendees.forEach(attendee => {
                    if (this.app.userinfo && attendee.user_id == this.app.userinfo.id && attendee.payment_status == '1') {
                        this.enrollementRecord = attendee;
                    }
                });

                this.event_info.guests.forEach(guest => {
                    if (guest.status == '1' && this.app.userinfo && guest.user_id == this.app.userinfo.id) {
                        this.guestRecord = guest;
                    }
                });

                this.messages = this.event_info.comments.slice().reverse();
                this.autoScroll();

                if (this.comments.length == 20) {
                    this.commentLoadMoreBtn = true;
                }

                this.messageSubscriptions = this.socketService.onNewMessage().subscribe((message: any) => {
                    // message.user = message.username;
                    // delete message.username;
                    console.log('onNewMessage', message);
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


                this.app.setPageTitle(this.event_info.title);
                this.setStartTimers();
                this.setEndTimers();
                this.checkEventLiveStatus();

            }
        })
    }



    ionViewWillEnter() {
        let event_id = this.activatedRoute.snapshot.paramMap.get('id');
        this.getEventInfo(event_id);
    }

    ionViewWillLeave() {
        videojs("#my-video").dispose();
        if (this.app.userinfo) {
            this.socketService.leaveEvent({
                user_id: this.app.userinfo.username,
                room: this.event_info.id
            }, (data, error) => { });
        }
        this.messageSubscriptions.unsubscribe();
        this.event_info = undefined;
        this.raw_info = undefined;
        clearInterval(this.start_timer_interval);
        clearInterval(this.end_timer_interval);
        this.enrollementRecord = false;
    }

    adjustVideoDimensions() {
        let performerVideo = document.getElementById('performerPlayer');
        let parentElement = performerVideo.parentElement;
        let parentWidth = parentElement.clientWidth;
        let videoHeight = 480;
        let videoWidth = 640;

        if (parentWidth < 640) {
            videoHeight = (parentWidth / 1.33333);
            videoWidth = parentWidth;
        }

        performerVideo.style.height = videoHeight.toFixed() + 'px';
        performerVideo.style.width = videoWidth.toFixed() + 'px';

    }

    ngOnInit() {
    }

}
