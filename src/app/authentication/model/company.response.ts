import { Company } from './company.model';

export interface CompanyResponse
{
    content: Company[];
    totalElements: number;
}