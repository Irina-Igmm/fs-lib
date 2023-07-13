import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss']
})
export class UploadModalComponent implements OnInit {

  active = 1;

  movies = [
    {
      icon: 'folder.png',
      title: 'ordinateur',
      f_size: '25MB',
      f_in: '15 documents',
      type: 'FLD',
      createdAt: '08-03-2023',
    },
    {
      icon: 'folder.png',
      title: 'ordinateur',
      f_size: '25MB',
      f_in: '15 documents',
      type: 'FLD',
      createdAt: '08-03-2023',
    },
    {
      icon: 'word-logo.png',
      title: 'Pc excaluber.docx',
      f_size: '25MB',
      f_in: '15 documents',
      type: 'DOC',
      createdAt: '08-03-2023',
    },
    {
      icon: 'onur-binay-auf3GwpVaOM-unsplash.png',
      title: 'Pc excaluber.png',
      f_size: '25MB',
      f_in: '15 documents',
      type: 'IMG',
      createdAt: '08-03-2023',
    },

  ];
  status: boolean = true;
  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  closeModal() {
    this.activeModal.close();
  }

  showTab(id: any) {
    this.active = id;
  }

  drop(event: CdkDragDrop<any[]> | any) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }

  toggleList() {
    this.status = !this.status;
  }
}
