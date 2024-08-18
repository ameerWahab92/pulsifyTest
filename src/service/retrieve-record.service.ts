import { query } from '@angular/animations';
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
      filterName,
      filterquery
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
    filterName: string[],
    query: string
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
      const name = names[Math.floor(Math.random() * names.length)];
      const calories = Math.floor(Math.random() * 500);
      const fat = Math.floor(Math.random() * 20);
      const carbs = Math.floor(Math.random() * 100);
      const protein = Math.floor(Math.random() * 10);

      records.push({ name, calories, fat, carbs, protein });
    }
    // SORT COLUMN
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

    // FILTER BY NAME ONLY
    if (filterName.length > 0) {
      filterRecord = records.filter((record) =>
        filterName.includes(record.name)
      );
    }

    // GLOBAL SEARCH
    let isExist: boolean = false;
    if (query) {
      type RecordKey = 'name' | 'calories' | 'fat' | 'carbs' | 'protein';
      records.filter((record) => {
        isExist =
          record.name.includes(query) ||
          record.calories.toString().includes(query) ||
          record.fat.toString().includes(query) ||
          record.carbs.toString().includes(query);
        console.info('isExist', isExist);
        console.info('record', record);
        if (isExist) {
          filterRecord.push(record);
        }
        return isExist;
      });
    }

    if (filterRecord.length > 0) {
      records = filterRecord;
    }

    return records;
  }
}
