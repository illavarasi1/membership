import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersformComponent } from './membersform.component';

describe('MembersformComponent', () => {
  let component: MembersformComponent;
  let fixture: ComponentFixture<MembersformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembersformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
