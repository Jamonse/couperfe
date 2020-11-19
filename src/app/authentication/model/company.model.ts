import { Client } from './client.model';

export class Company extends Client
{
    name: string;
    
    constructor(id: number, email: string, name: string)
    {
        super(id, email);
        this.name = name;
    }
}