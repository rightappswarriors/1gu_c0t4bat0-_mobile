import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShopeditPage } from './shopedit.page';

describe('ShopeditPage', () => {
  let component: ShopeditPage;
  let fixture: ComponentFixture<ShopeditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopeditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShopeditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
