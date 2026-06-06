// LoveUK Area Structure & Metadata
const areaStructure = {
    id: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    level: 0,
    metadata: {
        'Type': 'Sovereign Country',
        'Population': '~67 million',
        'Countries': '4 (England, Scotland, Wales, Northern Ireland)',
        'Councils': '412+',
        'Website': '<a href="https://www.gov.uk" class="website-link" target="_blank">gov.uk</a>',
        'Official Info': '<a href="https://www.parliament.uk" class="website-link" target="_blank">UK Parliament</a>'
    },
    children: [
        {
            id: 'england',
            name: 'England',
            flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
            level: 1,
            metadata: {
                'Type': 'Country (within UK)',
                'Population': '~56 million',
                'Regions': '9',
                'Councils': '339',
                'Government': '<a href="https://www.gov.uk" class="website-link" target="_blank">Gov.uk</a>'
            },
            children: [
                {
                    id: 'east-england',
                    name: 'East of England',
                    flag: '🌾',
                    level: 2,
                    metadata: {
                        'Type': 'Region',
                        'Population': '~5.9 million',
                        'Counties': 'Bedfordshire, Cambridgeshire, Essex, Hertfordshire, Norfolk, Suffolk',
                        'Councils': '27',
                        'Lead Body': 'East of England LGA',
                        'Website': '<a href="https://www.eelga.gov.uk" class="website-link" target="_blank">East England LGA</a>'
                    },
                    children: [
                        {
                            id: 'hertfordshire',
                            name: 'Hertfordshire',
                            flag: '🏰',
                            level: 3,
                            metadata: {
                                'Type': 'County Council',
                                'Population': '~1.2 million',
                                'Districts': '10 (Broxbourne, Dacorum, East Herts, Hertsmere, North Herts, St Albans, Stevenage, Three Rivers, Watford, Welwyn Hatfield)',
                                'GSS Code': 'E10000015',
                                'Website': '<a href="https://www.hertfordshire.gov.uk" class="website-link" target="_blank">hertfordshire.gov.uk</a>',
                                'Phone': '01438 737000',
                                'Structure': '<span class="council-structure">County Council + 10 District Councils</span>',
                                'Seat': 'Hertford',
                                'Area': '1,643 km²'
                            },
                            children: [
                                {
                                    id: 'wgc',
                                    name: 'Welwyn Garden City (Welwyn Hatfield)',
                                    flag: '🌳',
                                    level: 4,
                                    metadata: {
                                        'Type': 'Town (in Welwyn Hatfield District)',
                                        'Population': '~47,000 (WGC), ~115,000 (Welwyn Hatfield)',
                                        'District Council': 'Welwyn Hatfield District Council',
                                        'County Council': 'Hertfordshire County Council',
                                        'Established': '1920 (Garden City)',
                                        'GSS Code (District)': 'E07000241',
                                        'Website': '<a href="https://www.welhat.gov.uk" class="website-link" target="_blank">welhat.gov.uk</a>',
                                        'Phone': '01707 357000',
                                        'Email': 'customer.services@welhat.gov.uk',
                                        'Structure': '<span class="council-structure">Town council + District Council (Welwyn Hatfield) + County Council (Herts)</span>',
                                        'Notable': 'UNESCO Garden City Heritage Site',
                                        'MP': '<a href="https://www.parliament.uk" class="website-link" target="_blank">Find your MP</a>'
                                    }
                                },
                                {
                                    id: 'st-albans',
                                    name: 'St Albans',
                                    flag: '⛪',
                                    level: 4,
                                    metadata: {
                                        'Type': 'City (in St Albans District)',
                                        'Population': '~145,000',
                                        'District Council': 'St Albans City and District Council',
                                        'County Council': 'Hertfordshire County Council',
                                        'GSS Code (District)': 'E07000243',
                                        'Website': '<a href="https://www.stalbans.gov.uk" class="website-link" target="_blank">stalbans.gov.uk</a>',
                                        'Phone': '01727 819000',
                                        'Structure': '<span class="council-structure">City/District Council + County Council (Herts)</span>',
                                        'Notable': 'Historic cathedral city, Roman Verulamium'
                                    }
                                }
                            ]
                        },
                        {
                            id: 'essex',
                            name: 'Essex',
                            flag: '🌊',
                            level: 3,
                            metadata: {
                                'Type': 'County Council',
                                'Population': '~1.4 million',
                                'Website': '<a href="https://www.essex.gov.uk" class="website-link" target="_blank">essex.gov.uk</a>',
                                'Phone': '0333 013 8000'
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: 'scotland',
            name: 'Scotland',
            flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
            level: 1,
            metadata: {
                'Type': 'Country (within UK)',
                'Population': '~5.4 million',
                'Councils': '32 (Unitary Authorities)',
                'Government': '<a href="https://www.gov.scot" class="website-link" target="_blank">gov.scot</a>'
            }
        },
        {
            id: 'wales',
            name: 'Wales',
            flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
            level: 1,
            metadata: {
                'Type': 'Country (within UK)',
                'Population': '~3.1 million',
                'Councils': '22 (Unitary Authorities)',
                'Government': '<a href="https://gov.wales" class="website-link" target="_blank">gov.wales</a>'
            }
        },
        {
            id: 'northern-ireland',
            name: 'Northern Ireland',
            flag: '🍀',
            level: 1,
            metadata: {
                'Type': 'Country (within UK)',
                'Population': '~1.9 million',
                'Councils': '11 (Local Councils)',
                'Government': '<a href="https://www.nidirect.gov.uk" class="website-link" target="_blank">nidirect.gov.uk</a>'
            }
        }
    ]
};
