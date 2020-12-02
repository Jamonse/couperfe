import { Category } from 'src/app/core/model/category.model';

export class Coupon
{
    constructor(
        public id: number, 
        public title: string,
        public price: number,
        public quantity: number,
        public category: Category,
        public startDate: Date,
        public endDate: Date,
        public description: string) { }
}