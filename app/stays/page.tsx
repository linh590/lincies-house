import type { Metadata } from "next";
import Link from "next/link";
import { stayListings } from "./stayData";

export const metadata: Metadata = {
  title: "Stay With Lincies House | Airbnb Homes in Los Angeles",
  description: "Explore Lincies House Airbnb stays with curated galleries, highlights, reviews and booking links.",
};

export default function StaysPage() {
  return (
    <main className="stays-page">
      <nav className="stays-nav">
        <Link className="stays-logo" href="/">
          <img src="/assets/lincies-house-logo-transparent.png" alt="Lincies House" />
        </Link>
        <div>
          <Link href="/">Course Home</Link>
          <Link href="/stays">View All Homes</Link>
          <Link href="/#contact">Contact</Link>
        </div>
      </nav>

      <section className="stays-hero-index">
        <div className="kicker">Stay With Lincies House</div>
        <h1>Beautiful homes thoughtfully hosted across Los Angeles.</h1>
        <p>
          Explore a curated look at Lincies House stays. Each listing includes a short gallery,
          guest-friendly highlights, review snippets and direct links to book or contact us for longer stays.
        </p>
      </section>

      <section className="stays-card-grid">
        {stayListings.map((listing) => (
          <Link className="stays-card" href={`/stays/${listing.slug}`} key={listing.slug}>
            <img src={listing.images[0]} alt={listing.title} />
            <div>
              <span>{listing.location}</span>
              <h2>{listing.title}</h2>
              <p>{listing.description}</p>
              <b>View Home →</b>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
