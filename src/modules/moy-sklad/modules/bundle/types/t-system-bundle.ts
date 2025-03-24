export enum SystemBundleEnum {
    NAME = 'Комплект услуг, описание группы',
    IS_VISIBLE_FOR_APP = 'Видимость для приложения',
}

export type TSystemBundle = {
    id: string;
    name: SystemBundleEnum.NAME;
    description: string;
}