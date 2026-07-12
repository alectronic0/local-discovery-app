# LoveUK — Discover & Celebrate Your Local Area

**🌍 Live Demo:** https://alectronic0.github.io/local-discovery-app/

## Mission

LoveUK is a comprehensive local discovery platform for the UK, built on public data and third-party APIs. Our vision is to make the UK visible, accessible, and discoverable to everyone—helping you understand, celebrate, and explore your local area with pride.

We're inspired by Japan's approach to local tourism and heritage (mascot culture, regional pride, accessible local exploration), and we're bringing that same energy to UK traditions—modern, visual, progressive, yet deeply rooted in heritage.

### Local Initiatives

LoveUK powers local discovery across the UK through community-focused initiatives:
- **LoveHerts** — Hertfordshire discovery
- **LoveWGC** — Welwyn Garden City discovery
- **[Add your area]** — Each town, council, and region can have its own branded LoveUK experience

Each initiative celebrates the unique character, heritage, and attractions of its area while connecting to the broader UK network.

## What You Can Discover

- **Public Transport**: Rail lines, bus routes, stations, and stops
- **Nature & Outdoors**: Nature trails, cycle routes, country parks, forests
- **Waterways**: Canals, rivers, ferries, boat routes
- **Heritage & Culture**: National heritage sites, historical landmarks, local museums
- **Community**: Parks, play areas, leisure facilities, community halls
- **Local Governance**: Council boundaries, contact information, planning applications
- **Events & Activities**: Local events, community gatherings, activities happening near you

## Features

- **Interactive Map**: Browse councils, transport, heritage sites, nature routes, and local venues by region
- **Layer Toggles**: Filter by country, region, and category (transport, heritage, nature, events)
- **Postcode Search**: Find your location and discover what's nearby
- **Visual Networks**: Authentic transport colours (TfL network, operator branding)
- **Council Integration**: Click any council to access their website, services, and planning data
- **Super Visual**: Beautiful map layers, colour-coded by region and category

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
- [ ] **Nature & Outdoors**: Nature trails, walking routes, cycle paths, forests, country parks
- [ ] **Waterways**: Canal routes, rivers, ferries, boat launching points
- [ ] **Heritage & Culture**: National heritage sites, historical landmarks, museums, local stories
- [ ] **Community**: Parks, play areas, leisure facilities, community spaces
- [ ] **Events & Activities**: Local events, festivals, community gatherings, activities calendar
- [ ] **Planning & Governance**: Planning applications, council meetings, local policy transparency
- [ ] **Councillor Directory**: Local councillors, contact information, constituent services

### Phase 5: Polish & Accessibility
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Performance metrics (Core Web Vitals)
- [ ] Mobile-first responsive design
- [ ] Offline support (service worker)
- [ ] Deployment & CI/CD

### Phase 6: Local Pride & Heritage Celebration
- [ ] Regional mascots & branding (inspired by Japanese local tourism)
- [ ] "Stories of Place": Local history, heritage narratives, cultural pride
- [ ] Heritage trails: Curated journeys through local landmarks and history
- [ ] Community contributions: Allow locals to share stories, photos, recommendations
- [ ] Local economy integration: Support local businesses, makers, heritage crafts
- [ ] Educational layers: Learn about UK traditions, architecture, conservation

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

- **Boundaries & Governance**: ONS Geography Portal, Wikipedia UK councils
- **Transport**: OpenStreetMap Overpass API, TfL APIs, National Rail data
- **Nature & Outdoors**: OpenStreetMap, Natural England, Scottish Natural Heritage
- **Heritage**: Historic Environment Record, English Heritage, National Trust, local authority records
- **Waterways**: Canal & River Trust, Environment Agency, local maritime records
- **Events**: Local authority event calendars, community platforms, Eventbrite
- **Planning**: Local authority planning portals, PlanIt UK
- **Venues**: OpenStreetMap, local Open Data sources, community submissions

## Contributing

To add or improve features:
1. See the **Todo List** above for planned work
2. Test transport routes by checking console logs for load status
3. Update councils.json with new regions/councils as needed
4. Use Overpass API queries to generate realistic GeoJSON

To launch a local LoveUK initiative:
1. All local initiatives (LoveHerts, LoveWGC, etc.) run on the same LoveUK platform
2. Customize branding, colours, and regional focus within your area's data
3. Add local data sources and stories specific to your region
4. Help celebrate what makes your area special

## License

MIT
