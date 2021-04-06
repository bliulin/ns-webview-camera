/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OmroRadioButtonsSelectComponent } from './omro-radio-buttons-select.component';

describe('OmroRadioButtonsSelectComponent', () => {
  let component: OmroRadioButtonsSelectComponent;
  let fixture: ComponentFixture<OmroRadioButtonsSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmroRadioButtonsSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmroRadioButtonsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
