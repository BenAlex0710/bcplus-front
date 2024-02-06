import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecommendedEventsPage } from './recommended-events.page';

describe('RecommendedEventsPage', () => {
  let component: RecommendedEventsPage;
  let fixture: ComponentFixture<RecommendedEventsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecommendedEventsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendedEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
