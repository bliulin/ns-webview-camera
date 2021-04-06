/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SetCardPinComponent } from './set-card-pin.component';

describe('SetCardPinComponent', () => {
  let component: SetCardPinComponent;
  let fixture: ComponentFixture<SetCardPinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetCardPinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetCardPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
