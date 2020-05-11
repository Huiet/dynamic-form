import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dyn-input',
  templateUrl: './dyn-input.component.html',
  styleUrls: ['./dyn-input.component.scss']
})
export class DynInputComponent implements OnInit {

  config;
  group;
  constructor() { }

  ngOnInit(): void {
  }

}
