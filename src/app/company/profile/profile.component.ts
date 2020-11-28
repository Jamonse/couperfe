import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Company } from 'src/app/authentication/model/company.model';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  companyToDisplay$: Observable<Company>;

  constructor(private authService: AuthenticationService) 
  { 
    
  }

  ngOnInit(): void {
   this.companyToDisplay$ = this.authService.client$.pipe(
     map((loadedCompany: Company) => loadedCompany)
   );
  }

}
