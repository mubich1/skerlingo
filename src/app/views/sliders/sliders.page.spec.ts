import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SlidersPage } from './sliders.page';

describe('SlidersPage', () => {
  let component: SlidersPage;
  let fixture: ComponentFixture<SlidersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SlidersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
