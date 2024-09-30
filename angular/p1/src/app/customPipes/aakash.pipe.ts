import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'aakash',
  standalone: true
})
export class AakashPipe implements PipeTransform {

  transform(value: string) {
    return value+" appended"
}

}

