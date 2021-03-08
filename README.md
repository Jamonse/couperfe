![image](https://user-images.githubusercontent.com/67602805/110339089-6f5bba00-8030-11eb-8c9a-3b183ebf5eb8.png)
## Front end application for the couper project, my final project during college studies :mortar_board:

The application allows admin user to sign companies that can publish coupons and customer that can purchase them.
The system is based on angular 9 and utilzies several features of the framwork:

- HTTP Client based services.
- Components and sub-components.
- Routes and guards.
- Lazy loaded feature modules.

With some additional custom features:

- Custom state management mechanism
```typescript
@Injectable({
    providedIn: 'root'
})
export class ClientCouponsStore
{
    private couponsSubject = new BehaviorSubject<Coupon[]>([]);
    ...
}
```
- Custom responsive tool-tip directive
```typescript
@HostListener('mouseenter')
initTooltip()
{
  const element = this.elementRef.nativeElement;
  this.matTooltip.disabled = element.scrollWidth <= element.clientWidth;
}
```
- Request based search with custom highlighting pipe
```typescript
if(!match)
{ // Regex does not match with the value
  return value;
}
// Regex match! return the value with bold tags around the match
return value.replace(regex, `<b>${match[0]}</b>`);
```
The application is deployed to Heroku CLoud Platform and is available on: https://couper.herokuapp.com (While dynos are up), you are more than welcome to check it out!

![image](https://user-images.githubusercontent.com/67602805/110339281-aaf68400-8030-11eb-8cac-4f3662dd3e14.png)
