import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public isloading = false;
  public msg = '';

  constructor(private app_service: AppService) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  login() {
    console.log(this.loginForm.value);
    // return;
    this.isloading = true;
    this.app_service.login(this.loginForm.value).subscribe(
      (res: any) => {
        console.log(res);
        if (res.success) {
          this.app_service.sessionBuilder(res.data);
        } else {
          this.msg = res?.error;
          this.isloading = false;
        }
      },
      (error: any) => {
        console.log(error);
        this.msg = error?.error?.data;
        this.isloading = false;
      }
    );
  }
}
