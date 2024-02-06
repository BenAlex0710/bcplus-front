import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EventBlockComponent } from './event-block.component';

describe('EventBlockComponent', () => {
  let component: EventBlockComponent;
  let fixture: ComponentFixture<EventBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventBlockComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EventBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
