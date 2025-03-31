import { TCartItem } from "./t-cart-item";

export type TCartState = {
    items: Record<string, TCartItem>;
};