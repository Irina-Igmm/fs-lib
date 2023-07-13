import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';
import { UtilsService } from '../../../services/services/utils.service';
import { I_FolderTree } from '../../../interfaces/interfaces/api.model';
import { T_Writeable } from '../../../interfaces/interfaces/upload';
import { BehaviorSubject } from 'rxjs';


interface I_UploadedFolderDirective {
  file: File;
  fullPath: string;
}

@Directive({
  selector: '[appDrop]',
  // exportAs: 'drop'

})
export class DropDirective {

  // @Output() fileDropped = new EventEmitter<{files: FileList, folder: HTMLElement | null, folders?: FileList, parentId?: number}>();
  @Output() fileDropped = new EventEmitter<{files: FileList, folder: {folder: HTMLElement | null, parentId: number | null}, folders?: FileList, parentId?: number}>();

  @Output() test = new EventEmitter<any>();

  @HostBinding('class.file-over') fileOver = false;

  public files: I_UploadedFolderDirective[] = [];

  public asyncFiles: I_UploadedFolderDirective[] = [];

  fileTree!: I_FolderTree;

  fileSubscriber$ = new BehaviorSubject<any[]>([]);

  constructor(
    private elementRef: ElementRef,
    private utilsService: UtilsService
  ) { }

  ngAfterViewInit() {}


  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {

    event.preventDefault();
    event.stopPropagation();
    this.fileOver = true;

  }


  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {

    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;

  }


  @HostListener('drop', ['$event']) async onDrop(event: DragEvent) {

    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;

    const files = (event.dataTransfer?.files as FileList);
    const folder = this.getFolderElement(event.target as HTMLElement);

    let filess: (File)[] = [];

    let folders: (File | FileList)[] = [];
    let file = files[0]

    let rootFolder: string = ""

    let filesWithPath: I_UploadedFolderDirective[] = []

    let items = event.dataTransfer?.items as DataTransferItemList;

    /* TODO: ça marche mais pas avec le path complet */
    for (let i = 0; i < (items as any).length; i++) {
      const item = (items as any)[i];
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          this.traverseEntry(entry, this.files);
          // await Promise.all(await this.traverseAsyncEntry(entry, this.files)).then(ten => console.log(''))

        }
      }
    }

    this.test.emit(this.files)

    console.log('FINAL FORM OF ALL FILES', JSON.stringify(this.files), event.dataTransfer?.files.length)

    // console.log('FOLDER TREE', await this.buildFolderTree(this.files as I_UploadedFolderDirective[]), this.files)

    for (let index = 0; index < (event.dataTransfer?.files.length  as number); index++) {

      if (event.dataTransfer?.items[index].webkitGetAsEntry()?.isDirectory == true) {

        folders = [... folders, ...[event.dataTransfer?.files[index]]];

      } else {

        filess = [... filess, ...[event.dataTransfer?.files[index] as File]];

      }

    }

    if (files && folder) {
      this.fileDropped.emit({files, folder});
    } else if (files && !folder) {
      this.fileDropped.emit({files, folder: {folder: null, parentId: null}});
    }

  }


  traverseEntry(entry: any, files: I_UploadedFolderDirective[]): I_UploadedFolderDirective[] {

    this.test.emit('ça marche');

    if (entry.isDirectory) {
      const directoryReader = entry.createReader();

      directoryReader.readEntries((entries: any[]) => {
        entries.forEach((subEntry: any) => {
          this.traverseEntry(subEntry, files)
        });
      });
    } else if (entry.isFile) {
      entry.file((file: File) => {
        let fileToPush: I_UploadedFolderDirective = {
          file: file,
          fullPath: entry.fullPath.slice(1)
        }
        this.files.push(fileToPush);
      });
    }

    // this.buildFolderTree(files);

    return files

  }


  private async buildFolderTree(folder: I_UploadedFolderDirective[], rootFolder: string) {

    const fileTree: I_FolderTree  = { name: "root", type: "folder", children: [] };

    const rootFile: I_UploadedFolderDirective = (folder as I_UploadedFolderDirective[])[0]

    console.log('ROOT FILE', rootFile, folder);

    const rootPath = (rootFile.fullPath).split("/")[0];

    fileTree.name = rootPath;

    for (let i = 0; i < folder.length; i++) {

      const file = folder[i] as I_UploadedFolderDirective & {webkitRelativePath?: string};
      const path = file.webkitRelativePath || file.fullPath;
      const pathSegments = path.split("/");

      let current = fileTree;

      for (let j = 0; j < pathSegments.length; j++) {
        const segment = pathSegments[j];
        let existingPath = current.children.find((child) => child.name === segment);
        if (!existingPath) {
          const newFolder: I_FolderTree = { name: segment, type: j === pathSegments.length - 1 ? "file" : "folder", children: [] as I_FolderTree[] };
          current.children.push(newFolder);
          existingPath = newFolder;
        }
        if (j === pathSegments.length - 1 && existingPath.type === "file") {
          existingPath.data = file.file;
        }
        existingPath.count = existingPath.count ? existingPath.count + 1 : 1;
        current = existingPath;
      }
    }

    this.fileTree = fileTree;

    console.log('FILE TREE', fileTree)

    return fileTree;

  }


  // private getFolderElement(element: HTMLElement): HTMLElement | null {
  private getFolderElement(element: HTMLElement): {folder: HTMLElement | null, parentId: number | null} | null {

    if (element === this.elementRef.nativeElement) {
      return {folder: null, parentId: null};
    } else if (element.classList.contains('folder')) {
      const parentId = parseInt(element.getAttribute('folderId') as string, 10);

      return {folder: element, parentId}
    } else {
      // console.log('FOLDER ID', this.getFolderElement(element.parentElement as HTMLElement));

      return this.getFolderElement(element.parentElement as HTMLElement);

    }

  }

}
