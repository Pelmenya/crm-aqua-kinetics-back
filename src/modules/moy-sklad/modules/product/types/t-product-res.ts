type TMeta = {
    href: string;
    metadataHref: string;
    type: string;
    mediaType: string;
    uuidHref?: string;
  };
  
  type TOwner = {
    meta: TMeta;
  };
  
  type TGroup = {
    meta: TMeta;
  };
  
  type TProductFolder = {
    meta: TMeta;
  };
  
  type TUom = {
    meta: TMeta;
  };
  
  type TImages = {
    meta: TMeta & { size: number; limit: number; offset: number };
  };
  
  type TCurrency = {
    meta: TMeta;
  };
  
  type TPrice = {
    meta: TMeta;
    id: string;
    name: string;
    externalCode: string;
  };
  
  type TSalePrice = {
    value: number;
    currency: TCurrency;
    priceType: TPrice;
  };
  
  type TAttribute = {
    meta: TMeta;
    id: string;
    name: string;
    type: string;
    value: string | number;
  };
  
  type TFiles = {
    meta: TMeta & { size: number; limit: number; offset: number };
  };
  
  export type TProductResponse = {
    meta: TMeta;
    id: string;
    accountId: string;
    owner: TOwner;
    shared: boolean;
    group: TGroup;
    updated: string;
    name: string;
    code: string;
    externalCode: string;
    archived: boolean;
    pathName: string;
    productFolder: TProductFolder;
    effectiveVat: number;
    effectiveVatEnabled: boolean;
    vat: number;
    vatEnabled: boolean;
    useParentVat: boolean;
    uom: TUom;
    images: TImages;
    minPrice: {
      value: number;
      currency: TCurrency;
    };
    salePrices: TSalePrice[];
    buyPrice: {
      value: number;
      currency: TCurrency;
    };
    barcodes: { ean13: string }[];
    attributes: TAttribute[];
    paymentItemType: string;
    discountProhibited: boolean;
    weight: number;
    volume: number;
    variantsCount: number;
    isSerialTrackable: boolean;
    files: TFiles;
    trackingType: string;
  };
  