import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GiveawayPage } from './giveaway.page';

describe('GiveawayPage', () => {
  let component: GiveawayPage;
  let fixture: ComponentFixture<GiveawayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiveawayPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GiveawayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
