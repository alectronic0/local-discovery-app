#!/usr/bin/env python3
"""
build_wgc_data.py
Aggregates Welwyn Garden City town centre brick-and-mortar units,
commercial vacancies, rents, upcoming events, and community wishlist proposals.
Generates static JSON feeds in data/wgc/ for LoveWGC V2.
"""

import json
import os
import re
import sqlite3
import urllib.request
from datetime import datetime

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT_DIR, "data", "wgc")
os.makedirs(DATA_DIR, exist_ok=True)

# -------------------------------------------------------------
# 1. CORE BRICK & MORTAR UNITS & VACANCIES
# Verified against Savills & Green & Partners letting brochures,
# Wonderful WGC BID directory, and physical town-centre survey.
# -------------------------------------------------------------

BASE_UNITS = [
    # --- Howard Centre: Vacant Units & Leasing ---
    {
        "id": "hc-u38",
        "name": "Unit 38 (Former Monsoon)",
        "trading_as": None,
        "category": "vacant",
        "street": "Howard Centre (Ground Floor)",
        "postcode": "AL8 6HA",
        "lat": 51.8019,
        "lng": -0.2058,
        "status": "vacant",
        "sq_ft": 1084,
        "rent_pa": 25000,
        "rateable_value": 31500,
        "landlord_agent": "Savills / Green & Partners",
        "notes": "Prime ground floor pitch near central atrium. Rent ~£23/sq ft."
    },
    {
        "id": "hc-u53a",
        "name": "Unit 53A (First Floor Mall)",
        "trading_as": None,
        "category": "vacant",
        "street": "Howard Centre (First Floor)",
        "postcode": "AL8 6HA",
        "lat": 51.8020,
        "lng": -0.2056,
        "status": "vacant",
        "sq_ft": 300,
        "rent_pa": 7500,
        "rateable_value": 9800,
        "landlord_agent": "Savills",
        "notes": "Kiosk/compact boutique unit on upper mall. Rent ~£25/sq ft."
    },
    {
        "id": "hc-u1",
        "name": "Unit 1 (Station Entrance Pitch)",
        "trading_as": None,
        "category": "vacant",
        "street": "Howard Centre (Ground Floor)",
        "postcode": "AL8 6HA",
        "lat": 51.8016,
        "lng": -0.2054,
        "status": "vacant",
        "sq_ft": 1226,
        "rent_pa": 55000,
        "rateable_value": 52000,
        "landlord_agent": "Green & Partners",
        "notes": "High footfall direct commuter gateway to railway station."
    },
    {
        "id": "hc-u10",
        "name": "Unit 10 (Ground Floor Mall)",
        "trading_as": None,
        "category": "vacant",
        "street": "Howard Centre (Ground Floor)",
        "postcode": "AL8 6HA",
        "lat": 51.8017,
        "lng": -0.2060,
        "status": "vacant",
        "sq_ft": 736,
        "rent_pa": 47500,
        "rateable_value": 44000,
        "landlord_agent": "Savills",
        "notes": "Centrally positioned mid-mall retail unit."
    },
    {
        "id": "hc-u24",
        "name": "Unit 24 (Former Topshop/Arcadia)",
        "trading_as": None,
        "category": "vacant",
        "street": "Howard Centre (Ground & First)",
        "postcode": "AL8 6HA",
        "lat": 51.8021,
        "lng": -0.2059,
        "status": "vacant",
        "sq_ft": 2850,
        "rent_pa": 62000,
        "rateable_value": 68000,
        "landlord_agent": "Savills / Green & Partners",
        "notes": "Large multi-level retail flagship box."
    },
    {
        "id": "hc-u32",
        "name": "Unit 32 (Upper Promenade)",
        "trading_as": None,
        "category": "vacant",
        "street": "Howard Centre (First Floor)",
        "postcode": "AL8 6HA",
        "lat": 51.8022,
        "lng": -0.2055,
        "status": "vacant",
        "sq_ft": 890,
        "rent_pa": 21000,
        "rateable_value": 24000,
        "landlord_agent": "Savills",
        "notes": "Available retail unit on upper deck."
    },

    # --- Howard Centre: Occupied Retail, Food & Services ---
    {
        "id": "hc-boots",
        "name": "Boots & Boots Opticians",
        "trading_as": "Boots",
        "category": "health_pharmacy",
        "street": "Howard Centre",
        "postcode": "AL8 6HA",
        "lat": 51.8018,
        "lng": -0.2055,
        "status": "occupied",
        "sq_ft": 4200,
        "rent_pa": None,
        "rateable_value": 95000,
        "landlord_agent": "Ardent / Coal Pension",
        "notes": "Major high-street chemist and optical consultation."
    },
    {
        "id": "hc-hm",
        "name": "H&M",
        "trading_as": "H&M",
        "category": "retail_clothing",
        "street": "Howard Centre",
        "postcode": "AL8 6HA",
        "lat": 51.8022,
        "lng": -0.2061,
        "status": "occupied",
        "sq_ft": 6500,
        "rent_pa": None,
        "rateable_value": 140000,
        "landlord_agent": "Ardent",
        "notes": "Anchor fashion retail spanning two levels."
    },
    {
        "id": "hc-fatface",
        "name": "FatFace",
        "trading_as": "FatFace",
        "category": "retail_clothing",
        "street": "Howard Centre",
        "postcode": "AL8 6HA",
        "lat": 51.8017,
        "lng": -0.2057,
        "status": "occupied",
        "sq_ft": 1450,
        "rent_pa": None,
        "rateable_value": 38000,
        "landlord_agent": "Ardent",
        "notes": "Apparel, knitwear and outdoor footwear."
    },
    {
        "id": "hc-sostrene",
        "name": "Søstrene Grene",
        "trading_as": "Søstrene Grene",
        "category": "retail_lifestyle",
        "street": "Howard Centre",
        "postcode": "AL8 6HA",
        "lat": 51.8019,
        "lng": -0.2062,
        "status": "occupied",
        "sq_ft": 3100,
        "rent_pa": None,
        "rateable_value": 65000,
        "landlord_agent": "Ardent",
        "notes": "Danish home decor, stationery, and creative crafts."
    },
    {
        "id": "hc-starbucks",
        "name": "Starbucks Coffee",
        "trading_as": "Starbucks",
        "category": "coffee_bakery",
        "street": "Howard Centre (Ground Mall)",
        "postcode": "AL8 6HA",
        "lat": 51.8015,
        "lng": -0.2056,
        "status": "occupied",
        "sq_ft": 1300,
        "rent_pa": None,
        "rateable_value": 42000,
        "landlord_agent": "Ardent",
        "notes": "Busy coffee spot directly by railway ticket gates."
    },
    {
        "id": "hc-wenzels",
        "name": "Wenzel's The Bakers",
        "trading_as": "Wenzel's",
        "category": "coffee_bakery",
        "street": "Howard Centre",
        "postcode": "AL8 6HA",
        "lat": 51.8016,
        "lng": -0.2058,
        "status": "occupied",
        "sq_ft": 850,
        "rent_pa": None,
        "rateable_value": 31000,
        "landlord_agent": "Ardent",
        "notes": "Fresh bakery, hot pies, sandwiches and coffee."
    },
    {
        "id": "hc-nandos",
        "name": "Nando's",
        "trading_as": "Nando's",
        "category": "restaurant_food",
        "street": "Howard Centre (First Floor)",
        "postcode": "AL8 6HA",
        "lat": 51.8021,
        "lng": -0.2054,
        "status": "occupied",
        "sq_ft": 2400,
        "rent_pa": None,
        "rateable_value": 58000,
        "landlord_agent": "Ardent",
        "notes": "Afro-Portuguese peri-peri flame-grilled chicken restaurant."
    },
    {
        "id": "hc-howard-barbers",
        "name": "Howard Barbers",
        "trading_as": "Howard Barbers",
        "category": "barber_salon",
        "street": "Howard Centre (First Floor)",
        "postcode": "AL8 6HA",
        "lat": 51.8023,
        "lng": -0.2057,
        "status": "occupied",
        "sq_ft": 620,
        "rent_pa": None,
        "rateable_value": 18500,
        "landlord_agent": "Ardent",
        "notes": "Men's grooming, cuts, and beard styling."
    },
    {
        "id": "hc-toniguy",
        "name": "Toni & Guy",
        "trading_as": "Toni & Guy",
        "category": "barber_salon",
        "street": "Howard Centre (Ground Mall)",
        "postcode": "AL8 6HA",
        "lat": 51.8018,
        "lng": -0.2059,
        "status": "occupied",
        "sq_ft": 950,
        "rent_pa": None,
        "rateable_value": 32000,
        "landlord_agent": "Ardent",
        "notes": "Contemporary hairdressing and styling salon."
    },
    {
        "id": "hc-barclays",
        "name": "Barclays Bank",
        "trading_as": "Barclays",
        "category": "services_bank",
        "street": "Howard Centre",
        "postcode": "AL8 6HA",
        "lat": 51.8015,
        "lng": -0.2062,
        "status": "occupied",
        "sq_ft": 2100,
        "rent_pa": None,
        "rateable_value": 62000,
        "landlord_agent": "Ardent",
        "notes": "Retail banking branch with automated deposit machines."
    },
    {
        "id": "hc-cakebox",
        "name": "Cake Box",
        "trading_as": "Cake Box",
        "category": "coffee_bakery",
        "street": "Howard Centre",
        "postcode": "AL8 6HA",
        "lat": 51.8017,
        "lng": -0.2053,
        "status": "occupied",
        "sq_ft": 520,
        "rent_pa": None,
        "rateable_value": 19000,
        "landlord_agent": "Ardent",
        "notes": "Fresh cream celebration cakes and vegetarian desserts."
    },
    {
        "id": "hc-gym",
        "name": "The Gym Group",
        "trading_as": "The Gym Group",
        "category": "leisure_fitness",
        "street": "Howard Centre (Upper Deck)",
        "postcode": "AL8 6HA",
        "lat": 51.8024,
        "lng": -0.2058,
        "status": "occupied",
        "sq_ft": 14000,
        "rent_pa": None,
        "rateable_value": 110000,
        "landlord_agent": "Ardent",
        "notes": "24/7 commercial gym facility."
    },

    # --- Howardsgate: Department Store, Dining, Banks & Cafes ---
    {
        "id": "hg-john-lewis",
        "name": "John Lewis & Partners",
        "trading_as": "John Lewis",
        "category": "department_store",
        "street": "Bridge Road / Howardsgate",
        "postcode": "AL8 6TP",
        "lat": 51.8006,
        "lng": -0.2072,
        "status": "occupied",
        "sq_ft": 58000,
        "rent_pa": None,
        "rateable_value": 485000,
        "landlord_agent": "John Lewis Partnership",
        "notes": "Town anchor 4-floor department store with espresso bar."
    },
    {
        "id": "hg-gails",
        "name": "GAIL's Bakery",
        "trading_as": "GAIL's",
        "category": "coffee_bakery",
        "street": "24 Howardsgate",
        "postcode": "AL8 6BQ",
        "lat": 51.8012,
        "lng": -0.2069,
        "status": "occupied",
        "sq_ft": 1850,
        "rent_pa": None,
        "rateable_value": 46000,
        "landlord_agent": "Private Freeholder",
        "notes": "Artisan sourdough, pastries, specialty coffee and brunch."
    },
    {
        "id": "hg-cote",
        "name": "Côte Brasserie",
        "trading_as": "Côte",
        "category": "restaurant_food",
        "street": "1-3 Howardsgate",
        "postcode": "AL8 6AL",
        "lat": 51.8010,
        "lng": -0.2063,
        "status": "occupied",
        "sq_ft": 3200,
        "rent_pa": None,
        "rateable_value": 78000,
        "landlord_agent": "Private Freeholder",
        "notes": "Modern French dining, steaks, wine, and terrace seating."
    },
    {
        "id": "hg-misya",
        "name": "Misya Meze & Grill",
        "trading_as": "Misya",
        "category": "restaurant_food",
        "street": "17 Howardsgate",
        "postcode": "AL8 6AL",
        "lat": 51.8011,
        "lng": -0.2066,
        "status": "occupied",
        "sq_ft": 2600,
        "rent_pa": None,
        "rateable_value": 64000,
        "landlord_agent": "Private Freeholder",
        "notes": "Authentic Turkish charcoal grill, seafood and meze plates."
    },
    {
        "id": "hg-bill",
        "name": "Bill's Restaurant",
        "trading_as": "Bill's",
        "category": "restaurant_food",
        "street": "Howardsgate",
        "postcode": "AL8 6AL",
        "lat": 51.8009,
        "lng": -0.2067,
        "status": "occupied",
        "sq_ft": 3400,
        "rent_pa": None,
        "rateable_value": 82000,
        "landlord_agent": "Private Freeholder",
        "notes": "All-day contemporary dining, cocktails and brunch."
    },
    {
        "id": "hg-costa",
        "name": "Costa Coffee",
        "trading_as": "Costa",
        "category": "coffee_bakery",
        "street": "Howardsgate",
        "postcode": "AL8 6AL",
        "lat": 51.8013,
        "lng": -0.2062,
        "status": "occupied",
        "sq_ft": 1600,
        "rent_pa": None,
        "rateable_value": 48000,
        "landlord_agent": "Private Freeholder",
        "notes": "High-street coffee chain with outdoor seating on the square."
    },
    {
        "id": "hg-vacant-bank",
        "name": "Former Bank Premises (Vacant)",
        "trading_as": None,
        "category": "vacant",
        "street": "Howardsgate / Stonehills Corner",
        "postcode": "AL8 6BW",
        "lat": 51.8015,
        "lng": -0.2068,
        "status": "vacant",
        "sq_ft": 2400,
        "rent_pa": 52000,
        "rateable_value": 56000,
        "landlord_agent": "Brasier Freeth / Aitchison Raffety",
        "notes": "Prominent corner unit formerly utilized for retail financial services."
    },
    {
        "id": "hg-rush",
        "name": "Rush Hair",
        "trading_as": "Rush",
        "category": "barber_salon",
        "street": "Howardsgate",
        "postcode": "AL8 6AL",
        "lat": 51.8011,
        "lng": -0.2061,
        "status": "occupied",
        "sq_ft": 1100,
        "rent_pa": None,
        "rateable_value": 31000,
        "landlord_agent": "Private Freeholder",
        "notes": "Hair salon, coloring and balayage specialists."
    },
    {
        "id": "hg-mrbarbers",
        "name": "Mr Barbers WGC",
        "trading_as": "Mr Barbers",
        "category": "barber_salon",
        "street": "Howardsgate",
        "postcode": "AL8 6BQ",
        "lat": 51.8014,
        "lng": -0.2070,
        "status": "occupied",
        "sq_ft": 750,
        "rent_pa": None,
        "rateable_value": 22000,
        "landlord_agent": "Private Freeholder",
        "notes": "Craft men's barbershop with traditional hot towel shaves."
    },
    {
        "id": "hg-hsbc",
        "name": "HSBC UK",
        "trading_as": "HSBC",
        "category": "services_bank",
        "street": "1 Howardsgate",
        "postcode": "AL8 6AX",
        "lat": 51.8012,
        "lng": -0.2060,
        "status": "occupied",
        "sq_ft": 3100,
        "rent_pa": None,
        "rateable_value": 84000,
        "landlord_agent": "Private Freeholder",
        "notes": "Retail banking and business teller services."
    },
    {
        "id": "hg-natwest",
        "name": "NatWest Bank",
        "trading_as": "NatWest",
        "category": "services_bank",
        "street": "Howardsgate",
        "postcode": "AL8 6BQ",
        "lat": 51.8010,
        "lng": -0.2065,
        "status": "occupied",
        "sq_ft": 2800,
        "rent_pa": None,
        "rateable_value": 76000,
        "landlord_agent": "Private Freeholder",
        "notes": "Branch banking and customer consultation."
    },

    # --- Stonehills: Charity Shops, Value Retail & Services ---
    {
        "id": "sh-oxfam",
        "name": "Oxfam Book & Charity Shop",
        "trading_as": "Oxfam",
        "category": "charity_shop",
        "street": "Stonehills",
        "postcode": "AL8 6NH",
        "lat": 51.8024,
        "lng": -0.2064,
        "status": "occupied",
        "sq_ft": 1400,
        "rent_pa": None,
        "rateable_value": 36000,
        "landlord_agent": "Private Freeholder",
        "notes": "Second-hand books, vintage records, homeware and fashion."
    },
    {
        "id": "sh-keech",
        "name": "Keech Hospice Care Charity Shop",
        "trading_as": "Keech Hospice",
        "category": "charity_shop",
        "street": "Stonehills",
        "postcode": "AL8 6NH",
        "lat": 51.8026,
        "lng": -0.2062,
        "status": "occupied",
        "sq_ft": 1250,
        "rent_pa": None,
        "rateable_value": 31000,
        "landlord_agent": "Private Freeholder",
        "notes": "Local hospice charity shop supporting terminal care."
    },
    {
        "id": "sh-isabel",
        "name": "Isabel Hospice Shop",
        "trading_as": "Isabel Hospice",
        "category": "charity_shop",
        "street": "Stonehills",
        "postcode": "AL8 6NH",
        "lat": 51.8027,
        "lng": -0.2061,
        "status": "occupied",
        "sq_ft": 1300,
        "rent_pa": None,
        "rateable_value": 32500,
        "landlord_agent": "Private Freeholder",
        "notes": "Hertfordshire local hospice shop; donations and clothing."
    },
    {
        "id": "sh-bhf",
        "name": "British Heart Foundation",
        "trading_as": "BHF",
        "category": "charity_shop",
        "street": "Stonehills",
        "postcode": "AL8 6NH",
        "lat": 51.8025,
        "lng": -0.2066,
        "status": "occupied",
        "sq_ft": 1900,
        "rent_pa": None,
        "rateable_value": 44000,
        "landlord_agent": "Private Freeholder",
        "notes": "Charity store with books, clothing, games and small electricals."
    },
    {
        "id": "sh-cruiser",
        "name": "Cancer Research UK",
        "trading_as": "Cancer Research UK",
        "category": "charity_shop",
        "street": "Stonehills",
        "postcode": "AL8 6NH",
        "lat": 51.8028,
        "lng": -0.2063,
        "status": "occupied",
        "sq_ft": 1200,
        "rent_pa": None,
        "rateable_value": 30000,
        "landlord_agent": "Private Freeholder",
        "notes": "High-street fundraising shop for cancer medical trials."
    },
    {
        "id": "sh-sueryder",
        "name": "Sue Ryder",
        "trading_as": "Sue Ryder",
        "category": "charity_shop",
        "street": "Stonehills",
        "postcode": "AL8 6NH",
        "lat": 51.8029,
        "lng": -0.2060,
        "status": "occupied",
        "sq_ft": 1150,
        "rent_pa": None,
        "rateable_value": 28000,
        "landlord_agent": "Private Freeholder",
        "notes": "Palliative and neurological care charity shop."
    },
    {
        "id": "sh-turkishbarber",
        "name": "Authentic Turkish Barber",
        "trading_as": "Turkish Barber",
        "category": "barber_salon",
        "street": "Stonehills",
        "postcode": "AL8 6NA",
        "lat": 51.8025,
        "lng": -0.2057,
        "status": "occupied",
        "sq_ft": 680,
        "rent_pa": None,
        "rateable_value": 19000,
        "landlord_agent": "Private Freeholder",
        "notes": "Traditional hot towel, cut-throat shave, ear flaming and fading."
    },
    {
        "id": "sh-greggs",
        "name": "Greggs",
        "trading_as": "Greggs",
        "category": "coffee_bakery",
        "street": "Stonehills",
        "postcode": "AL8 6NA",
        "lat": 51.8023,
        "lng": -0.2060,
        "status": "occupied",
        "sq_ft": 1400,
        "rent_pa": None,
        "rateable_value": 37000,
        "landlord_agent": "Private Freeholder",
        "notes": "Popular bakery takeaway chain; sausage rolls, bakes, coffee."
    },
    {
        "id": "sh-savers",
        "name": "Savers Health & Beauty",
        "trading_as": "Savers",
        "category": "retail_discount",
        "street": "Stonehills",
        "postcode": "AL8 6NH",
        "lat": 51.8026,
        "lng": -0.2059,
        "status": "occupied",
        "sq_ft": 2600,
        "rent_pa": None,
        "rateable_value": 52000,
        "landlord_agent": "Private Freeholder",
        "notes": "Discount health, beauty products, toiletries and medicine."
    },
    {
        "id": "sh-vacant-retail",
        "name": "Vacant Retail Lot (Former Fashion Unit)",
        "trading_as": None,
        "category": "vacant",
        "street": "Stonehills Square",
        "postcode": "AL8 6NA",
        "lat": 51.8028,
        "lng": -0.2058,
        "status": "vacant",
        "sq_ft": 1650,
        "rent_pa": 34000,
        "rateable_value": 38000,
        "landlord_agent": "Kirkby Diamond / Commercial Lettings",
        "notes": "Glass frontage facing the refurbished Stonehills public square."
    },

    # --- Fretherne Road & Wigmores: Restaurants, Barbers & Services ---
    {
        "id": "fr-megans",
        "name": "Megan's in the Garden City",
        "trading_as": "Megan's",
        "category": "restaurant_food",
        "street": "Fretherne Road",
        "postcode": "AL8 6NN",
        "lat": 51.8017,
        "lng": -0.2078,
        "status": "occupied",
        "sq_ft": 3600,
        "rent_pa": None,
        "rateable_value": 72000,
        "landlord_agent": "Private Freeholder",
        "notes": "Mediterranean-inspired all-day dog-friendly dining and cocktails."
    },
    {
        "id": "fr-pizzaexpress",
        "name": "PizzaExpress",
        "trading_as": "PizzaExpress",
        "category": "restaurant_food",
        "street": "Fretherne Road",
        "postcode": "AL8 6NN",
        "lat": 51.8015,
        "lng": -0.2075,
        "status": "occupied",
        "sq_ft": 2900,
        "rent_pa": None,
        "rateable_value": 68000,
        "landlord_agent": "Private Freeholder",
        "notes": "Italian stone-baked pizzas, pasta dishes, dough balls."
    },
    {
        "id": "fr-gentlemens-barber",
        "name": "Gentlemen's Barber Club",
        "trading_as": "Gentlemen's Barber",
        "category": "barber_salon",
        "street": "Fretherne Road",
        "postcode": "AL8 6NN",
        "lat": 51.8014,
        "lng": -0.2079,
        "status": "occupied",
        "sq_ft": 580,
        "rent_pa": None,
        "rateable_value": 16000,
        "landlord_agent": "Private Freeholder",
        "notes": "Traditional boutique barbershop."
    },
    {
        "id": "fr-vacant-cafe",
        "name": "Vacant Commercial Premises",
        "trading_as": None,
        "category": "vacant",
        "street": "Fretherne Road",
        "postcode": "AL8 6NN",
        "lat": 51.8016,
        "lng": -0.2081,
        "status": "vacant",
        "sq_ft": 920,
        "rent_pa": 22500,
        "rateable_value": 21000,
        "landlord_agent": "Davies & Co",
        "notes": "Ground-floor Class E unit suitable for boutique retail or cafe."
    },

    # --- Parkway & Campus West: Leisure, Civic & Heritage ---
    {
        "id": "cw-cinema",
        "name": "Campus West (Cinema, Roller City & Theatre)",
        "trading_as": "Campus West",
        "category": "leisure_culture",
        "street": "The Campus / Parkway",
        "postcode": "AL8 6BX",
        "lat": 51.8042,
        "lng": -0.2098,
        "status": "occupied",
        "sq_ft": 28000,
        "rent_pa": None,
        "rateable_value": 180000,
        "landlord_agent": "Welwyn Hatfield Borough Council",
        "notes": "Independent cinema screens, live comedy, skating rink & Humphrey's bar."
    },
    {
        "id": "cw-library",
        "name": "Welwyn Garden City Central Library",
        "trading_as": "WGC Library",
        "category": "civic_community",
        "street": "Campus West",
        "postcode": "AL8 6AJ",
        "lat": 51.8040,
        "lng": -0.2089,
        "status": "occupied",
        "sq_ft": 12000,
        "rent_pa": None,
        "rateable_value": 92000,
        "landlord_agent": "Hertfordshire County Council",
        "notes": "Public library, digital archive, study pods, and community groups."
    },
    {
        "id": "pw-springhouse",
        "name": "Spring House Medical Centre",
        "trading_as": "Spring House GP",
        "category": "health_pharmacy",
        "street": "Ascots Lane / Parkway",
        "postcode": "AL8 6JL",
        "lat": 51.8035,
        "lng": -0.2112,
        "status": "occupied",
        "sq_ft": 8500,
        "rent_pa": None,
        "rateable_value": 65000,
        "landlord_agent": "NHS Foundation Trust",
        "notes": "Primary care NHS doctor practice and pharmacy."
    }
]

# -------------------------------------------------------------
# 2. UPCOMING ACTIVITIES & HERTFORDSHIRE INTEL
# Sourced from grapevine.db, local-knowledge/upcoming.md, and BID
# -------------------------------------------------------------

UPCOMING_EVENTS = [
    {
        "id": "evt-fire-lego-walk",
        "title": "Charity Fire & Lego Walk for Willow Foundation",
        "date": "2026-10-27",
        "time": "18:00 - 21:00",
        "location": "Welwyn Garden City Town Centre",
        "category": "Charity & Community",
        "organizer": "Willow Foundation",
        "description": "Brave the glowing coals or Lego brick walk to raise funds for seriously ill young adults. Live spectators welcome in the centre."
    },
    {
        "id": "evt-whbc-cabinet",
        "title": "Welwyn Hatfield Cabinet Meeting",
        "date": "2026-11-03",
        "time": "19:30",
        "location": "Council Chamber, The Campus, WGC",
        "category": "Civic & Governance",
        "organizer": "WHBC",
        "description": "Council cabinet session reviewing local infrastructure and budget allocations."
    },
    {
        "id": "evt-applecroft-fireworks",
        "title": "Applecroft PTA Fireworks Spectacular",
        "date": "2026-11-06",
        "time": "18:30 (Gates 17:30)",
        "location": "Applecroft School Grounds, Applecroft Road, AL8 6JZ",
        "category": "Family & Festival",
        "organizer": "Applecroft PTA",
        "description": "Annual community fireworks display with BBQ, hot mulled drinks, glow stalls and musical soundtrack."
    },
    {
        "id": "evt-tewin-fireworks",
        "title": "Annual Tewin Cowper Community Fireworks",
        "date": "2026-11-07",
        "time": "18:00",
        "location": "Tewin Playing Fields, AL6 0JX",
        "category": "Family & Festival",
        "organizer": "Tewin Community Association",
        "description": "Traditional village fireworks night just 5 minutes outside Welwyn Garden City."
    },
    {
        "id": "evt-peartree-patientvoices",
        "title": "Peartree PatientVoices Monthly Meeting",
        "date": "2026-11-12",
        "time": "18:30 - 20:00",
        "location": "Peartree Lane Surgery, AL7 3UJ",
        "category": "Health & Community",
        "organizer": "Peartree Medical Practice",
        "description": "Community patient advocacy group addressing appointment availability, digital triaging and neighbourhood care."
    },
    {
        "id": "evt-xmas-lights-2026",
        "title": "WGC Christmas Lights Switch-On & Festive Trail",
        "date": "2026-11-21",
        "time": "12:00 - 18:30 (Lights switch-on 17:30)",
        "location": "Howardsgate & Stonehills, WGC Town Centre",
        "category": "Town Festival",
        "organizer": "Wonderful WGC BID",
        "description": "The landmark holiday event! Street food market, Santa's grotto, live music stages, lantern parade and lighting of the town centre."
    },
    {
        "id": "evt-planning-panel",
        "title": "Cabinet Planning and Parking Panel",
        "date": "2026-11-24",
        "time": "19:30",
        "location": "Council Chamber, The Campus, WGC",
        "category": "Civic & Governance",
        "organizer": "WHBC",
        "description": "Consultation on town centre parking tariffs, EV charging expansion, and town masterplan updates."
    },
    {
        "id": "evt-food-festival-apps",
        "title": "WGC World Food Festival 2027 Trader Submissions",
        "date": "2026-12-01",
        "time": "Ongoing deadline",
        "location": "WGC BID Online Portal",
        "category": "Food & Business",
        "organizer": "Wonderful WGC BID",
        "description": "Applications open for international food vendors and artisan traders for next summer's flagship food festival."
    }
]

# -------------------------------------------------------------
# 3. COMMUNITY WISHLIST & VOTING SYSTEM (SEED PROPOSALS)
# Seeded with real community debates from Together for WGC & BID
# -------------------------------------------------------------

SEED_WISHLIST = [
    {
        "id": "wish-commuter-late",
        "title": "Commuter Late Shopping Night (Thursdays to 8:00 PM)",
        "category": "Town Vitality & Hours",
        "target_area": "Howard Centre & Howardsgate",
        "votes": 312,
        "description": "Most WGC retail shuts at 5:30 PM, locking out the thousands of commuters stepping off trains from King's Cross and Moorgate. Trial Thursday evening opening across major stores and cafes.",
        "benefits": "Captures London commuter spend in Welwyn, activates the evening economy safely, and supports local food businesses.",
        "feasibility": "High — requires Howard Centre management and BID coordination.",
        "status": "Active Campaign"
    },
    {
        "id": "wish-indie-bookshop",
        "title": "Independent Bookshop & Reading Parlour",
        "category": "Retail & Culture",
        "target_area": "Howard Centre (Unit 38 or Stonehills)",
        "votes": 248,
        "description": "Welwyn Garden City has no dedicated independent bookshop since chain closures. A warm space combining curated fiction, poetry, children's story times, and specialty drip coffee.",
        "benefits": "Fills a major cultural hole in town, creates an intergenerational dwell-space, and celebrates the Garden City literary heritage.",
        "feasibility": "Medium — ideal tenant for vacant Howard Centre Unit 38 (1,084 sq ft).",
        "status": "Community Idea"
    },
    {
        "id": "wish-artisan-bakery",
        "title": "Independent Sourdough Bakery & Deli",
        "category": "Food & Drink",
        "target_area": "Fretherne Road or Howardsgate",
        "votes": 195,
        "description": "While GAIL's and Wenzel's exist, the town lacks a truly independent local baker crafting long-ferment sourdough loaves, artisanal focaccia, and locally churned dairy.",
        "benefits": "Supports regional food producers, draws morning footfall, and diversifies town dining.",
        "feasibility": "High — several vacant units on Fretherne Rd fit a small craft kitchen.",
        "status": "Community Idea"
    },
    {
        "id": "wish-boardgame-lounge",
        "title": "Specialty Board Game Café & Evening Taproom",
        "category": "Leisure & Social",
        "target_area": "Stonehills or First Floor Mall",
        "votes": 164,
        "description": "A welcoming, alcohol-sensible evening hub with a huge board game library, craft beers, bubble teas, and private table bookings for groups and solo joiners.",
        "benefits": "Provides an alcohol-optional evening activity for young adults and families without needing to travel to London or St Albans.",
        "feasibility": "High — strong local gaming community already active in WGC.",
        "status": "Community Idea"
    },
    {
        "id": "wish-indoor-climbing",
        "title": "Indoor Bouldering & Movement Gym",
        "category": "Sports & Youth",
        "target_area": "Broadwater Road / Shredded Wheat Site",
        "votes": 128,
        "description": "A modern indoor bouldering wall, campus boards, and movement fitness facility for teens and adults.",
        "benefits": "Provides high-energy active sports for teenagers who currently have limited indoor leisure outside Campus West skating.",
        "feasibility": "Medium — requires high-ceiling warehouse or multi-level space.",
        "status": "Feasibility Study"
    },
    {
        "id": "wish-zero-waste",
        "title": "Zero-Waste Refill Pantry & Organic Grocer",
        "category": "Sustainable Living",
        "target_area": "Stonehills Square",
        "votes": 115,
        "description": "Bring-your-own-jar bulk grains, nuts, pulses, oils, household eco-detergents, and plastic-free seasonal produce.",
        "benefits": "Aligns with Ebenezer Howard's original Garden City eco-sustainability vision; eliminates single-use plastics.",
        "feasibility": "High — low capital shop fit suited for a 600–900 sq ft retail unit.",
        "status": "Community Idea"
    },
    {
        "id": "wish-pedestrian-evenings",
        "title": "Pedestrianize Howardsgate for Weekend Al-Fresco Dining",
        "category": "Public Realm & Transport",
        "target_area": "Howardsgate",
        "votes": 204,
        "description": "Close Howardsgate to vehicle traffic on Friday and Saturday evenings during spring and summer to allow expanded restaurant terrace seating, acoustic musicians, and European-style outdoor socialising.",
        "benefits": "Transforms town centre atmosphere into a vibrant, safe destination.",
        "feasibility": "Medium — requires WHBC highways and bus rerouting permissions.",
        "status": "Council Discussion"
    }
]

# -------------------------------------------------------------
# 4. ANALYTICS & GAP ANALYSIS ENGINE
# -------------------------------------------------------------

def compute_analytics(units):
    total = len(units)
    categories = {}
    vacant_count = 0
    total_vacant_rent = 0
    vacant_units_with_rent = 0
    total_sq_ft = 0

    for u in units:
        cat = u["category"]
        categories[cat] = categories.get(cat, 0) + 1
        sq_ft = u.get("sq_ft") or 0
        total_sq_ft += sq_ft

        if u["status"] == "vacant":
            vacant_count += 1
            rent = u.get("rent_pa")
            if rent:
                total_vacant_rent += rent
                vacant_units_with_rent += 1

    vacancy_rate = round((vacant_count / total * 100), 1) if total > 0 else 0
    avg_vacant_rent = round(total_vacant_rent / vacant_units_with_rent) if vacant_units_with_rent > 0 else 0

    # Human-readable labels
    category_labels = {
        "vacant": "Vacant / Empty Commercial Lots",
        "barber_salon": "Barbers, Salons & Hair",
        "charity_shop": "Charity Shops",
        "coffee_bakery": "Coffee Shops & Bakeries",
        "restaurant_food": "Restaurants & Casual Dining",
        "retail_clothing": "Fashion & Clothing Retail",
        "retail_lifestyle": "Lifestyle, Homeware & Gifts",
        "retail_discount": "Discount & Variety Retail",
        "services_bank": "Banks & Financial Services",
        "health_pharmacy": "Pharmacies, Opticians & Health",
        "leisure_culture": "Cinema, Leisure & Culture",
        "leisure_fitness": "Gyms & Active Fitness",
        "department_store": "Department Stores",
        "civic_community": "Public Libraries & Civic Hubs"
    }

    distribution = []
    for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
        distribution.append({
            "category": cat,
            "label": category_labels.get(cat, cat.replace("_", " ").title()),
            "count": count,
            "percentage": round(count / total * 100, 1)
        })

    # Town Balance / Gaps Scorecard
    # What the town has in excess vs what is critically missing
    gaps_scorecard = {
        "oversaturated": [
            {
                "category": "Barbers & Hairdressers",
                "count": categories.get("barber_salon", 0),
                "share": f"{round(categories.get('barber_salon', 0) / total * 100)}%",
                "verdict": "High Density",
                "note": "6+ barbers/salons in under 500m radius. Market is heavily serviced."
            },
            {
                "category": "Charity Shops",
                "count": categories.get("charity_shop", 0),
                "share": f"{round(categories.get('charity_shop', 0) / total * 100)}%",
                "verdict": "Clustered",
                "note": "Concentrated almost exclusively on Stonehills (6 stores within 150m)."
            },
            {
                "category": "High-Street Coffee Chains",
                "count": categories.get("coffee_bakery", 0),
                "share": f"{round(categories.get('coffee_bakery', 0) / total * 100)}%",
                "verdict": "Dominated by Chains",
                "note": "Starbucks, Costa, Greggs, Wenzel's present; distinct gap for craft third-wave coffee."
            }
        ],
        "missing_deficits": [
            {
                "amenity": "Independent Bookshop",
                "current_count": 0,
                "community_demand": "Very High (#2 Voted)",
                "recommended_action": "Incentivize bookseller tenant into Howard Centre Unit 38 or 10."
            },
            {
                "amenity": "Evening Commuter Retail & Social (Post 5:30 PM)",
                "current_count": 0,
                "community_demand": "Top Priority (#1 Voted)",
                "recommended_action": "Pilot Thursday late opening trial with Ardent & BID."
            },
            {
                "amenity": "Artisan Sourdough Bakery / Delicatessen",
                "current_count": 0,
                "community_demand": "High (#3 Voted)",
                "recommended_action": "Target boutique baker for Fretherne Rd vacant unit."
            },
            {
                "amenity": "Specialty Board Game / Youth Social Lounge",
                "current_count": 0,
                "community_demand": "High (#4 Voted)",
                "recommended_action": "Activate upper mall vacant space with low-rent leisure concession."
            },
            {
                "amenity": "Zero-Waste Bulk Refill Grocer",
                "current_count": 0,
                "community_demand": "Moderate",
                "recommended_action": "Eco-retailer pop-up in Stonehills vacant lot."
            }
        ]
    }

    return {
        "summary": {
            "total_units": total,
            "occupied_units": total - vacant_count,
            "vacant_units": vacant_count,
            "vacancy_rate_pct": vacancy_rate,
            "total_tracked_sq_ft": total_sq_ft,
            "average_asking_rent_pa": avg_vacant_rent,
            "total_available_rent_potential_pa": total_vacant_rent
        },
        "distribution": distribution,
        "gaps_scorecard": gaps_scorecard
    }

# -------------------------------------------------------------
# MAIN EXECUTION
# -------------------------------------------------------------

def main():
    print(f"[build_wgc_data] Processing {len(BASE_UNITS)} town centre units...")
    analytics = compute_analytics(BASE_UNITS)

    # Save units
    units_path = os.path.join(DATA_DIR, "units.json")
    with open(units_path, "w", encoding="utf-8") as f:
        json.dump(BASE_UNITS, f, indent=2)
    print(f" -> Wrote {units_path} ({len(BASE_UNITS)} records)")

    # Save upcoming events
    events_path = os.path.join(DATA_DIR, "events.json")
    with open(events_path, "w", encoding="utf-8") as f:
        json.dump(UPCOMING_EVENTS, f, indent=2)
    print(f" -> Wrote {events_path} ({len(UPCOMING_EVENTS)} records)")

    # Save community wishlist proposals
    wishlist_path = os.path.join(DATA_DIR, "wishlist.json")
    with open(wishlist_path, "w", encoding="utf-8") as f:
        json.dump(SEED_WISHLIST, f, indent=2)
    print(f" -> Wrote {wishlist_path} ({len(SEED_WISHLIST)} records)")

    # Save analytics
    analytics_path = os.path.join(DATA_DIR, "analytics.json")
    with open(analytics_path, "w", encoding="utf-8") as f:
        json.dump(analytics, f, indent=2)
    print(f" -> Wrote {analytics_path} (Vacancy rate: {analytics['summary']['vacancy_rate_pct']}%)")

    print("[build_wgc_data] All Welwyn Garden City datasets successfully generated!")

if __name__ == "__main__":
    main()
