import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
    providedIn: 'root'
})

export class RestService {

    constructor(
        private http: HttpClient,
        public storage: Storage,
        public router: Router,
        private commanService: CommonService
    ) {

    }

    homePage(): Observable<any> {
        this.commanService.showLoader();
        return this.http.get('home')
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Home Page Data'))
            );
    }

    register(data): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('register', data)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Register User'))
            );
    }

    login(data): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('login', data)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Login User'))
            );
    }

    resendVerificationEmail(): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('resend-verification-email', {})
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Resend Verification Email'))
            );
    }

    resetPassword(data): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('send-new-password', data)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Send New Password'))
            );
    }

    socialLogin(data): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('social-login', data)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Social Login'))
            );
    }

    getSettings(): Observable<any> {
        // this.commanService.showLoader();
        return this.http.get('get-settings')
            .pipe(
                tap((res) => {
                    console.log(res);
                    // this.commanService.hideLoader();
                }),
                catchError(this.handleError('Get Settings'))
            );
    }

    getProfile(): Observable<any> {
        return this.http.get('profile')
            .pipe(
                tap((res) => {
                    console.log(res);
                }),
                catchError(this.handleError('Get Profile'))
            );
    }

    getAttendeesList(params): Observable<any> {
        let url = this.commanService.setParams('attendees-list', params);
        this.commanService.showLoader();
        return this.http.get(url)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Get Attendees List'))
            );
    }
    getGuestsList(params): Observable<any> {
        let url = this.commanService.setParams('guests-list', params);
        this.commanService.showLoader();
        return this.http.get(url)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Get Guests List'))
            );
    }
    /* getPerformerDashboard(params): Observable<any> {
        let url = this.commanService.setParams('performer-dashboard', params);
        this.commanService.showLoader();
        return this.http.get(url)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Get Performer Dashboard'))
            );
    } */

    updateProfile(data): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('update-profile', data)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Update Profile'))
            );
    }

    changePassword(data): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('change-password', data)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Change Password'))
            );
    }

    getPackages(type): Observable<any> {
        this.commanService.showLoader();
        return this.http.get('packages/' + type)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Get Packages'))
            );
    }

    activateTrialPackage(): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('packages/activate-trial', {})
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Activate Trial Package'))
            );
    }


    packagePayment(package_id, data): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('packages/' + package_id + '/payment', data)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Package Payment'))
            );
    }

    getPackageOrders(params): Observable<any> {
        let url = this.commanService.setParams('package-orders', params);
        this.commanService.showLoader();
        return this.http.get(url)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Get Package Orders'))
            );
    }

    activatePackage(order_id): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('package-order/activate/' + order_id, {})
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Activate Package'))
            );
    }

    getPerformersList(): Observable<any> {
        // this.commanService.showLoader();
        return this.http.get('performers-list')
            .pipe(
                tap((res) => {
                    console.log(res);
                    // this.commanService.hideLoader();
                }),
                catchError(this.handleError('Get Performers List'))
            );
    }

    createEvent(data): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('create-event', data)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Create Event'))
            );
    }

    getGoLiveToken(performer_username): Observable<any> {
        this.commanService.showLoader();
        return this.http.get('golive-token/' + performer_username)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Go Live Token'))
            );
    }

    startLiveStream(data): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('golive/start-stream', data)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Start Live Stream'))
            );
    }

    getEvents(params): Observable<any> {
        let url = this.commanService.setParams('events', params);
        this.commanService.showLoader();
        return this.http.get(url)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Get Events'))
            );
    }

    getEventInfo(id): Observable<any> {
        this.commanService.showLoader();
        return this.http.get('event-info/' + id)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Get Event Info'))
            );
    }

    eventStartStream(id, data): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('event/' + id + '/start-stream', data)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Event Start Stream'))
            );
    }


    eventStartStreamGuest(id): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('event/' + id + '/guest-start-stream', {})
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Event Start Stream Guest'))
            );
    }

    eventEndStream(id): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('event/' + id + '/end-stream', {})
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Event End Stream'))
            );
    }

    eventEndStreamGuest(id): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('event/' + id + '/guest-end-stream', {})
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Event End Stream Guest'))
            );
    }

    updateEvent(id, data): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('update-event/' + id, data)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Create Event'))
            );
    }

    searchEvents(params): Observable<any> {
        let url = this.commanService.setParams('search-events', params);
        this.commanService.showLoader();
        return this.http.get(url)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Search Events'))
            );
    }

    addEventAttendee(event_id, data): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('event/' + event_id + '/attendee/add', data)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Add Event Attendee'))
            );
    }

    insertEventComment(event_id, data): Observable<any> {
        return this.http.post('event/' + event_id + '/comment/insert', data)
            .pipe(
                tap((res) => {
                    console.log(res);
                }),
                catchError(this.handleError('Insert Event Comment'))
            );
    }

    getEventCommentsList(event_id, params): Observable<any> {
        let url = this.commanService.setParams('event/' + event_id + '/comment/list', params);
        this.commanService.showLoader();
        return this.http.get(url)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Get Event Comments'))
            );
    }

    sendEventInvitations(data): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('event/invitations/send', data)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Send Event Invatation'))
            );
    }

    sendEventInvitationsMailAgain(id): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('event/invitations/send-mail/' + id, {})
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Send Event Invatation Mail Again'))
            );
    }

    deleteEventInvitation(id): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('event/invitations/delete/' + id, {})
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Delete Event Invatation'))
            );
    }

    getEventInvitations(params): Observable<any> {
        let url = this.commanService.setParams('event/invitations', params);
        this.commanService.showLoader();
        return this.http.get(url)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Get Event Comments'))
            );
    }

    acceptInvitation(id): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('event/invitation/accept/' + id, {})
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Accept Invitation'))
            );

    }

    rejectInvitation(id): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('event/invitation/reject/' + id, {})
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Reject Invitation'))
            );
    }

    getPageData(slug): Observable<any> {
        this.commanService.showLoader();
        return this.http.get('page/' + slug)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Get Page Data'))
            );
    }

    getPerformerProfile(username): Observable<any> {
        this.commanService.showLoader();
        return this.http.get('performer/' + username)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Get Performer Profile'))
            );
    }

    addEventReview(event_id, data): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('event/' + event_id + '/add-review', data)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Add Event Review'))
            );
    }
    getfriendrequestList(user_id): Observable<any> {
        this.commanService.showLoader();
        return this.http.get('friend-pending-list/' + user_id)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Get friend request List'))
            );
    }
    getfriendList(user_id): Observable<any> {
        this.commanService.showLoader();
        return this.http.get('friend-list/' + user_id)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Get friend request List'))
            );
    }
    getBlockList(user_id): Observable<any> {
        this.commanService.showLoader();
        return this.http.get('get-blocked-user/' + user_id)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Get friend request List'))
            );
    }
    checkFriendStatus(user_id,friend_id): Observable<any> {
        this.commanService.showLoader();
        return this.http.get(`check-friend-request/${user_id}/${friend_id}`)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('check Friend Status'))
            );
    }

    getPerformerReviewList(username, params): Observable<any> {
        let url = this.commanService.setParams('performer/' + username + '/get-reviews', params);
        this.commanService.showLoader();
        return this.http.get(url)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Get Performer Reviews'))
            );
    }

    getPerformerEventsList(username, params): Observable<any> {
        let url = this.commanService.setParams('performer/' + username + '/get-events', params);
        this.commanService.showLoader();
        return this.http.get(url)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Get Performer Events'))
            );
    }

    sendSupportMessage(data): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('performer-support/send-message', data)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Performer Send Message'))
            );
    }

    getConversations(params): Observable<any> {
        this.commanService.showLoader();
        let url = this.commanService.setParams('performer-support/messages', params);
        return this.http.get(url)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('get Conversation'))
            );
    }

    saveEvent(data): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('save-event', data)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Save Event'))
            );
    }

    removeEvent(id): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('remove-event/' + id, {})
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Remove Event'))
            );
    }

    getSavedEvents(params): Observable<any> {
        this.commanService.showLoader();
        let url = this.commanService.setParams('saved-events', params);
        return this.http.get(url)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('get Conversation'))
            );
    }
    sendFriendRequest( data): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('send-friend-request/', data)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Add Event Review'))
            );
    }
    acceptFriendRequest(id, data): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('accept-friend-request/'+id, data)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('Add Event Review'))
            );
    }
    sendUserMessage(data): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('create/message', data)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('send User Message'))
            );
    }
    createpost(data): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('create/post', data)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('send User Message'))
            );
    }
    likepost(post_id,data): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('like/post/'+post_id, data)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('send User Message'))
            );
    }
    commentpost(post_id,data): Observable<any> {
        this.commanService.showLoader();
        return this.http.post('comment/post/'+post_id, data)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('send User Message'))
            );
    }
    getuserposts(obj): Observable<any> {
        this.commanService.showLoader();
        return this.http.get(`getpost/${obj.user_id}`)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('get Conversation'))
            );
    }
    getUserConversations(params,obj): Observable<any> {
        this.commanService.showLoader();
        let url = this.commanService.setParams(`user-message/${obj.friend_id}/${obj.user_id}`, params);
        return this.http.get(url)
            .pipe(
                tap((res) => {
                    console.log(res);
                    this.commanService.hideLoader();
                }),
                catchError(this.handleError('get Conversation'))
            );
    }
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            this.commanService.hideLoader();
            if (error.status === 401) {
                // this.logout();
            } else {
                console.log(error);
                // this.router.navigate(['error']);
            }
            return of(result as T);
        };
    }
}
