import { Company } from 'src/app/authentication/model/company.model';
import { Category } from 'src/app/core/model/category.model';

export class Coupon
{
    constructor(
        public id: number, 
        public title: string,
        public price: number,
        public quantity: number,
        public category: Category,
        public ownerCompany: Company,
        public startDate: Date,
        public endDate: Date,
        public imagePath: string,
        public description: string) { }
}