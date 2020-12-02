import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/core/model/category.model';
import { ClientType } from 'src/app/core/model/client-type';
import { 
  CATEGORY_POST_URL,
  CATEGORY_PUT_URL,
  ADMIN_CATEGORY_GET_ALL_URL,
  COMPANY_CATEGORY_GET_ALL_URL,
  CUSTOMER_CATEGORY_GET_ALL_URL,
  CATEGORY_DELETE_URL
} from '../../utils/api.utils';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private httpClient: HttpClient) { }
  
  addCategory(category: Category): Observable<Category>
  {
    return this.httpClient.post<Category>(CATEGORY_POST_URL, category);
  }

  updateCategory(category: Category): Observable<any>
  {
    return this.httpClient.put(CATEGORY_PUT_URL, category);
  }

  getAllCategories(clientType: ClientType): Observable<Category[]>
  {
    switch(clientType)
    {
      case ClientType.ADMIN:
        return this.httpClient.get<Category[]>(ADMIN_CATEGORY_GET_ALL_URL);
      case ClientType.COMPANY:
        return this.httpClient.get<Category[]>(COMPANY_CATEGORY_GET_ALL_URL);
      case ClientType.CUSTOMER:
        return this.httpClient.get<Category[]>(CUSTOMER_CATEGORY_GET_ALL_URL);
    }
  }

  deleteCategory(categoryId: number): Observable<any>
  {
    return this.httpClient.delete(CATEGORY_DELETE_URL + categoryId);
  }

}
