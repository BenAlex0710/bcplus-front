import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BlockListPage } from './block-list.page';

describe('BlockListPage', () => {
  let component: BlockListPage;
  let fixture: ComponentFixture<BlockListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BlockListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
