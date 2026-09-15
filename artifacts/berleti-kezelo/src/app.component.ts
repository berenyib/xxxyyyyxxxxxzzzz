import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import appTemplate from './app.component.html?raw';
import appStyles from './app.component.css?raw';

type Page = '' | 'hirdetesek' | 'ingatlanok' | 'karbantartas' | 'berleti-dijak' | 'naptar';
type RecordMap = Record<string, any>;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: appTemplate,
  styles: [appStyles],
})
export class AppComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  page: Page = '';
  role: 'Bérbeadó' | 'Bérlő' = 'Bérbeadó';
  loading = true;
  notice = '';
  summary: RecordMap = {};
  activity: RecordMap[] = [];
  listings: RecordMap[] = [];
  properties: RecordMap[] = [];
  maintenance: RecordMap[] = [];
  rents: RecordMap[] = [];
  search = '';
  showForm = false;
  form: RecordMap = {};

  ngOnInit() {
    this.setPage(this.router.url);
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: any) => this.setPage(event.urlAfterRedirects));
    this.load();
  }

  setPage(url: string) {
    const value = url.replace('/', '').split('?')[0] as Page;
    this.page = ['hirdetesek', 'ingatlanok', 'karbantartas', 'berleti-dijak', 'naptar'].includes(value) ? value : '';
  }

  navigate(path: string) {
    this.router.navigateByUrl(path ? `/${path}` : '/');
  }

  load() {
    this.loading = true;
    this.http.get<RecordMap>('/api/dashboard/summary').subscribe((value) => this.summary = value);
    this.http.get<RecordMap[]>('/api/activity').subscribe((value) => this.activity = value);
    this.http.get<RecordMap[]>('/api/listings').subscribe((value) => this.listings = value);
    this.http.get<RecordMap[]>('/api/properties').subscribe((value) => this.properties = value);
    this.http.get<RecordMap[]>('/api/maintenance').subscribe((value) => { this.maintenance = value; this.loading = false; });
    this.http.get<RecordMap[]>('/api/rents').subscribe((value) => this.rents = value);
  }

  filteredListings() {
    const term = this.search.toLowerCase().trim();
    return this.listings.filter((item) => !term || `${item.title} ${item.city} ${item.address}`.toLowerCase().includes(term));
  }

  openForm(kind: string) {
    this.showForm = true;
    this.form = kind === 'listing'
      ? { title: '', city: 'Budapest', address: '', price: 250000, bedrooms: 1, size: 40, imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80', status: 'ACTIVE' }
      : kind === 'maintenance'
        ? { propertyId: this.properties[0]?.id ?? 1, title: '', description: '', priority: 'MEDIUM' }
        : { propertyId: this.properties[0]?.id ?? 1, tenantName: '', amount: 250000, dueDate: '', status: 'PENDING' };
    this.form.kind = kind;
  }

  submit() {
    const kind = this.form.kind;
    const payload = { ...this.form };
    delete payload.kind;
    const endpoint = kind === 'listing' ? '/api/listings' : kind === 'maintenance' ? '/api/maintenance' : '/api/rents';
    this.http.post(endpoint, payload).subscribe(() => {
      this.showForm = false;
      this.notice = 'A mentés sikerült.';
      this.load();
      setTimeout(() => this.notice = '', 2600);
    });
  }

  updateMaintenance(item: RecordMap, status: string) {
    this.http.patch(`/api/maintenance/${item.id}`, { status }).subscribe(() => {
      item.status = status;
      this.notice = 'A karbantartási ügy állapota frissült.';
    });
  }

  updateRent(item: RecordMap, status: string) {
    this.http.patch(`/api/rents/${item.id}`, { status }).subscribe(() => {
      item.status = status;
      this.notice = 'A fizetési státusz frissült.';
    });
  }

  money(value: number) {
    return new Intl.NumberFormat('hu-HU').format(value ?? 0) + ' Ft';
  }
}