import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RetrieveRecordService {
  constructor(private http: HttpClient) {}

  getRecords(
    pagination: number,
    sortColumn: 'name' | 'calories' | 'fat' | 'carbs' | 'protein',
    sortDirection: string,
    filterquery: string,
    perPage: number,
    filterName: string[]
  ): Observable<any> {
    const mockData = this.generateRandomRecords(
      perPage,
      sortColumn,
      sortDirection,
      filterName
    ); // Generate 10 random records

    return new Observable((observer) => {
      setTimeout(() => {
        observer.next(mockData);
      }, 2000); // Simulate a 2-second delay
    });
  }

  generateRandomRecords(
    count: number,
    column: 'name' | 'calories' | 'fat' | 'carbs' | 'protein',
    direction: string,
    filterName: string[]
  ): any[] {
    let records = [];
    const names = [
      'Frozen yogurt',
      'Ice cream sandwich',
      'Eclair',
      'Cupcake',
      'Gingerbread',
      'Jelly Bean',
      'Lollipop',
      'Honeycomb',
      'Donut',
      'KitKat',
    ];

    let filterRecord: {
      name: string;
      calories: number;
      fat: number;
      carbs: number;
      protein: number;
    }[] = [];

    for (let i = 0; i < count; i++) {
      console.info('i:', i);
      const name = names[Math.floor(Math.random() * names.length)];
      const calories = Math.floor(Math.random() * 500);
      const fat = Math.floor(Math.random() * 20);
      const carbs = Math.floor(Math.random() * 100);
      const protein = Math.floor(Math.random() * 10);

      records.push({ name, calories, fat, carbs, protein });
    }

    records.sort((a, b) => {
      if (direction === 'asc') {
        if (a[column] < b[column]) {
          return -1;
        }
      } else {
        if (a[column] > b[column]) {
          return 1;
        }
      }
      return 1;
    });
    if (filterName.length > 0) {
      filterRecord = records.filter((record) =>
        filterName.includes(record.name)
      );

      records = filterRecord;
    }

    return records;
  }
}
