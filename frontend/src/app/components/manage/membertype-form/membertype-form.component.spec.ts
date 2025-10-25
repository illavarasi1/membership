import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembertypeFormComponent } from './membertype-form.component';

describe('MembertypeFormComponent', () => {
  let component: MembertypeFormComponent;
  let fixture: ComponentFixture<MembertypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembertypeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembertypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
