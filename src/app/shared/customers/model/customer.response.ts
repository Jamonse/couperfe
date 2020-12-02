import { Customer } from 'src/app/authentication/model/customer.model';

export interface CustomerResponse
{
    content: Customer[];
    totalElements: number;
}