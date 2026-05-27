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
  luxury: "https://www.airbnb.com/rooms/1342928013116113413?photo_id=2076854264&source_impression_id=p3_1779897451_P349asliCn_tXHKI&previous_page_section_name=1000",
  sunrise: "https://www.airbnb.com/rooms/1202102287797915190?photo_id=1958420453&source_impression_id=p3_1779897451_P3dx-wgQCqecsgG3&previous_page_section_name=1000",
  pink: "https://www.airbnb.com/rooms/1676257340364806405?photo_id=2621485257&source_impression_id=p3_1779897451_P35QIylYgw9wpNyS&previous_page_section_name=1000",
  orange: "https://www.airbnb.com/rooms/1674115529000441843?photo_id=2614588869&source_impression_id=p3_1779897451_P3QeReW41a0YE6Jh&previous_page_section_name=1000",
  entire: "https://www.airbnb.com/rooms/1103654369988982716?photo_id=1853436813&source_impression_id=p3_1779903599_P3vucgzqenNZx9s3&previous_page_section_name=1000",
  designer: "https://www.airbnb.com/rooms/1000230934703617844?check_in=2027-01-01&check_out=2027-01-03&photo_id=2040563656&source_impression_id=p3_1779905500_P3jyO_hHjt7QMrFU&previous_page_section_name=1000",
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
    reviews: ["Beautiful home and exactly like the photos.", "The pool area made our trip feel special.", "Very clean, comfortable and easy to check in.", "Great place for our family to stay together."],
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
    reviews: ["Super cozy and clean studio.", "The WiFi was fast and reliable for work.", "Easy check-in and great communication.", "Perfect for a short LA stay."],
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
    reviews: ["Very cute, clean and comfortable.", "Looks exactly like the photos.", "Great location for our LA plans.", "The host was responsive and helpful."],
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
    reviews: ["Clean, cute and comfortable.", "Great stay near everything we needed.", "The space had everything for our trip.", "Easy check-in and responsive host."],
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
    reviews: ["Super clean and exactly like photos.", "One of the best stays we had in LA.", "Comfortable for our family and easy to access.", "Great communication and smooth check-in."],
    locationHighlights: ["15 mins to DTLA", "Near hospitals", "Near restaurants and grocery stores", "Easy freeway access"],
  },
  {
    slug: "designer-stay-near-dtla",
    title: "Designer Stay Near DTLA",
    shortTitle: "Designer Stay",
    location: "Los Angeles, California",
    description: "A thoughtfully designed stay near Downtown LA, perfect for families, business travelers and longer stays.",
    bookUrl: airbnbLinks.designer,
    reviewUrl: airbnbLinks.designer,
    type: "Entire Home",
    sleeps: "Sleeps 6",
    bedrooms: "3 Bedrooms",
    bathrooms: "2 Bathrooms",
    parking: "Free Parking",
    wifi: "Fast WiFi",
    checkIn: "Self Check-In",
    images: stayImages("designer-stay-near-dtla"),
    love: ["10 mins to Downtown LA", "Quiet and safe neighborhood", "Professionally hosted", "Fully equipped kitchen", "Great for family and group stays"],
    reviews: ["Super clean and exactly like photos.", "One of the best stays we had in LA.", "Beautiful space and very comfortable.", "Great for our business trip and longer stay."],
    locationHighlights: ["10 mins to DTLA", "Near hospitals", "Near restaurants and grocery stores", "Easy freeway access"],
  },
];

export function getStayListing(slug: string) {
  return stayListings.find((listing) => listing.slug === slug);
}
