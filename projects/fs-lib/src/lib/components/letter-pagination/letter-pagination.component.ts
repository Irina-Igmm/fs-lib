import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { I_PaginationData } from '../../interfaces/interfaces/pagination-data';

@Component({
  selector: 'app-letter-pagination',
  templateUrl: './letter-pagination.component.html',
  styleUrls: ['./letter-pagination.component.scss']
})
export class LetterPaginationComponent implements OnInit {

  @Input() isLoading: boolean = false;

  @Input() paginationData: I_PaginationData = {
    page: 0,
    limit: 50,
    totalElements: 0,
    totalPages: 0
  }

  @Output() paginationChange = new EventEmitter<I_PaginationData>()

  constructor() { }

  ngOnInit(): void {
  }

}
