import { Injectable } from '@angular/core';
import { I_File } from '../../interfaces/interfaces/file.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { I_FolderTree, I_UploadProgress } from '../../interfaces/interfaces/api.model';
import { concatMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UploadStoreService {

  folders: I_FolderTree[] = [
    {
        "name": "Camera Roll",
        "type": "folder",
        "children": [
            {
                "name": "A",
                "type": "folder",
                "children": [
                    {
                        "name": "B",
                        "type": "folder",
                        "children": [
                            {
                                "name": "B.txt",
                                "type": "file",
                                "children": [],
                                "count": 1
                            }
                        ],
                        "count": 1
                    },
                    {
                        "name": "C",
                        "type": "folder",
                        "children": [
                            {
                                "name": "C.txt",
                                "type": "file",
                                "children": [],
                                "count": 1
                            }
                        ],
                        "count": 1
                    },
                    {
                        "name": "A.txt",
                        "type": "file",
                        "children": [],
                        "count": 1
                    }
                ],
                "count": 3
            },
            {
                "name": "n",
                "type": "folder",
                "children": [
                    {
                        "name": "peter 4.jpg",
                        "type": "file",
                        "children": [],
                        "count": 1
                    },
                    {
                        "name": "peter 2.jpg",
                        "type": "file",
                        "children": [],
                        "count": 1
                    },
                    {
                        "name": "peter 1.jpg",
                        "type": "file",
                        "children": [],
                        "count": 1
                    }
                ],
                "count": 3
            },
            {
                "name": "Nouveau dossier",
                "type": "folder",
                "children": [
                    {
                        "name": "Nouveau dossiers",
                        "type": "folder",
                        "children": [
                            {
                                "name": "7felpn[23058430092137668189].jpg",
                                "type": "file",
                                "children": [],
                                "count": 1
                            }
                        ],
                        "count": 1
                    },
                    {
                        "name": "test",
                        "type": "folder",
                        "children": [
                            {
                                "name": "tg.txt",
                                "type": "file",
                                "children": [],
                                "count": 1
                            }
                        ],
                        "count": 1
                    },
                    {
                        "name": "tt.txt",
                        "type": "file",
                        "children": [],
                        "count": 1
                    },
                    {
                        "name": "Nouveau document texte",
                        "type": "file",
                        "children": [],
                        "count": 1
                    },
                    {
                        "name": "ee.txt",
                        "type": "file",
                        "children": [],
                        "count": 1
                    },
                    {
                        "name": "dfsdf.txt",
                        "type": "file",
                        "children": [],
                        "count": 1
                    },
                    {
                        "name": "7felpn[2305843009213766818].jpg",
                        "type": "file",
                        "children": [],
                        "count": 1
                    }
                ],
                "count": 7
            },
            {
                "name": "Nouveau dossier (2)",
                "type": "folder",
                "children": [
                    {
                        "name": "Nouveau dossier compressé.zip",
                        "type": "file",
                        "children": [],
                        "count": 1
                    }
                ],
                "count": 1
            },
            {
                "name": "Nouveau document texte",
                "type": "file",
                "children": [],
                "count": 1
            },
            {
                "name": "desktop.ini",
                "type": "file",
                "children": [],
                "count": 1
            }
        ],
        "count": 16
    }
]

  filesToUpload$ = new BehaviorSubject<File | null>(null);

  allFiles$ = new BehaviorSubject<File[]>([]);

  fileProgress: {[key: string]: number} = {};

  filesToDisplay$ = new BehaviorSubject<I_UploadProgress[]>([]);

  actualId: string = "";

  constructor() {
    // this.sortFolderContents(this.folders)
   }


  //  touch this if you dare
  sortFolderContents(folderTree: I_FolderTree[]) {

    let sortedFiles: I_FolderTree[] | any[] = [];

    let firstFolderTree: I_FolderTree = folderTree[0];

    let allFilesInChildren: I_FolderTree[] | any[] = [];

      let allFoldersInChildren: I_FolderTree[] | any[] = [];

    for (let index = 0; index < firstFolderTree.children.length; index ++) {

      if (firstFolderTree.children[index].type == "folder") {

        allFoldersInChildren.push(firstFolderTree.children[index]);

      } else {

        allFilesInChildren.push(firstFolderTree.children[index]);

      }

    }

    allFoldersInChildren = allFoldersInChildren.sort((a,b) => a.name.localeCompare(b.name));

    allFilesInChildren = allFilesInChildren.sort((a,b) => a.name.localeCompare(b.name));

    sortedFiles = [... sortedFiles, ... allFilesInChildren];

    for (let childFolderIndex = 0; childFolderIndex < allFoldersInChildren.length; childFolderIndex ++) {

      sortedFiles = [... sortedFiles, ... this.parseFolder(allFoldersInChildren[childFolderIndex])];

    }

    console.log("all files", allFilesInChildren)
    console.log("all folders", allFoldersInChildren)

    console.log('FINAL FORM', sortedFiles);

    return sortedFiles;

  }


  parseFolder(folderTree: I_FolderTree) {

    let allContents: I_FolderTree[] | any[] = [];

    let allFilesInChildren: I_FolderTree[] | any[] = [];

    let allFoldersInChildren: I_FolderTree[] | any[] = [];

    for (let index = 0; index < folderTree.children.length; index ++) {

      if (folderTree.children[index].type == "folder") {

        allFoldersInChildren.push(folderTree.children[index]);

      } else {

        allFilesInChildren.push(folderTree.children[index]);

      }

    }

    allFilesInChildren = allFilesInChildren.sort((a,b) => a.name.localeCompare(b.name));

    allContents = [... allContents, ... allFilesInChildren];

    allFoldersInChildren = allFoldersInChildren.sort((a,b) => a.name.localeCompare(b.name));

    for (let newFolderIndex = 0; newFolderIndex < allFoldersInChildren.length; newFolderIndex ++) {

      let newContents = this.parseFolder(allFoldersInChildren[newFolderIndex]);

      allContents = [... allContents, ... newContents]

    }

    return allContents;

  }


  sortFileList(fileList: FileList) {

    let allFiles: File[] | any[] = [];

    let sortedFiles: File[] | any[] = [];

    for (let index = 0; index < fileList.length; index ++) {

      allFiles.push(fileList[index]);

    }

    sortedFiles = (allFiles.sort((a, b) => {

      // console.log("a: ", a.webkitRelativePath.split("/").slice(0, -1).join("/"), "b: ", b.webkitRelativePath.split("/").slice(0, -1).join("/"))

      let aLength: number = a.webkitRelativePath.split("/").length;

      let bLength: number = b.webkitRelativePath.split("/").length;

      let aPath: string = a.webkitRelativePath.split("/").slice(0, -1).join("/");

      let bPath: string = b.webkitRelativePath.split("/").slice(0, -1).join("/")

      if (aLength == bLength) {

        if (aPath == bPath) {

          return a.name.localeCompare(b.name);

        } else {

          let newAPath = aPath.split("/");

          let newBPath = aPath.split("/");

          console.log('ELSE', newAPath[newAPath.length - 1], newBPath[newBPath.length - 1]);

          if (newBPath[newAPath.length - 1] == newAPath[newBPath.length - 1]) {

            return a.name.localeCompare(b.name);

          } else {

            return newBPath[newAPath.length - 1].localeCompare(newAPath[newBPath.length - 1]);

          }


          // return aPath[-1].localeCompare(bPath[-1])

          if (aPath[-1] == bPath[-1]) {

            return b.name.localeCompare(a.name);

          } else {

            return 1

          }

          // return a.name.localeCompare(b.name);

          return aPath.localeCompare(bPath);

        }

        console.log('COMPARE RESULT', a.name.localeCompare(b.name));

        return a.name.localeCompare(b.name)

        // if (a.name.localeCompare(b.name)) {

        //   return -1

        // } else {

        //   return 1

        // }

      } else {

        // return b.webkitRelativePath.localeCompare(a.webkitRelativePath)

        console.log('COMPARE ELSE', a.name.localeCompare(b.name))

        return aLength - bLength

      }

    }))


    console.log('SORTED', sortedFiles);

  }
}
