import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductsavePage } from './productsave.page';

describe('ProductsavePage', () => {
  let component: ProductsavePage;
  let fixture: ComponentFixture<ProductsavePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsavePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
