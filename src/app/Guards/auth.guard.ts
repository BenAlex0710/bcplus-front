import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private storage: Storage
    ) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.storage.get('BC_PLUS_USER').then((user) => {
            // console.log('user', user);
            if (user) {
                switch (user.status) {
                    case '0':
                        this.router.navigate(['/verification-pending'])
                        return false;
                        break;
                    case '1':
                        return true;
                        break;
                    default:
                        return false;
                        break;
                }
            } else {
                this.router.navigate(['/login'], {
                    queryParams: { redirect: state.url },
                    queryParamsHandling: 'merge'
                });
                return false;
            }
        });
    }
}
