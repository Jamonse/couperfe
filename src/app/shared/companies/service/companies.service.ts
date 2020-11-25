import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from 'src/app/authentication/model/company.model';
import { 
  COMPANY_DELETE_URL, 
  COMPANY_GET_ALL_URL, 
  COMPANY_GET_EXAMPLE_URL, 
  COMPANY_GET_PAGED_SORTED_URL, 
  COMPANY_GET_PAGED_URL, 
  COMPANY_GET_URL, 
  COMPANY_POST_URL, 
  COMPANY_PUT_URL } from '../../utils/api.utils';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  constructor(private httpClient: HttpClient) { }

  addCompany(company: Company): Observable<Company>
  {
    return this.httpClient.post<Company>(COMPANY_POST_URL, company);
  }

  updateCompany(company: Company): Observable<any>
  {
    return this.httpClient.put(COMPANY_PUT_URL, company);
  }

  getCompany(companyId: number): Observable<Company>
  {
    return this.httpClient.get<Company>(COMPANY_GET_URL + companyId);
  }

  getAllCompanies(): Observable<any>
  {
    return this.httpClient.get<Company[]>(COMPANY_GET_ALL_URL);
  }

  getAllCompaniesPaged(pageIndex: number, pageSize: number): Observable<any>
  {
    const requestParams = new HttpParams()
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString());
    return this.httpClient.get<Company[]>(COMPANY_GET_PAGED_URL, {params: requestParams});
  }

  getAllCompaniesPagedAndSorted(pageIndex: number, pageSize: number, 
    sortBy: string, asc: boolean): Observable<any>
  {
    const requestParams = new HttpParams()
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
        .set('sortBy', sortBy)
        .set('asc', String(asc));
    return this.httpClient.get<Company[]>(COMPANY_GET_PAGED_SORTED_URL, {params: requestParams});
  }

  getCompaniesByNameExample(resultsCount: number, nameExample: string): Observable<Company[]>
  { // Get companies based on name example
    const requestParams = new HttpParams()
      .set('resultsCount', resultsCount.toString())
      .set('nameExample', nameExample);
    return this.httpClient.get<Company[]>(COMPANY_GET_EXAMPLE_URL, {params: requestParams});
  }

  deleteCompany(companyId: number): Observable<any>
  {
    return this.httpClient.delete(COMPANY_DELETE_URL + companyId);
  }

}
