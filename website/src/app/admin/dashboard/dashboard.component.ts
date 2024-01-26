import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  @ViewChild('enteriestable') enteriestable: ElementRef | undefined;
  @ViewChild('scoretable') scoretable: ElementRef | undefined;
  public entries = [] as any;
  public scores = [] as any;
  public is_loading = false;

  public table = 'enteries';

  constructor(private router: Router, private app_service: AppService) {
    this.get_data();
  }

  select_data(event: any) {
    this.table = event?.target?.value;
    this.get_data();
  }

  get_data() {
    this.scores = [];
    this.entries = [];
    this.is_loading = true;
    if (this.table === 'enteries') {
      this.app_service.getAllEnteries().subscribe(
        (res: any) => {
          if (res.success) {
            this.entries = res.data;
            console.log(this.entries);
          }
          this.is_loading = false;
        },
        (err: any) => {
          console.log(err);
          this.is_loading = false;
          alert('Oops! something went wrong');
        }
      );
    }
  }

  export_data(): any {
    if (this.table === 'enteries') {
      // this.app_service.export(this.enteriestable?.nativeElement, 'hp_data');
      const csvContent = this.convertToCsv(this.entries);
      this.downloadCsv(csvContent, 'hp_data');
    }
    if (this.table === 'scores') {
      // this.app_service.export(this.scores?.nativeElement, 'scores_data');
      const csvContent = this.convertToCsv(this.scores);
      this.downloadCsv(csvContent, 'scores_data');
    }
  }

  private convertToCsv(data: any[]): string {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map((row) => Object.values(row).join(','));
    return `${header}\n${rows.join('\n')}`;
  }

  private downloadCsv(csvContent: string, filename: string) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  logout() {
    this.app_service.logout();
  }
}
