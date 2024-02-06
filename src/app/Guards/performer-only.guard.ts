import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CommonService } from '../Services/common.service';

@Injectable({
    providedIn: 'root'
})
export class PerformerOnlyGuard implements CanActivate {
    constructor(
        private router: Router,
        private storage: Storage,
        private translate: TranslateService,
        private commonService: CommonService,
    ) {

    }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.storage.get('BC_PLUS_USER').then((user) => {
            // console.log('user', user);
            if (user) {
                if (user.status == '0') {
                    this.router.navigate(['/verification-pending'])
                    return false;
                }
                if (user.role == '2') {
                    return true;
                }
                this.translate.get('only_performer_allowed_error').subscribe((res) => {
                    this.commonService.showToast(res, false);
                })

                this.router.navigateByUrl('/error')
                return false;
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
