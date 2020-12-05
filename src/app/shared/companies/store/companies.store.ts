import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { Company } from 'src/app/authentication/model/company.model';
import { CompanyResponse } from 'src/app/shared/companies/model/company.response';
import { LoadingService } from '../../loading/service/loading.service';
import { MessagesService } from '../../messages/service/messages.service';
import { CompanySearchResult } from '../model/company.search-result';
import { CompaniesService } from '../service/companies.service';

@Injectable({
    providedIn: 'root'
})
export class CompaniesStore
{
    private companiesSubject = new BehaviorSubject<Company[]>([]);
    count = 0;
    pageIndex = 0;
    pageSize = 0;
    sortBy: 'name' | 'email';
    sortDirection: boolean = true;

    companies$: Observable<Company[]> = this.companiesSubject.asObservable();

    constructor(
        private companiesService: CompaniesService,
        private loadingService: LoadingService,
        private messagesService: MessagesService)
    {
        this.loadCompanies();
    }

    saveCompany(company: Company): Observable<Company>
    {
        if(company.id == null || company.id == 0)
        {
            return this.addCompany(company);
        }
        else
        {
            return this.updateCompany(company);
        }
    }

    private addCompany(company: Company): Observable<Company>
    {
        return this.companiesService.addCompany(company).pipe(
            catchError(err => {
                if(err.status === 406)
                {
                    this.messagesService.displayErrors(err.error.message);
                }
                return throwError(err);
            })
        )
    }

    private updateCompany(company: Company): Observable<Company>
    {
        return this.companiesService.updateCompany(company).pipe(
            catchError(err => {
                if(err.status === 406)
                {
                    this.messagesService.displayErrors(err.error.message);
                }
                return throwError(err);
            })
        );
    }

    loadCompany(companyId): Observable<Company>
    {
        return this.companiesService.getCompany(companyId).pipe(
            catchError(err => {
                if(err.status === 404)
                {
                    this.messagesService.displayErrors(err.error.message);
                }
                return throwError(err);
            })
        );
    }

    loadCompanies(pageIndex = 0, pageSize = 5, sortBy?: 'name' | 'email', asc?: boolean)
    {
        sortBy ?
            this.loadCompaniesPagedAndSorted(pageIndex, pageSize, sortBy, asc) :
            this.loadCompaniesPaged(pageIndex, pageSize);
    }

    private loadCompaniesPaged(pageIndex: number, pageSize: number)
    {
        const loadedCompanies$ = this.companiesService
            .getAllCompaniesPaged(pageIndex, pageSize).pipe(
            catchError(err => {
                this.messagesService.displayErrors('Could not load companies');
                return throwError(err);
            }),
            tap((loadedCompanies: CompanyResponse) => {
                this.companiesSubject.next(loadedCompanies.content);
                this.count = loadedCompanies.totalElements;
                this.pageIndex = pageIndex;
                this.pageSize = pageSize;
            })
        );
        this.loadingService.displayLoadingUntil(loadedCompanies$).subscribe();
    }

    private loadCompaniesPagedAndSorted(pageIndex: number, pageSize: number, sortBy:  'name' | 'email', asc: boolean)
    {
        const loadedCompanies$ = this.companiesService
            .getAllCompaniesPagedAndSorted(pageIndex, pageSize, sortBy, asc).pipe(
            catchError(err => {
                this.messagesService.displayErrors('Could not load companies');
                return throwError(err)
            }),
            tap((loadedCompanies: CompanyResponse) => {
                this.companiesSubject.next(loadedCompanies.content);
                this.count = loadedCompanies.totalElements;
                this.pageIndex = pageIndex;
                this.pageSize = pageSize;
                this.sortBy = sortBy;
                this.sortDirection = asc;
            })
        );
        this.loadingService.displayLoadingUntil(loadedCompanies$).subscribe();
    }

    loadSearchedCompanies(resultsCount: number = 5, nameExample: string): Observable<CompanySearchResult[]>
    {
        return this.companiesService.getCompaniesByNameExample(
            resultsCount, nameExample).pipe(
                retry(3),
                catchError(err => {
                    return throwError(err)
                })
            );
    }

    deleteCompany(companyId: number): Observable<any>
    {
        return this.companiesService.deleteCompany(companyId).pipe(
            catchError(err => {
                return throwError(err)
            })
        );
    }

}