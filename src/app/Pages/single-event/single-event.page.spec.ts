import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SingleEventPage } from './single-event.page';

describe('SingleEventPage', () => {
  let component: SingleEventPage;
  let fixture: ComponentFixture<SingleEventPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleEventPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SingleEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
