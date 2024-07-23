import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EtapePage } from './etape.page';

describe('EtapePage', () => {
  let component: EtapePage;
  let fixture: ComponentFixture<EtapePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtapePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EtapePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
