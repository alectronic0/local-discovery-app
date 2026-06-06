# LocalHerts — Better Understand Your Local Area

An interactive map discovery tool to explore local public services, transport, amenities, and community resources across the UK.

## Features

- **Interactive Map**: Browse councils, transport routes, and local venues
- **Layer Toggles**: Filter by region, country, and transport type (rail/bus)
- **Postcode Search**: Find your location and nearby services
- **Transport Networks**: Visualize rail lines and bus routes with authentic network colours
- **Venue Discovery**: Locate community halls, leisure facilities, nature reserves, and transport hubs
- **Council Links**: Click any council to access their website and services

## Todo List

### Phase 1: Foundation ✓
- [x] Base map setup with Google Maps
- [x] Postcode search and geolocation
- [x] Static venue data (community halls, leisure, nature reserves)
- [x] Layer toggle UI framework

### Phase 2: UK Expansion (In Progress)
- [x] Load all 412+ UK councils with boundaries
- [x] Council region hierarchy (England/Scotland/Wales/Northern Ireland)
- [x] Transport data infrastructure (rail lines, bus routes, stations, stops)
- [x] Hybrid data loading (static GeoJSON + Overpass API fallback)
- [x] Transport visibility toggles
- [ ] **Align transport routes to real streets/infrastructure** ← Next priority
  - Pull actual coordinates from Overpass API or TfL
  - Bake realistic route data into static files
- [ ] Integrate TfL API for London transport (high-quality line data)
- [ ] Council website links (current: hardcoded in councils.json)

### Phase 3: User Experience
- [ ] Mobile-friendly layer toggles
- [ ] Search by council name (not just postcode)
- [ ] Zoom/pan on layer toggle
- [ ] Hover highlighting for councils and routes
- [ ] Performance optimization (boundary caching, data pagination)

### Phase 4: Enhanced Discovery
- [ ] Live council meeting schedules
- [ ] Planning applications layer
- [ ] Budget/spending transparency data
- [ ] Councillor directory
- [ ] Community events aggregation

### Phase 5: Polish
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Performance metrics (Core Web Vitals)
- [ ] Offline support (service worker)
- [ ] Responsive design testing
- [ ] Deployment & CI/CD

## Architecture

```
app.js (main orchestration)
├── js/boundaries.js      (load UK council boundaries)
├── js/layers.js          (region/country toggles)
├── js/council-links.js   (council click handlers)
├── js/transport.js       (rail/bus routes & stops)
├── js/retail.js          (venue discovery)
└── js/utils.js           (postcode, geocoding)

data/
├── councils.json         (all UK councils: name, GSS, website, region)
├── bus-routes.geojson    (sample bus routes - placeholder)
├── bus-stops.geojson     (sample bus stops - placeholder)
├── rail-lines.geojson    (sample rail lines - placeholder)
└── rail-stations.geojson (sample stations - placeholder)
```

## Known Issues

- **Transport routes don't align to streets**: Sample data uses arbitrary coordinates. Next phase will fetch real routes from OpenStreetMap Overpass API or TfL.
- **Overpass API unreliable**: Public tier is often overloaded. Fallback to static data while Overpass is unavailable.
- **Google Maps Marker deprecated**: Using legacy API. Future refactor to AdvancedMarkerElement.

## Quick Start

```bash
# Run local server
python -m http.server 8000

# Open in browser
http://localhost:8000
```

## Data Sources

- **Boundaries**: ONS Geography Portal (OpenData)
- **Councils**: Wikipedia UK local authorities + official websites
- **Transport**: OpenStreetMap Overpass API (real-time, unreliable) + static fallback
- **Venues**: Sample data (future: integrate local Open Data sources)

## Contributing

To add or improve features:
1. See the **Todo List** above for planned work
2. Test transport routes by checking console logs for load status
3. Update councils.json with new regions/councils as needed
4. Use Overpass API queries to generate realistic GeoJSON

## License

MIT
