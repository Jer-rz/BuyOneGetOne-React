export interface Product {
  id: number;
  name: string;
  price: number;
  code: string;
}

export interface Order {
  id: number;
  customer_name: string;
  total_price: number;
}

export interface Basket {
  id: number;
  name: string;
  quantity: number;
}

export interface OrderItemAttributes {
  product_id: number;
  quantity: number;
}

export interface OrderPayload {
  order: {
    customer_name: string;
    order_items_attributes: OrderItemAttributes[];
  };
}
