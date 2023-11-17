import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, map, of, tap } from 'rxjs';

import { Country, Region } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-setore.interface';

@Injectable({ providedIn: 'root' })
export class CountriesService {
  private apiUrl: string = "https://restcountries.com/v3.1";
  public cacheStore: CacheStore = {
    byCapital: { term: '', countries: [] },
    byCountry: { term: '', countries: [] },
    byRegion: { region: '', countries: [] },
  }

  constructor(private http: HttpClient) { }

  private getCountryRequest(url: string): Observable<Country[]> {
    return this.http.get<Country[]>(url)
      .pipe(
        catchError(() => of([])),
        delay(1000)
      )
  }

  searchCountryByAlphaCode(code: string): Observable<Country | null> {
    return this.http.get<Country[]>(`${this.apiUrl}/alpha/${code}`)
      .pipe(
        map(countries => countries.length > 0 ? countries[0] : null),
        catchError(() => of(null))
      );
  }

  searchCapital(term: string): Observable<Country[]> {
    return this.getCountryRequest(`${this.apiUrl}/capital/${term}`)
      .pipe(tap(countries => this.cacheStore.byCapital = { term, countries }));
  }

  searchCountry(term: string): Observable<Country[]> {
    return this.getCountryRequest(`${this.apiUrl}/name/${term}`)
    .pipe(tap(countries => this.cacheStore.byCountry = { term, countries }));;
  }

  searchRegion(region: Region): Observable<Country[]> {
    return this.getCountryRequest(`${this.apiUrl}/region/${region}`)
    .pipe(tap(countries => this.cacheStore.byRegion = { region, countries }));;
  }
}
