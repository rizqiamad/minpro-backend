import { ITicketCartItem } from "./ticketCart";

export interface requestBody {
  coupon: boolean;
  base_price: number;
  final_price: number;
  ticketCart: ITicketCartItem[];
}
