import { ITicketCartItem } from "./ticketCart"

export interface requestBody{
  base_price: number
  final_price: number
  ticketCart: ITicketCartItem[]
}