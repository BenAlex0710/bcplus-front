import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllFirendListPage } from './all-friend-list.page';

describe('AllFirendListPage', () => {
  let component: AllFirendListPage;
  let fixture: ComponentFixture<AllFirendListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllFirendListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllFirendListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
