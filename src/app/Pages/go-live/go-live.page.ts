import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmojiButton } from '@joeattardi/emoji-button';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { AgoraService } from 'src/app/Services/agora.service';
import { CommonService } from 'src/app/Services/common.service';
import { RestService } from 'src/app/Services/rest.service';
import { SocketService } from 'src/app/Services/socket.service';

@Component({
    selector: 'app-go-live',
    templateUrl: './go-live.page.html',
    styleUrls: ['./go-live.page.scss'],
})
export class GoLivePage implements OnInit {

    liveUsers = 0;
    tokenData;
    message;
    live_status = false;
    event_id;
    event_slug;
    performer;
    messages;
    joined = false;
    messageSubscriptions;
    emojiPicker;
    sel;
    range;

    constructor(
        public app: AppComponent,
        public agora: AgoraService,
        private rest: RestService,
        private commonService: CommonService,
        private socketService: SocketService,
        private translate: TranslateService,
        private router: Router,
        private activatedRoute: ActivatedRoute

    ) {

        this.emojiPicker = new EmojiButton({
            position: 'bottom-start',
            // style: 'twemoji',
            theme: 'dark',
            autoHide: false,
            autoFocusSearch: false
        });

        this.emojiPicker.on('emoji', (selection) => {
            console.log(selection);
            let ele = document.getElementById('chat-input-div');
            // console.log(ele);
            this.restoreSelection();
            ele.focus();

            // let imgTag = document.createElement('img');
            // imgTag.setAttribute('src', selection.url);
            // imgTag.classList.add('let_moji');
            let emojiSpan = document.createElement('span');
            emojiSpan.innerHTML = selection.emoji;
            emojiSpan.classList.add('let_native_moji');
            // console.log(this.sel)
            if (
                this.sel.anchorNode.parentNode.id == 'chat-input-div' ||
                this.sel.anchorNode.id == 'chat-input-div' ||
                this.sel.anchorNode.nodeName == '#text'
            ) {
                // this.insertTextAtCaret(imgTag);
                this.insertTextAtCaret(emojiSpan);
                let eventInput = document.createEvent('Event');
                eventInput.initEvent('input', true, true);
                ele.dispatchEvent(eventInput);
            } else {
                // console.log(this.sel)
            }

        });
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

    publishVideoStream() {
        if (this.agora.cameraAvailable && this.agora.cameraPermission && this.agora.microphoneAvailable && this.agora.microphonePermission) {
            this.socketService.checkLiveStatus({
                user_id: this.app.userinfo.id.toString(),
                room: this.app.userinfo.username
            }, (user) => {
                // console.warn('check_live_already', user);
                if (!user) {
                    this.agora.publishStream().then(() => {
                        let data = {
                            uid: this.agora.options.uid,
                            channel_name: this.tokenData.rtc_channel
                        }
                        this.rest.startLiveStream(data).subscribe((res) => {
                            if (res.status) {
                                this.event_id = res.data.event_id;
                                this.event_slug = res.data.event_slug;
                                this.live_status = true;
                                this.socketService.joinEvent({
                                    user_id: this.app.userinfo.id.toString(),
                                    room: this.app.userinfo.username
                                }, (data, error) => {
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

    endStream() {
        this.rest.eventEndStream(this.event_id).subscribe((res) => {
            if (res.status) {
                this.agora.leave().then(() => {
                    this.commonService.showToast(res.message, res.status);
                    this.live_status = false;
                    this.commonService.presentAlertConfirm(
                        {
                            header: 'Thank you for creating your event with BCPlus news',
                            message: '',
                            cancelBtn: false
                        },
                        () => {
                            this.router.navigate(['event/' + this.event_id + '/' + this.event_slug]);

                        }
                    );
                });
            }

        });

    }

    join() {
        this.agora.join(this.tokenData.rtc_token, this.tokenData.rtc_channel).then(() => {
            this.socketService.joinEvent({
                user_id: this.app.userinfo.id.toString(),
                room: this.performer.username
            }, (data, error) => {
                this.live_status = true;
                this.adjustVideoDimensions();
                // console.warn('Join Event', data, error);
                if (error.total_users) {
                    this.liveUsers = error.total_users;
                }
            })
        })
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
            room: '',
            user: this.app.userinfo
        }
        if (this.performer) {
            message_data.room = this.performer.username;
        } else {
            message_data.room = this.app.userinfo.username;

        }
        // this.socketService.sendChatMessage(message_data);

        let data = {
            message: message,
            parent_comment_id: 0
        }

        this.rest.insertEventComment(this.event_id, data).subscribe((res) => {
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

    getGoLiveToken() {
        let performer_username = this.performer ? this.performer.username : '';
        this.rest.getGoLiveToken(performer_username).subscribe((res) => {
            if (res.status) {
                this.tokenData = res.data;
                this.agora.setAppId(this.tokenData.app_id);
                if (this.performer) {
                    this.event_id = res.data.event_id;
                    this.event_slug = res.data.event_slug;
                    this.join();
                } else {
                    this.startLivePreview();
                }
            }
        })
    }

    startLivePreview() {
        this.agora.startVideoStream(this.tokenData.rtc_token, this.tokenData.rtc_channel)
            .then(() => {
                this.adjustVideoDimensions();
            });
    }

    subscribeMessage() {
        this.messageSubscriptions = this.socketService.onNewMessage().subscribe((message: any) => {
            // message.user = message.username;
            // delete message.username;
            console.log('onNewMessage', message);
            let room;

            if (this.performer) {
                room = this.performer.username;
            } else {
                room = this.app.userinfo.username;
            }

            if (message.room != room) {
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

    checkPerfomerIsLive() {
        this.socketService.checkLiveStatus({
            user_id: this.performer.id.toString(),
            room: this.performer.username
        }, (user) => {
            if (user) {
                this.getGoLiveToken();
            } else {
                // this.commonService.presentAlertConfirm(
                //     {
                //         header: 'Performer is not live now',
                //         message: '',
                //         cancelBtn: false
                //     },
                //     () => {

                //     }
                // );
            }
        });
    }

    ionViewWillEnter() {
        let performer_username = this.activatedRoute.snapshot.paramMap.get('username');
        if (performer_username == null) {
            this.getGoLiveToken();
        } else {
            this.rest.getPerformerProfile(performer_username).subscribe((res) => {
                if (res.status) {
                    this.performer = res.data.performer;
                    this.performer.social_profiles = JSON.parse(this.performer.social_profiles);
                    this.checkPerfomerIsLive();
                }
            })
        }

        this.subscribeMessage();
        // console.log(this.performer.username, this.app.userinfo);
    }

    ionViewWillLeave() {
        this.messageSubscriptions.unsubscribe();
    }


    adjustVideoDimensions() {
        setTimeout(() => {
            let performerVideo = document.getElementById('performerPlayer');
            let parentElement = performerVideo.parentElement;
            let parentWidth = parentElement.clientWidth;
            let videoHeight = 480;
            let videoWidth = 640;
            console.log(parentWidth)
            // if (parentWidth < 640) {
            videoHeight = (parentWidth / 1.33333);
            videoWidth = parentWidth;
            // }

            performerVideo.style.height = videoHeight.toFixed() + 'px';
            performerVideo.style.width = videoWidth.toFixed() + 'px';

        }, 500)

    }

    ngOnInit() {
    }

}
