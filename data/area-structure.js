// LoveUK Area Structure - All UK Councils
const areaStructure = {
    id: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    level: 0,
    metadata: {
        'Councils': '412+',
        'Population': '~67m',
        'Website': '<a href="https://www.gov.uk" class="website-link" target="_blank">gov.uk</a>'
    },
    children: [
        {
            id: 'england',
            name: 'England',
            flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
            level: 1,
            metadata: {
                'Type': 'Country',
                'Councils': '339',
                'Population': '~56m'
            },
            children: [
                {
                    id: 'north-east',
                    name: 'North East (12)',
                    flag: '⛏️',
                    level: 2,
                    metadata: { 'Pop': '~2.6m', 'Website': '<a href="https://www.neelga.gov.uk" class="website-link" target="_blank">neelga</a>' },
                    children: [
                        { id: 'durham', name: 'Durham County', flag: '🏰', level: 3, metadata: { 'Type': 'County', 'Pop': '~500k', 'Website': '<a href="https://www.durham.gov.uk" class="website-link" target="_blank">durham.gov.uk</a>' } },
                        { id: 'northumberland', name: 'Northumberland County', flag: '🏰', level: 3, metadata: { 'Type': 'County', 'Pop': '~310k', 'Website': '<a href="https://www.northumberland.gov.uk" class="website-link" target="_blank">northumberland.gov.uk</a>' } },
                        { id: 'sunderland', name: 'Sunderland', flag: '🏭', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~275k', 'Website': '<a href="https://www.sunderland.gov.uk" class="website-link" target="_blank">sunderland.gov.uk</a>' } },
                        { id: 'gateshead', name: 'Gateshead', flag: '🏭', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~200k', 'Website': '<a href="https://www.gateshead.gov.uk" class="website-link" target="_blank">gateshead.gov.uk</a>' } },
                        { id: 'newcastle', name: 'Newcastle upon Tyne', flag: '🏭', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~302k', 'Website': '<a href="https://www.newcastle.gov.uk" class="website-link" target="_blank">newcastle.gov.uk</a>' } },
                        { id: 'north-tyneside', name: 'North Tyneside', flag: '🏭', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~200k' } },
                        { id: 'south-tyneside', name: 'South Tyneside', flag: '🏭', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~151k' } },
                        { id: 'stockton', name: 'Stockton-on-Tees', flag: '🏭', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~188k' } },
                        { id: 'hartlepool', name: 'Hartlepool', flag: '⚓', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~92k' } },
                        { id: 'middlesbrough', name: 'Middlesbrough', flag: '🏭', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~142k' } },
                        { id: 'redcar', name: 'Redcar & Cleveland', flag: '⚓', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~135k' } },
                        { id: 'darlington', name: 'Darlington', flag: '🏭', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~105k' } }
                    ]
                },
                {
                    id: 'north-west',
                    name: 'North West (39)',
                    flag: '🏔️',
                    level: 2,
                    metadata: { 'Pop': '~7.3m', 'Website': '<a href="https://www.nwlga.gov.uk" class="website-link" target="_blank">nwlga</a>' },
                    children: [
                        { id: 'manchester', name: 'Manchester', flag: '🐝', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~547k' } },
                        { id: 'liverpool', name: 'Liverpool', flag: '⚽', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~498k' } },
                        { id: 'leeds', name: 'Leeds', flag: '⚽', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~796k' } },
                        { id: 'wigan', name: 'Wigan', flag: '🏈', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~321k' } },
                        { id: 'Bolton', name: 'Bolton', flag: '⚽', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~282k' } },
                        { id: 'tameside', name: 'Tameside', flag: '⚽', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~225k' } },
                        { id: 'stockport', name: 'Stockport', flag: '⚽', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~289k' } },
                        { id: 'bury', name: 'Bury', flag: '⚽', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~187k' } },
                        { id: 'oldham', name: 'Oldham', flag: '⚽', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~237k' } },
                        { id: 'sefton', name: 'Sefton', flag: '⚽', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~282k' } }
                    ]
                },
                {
                    id: 'yorkshire',
                    name: 'Yorkshire & Humber (21)',
                    flag: '🐑',
                    level: 2,
                    metadata: { 'Pop': '~5.5m' },
                    children: [
                        { id: 'bradford', name: 'Bradford', flag: '🏭', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~365k' } },
                        { id: 'calderdale', name: 'Calderdale', flag: '🏭', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~207k' } },
                        { id: 'kirklees', name: 'Kirklees', flag: '🏭', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~432k' } },
                        { id: 'wakefield', name: 'Wakefield', flag: '⚽', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~343k' } },
                        { id: 'doncaster', name: 'Doncaster', flag: '🏭', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~308k' } },
                        { id: 'rotherham', name: 'Rotherham', flag: '🏭', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~278k' } },
                        { id: 'sheffield', name: 'Sheffield', flag: '⚽', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~584k' } }
                    ]
                },
                {
                    id: 'east-midlands',
                    name: 'East Midlands (27)',
                    flag: '🌾',
                    level: 2,
                    metadata: { 'Pop': '~4.9m' },
                    children: [
                        { id: 'leicester', name: 'Leicester', flag: '🏰', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~368k' } },
                        { id: 'leicestershire', name: 'Leicestershire County', flag: '🏰', level: 3, metadata: { 'Type': 'County', 'Pop': '~705k' } },
                        { id: 'nottingham', name: 'Nottingham', flag: '🏰', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~323k' } },
                        { id: 'nottinghamshire', name: 'Nottinghamshire County', flag: '🏰', level: 3, metadata: { 'Type': 'County', 'Pop': '~793k' } },
                        { id: 'derby', name: 'Derby', flag: '⚙️', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~257k' } },
                        { id: 'derbyshire', name: 'Derbyshire County', flag: '⚙️', level: 3, metadata: { 'Type': 'County', 'Pop': '~795k' } },
                        { id: 'lincoln', name: 'Lincoln', flag: '⛪', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~97k' } },
                        { id: 'lincolnshire', name: 'Lincolnshire County', flag: '🌾', level: 3, metadata: { 'Type': 'County', 'Pop': '~711k' } },
                        { id: 'peterborough', name: 'Peterborough', flag: '⛪', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~201k' } },
                        { id: 'rutland', name: 'Rutland', flag: '🏰', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~41k' } }
                    ]
                },
                {
                    id: 'west-midlands',
                    name: 'West Midlands (30)',
                    flag: '⚙️',
                    level: 2,
                    metadata: { 'Pop': '~5.9m' },
                    children: [
                        { id: 'birmingham', name: 'Birmingham', flag: '⚙️', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~1.1m' } },
                        { id: 'coventry', name: 'Coventry', flag: '⚙️', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~345k' } },
                        { id: 'wolverhampton', name: 'Wolverhampton', flag: '⚙️', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~259k' } },
                        { id: 'dudley', name: 'Dudley', flag: '⚙️', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~321k' } },
                        { id: 'sandwell', name: 'Sandwell', flag: '⚙️', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~325k' } },
                        { id: 'walsall', name: 'Walsall', flag: '⚙️', level: 3, metadata: { 'Type': 'Metropolitan', 'Pop': '~285k' } },
                        { id: 'stoke', name: 'Stoke-on-Trent', flag: '🏭', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~255k' } }
                    ]
                },
                {
                    id: 'east-england',
                    name: 'East of England (27)',
                    flag: '🌾',
                    level: 2,
                    metadata: { 'Pop': '~5.9m', 'Website': '<a href="https://www.eelga.gov.uk" class="website-link" target="_blank">eelga</a>' },
                    children: [
                        { id: 'herts', name: 'Hertfordshire', flag: '🏰', level: 3, metadata: { 'Type': 'County', 'Pop': '~1.2m', 'Website': '<a href="https://www.hertfordshire.gov.uk" class="website-link" target="_blank">herts.gov.uk</a>' },
                            children: [
                                { id: 'wgc', name: 'Welwyn Hatfield (WGC)', flag: '🌳', level: 4, metadata: { 'Website': '<a href="https://www.welhat.gov.uk" class="website-link" target="_blank">welhat.gov.uk</a>' } },
                                { id: 'st-albans', name: 'St Albans', flag: '⛪', level: 4, metadata: { 'Website': '<a href="https://www.stalbans.gov.uk" class="website-link" target="_blank">stalbans.gov.uk</a>' } },
                                { id: 'dacorum', name: 'Dacorum', flag: '🏘️', level: 4, metadata: { 'Website': '<a href="https://www.dacorum.gov.uk" class="website-link" target="_blank">dacorum.gov.uk</a>' } },
                                { id: 'watford', name: 'Watford', flag: '🏘️', level: 4, metadata: { 'Website': '<a href="https://www.watford.gov.uk" class="website-link" target="_blank">watford.gov.uk</a>' } },
                                { id: 'three-rivers', name: 'Three Rivers', flag: '🏘️', level: 4, metadata: { 'Website': '<a href="https://www.threerivers.gov.uk" class="website-link" target="_blank">3rivers.gov.uk</a>' } }
                            ]
                        },
                        { id: 'essex', name: 'Essex County', flag: '🌊', level: 3, metadata: { 'Type': 'County', 'Pop': '~1.4m', 'Website': '<a href="https://www.essex.gov.uk" class="website-link" target="_blank">essex.gov.uk</a>' } },
                        { id: 'suffolk', name: 'Suffolk County', flag: '🌾', level: 3, metadata: { 'Type': 'County', 'Pop': '~738k', 'Website': '<a href="https://www.suffolk.gov.uk" class="website-link" target="_blank">suffolk.gov.uk</a>' } },
                        { id: 'norfolk', name: 'Norfolk County', flag: '🌾', level: 3, metadata: { 'Type': 'County', 'Pop': '~859k', 'Website': '<a href="https://www.norfolk.gov.uk" class="website-link" target="_blank">norfolk.gov.uk</a>' } },
                        { id: 'cambs', name: 'Cambridgeshire County', flag: '🏰', level: 3, metadata: { 'Type': 'County', 'Pop': '~852k', 'Website': '<a href="https://www.cambridgeshire.gov.uk" class="website-link" target="_blank">cambridgeshire.gov.uk</a>' } },
                        { id: 'peterborough-ea', name: 'Peterborough', flag: '⛪', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~201k' } }
                    ]
                },
                {
                    id: 'south-west',
                    name: 'South West (48)',
                    flag: '🏖️',
                    level: 2,
                    metadata: { 'Pop': '~5.6m' },
                    children: [
                        { id: 'bristol', name: 'Bristol', flag: '🏙️', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~466k' } },
                        { id: 'somerset', name: 'Somerset Council', flag: '🌾', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~559k' } },
                        { id: 'devon', name: 'Devon County', flag: '🏖️', level: 3, metadata: { 'Type': 'County', 'Pop': '~786k' } },
                        { id: 'cornwall', name: 'Cornwall Council', flag: '⛵', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~572k' } },
                        { id: 'dorset', name: 'Dorset Council', flag: '⛵', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~368k' } },
                        { id: 'glos', name: 'Gloucestershire County', flag: '🏰', level: 3, metadata: { 'Type': 'County', 'Pop': '~635k' } },
                        { id: 'wiltshire', name: 'Wiltshire Council', flag: '🏰', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~490k' } },
                        { id: 'bath', name: 'Bath and North East Somerset', flag: '🏰', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~196k' } }
                    ]
                },
                {
                    id: 'south-east',
                    name: 'South East (38)',
                    flag: '🏘️',
                    level: 2,
                    metadata: { 'Pop': '~9.2m' },
                    children: [
                        { id: 'kent', name: 'Kent County', flag: '🏰', level: 3, metadata: { 'Type': 'County', 'Pop': '~1.9m' } },
                        { id: 'surrey', name: 'Surrey County', flag: '🏘️', level: 3, metadata: { 'Type': 'County', 'Pop': '~1.2m' } },
                        { id: 'sussex-west', name: 'West Sussex County', flag: '🏘️', level: 3, metadata: { 'Type': 'County', 'Pop': '~844k' } },
                        { id: 'sussex-east', name: 'East Sussex Council', flag: '⛵', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~534k' } },
                        { id: 'brighton', name: 'Brighton and Hove', flag: '🏖️', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~290k' } },
                        { id: 'hampshire', name: 'Hampshire County', flag: '🏰', level: 3, metadata: { 'Type': 'County', 'Pop': '~1.9m' } },
                        { id: 'wight', name: 'Isle of Wight', flag: '⛵', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~141k' } },
                        { id: 'oxon', name: 'Oxfordshire County', flag: '🏰', level: 3, metadata: { 'Type': 'County', 'Pop': '~690k' } },
                        { id: 'berks', name: 'Berkshire', flag: '🏘️', level: 3, metadata: { 'Type': 'Unitary (6)', 'Pop': '~912k' } },
                        { id: 'bucks', name: 'Buckinghamshire Council', flag: '🏰', level: 3, metadata: { 'Type': 'Unitary', 'Pop': '~548k' } }
                    ]
                },
                {
                    id: 'london',
                    name: 'London (33)',
                    flag: '🏴󠁧󠁢󠁬󠁣󠁴󠁿',
                    level: 2,
                    metadata: { 'Pop': '~9m', 'Type': '32 London Boroughs + City of London' },
                    children: [
                        { id: 'city-london', name: 'City of London', flag: '🏛️', level: 3, metadata: { 'Pop': '~10k' } },
                        { id: 'barking', name: 'Barking & Dagenham', flag: '🌃', level: 3, metadata: { 'Pop': '~218k' } },
                        { id: 'barnet', name: 'Barnet', flag: '🌃', level: 3, metadata: { 'Pop': '~395k' } },
                        { id: 'bexley', name: 'Bexley', flag: '🌃', level: 3, metadata: { 'Pop': '~245k' } },
                        { id: 'brent', name: 'Brent', flag: '🌃', level: 3, metadata: { 'Pop': '~333k' } },
                        { id: 'bromley', name: 'Bromley', flag: '🌃', level: 3, metadata: { 'Pop': '~331k' } },
                        { id: 'camden', name: 'Camden', flag: '🌃', level: 3, metadata: { 'Pop': '~220k' } },
                        { id: 'croydon', name: 'Croydon', flag: '🌃', level: 3, metadata: { 'Pop': '~390k' } },
                        { id: 'ealing', name: 'Ealing', flag: '🌃', level: 3, metadata: { 'Pop': '~342k' } },
                        { id: 'enfield', name: 'Enfield', flag: '🌃', level: 3, metadata: { 'Pop': '~333k' } },
                        { id: 'greenwich', name: 'Greenwich', flag: '🌃', level: 3, metadata: { 'Pop': '~282k' } },
                        { id: 'hackney', name: 'Hackney', flag: '🌃', level: 3, metadata: { 'Pop': '~277k' } }
                    ]
                }
            ]
        },
        {
            id: 'scotland',
            name: 'Scotland (32)',
            flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
            level: 1,
            metadata: { 'Type': 'Country', 'Pop': '~5.4m', 'Website': '<a href="https://www.gov.scot" class="website-link" target="_blank">gov.scot</a>' },
            children: [
                { id: 'aberdeen', name: 'Aberdeen City', flag: '🏘️', level: 3, metadata: { 'Pop': '~198k' } },
                { id: 'aberdeenshire', name: 'Aberdeenshire Council', flag: '🏘️', level: 3, metadata: { 'Pop': '~258k' } },
                { id: 'angus', name: 'Angus Council', flag: '🏘️', level: 3, metadata: { 'Pop': '~117k' } },
                { id: 'argyll', name: 'Argyll & Bute Council', flag: '⛵', level: 3, metadata: { 'Pop': '~87k' } },
                { id: 'clackmannanshire', name: 'Clackmannanshire Council', flag: '🏘️', level: 3, metadata: { 'Pop': '~51k' } },
                { id: 'dumfries', name: 'Dumfries & Galloway Council', flag: '🐑', level: 3, metadata: { 'Pop': '~149k' } },
                { id: 'dunbarton', name: 'West Dunbartonshire Council', flag: '⛵', level: 3, metadata: { 'Pop': '~90k' } },
                { id: 'east-dunbarton', name: 'East Dunbartonshire Council', flag: '🏘️', level: 3, metadata: { 'Pop': '~105k' } },
                { id: 'east-lothian', name: 'East Lothian Council', flag: '🏘️', level: 3, metadata: { 'Pop': '~103k' } },
                { id: 'edinburgh', name: 'Edinburgh City', flag: '🏰', level: 3, metadata: { 'Pop': '~530k' } },
                { id: 'falkirk', name: 'Falkirk Council', flag: '🏘️', level: 3, metadata: { 'Pop': '~157k' } },
                { id: 'fife', name: 'Fife Council', flag: '⛵', level: 3, metadata: { 'Pop': '~365k' } },
                { id: 'glasgow', name: 'Glasgow City', flag: '🏘️', level: 3, metadata: { 'Pop': '~633k' } },
                { id: 'highland', name: 'Highland Council', flag: '🏔️', level: 3, metadata: { 'Pop': '~236k' } }
            ]
        },
        {
            id: 'wales',
            name: 'Wales (22)',
            flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
            level: 1,
            metadata: { 'Type': 'Country', 'Pop': '~3.1m', 'Website': '<a href="https://gov.wales" class="website-link" target="_blank">gov.wales</a>' },
            children: [
                { id: 'cardiff', name: 'Cardiff Council', flag: '🏰', level: 3, metadata: { 'Pop': '~362k' } },
                { id: 'swansea', name: 'Swansea Council', flag: '⛵', level: 3, metadata: { 'Pop': '~246k' } },
                { id: 'newport', name: 'Newport Council', flag: '🏘️', level: 3, metadata: { 'Pop': '~148k' } },
                { id: 'caerphilly', name: 'Caerphilly County Borough', flag: '⚒️', level: 3, metadata: { 'Pop': '~173k' } },
                { id: 'torfaen', name: 'Torfaen County Borough', flag: '⚒️', level: 3, metadata: { 'Pop': '~91k' } },
                { id: 'monmouth', name: 'Monmouthshire Council', flag: '🏰', level: 3, metadata: { 'Pop': '~92k' } },
                { id: 'bridgend', name: 'Bridgend County Borough', flag: '⛵', level: 3, metadata: { 'Pop': '~141k' } },
                { id: 'neath', name: 'Neath Port Talbot Council', flag: '⛵', level: 3, metadata: { 'Pop': '~141k' } },
                { id: 'pembrokeshire', name: 'Pembrokeshire Council', flag: '⛵', level: 3, metadata: { 'Pop': '~122k' } },
                { id: 'carmarthenshire', name: 'Carmarthenshire Council', flag: '🏘️', level: 3, metadata: { 'Pop': '~187k' } },
                { id: 'ceredigion', name: 'Ceredigion Council', flag: '⛵', level: 3, metadata: { 'Pop': '~76k' } },
                { id: 'powys', name: 'Powys County Council', flag: '🐑', level: 3, metadata: { 'Pop': '~132k' } }
            ]
        },
        {
            id: 'northern-ireland',
            name: 'Northern Ireland (11)',
            flag: '🍀',
            level: 1,
            metadata: { 'Type': 'Country', 'Pop': '~1.9m', 'Website': '<a href="https://www.nidirect.gov.uk" class="website-link" target="_blank">nidirect.gov.uk</a>' },
            children: [
                { id: 'belfast', name: 'Belfast City Council', flag: '🏘️', level: 3, metadata: { 'Pop': '~343k' } },
                { id: 'lisburn', name: 'Lisburn & Castlereagh City Council', flag: '🏘️', level: 3, metadata: { 'Pop': '~146k' } },
                { id: 'armagh', name: 'Armagh City, Bangor & Newry Council', flag: '⛪', level: 3, metadata: { 'Pop': '~178k' } },
                { id: 'derry', name: 'Derry City & Strabane District Council', flag: '⛪', level: 3, metadata: { 'Pop': '~148k' } },
                { id: 'causeway', name: 'Causeway Coast & Glens Borough Council', flag: '⛵', level: 3, metadata: { 'Pop': '~145k' } },
                { id: 'ballymena', name: 'Mid and East Antrim Borough Council', flag: '🏘️', level: 3, metadata: { 'Pop': '~139k' } },
                { id: 'antrim', name: 'Antrim and Newtownabbey Borough Council', flag: '🏘️', level: 3, metadata: { 'Pop': '~143k' } },
                { id: 'ards', name: 'Ards and North Down Borough Council', flag: '⛵', level: 3, metadata: { 'Pop': '~165k' } },
                { id: 'down', name: 'Down District Council', flag: '🏘️', level: 3, metadata: { 'Pop': '~71k' } },
                { id: 'craigavon', name: 'Craigavon Borough Council', flag: '🏘️', level: 3, metadata: { 'Pop': '~109k' } },
                { id: 'fermanagh', name: 'Fermanagh & Omagh District Council', flag: '🏘️', level: 3, metadata: { 'Pop': '~115k' } }
            ]
        }
    ]
};
