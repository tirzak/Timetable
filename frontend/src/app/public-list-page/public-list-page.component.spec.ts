import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicListPageComponent } from './public-list-page.component';

describe('PublicListPageComponent', () => {
  let component: PublicListPageComponent;
  let fixture: ComponentFixture<PublicListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
