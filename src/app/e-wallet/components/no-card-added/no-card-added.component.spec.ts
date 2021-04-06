/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NoCardAddedComponent } from './no-card-added.component';

describe('NoCardAddedComponent', () => {
  let component: NoCardAddedComponent;
  let fixture: ComponentFixture<NoCardAddedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoCardAddedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoCardAddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
