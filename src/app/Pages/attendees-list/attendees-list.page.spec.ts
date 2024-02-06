import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AttendeesListPage } from './attendees-list.page';

describe('AttendeesListPage', () => {
  let component: AttendeesListPage;
  let fixture: ComponentFixture<AttendeesListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendeesListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AttendeesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
