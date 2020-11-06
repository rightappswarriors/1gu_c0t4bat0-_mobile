import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UeditPage } from './uedit.page';

describe('UeditPage', () => {
  let component: UeditPage;
  let fixture: ComponentFixture<UeditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UeditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UeditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
