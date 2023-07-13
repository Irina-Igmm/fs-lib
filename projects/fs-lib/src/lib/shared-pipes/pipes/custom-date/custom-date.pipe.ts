import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {


  transform(value: string): string {
    // Parse the input value to a Date object
    const date = new Date(value);

    // Extract the day, month, and year components
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();

    // Format the date as "DD-MM-YYYY"
    const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;

    return formattedDate;
  }

}
