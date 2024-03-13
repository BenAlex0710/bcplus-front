import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './Guards/auth.guard';
import { GuestonlyGuard } from './Guards/guestonly.guard';
import { PerformerOnlyGuard } from './Guards/performer-only.guard';

const routes: Routes = [
    {
        path: 'index',
        loadChildren: () => import('./Pages/index/index.module').then(m => m.IndexPageModule)
    },
    {
        path: 'register',
        loadChildren: () => import('./Pages/register/register.module').then(m => m.RegisterPageModule),
        canActivate: [GuestonlyGuard]
    },
    {
        path: 'login',
        loadChildren: () => import('./Pages/login/login.module').then(m => m.LoginPageModule),
        canActivate: [GuestonlyGuard]
    },
    {
        path: 'forgotpassword',
        loadChildren: () => import('./Pages/forgotpassword/forgotpassword.module').then(m => m.ForgotpasswordPageModule),
        canActivate: [GuestonlyGuard]
    },
    {
        path: 'account',
        loadChildren: () => import('./Pages/account/account.module').then(m => m.AccountPageModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'createPost',
        loadChildren: () => import('./Pages/create-post/create-post.module').then(m => m.CreatePostPageModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'allPost',
        loadChildren: () => import('./Pages/all-post/all-post.module').then(m => m.AllPostPageModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'verification-pending',
        loadChildren: () => import('./Pages/verification-pending/verification-pending.module').then(m => m.VerificationPendingPageModule),
        // canActivate: [AuthGuard]
    },
    {
        path: 'packages',
        loadChildren: () => import('./Pages/packages/packages.module').then(m => m.PackagesPageModule),
        canActivate: [AuthGuard, PerformerOnlyGuard]
    },
    {
        path: 'package-orders',
        loadChildren: () => import('./Pages/package-orders/package-orders.module').then(m => m.PackageOrdersPageModule),
        canActivate: [AuthGuard, PerformerOnlyGuard]
    },
    {
        path: 'create-event',
        loadChildren: () => import('./Pages/create-event/create-event.module').then(m => m.CreateEventPageModule),
        canActivate: [AuthGuard, PerformerOnlyGuard]
    },
    {
        path: 'events',
        loadChildren: () => import('./Pages/events/events.module').then(m => m.EventsPageModule),
        canActivate: [AuthGuard, PerformerOnlyGuard]
    },
    {
        path: 'edit-event/:id/:slug',
        loadChildren: () => import('./Pages/edit-event/edit-event.module').then(m => m.EditEventPageModule),
        canActivate: [AuthGuard, PerformerOnlyGuard]
    },
    {
        path: 'event/:id/:slug',
        loadChildren: () => import('./Pages/single-event/single-event.module').then(m => m.SingleEventPageModule),
        // canActivate: [AuthGuard]
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./Pages/performer-dashboard/performer-dashboard.module').then(m => m.PerformerDashboardPageModule),
        canActivate: [AuthGuard, PerformerOnlyGuard]
    },
    {
        path: 'change-password',
        loadChildren: () => import('./Pages/change-password/change-password.module').then(m => m.ChangePasswordPageModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'attendees-list',
        loadChildren: () => import('./Pages/attendees-list/attendees-list.module').then(m => m.AttendeesListPageModule),
        canActivate: [AuthGuard, PerformerOnlyGuard]
    },
    {
        path: 'inbox/:user_id',
        loadChildren: () => import('./Pages/inbox/inbox.module').then(m => m.InboxPageModule),
        // canActivate: [AuthGuard, PerformerOnlyGuard]
    },
    {
        path: 'saved-events',
        loadChildren: () => import('./Pages/saved-events/saved-events.module').then(m => m.SavedEventsPageModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'guests-list',
        loadChildren: () => import('./Pages/guests-list/guests-list.module').then(m => m.GuestsListPageModule),
        canActivate: [AuthGuard, PerformerOnlyGuard]
    },
    {
        path: 'friend-list',
        loadChildren: () => import('./Pages/friend-list/friend-list.module').then(m => m.FriendListPageModule),
        // canActivate: [AuthGuard, PerformerOnlyGuard]
    },
    {
        path: 'all-friend-list',
        loadChildren: () => import('./Pages/all-friend-list/all-friend-list.module').then(m => m.AllFriendListPageModule),
        // canActivate: [AuthGuard, PerformerOnlyGuard]
    },
    {
        path: 'block-list',
        loadChildren: () => import('./Pages/block-list/block-list.module').then(m => m.BlockListPageModule),
        // canActivate: [AuthGuard, PerformerOnlyGuard]
    },
    {
        path: 'go-live',
        loadChildren: () => import('./Pages/go-live/go-live.module').then(m => m.GoLivePageModule),
        canActivate: [AuthGuard, PerformerOnlyGuard]
    },
    {
        path: 'channel/:username/live',
        loadChildren: () => import('./Pages/go-live/go-live.module').then(m => m.GoLivePageModule),
        canActivate: [AuthGuard]
    },

    {
        path: 'recommended-events',
        loadChildren: () => import('./Pages/recommended-events/recommended-events.module').then(m => m.RecommendedEventsPageModule),
        canActivate: [AuthGuard]
    },

    {
        path: 'channel/:username',
        loadChildren: () => import('./Pages/single-channel/single-channel.module').then(m => m.SingleChannelPageModule)
    },
    {
        path: 'search',
        loadChildren: () => import('./Pages/search/search.module').then(m => m.SearchPageModule)
    },
    {
        path: 'page/:slug',
        loadChildren: () => import('./Pages/page/page.module').then(m => m.PagePageModule)
    },
    {
        path: 'trending-events',
        loadChildren: () => import('./Pages/trending-events/trending-events.module').then(m => m.TrendingEventsPageModule)
    },
    {
        path: 'error',
        loadChildren: () => import('./Pages/error/error.module').then(m => m.ErrorPageModule)
    },
    {
        path: '',
        redirectTo: 'index',
        pathMatch: 'full'
    },
    {
        path: 'stripe-modal',
        loadChildren: () => import('./Pages/stripe-modal/stripe-modal.module').then(m => m.StripeModalPageModule)
    },
    {
        path: 'event-invitations',
        loadChildren: () => import('./Pages/event-invitations/event-invitations.module').then(m => m.EventInvitationsPageModule)
    },
    {
        path: 'invite-guests-modal',
        loadChildren: () => import('./Pages/invite-guests-modal/invite-guests-modal.module').then(m => m.InviteGuestsModalPageModule)
    },
    {
        path: '**',
        redirectTo: 'error',
        pathMatch: 'full'
    },















];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
