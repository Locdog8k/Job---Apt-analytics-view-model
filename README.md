# Australia Job & Apartment Analytics

A small editable interface for comparing jobs and apartments across Australia.
It works as a simple browser-based database with:

- one editable table for jobs
- one editable table for apartments
- automatic map placement for known Australian locations
- a small dashboard for counts, average pay/rent, and best estimated net option
- JSON export/import for easy backup and editing

## How to run

Open `index.html` directly in a browser, or serve the folder locally:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

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
3. Locations are mapped automatically when they match a known Australian city,
   suburb, state, or territory in `app.js`.
4. Use **Export JSON** to save your data.
5. Use **Import JSON** to load a saved database.

The data is also saved automatically in browser local storage, so edits remain
available when you reopen the page in the same browser.

## Supported map locations

The app includes common Australian cities and suburbs such as Sydney, Melbourne,
Brisbane, Perth, Adelaide, Hobart, Darwin, Canberra, Gold Coast, Newcastle,
Wollongong, Geelong, Cairns, Townsville, Sunshine Coast, Toowoomba, Ballarat,
Bendigo, Alice Springs, Launceston, Fremantle, Parramatta, Bondi, Newtown,
St Kilda, Carlton, Southbank, Docklands, Fortitude Valley, South Brisbane,
Northbridge, Subiaco, and Chatswood.

To add more automatic placements, extend the `CITY_COORDS` array in `app.js`
with aliases, latitude, longitude, and display label.
