import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewaltableComponent } from './renewaltable.component';

describe('RenewaltableComponent', () => {
  let component: RenewaltableComponent;
  let fixture: ComponentFixture<RenewaltableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenewaltableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenewaltableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
