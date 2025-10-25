import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipreportComponent } from './membershipreport.component';

describe('MembershipreportComponent', () => {
  let component: MembershipreportComponent;
  let fixture: ComponentFixture<MembershipreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
