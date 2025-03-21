export enum SystemBundleEnum {
    NAME = 'Комплект услуг, описание группы'
}

export type TSystemBundle = {
    id: string;
    name: SystemBundleEnum.NAME;
    description: string;
}