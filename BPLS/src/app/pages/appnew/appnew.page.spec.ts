import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppnewPage } from './appnew.page';

describe('AppnewPage', () => {
  let component: AppnewPage;
  let fixture: ComponentFixture<AppnewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppnewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AppnewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
