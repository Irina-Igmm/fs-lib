import { Component, Input, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { I_UploadProgress } from '../../interfaces/interfaces/api.model';


@Component({
  selector: 'app-custom-circle-progress',
  templateUrl: './custom-circle-progress.component.html',
  styleUrls: ['./custom-circle-progress.component.scss']
})
export class CustomCircleProgressComponent implements OnInit {

  @Input() fileToUpload!: I_UploadProgress;

  @Input() image!: string;

  @Output() retry = new EventEmitter();

  @Output() cancel = new EventEmitter();

  isOnHover: boolean = false;

  isCancellable: boolean = false;

  isRetriable: boolean = true;

  public url?: string
  
  constructor(
    @Inject('storageUrl') storageUrl: string
  ) {
    this.url = storageUrl;
   }

  ngOnInit(): void {
  }


  get imagePath() {

    switch (this.fileToUpload.status) {

      case "waiting":
        return `${this.url}minuter/minuter_16.png`;

      case "in-progress":
        return "";

      case "failed":
        return `${this.url}exclamation/exclamation_16.png`;

      case "canceled":
        return `${this.url}canceled/canceled_16.png`;

      case "finished":
        return `${this.url}finished/finished_16.png`;

      default:
        return "";
    }

  }


  get imagePathOnHover() {
    // return `${this.url}retry/retry_16.png`;


    switch (this.fileToUpload.status) {
      case "failed":
        return `${this.url}retry/retry_16.png`;

      case "waiting":
        return `${this.url}canceled/canceled_16.png`;

      case "in-progress":
        return `${this.url}canceled/canceled_16.png`;

      case "canceled":
        return `${this.url}canceled/canceled_16.png`;

      default:
        return "";
    }

  }


  onRetry() {

    if (this.fileToUpload.status == "failed") {

      this.retry.emit();

    } else if (this.fileToUpload.status == "in-progress") {

      this.cancel.emit();


    }

    // if (this.fileToUpload.status == "in-progress") {


    // }

    // if (this.fileToUpload.status == "waiting" || this.fileToUpload.status == "in-progress") {

    //   this.cancel.emit();

    // }

  }


  onCancel() {

    if (this.fileToUpload.status == "waiting" || this.fileToUpload.status == "in-progress") {

      this.cancel.emit();

    }

  }


  get outerStrokeLineCape() {

    if (
      this.fileToUpload.status == "canceled" ||
      this.fileToUpload.status == "failed" ||
      this.fileToUpload.status == "waiting"
    ) {

      return "butt";

    }

    return "round"

  }


  outerStrokeColor() {



  }


  onMouseEnter() {

    if (this.fileToUpload.status == "waiting" || this.fileToUpload.status == "in-progress") {

      this.isCancellable = true;

      this.isRetriable = false

    }

    if (this.fileToUpload.status == "failed") {

      this.isRetriable = true;

      this.isCancellable = false;

    }



    this.isOnHover = true;

  }


  onMouseLeave() {


    if (this.fileToUpload.status == "waiting" || this.fileToUpload.status == "in-progress") {

      this.isCancellable = false;

      this.isRetriable = true

    }

    if (this.fileToUpload.status == "failed") {

      this.isRetriable = false;

      this.isCancellable = true;

    }

    this.isCancellable = false;

    this.isOnHover = false;

  }

}
