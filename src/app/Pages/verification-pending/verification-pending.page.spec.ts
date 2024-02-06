import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerificationPendingPage } from './verification-pending.page';

describe('VerificationPendingPage', () => {
    let component: VerificationPendingPage;
    let fixture: ComponentFixture<VerificationPendingPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [VerificationPendingPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(VerificationPendingPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
