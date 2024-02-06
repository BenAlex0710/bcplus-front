import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StripeModalPage } from './stripe-modal.page';

describe('StripeModalPage', () => {
  let component: StripeModalPage;
  let fixture: ComponentFixture<StripeModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StripeModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
