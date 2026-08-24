export type DecisionGuideItem = {
  name: string;
  description: string;
  bestFor?: string;
};

export type DecisionGuideSection = {
  title: string;
  items: DecisionGuideItem[];
};

export type DecisionItineraryDay = {
  day: string;
  title: string;
  items: string[];
};

export type DecisionTravelerFit = {
  traveler: string;
  fit: "good" | "poor";
  reason: string;
};

export type DestinationDecisionLayer = {
  chooseIf: string[];
  avoidIf: string[];
  travelerFit: DecisionTravelerFit[];
  durationDecision: {
    threeDays: string;
    fiveDays: string;
    sevenPlusDays: string;
  };
};

export type DestinationComparison = {
  chooseWhen: string[];
  considerOtherWhen: string[];
};

export type DestinationSeasonPlan = {
  season: string;
  bestFor: string;
  tradeoff: string;
};

export type DestinationHighlightAnchor = {
  name: string;
  category: string;
  photoIndex: number;
  whyItMatters: string;
  recommendedTime: string;
};

export type DestinationDecisionGuide = {
  decisionLayer: DestinationDecisionLayer;
  comparison?: DestinationComparison;
  seasonPlan?: DestinationSeasonPlan[];
  highlightAnchors?: DestinationHighlightAnchor[];
  quickFacts: {
    bestTime: string;
    currency: string;
    airports: string;
    bestFor: string;
  };
  overview: string[];
  thingSections: DecisionGuideSection[];
  foods: DecisionGuideItem[];
  neighborhoods: DecisionGuideItem[];
  gettingAround: DecisionGuideItem[];
  bestTime: DecisionGuideItem[];
  budget: DecisionGuideItem[];
  itineraries: Record<"3" | "5", DecisionItineraryDay[]>;
  practicalInfo: DecisionGuideItem[];
  faqs: DecisionGuideItem[];
};

export const destinationDecisionGuides: Record<string, DestinationDecisionGuide> = {
  tokyo: {
    decisionLayer: {
      chooseIf: [
        "You want a first Japan trip built around reliable transport, food, and very different neighborhoods.",
        "You enjoy a dense city where traditional streets, design, shopping, and everyday meals can share one itinerary.",
      ],
      avoidIf: [
        "Your priority is a low-cost tropical beach trip or a slow resort with minimal logistics.",
        "You dislike long station walks, busy districts, or planning days around geographic clusters.",
      ],
      travelerFit: [
        { traveler: "First-time Japan traveler", fit: "good", reason: "Tokyo gives a broad introduction to Japan with strong transport and many ways to adjust the pace." },
        { traveler: "Food-focused traveler", fit: "good", reason: "Specialist restaurants, casual meals, markets, and neighborhood eating can shape the whole trip." },
        { traveler: "Budget beach traveler", fit: "poor", reason: "Flights and accommodation can dominate the total, and Tokyo is not a beach-first destination." },
        { traveler: "Traveler who wants one compact base", fit: "poor", reason: "The city is rewarding but spread out; choosing a base does not remove all cross-city travel." },
      ],
      durationDecision: {
        threeDays: "Choose three days for a first contrast between modern west-side Tokyo and the traditional east side. Keep the route tight and skip distant add-ons.",
        fiveDays: "Five days is the default recommendation for food, neighborhoods, one slower day, and a less rushed first visit.",
        sevenPlusDays: "Seven or more days suits repeat visitors, slower travelers, or anyone adding day trips and smaller neighborhoods rather than more checklist sights.",
      },
    },
    comparison: {
      chooseWhen: [
        "A first Japan trip matters and you want the widest mix of food, neighborhoods, culture, and modern city life.",
        "Reliable public transport and the ability to change your pace without renting a car are part of the appeal.",
        "You would rather choose between many strong neighborhoods than commit to one resort or one nightlife district.",
      ],
      considerOtherWhen: [
        "Choose Seoul when lower everyday cost, concentrated nightlife, or contemporary Korean culture is the main priority.",
        "Choose Bangkok when tropical warmth, street food value, and a looser pace matter more than rail-led city structure.",
        "Choose Singapore when frictionless logistics and a compact, polished city break matter more than Tokyo's scale.",
      ],
    },
    seasonPlan: [
      { season: "Spring", bestFor: "Visitors who want comfortable walking and seasonal atmosphere", tradeoff: "Peak blossom periods can raise crowds, hotel demand, and total trip cost." },
      { season: "Summer", bestFor: "Travelers working around school calendars or prioritizing long daylight", tradeoff: "Heat and humidity make dense walking days harder, so build in indoor breaks." },
      { season: "Autumn", bestFor: "First-time visitors looking for balanced weather and neighborhood days", tradeoff: "Popular foliage periods still need early accommodation planning." },
      { season: "Winter", bestFor: "Food-focused travelers and visitors who prefer sharper prices and shorter queues", tradeoff: "Shorter daylight and colder evenings favor a more deliberate indoor-and-city schedule." },
    ],
    highlightAnchors: [
      { name: "Shibuya Crossing", category: "Neighborhood", photoIndex: 0, whyItMatters: "A fast way to understand Tokyo's scale, street energy, and west-side city rhythm.", recommendedTime: "30–60 min" },
      { name: "Senso-ji and Asakusa", category: "Culture", photoIndex: 1, whyItMatters: "Temple grounds, approach streets, and older Tokyo make this a strong cultural anchor for a first visit.", recommendedTime: "1–2 hours" },
      { name: "Tokyo food streets", category: "Food & local life", photoIndex: 2, whyItMatters: "Station-side lanes and small restaurants show how meals naturally fit into a neighborhood day.", recommendedTime: "1–2 hours" },
      { name: "Tokyo skyline viewpoints", category: "City", photoIndex: 4, whyItMatters: "A skyline view helps travelers grasp the city's density and choose whether big-city scale is part of the appeal.", recommendedTime: "1–2 hours" },
      { name: "Transit rhythm", category: "Everyday Tokyo", photoIndex: 6, whyItMatters: "Rail, walking, and station neighborhoods are not just logistics; they shape how a realistic Tokyo itinerary works.", recommendedTime: "Built into each day" },
    ],
    quickFacts: { bestTime: "March-April / late October-November", currency: "JPY", airports: "HND / NRT", bestFor: "Food · Culture · City" },
    overview: [
      "Tokyo is easiest to understand as a collection of neighborhoods rather than one downtown. Asakusa, Ueno, Shibuya, Shinjuku, Ginza, and the quieter streets between them create different versions of the city, so a good first trip is built around a few connected areas rather than a checklist of famous names.",
      "Its distinctive appeal is the way older and newer Tokyo sit together without needing a themed tourist district. A temple approach, a department-store food hall, a tiny ramen counter, and a neon-heavy station area can all belong to the same day. That mix makes Tokyo especially strong for travelers who enjoy food, design, urban detail, and reliable logistics.",
      "Tokyo is less ideal when the goal is a slow resort, spontaneous driving, or a very low daily budget. Stations are large, distances are easy to underestimate, and the city rewards planning by area. When the itinerary clusters neighborhoods sensibly, a three-to-five-day stay feels varied rather than exhausting.",
    ],
    thingSections: [
      { title: "Traditional Tokyo", items: [
        { name: "Senso-ji and Asakusa", description: "Asakusa gives a first-time visitor a compact introduction to older Tokyo: temple grounds, the approach streets, small shops, snacks, and river views. It suits travelers who want cultural context without spending a full day moving between distant sights." },
        { name: "Meiji Shrine", description: "The wooded approach to Meiji Shrine creates a calm counterpoint to nearby Harajuku. Visit it as part of a west-side day, then use the surrounding streets and cafes to see how Tokyo moves between ceremony, fashion, and everyday life." },
        { name: "Ueno Park and museums", description: "Ueno works well for a slower culture day, with park space, museums, market streets, and an east-side base. It is a useful choice when the trip needs substance without another high-intensity shopping district." },
      ]},
      { title: "Modern Tokyo", items: [
        { name: "Shibuya", description: "Shibuya is more than its famous crossing. The surrounding streets combine fashion, food, music, viewpoints, and constant movement, making it a strong first-day anchor for travelers who want to feel the scale of the city quickly." },
        { name: "Shinjuku", description: "Shinjuku shows Tokyo at full volume: a huge station, department stores, observation views, late dining, and compact nightlife lanes. It is exciting and practical, but travelers seeking quiet evenings may prefer to visit rather than stay here." },
        { name: "A contemporary city experience", description: "Reserve one slot for immersive art, design, architecture, or a skyline view. A modern experience keeps the trip from becoming only temples and shopping, and explains why Tokyo feels future-facing as well as historic." },
      ]},
      { title: "Food and local life", items: [
        { name: "Station food halls and neighborhood markets", description: "Department-store basements and station food halls are easy, high-payoff ways to sample bento, sweets, seasonal foods, and prepared meals. They are especially useful on arrival days or when a reservation-heavy dinner would add stress." },
        { name: "Ramen and izakaya streets", description: "A ramen lunch or izakaya evening often reveals more of Tokyo's daily rhythm than one extra landmark. Pick one neighborhood and let the meal, side streets, and nearby bars form a compact experience." },
        { name: "Harajuku side streets and cafes", description: "The quieter streets around Harajuku show a more varied side of the area than the busiest shopping strip. They work well for a flexible afternoon of small shops, cafes, and people-watching." },
      ]},
      { title: "Slower Tokyo", items: [
        { name: "Ginza and Marunouchi", description: "Ginza and Marunouchi provide a polished, lower-pressure city walk with department stores, architecture, cafes, and easy transport. They are useful when a short trip needs breathing room between denser neighborhoods." },
        { name: "A garden, river, or residential walk", description: "A slower park or neighborhood stop keeps Tokyo from becoming five days of stations and crowds. This is not filler: it is how travelers notice the city's quieter scale and recover energy for the next district." },
      ]},
    ],
    foods: [
      { name: "Sushi", description: "Tokyo makes sushi available at many levels, from quick counters to deliberate meals. Treat it as one planned highlight rather than a box to tick every day, and leave room for the city's wider food culture." },
      { name: "Ramen", description: "Ramen is an easy way to turn a practical meal into a destination experience. It fits naturally between neighborhoods, works in poor weather, and lets travelers try a focused specialty without a long evening commitment." },
      { name: "Yakitori and izakaya", description: "Small plates, grilled skewers, and casual drinks are a good introduction to Tokyo after dark. This suits travelers who want a social, local-feeling evening more than a formal restaurant itinerary." },
      { name: "Tonkatsu, tempura, and curry", description: "Dish-specific specialists are part of Tokyo's everyday pleasure. These meals are satisfying, easy to plan around, and useful when you want something distinctive without making the whole day about dining." },
      { name: "Coffee, bakeries, and sweets", description: "Cafe stops and carefully made sweets help pace a dense city itinerary. They are also a practical way to explore a neighborhood without adding another major attraction or cross-city transfer." },
    ],
    neighborhoods: [
      { name: "Shinjuku", bestFor: "Best for first-timers, transport, and nightlife", description: "Shinjuku is the most flexible all-round base if rail connections, late dining, and city energy matter. The tradeoff is intensity: it is bright, busy, and not the calmest place to return to every night." },
      { name: "Shibuya", bestFor: "Best for shopping, food, and younger city energy", description: "Shibuya puts fashion, cafes, nightlife, and west-side neighborhoods close at hand. It suits travelers who want an active trip, but can feel too nonstop for anyone prioritizing quiet mornings." },
      { name: "Asakusa", bestFor: "Best for culture, calmer evenings, and value", description: "Asakusa is a strong base for older Tokyo, temple streets, and a gentler pace. It is less convenient for west-side nightlife, but makes sense for culture-heavy trips and travelers who prefer atmosphere over polish." },
      { name: "Ginza / Tokyo Station", bestFor: "Best for polished logistics and short stays", description: "This area is orderly and convenient for transport, shopping, and business-style trips. It is easy to operate from, though it has less late-night character than Shinjuku or Shibuya." },
      { name: "Ueno", bestFor: "Best for museums, parks, and east-side exploration", description: "Ueno offers museums, park space, market energy, and useful access to Asakusa and the east side. It feels more grounded than the western districts and can be a practical value choice." },
    ],
    gettingAround: [
      { name: "Airport choice", description: "Haneda is generally the easier arrival point for a short Tokyo stay because it is closer to the city. Narita is workable, but its longer transfer matters when the trip is only three to five days." },
      { name: "Normal city movement", description: "Most visitors use rail, metro, and walking. Tokyo is manageable when each day stays on one side of the city, but tiring when every meal and attraction requires a cross-city journey." },
      { name: "Cluster the neighborhoods", description: "Shibuya, Harajuku, and Shinjuku combine naturally; Asakusa and Ueno make another sensible cluster. This simple geography rule prevents a short trip from becoming a transport schedule." },
      { name: "Do you need a car?", description: "No for a first urban visit. A car adds parking and navigation friction, while rail is usually the more predictable choice. Taxis are useful as selective time-savers with luggage or late at night." },
    ],
    bestTime: [
      { name: "Comfortable walking seasons", description: "Spring and late autumn are usually the easiest periods for long neighborhood days and outdoor sightseeing. They also make it simpler to mix parks, markets, and city walks." },
      { name: "Peak tradeoffs", description: "Cherry blossom and major holiday periods can be memorable, but crowds and accommodation demand rise. A tight total budget may work better in a shoulder period." },
      { name: "Summer and winter", description: "Summer heat and humidity can make a walking-heavy plan tiring. Winter works well for food and city life, but shorter daylight and colder evenings should shape the pace." },
      { name: "Planning around value", description: "Shoulder periods often give the best balance of atmosphere, comfort, and total-trip cost. Check current fares and hotel prices before committing to a peak date." },
    ],
    budget: [
      { name: "Budget traveler", description: "Use the lower end of the existing stay and local-spend ranges, choose a well-connected area rather than the most famous address, and let casual meals carry more of the trip." },
      { name: "Comfort traveler", description: "A central hotel, a few planned meals, and selective taxis or paid experiences create a comfortable Tokyo trip without requiring every day to be premium." },
      { name: "Premium traveler", description: "Higher accommodation and destination meals can raise the total quickly. The key TripFit variable remains the flight from the selected origin, not Tokyo's local costs alone." },
    ],
    itineraries: {
      "3": [
        { day: "Day 1", title: "Shibuya and Harajuku", items: ["Start in Shibuya to understand Tokyo's scale and street rhythm.", "Walk toward Harajuku and Meiji Shrine without adding a distant detour.", "Keep dinner nearby with ramen, izakaya, or a neighborhood specialty meal."] },
        { day: "Day 2", title: "Asakusa and Ueno", items: ["Visit Senso-ji and the older east-side streets in the morning.", "Use Ueno for museums, park time, or market streets.", "Stay on the east side for dinner so the day remains compact."] },
        { day: "Day 3", title: "Shinjuku and a flexible finish", items: ["Use Shinjuku for views, department stores, or nightlife lanes.", "Leave room for one missed neighborhood or a final specialty meal.", "Allow conservative time for the airport, especially from Narita."] },
      ],
      "5": [
        { day: "Day 1", title: "Arrival and Shibuya orientation", items: ["Keep the first afternoon on the west side after checking in.", "Walk Shibuya and choose an easy first dinner.", "Learn the station area you will rely on before adding distance."] },
        { day: "Day 2", title: "Harajuku and Meiji Shrine", items: ["Begin with Meiji Shrine and its wooded approach.", "Leave time for Harajuku side streets, cafes, and small shops.", "Return to the west side for dinner instead of crossing town."] },
        { day: "Day 3", title: "Asakusa and Ueno", items: ["Build the morning around Senso-ji and older Tokyo.", "Choose Ueno museums, the park, or market streets in the afternoon.", "Treat this as the cultural-heritage day."] },
        { day: "Day 4", title: "Shinjuku and contemporary Tokyo", items: ["Explore Shinjuku's views, stores, gardens, or nightlife lanes.", "Add one modern art, design, or skyline experience.", "Keep the evening open for a memorable dinner."] },
        { day: "Day 5", title: "Ginza, Marunouchi, or a favorite repeat", items: ["Use a polished district for a lower-pressure final day.", "Return to the neighborhood that felt most like your Tokyo.", "Leave margin for purchases and airport logistics."] },
      ],
    },
    practicalInfo: [
      { name: "Language", description: "Major visitor areas are workable without Japanese, but clear maps, translation help, and patient expectations make the city easier and more respectful." },
      { name: "Payments", description: "Cards are common, but a small cash reserve still helps at small restaurants, markets, and older shops." },
      { name: "Etiquette", description: "Quiet train behavior, orderly lines, and low-friction public manners shape the experience. Visitors who notice that rhythm settle in quickly." },
      { name: "Pacing", description: "Convenience stores and station facilities make short trips forgiving, but they do not remove the need to cluster neighborhoods and protect rest time." },
    ],
    faqs: [
      { name: "How many days do you need in Tokyo?", description: "Three days can cover a first west-side and east-side overview. Five days is better if you want food, neighborhoods, and a slower day rather than only headline sights." },
      { name: "Is Tokyo expensive?", description: "Accommodation and flights can make the total expensive, while local meals and transport are more controllable. Your departure city is a major part of the answer." },
      { name: "Where should first-time visitors stay?", description: "Shinjuku or Shibuya suit active first trips; Asakusa or Ueno suit culture-heavy plans and calmer evenings. Choose transport convenience before chasing a landmark view." },
      { name: "Is Tokyo difficult to get around?", description: "The network is extensive, but the city becomes tiring if you zigzag. Plan by connected neighborhoods and check the airport-to-hotel route before booking." },
      { name: "Is five days enough?", description: "Yes for a strong first visit if you group areas sensibly. It is enough time for traditional Tokyo, modern districts, food, and one flexible day without turning the trip into a race." },
    ],
  },
  seoul: {
    decisionLayer: {
      chooseIf: [
        "You want food, cafes, shopping, and nightlife with a contemporary city feel and strong public transport.",
        "You prefer a shorter, more socially energetic city break than a slower resort or countryside trip.",
      ],
      avoidIf: [
        "You want every major sight to be walkable from one compact old town.",
        "You are choosing primarily for beaches, quiet nature, or a low-effort escape from city planning.",
      ],
      travelerFit: [
        { traveler: "First-time South Korea traveler", fit: "good", reason: "Seoul combines historic districts and contemporary Korea without requiring a long multi-city itinerary." },
        { traveler: "Food and nightlife traveler", fit: "good", reason: "Markets, barbecue, cafes, and late neighborhoods give the trip a strong evening rhythm." },
        { traveler: "Quiet resort traveler", fit: "poor", reason: "The city is dense, active, and best understood through district changes and public transport." },
        { traveler: "Traveler who needs flat, effortless walking", fit: "poor", reason: "Hills, large stations, weather, and long district distances affect the daily pace." },
      ],
      durationDecision: {
        threeDays: "Three days works for the historic core plus one modern district, but requires choosing between northern and southern Seoul rather than covering everything.",
        fiveDays: "Five days is the best default for palaces, markets, food, Hongdae or Seongsu, and a flexible shopping or cafe day.",
        sevenPlusDays: "Seven or more days benefits travelers who want slower neighborhood exploration, repeated food stops, or a wider Korea itinerary from a Seoul base.",
      },
    },
    quickFacts: { bestTime: "April-May / September-October", currency: "KRW", airports: "ICN / GMP", bestFor: "Food · Design · Nightlife" },
    overview: [
      "Seoul is a city of sharp contrasts that are easy to experience in one trip: palace courtyards and hanok lanes sit near design stores, beauty districts, late-night food streets, and dense apartment neighborhoods. The appeal is not one landmark but the way the city changes character from one subway stop to the next.",
      "It suits travelers who want excellent casual food, shopping, cafes, street life, and a manageable introduction to contemporary Korea. Seoul is more rewarding when you choose a few districts and let them breathe; it is less ideal for a quiet resort holiday or an itinerary that assumes every neighborhood is walkable from the next.",
      "A first visit should balance historic Seoul with the modern districts that make the city distinct. That contrast creates the mental model: old gates and markets in the morning, design and nightlife after dark, with public transport doing the connective work.",
    ],
    thingSections: [
      { title: "Historic Seoul", items: [
        { name: "Gyeongbokgung and the palace district", description: "The palace area gives the trip historical scale and pairs naturally with nearby museums and traditional streets. Go early enough to enjoy the courtyards before moving on to a slower neighborhood lunch." },
        { name: "Bukchon and Insadong", description: "Bukchon and Insadong show Seoul's traditional texture through lanes, craft shops, galleries, and tea houses. They reward respectful, unhurried exploration because residential streets are part of the experience." },
        { name: "Gwangjang Market", description: "Gwangjang is a practical food-and-people-watching stop rather than a monument. It works best when you arrive hungry and use it to understand Seoul's casual eating culture." },
      ]},
      { title: "Modern Seoul", items: [
        { name: "Hongdae", description: "Hongdae brings student energy, music, cafes, shopping, and late evenings together. It suits travelers who want Seoul to feel social and youthful rather than polished and quiet." },
        { name: "Gangnam and COEX", description: "Gangnam shows the city's modern business, shopping, and beauty culture. It is a useful counterpoint to palace Seoul, though it is better treated as a district day than a place to crisscross from constantly." },
        { name: "Seongsu", description: "Seongsu is useful for design, cafes, converted industrial spaces, and a slower contemporary atmosphere. It gives a different view of Seoul than the older tourist core." },
      ]},
      { title: "Food and night life", items: [
        { name: "Korean barbecue", description: "Barbecue is a social meal and works best when you plan around it rather than treating it as a quick stop. It is especially good for groups or travelers who want the meal itself to become part of the evening." },
        { name: "Gimbap, noodles, and market snacks", description: "Quick meals make Seoul easier to explore on a tight schedule. Markets and neighborhood restaurants let you stay flexible while still eating with a strong sense of place." },
        { name: "Cafe districts", description: "Seoul's cafe culture is a useful pacing tool between palaces, shopping, and night markets. Choose one district and let the cafes, stores, and side streets shape the afternoon." },
      ]},
    ],
    foods: [
      { name: "Korean barbecue", description: "The shared grill format makes barbecue a social anchor, especially for an evening in a busy neighborhood. Expect it to take longer than a quick solo meal and plan the rest of the night nearby." },
      { name: "Gimbap and mandu", description: "These are practical daytime foods for travelers moving between districts. They are easy to fit into a museum or shopping day and keep the itinerary from becoming reservation-dependent." },
      { name: "Tteokbokki and market snacks", description: "Spicy rice cakes, fritters, and market snacks show Seoul's casual side. They are best approached as small tastes across an evening rather than one formal meal." },
      { name: "Korean fried chicken", description: "Chicken and a late-night neighborhood is a simple way to experience Seoul after the major sights close. It suits travelers who want a relaxed social meal and a taste of local evening habits." },
    ],
    neighborhoods: [
      { name: "Myeongdong / Euljiro", bestFor: "Best for first-timers and central convenience", description: "This central base is useful for shopping, food, and connecting historic Seoul with other districts. Euljiro adds more local evening character, while Myeongdong is easier for straightforward visitor logistics." },
      { name: "Hongdae", bestFor: "Best for nightlife, cafes, and younger energy", description: "Hongdae suits travelers who want late evenings and a social atmosphere outside the hotel door. It is lively rather than calm, and the distance from some historic sights matters." },
      { name: "Insadong / Jongno", bestFor: "Best for history and traditional atmosphere", description: "Jongno keeps palaces, markets, and traditional streets close. It is a strong choice for culture-heavy trips, though nightlife is less concentrated than in Hongdae or Gangnam." },
      { name: "Gangnam", bestFor: "Best for shopping, dining, and polished stays", description: "Gangnam is modern, spacious, and convenient for its own attractions and business districts. It can be less efficient for a first itinerary centered on the northern historic core." },
    ],
    gettingAround: [
      { name: "Airport planning", description: "Incheon is the main international gateway and the airport transfer affects where a short-stay hotel makes sense. Gimpo is useful for some domestic routes and sits closer to the city." },
      { name: "Subway first", description: "Seoul's subway is the default for most visitors. It makes district-to-district travel predictable, but a hotel near a useful station matters more than a superficially central address." },
      { name: "Cluster north and south", description: "Palace districts, Insadong, and markets combine naturally; Hongdae, Yeonnam, and Seongsu need a different rhythm. Avoid treating Gangnam and the historic core as casual walking distance." },
      { name: "Walking and weather", description: "Many districts are enjoyable on foot, but hills, heat, winter cold, and long station transfers change the energy of the day. Build food and cafe pauses into the route." },
    ],
    bestTime: [
      { name: "Spring and autumn", description: "Milder seasons make neighborhood walks, palace visits, and cafe-hopping easier. They are usually the most balanced periods for a first city trip." },
      { name: "Summer", description: "Heat, humidity, and rain can make long outdoor days tiring. Keep indoor shopping, museums, and flexible food stops available rather than planning every hour outside." },
      { name: "Winter", description: "Cold weather can still suit travelers focused on food, shopping, and nightlife, but it rewards shorter outdoor blocks and a hotel with convenient transit." },
    ],
    budget: [
      { name: "Budget traveler", description: "Use neighborhood restaurants, public transport, and a well-connected but not premium hotel base. Seoul rewards flexible eating and does not require every experience to be a paid attraction." },
      { name: "Comfort traveler", description: "A central hotel, a few destination meals, and cafe or shopping time make a comfortable trip. Keep the flight estimate visible because it can outweigh moderate local costs." },
      { name: "Premium traveler", description: "Gangnam or high-demand central stays and shopping can move the total quickly. The best premium plan still benefits from grouping districts to avoid paying for convenience twice." },
    ],
    itineraries: {
      "3": [
        { day: "Day 1", title: "Palaces, Insadong, and market food", items: ["Start with Gyeongbokgung and the surrounding historic core.", "Walk through Bukchon or Insadong at a respectful pace.", "Finish with market food rather than a long transfer across town."] },
        { day: "Day 2", title: "Hongdae and modern Seoul", items: ["Use Hongdae and Yeonnam for cafes, shops, and street energy.", "Leave a flexible afternoon for Seongsu or a design-focused stop.", "Stay on the west side for a relaxed evening meal."] },
        { day: "Day 3", title: "Gangnam or a favorite repeat", items: ["Choose Gangnam and COEX for a modern contrast, or repeat the district you liked most.", "Keep shopping and food close together.", "Allow extra airport-transfer time on departure day."] },
      ],
      "5": [
        { day: "Day 1", title: "Historic Seoul orientation", items: ["Visit the palace district and establish your sense of the old city.", "Use Insadong for a slower afternoon.", "Eat near Jongno or a market area."] },
        { day: "Day 2", title: "Bukchon, Gwangjang, and local food", items: ["Walk the traditional lanes early and respect residential areas.", "Move toward the market for a flexible lunch.", "Use the evening for barbecue or a neighborhood restaurant."] },
        { day: "Day 3", title: "Hongdae and Yeonnam", items: ["Explore cafes, music, shops, and side streets.", "Keep the afternoon deliberately unstructured.", "Stay nearby for late food or nightlife."] },
        { day: "Day 4", title: "Seongsu and Gangnam contrast", items: ["Use Seongsu for contemporary design and cafe culture.", "Continue to Gangnam only if the southern city experience interests you.", "Avoid adding another far district after dinner."] },
        { day: "Day 5", title: "Flexible Seoul day", items: ["Repeat a favorite area or add a museum, market, or shopping block.", "Use the day to make up for weather or energy changes.", "Keep the final airport route simple."] },
      ],
    },
    practicalInfo: [
      { name: "Payments and ordering", description: "Cards are common, but small markets and neighborhood businesses can vary. Translation tools and a little patience make ordering much smoother." },
      { name: "Etiquette", description: "Respect residential lanes, follow local dining customs, and expect some restaurants to be optimized for shared meals rather than solo ordering." },
      { name: "Connectivity", description: "Reliable navigation is valuable because Seoul's districts are large and station exits matter. Save your hotel address in the local script when possible." },
      { name: "Pace", description: "Seoul is easy to overpack with shopping, cafes, palaces, and nightlife. A realistic day usually has one main district and one evening plan, not four disconnected areas." },
    ],
    faqs: [
      { name: "How many days are enough for Seoul?", description: "Three days covers the historic core and one modern district. Five days gives room for food, shopping, cafes, and a slower neighborhood day." },
      { name: "Is Seoul expensive?", description: "Local choices range widely, but the whole-trip answer depends on your flight and hotel base. Seoul can be manageable when you keep transport and casual meals central to the plan." },
      { name: "Where should a first-time visitor stay?", description: "Central Jongno or Myeongdong helps with first-visit logistics; Hongdae suits nightlife and cafes; Gangnam is best when the southern city is a priority." },
      { name: "Is Seoul easy to get around?", description: "Yes with the subway and a district-based plan. It becomes tiring when the itinerary assumes northern and southern Seoul are close enough to combine casually." },
    ],
  },
  bangkok: {
    decisionLayer: {
      chooseIf: [
        "You want a high-value city break built around street food, temples, markets, and nightlife.",
        "You can plan around heat, traffic, and changing energy rather than expecting a frictionless walking city.",
      ],
      avoidIf: [
        "You want quiet countryside, cool-weather walking, or a single compact historic center.",
        "Heat, busy streets, and flexible transport planning would make the trip feel stressful rather than exciting.",
      ],
      travelerFit: [
        { traveler: "Value-conscious food traveler", fit: "good", reason: "Local meals and varied neighborhoods can deliver a lot of experience without a premium daily budget." },
        { traveler: "First-time Southeast Asia traveler", fit: "good", reason: "Bangkok offers a broad introduction to temples, urban food, river movement, and modern city life." },
        { traveler: "Heat-sensitive traveler", fit: "poor", reason: "Outdoor sightseeing and traffic can make even short distances tiring in hotter periods." },
        { traveler: "Traveler seeking a quiet beach base", fit: "poor", reason: "Bangkok is a dense capital; a separate coastal destination is a better match for that goal." },
      ],
      durationDecision: {
        threeDays: "Three days is enough for the old city, one modern rail-connected area, and a food-focused evening if the route stays compact.",
        fiveDays: "Five days lets you add markets, slower river or park time, and weather buffers without turning every day into a transfer schedule.",
        sevenPlusDays: "Seven or more days suits travelers adding a nearby extension or exploring Bangkok at a slower pace; it is not necessary for a first overview.",
      },
    },
    quickFacts: { bestTime: "November-February", currency: "THB", airports: "BKK / DMK", bestFor: "Food · Culture · Nightlife" },
    overview: [
      "Bangkok is a high-energy city where grand temples, river neighborhoods, street food, malls, markets, and nightlife overlap. The trip is not about one polished center; it is about learning how to move between very different parts of the city without expecting them to feel the same.",
      "It is a strong choice for travelers who want a large amount of food, culture, and evening life for a moderate local budget. Heat, traffic, noise, and the distance between districts are real tradeoffs, so Bangkok rewards flexible days and a hotel near the transport mode you expect to use most.",
      "The best first visit combines a compact old-city day with modern riverside or rail-connected neighborhoods. Treat traffic and weather as planning variables, not surprises, and the city becomes much more approachable.",
    ],
    thingSections: [
      { title: "Temples and old Bangkok", items: [
        { name: "Wat Pho and the Grand Palace area", description: "The old-city temple cluster gives Bangkok its strongest historical identity. Visit early, dress respectfully, and group the sights together rather than trying to cross town between every stop." },
        { name: "Wat Arun and the river", description: "Wat Arun and a short river crossing create a memorable visual introduction to Bangkok. The river is also a practical way to understand how the old city connects to other neighborhoods." },
        { name: "Chinatown", description: "Yaowarat is best experienced as an evening of food, signs, markets, and side streets rather than a single attraction. It suits travelers who like sensory intensity and spontaneous eating." },
      ]},
      { title: "Modern Bangkok", items: [
        { name: "Sukhumvit and BTS neighborhoods", description: "Sukhumvit shows the rail-connected, restaurant-heavy side of Bangkok. It is practical for first-timers who want reliable movement, malls, and a broad choice of evening food." },
        { name: "Siam and contemporary shopping", description: "Siam is useful on hot or rainy days because malls, food halls, and transit are concentrated. It is less atmospheric than the old city but helps create balance in a short itinerary." },
        { name: "Riverside evening", description: "The riverside provides a slower contrast to traffic-heavy streets and works well for views, dinner, or a hotel-focused evening. Check the return route before committing to late plans." },
      ]},
      { title: "Markets and local rhythm", items: [
        { name: "Street-food neighborhoods", description: "Bangkok's strongest everyday experience is often a meal near where you are staying. Use markets, noodle shops, grilled food, and fruit stands to keep the trip flexible and affordable." },
        { name: "A market day", description: "Choose one market that fits the route and weather rather than chasing several far-flung markets. The point is to see how Bangkok shops and eats, not to collect market names." },
        { name: "A slower canal or park break", description: "A park or canal-side pause matters in Bangkok because heat and traffic can make a sightseeing list feel heavier than expected. Build in recovery time before nightlife." },
      ]},
    ],
    foods: [
      { name: "Pad thai and noodle dishes", description: "Noodles are useful for a first Bangkok trip because they are quick, varied, and easy to find near transport. Try them as part of neighborhood exploration rather than searching for one definitive version." },
      { name: "Tom yum and curry", description: "Spicy soups and curries show Bangkok's balance of heat, herbs, sweetness, and acidity. They work best as shared meals when travelers want to sample several flavors." },
      { name: "Mango sticky rice and fruit", description: "Sweet fruit, coconut desserts, and mango sticky rice are simple ways to pace a hot day. Keep them as flexible stops between temples or shopping rather than formal meal appointments." },
      { name: "Chinatown evening food", description: "Chinatown is best when you arrive hungry and let the signs, grills, and small vendors decide the sequence. It suits adventurous eaters and travelers who enjoy a busy evening atmosphere." },
    ],
    neighborhoods: [
      { name: "Sukhumvit", bestFor: "Best for first-timers, rail access, and nightlife", description: "Sukhumvit is practical because BTS access, restaurants, malls, and hotels are easy to combine. It feels more modern and international than the old city, which is either a benefit or a drawback depending on your goal." },
      { name: "Riverside", bestFor: "Best for views and a slower hotel base", description: "The riverside suits travelers who value atmosphere and evening views. Check transport carefully because the same calm location can become inconvenient when crossing town in traffic." },
      { name: "Old City", bestFor: "Best for temples and historic context", description: "The old city keeps the main temple cluster close and creates a stronger sense of Bangkok's historic side. Rail access is less direct, so it works best when your first days are culture-focused." },
      { name: "Siam", bestFor: "Best for shopping and central movement", description: "Siam is an efficient base for malls, food halls, and transit. It is a strong weather-proof choice, but travelers seeking street atmosphere may prefer Chinatown or the riverside." },
    ],
    gettingAround: [
      { name: "Airport planning", description: "BKK is the main international gateway for many visitors and DMK serves additional routes. Your hotel choice should account for which airport you use and how much traffic risk you can tolerate." },
      { name: "Rail and river together", description: "BTS, MRT, and river boats are useful ways to avoid some road traffic. They do not cover every sight, so combine them with short taxi or rideshare legs rather than expecting one system to solve everything." },
      { name: "Heat and distance", description: "A map distance can feel much longer in Bangkok's heat. Plan one main area per half-day, protect midday breaks, and avoid scheduling a temple cluster followed by a far-nightlife district without recovery time." },
      { name: "Do you need a car?", description: "No for most city trips, and self-driving adds stress. Use rail, boats, and selective car rides; for a longer island or countryside extension, reassess the transport plan separately." },
    ],
    bestTime: [
      { name: "Cooler and drier months", description: "November through February is generally the easiest period for temple walks, markets, and outdoor evenings. Demand can also rise, so compare flight and hotel prices before assuming it is the best budget fit." },
      { name: "Hot season", description: "Hotter months can still work if you build around malls, early starts, river travel, and longer meal breaks. A packed outdoor itinerary will feel harder than the same list in a cooler period." },
      { name: "Rain and flexibility", description: "Rain does not have to cancel Bangkok, but it makes flexible sequencing valuable. Keep indoor shopping, food halls, and museums available as substitutions rather than treating weather as a failure." },
    ],
    budget: [
      { name: "Budget traveler", description: "Bangkok is often strongest for value when you eat locally, use public transport where practical, and choose a simple hotel near a useful line. Heat-proof planning can also prevent expensive last-minute transport choices." },
      { name: "Comfort traveler", description: "A well-located hotel, selective taxis, and a mix of street food and destination meals make a comfortable trip. Spend on location and recovery time before adding more attractions." },
      { name: "Premium traveler", description: "Riverside hotels, polished dining, and private transfers can change the total quickly. Keep the trip's local affordability separate from the cost of the flight and hotel experience you choose." },
    ],
    itineraries: {
      "3": [
        { day: "Day 1", title: "Old City temples and the river", items: ["Start with the Grand Palace area and Wat Pho while energy is high.", "Cross toward Wat Arun or use a short river ride.", "Choose an easy riverside or Chinatown dinner."] },
        { day: "Day 2", title: "Sukhumvit and Siam", items: ["Use BTS-connected neighborhoods for shopping, food, and a weather-proof midday.", "Add a cafe or massage break rather than another distant sight.", "Stay near the rail line for an easy evening."] },
        { day: "Day 3", title: "Chinatown and a flexible finish", items: ["Use the morning for a market, park, or favorite repeat area.", "Leave the afternoon open for weather and energy.", "Make Chinatown the evening anchor if you want a high-sensory final night."] },
      ],
      "5": [
        { day: "Day 1", title: "Old City orientation", items: ["Build the first morning around Bangkok's major temple cluster.", "Use the river to change pace after the heat.", "Keep the first dinner close to the hotel or river route."] },
        { day: "Day 2", title: "Chinatown and food", items: ["Explore Yaowarat and nearby streets at a comfortable pace.", "Use a market or noodle stop for lunch.", "Return to the area after dark if the evening energy suits you."] },
        { day: "Day 3", title: "Siam and Sukhumvit", items: ["Use rail-connected modern Bangkok for malls, food halls, and shopping.", "Protect a long midday indoor break.", "Choose nightlife close to the hotel rather than crossing the city late."] },
        { day: "Day 4", title: "Flexible market, park, or riverside day", items: ["Pick one route based on weather and energy.", "Use the afternoon for a slower local experience.", "Keep the evening simple if the trip has been heat-heavy."] },
        { day: "Day 5", title: "Favorite repeat and departure buffer", items: ["Return to the neighborhood or meal you liked most.", "Leave room for shopping and weather changes.", "Plan the airport transfer with traffic risk in mind."] },
      ],
    },
    practicalInfo: [
      { name: "Dress and temple visits", description: "Plan respectful clothing for religious sites and check local guidance before entering. A temple day is easier when the route and clothing choices are decided in advance." },
      { name: "Payments", description: "Cards work in many hotels, malls, and restaurants, while markets and small food stalls often need cash. Carry a modest reserve without treating it as your only payment plan." },
      { name: "Heat management", description: "Start outdoor sightseeing early, keep water and breaks in the plan, and use malls or cafes as deliberate recovery points." },
      { name: "Traffic", description: "Traffic can turn a short map journey into a long one. Allow margin for airport and evening moves, and prefer rail or river routes when they fit." },
    ],
    faqs: [
      { name: "How many days do you need in Bangkok?", description: "Three days can cover temples, food, and modern neighborhoods. Five days works better if you want markets, slower breaks, and room for weather or traffic changes." },
      { name: "Is Bangkok a good budget destination?", description: "Local food and transport can be value-friendly, but hotels, flights, and premium nightlife change the whole-trip total. Check the complete estimate rather than judging by daily spend alone." },
      { name: "Where should first-time visitors stay?", description: "Sukhumvit is practical for rail and nightlife, the Old City suits temple-focused trips, and the Riverside suits travelers who prioritize atmosphere and views." },
      { name: "Is Bangkok difficult to get around?", description: "It is manageable when you combine rail, river, and selective car rides. Heat and traffic are the main reasons to keep each day geographically compact." },
    ],
  },
  singapore: {
    decisionLayer: {
      chooseIf: [
        "You want an easy first Southeast Asia stop with efficient transport, strong food, and distinct neighborhoods.",
        "You value predictable logistics and are willing to manage a higher accommodation cost for a short, organized trip.",
      ],
      avoidIf: [
        "Your priority is an ultra-budget trip or a rural, unstructured Southeast Asia experience.",
        "You want a large variety of remote nature or a destination where the main appeal is spontaneous road travel.",
      ],
      travelerFit: [
        { traveler: "First-time Southeast Asia traveler", fit: "good", reason: "Singapore provides a low-friction introduction to regional food, heritage neighborhoods, and tropical city life." },
        { traveler: "Family traveler", fit: "good", reason: "Compact routes, clear transport, and indoor alternatives make short family trips easier to organize." },
        { traveler: "Ultra-budget traveler", fit: "poor", reason: "Hawker food can help, but accommodation and paid attractions can raise the total quickly." },
        { traveler: "Rural escape traveler", fit: "poor", reason: "The product is a dense, polished city experience rather than a countryside base." },
      ],
      durationDecision: {
        threeDays: "Three days covers central sights, two heritage neighborhoods, and a focused food plan without needing to rush.",
        fiveDays: "Five days is useful for gardens, a selective attraction, slower neighborhood time, and weather-proof flexibility.",
        sevenPlusDays: "Seven or more days only makes sense if you prefer a very slow city stay or use Singapore as a base within a wider regional trip.",
      },
    },
    quickFacts: { bestTime: "February-April / June-August", currency: "SGD", airports: "SIN", bestFor: "Food · Design · Easy logistics" },
    overview: [
      "Singapore is a compact, highly organized city-state where food centers, neighborhoods, gardens, shopping, and modern architecture are unusually easy to combine. It is a strong first stop in Southeast Asia when the traveler wants clear logistics without giving up distinctive local experiences.",
      "The tradeoff is cost. Hotels and polished experiences can push the total higher than the map size suggests, so Singapore often works best as a focused three-to-five-day trip rather than an open-ended budget base. Its efficiency makes a short stay realistic; its price level rewards early planning.",
      "The city feels most complete when you move between different communities and environments: Chinatown, Little India, Kampong Gelam, hawker centers, waterfront architecture, and green spaces. That variety is the point, not simply collecting the newest skyline view.",
    ],
    thingSections: [
      { title: "Neighborhood identity", items: [
        { name: "Chinatown", description: "Chinatown combines heritage streets, temples, food, and modern dining in a compact area. It is an easy first stop because the history and the practical eating experience sit close together." },
        { name: "Little India", description: "Little India adds color, temples, textile shops, and strong food choices to the city model. It is best explored slowly, with attention to the neighborhood rather than only one landmark." },
        { name: "Kampong Gelam", description: "Kampong Gelam gives the trip a different architectural and social rhythm, with the mosque district, cafes, shops, and nearby Bugis movement. It is a good bridge between heritage and modern Singapore." },
      ]},
      { title: "Modern and green Singapore", items: [
        { name: "Marina Bay", description: "Marina Bay explains Singapore's polished, forward-looking side through waterfront walks, architecture, museums, and skyline views. Use it as an evening or half-day anchor rather than assuming it represents the whole city." },
        { name: "Gardens and green spaces", description: "Singapore's parks and gardens are not just decorative breaks. They make a compact itinerary feel less like a sequence of malls and provide a slower counterpoint to the dense central districts." },
        { name: "Sentosa or a selective attraction", description: "Add Sentosa or one major ticketed attraction only if it matches your trip. Families and resort-seeking travelers may value it; short culture-and-food trips may prefer another neighborhood day." },
      ]},
      { title: "Food as a city map", items: [
        { name: "Hawker centers", description: "Hawker centers are the most efficient way to understand Singapore's food identity. They let travelers sample several traditions at approachable prices and keep meals flexible between neighborhoods." },
        { name: "Kopitiam breakfast", description: "A simple coffee-shop breakfast gives the trip a local rhythm and makes an early sightseeing day easier. It is a useful contrast to polished hotel dining." },
        { name: "A destination dinner", description: "Choose one more deliberate meal for the trip, then keep other eating casual. This preserves budget flexibility in a city where a fully premium food plan can add up quickly." },
      ]},
    ],
    foods: [
      { name: "Hainanese chicken rice", description: "This is an easy first meal because it is recognizable, filling, and available in casual settings. Use it as an everyday anchor rather than assuming every meal needs to be a destination restaurant." },
      { name: "Laksa", description: "Laksa shows the city's layered food culture through spice, noodles, and rich broth. It works well as a focused lunch after exploring a heritage neighborhood." },
      { name: "Chilli crab or seafood", description: "A seafood meal can be a memorable splurge, but it is not necessary for the trip to feel complete. Treat it as a deliberate budget choice rather than a default nightly expense." },
      { name: "Kopi and kaya toast", description: "Kopi and kaya toast are useful for breakfast or a short afternoon reset. They fit naturally into a neighborhood day and show the city beyond its attractions." },
    ],
    neighborhoods: [
      { name: "Marina Bay / City Hall", bestFor: "Best for first-time convenience and polished stays", description: "This base makes major central sights and evening walks easy, with strong transport and hotel options. It is practical but can feel less intimate than the heritage districts." },
      { name: "Chinatown", bestFor: "Best for food, heritage, and central access", description: "Chinatown offers a strong balance of location, food, and atmosphere. It works especially well for travelers who want to step from hotel to hawker center or heritage street." },
      { name: "Little India", bestFor: "Best for character and food value", description: "Little India suits travelers who prefer a more textured neighborhood and strong casual food. It is lively and distinctive, though some visitors may prefer a quieter base." },
      { name: "Bugis / Kampong Gelam", bestFor: "Best for design, cafes, and central balance", description: "Bugis and Kampong Gelam connect shopping, heritage, cafes, and transport. They are a good middle ground for travelers who do not want a purely business-district stay." },
    ],
    gettingAround: [
      { name: "Airport to city", description: "Changi is well connected, and the transfer is one reason Singapore works for short trips. Still, match the hotel area to your evening plans rather than assuming every central district feels identical." },
      { name: "MRT first", description: "The MRT and walking cover most visitor plans efficiently. Heat and humidity can make the last stretch feel longer, so choose a hotel with a genuinely useful station nearby." },
      { name: "Combine nearby districts", description: "Chinatown, the civic district, and Marina Bay can combine naturally; Little India, Kampong Gelam, and Bugis form another useful cluster. Avoid turning every day into a full-city loop." },
      { name: "Car needed?", description: "No for a standard city trip. Taxis and rideshares are useful for luggage, rain, or a late return, but a rental car adds little value for most visitors." },
    ],
    bestTime: [
      { name: "Outdoor-friendly planning", description: "Singapore is warm year-round, so the best period depends more on your tolerance for heat, rain, and crowds than on a dramatic seasonal change. Plan outdoor sights early or late in the day." },
      { name: "Rain strategy", description: "Rain is easier to handle when the itinerary mixes hawker centers, museums, malls, and sheltered transport. A flexible sequence is more useful than chasing a perfect forecast." },
      { name: "Budget timing", description: "Because hotel cost can dominate the total, compare dates carefully and let current fares guide the TripFit decision. A slightly less popular week may improve the whole-trip result more than a minor local saving." },
    ],
    budget: [
      { name: "Budget traveler", description: "Stay near transport, use hawker centers, and treat ticketed attractions selectively. Singapore can be efficient on a budget, but accommodation is the pressure point to solve first." },
      { name: "Comfort traveler", description: "A central hotel, several neighborhood meals, and one or two polished attractions create a balanced trip. Avoid assuming the city's small size automatically makes it cheap." },
      { name: "Premium traveler", description: "Central hotels, rooftop views, destination restaurants, and private transfers can raise the total quickly. Compare the full flight-plus-stay picture before calling the trip realistic." },
    ],
    itineraries: {
      "3": [
        { day: "Day 1", title: "Chinatown and Marina Bay", items: ["Start with Chinatown's heritage streets and a hawker lunch.", "Walk toward the civic district or Marina Bay as the day cools.", "Use the waterfront for an evening view rather than adding another far attraction."] },
        { day: "Day 2", title: "Little India and Kampong Gelam", items: ["Explore the two heritage districts with time for food and cafes.", "Use Bugis as a practical connection point.", "Keep the evening flexible for a destination dinner or local meal."] },
        { day: "Day 3", title: "Gardens and a selective final experience", items: ["Choose gardens, a museum, or one ticketed attraction.", "Protect a midday indoor break.", "Return to the neighborhood or food style you liked most."] },
      ],
      "5": [
        { day: "Day 1", title: "Central Singapore orientation", items: ["Settle in and walk the civic district or Marina Bay.", "Use an easy hawker dinner to keep the first day flexible.", "Notice how transport and neighborhood scale work together."] },
        { day: "Day 2", title: "Chinatown and food", items: ["Spend the morning in Chinatown's heritage core.", "Use hawker centers for a varied lunch.", "Keep the afternoon open for museums or a slower cafe stop."] },
        { day: "Day 3", title: "Little India and Kampong Gelam", items: ["Explore both heritage areas without rushing between them.", "Build in a proper meal and a short rest.", "Use Bugis for evening shopping or transport."] },
        { day: "Day 4", title: "Gardens, Sentosa, or a modern attraction", items: ["Choose the experience that fits your travelers rather than adding all options.", "Plan around heat with an early start or late finish.", "Keep dinner close to the return route."] },
        { day: "Day 5", title: "Flexible food and neighborhood repeat", items: ["Return to a favorite hawker center or district.", "Leave room for shopping and airport preparation.", "Use the compact city to make the final day low stress."] },
      ],
    },
    practicalInfo: [
      { name: "Payments", description: "Cards are widely useful, but hawker centers and smaller vendors can vary. Carry a practical backup and check the payment setup before ordering a large meal." },
      { name: "Heat and rain", description: "Plan outdoor walking in shorter blocks and use sheltered stops deliberately. The weather is part of the itinerary design, not an afterthought." },
      { name: "Food etiquette", description: "Hawker centers are casual, but queues and table etiquette matter. Follow the local pace and avoid treating a busy stall like a restaurant with unlimited lingering space." },
      { name: "Short-trip strength", description: "Singapore's efficient transport makes three days viable, but a longer stay should add neighborhoods and nature rather than repeating only the central skyline." },
    ],
    faqs: [
      { name: "How many days are enough in Singapore?", description: "Three days works for central sights, heritage neighborhoods, and food. Five days gives room for gardens, a selective attraction, and slower neighborhood time." },
      { name: "Is Singapore expensive?", description: "It can be, mainly because of hotels and premium dining. Hawker food and transport can be manageable, so the total depends on where you stay and how you allocate paid experiences." },
      { name: "Where should first-time visitors stay?", description: "Marina Bay or City Hall maximize central convenience; Chinatown adds food and heritage; Bugis or Kampong Gelam adds more neighborhood character without losing transport." },
      { name: "Do I need a car in Singapore?", description: "No for most visitors. MRT, walking, and occasional rideshare cover the normal city itinerary more simply than a rental car." },
    ],
  },
  bali: {
    decisionLayer: {
      chooseIf: [
        "You want a flexible mix of beaches, culture, nature, food, and downtime rather than one urban itinerary.",
        "You are comfortable choosing one or two bases and treating transfer time as part of the trip budget.",
      ],
      avoidIf: [
        "You have only a few days and expect the whole island to be easy to cover from one hotel.",
        "You want a compact, highly walkable city or a trip with no traffic and transfer uncertainty.",
      ],
      travelerFit: [
        { traveler: "Beach and nature traveler", fit: "good", reason: "Different coastal and inland bases let you build a trip around scenery and recovery time." },
        { traveler: "Couple or flexible slow traveler", fit: "good", reason: "Bali rewards a deliberate rhythm of nearby experiences, meals, and unstructured evenings." },
        { traveler: "Short city-break traveler", fit: "poor", reason: "The island's appeal is spread across regions, so a very short trip needs a narrow focus." },
        { traveler: "Traveler unwilling to plan transport", fit: "poor", reason: "Road time and base choice materially affect what the trip feels like." },
      ],
      durationDecision: {
        threeDays: "Three days works only when you choose one base and one clear focus, such as Ubud culture or a southern beach area.",
        fiveDays: "Five days can support two contrasting bases if the transfer follows a sensible route and does not consume the trip.",
        sevenPlusDays: "Seven or more days benefits travelers who want both inland and coast time, slower mornings, and room for weather or road delays.",
      },
    },
    quickFacts: { bestTime: "April-October", currency: "IDR", airports: "DPS", bestFor: "Beach · Nature · Culture" },
    overview: [
      "Bali is not one compact destination. Ubud, the southern beach areas, Uluwatu, Sanur, and the quieter interior each create a different trip, and the time spent moving between them is part of the budget and itinerary decision.",
      "The island works especially well for travelers who want to mix nature, food, culture, beaches, and downtime. It is less ideal for a tightly packed city break or anyone expecting every attraction to be close enough for casual walking. A realistic Bali plan chooses one or two bases instead of trying to cover the whole island in a few days.",
      "Bali's strongest moments often come from the contrast between places: a temple or rice-terrace morning, a slow cafe lunch, a beach or sunset afternoon, and a dinner near the hotel. That rhythm is more useful than a long list of landmarks spread across traffic-heavy routes.",
    ],
    thingSections: [
      { title: "Culture and inland Bali", items: [
        { name: "Ubud and its surrounding landscape", description: "Ubud is the island's clearest base for art, temples, craft, cafes, and rice-terrace scenery. It suits travelers who want a cultural and slower side of Bali, but it is not a beach base." },
        { name: "Water temples and local rituals", description: "Bali's temples make more sense when approached as living places of worship rather than photo stops. Dress respectfully, follow local access rules, and leave time to understand the setting instead of rushing between sites." },
        { name: "Rice terraces and rural roads", description: "The inland landscape is one of Bali's distinctive experiences, especially for travelers who want scenery beyond beaches. Build these stops around a sensible route because road time can be longer than the map suggests." },
      ]},
      { title: "Coast and outdoor time", items: [
        { name: "Uluwatu cliffs and beaches", description: "Uluwatu suits travelers who want dramatic cliffs, surf, sunsets, and a more southern coastal base. It is visually strong but scattered, so transport and hotel location matter." },
        { name: "Seminyak and Canggu", description: "These areas combine restaurants, cafes, beach clubs, and social energy. They work for travelers who want convenience and nightlife, but can feel busy and traffic-heavy when the trip goal is quiet nature." },
        { name: "Sanur and a slower coast", description: "Sanur is useful for a gentler beach rhythm and easier mornings. It can be a better fit for families, older travelers, or anyone who wants the coast without the intensity of the busiest southern areas." },
      ]},
      { title: "Food and island rhythm", items: [
        { name: "Warungs and local meals", description: "Small local restaurants are one of the easiest ways to keep Bali personal and affordable. Use them alongside a few destination meals rather than making every evening a resort experience." },
        { name: "Cafe and wellness stops", description: "Bali's cafe and wellness culture is part of how many travelers pace the island. It works when treated as recovery and atmosphere, not as a reason to cross the island for one highly rated venue." },
        { name: "Sunset and flexible evenings", description: "A good Bali evening often needs little more than a nearby beach, a meal, and time without another transfer. Leave room for weather and traffic instead of scheduling every sunset from the opposite coast." },
      ]},
    ],
    foods: [
      { name: "Nasi campur", description: "Nasi campur is a useful introduction to local flavors because one plate can include several preparations. It works well for a casual lunch between inland or neighborhood stops." },
      { name: "Babi guling", description: "Babi guling is a destination-specific meal for travelers who eat pork and want to try a Balinese specialty. Treat it as a planned lunch rather than assuming it will be available everywhere." },
      { name: "Satay and grilled seafood", description: "Satay and seafood fit naturally into beach and evening plans. Choose the setting based on the day: a casual local meal often makes more sense than crossing the island for a single restaurant." },
      { name: "Fruit, coffee, and breakfast", description: "Fruit, Indonesian coffee, and simple breakfasts help create the slower pace many travelers want from Bali. They are also useful on early starts for temples, scenery, or boat connections." },
    ],
    neighborhoods: [
      { name: "Ubud", bestFor: "Best for culture, cafes, and rice terraces", description: "Ubud is the strongest inland base for art, temples, craft, and slower days. Traffic can still be frustrating, and beach-focused travelers should not use it as their only base." },
      { name: "Uluwatu / Bukit", bestFor: "Best for cliffs, surf, and sunsets", description: "The southern peninsula creates a dramatic coastal trip and suits travelers who want beaches and views. Distances between venues are real, so choose the hotel around the experience you actually want." },
      { name: "Seminyak", bestFor: "Best for restaurants, shopping, and polished beach stays", description: "Seminyak offers a broad choice of dining, cafes, and beach-club style experiences. It is convenient but busier and often less restful than Sanur or a quieter inland base." },
      { name: "Canggu", bestFor: "Best for cafes, surf, and social energy", description: "Canggu suits travelers who want a younger, cafe-heavy, surf-adjacent scene. Traffic and rapid development are tradeoffs, especially when the itinerary assumes easy movement." },
      { name: "Sanur", bestFor: "Best for calmer coast time and easy mornings", description: "Sanur is a gentler coastal base that works well for families, older travelers, and travelers who want less nightlife pressure. It may feel too quiet if social evenings are the main goal." },
    ],
    gettingAround: [
      { name: "Airport to base", description: "DPS arrival time depends heavily on where you stay and current road conditions. Choose the first base before booking the airport transfer, and do not assume Ubud or the southern beaches are equally close." },
      { name: "Car or driver planning", description: "A car with a driver or selective rides are common for longer sightseeing days because attractions are spread out. Self-driving can add stress, especially for first-time visitors unfamiliar with local traffic patterns." },
      { name: "One base versus two", description: "For a short trip, one base often produces a better experience than spending hours changing hotels. Five days can support two bases if the transfer is part of a logical route rather than a detour." },
      { name: "Walkability", description: "Some neighborhoods are pleasant on foot, but Bali is not one uniformly walkable city. Treat hotel location, road conditions, heat, and transfer time as part of the destination choice." },
    ],
    bestTime: [
      { name: "Drier months", description: "April through October is often preferred for beach, outdoor, and scenic plans. Demand can rise in popular periods, so the best weather window is not automatically the best whole-trip budget fit." },
      { name: "Rainy-season tradeoffs", description: "Rain can create flexible, slower days around cafes, food, spas, and nearby culture. It is less suitable when the trip depends on a tightly scheduled run of beaches, boat connections, or outdoor scenery." },
      { name: "Crowds and local rhythm", description: "Peak periods change the feel of popular southern areas and can increase road pressure. Choose quieter bases or shoulder timing if a relaxed trip matters more than perfect weather." },
    ],
    budget: [
      { name: "Budget traveler", description: "Choose one well-placed base, use local warungs, and spend on the experiences that define your trip. Transfer days and accommodation style usually matter more than small daily food differences." },
      { name: "Comfort traveler", description: "A two-base plan, selective drivers, and a mix of local and destination dining can create a comfortable island trip. Keep transfer time visible because an inexpensive hotel can still be costly in lost days." },
      { name: "Premium traveler", description: "Villas, beach clubs, private drivers, and high-demand coastal stays can move the total quickly. Compare the full trip from your origin rather than judging Bali only by local prices." },
    ],
    itineraries: {
      "3": [
        { day: "Day 1", title: "Choose one base and settle into it", items: ["Keep arrival logistics simple and explore the immediate neighborhood.", "Use a nearby meal and a slow afternoon rather than crossing the island.", "Let the first evening establish whether the base suits your pace."] },
        { day: "Day 2", title: "Culture or coast, not both at full distance", items: ["Choose Ubud culture and scenery or a southern beach route.", "Group stops around one road corridor.", "Leave time for a proper meal and weather changes."] },
        { day: "Day 3", title: "A nearby highlight and flexible finish", items: ["Pick one final experience close to the base.", "Use the afternoon for food, beach, cafe, or a slower walk.", "Keep airport timing conservative."] },
      ],
      "5": [
        { day: "Day 1", title: "Arrive and settle into the first base", items: ["Choose a nearby meal and low-pressure walk.", "Avoid scheduling a distant sunset after a long flight.", "Use the evening to learn the local transfer rhythm."] },
        { day: "Day 2", title: "Inland culture or southern coast", items: ["Build a route around Ubud temples and scenery, or a coherent beach corridor.", "Keep road time visible in the plan.", "End near the base rather than chasing a second coast."] },
        { day: "Day 3", title: "Food, wellness, and local pace", items: ["Use cafes, warungs, markets, or a wellness stop as the day's texture.", "Add one nearby cultural or scenic experience.", "Protect the slower rhythm that makes Bali appealing."] },
        { day: "Day 4", title: "Second base or signature experience", items: ["Change bases only if it creates a meaningful new experience.", "Use the transfer route to include one sensible stop.", "Keep the evening close to the new hotel."] },
        { day: "Day 5", title: "Favorite coast, food, or flexible buffer", items: ["Return to the experience that best matched your travel style.", "Leave room for weather and traffic.", "Plan departure logistics before the last evening."] },
      ],
    },
    practicalInfo: [
      { name: "Respectful visits", description: "Temples are active religious places. Follow clothing, access, and photography guidance, and treat ceremonies and residential areas as more than scenery." },
      { name: "Payments", description: "Cards are useful in hotels and established businesses, while local food and smaller vendors vary. Keep a practical cash backup and confirm costs before a longer transfer." },
      { name: "Transfer fatigue", description: "Bali can look compact on a map but feel slow on the road. Protect one-base days and avoid building the whole trip around distant single stops." },
      { name: "Connectivity", description: "Navigation and messaging are helpful for drivers, hotel arrivals, and changing plans. Save addresses and pickup details before leaving reliable Wi-Fi." },
    ],
    faqs: [
      { name: "How many days are enough for Bali?", description: "Three days works best with one base and a clear focus. Five days can support two contrasting areas, but only if the transfer creates real value." },
      { name: "Is Bali good for a budget trip?", description: "Local food and a range of accommodation can be value-friendly, but flights, villas, drivers, and lost transfer time change the whole-trip answer." },
      { name: "Where should first-time visitors stay?", description: "Ubud suits culture and inland scenery; Uluwatu suits cliffs and surf; Seminyak or Canggu suit food and social energy; Sanur suits calmer coast time." },
      { name: "Do I need a car in Bali?", description: "Most visitors benefit from selective rides or a driver for spread-out sightseeing. Self-driving is not the easiest default for a first trip, especially when the itinerary crosses regions." },
    ],
  },
};
