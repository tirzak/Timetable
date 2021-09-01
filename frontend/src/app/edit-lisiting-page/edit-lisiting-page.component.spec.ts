import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLisitingPageComponent } from './edit-lisiting-page.component';

describe('EditLisitingPageComponent', () => {
  let component: EditLisitingPageComponent;
  let fixture: ComponentFixture<EditLisitingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLisitingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLisitingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
