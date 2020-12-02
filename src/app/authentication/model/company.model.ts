
import { Coupon } from 'src/app/shared/coupons/model/coupon';
import { Client } from './client.model';

export class Company extends Client
{
    name: string;
    coupons: Coupon[];
    
    constructor(id: number, email: string, password: string, name: string, coupons: Coupon[])
    {
        super(id, email, password);
        this.name = name;
        this.coupons = coupons;
    }
}