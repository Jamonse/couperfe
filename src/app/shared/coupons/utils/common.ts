export class CouponUtils
{
    public static COUPON_SORT_OPTIONS: string[][] = [
        ['Title', 'title'],
        ['Description', 'description'],
        ['Price', 'price'], 
        ['Quantity', 'quantity'], 
        ['Start Date', 'startDate'], 
        ['End Date', 'endDate']
      ];

    private static IMAGE_BASE_URL: string = '/assets/coupon-pics/';
    public static couponImages: CouponImage[] = [
      {url: CouponUtils.IMAGE_BASE_URL + "coupon.jpg", name: 'Coupon'},
      {url: CouponUtils.IMAGE_BASE_URL + "airport.jpg", name: 'Airport'},
      {url: CouponUtils.IMAGE_BASE_URL + "book-shelf.jpg", name: 'Book-shelf'},
      {url: CouponUtils.IMAGE_BASE_URL + "books.jpg", name: 'Books'},
      {url: CouponUtils.IMAGE_BASE_URL + "breakfest.jpg", name: 'Breakfest'},
      {url: CouponUtils.IMAGE_BASE_URL + "city.jpg", name: 'City'},
      {url: CouponUtils.IMAGE_BASE_URL + "coffee-shop.jpg", name: 'Coffee'},
      {url: CouponUtils.IMAGE_BASE_URL + "concerte.jpg", name: 'Concerte'},
      {url: CouponUtils.IMAGE_BASE_URL + "flight.jpg", name: 'Flight'},
      {url: CouponUtils.IMAGE_BASE_URL + "gift.jpg", name: 'Gift'},
      {url: CouponUtils.IMAGE_BASE_URL + "holydays.jpg", name: 'Holydays'},
      {url: CouponUtils.IMAGE_BASE_URL + "laptops.jpg", name: 'Laptops'},
      {url: CouponUtils.IMAGE_BASE_URL + "office.jpg", name: 'Office'},
      {url: CouponUtils.IMAGE_BASE_URL + "sweets.jpg", name: 'Sweets'},
      {url: CouponUtils.IMAGE_BASE_URL + "tech.jpg", name: 'Tech'},
      {url: CouponUtils.IMAGE_BASE_URL + "wing.jpg", name: 'Wing'},
      {url: CouponUtils.IMAGE_BASE_URL + "x-mas.jpg", name: 'X-Mas'}
    ]
}

export interface CouponImage
{
  url: string;
  name: string;
}