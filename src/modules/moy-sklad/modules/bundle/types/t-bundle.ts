// Типизация для компонента
export type TComponent = {
    meta: {
        href: string;
        type: string;
        mediaType: string;
    };
    id: string;
    accountId: string;
    assortment: {
        meta: {
            href: string;
            metadataHref: string;
            type: string;
            mediaType: string;
            uuidHref: string;
        };
    };
    quantity: number;
}

// Типизация для ответа от API
export type TBundleComponentsResponse = {
    meta: {
        href: string;
        type: string;
        mediaType: string;
        size: number;
        limit: number;
        offset: number;
    };
    rows: TComponent[];
}