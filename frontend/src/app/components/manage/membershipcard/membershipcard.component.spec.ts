import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipcardComponent } from './membershipcard.component';

describe('MembershipcardComponent', () => {
  let component: MembershipcardComponent;
  let fixture: ComponentFixture<MembershipcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipcardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
