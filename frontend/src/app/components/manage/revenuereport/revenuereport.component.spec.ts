import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenuereportComponent } from './revenuereport.component';

describe('RevenuereportComponent', () => {
  let component: RevenuereportComponent;
  let fixture: ComponentFixture<RevenuereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevenuereportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevenuereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
