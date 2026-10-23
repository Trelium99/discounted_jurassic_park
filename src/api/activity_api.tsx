import type { activeDinoProfile, dinoAddedEvent, dinoRemovalEvent, maintenanceZone, unappliedMaintenanceEvent } from "../types/event_types";

export async function getActivity() {
    const response = await fetch("https://dinoparks.herokuapp.com/nudls/feed");
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const activeDinosList: dinoAddedEvent[] = [];

    for (const event of data as any){
        if (event.kind === "dino_added"){
            if (!checkDinoActive(event as dinoAddedEvent, data)) {
                activeDinosList.push(event as dinoAddedEvent);
            }
        }
    }

    const dinoProfiles = buildDinoProfiles(data, activeDinosList);
    const maintenanceSchedule = buildMaintenanceSchedule(data, dinoProfiles);
    const unappliedMaintenance = listUnappliedMaintenance(data);

    return { dinoProfiles, maintenanceSchedule, unappliedMaintenance };
}

function checkDinoActive(dinoEvent: dinoAddedEvent, activity: any){
    for (const event of activity as any) {
        if ((event as dinoRemovalEvent).kind === "dino_removed") {
            if ((event as dinoRemovalEvent).dinosaur_id === dinoEvent.id) {
                return true;
            }
        }
    }
    return false;
}


function buildDinoProfiles(activityLogs: any[], activeDinosList: dinoAddedEvent[]){
    const activeDinoProfiles: activeDinoProfile[] = [];
    for (const dino of activeDinosList) {
        activeDinoProfiles.push({
            id: dino.id,
            dinosaur_name: dino.name,
            dinosaur_species: dino.species,
            dinosaur_gender: dino.gender,
            last_feeding_timestamp: "",
            last_known_location: "",
            last_location_timestamp: "",
            park_id: dino.park_id,
            digestion_period: dino.digestion_period_in_hours,
            herbivore: dino.herbivore,
            time_til_next_feeding: 0,
        });
    }

    for (const event of activityLogs) {
        for (const dinoProfile of activeDinoProfiles) {
            if (event.dinosaur_id === dinoProfile.id && event.kind === "dino_location_updated") {
                if (event.time) {
                    const eventTime = Date.parse(event.time);
                    const savedTime = dinoProfile.last_location_timestamp
                        ? Date.parse(dinoProfile.last_location_timestamp)
                        : Number.NEGATIVE_INFINITY;
                    if (eventTime > savedTime) {
                        dinoProfile.last_location_timestamp = event.time;
                        dinoProfile.last_known_location = event.location;
                    }
                }
            }

            if (event.dinosaur_id === dinoProfile.id && event.kind === "dino_fed") {
                if (event.time) {
                    const eventTime = Date.parse(event.time);
                    const savedTime = dinoProfile.last_feeding_timestamp
                        ? Date.parse(dinoProfile.last_feeding_timestamp)
                        : Number.NEGATIVE_INFINITY;
                    if (eventTime > savedTime) {
                        dinoProfile.last_feeding_timestamp = event.time;
                    }
                }
            }
        }
    }

    for (const dinoProfile of activeDinoProfiles) {
        if (!dinoProfile.last_feeding_timestamp) {
            continue;
        }
        const lastFed = Date.parse(dinoProfile.last_feeding_timestamp);
        const elapsedHours = (Date.now() - lastFed) / (60 * 60 * 1000);
        dinoProfile.time_til_next_feeding = dinoProfile.digestion_period - elapsedHours;
    }

    return activeDinoProfiles;
}

function isGridSquare(location: unknown) {
    return typeof location === "string" && /^[A-Z]([0-9]|1[0-6])$/.test(location);
}

function listUnappliedMaintenance(activityLogs: any[]): unappliedMaintenanceEvent[] {
    const skipped: unappliedMaintenanceEvent[] = []
    for (const event of activityLogs) {
        if (event.kind !== "maintenance_performed") {
            continue
        }
        const reasons: string[] = []
        if (!event.time) {
            reasons.push("no time")
        }
        if (!isGridSquare(event.location)) {
            reasons.push("location is not a grid square")
        }
        if (reasons.length === 0) {
            continue
        }
        skipped.push({
            location: event.location == null ? "" : String(event.location),
            time: event.time == null ? "" : String(event.time),
            reason: reasons.join("; "),
        })
    }
    return skipped
}

function buildMaintenanceSchedule(activityLogs: any[], activeDinoProfiles: activeDinoProfile[]){
    let parkId = 1;
    for (const event of activityLogs) {
        if (event.park_id != null) {
            parkId = event.park_id;
            break;
        }
    }

    const columns = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const maintenanceSchedule: maintenanceZone[] = [];
    for (const column of columns) {
        for (let row = 0; row <= 16; row++) {
            maintenanceSchedule.push({
                park_id: parkId,
                location: `${column}${row}`,
                timestamp: "",
                needs_maintenance: false,
                is_safe: true,
                days_until_next_maintenance: 0,
            });
        }
    }

    for (const event of activityLogs) {
        if (event.kind !== "maintenance_performed" || !event.time || !isGridSquare(event.location)) {
            continue;
        }
        const zone = maintenanceSchedule.find((entry) => entry.location === event.location);
        if (!zone) {
            continue;
        }
        const eventTime = Date.parse(event.time);
        const savedTime = zone.timestamp ? Date.parse(zone.timestamp) : Number.NEGATIVE_INFINITY;
        if (eventTime > savedTime) {
            zone.timestamp = event.time;
            zone.park_id = event.park_id;
        }
    }

    for (const zone of maintenanceSchedule) {
        const dinosHere = activeDinoProfiles.filter((dino) => dino.last_known_location === zone.location);
        let isSafe = true;
        for (const dino of dinosHere) {
            const carnivoreIsDigesting = !dino.herbivore && dino.time_til_next_feeding > 0;
            const carnivoreIsHungry = !dino.herbivore && !carnivoreIsDigesting;
            if (carnivoreIsHungry) {
                isSafe = false;
                zone.danger_reason = "Hungry Carnivore Present";
            }
        }
        zone.is_safe = isSafe;

        if (!zone.timestamp) {
            zone.days_until_next_maintenance = 0;
            zone.needs_maintenance = true;
            continue;
        }
        const elapsedDays = (Date.now() - Date.parse(zone.timestamp)) / (24 * 60 * 60 * 1000);
        zone.days_until_next_maintenance = 30 - elapsedDays;
        zone.needs_maintenance = zone.days_until_next_maintenance <= 0;
    }

    return maintenanceSchedule;
}