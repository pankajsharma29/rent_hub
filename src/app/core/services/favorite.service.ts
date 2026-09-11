import { Injectable, signal } from '@angular/core';
import { Favorite } from '../models/favorite.model';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private storageKey = 'renthub_favorites';

  favorites = signal<Favorite[]>(this.load());

  private load(): Favorite[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  private save(list: Favorite[]) {
    this.favorites.set(list);
    localStorage.setItem(this.storageKey, JSON.stringify(list));
  }

  isFavorite(userEmail: string, listingId: number): boolean {
    return this.favorites().some(f => f.userEmail === userEmail && f.listingId === listingId);
  }

  toggleFavorite(userEmail: string, listingId: number) {
    if (this.isFavorite(userEmail, listingId)) {
      this.save(this.favorites().filter(f => !(f.userEmail === userEmail && f.listingId === listingId)));
    } else {
      this.save([...this.favorites(), { userEmail, listingId }]);
    }
  }

  getFavoriteListingIds(userEmail: string): number[] {
    return this.favorites().filter(f => f.userEmail === userEmail).map(f => f.listingId);
  }
}