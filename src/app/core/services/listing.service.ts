import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Listing } from '../models/listing.model';

@Injectable({ providedIn: 'root' })
export class ListingService {
  private http = inject(HttpClient);
  private storageKey = 'renthub_listings';

  listings = signal<Listing[]>(this.loadListings());

  constructor() {
    if (this.listings().length === 0) {
      this.http.get<Listing[]>('/data/listings.json').subscribe(seed => {
        this.listings.set(seed);
        localStorage.setItem(this.storageKey, JSON.stringify(seed));
      });
    }
  }

  private loadListings(): Listing[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  addListing(listing: Omit<Listing, 'id'>): Listing {
    const newListing: Listing = { ...listing, id: Date.now() };
    const updated = [newListing, ...this.listings()];
    this.listings.set(updated);
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
    return newListing;
  }

  getListingById(id: number): Listing | undefined {
    return this.listings().find(l => l.id === id);
  }

  getListingsByEmail(email: string): Listing[] {
    return this.listings().filter(l => l.landlordEmail === email);
  }

  getListingsByIds(ids: number[]): Listing[] {
    return this.listings().filter(l => ids.includes(l.id));
  }
}