export class Client
{
    id: number;
    email: string;
    password: string;

    constructor(id: number, email: string, passowrd: string) 
    { 
        this.id = id;
        this.email = email;
        this.password = passowrd;
    }
  
}