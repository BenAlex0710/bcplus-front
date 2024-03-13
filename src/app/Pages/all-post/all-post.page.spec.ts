import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllPostPage } from './all-post.page';

describe('AllPostPage', () => {
  let component: AllPostPage;
  let fixture: ComponentFixture<AllPostPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllPostPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllPostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
