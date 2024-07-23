import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LeconPage } from './lecon.page';

describe('LeconPage', () => {
  let component: LeconPage;
  let fixture: ComponentFixture<LeconPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeconPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LeconPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
