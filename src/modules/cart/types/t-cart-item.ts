import { TProduct } from "./t-product";
import { TService } from "./t-service";

export type TCartItem = {
    product: TProduct;
    count: number;
    services: Record<string, { service: Partial<TService>; count: number; checked: boolean }>;
};