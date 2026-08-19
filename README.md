# WhereAtlas

An MVP English travel feasibility recommendation site.

Repository history and Git remote name remain unchanged.

Core question:

> Where can your passport and budget take you?

The product recommends 3-5 realistic destinations from a deliberately limited
MVP dataset using:

- Passport entry status
- Departure city / airport with IATA routing
- Total trip budget
- Trip length
- Optional quiz preference

It intentionally avoids user accounts, saved trips, live flight search, a global
visa database, CMS, subscriptions, or large-scale pSEO.

## Pages

- `/`
- `/quiz`
- `/destinations`
- `/destinations/[id]`
- `/visa-free-countries/uk-passport`
- `/visa-free-countries/indian-passport`
- `/methodology`
- `/affiliate-disclosure`

## Development

```bash
npm run dev
npm run build
npm test
```

Flight and hotel CTAs are implemented as replaceable affiliate components.
Cached fare references are estimates only and do not guarantee live prices.
