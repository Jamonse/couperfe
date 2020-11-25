import { Client } from './client.model';

export class Company extends Client
{
    name: string;
    
    constructor(id: number, email: string, password: string, name: string)
    {
        super(id, email, password);
        this.name = name;
    }
}