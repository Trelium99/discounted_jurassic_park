# Dino Park Maintenance Center

A maintenance dashboard for Dinopark. Crews walk into zones to service fences, cameras, and other equipment. Last year eight workers were lost. This tool reads the park monitoring feed and shows, for the moment the feed was loaded, which zones are safe to enter and which ones need maintenance.

The safety colour is the requirement. A reviewer should be able to click any zone and see why it looks the way it does, then check that answer against the feed.

## Run

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Vite prints a local URL. Open it in a browser.

```bash
npm run build
npm run preview
```

The app loads the NUDLS feed once, when the page opens:

https://dinoparks.herokuapp.com/nudls/feed

Digestion time and the 30-day maintenance clock are calculated from that load. The clock on screen keeps ticking, but zone safety does not. Reload the page to recompute against the current time.

## What you see

- **Active Dinos** lists every dinosaur that has been added and not removed. Herbivores are marked in green. Carnivores are marked in blue. Next feed is the remaining digestion time in hours, or **Hungry** when that time is zero or less.
- **The map** is columns A–Z and rows 0–16. Click a cell.
- **Zone Info** is the justification for that cell: Safety, Danger, Maintenance, Last log, and the dinosaurs standing there.
- The number of accidents shown in the header is the eight workers lost last year. It is not calculated from the feed.

## Grid

The brief divides the park into 26 columns (A–Z) and 16 rows (0–15).

The live feed also contains row 16, for example `A16` and `V16`. The app therefore draws rows **0 through 16** (442 cells). A location is a grid square only when it matches `^[A-Z]([0-9]|1[0-6])$`. Anything else is not painted on a cell.

## How a dinosaur is placed

The feed is a list of events. The app uses these kinds:

| Kind | What it does | Identity field the app reads |
| --- | --- | --- |
| `dino_added` | Creates the animal. Digestion period is `digestion_period_in_hours`. | `id` |
| `dino_removed` | Removes that animal. A removed animal is not active and cannot make a zone unsafe. | `dinosaur_id` |
| `dino_location_updated` | Moves the animal. The latest `time` wins. | `dinosaur_id` |
| `dino_fed` | Records a meal. The latest `time` wins. | `dinosaur_id` |
| `maintenance_performed` | Records a maintenance pass on a cell. The latest `time` for that cell wins. | `location` |

The printed NUDLS samples are inconsistent. `dino_added` uses `id`. `dino_location_updated` uses `dinosaur_id`. The paper samples for `dino_removed` and `dino_fed` show `id`. The live feed uses `dinosaur_id` on those three events, and that is the field this app matches to the added animal's `id`.

Times are ISO-8601 strings in the `time` field.

An animal with no location update has no cell. An animal with no feed event is not digesting.

## Safety

A zone is **unsafe** only when an active carnivore is there and is not still digesting.

- `herbivore: true` never makes a zone unsafe.
- Remaining digestion, in hours, is `digestion_period_in_hours` minus the hours since the latest `dino_fed`.
- Still digesting means that number is greater than 0.
- Hungry means that number is 0 or less, including a carnivore that has never been fed.
- Herbivores, an empty zone, and a zone whose carnivores are all still digesting are **safe**.

Zone Info says **Hungry Carnivore Present** when that rule is met. Otherwise Danger is **None**.

## Maintenance

Every zone needs maintenance every 30 days.

- Days left are `30` minus the days since the latest `maintenance_performed` on that cell.
- **Due** when there is no log, or when days left are 0 or less.
- A cell with no log is treated as needing maintenance. It does **not** get a wrench. The note under Zone Info says this: only cells that have a maintenance log are drawn with a wrench. The other cells are assumed to need maintenance until a log arrives.
- A maintenance event whose location is not a grid square, or which has no `time`, is not applied to a cell.

## Cell colours and icons

The brief asks for a gear on zones that need maintenance, `#51B687` when safe, red when unsafe, and white otherwise.

This app uses a wrench for the gear, and it only draws a coloured overlay when one of the rules below matches. Every other cell stays clear so the map shows through. That clear cell is the "otherwise" state.

Checked in this order:

1. **Unsafe.** Red overlay. A wrench if the cell also needs maintenance and has a maintenance log. A skull if it does not, so the danger stays visible when there is nothing to attach a wrench to.
2. **Safe, maintenance due, and a maintenance log exists.** Green overlay and a wrench. A carnivore that is still digesting does not turn this cell orange. The wrench is the status, because the zone is safe to enter and the work is due.
3. **Safe, and a carnivore there is still digesting, and maintenance is not due.** Orange overlay and a warning triangle.
4. **Anything else.** No overlay and no icon. This includes safe cells with no log, even though Zone Info still says maintenance is Due.

The map key under the grid lists the same four states.

## Check a zone against the feed

1. Reload the app so the numbers match "now".
2. Click the cell, for example `V16`.
3. Read Zone Info. Safety, Danger, Maintenance, Last log, and Dinosaurs are the claim.
4. Open the feed and keep only the events that support that claim.
   - `dino_added` events, and any `dino_removed` whose `dinosaur_id` equals that animal's `id`. A removed animal must not appear on the card.
   - `dino_location_updated` events for the animals that remain. The latest `time` is the cell they occupy. The names on the card must be the active animals whose latest location is this cell.
   - `dino_fed` events for those animals. Latest `time`, then `digestion_period_in_hours - hours since that time`. Greater than 0 means still digesting. A carnivore at 0 or below must make Safety **Unsafe** and Danger **Hungry Carnivore Present**. A herbivore must not.
   - `maintenance_performed` events whose `location` is this cell. The latest `time` is Last log. If that time is more than 30 days ago, Maintenance is **Due** and the cell has a wrench. If it is inside 30 days, the card shows the remaining days and there is no maintenance wrench. If there is no event, Last log is **No log**, Maintenance is **Due**, and the cell has no wrench.
5. The colour on the map has to follow the order in the section above. A hungry carnivore is red even when the cell also needs maintenance. The wrench replaces the skull only when that red cell has a real maintenance log.

## What the app does not do

- Unknown `kind` values are skipped. They do not crash the page, and they are not listed anywhere. A reviewer will not see them in Zone Info.
- The feed is not polled. State is whatever the endpoint returned at load.
- The header accident count is fixed at 8. It does not change when the feed changes.
