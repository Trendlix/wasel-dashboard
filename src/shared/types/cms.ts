export interface ServiceCard {
    tag: string;
    title: string;
    description: string;
    img: string;
}

export interface ServiceSection {
    title: string[];
    description: string;
    cards: ServiceCard[];
}

export interface SyncServicesDto {
    hero: ServiceSection;
    warehouse: ServiceSection;
    advertising: ServiceSection;
}
