import { Client } from './client.model';

export class Customer extends Client
{
    firstName: string;
    lastName: string;

    constructor(id: number, email: string, password: string, firstName: string, lastName: string)
    {
        super(id, email, password);
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public get name()
    {
        return this.firstName + ' ' + this.lastName;
    }
    
}