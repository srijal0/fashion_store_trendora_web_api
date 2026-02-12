export interface CartItem {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  quantity: number;
  image?: string;
}
