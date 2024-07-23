import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PrestationPage } from './prestation.page';

describe('PrestationPage', () => {
  let component: PrestationPage;
  let fixture: ComponentFixture<PrestationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrestationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PrestationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
