export type TripTag =
  | "Beach"
  | "City"
  | "Nature"
  | "Culture"
  | "Food"
  | "Nightlife"
  | "Adventure"
  | "Romantic"
  | "Family"
  | "Budget"
  | "Luxury";

export type Destination = {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  airportCode: string;
  region: string;
  latitude: number;
  longitude: number;
  tags: TripTag[];
  recommendedTripDays: [number, number];
  stayCostLow: number;
  stayCostHigh: number;
  localDailyCostLow: number;
  localDailyCostHigh: number;
  seasonTags: string[];
  popularityScore: number;
  shortDescription: string;
  image: string;
  imageAlt: string;
  imageCredit?: string;
  heroImage?: string;
  heroImageAlt?: string;
  gallery?: DestinationPhoto[];
  guide?: DestinationGuide;
};

export type DestinationPhoto = {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
};

export type DestinationGuide = {
  overview: string[];
  highlights: {
    name: string;
    description: string;
  }[];
  foods: {
    name: string;
    description: string;
  }[];
  culture: string[];
  practicalTips?: string[];
};

export type VisaStatus =
  | "visa_free"
  | "eta"
  | "visa_on_arrival"
  | "evisa"
  | "visa_required"
  | "unknown";

export type VisaRule = {
  passportCountry: string;
  destinationCountryCode: string;
  status: VisaStatus;
  maxStayDays: number | null;
  officialSourceUrl: string;
  lastVerifiedAt: string;
};

export type Passport = {
  id: string;
  name: string;
  countryCode: string;
  flag: string;
};

export type Origin = {
  name: string;
  iata: string;
  city: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  enabled: true;
};

export type Airport = {
  iata: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  cityCode?: string;
};

export type FlightCache = {
  originIata: string;
  destinationAirportCode: string;
  low: number;
  high: number;
  source: string;
  estimateType: "observed" | "planning";
  observedAt?: string;
  cachedAt?: string;
};

export const passports = [
  { id: "united-states", name: "United States", countryCode: "US", flag: "🇺🇸" },
  { id: "united-kingdom", name: "United Kingdom", countryCode: "GB", flag: "🇬🇧" },
  { id: "canada", name: "Canada", countryCode: "CA", flag: "🇨🇦" },
  { id: "australia", name: "Australia", countryCode: "AU", flag: "🇦🇺" },
  { id: "india", name: "India", countryCode: "IN", flag: "🇮🇳" },
  { id: "china", name: "China", countryCode: "CN", flag: "🇨🇳" },
  { id: "germany", name: "Germany", countryCode: "DE", flag: "🇩🇪" },
  { id: "france", name: "France", countryCode: "FR", flag: "🇫🇷" },
  { id: "spain", name: "Spain", countryCode: "ES", flag: "🇪🇸" },
  { id: "netherlands", name: "Netherlands", countryCode: "NL", flag: "🇳🇱" },
  { id: "japan", name: "Japan", countryCode: "JP", flag: "🇯🇵" },
  { id: "south-korea", name: "South Korea", countryCode: "KR", flag: "🇰🇷" },
  { id: "singapore", name: "Singapore", countryCode: "SG", flag: "🇸🇬" },
  { id: "united-arab-emirates", name: "United Arab Emirates", countryCode: "AE", flag: "🇦🇪" },
  { id: "saudi-arabia", name: "Saudi Arabia", countryCode: "SA", flag: "🇸🇦" },
] as const satisfies readonly Passport[];

export const supportedFareOrigins = [
  ["NYC", "New York", "New York", "United States", "US", 40.7128, -74.006],
  ["LAX", "Los Angeles", "Los Angeles", "United States", "US", 34.0522, -118.2437],
  ["SFO", "San Francisco", "San Francisco", "United States", "US", 37.7749, -122.4194],
  ["CHI", "Chicago", "Chicago", "United States", "US", 41.8781, -87.6298],
  ["YTO", "Toronto", "Toronto", "Canada", "CA", 43.6532, -79.3832],
  ["YVR", "Vancouver", "Vancouver", "Canada", "CA", 49.2827, -123.1207],
  ["MEX", "Mexico City", "Mexico City", "Mexico", "MX", 19.4326, -99.1332],
  ["LON", "London", "London", "United Kingdom", "GB", 51.5072, -0.1276],
  ["PAR", "Paris", "Paris", "France", "FR", 48.8566, 2.3522],
  ["AMS", "Amsterdam", "Amsterdam", "Netherlands", "NL", 52.3676, 4.9041],
  ["FRA", "Frankfurt", "Frankfurt", "Germany", "DE", 50.1109, 8.6821],
  ["MAD", "Madrid", "Madrid", "Spain", "ES", 40.4168, -3.7038],
  ["ROM", "Rome", "Rome", "Italy", "IT", 41.9028, 12.4964],
  ["LIS", "Lisbon", "Lisbon", "Portugal", "PT", 38.7223, -9.1393],
  ["TYO", "Tokyo", "Tokyo", "Japan", "JP", 35.6762, 139.6503],
  ["SEL", "Seoul", "Seoul", "South Korea", "KR", 37.5665, 126.978],
  ["SIN", "Singapore", "Singapore", "Singapore", "SG", 1.3521, 103.8198],
  ["BKK", "Bangkok", "Bangkok", "Thailand", "TH", 13.7563, 100.5018],
  ["HKG", "Hong Kong", "Hong Kong", "Hong Kong", "HK", 22.3193, 114.1694],
  ["TPE", "Taipei", "Taipei", "Taiwan", "TW", 25.033, 121.5654],
  ["DEL", "Delhi", "Delhi", "India", "IN", 28.6139, 77.209],
  ["BOM", "Mumbai", "Mumbai", "India", "IN", 19.076, 72.8777],
  ["DXB", "Dubai", "Dubai", "United Arab Emirates", "AE", 25.2048, 55.2708],
  ["RUH", "Riyadh", "Riyadh", "Saudi Arabia", "SA", 24.7136, 46.6753],
  ["SYD", "Sydney", "Sydney", "Australia", "AU", -33.8688, 151.2093],
  ["MEL", "Melbourne", "Melbourne", "Australia", "AU", -37.8136, 144.9631],
] as const satisfies readonly [
  string,
  string,
  string,
  string,
  string,
  number,
  number,
][];

export const origins: Origin[] = supportedFareOrigins.map(
  ([iata, name, city, country, countryCode, latitude, longitude]) => ({
    iata,
    name,
    city,
    country,
    countryCode,
    latitude,
    longitude,
    enabled: true,
  }),
);

const airportRows = [
  ["JFK", "John F. Kennedy International Airport", "New York", "United States", "US", 40.6413, -73.7781, "NYC"],
  ["EWR", "Newark Liberty International Airport", "New York", "United States", "US", 40.6895, -74.1745, "NYC"],
  ["LGA", "LaGuardia Airport", "New York", "United States", "US", 40.7769, -73.874, "NYC"],
  ["LAX", "Los Angeles International Airport", "Los Angeles", "United States", "US", 33.9416, -118.4085, "LAX"],
  ["SFO", "San Francisco International Airport", "San Francisco", "United States", "US", 37.6213, -122.379, "SFO"],
  ["ORD", "O'Hare International Airport", "Chicago", "United States", "US", 41.9742, -87.9073, "CHI"],
  ["ATL", "Hartsfield-Jackson Atlanta International Airport", "Atlanta", "United States", "US", 33.6407, -84.4277],
  ["DFW", "Dallas Fort Worth International Airport", "Dallas", "United States", "US", 32.8998, -97.0403],
  ["MIA", "Miami International Airport", "Miami", "United States", "US", 25.7959, -80.287],
  ["SEA", "Seattle-Tacoma International Airport", "Seattle", "United States", "US", 47.4502, -122.3088],
  ["BOS", "Boston Logan International Airport", "Boston", "United States", "US", 42.3656, -71.0096],
  ["LAS", "Harry Reid International Airport", "Las Vegas", "United States", "US", 36.084, -115.1537],
  ["DEN", "Denver International Airport", "Denver", "United States", "US", 39.8561, -104.6737],
  ["IAD", "Washington Dulles International Airport", "Washington", "United States", "US", 38.9531, -77.4565],
  ["YYZ", "Toronto Pearson International Airport", "Toronto", "Canada", "CA", 43.6777, -79.6248, "YTO"],
  ["YTZ", "Billy Bishop Toronto City Airport", "Toronto", "Canada", "CA", 43.6275, -79.3962, "YTO"],
  ["YVR", "Vancouver International Airport", "Vancouver", "Canada", "CA", 49.1967, -123.1815, "YVR"],
  ["YUL", "Montreal-Trudeau International Airport", "Montreal", "Canada", "CA", 45.4706, -73.7408],
  ["MEX", "Mexico City International Airport", "Mexico City", "Mexico", "MX", 19.4361, -99.0719, "MEX"],
  ["CUN", "Cancun International Airport", "Cancun", "Mexico", "MX", 21.0365, -86.8771],
  ["LHR", "Heathrow Airport", "London", "United Kingdom", "GB", 51.47, -0.4543, "LON"],
  ["LGW", "Gatwick Airport", "London", "United Kingdom", "GB", 51.1537, -0.1821, "LON"],
  ["STN", "Stansted Airport", "London", "United Kingdom", "GB", 51.886, 0.2389, "LON"],
  ["CDG", "Charles de Gaulle Airport", "Paris", "France", "FR", 49.0097, 2.5479, "PAR"],
  ["ORY", "Paris Orly Airport", "Paris", "France", "FR", 48.7262, 2.3652, "PAR"],
  ["AMS", "Amsterdam Schiphol Airport", "Amsterdam", "Netherlands", "NL", 52.3105, 4.7683, "AMS"],
  ["FRA", "Frankfurt Airport", "Frankfurt", "Germany", "DE", 50.0379, 8.5622, "FRA"],
  ["MUC", "Munich Airport", "Munich", "Germany", "DE", 48.3538, 11.7861],
  ["BER", "Berlin Brandenburg Airport", "Berlin", "Germany", "DE", 52.3667, 13.5033],
  ["MAD", "Adolfo Suarez Madrid-Barajas Airport", "Madrid", "Spain", "ES", 40.4983, -3.5676, "MAD"],
  ["BCN", "Barcelona-El Prat Airport", "Barcelona", "Spain", "ES", 41.2974, 2.0833],
  ["FCO", "Leonardo da Vinci-Fiumicino Airport", "Rome", "Italy", "IT", 41.8003, 12.2389, "ROM"],
  ["CIA", "Rome Ciampino Airport", "Rome", "Italy", "IT", 41.7999, 12.5949, "ROM"],
  ["LIS", "Humberto Delgado Airport", "Lisbon", "Portugal", "PT", 38.7742, -9.1342, "LIS"],
  ["ATH", "Athens International Airport", "Athens", "Greece", "GR", 37.9364, 23.9445],
  ["IST", "Istanbul Airport", "Istanbul", "Turkey", "TR", 41.2753, 28.7519],
  ["SAW", "Sabiha Gokcen International Airport", "Istanbul", "Turkey", "TR", 40.8986, 29.3092],
  ["DUB", "Dublin Airport", "Dublin", "Ireland", "IE", 53.4213, -6.2701],
  ["CPH", "Copenhagen Airport", "Copenhagen", "Denmark", "DK", 55.618, 12.6508],
  ["ARN", "Stockholm Arlanda Airport", "Stockholm", "Sweden", "SE", 59.6519, 17.9186],
  ["OSL", "Oslo Airport", "Oslo", "Norway", "NO", 60.1976, 11.1004],
  ["ZRH", "Zurich Airport", "Zurich", "Switzerland", "CH", 47.4581, 8.5555],
  ["VIE", "Vienna International Airport", "Vienna", "Austria", "AT", 48.1103, 16.5697],
  ["PRG", "Vaclav Havel Airport Prague", "Prague", "Czechia", "CZ", 50.1008, 14.26],
  ["BUD", "Budapest Ferenc Liszt International Airport", "Budapest", "Hungary", "HU", 47.4385, 19.2523],
  ["WAW", "Warsaw Chopin Airport", "Warsaw", "Poland", "PL", 52.1657, 20.9671],
  ["NRT", "Narita International Airport", "Tokyo", "Japan", "JP", 35.772, 140.3929, "TYO"],
  ["HND", "Haneda Airport", "Tokyo", "Japan", "JP", 35.5494, 139.7798, "TYO"],
  ["KIX", "Kansai International Airport", "Osaka", "Japan", "JP", 34.4347, 135.244],
  ["ICN", "Incheon International Airport", "Seoul", "South Korea", "KR", 37.4602, 126.4407, "SEL"],
  ["GMP", "Gimpo International Airport", "Seoul", "South Korea", "KR", 37.5583, 126.7906, "SEL"],
  ["SIN", "Singapore Changi Airport", "Singapore", "Singapore", "SG", 1.3644, 103.9915, "SIN"],
  ["BKK", "Suvarnabhumi Airport", "Bangkok", "Thailand", "TH", 13.69, 100.7501, "BKK"],
  ["DMK", "Don Mueang International Airport", "Bangkok", "Thailand", "TH", 13.9126, 100.6067, "BKK"],
  ["HKG", "Hong Kong International Airport", "Hong Kong", "Hong Kong", "HK", 22.308, 113.9185, "HKG"],
  ["TPE", "Taiwan Taoyuan International Airport", "Taipei", "Taiwan", "TW", 25.0797, 121.2342, "TPE"],
  ["TSA", "Taipei Songshan Airport", "Taipei", "Taiwan", "TW", 25.0697, 121.5525, "TPE"],
  ["RMQ", "Taichung International Airport", "Taichung", "Taiwan", "TW", 24.2647, 120.6217],
  ["KHH", "Kaohsiung International Airport", "Kaohsiung", "Taiwan", "TW", 22.5771, 120.3502],
  ["PEK", "Beijing Capital International Airport", "Beijing", "China", "CN", 40.0799, 116.6031],
  ["PKX", "Beijing Daxing International Airport", "Beijing", "China", "CN", 39.5098, 116.4105],
  ["PVG", "Shanghai Pudong International Airport", "Shanghai", "China", "CN", 31.1443, 121.8083],
  ["SHA", "Shanghai Hongqiao International Airport", "Shanghai", "China", "CN", 31.1979, 121.3363],
  ["CAN", "Guangzhou Baiyun International Airport", "Guangzhou", "China", "CN", 23.3924, 113.2988],
  ["SZX", "Shenzhen Bao'an International Airport", "Shenzhen", "China", "CN", 22.6393, 113.8107],
  ["CTU", "Chengdu Shuangliu International Airport", "Chengdu", "China", "CN", 30.5785, 103.9471],
  ["TFU", "Chengdu Tianfu International Airport", "Chengdu", "China", "CN", 30.3125, 104.441],
  ["DEL", "Indira Gandhi International Airport", "Delhi", "India", "IN", 28.5562, 77.1, "DEL"],
  ["BOM", "Chhatrapati Shivaji Maharaj International Airport", "Mumbai", "India", "IN", 19.0896, 72.8656, "BOM"],
  ["BLR", "Kempegowda International Airport", "Bengaluru", "India", "IN", 13.1986, 77.7066],
  ["MAA", "Chennai International Airport", "Chennai", "India", "IN", 12.9941, 80.1709],
  ["HYD", "Rajiv Gandhi International Airport", "Hyderabad", "India", "IN", 17.2403, 78.4294],
  ["CCU", "Netaji Subhas Chandra Bose International Airport", "Kolkata", "India", "IN", 22.6547, 88.4467],
  ["DXB", "Dubai International Airport", "Dubai", "United Arab Emirates", "AE", 25.2532, 55.3657, "DXB"],
  ["AUH", "Zayed International Airport", "Abu Dhabi", "United Arab Emirates", "AE", 24.4539, 54.3773],
  ["DOH", "Hamad International Airport", "Doha", "Qatar", "QA", 25.2731, 51.6081],
  ["RUH", "King Khalid International Airport", "Riyadh", "Saudi Arabia", "SA", 24.9576, 46.6988, "RUH"],
  ["JED", "King Abdulaziz International Airport", "Jeddah", "Saudi Arabia", "SA", 21.6702, 39.1528],
  ["SYD", "Sydney Kingsford Smith Airport", "Sydney", "Australia", "AU", -33.9399, 151.1753, "SYD"],
  ["MEL", "Melbourne Airport", "Melbourne", "Australia", "AU", -37.669, 144.841, "MEL"],
  ["BNE", "Brisbane Airport", "Brisbane", "Australia", "AU", -27.3842, 153.1175],
  ["PER", "Perth Airport", "Perth", "Australia", "AU", -31.9403, 115.9669],
  ["AKL", "Auckland Airport", "Auckland", "New Zealand", "NZ", -37.0082, 174.785],
  ["CHC", "Christchurch Airport", "Christchurch", "New Zealand", "NZ", -43.4894, 172.5322],
  ["DPS", "I Gusti Ngurah Rai International Airport", "Bali", "Indonesia", "ID", -8.7482, 115.167],
  ["CGK", "Soekarno-Hatta International Airport", "Jakarta", "Indonesia", "ID", -6.1275, 106.6537],
  ["KUL", "Kuala Lumpur International Airport", "Kuala Lumpur", "Malaysia", "MY", 2.7456, 101.7072],
  ["MNL", "Ninoy Aquino International Airport", "Manila", "Philippines", "PH", 14.5086, 121.0198],
  ["HAN", "Noi Bai International Airport", "Hanoi", "Vietnam", "VN", 21.2187, 105.8072],
  ["SGN", "Tan Son Nhat International Airport", "Ho Chi Minh City", "Vietnam", "VN", 10.8188, 106.6519],
  ["PNH", "Phnom Penh International Airport", "Phnom Penh", "Cambodia", "KH", 11.5466, 104.8441],
  ["CMB", "Bandaranaike International Airport", "Colombo", "Sri Lanka", "LK", 7.1808, 79.8841],
  ["MLE", "Velana International Airport", "Malé", "Maldives", "MV", 4.1918, 73.5291],
  ["KTM", "Tribhuvan International Airport", "Kathmandu", "Nepal", "NP", 27.6966, 85.3591],
  ["TLV", "Ben Gurion Airport", "Tel Aviv", "Israel", "IL", 32.0114, 34.8867],
  ["AMM", "Queen Alia International Airport", "Amman", "Jordan", "JO", 31.7226, 35.9932],
  ["CAI", "Cairo International Airport", "Cairo", "Egypt", "EG", 30.112, 31.400],
  ["CMN", "Mohammed V International Airport", "Casablanca", "Morocco", "MA", 33.3675, -7.5898],
  ["RAK", "Marrakesh Menara Airport", "Marrakesh", "Morocco", "MA", 31.6069, -8.0363],
  ["NBO", "Jomo Kenyatta International Airport", "Nairobi", "Kenya", "KE", -1.3192, 36.9278],
  ["CPT", "Cape Town International Airport", "Cape Town", "South Africa", "ZA", -33.9715, 18.6021],
  ["JNB", "O. R. Tambo International Airport", "Johannesburg", "South Africa", "ZA", -26.1337, 28.242],
  ["GRU", "Sao Paulo-Guarulhos International Airport", "Sao Paulo", "Brazil", "BR", -23.4356, -46.4731],
  ["GIG", "Rio de Janeiro-Galeao International Airport", "Rio de Janeiro", "Brazil", "BR", -22.8099, -43.2506],
  ["EZE", "Ministro Pistarini International Airport", "Buenos Aires", "Argentina", "AR", -34.8222, -58.5358],
  ["SCL", "Santiago International Airport", "Santiago", "Chile", "CL", -33.3928, -70.7858],
  ["LIM", "Jorge Chavez International Airport", "Lima", "Peru", "PE", -12.0219, -77.1143],
  ["BOG", "El Dorado International Airport", "Bogota", "Colombia", "CO", 4.7016, -74.1469],
  ["CTG", "Rafael Nunez International Airport", "Cartagena", "Colombia", "CO", 10.4424, -75.513],
  ["MDE", "Jose Maria Cordova International Airport", "Medellin", "Colombia", "CO", 6.1645, -75.4231],
] as const;

export const airports: Airport[] = airportRows.map(
  ([iata, name, city, country, countryCode, latitude, longitude, cityCode]) => ({
    iata: String(iata),
    name: String(name),
    city: String(city),
    country: String(country),
    countryCode: String(countryCode),
    latitude: Number(latitude),
    longitude: Number(longitude),
    cityCode: cityCode ? String(cityCode) : undefined,
  }),
);

export const tripTags: TripTag[] = [
  "Beach",
  "City",
  "Nature",
  "Culture",
  "Food",
  "Nightlife",
  "Adventure",
  "Romantic",
  "Family",
  "Budget",
  "Luxury",
];

const destinationRecords: Array<
  Omit<Destination, "image" | "imageAlt" | "imageCredit">
> = [
  {
    id: "tokyo",
    city: "Tokyo",
    country: "Japan",
    countryCode: "JP",
    airportCode: "TYO",
    region: "East Asia",
    latitude: 35.6762,
    longitude: 139.6503,
    tags: ["City", "Food", "Culture", "Family"],
    recommendedTripDays: [5, 9],
    stayCostLow: 95,
    stayCostHigh: 160,
    localDailyCostLow: 55,
    localDailyCostHigh: 95,
    seasonTags: ["spring", "autumn"],
    popularityScore: 98,
    shortDescription:
      "Dense neighborhoods, excellent transit, food markets, temples, and modern city energy.",
  },
  {
    id: "bangkok",
    city: "Bangkok",
    country: "Thailand",
    countryCode: "TH",
    airportCode: "BKK",
    region: "Southeast Asia",
    latitude: 13.7563,
    longitude: 100.5018,
    tags: ["City", "Food", "Nightlife", "Budget"],
    recommendedTripDays: [4, 8],
    stayCostLow: 45,
    stayCostHigh: 95,
    localDailyCostLow: 28,
    localDailyCostHigh: 55,
    seasonTags: ["winter", "shoulder"],
    popularityScore: 97,
    shortDescription:
      "Street food, temples, river ferries, markets, and a strong value-for-money base.",
  },
  {
    id: "mexico-city",
    city: "Mexico City",
    country: "Mexico",
    countryCode: "MX",
    airportCode: "MEX",
    region: "North America",
    latitude: 19.4326,
    longitude: -99.1332,
    tags: ["City", "Culture", "Food", "Budget"],
    recommendedTripDays: [4, 7],
    stayCostLow: 55,
    stayCostHigh: 110,
    localDailyCostLow: 32,
    localDailyCostHigh: 65,
    seasonTags: ["spring", "autumn", "winter"],
    popularityScore: 96,
    shortDescription:
      "Museums, architecture, markets, and world-class food with comparatively moderate daily costs.",
  },
  {
    id: "cancun",
    city: "Cancun",
    country: "Mexico",
    countryCode: "MX",
    airportCode: "CUN",
    region: "Caribbean",
    latitude: 21.1619,
    longitude: -86.8515,
    tags: ["Beach", "Family", "Nightlife", "Luxury"],
    recommendedTripDays: [4, 7],
    stayCostLow: 85,
    stayCostHigh: 190,
    localDailyCostLow: 45,
    localDailyCostHigh: 95,
    seasonTags: ["winter", "spring"],
    popularityScore: 93,
    shortDescription:
      "A beach-forward base for resorts, nightlife, and day trips to the Riviera Maya.",
  },
  {
    id: "lisbon",
    city: "Lisbon",
    country: "Portugal",
    countryCode: "PT",
    airportCode: "LIS",
    region: "Europe",
    latitude: 38.7223,
    longitude: -9.1393,
    tags: ["City", "Culture", "Food", "Romantic"],
    recommendedTripDays: [4, 7],
    stayCostLow: 85,
    stayCostHigh: 155,
    localDailyCostLow: 45,
    localDailyCostHigh: 80,
    seasonTags: ["spring", "autumn"],
    popularityScore: 95,
    shortDescription:
      "Tile-lined streets, viewpoints, seafood, trams, and easy day trips to Sintra or Cascais.",
  },
  {
    id: "barcelona",
    city: "Barcelona",
    country: "Spain",
    countryCode: "ES",
    airportCode: "BCN",
    region: "Europe",
    latitude: 41.3874,
    longitude: 2.1686,
    tags: ["Beach", "City", "Culture", "Nightlife"],
    recommendedTripDays: [4, 7],
    stayCostLow: 105,
    stayCostHigh: 190,
    localDailyCostLow: 55,
    localDailyCostHigh: 95,
    seasonTags: ["spring", "summer", "autumn"],
    popularityScore: 96,
    shortDescription:
      "Gaudi architecture, beaches, tapas, late nights, and walkable neighborhoods.",
  },
  {
    id: "rome",
    city: "Rome",
    country: "Italy",
    countryCode: "IT",
    airportCode: "ROM",
    region: "Europe",
    latitude: 41.9028,
    longitude: 12.4964,
    tags: ["City", "Culture", "Food", "Romantic"],
    recommendedTripDays: [4, 7],
    stayCostLow: 100,
    stayCostHigh: 180,
    localDailyCostLow: 55,
    localDailyCostHigh: 95,
    seasonTags: ["spring", "autumn"],
    popularityScore: 95,
    shortDescription:
      "Ancient sites, piazzas, trattorias, churches, and classic city-break appeal.",
  },
  {
    id: "paris",
    city: "Paris",
    country: "France",
    countryCode: "FR",
    airportCode: "PAR",
    region: "Europe",
    latitude: 48.8566,
    longitude: 2.3522,
    tags: ["City", "Culture", "Food", "Romantic", "Luxury"],
    recommendedTripDays: [4, 7],
    stayCostLow: 125,
    stayCostHigh: 230,
    localDailyCostLow: 65,
    localDailyCostHigh: 120,
    seasonTags: ["spring", "autumn", "winter"],
    popularityScore: 97,
    shortDescription:
      "Museums, cafes, landmarks, neighborhoods, and high cultural density.",
  },
  {
    id: "athens",
    city: "Athens",
    country: "Greece",
    countryCode: "GR",
    airportCode: "ATH",
    region: "Europe",
    latitude: 37.9838,
    longitude: 23.7275,
    tags: ["City", "Culture", "Food", "Budget"],
    recommendedTripDays: [4, 7],
    stayCostLow: 75,
    stayCostHigh: 140,
    localDailyCostLow: 42,
    localDailyCostHigh: 75,
    seasonTags: ["spring", "autumn"],
    popularityScore: 91,
    shortDescription:
      "Ancient history, lively neighborhoods, Greek food, and ferry connections.",
  },
  {
    id: "istanbul",
    city: "Istanbul",
    country: "Turkey",
    countryCode: "TR",
    airportCode: "IST",
    region: "Europe / Asia",
    latitude: 41.0082,
    longitude: 28.9784,
    tags: ["City", "Culture", "Food", "Budget"],
    recommendedTripDays: [4, 7],
    stayCostLow: 55,
    stayCostHigh: 120,
    localDailyCostLow: 30,
    localDailyCostHigh: 65,
    seasonTags: ["spring", "autumn"],
    popularityScore: 94,
    shortDescription:
      "Mosques, markets, ferries, layered history, and strong value for city travelers.",
  },
  {
    id: "seoul",
    city: "Seoul",
    country: "South Korea",
    countryCode: "KR",
    airportCode: "SEL",
    region: "East Asia",
    latitude: 37.5665,
    longitude: 126.978,
    tags: ["City", "Food", "Culture", "Nightlife"],
    recommendedTripDays: [5, 8],
    stayCostLow: 85,
    stayCostHigh: 150,
    localDailyCostLow: 45,
    localDailyCostHigh: 85,
    seasonTags: ["spring", "autumn"],
    popularityScore: 94,
    shortDescription:
      "Markets, palaces, cafes, K-culture districts, and efficient city transit.",
  },
  {
    id: "singapore",
    city: "Singapore",
    country: "Singapore",
    countryCode: "SG",
    airportCode: "SIN",
    region: "Southeast Asia",
    latitude: 1.3521,
    longitude: 103.8198,
    tags: ["City", "Food", "Family", "Luxury"],
    recommendedTripDays: [3, 5],
    stayCostLow: 115,
    stayCostHigh: 230,
    localDailyCostLow: 60,
    localDailyCostHigh: 115,
    seasonTags: ["year-round"],
    popularityScore: 93,
    shortDescription:
      "A polished city stop with hawker centers, gardens, shopping, and easy logistics.",
  },
  {
    id: "bali",
    city: "Bali",
    country: "Indonesia",
    countryCode: "ID",
    airportCode: "DPS",
    region: "Southeast Asia",
    latitude: -8.3405,
    longitude: 115.092,
    tags: ["Beach", "Nature", "Romantic", "Budget"],
    recommendedTripDays: [5, 10],
    stayCostLow: 45,
    stayCostHigh: 130,
    localDailyCostLow: 28,
    localDailyCostHigh: 65,
    seasonTags: ["dry season", "shoulder"],
    popularityScore: 95,
    shortDescription:
      "Beaches, temples, rice terraces, villas, cafes, and flexible budgets.",
  },
  {
    id: "ho-chi-minh-city",
    city: "Ho Chi Minh City",
    country: "Vietnam",
    countryCode: "VN",
    airportCode: "SGN",
    region: "Southeast Asia",
    latitude: 10.8231,
    longitude: 106.6297,
    tags: ["City", "Food", "Culture", "Budget"],
    recommendedTripDays: [3, 6],
    stayCostLow: 35,
    stayCostHigh: 85,
    localDailyCostLow: 22,
    localDailyCostHigh: 45,
    seasonTags: ["winter", "spring"],
    popularityScore: 90,
    shortDescription:
      "Street food, markets, cafes, museums, and low local costs.",
  },
  {
    id: "dubai",
    city: "Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
    airportCode: "DXB",
    region: "Middle East",
    latitude: 25.2048,
    longitude: 55.2708,
    tags: ["City", "Luxury", "Family", "Nightlife"],
    recommendedTripDays: [3, 6],
    stayCostLow: 95,
    stayCostHigh: 230,
    localDailyCostLow: 60,
    localDailyCostHigh: 130,
    seasonTags: ["winter"],
    popularityScore: 92,
    shortDescription:
      "Big-city shopping, beaches, desert trips, restaurants, and very easy flight access.",
  },
  {
    id: "marrakesh",
    city: "Marrakesh",
    country: "Morocco",
    countryCode: "MA",
    airportCode: "RAK",
    region: "North Africa",
    latitude: 31.6295,
    longitude: -7.9811,
    tags: ["Culture", "Food", "Romantic", "Budget"],
    recommendedTripDays: [4, 6],
    stayCostLow: 50,
    stayCostHigh: 120,
    localDailyCostLow: 28,
    localDailyCostHigh: 60,
    seasonTags: ["spring", "autumn", "winter"],
    popularityScore: 89,
    shortDescription:
      "Riads, souks, gardens, rooftop dining, and desert-side atmosphere.",
  },
  {
    id: "london",
    city: "London",
    country: "United Kingdom",
    countryCode: "GB",
    airportCode: "LON",
    region: "Europe",
    latitude: 51.5072,
    longitude: -0.1276,
    tags: ["City", "Culture", "Food", "Family"],
    recommendedTripDays: [4, 7],
    stayCostLow: 130,
    stayCostHigh: 240,
    localDailyCostLow: 70,
    localDailyCostHigh: 130,
    seasonTags: ["spring", "summer", "winter"],
    popularityScore: 96,
    shortDescription:
      "Museums, markets, theater, historic neighborhoods, and easy onward rail trips.",
  },
  {
    id: "amsterdam",
    city: "Amsterdam",
    country: "Netherlands",
    countryCode: "NL",
    airportCode: "AMS",
    region: "Europe",
    latitude: 52.3676,
    longitude: 4.9041,
    tags: ["City", "Culture", "Romantic", "Nightlife"],
    recommendedTripDays: [3, 5],
    stayCostLow: 120,
    stayCostHigh: 220,
    localDailyCostLow: 65,
    localDailyCostHigh: 110,
    seasonTags: ["spring", "autumn"],
    popularityScore: 92,
    shortDescription:
      "Canals, museums, cycling, compact neighborhoods, and easy weekend pacing.",
  },
  {
    id: "berlin",
    city: "Berlin",
    country: "Germany",
    countryCode: "DE",
    airportCode: "BER",
    region: "Europe",
    latitude: 52.52,
    longitude: 13.405,
    tags: ["City", "Culture", "Nightlife", "Food"],
    recommendedTripDays: [4, 7],
    stayCostLow: 85,
    stayCostHigh: 160,
    localDailyCostLow: 45,
    localDailyCostHigh: 85,
    seasonTags: ["spring", "summer", "autumn"],
    popularityScore: 91,
    shortDescription:
      "Museums, nightlife, history, parks, and comparatively flexible city costs.",
  },
  {
    id: "prague",
    city: "Prague",
    country: "Czechia",
    countryCode: "CZ",
    airportCode: "PRG",
    region: "Europe",
    latitude: 50.0755,
    longitude: 14.4378,
    tags: ["City", "Culture", "Romantic", "Budget"],
    recommendedTripDays: [3, 5],
    stayCostLow: 65,
    stayCostHigh: 135,
    localDailyCostLow: 35,
    localDailyCostHigh: 70,
    seasonTags: ["spring", "autumn", "winter"],
    popularityScore: 90,
    shortDescription:
      "Historic streets, castles, beer halls, river views, and strong short-break value.",
  },
  {
    id: "budapest",
    city: "Budapest",
    country: "Hungary",
    countryCode: "HU",
    airportCode: "BUD",
    region: "Europe",
    latitude: 47.4979,
    longitude: 19.0402,
    tags: ["City", "Culture", "Nightlife", "Budget"],
    recommendedTripDays: [3, 5],
    stayCostLow: 60,
    stayCostHigh: 125,
    localDailyCostLow: 35,
    localDailyCostHigh: 70,
    seasonTags: ["spring", "autumn", "winter"],
    popularityScore: 90,
    shortDescription:
      "Thermal baths, architecture, ruin bars, river views, and budget-friendly city days.",
  },
  {
    id: "copenhagen",
    city: "Copenhagen",
    country: "Denmark",
    countryCode: "DK",
    airportCode: "CPH",
    region: "Europe",
    latitude: 55.6761,
    longitude: 12.5683,
    tags: ["City", "Food", "Family", "Luxury"],
    recommendedTripDays: [3, 5],
    stayCostLow: 125,
    stayCostHigh: 230,
    localDailyCostLow: 75,
    localDailyCostHigh: 135,
    seasonTags: ["summer", "winter"],
    popularityScore: 86,
    shortDescription:
      "Design, canals, cycling, food halls, and easygoing family-friendly city time.",
  },
  {
    id: "dublin",
    city: "Dublin",
    country: "Ireland",
    countryCode: "IE",
    airportCode: "DUB",
    region: "Europe",
    latitude: 53.3498,
    longitude: -6.2603,
    tags: ["City", "Culture", "Food", "Nightlife"],
    recommendedTripDays: [3, 5],
    stayCostLow: 115,
    stayCostHigh: 220,
    localDailyCostLow: 65,
    localDailyCostHigh: 115,
    seasonTags: ["spring", "summer", "autumn"],
    popularityScore: 87,
    shortDescription:
      "Pubs, literary history, museums, music, and nearby coastal day trips.",
  },
  {
    id: "new-york",
    city: "New York",
    country: "United States",
    countryCode: "US",
    airportCode: "NYC",
    region: "North America",
    latitude: 40.7128,
    longitude: -74.006,
    tags: ["City", "Culture", "Food", "Nightlife"],
    recommendedTripDays: [4, 7],
    stayCostLow: 150,
    stayCostHigh: 280,
    localDailyCostLow: 80,
    localDailyCostHigh: 150,
    seasonTags: ["spring", "autumn", "winter"],
    popularityScore: 97,
    shortDescription:
      "Museums, restaurants, shows, neighborhoods, and nonstop urban energy.",
  },
  {
    id: "miami",
    city: "Miami",
    country: "United States",
    countryCode: "US",
    airportCode: "MIA",
    region: "North America",
    latitude: 25.7617,
    longitude: -80.1918,
    tags: ["Beach", "City", "Food", "Nightlife"],
    recommendedTripDays: [4, 6],
    stayCostLow: 125,
    stayCostHigh: 240,
    localDailyCostLow: 70,
    localDailyCostHigh: 130,
    seasonTags: ["winter", "spring"],
    popularityScore: 90,
    shortDescription:
      "Beaches, art deco blocks, Latin food, nightlife, and warm-weather city breaks.",
  },
  {
    id: "montreal",
    city: "Montreal",
    country: "Canada",
    countryCode: "CA",
    airportCode: "YUL",
    region: "North America",
    latitude: 45.5019,
    longitude: -73.5674,
    tags: ["City", "Culture", "Food", "Budget"],
    recommendedTripDays: [3, 5],
    stayCostLow: 80,
    stayCostHigh: 155,
    localDailyCostLow: 45,
    localDailyCostHigh: 85,
    seasonTags: ["summer", "autumn", "winter"],
    popularityScore: 87,
    shortDescription:
      "French-Canadian food, festivals, old streets, parks, and compact city exploring.",
  },
  {
    id: "vancouver",
    city: "Vancouver",
    country: "Canada",
    countryCode: "CA",
    airportCode: "YVR",
    region: "North America",
    latitude: 49.2827,
    longitude: -123.1207,
    tags: ["City", "Nature", "Adventure", "Food"],
    recommendedTripDays: [4, 7],
    stayCostLow: 115,
    stayCostHigh: 220,
    localDailyCostLow: 60,
    localDailyCostHigh: 115,
    seasonTags: ["summer", "autumn", "winter"],
    popularityScore: 89,
    shortDescription:
      "Mountains, water, neighborhoods, food, and outdoorsy city days.",
  },
  {
    id: "cartagena",
    city: "Cartagena",
    country: "Colombia",
    countryCode: "CO",
    airportCode: "CTG",
    region: "South America",
    latitude: 10.391,
    longitude: -75.4794,
    tags: ["Beach", "Culture", "Romantic", "Budget"],
    recommendedTripDays: [4, 6],
    stayCostLow: 55,
    stayCostHigh: 130,
    localDailyCostLow: 35,
    localDailyCostHigh: 70,
    seasonTags: ["winter", "spring"],
    popularityScore: 87,
    shortDescription:
      "Colorful old-town streets, Caribbean heat, islands, and value-focused stays.",
  },
  {
    id: "medellin",
    city: "Medellin",
    country: "Colombia",
    countryCode: "CO",
    airportCode: "MDE",
    region: "South America",
    latitude: 6.2476,
    longitude: -75.5658,
    tags: ["City", "Nature", "Food", "Budget"],
    recommendedTripDays: [4, 7],
    stayCostLow: 45,
    stayCostHigh: 100,
    localDailyCostLow: 28,
    localDailyCostHigh: 60,
    seasonTags: ["year-round"],
    popularityScore: 88,
    shortDescription:
      "Green city views, cafes, day trips, springlike weather, and moderate costs.",
  },
  {
    id: "buenos-aires",
    city: "Buenos Aires",
    country: "Argentina",
    countryCode: "AR",
    airportCode: "BUE",
    region: "South America",
    latitude: -34.6037,
    longitude: -58.3816,
    tags: ["City", "Culture", "Food", "Nightlife"],
    recommendedTripDays: [5, 8],
    stayCostLow: 60,
    stayCostHigh: 130,
    localDailyCostLow: 35,
    localDailyCostHigh: 75,
    seasonTags: ["spring", "autumn"],
    popularityScore: 89,
    shortDescription:
      "Tango, steak, cafes, bookstores, parks, and late-night city rhythm.",
  },
  {
    id: "lima",
    city: "Lima",
    country: "Peru",
    countryCode: "PE",
    airportCode: "LIM",
    region: "South America",
    latitude: -12.0464,
    longitude: -77.0428,
    tags: ["City", "Food", "Culture", "Budget"],
    recommendedTripDays: [3, 6],
    stayCostLow: 55,
    stayCostHigh: 120,
    localDailyCostLow: 35,
    localDailyCostHigh: 70,
    seasonTags: ["winter", "spring"],
    popularityScore: 86,
    shortDescription:
      "Coastal neighborhoods, museums, markets, and one of the world's best food scenes.",
  },
  {
    id: "santiago",
    city: "Santiago",
    country: "Chile",
    countryCode: "CL",
    airportCode: "SCL",
    region: "South America",
    latitude: -33.4489,
    longitude: -70.6693,
    tags: ["City", "Nature", "Food", "Adventure"],
    recommendedTripDays: [4, 7],
    stayCostLow: 70,
    stayCostHigh: 140,
    localDailyCostLow: 45,
    localDailyCostHigh: 85,
    seasonTags: ["spring", "autumn", "winter"],
    popularityScore: 84,
    shortDescription:
      "Andes views, wine country access, markets, museums, and mountain day trips.",
  },
  {
    id: "cape-town",
    city: "Cape Town",
    country: "South Africa",
    countryCode: "ZA",
    airportCode: "CPT",
    region: "Africa",
    latitude: -33.9249,
    longitude: 18.4241,
    tags: ["Nature", "Beach", "Adventure", "Food"],
    recommendedTripDays: [5, 8],
    stayCostLow: 70,
    stayCostHigh: 160,
    localDailyCostLow: 40,
    localDailyCostHigh: 85,
    seasonTags: ["summer", "spring", "autumn"],
    popularityScore: 91,
    shortDescription:
      "Table Mountain, beaches, wine, food, scenic drives, and high-impact nature.",
  },
  {
    id: "nairobi",
    city: "Nairobi",
    country: "Kenya",
    countryCode: "KE",
    airportCode: "NBO",
    region: "Africa",
    latitude: -1.2921,
    longitude: 36.8219,
    tags: ["Nature", "Adventure", "Culture", "Family"],
    recommendedTripDays: [4, 7],
    stayCostLow: 65,
    stayCostHigh: 155,
    localDailyCostLow: 45,
    localDailyCostHigh: 90,
    seasonTags: ["dry season"],
    popularityScore: 84,
    shortDescription:
      "A practical gateway for wildlife, museums, markets, and nature-focused trips.",
  },
  {
    id: "sydney",
    city: "Sydney",
    country: "Australia",
    countryCode: "AU",
    airportCode: "SYD",
    region: "Oceania",
    latitude: -33.8688,
    longitude: 151.2093,
    tags: ["Beach", "City", "Nature", "Family"],
    recommendedTripDays: [5, 8],
    stayCostLow: 125,
    stayCostHigh: 235,
    localDailyCostLow: 75,
    localDailyCostHigh: 135,
    seasonTags: ["spring", "summer", "autumn"],
    popularityScore: 91,
    shortDescription:
      "Harbor views, beaches, coastal walks, food, and nature within city reach.",
  },
  {
    id: "queenstown",
    city: "Queenstown",
    country: "New Zealand",
    countryCode: "NZ",
    airportCode: "ZQN",
    region: "Oceania",
    latitude: -45.0312,
    longitude: 168.6626,
    tags: ["Nature", "Adventure", "Romantic", "Luxury"],
    recommendedTripDays: [5, 8],
    stayCostLow: 120,
    stayCostHigh: 240,
    localDailyCostLow: 80,
    localDailyCostHigh: 150,
    seasonTags: ["summer", "winter"],
    popularityScore: 86,
    shortDescription:
      "Alpine scenery, lakes, hikes, adventure activities, and scenic drives.",
  },
  {
    id: "maldives",
    city: "Malé",
    country: "Maldives",
    countryCode: "MV",
    airportCode: "MLE",
    region: "Indian Ocean",
    latitude: 4.1755,
    longitude: 73.5093,
    tags: ["Beach", "Romantic", "Luxury", "Family"],
    recommendedTripDays: [4, 7],
    stayCostLow: 130,
    stayCostHigh: 360,
    localDailyCostLow: 65,
    localDailyCostHigh: 150,
    seasonTags: ["winter", "spring"],
    popularityScore: 89,
    shortDescription:
      "Island resorts, clear water, snorkeling, and short high-value beach escapes.",
  },
];

export const heroDestinationIds = [
  "tokyo",
  "bali",
  "lisbon",
  "bangkok",
  "mexico-city",
  "paris",
] as const;

const unsplashImage = (photoId: string, width = 2200) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=82`;

const destinationEnhancements: Record<
  string,
  Pick<Destination, "heroImage" | "heroImageAlt" | "gallery" | "guide">
> = {
  tokyo: {
    heroImage: unsplashImage("photo-1540959733332-eab4deabeeaf"),
    heroImageAlt: "Tokyo city crossing with neon signs and evening traffic",
    gallery: [
      {
        src: unsplashImage("photo-1540959733332-eab4deabeeaf", 1400),
        alt: "Tokyo neon streets and crossing",
        caption: "Shibuya and central Tokyo energy",
        credit: "Photo via Unsplash",
      },
      {
        src: unsplashImage("photo-1542051841857-5f90071e7989", 1400),
        alt: "Historic temple architecture in Tokyo",
        caption: "Old Tokyo around temple districts",
        credit: "Photo via Unsplash",
      },
      {
        src: unsplashImage("photo-1503899036084-c55cdd92da26", 1400),
        alt: "Tokyo street at night with restaurants and signs",
        caption: "Food streets after dark",
        credit: "Photo via Unsplash",
      },
      {
        src: unsplashImage("photo-1554797589-7241bb691973", 1400),
        alt: "Japanese ramen bowl with toppings",
        caption: "Ramen, sushi, izakaya nights",
        credit: "Photo via Unsplash",
      },
    ],
    guide: {
      overview: [
        "Tokyo is ideal if you want a city trip that feels precise, energetic, and easy to navigate. Neighborhoods change quickly from neon crossings to quiet shrines, so a short stay can still feel varied.",
        "It works especially well for food-focused travelers, first-time Japan visitors, and people who want a dense city without needing a car.",
      ],
      highlights: [
        {
          name: "Shibuya and Harajuku",
          description:
            "Start with Shibuya Crossing, small side streets, shops, cafes, and nearby Harajuku. It is the easiest way to feel Tokyo's scale and youth culture in one walkable area.",
        },
        {
          name: "Senso-ji and Asakusa",
          description:
            "Tokyo's older side is easiest to read around Senso-ji, where temple gates, snack stalls, and traditional shopping streets make a strong first-day anchor.",
        },
        {
          name: "Meiji Shrine",
          description:
            "A forested shrine walk near the busiest parts of the city. It is calm, spacious, and useful as a reset between shopping and food districts.",
        },
        {
          name: "Tokyo food halls",
          description:
            "Station basements and department-store food floors are practical, delicious, and surprisingly easy for sampling sushi, sweets, bento, and seasonal snacks.",
        },
      ],
      foods: [
        { name: "Sushi", description: "From standing counters to splurge meals, sushi is one of Tokyo's clearest food signatures." },
        { name: "Ramen", description: "Use ticket-machine ramen shops for quick, affordable bowls between neighborhoods." },
        { name: "Yakitori", description: "Grilled skewers make a relaxed dinner format, especially around station-side alleys." },
        { name: "Tonkatsu", description: "Crisp pork cutlets with cabbage and rice are reliable, filling, and easy to order." },
      ],
      culture: [
        "Train etiquette is quiet and orderly, especially during commuter hours.",
        "Cashless payments are common, but a small cash reserve still helps at older shops.",
        "Restaurants may specialize tightly, so choose by dish rather than expecting broad menus.",
      ],
      practicalTips: [
        "Stay near a major rail line if it is your first visit.",
        "Avoid overloading days with distant neighborhoods.",
        "Convenience stores are genuinely useful for breakfast, snacks, and late arrivals.",
      ],
    },
  },
  bali: {
    heroImage: unsplashImage("photo-1537996194471-e657df975ab4"),
    heroImageAlt: "Bali coastline and tropical cliffs",
    gallery: [
      {
        src: unsplashImage("photo-1537996194471-e657df975ab4", 1400),
        alt: "Bali tropical coastline and cliffs",
        caption: "Coastline and island drama",
        credit: "Photo via Unsplash",
      },
      {
        src: unsplashImage("photo-1518548419970-58e3b4079ab2", 1400),
        alt: "Bali rice terraces in green hills",
        caption: "Rice terraces and inland days",
        credit: "Photo via Unsplash",
      },
      {
        src: unsplashImage("photo-1539367628448-4bc5c9d171c8", 1400),
        alt: "Bali beach and clear water",
        caption: "Beach time without rushing",
        credit: "Photo via Unsplash",
      },
      {
        src: unsplashImage("photo-1548943487-a2e4e43b4853", 1400),
        alt: "Balinese food and small dishes",
        caption: "Local food, cafes, and warungs",
        credit: "Photo via Unsplash",
      },
    ],
    guide: {
      overview: [
        "Bali is less about one city checklist and more about choosing the right base. Beach areas, Ubud, surf towns, and quieter villa stays all create very different trips.",
        "It is strongest for travelers who want nature, flexible budgets, warm-weather downtime, and a mix of temples, cafes, beaches, and day trips.",
      ],
      highlights: [
        {
          name: "Ubud",
          description:
            "Use Ubud for rice terraces, craft shops, temples, yoga studios, and a slower inland base. It balances scenery and logistics well.",
        },
        {
          name: "Uluwatu",
          description:
            "Cliff views, surf beaches, sunset temples, and relaxed coastal restaurants make Uluwatu one of Bali's strongest visual areas.",
        },
        {
          name: "Canggu and Seminyak",
          description:
            "These areas are easier for cafes, beach clubs, restaurants, and nightlife, though traffic can be a real cost in time.",
        },
        {
          name: "Temples and terraces",
          description:
            "A good Bali itinerary should include at least one temple visit and one inland landscape day rather than only beach time.",
        },
      ],
      foods: [
        { name: "Nasi goreng", description: "A simple fried rice staple that works for casual meals almost anywhere." },
        { name: "Babi guling", description: "Balinese roast pork, usually best at specialist local spots." },
        { name: "Satay", description: "Grilled skewers with sauces, often easy to find and budget friendly." },
        { name: "Smoothie bowls", description: "Not traditional, but common in cafe-heavy travel areas and useful for easy breakfasts." },
      ],
      culture: [
        "Temple visits require respectful dress, often including a sarong.",
        "Traffic can make short distances take longer than expected.",
        "Small local warungs can be much better value than polished beach-area restaurants.",
      ],
      practicalTips: [
        "Pick one or two bases instead of trying to sleep in a new area every night.",
        "Leave buffer time for airport transfers.",
        "Use ride apps where available, but expect local transport rules to vary by area.",
      ],
    },
  },
  lisbon: {
    heroImage: unsplashImage("photo-1555881400-74d7acaacd8b"),
    heroImageAlt: "Lisbon tram moving through tiled streets",
    gallery: [
      {
        src: unsplashImage("photo-1555881400-74d7acaacd8b", 1400),
        alt: "Lisbon tram on a narrow street",
        caption: "Trams, hills, and tiled streets",
        credit: "Photo via Unsplash",
      },
      {
        src: unsplashImage("photo-1585208798174-6cedd86e019a", 1400),
        alt: "Lisbon city viewpoint and rooftops",
        caption: "Viewpoints above the city",
        credit: "Photo via Unsplash",
      },
      {
        src: unsplashImage("photo-1525207934214-58e69a8f8a3a", 1400),
        alt: "Portuguese custard tarts",
        caption: "Pastel de nata stops",
        credit: "Photo via Unsplash",
      },
      {
        src: unsplashImage("photo-1506377585622-bedcbb027afc", 1400),
        alt: "Lisbon waterfront near the Tagus River",
        caption: "Waterfront walks",
        credit: "Photo via Unsplash",
      },
    ],
    guide: {
      overview: [
        "Lisbon feels warm, bright, and compact, but its hills give every neighborhood a different rhythm. It is a strong first Europe trip because it blends city life, food, viewpoints, and easy day trips.",
      ],
      highlights: [
        { name: "Alfama", description: "Narrow streets, viewpoints, tiled facades, and fado venues make Alfama the classic Lisbon wander." },
        { name: "Belem", description: "Go for the monastery, riverfront monuments, museums, and a very easy pastry stop." },
        { name: "Sintra day trip", description: "Palaces and forested hills make Sintra the obvious add-on if you have at least four days." },
      ],
      foods: [
        { name: "Pastel de nata", description: "Custard tarts are the essential Lisbon snack, best with coffee." },
        { name: "Bacalhau", description: "Salt cod appears in many formats and is a useful introduction to Portuguese cooking." },
        { name: "Seafood", description: "Grilled fish, octopus, and shellfish are easy choices near the coast." },
      ],
      culture: [
        "Meals often run later than in North America.",
        "Comfortable shoes matter because the hills and cobblestones are real.",
        "Viewpoints are part of the city experience, not just photo stops.",
      ],
      practicalTips: [
        "Stay near Baixa, Chiado, or Avenida if you want easy first-time logistics.",
        "Use trams for atmosphere, but metro and walking are often more practical.",
        "Book popular Sintra sights ahead in peak months.",
      ],
    },
  },
  bangkok: {
    heroImage: unsplashImage("photo-1508009603885-50cf7c579365"),
    heroImageAlt: "Bangkok temples and city skyline",
    gallery: [
      { src: unsplashImage("photo-1508009603885-50cf7c579365", 1400), alt: "Bangkok temple detail", caption: "Temples and river days", credit: "Photo via Unsplash" },
      { src: unsplashImage("photo-1563492065599-3520f775eeed", 1400), alt: "Bangkok skyline at sunset", caption: "Big-city skyline", credit: "Photo via Unsplash" },
      { src: unsplashImage("photo-1552465011-b4e21bf6e79a", 1400), alt: "Thai street food market", caption: "Street food markets", credit: "Photo via Unsplash" },
      { src: unsplashImage("photo-1528181304800-259b08848526", 1400), alt: "Thai longtail boat on the water", caption: "River and canal rides", credit: "Photo via Unsplash" },
    ],
    guide: {
      overview: [
        "Bangkok is intense in the best way: temples, street food, malls, markets, river ferries, and late nights all sit close together. It is also one of the strongest value cities in the current destination set.",
      ],
      highlights: [
        { name: "Grand Palace and Wat Pho", description: "The classic temple pairing is busy but worth it for scale, detail, and a strong first impression." },
        { name: "Chao Phraya River", description: "Use the river to connect sights while getting a better sense of the city than traffic allows." },
        { name: "Markets and food streets", description: "Markets make Bangkok feel alive, especially when paired with small dishes and snacks rather than one long restaurant meal." },
      ],
      foods: [
        { name: "Pad thai", description: "A familiar entry point, but still worth trying from a busy local stall." },
        { name: "Boat noodles", description: "Small, rich bowls that are easy to sample in multiples." },
        { name: "Mango sticky rice", description: "The simple sweet finish that works after almost any meal." },
      ],
      culture: [
        "Dress modestly for major temples.",
        "Traffic can be heavy, so combine river, rail, and walking.",
        "Street food is normal daily life, not just a tourist activity.",
      ],
      practicalTips: [
        "Stay near BTS or MRT if you want smoother days.",
        "Start temple visits early to avoid heat.",
        "Keep small cash for markets and stalls.",
      ],
    },
  },
  "mexico-city": {
    heroImage: unsplashImage("photo-1512813382945-35a4e5a9c248"),
    heroImageAlt: "Mexico City streets and historic architecture",
    gallery: [
      { src: unsplashImage("photo-1512813382945-35a4e5a9c248", 1400), alt: "Mexico City historic street", caption: "Historic center and streets", credit: "Photo via Unsplash" },
      { src: unsplashImage("photo-1585464231875-d9ef1f5ad396", 1400), alt: "Mexico City cathedral and plaza", caption: "Plazas and architecture", credit: "Photo via Unsplash" },
      { src: unsplashImage("photo-1565299585323-38d6b0865b47", 1400), alt: "Mexican tacos with lime", caption: "Tacos and market meals", credit: "Photo via Unsplash" },
      { src: unsplashImage("photo-1518105779142-d975f22f1b0a", 1400), alt: "Colorful Mexico City neighborhood", caption: "Colorful neighborhoods", credit: "Photo via Unsplash" },
    ],
    guide: {
      overview: [
        "Mexico City is one of the best city trips for culture, food, museums, parks, and neighborhood wandering. It feels huge, but the best first visit can be built from a few focused areas.",
      ],
      highlights: [
        { name: "Roma and Condesa", description: "Leafy streets, cafes, restaurants, parks, and design shops make these neighborhoods easy first bases." },
        { name: "Centro Historico", description: "The main plaza, cathedral, murals, and older streets help explain the city's layers quickly." },
        { name: "National Museum of Anthropology", description: "One of the strongest museum stops in the Americas, especially useful before visiting ruins." },
      ],
      foods: [
        { name: "Tacos al pastor", description: "A must-start street food, usually best from a busy stand at night." },
        { name: "Chilaquiles", description: "A classic breakfast or brunch dish with salsa, tortillas, and toppings." },
        { name: "Tamales", description: "Portable, filling, and common in the morning." },
      ],
      culture: [
        "Neighborhood choice matters because the city is large.",
        "Meal times can run later than many visitors expect.",
        "Museums and markets are central to the trip, not backup plans.",
      ],
      practicalTips: [
        "Use ride apps at night or for longer cross-city moves.",
        "Build days by area instead of zigzagging.",
        "Book major restaurants if food is the focus of the trip.",
      ],
    },
  },
  paris: {
    heroImage: unsplashImage("photo-1502602898657-3e91760cbb34"),
    heroImageAlt: "Paris Eiffel Tower and Seine view",
    gallery: [
      { src: unsplashImage("photo-1502602898657-3e91760cbb34", 1400), alt: "Paris Eiffel Tower view", caption: "Landmarks and river walks", credit: "Photo via Unsplash" },
      { src: unsplashImage("photo-1431274172761-fca41d930114", 1400), alt: "Paris street and cafe scene", caption: "Cafe streets", credit: "Photo via Unsplash" },
      { src: unsplashImage("photo-1499856871958-5b9627545d1a", 1400), alt: "Paris city rooftops", caption: "Classic rooftops", credit: "Photo via Unsplash" },
      { src: unsplashImage("photo-1514933651103-005eec06c04b", 1400), alt: "French bakery and pastries", caption: "Bakeries and pastries", credit: "Photo via Unsplash" },
    ],
    guide: {
      overview: [
        "Paris works best when you balance icons with neighborhood time. Museums and monuments matter, but cafes, bakeries, parks, and long walks are what make the trip feel personal.",
      ],
      highlights: [
        { name: "The Louvre and Tuileries", description: "A strong central anchor for art, gardens, and a walk toward the river." },
        { name: "Montmartre", description: "Hilltop views, small streets, and classic Paris atmosphere make it worth visiting early or late." },
        { name: "Seine walks", description: "Walking the river connects many highlights without making the day feel like a checklist." },
      ],
      foods: [
        { name: "Croissants", description: "A good bakery breakfast is one of the simplest Paris wins." },
        { name: "Steak frites", description: "Classic bistro comfort food that works well for a straightforward dinner." },
        { name: "Crepes", description: "Easy, quick, and useful between sights." },
      ],
      culture: [
        "A greeting when entering shops is expected.",
        "Cafe time is part of the rhythm, not wasted time.",
        "Book major museums ahead to avoid losing hours in lines.",
      ],
      practicalTips: [
        "Stay near a useful metro line rather than chasing one perfect district.",
        "Group sights by bank or neighborhood.",
        "Keep some unplanned walking time.",
      ],
    },
  },
};

export const destinations: Destination[] = destinationRecords.map(
  (destination) => ({
    ...destination,
    image: `/destinations/${destination.id}.webp`,
    imageAlt: `${destination.city}, ${destination.country} travel photography`,
    imageCredit: "Photo via Unsplash",
    ...destinationEnhancements[destination.id],
  }),
);

const officialSources = {
  ukAdvice: "https://www.gov.uk/foreign-travel-advice",
  japanMofa: "https://www.mofa.go.jp/j_info/visit/visa/short/novisa.html",
  indiaMea: "https://www.mea.gov.in/VFFIN.htm",
  thailandDelhi:
    "https://newdelhi.thaiembassy.org/en/content/latest-update-on-revision-to-thailand-s-visa-exemp",
  euEtias: "https://travel-europe.europa.eu/etias_en",
};

export const visaRules: VisaRule[] = [
  ...[
    "JP",
    "TH",
    "MX",
    "PT",
    "ES",
    "IT",
    "FR",
    "GR",
    "TR",
    "KR",
    "SG",
    "ID",
    "VN",
    "AE",
    "MA",
    "NL",
    "DE",
    "CZ",
    "HU",
    "DK",
    "IE",
    "US",
    "CA",
    "CO",
    "AR",
    "PE",
    "CL",
    "ZA",
    "KE",
    "AU",
    "NZ",
    "MV",
  ].map((countryCode) => ({
    passportCountry: "GB",
    destinationCountryCode: countryCode,
    status:
      countryCode === "US" ||
      countryCode === "CA" ||
      countryCode === "AU" ||
      countryCode === "NZ" ||
      countryCode === "KE"
        ? ("eta" as const)
        : countryCode === "VN"
          ? ("evisa" as const)
          : ("visa_free" as const),
    maxStayDays:
      countryCode === "TH"
        ? 60
        : countryCode === "SG" || countryCode === "AE"
          ? 30
          : countryCode === "US"
            ? 90
            : null,
    officialSourceUrl:
      countryCode === "JP"
        ? officialSources.japanMofa
        : countryCode === "TH"
          ? "https://www.gov.uk/foreign-travel-advice/thailand/entry-requirements"
          : countryCode === "US"
            ? "https://esta.cbp.dhs.gov/"
            : countryCode === "CA"
              ? "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html"
              : countryCode === "AU"
                ? "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/evisitor-651"
                : countryCode === "NZ"
                  ? "https://www.immigration.govt.nz/new-zealand-visas/visas/visa/nzeta"
                  : countryCode === "KE"
                    ? "https://www.etakenya.go.ke/"
                    : `${officialSources.ukAdvice}/${countryCode.toLowerCase()}`,
    lastVerifiedAt: "2026-08-17",
  })),
  ...[
    { code: "TH", status: "visa_free", days: 30, source: officialSources.thailandDelhi },
    { code: "ID", status: "visa_on_arrival", days: 30, source: officialSources.indiaMea },
    { code: "MV", status: "visa_on_arrival", days: 30, source: officialSources.indiaMea },
    { code: "JP", status: "evisa", days: 90, source: officialSources.indiaMea },
    { code: "SG", status: "evisa", days: 30, source: officialSources.indiaMea },
    { code: "VN", status: "evisa", days: 30, source: officialSources.indiaMea },
    { code: "AE", status: "evisa", days: null, source: officialSources.indiaMea },
    { code: "TR", status: "evisa", days: 30, source: officialSources.indiaMea },
    { code: "KE", status: "eta", days: null, source: officialSources.indiaMea },
    { code: "MA", status: "evisa", days: null, source: officialSources.indiaMea },
    { code: "AR", status: "evisa", days: null, source: officialSources.indiaMea },
    { code: "NZ", status: "evisa", days: null, source: officialSources.indiaMea },
    { code: "US", status: "visa_required", days: null, source: "https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html" },
    { code: "GB", status: "visa_required", days: null, source: "https://www.gov.uk/check-uk-visa" },
    { code: "CA", status: "visa_required", days: null, source: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html" },
    { code: "PT", status: "visa_required", days: null, source: officialSources.euEtias },
    { code: "ES", status: "visa_required", days: null, source: officialSources.euEtias },
    { code: "IT", status: "visa_required", days: null, source: officialSources.euEtias },
    { code: "FR", status: "visa_required", days: null, source: officialSources.euEtias },
    { code: "GR", status: "visa_required", days: null, source: officialSources.euEtias },
    { code: "NL", status: "visa_required", days: null, source: officialSources.euEtias },
    { code: "DE", status: "visa_required", days: null, source: officialSources.euEtias },
    { code: "CZ", status: "visa_required", days: null, source: officialSources.euEtias },
    { code: "HU", status: "visa_required", days: null, source: officialSources.euEtias },
    { code: "DK", status: "visa_required", days: null, source: officialSources.euEtias },
    { code: "IE", status: "visa_required", days: null, source: "https://www.irishimmigration.ie/coming-to-visit-ireland/" },
  ].map((rule) => ({
    passportCountry: "IN",
    destinationCountryCode: rule.code,
    status: rule.status as VisaStatus,
    maxStayDays: rule.days,
    officialSourceUrl: rule.source,
    lastVerifiedAt: "2026-08-17",
  })),
];

const baseFlightCacheRows = [
  ["NYC", "MEX", 240, 330],
  ["NYC", "CUN", 260, 380],
  ["NYC", "LIS", 430, 620],
  ["NYC", "PAR", 480, 680],
  ["NYC", "LON", 430, 650],
  ["NYC", "YUL", 170, 260],
  ["NYC", "CTG", 300, 470],
  ["NYC", "MDE", 330, 500],
  ["NYC", "BUE", 620, 880],
  ["NYC", "DUB", 420, 620],
  ["LON", "LIS", 95, 180],
  ["LON", "BCN", 85, 170],
  ["LON", "ROM", 110, 210],
  ["LON", "ATH", 135, 260],
  ["LON", "IST", 150, 280],
  ["LON", "RAK", 120, 240],
  ["LON", "BUD", 80, 160],
  ["LON", "PRG", 75, 155],
  ["LON", "BER", 85, 165],
  ["LON", "AMS", 80, 150],
  ["DEL", "BKK", 190, 310],
  ["DEL", "DPS", 260, 430],
  ["DEL", "SGN", 230, 380],
  ["DEL", "DXB", 210, 360],
  ["DEL", "SIN", 230, 390],
  ["DEL", "MLE", 210, 340],
  ["DEL", "TYO", 470, 720],
  ["DEL", "IST", 360, 560],
  ["DEL", "NBO", 390, 640],
  ["BOM", "DXB", 160, 280],
  ["BOM", "BKK", 210, 340],
  ["BOM", "DPS", 280, 460],
  ["BOM", "SIN", 240, 390],
  ["BOM", "MLE", 190, 320],
  ["BOM", "IST", 380, 590],
  ["YTO", "YUL", 140, 230],
  ["YTO", "NYC", 190, 310],
  ["YTO", "MEX", 340, 520],
  ["YTO", "CUN", 320, 480],
  ["YTO", "LIS", 520, 760],
  ["YTO", "LON", 560, 780],
  ["SYD", "DPS", 310, 520],
  ["SYD", "SIN", 350, 590],
  ["SYD", "TYO", 530, 820],
  ["SYD", "ZQN", 270, 460],
  ["SYD", "AKL", 240, 390],
] as const;

const expandedFlightCacheRows = [
  ["LAX", "MEX", 230, 360], ["LAX", "CUN", 330, 520], ["LAX", "TYO", 520, 820], ["LAX", "SEL", 560, 860], ["LAX", "DPS", 640, 980], ["LAX", "PAR", 590, 890],
  ["SFO", "MEX", 260, 390], ["SFO", "TYO", 500, 790], ["SFO", "SEL", 540, 840], ["SFO", "SIN", 610, 940], ["SFO", "DPS", 690, 1010], ["SFO", "LIS", 620, 930],
  ["CHI", "MEX", 270, 420], ["CHI", "CUN", 310, 480], ["CHI", "LON", 500, 760], ["CHI", "PAR", 540, 800], ["CHI", "DUB", 480, 720], ["CHI", "YUL", 220, 330],
  ["YVR", "TYO", 470, 760], ["YVR", "SEL", 520, 780], ["YVR", "MEX", 360, 540], ["YVR", "CUN", 390, 590], ["YVR", "LIS", 620, 900], ["YVR", "DPS", 660, 980],
  ["MEX", "CUN", 110, 210], ["MEX", "CTG", 260, 430], ["MEX", "MDE", 250, 410], ["MEX", "LIM", 330, 520], ["MEX", "NYC", 250, 380], ["MEX", "PAR", 620, 920],
  ["PAR", "LIS", 100, 190], ["PAR", "BCN", 90, 170], ["PAR", "ROM", 110, 210], ["PAR", "ATH", 150, 270], ["PAR", "IST", 170, 310], ["PAR", "RAK", 140, 260],
  ["AMS", "LIS", 120, 220], ["AMS", "BCN", 100, 190], ["AMS", "ROM", 125, 235], ["AMS", "CPH", 90, 170], ["AMS", "PRG", 95, 175], ["AMS", "BUD", 105, 190],
  ["FRA", "LIS", 130, 240], ["FRA", "BCN", 110, 210], ["FRA", "ROM", 120, 230], ["FRA", "ATH", 160, 290], ["FRA", "IST", 170, 300], ["FRA", "PRG", 95, 170],
  ["MAD", "LIS", 85, 160], ["MAD", "BCN", 70, 140], ["MAD", "ROM", 110, 210], ["MAD", "PAR", 120, 230], ["MAD", "RAK", 100, 190], ["MAD", "ATH", 170, 300],
  ["ROM", "LIS", 125, 230], ["ROM", "BCN", 95, 180], ["ROM", "PAR", 110, 220], ["ROM", "ATH", 95, 180], ["ROM", "IST", 145, 260], ["ROM", "BUD", 95, 170],
  ["LIS", "BCN", 90, 170], ["LIS", "PAR", 110, 210], ["LIS", "ROM", 130, 240], ["LIS", "RAK", 100, 190], ["LIS", "DUB", 130, 240], ["LIS", "MEX", 580, 850],
  ["TYO", "SEL", 180, 320], ["TYO", "BKK", 310, 520], ["TYO", "SIN", 330, 560], ["TYO", "DPS", 370, 620], ["TYO", "HKG", 260, 430], ["TYO", "SGN", 290, 490],
  ["SEL", "TYO", 170, 310], ["SEL", "BKK", 280, 480], ["SEL", "SIN", 300, 520], ["SEL", "DPS", 360, 610], ["SEL", "HKG", 230, 390], ["SEL", "SGN", 260, 440],
  ["SIN", "BKK", 95, 180], ["SIN", "DPS", 120, 220], ["SIN", "SGN", 110, 210], ["SIN", "TYO", 320, 560], ["SIN", "SEL", 310, 540], ["SIN", "MLE", 260, 430],
  ["BKK", "DPS", 170, 300], ["BKK", "SGN", 85, 160], ["BKK", "SIN", 95, 180], ["BKK", "TYO", 320, 540], ["BKK", "SEL", 300, 520], ["BKK", "MLE", 250, 430],
  ["HKG", "TYO", 240, 420], ["HKG", "BKK", 170, 310], ["HKG", "SIN", 190, 340], ["HKG", "DPS", 260, 460], ["HKG", "SEL", 230, 390], ["HKG", "SGN", 160, 280],
  ["TPE", "TYO", 220, 380], ["TPE", "BKK", 210, 370], ["TPE", "SIN", 230, 410], ["TPE", "SEL", 190, 330], ["TPE", "HKG", 150, 260], ["TPE", "DPS", 280, 480],
  ["DXB", "IST", 210, 360], ["DXB", "MLE", 230, 390], ["DXB", "BKK", 300, 520], ["DXB", "SIN", 330, 560], ["DXB", "LIS", 420, 680], ["DXB", "PAR", 390, 640],
  ["RUH", "DXB", 130, 240], ["RUH", "IST", 220, 390], ["RUH", "BKK", 340, 580], ["RUH", "SIN", 380, 640], ["RUH", "LIS", 460, 740], ["RUH", "MLE", 280, 460],
  ["MEL", "DPS", 300, 500], ["MEL", "SIN", 330, 560], ["MEL", "TYO", 530, 820], ["MEL", "AKL", 230, 380], ["MEL", "ZQN", 280, 470], ["MEL", "BKK", 420, 680],
] as const;

export const flightCache: FlightCache[] = [...baseFlightCacheRows, ...expandedFlightCacheRows].map(([originIata, destinationAirportCode, low, high]) => ({
  originIata: String(originIata),
  destinationAirportCode: String(destinationAirportCode),
  low: Number(low),
  high: Number(high),
  source: "TripFit manually authored planning range",
  estimateType: "planning",
}));

export const popularDestinationIds = [
  "bangkok",
  "mexico-city",
  "lisbon",
  "tokyo",
  "bali",
  "istanbul",
  "paris",
  "cape-town",
];
