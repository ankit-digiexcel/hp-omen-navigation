import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  public is_iphone: boolean = false;
  public states: any = [];
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

  constructor(
    private form_builder: FormBuilder,
    private app_service: AppService
  ) {
    this.app_service.getStates().subscribe((states: any) => {
      this.states = this.sortByName(states);
      console.log(this.states);
    });
    const platform = navigator.platform.toLowerCase();
    this.is_iphone = platform.includes('iphone');
  }

  video_end() {
    this.step = 2;
  }
  to_navigation_page() {
    this.getLocation();
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
