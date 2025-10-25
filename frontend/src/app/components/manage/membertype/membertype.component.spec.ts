import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembertypeComponent } from './membertype.component';

describe('MembertypeComponent', () => {
  let component: MembertypeComponent;
  let fixture: ComponentFixture<MembertypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembertypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembertypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
