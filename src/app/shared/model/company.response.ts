import { Company } from '../../authentication/model/company.model';

export interface CompanyResponse
{
    content: Company[];
    totalElements: number;
}