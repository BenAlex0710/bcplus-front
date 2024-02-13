import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { CommonService } from 'src/app/Services/common.service';
import { RestService } from 'src/app/Services/rest.service';
import { SocketService } from 'src/app/Services/socket.service';

@Component({
    selector: 'app-inbox',
    templateUrl: './inbox.page.html',
    styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {

    messages;
    chatwith="Admin"
    params = {
        page: 1
    }
    room;
    loadOlderspinner: boolean;
    loadMoreStatus = true;
    messageSubscriptions;

    constructor(
        public app: AppComponent,
        private rest: RestService,
        private router: Router,
        private commonService: CommonService,
        private socketService: SocketService,
        private activatedRoute: ActivatedRoute


    ) { }


    sendMessage(chatMsgInput, chatMsgInputWrapper) {
        // console.log(chatMsgInput.value);
        if (chatMsgInput.value.trim() == '') {
            return;
        }
        if (!this.messages) {
            this.messages = [];
        }
        let data = {
            message: chatMsgInput.value
        }
        if(this.chatwith === "admin"){

            this.rest.sendSupportMessage(data).subscribe((res) => {
                if (res.status) {
                    chatMsgInput.value = '';
                    this.textAreaAdjust(chatMsgInput, chatMsgInputWrapper)
                    this.messages.push(res.data.message);
                    this.autoScroll();
                }
                this.commonService.showToast(res.message, res.status);
            })
        }else{
            let message_data = {
                id: "",
                receiver:this.chatwith,
                sender:this.app.userinfo.id,
                message: chatMsgInput.value,
                room: this.room,
                room_id: this.room,
                user: this.app.userinfo
            }
            this.rest.sendUserMessage(message_data).subscribe((res)=>{
                chatMsgInput.value = '';
                
                this.socketService.sendChatMessage(message_data);
                this.messages.push(message_data);
                this.autoScroll();
            })
        }
    }

    textAreaAdjust(chatMsgInput, chatMsgInputWrapper) {
        let height = chatMsgInput.scrollHeight;
        if (chatMsgInput.value.length == "0") {
            height = 40;
        }
        if (height > 100) {
            height = 100;
        }
        chatMsgInput.style.height = height + "px";
        chatMsgInputWrapper.style.height = height + "px";
    }

    autoScroll() {
        setTimeout(() => {
            let scrollable = document.querySelector('.messages-container');
            scrollable.scrollBy({
                top: scrollable.scrollHeight + 1000, // could be negative value
                left: 0,
                behavior: 'smooth'
            });
        }, 100)
    }

    getConversations() {
        this.loadOlderspinner = true;

        this.rest.getConversations(this.params).subscribe((res) => {
            this.loadOlderspinner = false;
            if (res.status) {
                if (!this.messages) {
                    this.messages = [];
                }
                if (res.data.messages.length < 20) {
                    this.loadMoreStatus = false;
                }
                for (const msg of res.data.messages) {
                    this.messages.unshift(msg);
                }
            } else {
                this.commonService.showToast(res.message, false);
                // this.router.navigate(['/error']);
            }
        });
    }
    getUserConversations() {
        let obj = {
            friend_id:this.chatwith,
            user_id:this.app.userinfo.id
        }
        this.rest.getUserConversations(this.params,obj).subscribe((res) => {
            this.messages=res.messages
            if(this.messages.length){
                console.log(res)
            this.room=res.messages[0].room_id
            }
            this.socketService.joinEvent({
                user_id: this.app.userinfo.id.toString(),
                room: this.room || obj.friend_id + obj.user_id
            }, (data, error) => {
               console.log(data)
               this.subscribeMessage()
            });
        });
    }
    subscribeMessage() {
        this.messageSubscriptions = this.socketService.onNewMessage().subscribe((message: any) => {
            // message.user = message.username;
            // delete message.username;
            console.log('onNewMessage', message);
            

            if (message.room != this.room) {
                return;
            }
            // return;
            this.messages.push(message);
            this.autoScroll();
        });
    }
    loadMore(ele) {
        if (ele.scrollTop == 0 && this.loadMoreStatus) {
            this.params.page++;
            this.getConversations();
        }
    }

    ionViewWillEnter() {
        this.app.setPageTitle('inbox_page.page_title');
        let user_id = this.activatedRoute.snapshot.paramMap.get('user_id');
        if(user_id === "admin"){
            this.getConversations();
        }else{
            this.chatwith=user_id
            this.getUserConversations()
            console.log("hellooo",user_id)
        }
    }
    ionViewWillLeave() {
        this.messageSubscriptions.unsubscribe();
        this.params.page = 1;
        this.loadMoreStatus = true;
    }

    ngOnInit() {
    }

}
