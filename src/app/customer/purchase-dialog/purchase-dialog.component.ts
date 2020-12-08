import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Coupon } from 'src/app/shared/coupons/model/coupon';
import { ShopCouponStore } from 'src/app/shared/coupons/store/coupons-shop.store';
import { LoadingService } from 'src/app/shared/loading/service/loading.service';

@Component({
  templateUrl: './purchase-dialog.component.html',
  styleUrls: ['./purchase-dialog.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class PurchaseDialogComponent implements OnInit {

  coupons: Coupon[];
  selectedPaymentMethod: string;

  orderConfirmed: boolean;
  paymentMethodChosen: boolean;

  paymentMethods: PaymentMethod[] = [
    {name: 'Visa', imageUrl: '/assets/icons/visa.png'},
    {name: 'Master Card ', imageUrl: '/assets/icons/master-card.png'},
    {name: 'PayPal', imageUrl: '/assets/icons/paypal.png'},
    {name: 'Bitcoin', imageUrl: '/assets/icons/bitcoin.png'},
  ]

  constructor(
    private couponsStore: ShopCouponStore,
    private dialogRef: MatDialogRef<PurchaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CouponPurchaseData,
    private loadingService: LoadingService) 
    { 
      this.coupons = data.coupons;
    }

  ngOnInit(): void {
  }

  purchaseCoupons()
  {
    const purchasedCoupons$ = this.couponsStore.purchaseCoupons(this.coupons);
    this.loadingService.displayLoadingUntil(purchasedCoupons$).subscribe(() => this.dialogRef.close(true));
  }

  onClose()
  {
    this.dialogRef.close();
  }

  get totalPrice(): number
  {
    let price: number = 0;
    this.coupons.forEach(coupon => price += coupon.price);
    return price;
  }

}

export interface CouponPurchaseData
{
  coupons: Coupon[];
}

export interface PaymentMethod
{
  imageUrl: string;
  name: string;
}

