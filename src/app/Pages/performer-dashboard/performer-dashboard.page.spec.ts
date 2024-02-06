import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PerformerDashboardPage } from './performer-dashboard.page';

describe('PerformerDashboardPage', () => {
  let component: PerformerDashboardPage;
  let fixture: ComponentFixture<PerformerDashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformerDashboardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PerformerDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
