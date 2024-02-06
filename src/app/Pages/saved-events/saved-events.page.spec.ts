import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SavedEventsPage } from './saved-events.page';

describe('SavedEventsPage', () => {
  let component: SavedEventsPage;
  let fixture: ComponentFixture<SavedEventsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedEventsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SavedEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
