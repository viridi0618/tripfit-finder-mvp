export type AffiliateLink = {
  type: "hotel" | "flight";
  origin: string | null;
  destination: string;
  tripSub1: string;
  url: string;
};

export const officialTripComLinks: AffiliateLink[] = [
  {
    type: "hotel",
    origin: null,
    destination: "Tokyo",
    tripSub1: "guide_tokyo_hotels",
    url: "https://sg.trip.com/hotels/list?city=228&display=Tokyo&optionId=228&optionType=City&optionName=Tokyo&Allianceid=10173661&SID=328960094&trip_sub1=guide_tokyo_hotels&trip_sub3=D19367728",
  },
  {
    type: "flight",
    origin: "London",
    destination: "Tokyo",
    tripSub1: "guide_tokyo_flights",
    url: "https://sg.trip.com/flights/London-to-Tokyo/tickets-LON-TYO?flighttype=S&dcity=LON&acity=TYO&Allianceid=10173661&SID=328960094&trip_sub1=guide_tokyo_flights&trip_sub3=D19367728",
  },
  {
    type: "flight",
    origin: "Delhi",
    destination: "Tokyo",
    tripSub1: "guide_tokyo_flights",
    url: "https://sg.trip.com/flights/New%20Delhi-to-Tokyo/tickets-DEL-TYO?flighttype=S&dcity=DEL&acity=TYO&Allianceid=10173661&SID=328960094&trip_sub1=guide_tokyo_flights&trip_sub3=D19369912",
  },
];
