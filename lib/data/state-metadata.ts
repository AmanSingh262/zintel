/**
 * India States Metadata
 * Contains state information for the interactive map
 */

export interface StateMetadata {
    id: string;
    name: string;
    capital: string;
    gdp: number; // in Crores
    population: number; // in Crores
    literacy: number; // percentage
    area: number; // in sq km
}

export const INDIA_STATES: Record<string, StateMetadata> = {
    "AN": {
        id: "AN",
        name: "Andaman and Nicobar Islands",
        capital: "Port Blair",
        gdp: 4000,
        population: 0.0038,
        literacy: 86.3,
        area: 8249
    },
    "AP": {
        id: "AP",
        name: "Andhra Pradesh",
        capital: "Amaravati",
        gdp: 950000,
        population: 5.28,
        literacy: 67.7,
        area: 160205
    },
    "AR": {
        id: "AR",
        name: "Arunachal Pradesh",
        capital: "Itanagar",
        gdp: 23000,
        population: 0.0147,
        literacy: 66.9,
        area: 83743
    },
    "AS": {
        id: "AS",
        name: "Assam",
        capital: "Dispur",
        gdp: 400000,
        population: 3.52,
        literacy: 73.2,
        area: 78438
    },
    "BR": {
        id: "BR",
        name: "Bihar",
        capital: "Patna",
        gdp: 650000,
        population: 12.4,
        literacy: 63.8,
        area: 94163
    },
    "CH": {
        id: "CH",
        name: "Chandigarh",
        capital: "Chandigarh",
        gdp: 35000,
        population: 0.0115,
        literacy: 86.4,
        area: 114
    },
    "CT": {
        id: "CT",
        name: "Chhattisgarh",
        capital: "Raipur",
        gdp: 400000,
        population: 2.96,
        literacy: 71.0,
        area: 135192
    },
    "DN": {
        id: "DN",
        name: "Dadra and Nagar Haveli and Daman and Diu",
        capital: "Daman",
        gdp: 8000,
        population: 0.0059,
        literacy: 87.1,
        area: 603
    },
    "DL": {
        id: "DL",
        name: "Delhi",
        capital: "New Delhi",
        gdp: 850000,
        population: 1.89,
        literacy: 86.3,
        area: 1484
    },
    "GA": {
        id: "GA",
        name: "Goa",
        capital: "Panaji",
        gdp: 75000,
        population: 0.0157,
        literacy: 87.4,
        area: 3702
    },
    "GJ": {
        id: "GJ",
        name: "Gujarat",
        capital: "Gandhinagar",
        gdp: 1800000,
        population: 6.86,
        literacy: 79.3,
        area: 196244
    },
    "HR": {
        id: "HR",
        name: "Haryana",
        capital: "Chandigarh",
        gdp: 850000,
        population: 2.88,
        literacy: 76.6,
        area: 44212
    },
    "HP": {
        id: "HP",
        name: "Himachal Pradesh",
        capital: "Shimla",
        gdp: 170000,
        population: 0.0728,
        literacy: 83.8,
        area: 55673
    },
    "JK": {
        id: "JK",
        name: "Jammu and Kashmir",
        capital: "Srinagar (Summer), Jammu (Winter)",
        gdp: 180000,
        population: 1.35,
        literacy: 68.7,
        area: 42241
    },
    "JH": {
        id: "JH",
        name: "Jharkhand",
        capital: "Ranchi",
        gdp: 350000,
        population: 3.79,
        literacy: 67.6,
        area: 79716
    },
    "KA": {
        id: "KA",
        name: "Karnataka",
        capital: "Bengaluru",
        gdp: 1900000,
        population: 6.73,
        literacy: 75.6,
        area: 191791
    },
    "KL": {
        id: "KL",
        name: "Kerala",
        capital: "Thiruvananthapuram",
        gdp: 850000,
        population: 3.49,
        literacy: 93.9,
        area: 38852
    },
    "LA": {
        id: "LA",
        name: "Ladakh",
        capital: "Leh",
        gdp: 5000,
        population: 0.0029,
        literacy: 77.2,
        area: 59146
    },
    "LD": {
        id: "LD",
        name: "Lakshadweep",
        capital: "Kavaratti",
        gdp: 1500,
        population: 0.00064,
        literacy: 92.3,
        area: 32
    },
    "MP": {
        id: "MP",
        name: "Madhya Pradesh",
        capital: "Bhopal",
        gdp: 950000,
        population: 8.52,
        literacy: 70.6,
        area: 308245
    },
    "MH": {
        id: "MH",
        name: "Maharashtra",
        capital: "Mumbai",
        gdp: 3500000,
        population: 12.4,
        literacy: 82.9,
        area: 307713
    },
    "MN": {
        id: "MN",
        name: "Manipur",
        capital: "Imphal",
        gdp: 30000,
        population: 0.0307,
        literacy: 79.8,
        area: 22327
    },
    "ML": {
        id: "ML",
        name: "Meghalaya",
        capital: "Shillong",
        gdp: 35000,
        population: 0.0327,
        literacy: 75.5,
        area: 22429
    },
    "MZ": {
        id: "MZ",
        name: "Mizoram",
        capital: "Aizawl",
        gdp: 20000,
        population: 0.0123,
        literacy: 91.6,
        area: 21081
    },
    "NL": {
        id: "NL",
        name: "Nagaland",
        capital: "Kohima",
        gdp: 25000,
        population: 0.0219,
        literacy: 80.1,
        area: 16579
    },
    "OR": {
        id: "OR",
        name: "Odisha",
        capital: "Bhubaneswar",
        gdp: 550000,
        population: 4.60,
        literacy: 73.5,
        area: 155707
    },
    "PY": {
        id: "PY",
        name: "Puducherry",
        capital: "Puducherry",
        gdp: 35000,
        population: 0.0156,
        literacy: 86.5,
        area: 490
    },
    "PB": {
        id: "PB",
        name: "Punjab",
        capital: "Chandigarh",
        gdp: 550000,
        population: 3.01,
        literacy: 76.7,
        area: 50362
    },
    "RJ": {
        id: "RJ",
        name: "Rajasthan",
        capital: "Jaipur",
        gdp: 1100000,
        population: 8.15,
        literacy: 67.1,
        area: 342239
    },
    "SK": {
        id: "SK",
        name: "Sikkim",
        capital: "Gangtok",
        gdp: 35000,
        population: 0.0069,
        literacy: 82.2,
        area: 7096
    },
    "TN": {
        id: "TN",
        name: "Tamil Nadu",
        capital: "Chennai",
        gdp: 2100000,
        population: 7.72,
        literacy: 80.3,
        area: 130060
    },
    "TG": {
        id: "TG",
        name: "Telangana",
        capital: "Hyderabad",
        gdp: 1100000,
        population: 3.95,
        literacy: 66.5,
        area: 112077
    },
    "TR": {
        id: "TR",
        name: "Tripura",
        capital: "Agartala",
        gdp: 45000,
        population: 0.0408,
        literacy: 87.8,
        area: 10486
    },
    "UP": {
        id: "UP",
        name: "Uttar Pradesh",
        capital: "Lucknow",
        gdp: 2100000,
        population: 23.8,
        literacy: 69.7,
        area: 240928
    },
    "UT": {
        id: "UT",
        name: "Uttarakhand",
        capital: "Dehradun (Winter), Gairsain (Summer)",
        gdp: 250000,
        population: 1.14,
        literacy: 79.6,
        area: 53483
    },
    "WB": {
        id: "WB",
        name: "West Bengal",
        capital: "Kolkata",
        gdp: 1400000,
        population: 10.0,
        literacy: 77.1,
        area: 88752
    }
};

/**
 * Get state metadata by ID
 */
export const getStateMetadata = (stateId: string): StateMetadata | undefined => {
    return INDIA_STATES[stateId];
};

/**
 * Get all states as array
 */
export const getAllStates = (): StateMetadata[] => {
    return Object.values(INDIA_STATES);
};
