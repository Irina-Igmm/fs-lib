import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { SearchResolver } from '../../../resolvers/resolvers/search.resolver';

@Component({
  selector: 'app-global-frame',
  templateUrl: './global-frame.component.html',
  styleUrls: ['./global-frame.component.scss']
})
export class GlobalFrameComponent implements OnInit {

  searchForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private searchResolver: SearchResolver
  ) {

    this.searchForm = this.formBuilder.group({
      searchControl: ['']
    })

  }

  ngOnInit(): void {



    console.log('QUERY PARAMS', this.activatedRoute.snapshot.queryParams.text)

    if (this.activatedRoute.snapshot.queryParams.text != ""
        && this.activatedRoute.snapshot.queryParams.text != null
        && this.activatedRoute.snapshot.queryParams.text != undefined) {

      let queryParams = this.activatedRoute.snapshot.queryParams.text;

      this.searchForm.setValue({
        searchControl: queryParams
      })

    }

  }


  switchView(event: any) {
    console.log(event);
  }


  submitSearch() {

    let  textToSearch: string = this.searchForm.get('searchControl')?.value;

    if (textToSearch != undefined && textToSearch != null && textToSearch != "") {

      const queryParams = { text: textToSearch };

      this.router.navigate(['/search'], { queryParams }).then(() => {
        this.searchResolver.resolve(this.activatedRoute.snapshot, this.router.routerState.snapshot).subscribe(() => {
          console.log('list refreshed')
        });
      });

    }

  }

}
