import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { io } from 'socket.io-client';

import * as socketIo from 'socket.io-client';

// const SERVER_URL = 'http://54.165.53.79:5555';
// const SERVER_URL = 'https://bcplusnews.com:5555';
const SERVER_URL = 'http://localhost:5555';

@Injectable({
    providedIn: 'root'
})

export class SocketService {

    private socket;
    constructor() {
        this.initSocket();
    }

    public initSocket() {
        if (typeof this.socket == 'undefined') {
            this.socket = socketIo(SERVER_URL);
        }
    }

    public joinEvent(data, callback) {
        this.socket.emit("joinEvent", data, error => {
            callback(data, error);
        });
    }

    public sendPeerId(data, callback) {
        this.socket.emit("sendPeerId", data, error => {
            callback(data, error);
        });
    }
    public sendPeerIdOnCall(data, callback) {
        this.socket.emit("sendPeerIdOnCall", data, error => {
            callback(data, error);
        });
    }

    public leaveEvent(data, callback) {
        this.socket.emit("leaveEvent", data, error => {
            // console.log(data, error);
            callback(data, error)
        });
    }

    public checkLiveStatus(data, callback) {
        this.socket.emit("liveStatus", data, (user) => {
            callback(user)
        });
    }

    public newUserJoinedEvent(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('newUserJoinedEvent', (data: any) => observer.next(data));
        });
    }

    public userLeavedEvent(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('userLeavedEvent', (data: any) => observer.next(data));
        });
    }

    /* public trgiggerEvent(options) {
        this.socket.emit("eventTrgiggered", options, error => {
            if (error) {
                alert(error);
            } else {
                // console.log(options);
            }
        });
    } */

    public sendChatMessage(data: any): void {
        this.socket.emit("sendChatMessage", data, error => {
            if (error) {
                return console.log(error);
            } else {
            }
        });
    }


    public onNewMessage(): Observable<any> {
        return new Observable<any>(observer => {
            console.log("onNewMessage runnn")
            this.socket.on('newMessage', (data: any) => observer.next(data));
        });
    }
    public onFriendPeerId(): Observable<any> {
        return new Observable<any>(observer => {
            console.log("friendPeerId runnn")
            this.socket.on('friendPeerId', (data: any) => observer.next(data));
        });
    }
    public requestForPeerId(): Observable<any> {
        return new Observable<any>(observer => {
            console.log("requestForPeerId runnn")
            this.socket.on('requestForPeerId', (data: any) => observer.next(data));
        });
    }
    public onEvent(event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, (data: any) => observer.next(data));
        });
    }

    public onDisconnect(): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on('disconnect', () => observer.next());
        });
    }

    public onConnect(): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on('connect', () => observer.next());
        });
    }


}
