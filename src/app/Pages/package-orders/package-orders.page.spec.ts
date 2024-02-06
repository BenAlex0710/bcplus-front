import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PackageOrdersPage } from './package-orders.page';

describe('PackageOrdersPage', () => {
  let component: PackageOrdersPage;
  let fixture: ComponentFixture<PackageOrdersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageOrdersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PackageOrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
