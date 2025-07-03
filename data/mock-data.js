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
        }
    ],

    // ML Prediction Zones
    mlPredictionZones: [
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
            predicted_risk_score: 0.72,
            top_pollution_types: ["Plastic Bags", "Straws", "Food Wrappers"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE003",
            state: "Sabah",
            river_basin: "Sungai Petagas",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.65,
            top_pollution_types: ["Plastic Bottles", "Fishing Gear", "Food Wrappers"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE004",
            state: "Johor",
            river_basin: "Sungai Johor",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.58,
            top_pollution_types: ["Plastic Bags", "Plastic Bottles", "Others"],
            last_updated: "2024-10-15T10:30:00Z"
        },
        {
            id: "ZONE005",
            state: "Negeri Sembilan",
            river_basin: "Sungai Linggi",
            season: "Northeast Monsoon",
            predicted_risk_score: 0.45,
            top_pollution_types: ["Food Wrappers", "Plastic Bottles", "Straws"],
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