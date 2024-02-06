import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrendingEventsPage } from './trending-events.page';

describe('TrendingEventsPage', () => {
  let component: TrendingEventsPage;
  let fixture: ComponentFixture<TrendingEventsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendingEventsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrendingEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
