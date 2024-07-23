import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DemandesPage } from './demandes.page';

describe('DemandesPage', () => {
  let component: DemandesPage;
  let fixture: ComponentFixture<DemandesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DemandesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
