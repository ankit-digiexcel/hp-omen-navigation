import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public mapbox = {
    accessToken:
      'pk.eyJ1IjoiYW5raXQtZGlnaWV4Y2VsIiwiYSI6ImNscnVmbjRweTBmejQyamxtc3Vwb3R2bDAifQ.N80ROTSHUmtUaj5HAShrHA',
  };
  private location_api_url = 'https://api.countrystatecity.in/v1/countries/IN/';
  private api_endpoint = this.platformLocation.href.includes('localhost')
    ? 'http://localhost:5000/api/v1/'
    : 'https://hp-omen-navigation.onrender.com/api/v1/';

  private token: any;
  private authStatusListener = new Subject<boolean>();
  constructor(
    private http: HttpClient,
    private router: Router,
    public platformLocation: PlatformLocation
  ) {
    console.log('host', this.platformLocation.href);
  }

  saveEntry(data: any) {
    return this.http.post(this.api_endpoint + 'omen_nav', data);
  }

  /**
   * Swal funtions
   * @param message
   */
  show_success(message: string) {
    return Swal.fire({
      title: 'Success',
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
    });
  }
  show_error(message: string) {
    return Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }

  /**
   * Location API Requests
   */

  getStates() {
    return this.http.get(this.location_api_url + 'states');
  }

  getCities(iso2: any) {
    return this.http.get(this.location_api_url + 'states/' + iso2 + '/cities');
  }

  reverseGeocoding(longitude: any, latitude: any) {
    return this.http.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${this.mapbox.accessToken}`
    );
  }
  getGeocoding(search: string) {
    return this.http.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?access_token=${this.mapbox.accessToken}`
    );
  }

  /**
   * Admin services
   * @param data
   * @returns
   */

  getAllEnteries() {
    return this.http.get(this.api_endpoint + 'omen_nav');
  }

  login(data: any) {
    return this.http.post(this.api_endpoint + 'admin/login', data);
  }

  getUser(): any {
    let user = localStorage.getItem('user') || '';
    return JSON.parse(user);
  }

  // to get token
  getToken(): any {
    return localStorage.getItem('token');
  }

  // To get user is Authenticated or not
  getIsAuth(): any {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }

  sessionBuilder(loginData: any) {
    console.log(loginData);

    this.token = loginData.token;
    this.authStatusListener.next(true);

    // to make the auto log out functionality after a certain time
    const now = new Date();
    const expirationDate = new Date(now.getTime() + 1000 * 10000);

    localStorage.setItem('user', JSON.stringify(loginData.user));
    localStorage.setItem('token', this.token);
    localStorage.setItem('expiration', expirationDate.toISOString());

    sessionStorage.setItem('token', this.token);
    this.router.navigate(['/admin']);
  }

  // to logout a user
  logout() {
    this.token = null;
    this.authStatusListener.next(false);
    localStorage.clear();
    this.router.navigateByUrl('/auth/login');
  }
}
