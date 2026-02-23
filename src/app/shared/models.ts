export interface StrategicPartner {
    id: number;
    name: string;
    subtitle: string;
    highlight: string;
}

export interface TrustedPartner {
    name: string;
    logo: string;
}

export interface Benefit {
    id: number;
    label: string;
}

export interface Service {
    id: number;
    title: string;
    description: string;
    icon: 'seed' | 'pov' | 'comanage' | 'cloud';
}
