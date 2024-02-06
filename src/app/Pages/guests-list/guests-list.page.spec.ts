import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GuestsListPage } from './guests-list.page';

describe('GuestsListPage', () => {
  let component: GuestsListPage;
  let fixture: ComponentFixture<GuestsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestsListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GuestsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
