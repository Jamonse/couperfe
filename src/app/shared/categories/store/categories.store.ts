import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Category } from 'src/app/core/model/category.model';
import { LoadingService } from '../../loading/service/loading.service';
import { CategoriesService } from '../service/categories.service';

@Injectable({
    providedIn: 'root'
})
export class CategoriesStore
{
    private categoriesSubject = new BehaviorSubject<Category[]>([]);

    categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

    constructor(
        private categoriesService: CategoriesService,
        private loadingService: LoadingService)
    {
        this.loadAllCategories();
    }

    private loadAllCategories()
    {
        const loadedCategories$ = this.categoriesService.getAllCategories().pipe(
            catchError(err => { // Error during loading process
                return throwError(err);
            }), // Initialize subject with loaded categories
            tap(loadedCategories => this.categoriesSubject.next(loadedCategories))
        );

        this.loadingService.displayLoadingUntil(loadedCategories$).subscribe();
    }

    saveCategory(category: Category): Observable<Category>
    {
        if(category.id == null || category.id == 0)
        { // Add mode
            return this.addCategory(category);
        }
        else
        { // Update mode
            return this.updateCategory(category);
        }
    }

    private addCategory(categoryToAdd: Category): Observable<Category>
    {
        return this.categoriesService.addCategory(categoryToAdd).pipe(
            catchError(err => { // Error during adding process
                return throwError(err);
            }),
            tap(addedCategory => {
                const categories = this.categoriesSubject.getValue();
                categories.push(addedCategory);
                this.categoriesSubject.next(categories);
            })
        );
    }

    private updateCategory(categoryToUpdate: Category): Observable<any>
    {
        return this.categoriesService.updateCategory(categoryToUpdate).pipe(
            catchError(err => { // Error during updating process
                return throwError(err);
            }),
            tap(() => {
                const categories = this.categoriesSubject.getValue();
                const categoryIndex = categories // Exctract the category index in the subject
                    .findIndex(category => category.id === categoryToUpdate.id);
                // Extracting category to update from subject
                const updatedCategory = {
                    ...categories[categoryIndex],
                    ...categoryToUpdate
                }
                // Create and update categories array
                const updatedCategories: Category[] = categories.slice(0);
                updatedCategories[categoryIndex] = updatedCategory;
                // Re-initialize the subject
                this.categoriesSubject.next(updatedCategories);
            })
        )
    
    }

    deleteCategory(categoryId: number): Observable<any>
    {
        return this.categoriesService.deleteCategory(categoryId).pipe(
            catchError(err => {
                return throwError(err);
            })
        );
    }
}