import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {


  transform(value: number,
            unit: 'kilooctes' | 'megaoctets' | 'gigaoctets' | 'teraoctets'): number | string {

    const sizeInOctets = value;

    let transformedSize: string = "0 Mo";

    const units: {
      kiloOctets: number;
      megaOctets: number;
      gigaOctets: number;
      teraOctets: number;
    } = {
      kiloOctets: 1024,
      megaOctets: 1048576,
      gigaOctets: 1073741824,
      teraOctets: 1099511627776
    }

    switch (unit) {
      case 'kilooctes':
        transformedSize = (value/(units.kiloOctets)).toFixed(2) + ' Ko';
        break;

      case 'megaoctets':
        transformedSize = (value/(units.megaOctets)).toFixed(2) + ' Mo';
        break;

      case 'gigaoctets':
        transformedSize = value/(units.gigaOctets) + ' Go';
        break;

      default:
        transformedSize = "0 Mo"
        break;
    }

    return transformedSize;
  }

}
