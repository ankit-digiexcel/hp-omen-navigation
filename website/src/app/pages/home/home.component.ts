import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public is_iphone: boolean = false;
  public states: any = [];
  public state: string = '';
  public is_submiting_entry: boolean = false;
  public step: number = 1;

  public registration_form = this.form_builder.group({
    first_name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    mobile: [
      '',
      [Validators.required, Validators.minLength(10), Validators.maxLength(10)],
    ],
    profession: ['', [Validators.required]],
    state: ['', [Validators.required]],
    city: ['', [Validators.required]],
  });

  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lng!: number;
  lat!: number;
  destination: mapboxgl.LngLat = new mapboxgl.LngLat(77.2439064, 28.5449783); // Set your destination coordinates
  marker!: mapboxgl.Marker;
  @Input()
  mapboxAccessToken: string | undefined;

  constructor(
    private form_builder: FormBuilder,
    private app_service: AppService
  ) {
    const platform = navigator.platform.toLowerCase();
    this.is_iphone = platform.includes('iphone');
    // this.to_navigation_page();
    this.app_service.getStates().subscribe((states: any) => {
      this.states = this.sortByName(states);
      console.log(this.states);
    });
  }

  ngOnInit() {}

  initializeMap() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.lng = position.coords.longitude;
      this.lat = position.coords.latitude;

      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        center: [this.lng, this.lat],
        zoom: 12,
        accessToken: this.app_service.mapbox.accessToken,
      });

      // Add user location marker
      // Add navigation controls to the map
      this.map.addControl(new mapboxgl.NavigationControl());

      // Draw path to the destination
      // this.drawPath();

      this.app_service
        .getGeocoding(
          'Ground Floor First Floor, Shop No.16 & 17, Giri Apartment, near 45th Cross, JP Nagar Phase 2, Bengaluru,Karnataka 560078, India'
        )
        .subscribe((res: any) => {
          console.log(res.features[0].geometry.coordinates);
          const cords = res.features[0].geometry.coordinates;
          this.map.setCenter(cords);
          this.addCustomPointer(cords);
          this.map.setZoom(14);
        });

      // Add custom pointer to destination
    });
  }

  drawPath() {
    const coordinates = [
      [this.lng, this.lat],
      [this.destination.lng, this.destination.lat],
    ];

    this.map.on('load', () => {
      this.map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
        },
      });

      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#888',
          'line-width': 2,
        },
      });
    });
  }

  addCustomPointer(location: any) {
    this.map.on('load', () => {
      const el = document.createElement('div');
      el.className = 'custom-marker';

      new mapboxgl.Marker(el).setLngLat(location).addTo(this.map);
    });
  }

  video_end() {
    this.step = 2;
  }
  to_navigation_page() {
    this.getLocation();
    this.initializeMap();
    this.step = 4;
  }

  submit_registration() {
    // this.step = 3;
    // return;
    if (this.registration_form.invalid) {
      this.app_service.show_error('All fields are required');
      return;
    }
    this.is_submiting_entry = true;
    this.app_service.saveEntry(this.registration_form.value).subscribe(
      (res: any) => {
        console.log(res);
        this.is_submiting_entry = false;

        if (res.success) {
          localStorage.setItem(
            'entry',
            JSON.stringify(this.registration_form.value)
          );
          localStorage.setItem('entry_id', res.data?.id);
          this.app_service
            .show_success('Thank you for registering')
            .then(() => {
              this.step = 3;
            });
        } else {
          this.app_service.show_error(res?.error);
        }
      },
      (err: any) => {
        console.log('error while submiting entry', err);
        this.is_submiting_entry = false;
        this.app_service.show_error(
          'Error while submiting entry, Please contact admin'
        );
      }
    );
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('position', position);
          this.app_service
            .reverseGeocoding(
              position.coords.longitude,
              position.coords.latitude
            )
            .subscribe((res: any) => {
              console.log(res);
              res.features.forEach((item: any) => {
                if (item.place_type.includes('region')) {
                  console.log('State', item.text);
                  this.state = item.text.toLowerCase();
                }
              });
            });
        },
        (error) => {
          console.log('err', error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  sortByName(items: any) {
    // sort by name
    items.sort(function (a: { name: string }, b: { name: string }) {
      const nameA = a.name.toUpperCase(); // ignore upper and lowercase
      const nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
    return items;
  }
}
