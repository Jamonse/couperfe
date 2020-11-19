import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/core/model/category.model';
import { APIUtils } from '../../utils/api-utils';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private CATEGORY_URL = '/admin/category/';

  private POST_CATEGORY_URL = APIUtils.API_URL + this.CATEGORY_URL + 'add';
  private PUT_CATEGORY_URL = APIUtils.API_URL + this.CATEGORY_URL + 'update'
  private ALL_CATEGORIES_URL = APIUtils.API_URL + this.CATEGORY_URL + 'get/all';
  private DELETE_CATEGORY_URL = APIUtils.API_URL + this.CATEGORY_URL + '/delete/';

  constructor(private httpClient: HttpClient) { }
  
  addCategory(category: Category): Observable<Category>
  {
    return this.httpClient.post<Category>(this.POST_CATEGORY_URL, category);
  }

  updateCategory(category: Category): Observable<any>
  {
    return this.httpClient.put(this.PUT_CATEGORY_URL, category);
  }

  getAllCategories(): Observable<Category[]>
  {
    return this.httpClient.get<Category[]>(this.ALL_CATEGORIES_URL);
  }

  deleteCategory(categoryId: number): Observable<any>
  {
    return this.httpClient.delete(this.DELETE_CATEGORY_URL + categoryId);
  }

}
