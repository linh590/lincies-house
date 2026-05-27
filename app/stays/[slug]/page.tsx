import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStayListing, stayListings } from "../stayData";

type StayPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return stayListings.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({ params }: StayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = getStayListing(slug);
  if (!listing) return { title: "Home not found | Lincies House" };
  return {
    title: `${listing.title} | Stay With Lincies House`,
    description: listing.description,
    openGraph: {
      title: `${listing.title} | Stay With Lincies House`,
      description: listing.description,
      images: [{ url: listing.images[0], width: 1200, height: 900, alt: listing.title }],
    },
  };
}

export default async function StayDetailPage({ params }: StayPageProps) {
  const { slug } = await params;
  const listing = getStayListing(slug);
  if (!listing) notFound();

  const quickHighlights = [
    ["🏠", listing.type],
    ["👥", listing.sleeps],
    ["🛏", listing.bedrooms],
    ["🚿", listing.bathrooms],
    ["🚗", listing.parking],
    ["📶", listing.wifi],
    ["🔑", listing.checkIn],
  ];

  return (
    <main className="stay-detail-page">
      <nav className="stays-nav detail-nav">
        <Link className="stays-logo" href="/">
          <img src="/assets/lincies-house-logo-transparent.png" alt="Lincies House" />
        </Link>
        <div>
          <Link href="/stays">View All Homes</Link>
          <Link href="/#contact">Contact</Link>
        </div>
      </nav>

      <section className="stay-detail-shell">
        <div className="stay-gallery-layout">
          <img className="stay-hero-photo" src={listing.images[0]} alt={`${listing.title} hero`} />
          <div className="stay-thumb-grid">
            {listing.images.slice(1, 7).map((image, index) => (
              <img src={image} alt={`${listing.title} preview ${index + 2}`} key={image} />
            ))}
          </div>
        </div>

        <div className="stay-title-block">
          <div>
            <div className="kicker">Stay With Lincies House</div>
            <h1>{listing.title}</h1>
            <p className="stay-location">📍 {listing.location}</p>
            <p>{listing.description}</p>
          </div>
          <a className="stay-airbnb-pill" href={listing.bookUrl} target="_blank" rel="noreferrer">
            Book on Airbnb →
          </a>
        </div>

        <section className="stay-info-section">
          <h2>Quick Highlights</h2>
          <div className="stay-highlight-grid">
            {quickHighlights.map(([icon, label]) => (
              <div className="stay-highlight-card" key={label}>
                <span>{icon}</span>
                <b>{label}</b>
              </div>
            ))}
          </div>
        </section>

        <section className="stay-two-column">
          <div className="stay-info-section">
            <h2>Why Guests Love This Home</h2>
            <ul className="stay-check-list">
              {listing.love.map((item) => (
                <li key={item}>✨ {item}</li>
              ))}
            </ul>
          </div>
          <div className="stay-info-section">
            <h2>Location Highlights</h2>
            <ul className="stay-check-list location-list">
              {listing.locationHighlights.map((item) => (
                <li key={item}>📍 {item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="stay-info-section stay-review-section">
          <div className="stay-section-head">
            <div>
              <div className="kicker">Mini Reviews</div>
              <h2>Guest notes that build trust.</h2>
            </div>
            <a href={listing.reviewUrl} target="_blank" rel="noreferrer">See more reviews on Airbnb →</a>
          </div>
          <div className="stay-review-grid">
            {listing.reviews.map((review) => (
              <blockquote key={review}>
                <span>★★★★★</span>
                “{review}”
              </blockquote>
            ))}
          </div>
        </section>

        <section className="stay-extra-photos">
          {listing.images.slice(7, 10).map((image, index) => (
            <img src={image} alt={`${listing.title} extra preview ${index + 8}`} key={image} />
          ))}
        </section>

        <section className="stay-cta-panel">
          <div>
            <div className="kicker">Ready to stay?</div>
            <h2>Book this home or contact us for a longer stay.</h2>
            <p>Great for travel nurses, business trips, insurance relocation and mid-term stays.</p>
          </div>
          <div className="stay-cta-actions">
            <a className="btn primary" href={listing.bookUrl} target="_blank" rel="noreferrer">Book on Airbnb →</a>
            <Link className="btn secondary" href="/stays">View All Homes</Link>
            <Link className="btn secondary" href="/#contact">Contact us for Longer Stay</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
