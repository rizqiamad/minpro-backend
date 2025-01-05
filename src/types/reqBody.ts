import { ITicketCartItem } from "./ticketCart";

export interface requestBody {
  point: number;
  coupon: boolean;
  base_price: number;
  final_price: number;
  ticketCart: ITicketCartItem[];
}
