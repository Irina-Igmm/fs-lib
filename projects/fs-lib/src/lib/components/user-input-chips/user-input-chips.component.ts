import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import { Observable, pipe } from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, startWith, switchMap} from 'rxjs/operators';
import { I_User } from '../../interfaces/interfaces/user.model';
import { ApiService } from '../../services/services/api.service';

@Component({
  selector: 'app-user-input-chips',
  templateUrl: './user-input-chips.component.html',
  styleUrls: ['./user-input-chips.component.scss']
})
export class UserInputChipsComponent implements OnInit {

  userSearchForm!: FormGroup;
  // userSearchInput!: FormControl;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredUsers: I_User[] | undefined;
  // users: string[] = [];


  @ViewChild('userSearchInput') userSearchInput!: ElementRef<HTMLInputElement>;


  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    this.userSearchForm = this.formBuilder.group(
      {
        userSearchControl: [''],  
        users: formBuilder.array([])
      }
    );
    
    // this.userSearchControl.valueChanges.pipe(
    //   startWith(null),
    //   filter((value) => value !== null && value !== ""),
    //   debounceTime(500),
    //   distinctUntilChanged(),
    //   switchMap((filteredData)=> {
    //     return this.apiService.getUsersMockList(
    //       filteredData as string
    //     )
    //   })
    // ).subscribe((data) => {
    //   if (data && data.data && data.data.length > 0) {
    //     this.filteredUsers = data.data;
    //   } else {
    //     this.filteredUsers = [];
    //   }
    // })
  }

  ngOnInit(): void {
    this.userSearchForm.valueChanges.subscribe((data)=> {
      console.log("change", data);
    })
  }

  get userSearchControl() {
    return this.userSearchForm.get("userSearchControl") as FormControl;
  }

  get users() {
    return this.userSearchForm.get("users") as FormArray;
  }

  add(event: MatChipInputEvent): void {
    // const value = (event.value || '').trim();

    // console.log(event);

    // if (value) {
    //   this.users_id.push(this.formBuilder.control(value));
    // }

    // Clear the input value
    // event.chipInput!.clear();

    // this.userSearchInput.setValue(null);
  }

  remove(user_id: string): void {
    const index = this.users.value.indexOf(user_id);
    console.log('index', index)
    if (index >= 0) {
      this.users.removeAt(index);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log("event option",event.option);
    
    this.users.push(
      this.formBuilder.control(
        {
          id: event.option.value.id,
          email: event.option.value.email
        }
      )
    );
    this.userSearchInput.nativeElement.value = '';
    // this.userSearchForm.controls.userSearchInput.setValue(null);
  }

  // onSelection = (user: I_User) => {
  //   // console.log(user);
    
  //   this.users.push(this.formBuilder.control(user.id));
  //   this.userSearchInput.setValue(null);
  //   this.userSearchInput.patchValue('');
  //   // console.log(this.userSearchForm.value);
  //   this.userSearchForm.updateValueAndValidity();
    
  // }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
  // }

}
