import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Storage } from '@ionic/storage';
import { from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GuestonlyGuard implements CanActivate {
    constructor(
        private storage: Storage,
        private router: Router
    ) {

    }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        // this.storage.remove('USER');
        return this.storage.get('BC_PLUS_USER').then((user) => {
            if (!user) {
                return true;
            } else {
                this.router.navigate(['/index'])
                return false;
            }
        });
    }

}
