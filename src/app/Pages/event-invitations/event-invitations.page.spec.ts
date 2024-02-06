import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EventInvitationsPage } from './event-invitations.page';

describe('EventInvitationsPage', () => {
  let component: EventInvitationsPage;
  let fixture: ComponentFixture<EventInvitationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventInvitationsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EventInvitationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
