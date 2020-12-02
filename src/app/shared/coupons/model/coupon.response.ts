import { Coupon } from './coupon';

export interface CouponResponse
{
    content: Coupon[];
    totalElements: number;
}