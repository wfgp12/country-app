import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, map, of } from 'rxjs';

import { Country } from '../interfaces/country';

@Injectable({ providedIn: 'root' })
export class CountriesService {
  private apiUrl: string = "https://restcountries.com/v3.1";
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

  searchCapital(query: string): Observable<Country[]> {
    return this.getCountryRequest(`${this.apiUrl}/capital/${query}`);
  }

  searchCountry(query: string): Observable<Country[]> {
    return this.getCountryRequest(`${this.apiUrl}/name/${query}`);
  }

  searchRegion(query: string): Observable<Country[]> {
    return this.getCountryRequest(`${this.apiUrl}/region/${query}`);
  }
}
