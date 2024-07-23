import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EtapesPage } from './etapes.page';

describe('EtapesPage', () => {
  let component: EtapesPage;
  let fixture: ComponentFixture<EtapesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtapesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EtapesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
