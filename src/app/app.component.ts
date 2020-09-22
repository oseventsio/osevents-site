import { Component, OnInit, ChangeDetectionStrategy, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { map, pairwise, filter, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('scroller') scroller: CdkVirtualScrollViewport;

  listItems = [];
  loading = false;

  constructor(private ngZone: NgZone, private http: HttpClient) {

  }

  ngOnInit(): void {
    this.fetchMore();
  }

  ngAfterViewInit(): void {

    this.scroller.elementScrolled().pipe(
      map(() => this.scroller.measureScrollOffset('bottom')),
      pairwise(),
      filter(([y1, y2]) => (y2 < y1 && y2 < 140)),
      throttleTime(200)
    ).subscribe(() => {
      this.ngZone.run(() => {
        this.fetchMore();
      });
    }
    );
  }

  private next: string = '';
  public endOfEvents = false;

  fetchMore(): void {
    if (this.endOfEvents) return;

    const qs = this.next ? `?next=${this.next}` : '';

    this.http.get<GetEventsEvent[]>(`https://api.osevents.io/events${qs}`, { observe: 'response' })
      .subscribe(response => {
        const newItems = response.body.filter(c => c && c.title && c.image && c.image.url); // temp filter to clean up bad data
        this.next = response.headers.get('x-pagination-next');

        if (!this.next) this.endOfEvents = true;

        this.listItems = [...this.listItems, ...newItems];
        this.loading = false;
      });
  }

}

export interface GetEventsEvent {
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  image: { url: string; };
}
