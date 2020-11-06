import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CpassPage } from './cpass.page';

describe('CpassPage', () => {
  let component: CpassPage;
  let fixture: ComponentFixture<CpassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpassPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CpassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
