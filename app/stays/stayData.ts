export type StayListing = {
  slug: string;
  title: string;
  shortTitle: string;
  location: string;
  description: string;
  bookUrl: string;
  reviewUrl: string;
  type: string;
  sleeps: string;
  bedrooms: string;
  bathrooms: string;
  parking: string;
  wifi: string;
  checkIn: string;
  images: string[];
  love: string[];
  reviews: string[];
  locationHighlights: string[];
};

const airbnbLinks = {
  luxury: "https://www.airbnb.com/rooms/1103654369988982716?photo_id=1853436813&source_impression_id=p3_1779909177_P3yjqIiK9tpahMl_&previous_page_section_name=1000",
  sunrise: "https://www.airbnb.com/rooms/1342928013116113413?photo_id=2076854264&source_impression_id=p3_1779909177_P3xkAqtSUZ1Sz9oO&previous_page_section_name=1000",
  pink: "https://www.airbnb.com/rooms/1202102287797915190?photo_id=1958420453&source_impression_id=p3_1779909177_P3p_v0trDoGkPxMb&previous_page_section_name=1000",
  orange: "https://www.airbnb.com/rooms/1000230934703617844?photo_id=2040563656&source_impression_id=p3_1779909177_P3prVBn8y1uzU6GC&previous_page_section_name=1000",
  entire: "https://www.airbnb.com/rooms/1676257340364806405?photo_id=2621485257&source_impression_id=p3_1779909405_P3xzTZ4MRqOj9EeV&previous_page_section_name=1000",
  worldCup: "https://www.airbnb.com/rooms/1674115529000441843?photo_id=2614588869&source_impression_id=p3_1779909405_P397y-qJFE7Ud4nl&previous_page_section_name=1000",
};

function stayImages(slug: string) {
  return Array.from({ length: 10 }, (_, index) => `/assets/stays/${slug}/${String(index + 1).padStart(2, "0")}.jpg`);
}

export const stayListings: StayListing[] = [
  {
    slug: "luxury-pool-jacuzzi",
    title: "Luxury Home with Pool & Jacuzzi",
    shortTitle: "Luxury Pool Home",
    location: "Los Angeles, California",
    description: "A polished Lincies House stay with resort-style pool vibes, bright gathering spaces and a professionally hosted experience near Los Angeles highlights.",
    bookUrl: airbnbLinks.luxury,
    reviewUrl: airbnbLinks.luxury,
    type: "Entire Home",
    sleeps: "Sleeps 8",
    bedrooms: "4 Bedrooms",
    bathrooms: "3 Bathrooms",
    parking: "Free Parking",
    wifi: "Fast WiFi",
    checkIn: "Self Check-In",
    images: stayImages("luxury-pool-jacuzzi"),
    love: ["Resort-style pool and outdoor lounging", "Bright living room for families and groups", "Professionally hosted by Lincies House", "Fully equipped kitchen for longer stays", "Great for LA visits, family trips and special stays"],
    reviews: ["We enjoyed our stay. The home worked very well for our needs. The host Mykin was proactive and friendly. Thanks for having us.", "The home was so welcoming and beautiful! Great experience and the host was great in their hospitality and communication. I would come back and refer this place to anyone looking for a great getaway.", "MyKin's property was very spacious and well maintained, making it perfect for hosting gatherings and celebrating special occasions. We loved the open concept layout, and everything was clean and comfortable."],
    locationHighlights: ["Easy access to Los Angeles attractions", "Near restaurants and grocery stores", "Good fit for families and groups", "Convenient for longer stays and relocation trips"],
  },
  {
    slug: "sunrise-studio",
    title: "Sunrise Studio with 1GB WiFi",
    shortTitle: "Sunrise Studio",
    location: "Los Angeles, California",
    description: "A cozy, bright studio with fast WiFi, thoughtful details and a comfortable setup for solo travelers, couples and longer work stays.",
    bookUrl: airbnbLinks.sunrise,
    reviewUrl: airbnbLinks.sunrise,
    type: "Private Studio",
    sleeps: "Sleeps 2",
    bedrooms: "Studio Bedroom",
    bathrooms: "1 Bathroom",
    parking: "Free Parking",
    wifi: "1GB Fast WiFi",
    checkIn: "Self Check-In",
    images: stayImages("sunrise-studio"),
    love: ["Fast 1GB WiFi for remote work", "Cozy studio layout with sunny details", "Professionally hosted and easy to access", "Good for solo, couple or business travel", "Quiet stay with simple essentials ready"],
    reviews: ["This is our second stay. We enjoyed the quiet of the neighborhood. Our host is always quick to respond. It’s such a pleasant stay, and having a washer and dryer is a plus.", "Our stay with Linh was peaceful. The property is bright and airy. Waking up to a picturesque view was amazing, every morning. Amenities were great, it’s so nice to have a secure place to park and have a washer and dryer. The host family were very kind. I look forward to staying again soon."],
    locationHighlights: ["Near DTLA routes", "Easy freeway access", "Close to local food options", "Good for business and mid-term stays"],
  },
  {
    slug: "pink-cute-house",
    title: "2BRs Pink Cute House near DTLA",
    shortTitle: "Pink Cute House",
    location: "Los Angeles, California",
    description: "A soft, cute and welcoming stay near Downtown LA, designed for guests who want a warm home base with easy access to the city.",
    bookUrl: airbnbLinks.pink,
    reviewUrl: airbnbLinks.pink,
    type: "Entire Home",
    sleeps: "Sleeps 4",
    bedrooms: "2 Bedrooms",
    bathrooms: "1 Bathroom",
    parking: "Free Parking",
    wifi: "Fast WiFi",
    checkIn: "Self Check-In",
    images: stayImages("pink-cute-house"),
    love: ["Cute pink styling and cozy details", "Near Downtown LA", "Great for couples, friends and small families", "Professionally hosted and easy check-in", "Comfortable setup for short or longer stays"],
    reviews: [
      "Host was super friendly and replied fast! Great place to hang out since I came to mostly visit family! House has cold ac, good for what we needed! Would book again!",
      "Perfect location located centrally to everything we needed to get to. Good communication",
      "The place was clean, and everything provided was comprehensive. I booked the wrong dates for the listing, and the host was very friendly and helped me change the dates. Thank you very much.",
      "The place matches the description and it is located in a safe and quiet neighborhood. Plus, the host is super responsive.",
      "Excellent place; Linh was clear with further instructions. We appreciate that check-in wasn't set at a specific time, so you can arrive whenever is convenient for you. You have complete privacy, and you feel comfortable and at ease.",
    ],
    locationHighlights: ["Near DTLA", "Near restaurants and grocery stores", "Easy freeway access", "Good for travel nurses, business trips and mid-term stays"],
  },
  {
    slug: "orange-lovely-house",
    title: "Orange Lovely House near DTLA",
    shortTitle: "Orange Lovely House",
    location: "Los Angeles, California",
    description: "A bright, cheerful stay with warm orange accents, comfortable essentials and easy access to Downtown LA.",
    bookUrl: airbnbLinks.orange,
    reviewUrl: airbnbLinks.orange,
    type: "Entire Home",
    sleeps: "Sleeps 4",
    bedrooms: "1 Bedroom",
    bathrooms: "1 Bathroom",
    parking: "Free Parking",
    wifi: "Fast WiFi",
    checkIn: "Self Check-In",
    images: stayImages("orange-lovely-house"),
    love: ["Warm and cheerful design", "Comfortable bedroom and lounge setup", "Fully equipped kitchen", "Professionally hosted near DTLA", "Good fit for couples, small families and work trips"],
    reviews: ["Great stay! The host was very friendly and welcoming. The house matched the descriptions perfectly, and the furniture was clean and new. Everything was well-maintained, making for a comfortable and enjoyable stay.", "My fiancé and I stayed at Linh's for a week and everything was good. Linh answered any questions we had and was quick to reply as well. We did have a small issue with bugs during our stay (most likely due to the heat wave) but Linh did her best to help fix the situation.", "Her house is exactly what we see on the picture, cute and clean. The neighbors are quiet and what we hear is only birds singing."],
    locationHighlights: ["Near DTLA", "Near hospitals and local services", "Near restaurants and grocery stores", "Easy freeway access"],
  },
  {
    slug: "entire-house-3br",
    title: "Entire House 3BRs 2BA 15 mins to DTLA",
    shortTitle: "Entire House 3BR",
    location: "Los Angeles, California",
    description: "A spacious entire home near Downtown LA, set up for families, business travelers, groups and longer stays that need comfort and convenience.",
    bookUrl: airbnbLinks.entire,
    reviewUrl: airbnbLinks.entire,
    type: "Entire Home",
    sleeps: "Sleeps 6",
    bedrooms: "3 Bedrooms",
    bathrooms: "2 Bathrooms",
    parking: "Free Parking",
    wifi: "Fast WiFi",
    checkIn: "Self Check-In",
    images: stayImages("entire-house-3br"),
    love: ["15 mins to Downtown LA", "Spacious home for family and group stays", "Professionally hosted", "Fully equipped kitchen", "Good for travel nurses, business trips and relocation stays"],
    reviews: ["Beautiful place"],
    locationHighlights: ["15 mins to DTLA", "Near hospitals", "Near restaurants and grocery stores", "Easy freeway access"],
  },
  {
    slug: "new-listing-world-cup-6brs",
    title: "New listing 20% off for World Cup 6Brs near DTLA",
    shortTitle: "World Cup 6BRs",
    location: "Los Angeles, California",
    description: "A thoughtfully designed stay near Downtown LA, perfect for families, business travelers and longer stays.",
    bookUrl: airbnbLinks.worldCup,
    reviewUrl: airbnbLinks.worldCup,
    type: "Entire Home",
    sleeps: "Group Stay",
    bedrooms: "6 Bedrooms",
    bathrooms: "2 Bathrooms",
    parking: "Free Parking",
    wifi: "Fast WiFi",
    checkIn: "Self Check-In",
    images: stayImages("designer-stay-near-dtla"),
    love: ["10 mins to Downtown LA", "Quiet and safe neighborhood", "Professionally hosted", "Fully equipped kitchen", "Great for family and group stays"],
    reviews: [],
    locationHighlights: ["10 mins to DTLA", "Near hospitals", "Near restaurants and grocery stores", "Easy freeway access"],
  },
];

export function getStayListing(slug: string) {
  return stayListings.find((listing) => listing.slug === slug);
}
