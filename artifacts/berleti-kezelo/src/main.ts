import '@angular/compiler';
import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'hirdetesek', component: AppComponent },
  { path: 'ingatlanok', component: AppComponent },
  { path: 'karbantartas', component: AppComponent },
  { path: 'berleti-dijak', component: AppComponent },
  { path: 'naptar', component: AppComponent },
  { path: '**', component: AppComponent },
];

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), provideRouter(routes)],
}).catch((error) => {
  document.body.innerHTML = `<pre>Az alkalmazás nem indítható: ${String(error)}</pre>`;
});