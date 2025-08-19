// DebriSense Mock Data
// TODO: Replace with real API calls and ML model outputs

const mockData = {
    // Cleanup Reports
    cleanupReports: [
        {
            id: "CR1001",
            location: "Tanjung Aru Beach",
            state: "Sabah",
            river: "Sungai Petagas",
            date: "2024-10-15",
            plastic_items: {
                plastic_bottles: 245,
                plastic_bags: 189,
                straws: 67,
                food_wrappers: 134,
                others: 89
            },
            submitted_by: "Reef Check Team A",
            source: "ICC Event 2024"
        },
        {
            id: "CR1002",
            location: "Pantai Batu Ferringhi",
            state: "Penang",
            river: "Sungai Pinang",
            date: "2024-10-12",
            plastic_items: {
                plastic_bottles: 312,
                plastic_bags: 201,
                straws: 45,
                food_wrappers: 178,
                others: 67
            },
            submitted_by: "EcoKnights Team",
            source: "Monthly Cleanup"
        },
        {
            id: "CR1003",
            location: "Port Dickson Beach",
            state: "Negeri Sembilan",
            river: "Sungai Linggi",
            date: "2024-10-08",
            plastic_items: {
                plastic_bottles: 189,
                plastic_bags: 156,
                straws: 34,
                food_wrappers: 98,
                others: 45
            },
            submitted_by: "Marine Park Authority",
            source: "Regular Monitoring"
        },
        {
            id: "CR1004",
            location: "Klang River Mouth",
            state: "Selangor",
            river: "Sungai Klang",
            date: "2024-10-10",
            plastic_items: {
                plastic_bottles: 456,
                plastic_bags: 234,
                straws: 89,
                food_wrappers: 267,
                others: 123
            },
            submitted_by: "Klang Municipal Council",
            source: "River Cleanup Initiative"
        },
        {
            id: "CR1005",
            location: "Johor Bahru Waterfront",
            state: "Johor",
            river: "Sungai Johor",
            date: "2024-10-07",
            plastic_items: {
                plastic_bottles: 334,
                plastic_bags: 178,
                straws: 56,
                food_wrappers: 145,
                others: 78
            },
            submitted_by: "JB City Council",
            source: "Coastal Cleanup"
        },
        {
            id: "CR1006",
            location: "Lumut Beach",
            state: "Perak",
            river: "Sungai Perak",
            date: "2024-10-05",
            plastic_items: {
                plastic_bottles: 198,
                plastic_bags: 145,
                straws: 43,
                food_wrappers: 112,
                others: 67
            },
            submitted_by: "Perak Marine Department",
            source: "Beach Monitoring"
        },
        {
            id: "CR1007",
            location: "Alor Setar Riverfront",
            state: "Kedah",
            river: "Sungai Muda",
            date: "2024-10-03",
            plastic_items: {
                plastic_bottles: 267,
                plastic_bags: 189,
                straws: 78,
                food_wrappers: 156,
                others: 89
            },
            submitted_by: "Kedah Environmental Agency",
            source: "River Restoration"
        },
        {
            id: "CR1008",
            location: "Kota Bharu Beach",
            state: "Kelantan",
            river: "Sungai Kelantan",
            date: "2024-10-01",
            plastic_items: {
                plastic_bottles: 145,
                plastic_bags: 98,
                straws: 34,
                food_wrappers: 87,
                others: 45
            },
            submitted_by: "Kelantan Tourism Board",
            source: "Tourism Area Cleanup"
        },
        {
            id: "CR1009",
            location: "Kuala Terengganu Beach",
            state: "Terengganu",
            river: "Sungai Terengganu",
            date: "2024-09-28",
            plastic_items: {
                plastic_bottles: 223,
                plastic_bags: 167,
                straws: 67,
                food_wrappers: 134,
                others: 78
            },
            submitted_by: "Terengganu Marine Park",
            source: "Marine Conservation"
        },
        {
            id: "CR1010",
            location: "Kuantan Beach",
            state: "Pahang",
            river: "Sungai Pahang",
            date: "2024-09-25",
            plastic_items: {
                plastic_bottles: 189,
                plastic_bags: 134,
                straws: 45,
                food_wrappers: 98,
                others: 56
            },
            submitted_by: "Pahang Fisheries Department",
            source: "Fisheries Monitoring"
        },
        {
            id: "CR1011",
            location: "Melaka River",
            state: "Melaka",
            river: "Sungai Muar",
            date: "2024-09-22",
            plastic_items: {
                plastic_bottles: 312,
                plastic_bags: 234,
                straws: 89,
                food_wrappers: 178,
                others: 123
            },
            submitted_by: "Melaka Historical City Council",
            source: "Heritage Site Cleanup"
        },
        {
            id: "CR1012",
            location: "Kuching Waterfront",
            state: "Sarawak",
            river: "Sungai Sarawak",
            date: "2024-09-20",
            plastic_items: {
                plastic_bottles: 178,
                plastic_bags: 123,
                straws: 45,
                food_wrappers: 89,
                others: 67
            },
            submitted_by: "Sarawak Tourism Board",
            source: "Tourism Area Maintenance"
        },
        {
            id: "CR1013",
            location: "Kangar River",
            state: "Perlis",
            river: "Sungai Perlis",
            date: "2024-09-18",
            plastic_items: {
                plastic_bottles: 134,
                plastic_bags: 89,
                straws: 34,
                food_wrappers: 67,
                others: 45
            },
            submitted_by: "Perlis State Department",
            source: "State River Monitoring"
        },
        {
            id: "CR1014",
            location: "Labuan Beach",
            state: "Labuan",
            river: "Sungai Labuan",
            date: "2024-09-15",
            plastic_items: {
                plastic_bottles: 156,
                plastic_bags: 112,
                straws: 43,
                food_wrappers: 78,
                others: 56
            },
            submitted_by: "Labuan Marine Department",
            source: "Federal Territory Cleanup"
        },
        {
            id: "CR1015",
            location: "Putrajaya Lake",
            state: "Putrajaya",
            river: "Sungai Putrajaya",
            date: "2024-09-12",
            plastic_items: {
                plastic_bottles: 89,
                plastic_bags: 67,
                straws: 23,
                food_wrappers: 45,
                others: 34
            },
            submitted_by: "Putrajaya Corporation",
            source: "Administrative Capital Maintenance"
        },
        {
            id: "CR1016",
            location: "Damansara River",
            state: "Selangor",
            river: "Sungai Damansara",
            date: "2024-09-10",
            plastic_items: {
                plastic_bottles: 567,
                plastic_bags: 289,
                straws: 123,
                food_wrappers: 345,
                others: 178
            },
            submitted_by: "Petaling Jaya City Council",
            source: "Urban River Cleanup"
        },
        {
            id: "CR1017",
            location: "Juru Industrial Area",
            state: "Penang",
            river: "Sungai Juru",
            date: "2024-09-08",
            plastic_items: {
                plastic_bottles: 445,
                plastic_bags: 234,
                straws: 98,
                food_wrappers: 267,
                others: 145
            },
            submitted_by: "Penang DOE",
            source: "Industrial Zone Monitoring"
        },
        {
            id: "CR1018",
            location: "Tebrau River",
            state: "Johor",
            river: "Sungai Tebrau",
            date: "2024-09-05",
            plastic_items: {
                plastic_bottles: 378,
                plastic_bags: 198,
                straws: 76,
                food_wrappers: 189,
                others: 98
            },
            submitted_by: "Johor Bahru City Council",
            source: "City River Maintenance"
        },
        {
            id: "CR1019",
            location: "Larut River",
            state: "Perak",
            river: "Sungai Larut",
            date: "2024-09-02",
            plastic_items: {
                plastic_bottles: 234,
                plastic_bags: 167,
                straws: 67,
                food_wrappers: 145,
                others: 89
            },
            submitted_by: "Perak DOE",
            source: "Mining Area Cleanup"
        },
        {
            id: "CR1020",
            location: "Yan Beach",
            state: "Kedah",
            river: "Sungai Yan",
            date: "2024-08-30",
            plastic_items: {
                plastic_bottles: 198,
                plastic_bags: 145,
                straws: 56,
                food_wrappers: 123,
                others: 78
            },
            submitted_by: "Kedah Tourism Board",
            source: "Tourism Area Maintenance"
        },
        {
            id: "CR1021",
            location: "Besut River",
            state: "Kelantan",
            river: "Sungai Besut",
            date: "2024-08-28",
            plastic_items: {
                plastic_bottles: 167,
                plastic_bags: 123,
                straws: 45,
                food_wrappers: 98,
                others: 67
            },
            submitted_by: "Kelantan Fisheries Department",
            source: "Fisheries Zone Monitoring"
        },
        {
            id: "CR1022",
            location: "Kemaman Beach",
            state: "Terengganu",
            river: "Sungai Kemaman",
            date: "2024-08-25",
            plastic_items: {
                plastic_bottles: 289,
                plastic_bags: 178,
                straws: 89,
                food_wrappers: 234,
                others: 123
            },
            submitted_by: "Terengganu Marine Park",
            source: "Marine Conservation"
        },
        {
            id: "CR1023",
            location: "Rompin River",
            state: "Pahang",
            river: "Sungai Rompin",
            date: "2024-08-22",
            plastic_items: {
                plastic_bottles: 156,
                plastic_bags: 98,
                straws: 34,
                food_wrappers: 87,
                others: 56
            },
            submitted_by: "Pahang Forestry Department",
            source: "Forest Reserve Monitoring"
        },
        {
            id: "CR1024",
            location: "Rembau River",
            state: "Negeri Sembilan",
            river: "Sungai Rembau",
            date: "2024-08-20",
            plastic_items: {
                plastic_bottles: 123,
                plastic_bags: 89,
                straws: 32,
                food_wrappers: 67,
                others: 45
            },
            submitted_by: "Negeri Sembilan DOE",
            source: "Rural Area Monitoring"
        },
        {
            id: "CR1025",
            location: "Kesang River",
            state: "Melaka",
            river: "Sungai Kesang",
            date: "2024-08-18",
            plastic_items: {
                plastic_bottles: 234,
                plastic_bags: 167,
                straws: 78,
                food_wrappers: 145,
                others: 89
            },
            submitted_by: "Melaka Historical City Council",
            source: "Heritage Site Maintenance"
        },
        {
            id: "CR1026",
            location: "Batang Lupar River",
            state: "Sarawak",
            river: "Sungai Batang Lupar",
            date: "2024-08-15",
            plastic_items: {
                plastic_bottles: 145,
                plastic_bags: 98,
                straws: 43,
                food_wrappers: 78,
                others: 56
            },
            submitted_by: "Sarawak Forestry Department",
            source: "Forest Conservation"
        },
        {
            id: "CR1027",
            location: "Arau River",
            state: "Perlis",
            river: "Sungai Arau",
            date: "2024-08-12",
            plastic_items: {
                plastic_bottles: 98,
                plastic_bags: 67,
                straws: 23,
                food_wrappers: 45,
                others: 34
            },
            submitted_by: "Perlis State Department",
            source: "State River Monitoring"
        },
        {
            id: "CR1028",
            location: "Labuan Besar Beach",
            state: "Labuan",
            river: "Sungai Labuan Besar",
            date: "2024-08-10",
            plastic_items: {
                plastic_bottles: 134,
                plastic_bags: 89,
                straws: 34,
                food_wrappers: 67,
                others: 45
            },
            submitted_by: "Labuan Marine Department",
            source: "Federal Territory Maintenance"
        },
        {
            id: "CR1029",
            location: "Putrajaya Timur Lake",
            state: "Putrajaya",
            river: "Sungai Putrajaya Timur",
            date: "2024-08-08",
            plastic_items: {
                plastic_bottles: 78,
                plastic_bags: 56,
                straws: 19,
                food_wrappers: 34,
                others: 28
            },
            submitted_by: "Putrajaya Corporation",
            source: "Administrative Capital Maintenance"
        },
        {
            id: "CR1030",
            location: "Gombak River",
            state: "Kuala Lumpur",
            river: "Sungai Gombak",
            date: "2024-08-05",
            plastic_items: {
                plastic_bottles: 345,
                plastic_bags: 234,
                straws: 98,
                food_wrappers: 189,
                others: 123
            },
            submitted_by: "Kuala Lumpur City Hall",
            source: "Urban River Maintenance"
        }
    ],

    // Pollution Observations
    pollutionObservations: [
        {
            id: "PO1001",
            observer_name: "Port Authority Officer",
            location: "Penang Port Area",
            river: "Sungai Pinang",
            state: "Penang",
            date: "2024-10-14",
            pollution_type: "Floating debris",
            notes: "Large accumulation of plastic waste near port entrance"
        },
        {
            id: "PO1002",
            observer_name: "Fisherman",
            location: "Klang River Mouth",
            river: "Sungai Klang",
            state: "Selangor",
            date: "2024-10-13",
            pollution_type: "Oil residue",
            notes: "Oil slick observed with plastic debris mixed in"
        },
        {
            id: "PO1003",
            observer_name: "Marine Biologist",
            location: "Johor Bahru Waterfront",
            river: "Sungai Johor",
            state: "Johor",
            date: "2024-10-12",
            pollution_type: "Microplastics",
            notes: "High concentration of microplastics in water samples"
        },
        {
            id: "PO1004",
            observer_name: "Tourism Guide",
            location: "Lumut Beach",
            river: "Sungai Perak",
            state: "Perak",
            date: "2024-10-11",
            pollution_type: "Beach litter",
            notes: "Plastic bottles and food wrappers washed ashore"
        },
        {
            id: "PO1005",
            observer_name: "Environmental Officer",
            location: "Alor Setar Riverfront",
            river: "Sungai Muda",
            state: "Kedah",
            date: "2024-10-10",
            pollution_type: "Industrial waste",
            notes: "Suspected industrial discharge with plastic contaminants"
        },
        {
            id: "PO1006",
            observer_name: "Local Resident",
            location: "Kota Bharu Beach",
            river: "Sungai Kelantan",
            state: "Kelantan",
            date: "2024-10-09",
            pollution_type: "Fishing gear",
            notes: "Abandoned fishing nets and plastic floats found"
        },
        {
            id: "PO1007",
            observer_name: "Marine Park Ranger",
            location: "Kuala Terengganu Beach",
            river: "Sungai Terengganu",
            state: "Terengganu",
            date: "2024-10-08",
            pollution_type: "Marine debris",
            notes: "Turtle nesting area affected by plastic pollution"
        },
        {
            id: "PO1008",
            observer_name: "Fisheries Officer",
            location: "Kuantan Beach",
            river: "Sungai Pahang",
            state: "Pahang",
            date: "2024-10-07",
            pollution_type: "Fishing waste",
            notes: "Discarded fishing equipment and plastic containers"
        },
        {
            id: "PO1009",
            observer_name: "Heritage Officer",
            location: "Melaka River",
            river: "Sungai Muar",
            state: "Melaka",
            date: "2024-10-06",
            pollution_type: "Tourism waste",
            notes: "Plastic waste from tourist activities in heritage area"
        },
        {
            id: "PO1010",
            observer_name: "Forestry Officer",
            location: "Kuching Waterfront",
            river: "Sungai Sarawak",
            state: "Sarawak",
            date: "2024-10-05",
            pollution_type: "River debris",
            notes: "Plastic waste accumulating in river bends"
        },
        {
            id: "PO1011",
            observer_name: "State Officer",
            location: "Kangar River",
            river: "Sungai Perlis",
            state: "Perlis",
            date: "2024-10-04",
            pollution_type: "Agricultural waste",
            notes: "Plastic mulch and packaging from agricultural activities"
        },
        {
            id: "PO1012",
            observer_name: "Marine Department Officer",
            location: "Labuan Beach",
            river: "Sungai Labuan",
            state: "Labuan",
            date: "2024-10-03",
            pollution_type: "Shipping waste",
            notes: "Plastic waste from shipping activities in port area"
        },
        {
            id: "PO1013",
            observer_name: "Administrative Officer",
            location: "Putrajaya Lake",
            river: "Sungai Putrajaya",
            state: "Putrajaya",
            date: "2024-10-02",
            pollution_type: "Urban waste",
            notes: "Plastic waste from administrative buildings and parks"
        },
        {
            id: "PO1014",
            observer_name: "City Hall Officer",
            location: "Gombak River",
            river: "Sungai Gombak",
            state: "Kuala Lumpur",
            date: "2024-10-01",
            pollution_type: "Urban runoff",
            notes: "Plastic waste washed into river from urban areas"
        },
        {
            id: "PO1015",
            observer_name: "Environmental Activist",
            location: "Damansara River",
            river: "Sungai Damansara",
            state: "Selangor",
            date: "2024-09-30",
            pollution_type: "Industrial pollution",
            notes: "Plastic waste from industrial areas affecting water quality"
        }
    ],

    // ML Prediction Zones
    mlPredictionZones: [
        // High Risk Zones (0.7-1.0)
        {
            id: "ZONE001",
            state: "Selangor",
            river_basin: "Sungai Klang",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.87,
            top_pollution_types: ["Plastic Bottles", "Food Wrappers", "Plastic Bags"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE002",
            state: "Penang",
            river_basin: "Sungai Pinang",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.82,
            top_pollution_types: ["Plastic Bags", "Straws", "Food Wrappers"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE003",
            state: "Johor",
            river_basin: "Sungai Johor",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.78,
            top_pollution_types: ["Plastic Bottles", "Fishing Gear", "Food Wrappers"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE004",
            state: "Perak",
            river_basin: "Sungai Perak",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.75,
            top_pollution_types: ["Plastic Bags", "Plastic Bottles", "Others"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE005",
            state: "Kedah",
            river_basin: "Sungai Muda",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.73,
            top_pollution_types: ["Food Wrappers", "Plastic Bottles", "Straws"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE006",
            state: "Kelantan",
            river_basin: "Sungai Kelantan",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.71,
            top_pollution_types: ["Plastic Bottles", "Fishing Gear", "Food Wrappers"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        
        // Moderate Risk Zones (0.4-0.7)
        {
            id: "ZONE007",
            state: "Sabah",
            river_basin: "Sungai Petagas",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.68,
            top_pollution_types: ["Plastic Bottles", "Fishing Gear", "Food Wrappers"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE008",
            state: "Terengganu",
            river_basin: "Sungai Terengganu",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.65,
            top_pollution_types: ["Plastic Bags", "Plastic Bottles", "Others"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE009",
            state: "Pahang",
            river_basin: "Sungai Pahang",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.62,
            top_pollution_types: ["Food Wrappers", "Plastic Bottles", "Straws"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE010",
            state: "Negeri Sembilan",
            river_basin: "Sungai Linggi",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.58,
            top_pollution_types: ["Plastic Bottles", "Food Wrappers", "Plastic Bags"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE011",
            state: "Melaka",
            river_basin: "Sungai Muar",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.55,
            top_pollution_types: ["Plastic Bags", "Straws", "Food Wrappers"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE012",
            state: "Sarawak",
            river_basin: "Sungai Sarawak",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.52,
            top_pollution_types: ["Plastic Bottles", "Fishing Gear", "Food Wrappers"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE013",
            state: "Perlis",
            river_basin: "Sungai Perlis",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.48,
            top_pollution_types: ["Food Wrappers", "Plastic Bottles", "Straws"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE014",
            state: "Labuan",
            river_basin: "Sungai Labuan",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.45,
            top_pollution_types: ["Plastic Bags", "Plastic Bottles", "Others"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        
        // Low Risk Zones (0.1-0.4)
        {
            id: "ZONE015",
            state: "Putrajaya",
            river_basin: "Sungai Putrajaya",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.38,
            top_pollution_types: ["Plastic Bottles", "Food Wrappers", "Plastic Bags"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE016",
            state: "Kuala Lumpur",
            river_basin: "Sungai Klang (KL)",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.35,
            top_pollution_types: ["Plastic Bags", "Straws", "Food Wrappers"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE017",
            state: "Sabah",
            river_basin: "Sungai Kinabatangan",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.32,
            top_pollution_types: ["Plastic Bottles", "Fishing Gear", "Food Wrappers"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE018",
            state: "Sarawak",
            river_basin: "Sungai Rajang",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.28,
            top_pollution_types: ["Food Wrappers", "Plastic Bottles", "Straws"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE019",
            state: "Pahang",
            river_basin: "Sungai Tembeling",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.25,
            top_pollution_types: ["Plastic Bags", "Plastic Bottles", "Others"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE020",
            state: "Terengganu",
            river_basin: "Sungai Dungun",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.22,
            top_pollution_types: ["Plastic Bottles", "Food Wrappers", "Plastic Bags"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE021",
            state: "Kelantan",
            river_basin: "Sungai Golok",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.18,
            top_pollution_types: ["Plastic Bags", "Straws", "Food Wrappers"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE022",
            state: "Kedah",
            river_basin: "Sungai Baling",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.15,
            top_pollution_types: ["Plastic Bottles", "Fishing Gear", "Food Wrappers"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE023",
            state: "Perak",
            river_basin: "Sungai Kinta",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.12,
            top_pollution_types: ["Food Wrappers", "Plastic Bottles", "Straws"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE024",
            state: "Johor",
            river_basin: "Sungai Batu Pahat",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.08,
            top_pollution_types: ["Plastic Bags", "Plastic Bottles", "Others"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE025",
            state: "Negeri Sembilan",
            river_basin: "Sungai Jelebu",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.05,
            top_pollution_types: ["Plastic Bottles", "Food Wrappers", "Plastic Bags"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        
        // Additional High Risk Zones
        {
            id: "ZONE026",
            state: "Selangor",
            river_basin: "Sungai Damansara",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.89,
            top_pollution_types: ["Plastic Bottles", "Food Wrappers", "Plastic Bags"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE027",
            state: "Penang",
            river_basin: "Sungai Juru",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.84,
            top_pollution_types: ["Plastic Bags", "Straws", "Food Wrappers"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE028",
            state: "Johor",
            river_basin: "Sungai Tebrau",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.81,
            top_pollution_types: ["Plastic Bottles", "Fishing Gear", "Food Wrappers"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE029",
            state: "Perak",
            river_basin: "Sungai Larut",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.79,
            top_pollution_types: ["Plastic Bags", "Plastic Bottles", "Others"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE030",
            state: "Kedah",
            river_basin: "Sungai Yan",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.76,
            top_pollution_types: ["Food Wrappers", "Plastic Bottles", "Straws"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        
        // Additional Moderate Risk Zones
        {
            id: "ZONE031",
            state: "Kelantan",
            river_basin: "Sungai Besut",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.69,
            top_pollution_types: ["Plastic Bottles", "Fishing Gear", "Food Wrappers"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE032",
            state: "Terengganu",
            river_basin: "Sungai Kemaman",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.66,
            top_pollution_types: ["Plastic Bags", "Plastic Bottles", "Others"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE033",
            state: "Pahang",
            river_basin: "Sungai Rompin",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.63,
            top_pollution_types: ["Food Wrappers", "Plastic Bottles", "Straws"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE034",
            state: "Negeri Sembilan",
            river_basin: "Sungai Rembau",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.59,
            top_pollution_types: ["Plastic Bottles", "Food Wrappers", "Plastic Bags"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE035",
            state: "Melaka",
            river_basin: "Sungai Kesang",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.56,
            top_pollution_types: ["Plastic Bags", "Straws", "Food Wrappers"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE036",
            state: "Sarawak",
            river_basin: "Sungai Batang Lupar",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.53,
            top_pollution_types: ["Plastic Bottles", "Fishing Gear", "Food Wrappers"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE037",
            state: "Perlis",
            river_basin: "Sungai Arau",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.49,
            top_pollution_types: ["Food Wrappers", "Plastic Bottles", "Straws"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE038",
            state: "Labuan",
            river_basin: "Sungai Labuan Besar",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.46,
            top_pollution_types: ["Plastic Bags", "Plastic Bottles", "Others"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        
        // Additional Low Risk Zones
        {
            id: "ZONE039",
            state: "Putrajaya",
            river_basin: "Sungai Putrajaya Timur",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.41,
            top_pollution_types: ["Plastic Bottles", "Food Wrappers", "Plastic Bags"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE040",
            state: "Kuala Lumpur",
            river_basin: "Sungai Gombak",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.38,
            top_pollution_types: ["Plastic Bags", "Straws", "Food Wrappers"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE041",
            state: "Sabah",
            river_basin: "Sungai Labuk",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.35,
            top_pollution_types: ["Plastic Bottles", "Fishing Gear", "Food Wrappers"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE042",
            state: "Sarawak",
            river_basin: "Sungai Baram",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.31,
            top_pollution_types: ["Food Wrappers", "Plastic Bottles", "Straws"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE043",
            state: "Pahang",
            river_basin: "Sungai Lipis",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.28,
            top_pollution_types: ["Plastic Bags", "Plastic Bottles", "Others"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE044",
            state: "Terengganu",
            river_basin: "Sungai Setiu",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.24,
            top_pollution_types: ["Plastic Bottles", "Food Wrappers", "Plastic Bags"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE045",
            state: "Kelantan",
            river_basin: "Sungai Lebir",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.21,
            top_pollution_types: ["Plastic Bags", "Straws", "Food Wrappers"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE046",
            state: "Kedah",
            river_basin: "Sungai Baling",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.17,
            top_pollution_types: ["Plastic Bottles", "Fishing Gear", "Food Wrappers"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE047",
            state: "Perak",
            river_basin: "Sungai Bernam",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.14,
            top_pollution_types: ["Food Wrappers", "Plastic Bottles", "Straws"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE048",
            state: "Johor",
            river_basin: "Sungai Endau",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.11,
            top_pollution_types: ["Plastic Bags", "Plastic Bottles", "Others"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE049",
            state: "Negeri Sembilan",
            river_basin: "Sungai Gemas",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.08,
            top_pollution_types: ["Plastic Bottles", "Food Wrappers", "Plastic Bags"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE050",
            state: "Selangor",
            river_basin: "Sungai Selangor",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.03,
            top_pollution_types: ["Plastic Bags", "Straws", "Food Wrappers"],
            last_updated: "2024-10-15T10:30:00Z"
        }
    ],

    // Risk Insight Summaries
    riskInsightSummaries: [
        {
            region: "East Coast Zone",
            high_risk_rivers: ["Sungai Klang", "Sungai Pinang", "Sungai Johor"],
            average_risk_score: 0.74,
            season: "Northeast Monsoon",
            trend: "Increasing",
            recommendations: [
                "Increase cleanup frequency in Sg. Klang Basin",
                "Monitor Klang River monthly during monsoon",
                "Deploy additional cleanup teams to high-risk zones"
            ]
        },
        {
            region: "West Coast Zone",
            high_risk_rivers: ["Sungai Petagas", "Sungai Linggi"],
            average_risk_score: 0.55,
            season: "Northeast Monsoon",
            trend: "Stable",
            recommendations: [
                "Maintain current cleanup schedule",
                "Focus on prevention in urban areas",
                "Collaborate with local communities"
            ]
        }
    ],

    // Malaysian States
    states: [
        "Selangor", "Penang", "Sabah", "Sarawak", "Johor", "Perak", 
        "Kedah", "Kelantan", "Terengganu", "Pahang", "Negeri Sembilan", 
        "Melaka", "Perlis", "Kuala Lumpur", "Putrajaya", "Labuan"
    ],

    // Major Rivers
    rivers: [
        "Sungai Klang", "Sungai Pinang", "Sungai Petagas", "Sungai Johor",
        "Sungai Linggi", "Sungai Muar", "Sungai Pahang", "Sungai Perak",
        "Sungai Muda", "Sungai Kelantan", "Sungai Terengganu"
    ],

    // River Coordinates for Map Markers
    riverCoordinates: [
        {
            name: "Sungai Klang",
            coordinates: [3.0738, 101.5183], // Kuala Lumpur area
            state: "Selangor",
            description: "Major river flowing through Kuala Lumpur to Port Klang"
        },
        {
            name: "Sungai Pinang",
            coordinates: [5.4164, 100.3327], // Penang area
            state: "Penang",
            description: "River flowing through George Town, Penang"
        },
        {
            name: "Sungai Petagas",
            coordinates: [5.9804, 116.0735], // Kota Kinabalu area
            state: "Sabah",
            description: "River near Kota Kinabalu, Sabah"
        },
        {
            name: "Sungai Johor",
            coordinates: [1.4927, 103.7414], // Johor Bahru area
            state: "Johor",
            description: "Major river in Johor state"
        },
        {
            name: "Sungai Linggi",
            coordinates: [2.4539, 101.8667], // Port Dickson area
            state: "Negeri Sembilan",
            description: "River flowing to Port Dickson"
        },
        {
            name: "Sungai Muar",
            coordinates: [2.0442, 102.5689], // Muar area
            state: "Johor",
            description: "River in Muar, Johor"
        },
        {
            name: "Sungai Pahang",
            coordinates: [3.8077, 103.3260], // Kuantan area
            state: "Pahang",
            description: "Longest river in Peninsular Malaysia"
        },
        {
            name: "Sungai Perak",
            coordinates: [4.5921, 100.6348], // Perak area
            state: "Perak",
            description: "Major river in Perak state"
        },
        {
            name: "Sungai Muda",
            coordinates: [5.4204, 100.3778], // Kedah area
            state: "Kedah",
            description: "River in Kedah state"
        },
        {
            name: "Sungai Kelantan",
            coordinates: [6.1185, 102.3273], // Kota Bharu area
            state: "Kelantan",
            description: "Major river in Kelantan state"
        },
        {
            name: "Sungai Terengganu",
            coordinates: [5.3296, 103.1370], // Kuala Terengganu area
            state: "Terengganu",
            description: "River in Terengganu state"
        }
    ],

    // Pollution Types
    pollutionTypes: [
        "Plastic Bottles", "Plastic Bags", "Food Wrappers", "Straws",
        "Cigarette Butts", "Fishing Gear", "Microplastics", "Others"
    ],

    // Seasons
    seasons: ["Northeast Monsoon", "Southwest Monsoon"],

    // Current Season (for toggling)
    currentSeason: "Northeast Monsoon"
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = mockData;
} else {
    window.mockData = mockData;
} 