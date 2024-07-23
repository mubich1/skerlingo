import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BoutiquePage } from './boutique.page';

describe('BoutiquePage', () => {
  let component: BoutiquePage;
  let fixture: ComponentFixture<BoutiquePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoutiquePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BoutiquePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
