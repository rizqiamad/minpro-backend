export interface ITicketCartItem {
  qty: number;
  ticket: {
    id: number;
    price: number;
    seats: number;
  };
}
