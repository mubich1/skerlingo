import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NotationPage } from './notation.page';

describe('NotationPage', () => {
  let component: NotationPage;
  let fixture: ComponentFixture<NotationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NotationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
