import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreneauxPage } from './creneaux.page';

describe('CreneauxPage', () => {
  let component: CreneauxPage;
  let fixture: ComponentFixture<CreneauxPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreneauxPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreneauxPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
