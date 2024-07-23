import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AvisPage } from './avis.page';

describe('AvisPage', () => {
  let component: AvisPage;
  let fixture: ComponentFixture<AvisPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvisPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AvisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
