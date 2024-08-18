import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  Observable,
  of,
  Subject,
  takeUntil,
  tap,
  timeout,
} from 'rxjs';
import { RetrieveRecordService } from 'src/service/retrieve-record.service';

export interface Dessert {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}
@Component({
  selector: 'app-main-list',
  templateUrl: './main-list.component.html',
  styleUrls: ['./main-list.component.scss'],
})
export class MainListComponent implements OnInit {
  desserts: Dessert[] = [
    { name: 'Frozen yogurt', calories: 159, fat: 6, carbs: 24, protein: 4 },
    {
      name: 'Ice cream sandwich',
      calories: 237,
      fat: 9,
      carbs: 37,
      protein: 4,
    },
    { name: 'Eclair', calories: 262, fat: 16, carbs: 24, protein: 6 },
    { name: 'Cupcake', calories: 305, fat: 4, carbs: 67, protein: 4 },
    { name: 'Gingerbread', calories: 356, fat: 16, carbs: 49, protein: 4 },
  ];
  resultRecords$: Observable<any> = new Observable();

  sidenavOpened$: Observable<boolean> = of(false);

  listName$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  form: FormGroup = this.fb.group({
    filter: [''],
    columnName: [''],
    sortDirection: [''],
    pageNo: [''],
    perPage: [''],
    filterName: [[]],
  });

  private isDestroy: Subject<boolean> = new Subject();

  constructor(
    private router: Router,
    private activeUrl: ActivatedRoute,
    private api: RetrieveRecordService,
    private fb: FormBuilder
  ) {
    this._mapQueryParams(this.activeUrl.snapshot.queryParams);
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(
        takeUntil(this.isDestroy),
        tap(() => {
          this.queryChanged();
        })
      )
      .subscribe();

    combineLatest([this.resultRecords$])
      .pipe(
        tap(([val]) => {
          const names = val.map(
            (element: {
              calories: number;
              carbs: number;
              fat: number;
              name: string;
              protein: number;
            }) => element.name
          );
          this.listName$.next(names);
        }),
        takeUntil(this.isDestroy)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.isDestroy.next(true);
    this.isDestroy.complete();
  }

  sortData(sort: Sort) {
    this.form.patchValue({
      columnName: sort.active,
      sortDirection: sort.direction,
    });
  }

  search(keyword: string) {
    this.form.patchValue({ filter: keyword });
  }

  changePage(pageNo: PageEvent) {
    this.form.patchValue({
      pageNo: pageNo.pageIndex + 1,
      perPage: pageNo.pageSize,
    });
  }

  setSidenav(value: boolean) {
    this.sidenavOpened$ = of(value);
  }

  openSideNav() {
    this.sidenavOpened$ = of(true);
  }

  applyFilter(event: any) {
    this.form.patchValue({ filterName: event });
  }

  private _mapQueryParams(values: any) {
    this.form.patchValue({
      filter: values.filter ? values.filter : '',
      columnName: values.columnName ? values.columnName : '',
      sortDirection: values.direction ? values.direction : '',
      perPage: values.perPage ? values.perPage : '',
      pageNo: values.pageNo ? values.pageNo : '',
    });

    this.loadRecords();
  }

  queryChanged() {
    this.router.navigate([], {
      relativeTo: this.activeUrl,
      queryParams: {
        columnName:
          this.form.get('columnName')?.value !== ''
            ? this.form.get('columnName')?.value
            : undefined,
        direction:
          this.form.get('sortDirection')?.value !== ''
            ? this.form.get('sortDirection')?.value
            : undefined,
        filter:
          this.form.get('filter')?.value !== ''
            ? this.form.get('filter')?.value
            : undefined,

        pageNo:
          this.form.get('pageNo')?.value !== ''
            ? this.form.get('pageNo')?.value
            : undefined,

        perPage:
          this.form.get('perPage')?.value !== ''
            ? this.form.get('perPage')?.value
            : undefined,
      },
      queryParamsHandling: 'merge',
    });

    this.loadRecords();
  }

  loadRecords() {
    this.resultRecords$ = this.api.getRecords(
      this.form.get('pageNo')?.value !== ''
        ? this.form.get('pageNo')?.value
        : 1,
      this.form.get('columnName')?.value !== ''
        ? this.form.get('columnName')?.value
        : 'name',
      this.form.get('sortDirection')?.value !== ''
        ? this.form.get('sortDirection')?.value
        : 'asc',
      this.form.get('filter')?.value !== ''
        ? this.form.get('filter')?.value
        : '',
      this.form.get('perPage')?.value !== ''
        ? this.form.get('perPage')?.value
        : 10,
      this.form.get('filterName')?.value !== ''
        ? this.form.get('filterName')?.value
        : []
    );
  }
}
