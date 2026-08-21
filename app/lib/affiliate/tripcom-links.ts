export type AffiliateLink = {
  type: "hotel" | "flight";
  origin: string | null;
  destination: string;
  tripSub1: string;
  url: string;
};

export const officialTripComLinks: AffiliateLink[] = [
  {
    "type": "hotel",
    "origin": null,
    "destination": "Tokyo",
    "tripSub1": "guide_tokyo_hotels",
    "url": "https://sg.trip.com/hotels/list?city=228&display=Tokyo&optionId=228&optionType=City&optionName=Tokyo&Allianceid=10173661&SID=328960094&trip_sub1=guide_tokyo_hotels&trip_sub3=D19367728"
  },
  {
    "type": "flight",
    "origin": "London",
    "destination": "Tokyo",
    "tripSub1": "guide_london_tokyo_flights",
    "url": "https://sg.trip.com/flights/London-to-Tokyo/tickets-LON-TYO?flighttype=S&dcity=LON&acity=TYO&Allianceid=10173661&SID=328960094&trip_sub1=guide_london_tokyo_flights&trip_sub3=D19382841"
  },
  {
    "type": "flight",
    "origin": "Delhi",
    "destination": "Tokyo",
    "tripSub1": "guide_delhi_tokyo_flights",
    "url": "https://sg.trip.com/flights/New%20Delhi-to-Tokyo/tickets-DEL-TYO?flighttype=S&dcity=DEL&acity=TYO&Allianceid=10173661&SID=328960094&trip_sub1=guide_delhi_tokyo_flights&trip_sub3=D19382883"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Bangkok",
    "tripSub1": "guide_bangkok_hotels",
    "url": "https://sg.trip.com/hotels/list?city=359&display=Bangkok&optionId=359&optionType=City&optionName=Bangkok&Allianceid=10173661&SID=328960094&trip_sub1=guide_bangkok_hotels&trip_sub3=D19381427"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Mexico City",
    "tripSub1": "guide_mexico_city_hotels",
    "url": "https://sg.trip.com/hotels/list?city=691&display=Mexico%20City&optionId=691&optionType=City&optionName=Mexico%20City&Allianceid=10173661&SID=328960094&trip_sub1=guide_mexico_city_hotels&trip_sub3=D19381427"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Cancun",
    "tripSub1": "guide_cancun_hotels",
    "url": "https://sg.trip.com/hotels/list?city=812&display=Cancun&optionId=812&optionType=City&optionName=Cancun&Allianceid=10173661&SID=328960094&trip_sub1=guide_cancun_hotels&trip_sub3=D19381427"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Lisbon",
    "tripSub1": "guide_lisbon_hotels",
    "url": "https://sg.trip.com/hotels/list?city=1231&display=Lisbon&optionId=1231&optionType=City&optionName=Lisbon&Allianceid=10173661&SID=328960094&trip_sub1=guide_lisbon_hotels&trip_sub3=D19381427"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Barcelona",
    "tripSub1": "guide_barcelona_hotels",
    "url": "https://sg.trip.com/hotels/list?city=40795&display=Barcelona&optionId=40795&optionType=City&optionName=Barcelona&Allianceid=10173661&SID=328960094&trip_sub1=guide_barcelona_hotels&trip_sub3=D19381427"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Rome",
    "tripSub1": "guide_rome_hotels",
    "url": "https://sg.trip.com/hotels/list?city=343&display=Rome&optionId=343&optionType=City&optionName=Rome&Allianceid=10173661&SID=328960094&trip_sub1=guide_rome_hotels&trip_sub3=D19381427"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Paris",
    "tripSub1": "guide_paris_hotels",
    "url": "https://sg.trip.com/hotels/list?city=192&display=Paris&optionId=192&optionType=City&optionName=Paris&Allianceid=10173661&SID=328960094&trip_sub1=guide_paris_hotels&trip_sub3=D19381427"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Athens",
    "tripSub1": "guide_athens_hotels",
    "url": "https://sg.trip.com/hotels/list?city=710&display=Athens&optionId=710&optionType=City&optionName=Athens&Allianceid=10173661&SID=328960094&trip_sub1=guide_athens_hotels&trip_sub3=D19381427"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Istanbul",
    "tripSub1": "guide_istanbul_hotels",
    "url": "https://sg.trip.com/hotels/list?city=532&display=Istanbul&optionId=532&optionType=City&optionName=Istanbul&Allianceid=10173661&SID=328960094&trip_sub1=guide_istanbul_hotels&trip_sub3=D19381427"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Seoul",
    "tripSub1": "guide_seoul_hotels",
    "url": "https://sg.trip.com/hotels/list?city=274&display=Seoul&optionId=274&optionType=City&optionName=Seoul&Allianceid=10173661&SID=328960094&trip_sub1=guide_seoul_hotels&trip_sub3=D19381427"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Singapore",
    "tripSub1": "guide_singapore_hotels",
    "url": "https://sg.trip.com/hotels/list?city=73&display=Singapore&optionId=73&optionType=City&optionName=Singapore&Allianceid=10173661&SID=328960094&trip_sub1=guide_singapore_hotels&trip_sub3=D19381427"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Bali",
    "tripSub1": "guide_bali_hotels",
    "url": "https://sg.trip.com/hotels/list?city=723&display=Bali&optionId=723&optionType=City&optionName=Bali&Allianceid=10173661&SID=328960094&trip_sub1=guide_bali_hotels&trip_sub3=D19381427"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Ho Chi Minh City",
    "tripSub1": "guide_ho_chi_minh_city_hotels",
    "url": "https://sg.trip.com/hotels/list?city=301&display=Ho%20Chi%20Minh%20City&optionId=301&optionType=City&optionName=Ho%20Chi%20Minh%20City&Allianceid=10173661&SID=328960094&trip_sub1=guide_ho_chi_minh_city_hotels&trip_sub3=D19381427"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Dubai",
    "tripSub1": "guide_dubai_hotels",
    "url": "https://sg.trip.com/hotels/list?city=220&display=Dubai&optionId=220&optionType=City&optionName=Dubai&Allianceid=10173661&SID=328960094&trip_sub1=guide_dubai_hotels&trip_sub3=D19381427"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Marrakesh",
    "tripSub1": "guide_marrakesh_hotels",
    "url": "https://sg.trip.com/hotels/list?city=1360&display=Marrakech&optionId=1360&optionType=City&optionName=Marrakech&Allianceid=10173661&SID=328960094&trip_sub1=guide_marrakesh_hotels&trip_sub3=D19381427"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "London",
    "tripSub1": "guide_london_hotels",
    "url": "https://sg.trip.com/hotels/list?city=338&display=London&optionId=338&optionType=City&optionName=London&Allianceid=10173661&SID=328960094&trip_sub1=guide_london_hotels&trip_sub3=D19381448"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Amsterdam",
    "tripSub1": "guide_amsterdam_hotels",
    "url": "https://sg.trip.com/hotels/list?city=176&display=Amsterdam&optionId=176&optionType=City&optionName=Amsterdam&Allianceid=10173661&SID=328960094&trip_sub1=guide_amsterdam_hotels&trip_sub3=D19381448"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Berlin",
    "tripSub1": "guide_berlin_hotels",
    "url": "https://sg.trip.com/hotels/list?city=193&display=Berlin&optionId=193&optionType=City&optionName=Berlin&Allianceid=10173661&SID=328960094&trip_sub1=guide_berlin_hotels&trip_sub3=D19381448"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Prague",
    "tripSub1": "guide_prague_hotels",
    "url": "https://sg.trip.com/hotels/list?city=1288&display=Prague&optionId=1288&optionType=City&optionName=Prague&Allianceid=10173661&SID=328960094&trip_sub1=guide_prague_hotels&trip_sub3=D19381448"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Budapest",
    "tripSub1": "guide_budapest_hotels",
    "url": "https://sg.trip.com/hotels/list?city=637&display=Budapest&optionId=637&optionType=City&optionName=Budapest&Allianceid=10173661&SID=328960094&trip_sub1=guide_budapest_hotels&trip_sub3=D19381448"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Copenhagen",
    "tripSub1": "guide_copenhagen_hotels",
    "url": "https://sg.trip.com/hotels/list?city=260&display=Copenhagen&optionId=260&optionType=City&optionName=Copenhagen&Allianceid=10173661&SID=328960094&trip_sub1=guide_copenhagen_hotels&trip_sub3=D19381448"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Dublin",
    "tripSub1": "guide_dublin_hotels",
    "url": "https://sg.trip.com/hotels/list?city=803&display=Dublin&optionId=803&optionType=City&optionName=Dublin&Allianceid=10173661&SID=328960094&trip_sub1=guide_dublin_hotels&trip_sub3=D19381448"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "New York",
    "tripSub1": "guide_new_york_hotels",
    "url": "https://sg.trip.com/hotels/list?city=633&display=New%20York&optionId=633&optionType=City&optionName=New%20York&Allianceid=10173661&SID=328960094&trip_sub1=guide_new_york_hotels&trip_sub3=D19381448"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Miami",
    "tripSub1": "guide_miami_hotels",
    "url": "https://sg.trip.com/hotels/list?city=25773&display=Miami&optionId=25773&optionType=City&optionName=Miami&Allianceid=10173661&SID=328960094&trip_sub1=guide_miami_hotels&trip_sub3=D19381448"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Montreal",
    "tripSub1": "guide_montreal_hotels",
    "url": "https://sg.trip.com/hotels/list?city=759&display=Montreal&optionId=759&optionType=City&optionName=Montreal&Allianceid=10173661&SID=328960094&trip_sub1=guide_montreal_hotels&trip_sub3=D19381448"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Vancouver",
    "tripSub1": "guide_vancouver_hotels",
    "url": "https://sg.trip.com/hotels/list?city=476&display=Vancouver&optionId=476&optionType=City&optionName=Vancouver&Allianceid=10173661&SID=328960094&trip_sub1=guide_vancouver_hotels&trip_sub3=D19381448"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Cartagena",
    "tripSub1": "guide_cartagena_hotels",
    "url": "https://sg.trip.com/hotels/list?city=5123&display=Cartagena&optionId=5123&optionType=City&optionName=Cartagena&Allianceid=10173661&SID=328960094&trip_sub1=guide_cartagena_hotels&trip_sub3=D19381448"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Medellin",
    "tripSub1": "guide_medellin_hotels",
    "url": "https://sg.trip.com/hotels/list?city=7434&display=Medellin&optionId=7434&optionType=City&optionName=Medellin&Allianceid=10173661&SID=328960094&trip_sub1=guide_medellin_hotels&trip_sub3=D19381448"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Buenos Aires",
    "tripSub1": "guide_buenos_aires_hotels",
    "url": "https://sg.trip.com/hotels/list?city=807&display=Buenos%20Aires&optionId=807&optionType=City&optionName=Buenos%20Aires&Allianceid=10173661&SID=328960094&trip_sub1=guide_buenos_aires_hotels&trip_sub3=D19381448"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Lima",
    "tripSub1": "guide_lima_hotels",
    "url": "https://sg.trip.com/hotels/list?city=837&display=Lima&optionId=837&optionType=City&optionName=Lima&Allianceid=10173661&SID=328960094&trip_sub1=guide_lima_hotels&trip_sub3=D19381448"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Santiago",
    "tripSub1": "guide_santiago_hotels",
    "url": "https://sg.trip.com/hotels/list?city=852&display=Santiago&optionId=852&optionType=City&optionName=Santiago&Allianceid=10173661&SID=328960094&trip_sub1=guide_santiago_hotels&trip_sub3=D19381448"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Nairobi",
    "tripSub1": "guide_nairobi_hotels",
    "url": "https://sg.trip.com/hotels/list?city=825&display=Nairobi&optionId=825&optionType=City&optionName=Nairobi&Allianceid=10173661&SID=328960094&trip_sub1=guide_nairobi_hotels&trip_sub3=D19382841"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Sydney",
    "tripSub1": "guide_sydney_hotels",
    "url": "https://sg.trip.com/hotels/list?city=501&display=Sydney&optionId=501&optionType=City&optionName=Sydney&Allianceid=10173661&SID=328960094&trip_sub1=guide_sydney_hotels&trip_sub3=D19382841"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Queenstown",
    "tripSub1": "guide_queenstown_hotels",
    "url": "https://sg.trip.com/hotels/list?city=3860&display=Queenstown&optionId=3860&optionType=City&optionName=Queenstown&Allianceid=10173661&SID=328960094&trip_sub1=guide_queenstown_hotels&trip_sub3=D19382841"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Malé",
    "tripSub1": "guide_maldives_hotels",
    "url": "https://sg.trip.com/hotels/list?city=1207&display=Mal%C3%A9&optionId=1207&optionType=City&optionName=Mal%C3%A9&Allianceid=10173661&SID=328960094&trip_sub1=guide_maldives_hotels&trip_sub3=D19382841"
  },
  {
    "type": "flight",
    "origin": "London",
    "destination": "Paris",
    "tripSub1": "guide_london_paris_flights",
    "url": "https://sg.trip.com/flights/London-to-Paris/tickets-LON-PAR?flighttype=S&dcity=LON&acity=PAR&Allianceid=10173661&SID=328960094&trip_sub1=guide_london_paris_flights&trip_sub3=D19382841"
  },
  {
    "type": "flight",
    "origin": "London",
    "destination": "Rome",
    "tripSub1": "guide_london_rome_flights",
    "url": "https://sg.trip.com/flights/London-to-Rome/tickets-LON-ROM?flighttype=S&dcity=LON&acity=ROM&Allianceid=10173661&SID=328960094&trip_sub1=guide_london_rome_flights&trip_sub3=D19382841"
  },
  {
    "type": "flight",
    "origin": "London",
    "destination": "Bali",
    "tripSub1": "guide_london_bali_flights",
    "url": "https://sg.trip.com/flights/London-to-Bali/tickets-LON-DPS?flighttype=S&dcity=LON&acity=DPS&Allianceid=10173661&SID=328960094&trip_sub1=guide_london_bali_flights&trip_sub3=D19382841"
  },
  {
    "type": "flight",
    "origin": "London",
    "destination": "Singapore",
    "tripSub1": "guide_london_singapore_flights",
    "url": "https://sg.trip.com/flights/London-to-Singapore/tickets-LON-SIN?flighttype=S&dcity=LON&acity=SIN&Allianceid=10173661&SID=328960094&trip_sub1=guide_london_singapore_flights&trip_sub3=D19382841"
  },
  {
    "type": "hotel",
    "origin": null,
    "destination": "Cape Town",
    "tripSub1": "guide_cape_town_hotels",
    "url": "https://sg.trip.com/hotels/list?city=683&display=Cape%20Town&optionId=683&optionType=City&optionName=Cape%20Town&Allianceid=10173661&SID=328960094&trip_sub1=guide_cape_town_hotels&trip_sub3=D19382862"
  },
  {
    "type": "flight",
    "origin": "London",
    "destination": "Bangkok",
    "tripSub1": "guide_london_bangkok_flights",
    "url": "https://sg.trip.com/flights/London-to-Bangkok/tickets-LON-BKK?flighttype=S&dcity=LON&acity=BKK&Allianceid=10173661&SID=328960094&trip_sub1=guide_london_bangkok_flights&trip_sub3=D19382862"
  },
  {
    "type": "flight",
    "origin": "London",
    "destination": "Seoul",
    "tripSub1": "guide_london_seoul_flights",
    "url": "https://sg.trip.com/flights/London-to-Seoul/tickets-LON-SEL?flighttype=S&dcity=LON&acity=SEL&Allianceid=10173661&SID=328960094&trip_sub1=guide_london_seoul_flights&trip_sub3=D19382862"
  },
  {
    "type": "flight",
    "origin": "London",
    "destination": "Dubai",
    "tripSub1": "guide_london_dubai_flights",
    "url": "https://sg.trip.com/flights/London-to-Dubai/tickets-LON-DXB?flighttype=S&dcity=LON&acity=DXB&Allianceid=10173661&SID=328960094&trip_sub1=guide_london_dubai_flights&trip_sub3=D19382862"
  },
  {
    "type": "flight",
    "origin": "London",
    "destination": "Cancun",
    "tripSub1": "guide_london_cancun_flights",
    "url": "https://sg.trip.com/flights/London-to-Cancun/tickets-LON-CUN?flighttype=S&dcity=LON&acity=CUN&Allianceid=10173661&SID=328960094&trip_sub1=guide_london_cancun_flights&trip_sub3=D19382862"
  },
  {
    "type": "flight",
    "origin": "New York",
    "destination": "Tokyo",
    "tripSub1": "guide_new_york_tokyo_flights",
    "url": "https://sg.trip.com/flights/New%20York-to-Tokyo/tickets-NYC-TYO?flighttype=S&dcity=NYC&acity=TYO&Allianceid=10173661&SID=328960094&trip_sub1=guide_new_york_tokyo_flights&trip_sub3=D19382862"
  },
  {
    "type": "flight",
    "origin": "New York",
    "destination": "Bangkok",
    "tripSub1": "guide_new_york_bangkok_flights",
    "url": "https://sg.trip.com/flights/New%20York-to-Bangkok/tickets-NYC-BKK?flighttype=S&dcity=NYC&acity=BKK&Allianceid=10173661&SID=328960094&trip_sub1=guide_new_york_bangkok_flights&trip_sub3=D19382862"
  },
  {
    "type": "flight",
    "origin": "New York",
    "destination": "Paris",
    "tripSub1": "guide_new_york_paris_flights",
    "url": "https://sg.trip.com/flights/New%20York-to-Paris/tickets-NYC-PAR?flighttype=S&dcity=NYC&acity=PAR&Allianceid=10173661&SID=328960094&trip_sub1=guide_new_york_paris_flights&trip_sub3=D19382862"
  },
  {
    "type": "flight",
    "origin": "New York",
    "destination": "Rome",
    "tripSub1": "guide_new_york_rome_flights",
    "url": "https://sg.trip.com/flights/New%20York-to-Rome/tickets-NYC-ROM?flighttype=S&dcity=NYC&acity=ROM&Allianceid=10173661&SID=328960094&trip_sub1=guide_new_york_rome_flights&trip_sub3=D19382862"
  },
  {
    "type": "flight",
    "origin": "New York",
    "destination": "Bali",
    "tripSub1": "guide_new_york_bali_flights",
    "url": "https://sg.trip.com/flights/New%20York-to-Bali/tickets-NYC-DPS?flighttype=S&dcity=NYC&acity=DPS&Allianceid=10173661&SID=328960094&trip_sub1=guide_new_york_bali_flights&trip_sub3=D19382862"
  },
  {
    "type": "flight",
    "origin": "New York",
    "destination": "Singapore",
    "tripSub1": "guide_new_york_singapore_flights",
    "url": "https://sg.trip.com/flights/New%20York-to-Singapore/tickets-NYC-SIN?flighttype=S&dcity=NYC&acity=SIN&Allianceid=10173661&SID=328960094&trip_sub1=guide_new_york_singapore_flights&trip_sub3=D19382883"
  },
  {
    "type": "flight",
    "origin": "New York",
    "destination": "Seoul",
    "tripSub1": "guide_new_york_seoul_flights",
    "url": "https://sg.trip.com/flights/New%20York-to-Seoul/tickets-NYC-SEL?flighttype=S&dcity=NYC&acity=SEL&Allianceid=10173661&SID=328960094&trip_sub1=guide_new_york_seoul_flights&trip_sub3=D19382883"
  },
  {
    "type": "flight",
    "origin": "New York",
    "destination": "Dubai",
    "tripSub1": "guide_new_york_dubai_flights",
    "url": "https://sg.trip.com/flights/New%20York-to-Dubai/tickets-NYC-DXB?flighttype=S&dcity=NYC&acity=DXB&Allianceid=10173661&SID=328960094&trip_sub1=guide_new_york_dubai_flights&trip_sub3=D19382883"
  },
  {
    "type": "flight",
    "origin": "New York",
    "destination": "Cancun",
    "tripSub1": "guide_new_york_cancun_flights",
    "url": "https://sg.trip.com/flights/New%20York-to-Cancun/tickets-NYC-CUN?flighttype=S&dcity=NYC&acity=CUN&Allianceid=10173661&SID=328960094&trip_sub1=guide_new_york_cancun_flights&trip_sub3=D19382883"
  },
  {
    "type": "flight",
    "origin": "Delhi",
    "destination": "Bangkok",
    "tripSub1": "guide_delhi_bangkok_flights",
    "url": "https://sg.trip.com/flights/New%20Delhi-to-Bangkok/tickets-DEL-BKK?flighttype=S&dcity=DEL&acity=BKK&Allianceid=10173661&SID=328960094&trip_sub1=guide_delhi_bangkok_flights&trip_sub3=D19382883"
  },
  {
    "type": "flight",
    "origin": "Delhi",
    "destination": "Paris",
    "tripSub1": "guide_delhi_paris_flights",
    "url": "https://sg.trip.com/flights/New%20Delhi-to-Paris/tickets-DEL-PAR?flighttype=S&dcity=DEL&acity=PAR&Allianceid=10173661&SID=328960094&trip_sub1=guide_delhi_paris_flights&trip_sub3=D19382883"
  },
  {
    "type": "flight",
    "origin": "Delhi",
    "destination": "Rome",
    "tripSub1": "guide_delhi_rome_flights",
    "url": "https://sg.trip.com/flights/New%20Delhi-to-Rome/tickets-DEL-ROM?flighttype=S&dcity=DEL&acity=ROM&Allianceid=10173661&SID=328960094&trip_sub1=guide_delhi_rome_flights&trip_sub3=D19382883"
  },
  {
    "type": "flight",
    "origin": "Delhi",
    "destination": "Bali",
    "tripSub1": "guide_delhi_bali_flights",
    "url": "https://sg.trip.com/flights/New%20Delhi-to-Bali/tickets-DEL-DPS?flighttype=S&dcity=DEL&acity=DPS&Allianceid=10173661&SID=328960094&trip_sub1=guide_delhi_bali_flights&trip_sub3=D19382883"
  },
  {
    "type": "flight",
    "origin": "Delhi",
    "destination": "Singapore",
    "tripSub1": "guide_delhi_singapore_flights",
    "url": "https://sg.trip.com/flights/New%20Delhi-to-Singapore/tickets-DEL-SIN?flighttype=S&dcity=DEL&acity=SIN&Allianceid=10173661&SID=328960094&trip_sub1=guide_delhi_singapore_flights&trip_sub3=D19382883"
  },
  {
    "type": "flight",
    "origin": "Delhi",
    "destination": "Seoul",
    "tripSub1": "guide_delhi_seoul_flights",
    "url": "https://sg.trip.com/flights/New%20Delhi-to-Seoul/tickets-DEL-SEL?flighttype=S&dcity=DEL&acity=SEL&Allianceid=10173661&SID=328960094&trip_sub1=guide_delhi_seoul_flights&trip_sub3=D19382939"
  },
  {
    "type": "flight",
    "origin": "Delhi",
    "destination": "Dubai",
    "tripSub1": "guide_delhi_dubai_flights",
    "url": "https://sg.trip.com/flights/New%20Delhi-to-Dubai/tickets-DEL-DXB?flighttype=S&dcity=DEL&acity=DXB&Allianceid=10173661&SID=328960094&trip_sub1=guide_delhi_dubai_flights&trip_sub3=D19382939"
  },
  {
    "type": "flight",
    "origin": "Delhi",
    "destination": "Cancun",
    "tripSub1": "guide_delhi_cancun_flights",
    "url": "https://sg.trip.com/flights/New%20Delhi-to-Cancun/tickets-DEL-CUN?flighttype=S&dcity=DEL&acity=CUN&Allianceid=10173661&SID=328960094&trip_sub1=guide_delhi_cancun_flights&trip_sub3=D19382939"
  },
  {
    "type": "flight",
    "origin": "Singapore",
    "destination": "Tokyo",
    "tripSub1": "guide_singapore_tokyo_flights",
    "url": "https://sg.trip.com/flights/Singapore-to-Tokyo/tickets-SIN-TYO?flighttype=S&dcity=SIN&acity=TYO&Allianceid=10173661&SID=328960094&trip_sub1=guide_singapore_tokyo_flights&trip_sub3=D19382939"
  },
  {
    "type": "flight",
    "origin": "Singapore",
    "destination": "Bangkok",
    "tripSub1": "guide_singapore_bangkok_flights",
    "url": "https://sg.trip.com/flights/Singapore-to-Bangkok/tickets-SIN-BKK?flighttype=S&dcity=SIN&acity=BKK&Allianceid=10173661&SID=328960094&trip_sub1=guide_singapore_bangkok_flights&trip_sub3=D19382939"
  },
  {
    "type": "flight",
    "origin": "Singapore",
    "destination": "Paris",
    "tripSub1": "guide_singapore_paris_flights",
    "url": "https://sg.trip.com/flights/Singapore-to-Paris/tickets-SIN-PAR?flighttype=S&dcity=SIN&acity=PAR&Allianceid=10173661&SID=328960094&trip_sub1=guide_singapore_paris_flights&trip_sub3=D19382939"
  },
  {
    "type": "flight",
    "origin": "Singapore",
    "destination": "Rome",
    "tripSub1": "guide_singapore_rome_flights",
    "url": "https://sg.trip.com/flights/Singapore-to-Rome/tickets-SIN-ROM?flighttype=S&dcity=SIN&acity=ROM&Allianceid=10173661&SID=328960094&trip_sub1=guide_singapore_rome_flights&trip_sub3=D19382939"
  },
  {
    "type": "flight",
    "origin": "Singapore",
    "destination": "Bali",
    "tripSub1": "guide_singapore_bali_flights",
    "url": "https://sg.trip.com/flights/Singapore-to-Bali/tickets-SIN-DPS?flighttype=S&dcity=SIN&acity=DPS&Allianceid=10173661&SID=328960094&trip_sub1=guide_singapore_bali_flights&trip_sub3=D19382939"
  },
  {
    "type": "flight",
    "origin": "Singapore",
    "destination": "Seoul",
    "tripSub1": "guide_singapore_seoul_flights",
    "url": "https://sg.trip.com/flights/Singapore-to-Seoul/tickets-SIN-SEL?flighttype=S&dcity=SIN&acity=SEL&Allianceid=10173661&SID=328960094&trip_sub1=guide_singapore_seoul_flights&trip_sub3=D19382939"
  },
  {
    "type": "flight",
    "origin": "Singapore",
    "destination": "Dubai",
    "tripSub1": "guide_singapore_dubai_flights",
    "url": "https://sg.trip.com/flights/Singapore-to-Dubai/tickets-SIN-DXB?flighttype=S&dcity=SIN&acity=DXB&Allianceid=10173661&SID=328960094&trip_sub1=guide_singapore_dubai_flights&trip_sub3=D19382939"
  },
  {
    "type": "flight",
    "origin": "Singapore",
    "destination": "Cancun",
    "tripSub1": "guide_singapore_cancun_flights",
    "url": "https://sg.trip.com/flights/Singapore-to-Cancun/tickets-SIN-CUN?flighttype=S&dcity=SIN&acity=CUN&Allianceid=10173661&SID=328960094&trip_sub1=guide_singapore_cancun_flights&trip_sub3=D19382939"
  }
];
