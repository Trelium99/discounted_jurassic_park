export type dinoFeedingEvent = {
    kind: string;
    dinoId: number;
    timestamp: string;
    park_id: number;
}

export type dinoLocationEvent = {
    kind: string;
    dinoId: number;
    timestamp: string;
    park_id: number;
    location: string;
}

export type dinoRemovalEvent = {
    kind: string;
    dinosaur_id: number;
    timestamp: string;
    park_id: number;
}

export type maintenanceEvent = {
    kind: string;
    timestamp: string;
    park_id: number;
    location: string;
}

export type dinoAddedEvent = {
    kind: string;
    name: string;
    species: string;
    gender: string;
    id: number;
    digestion_period_in_hours: number;
    herbivore: boolean;
    timestamp: string;
    park_id: number;
}


export type activeDinoProfile = {
    id: number;
    dinosaur_name: string;
    dinosaur_species: string;
    dinosaur_gender: string;
    last_feeding_timestamp: string;
    last_known_location: string;
    last_location_timestamp: string;
    park_id: number;
    digestion_period: number;
    herbivore: boolean;
    time_til_next_feeding: number;
}


export type maintenanceZone = {
    park_id: number;
    location: string;
    timestamp: string;
    needs_maintenance: boolean;
    is_safe: boolean;
    days_until_next_maintenance: number;
    danger_reason?: string;
}