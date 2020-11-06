import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CartmodalpagePage } from './cartmodalpage.page';

describe('CartmodalpagePage', () => {
  let component: CartmodalpagePage;
  let fixture: ComponentFixture<CartmodalpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartmodalpagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CartmodalpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
