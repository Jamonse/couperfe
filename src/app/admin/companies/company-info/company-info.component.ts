import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Company } from 'src/app/authentication/model/company.model';
import { CompaniesStore } from 'src/app/shared/companies/store/companies.store';
import { LoadingService } from 'src/app/shared/loading/service/loading.service';

@Component({
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.css']
})
export class CompanyInfoComponent implements OnInit {
  
  companyToDiaply: Company;

  constructor(
    private companiesStore: CompaniesStore,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService) 
  {
    
  }

  ngOnInit(): void {
    const loadedCompany$ = this.companiesStore.loadCompany(this.route.snapshot.params['id'])
      .pipe(tap(loadedCompany => this.companyToDiaply = loadedCompany));
    this.loadingService.displayLoadingUntil(loadedCompany$).subscribe();
  }

}
