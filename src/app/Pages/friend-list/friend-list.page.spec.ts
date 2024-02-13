import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FirendListPage } from './friend-list.page';

describe('FirendListPage', () => {
  let component: FirendListPage;
  let fixture: ComponentFixture<FirendListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirendListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FirendListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
