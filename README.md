# Australia Job & Apartment Analytics

A small editable interface for comparing jobs and apartments across Australia.
It works as a simple browser-based database with:

- one editable table for jobs
- one editable table for apartments
- automatic map placement from a local Australian city/town database
- an interactive OpenStreetMap view focused on Australia
- a smart city/town selector that filters as you type
- a small dashboard for counts, average pay/rent, and best estimated net option
- JSON export/import for easy backup and editing

## How to run

Serve the folder locally:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

The map uses Leaflet and OpenStreetMap tiles, so it needs an internet connection
to display the map background. The city/town matching database is local and is
included in `data/australia-places.js`.

## How to use

1. Edit the jobs table:
   - job name
   - company
   - location
   - hourly pay
   - hours per week
   - notes
2. Edit the apartments table:
   - apartment name
   - location
   - monthly price
   - bedrooms
   - link
   - notes
3. In a location field, type the first letter or first few letters of a city or
   town. Matching Australian places appear directly under the field; click one
   to select it. The selector uses a first-letter index and only renders a small
   result set to stay responsive.
4. Locations are mapped automatically when they match an Australian city, town,
   or populated place in `data/australia-places.js`. For ambiguous names, add
   the state/territory abbreviation, for example `Richmond VIC` or `Richmond NSW`.
5. Use **Export JSON** to save your data.
6. Use **Import JSON** to load a saved database.

The data is also saved automatically in browser local storage, so edits remain
available when you reopen the page in the same browser.

## Location database

The app includes 19,234 Australian populated-place records generated from the
GeoNames Australia dump. Each record stores:

- name
- state/territory abbreviation
- latitude
- longitude
- population when available
- GeoNames feature code

The app uses each place's latitude and longitude to place its marker on the
OpenStreetMap view. Job and apartment points use different marker colors.

To refresh or expand the database, regenerate `data/australia-places.js` from a
current GeoNames AU export and keep the same `window.AUSTRALIA_PLACES` format.

## Attribution

- Location data: GeoNames, licensed under Creative Commons Attribution 4.0.
- Interactive map: Leaflet.
- Map tiles/data: OpenStreetMap contributors.
