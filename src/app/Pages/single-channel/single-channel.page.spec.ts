import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SingleChannelPage } from './single-channel.page';

describe('SingleChannelPage', () => {
  let component: SingleChannelPage;
  let fixture: ComponentFixture<SingleChannelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleChannelPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SingleChannelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
