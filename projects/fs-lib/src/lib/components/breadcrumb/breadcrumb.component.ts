import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { I_PathPartition } from '../../interfaces/interfaces/navigation';



@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  @Input() pathPartitions!: I_PathPartition[];

  @Output() onNavigate = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }


  navigate(partition: I_PathPartition) {

    this.onNavigate.emit(partition);

  }

}
