import { Component, inject, signal, computed } from '@angular/core';
//import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { ListingService } from '../../core/services/listing.service';
import { ListingCardComponent } from '../../shared/components/listing-card/listing-card';
import { Navbar } from '../../shared/components/navbar/navbar';
import { AuthService } from '../../core/services/auth.service';
import { FavoriteService } from '../../core/services/favorite.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ListingCardComponent, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  private listingService = inject(ListingService);
  //private listingService = inject(ListingService);
  listings = this.listingService.listings;

  //listings = toSignal(this.listingService.getListings(), { initialValue: [] });

  private authService = inject(AuthService);
  private favoriteService = inject(FavoriteService);
  private router = inject(Router);

  isFeaturedFavorite = computed(() => {
    const listing = this.currentFeatured();
    const user = this.authService.currentUser();
    return listing && user ? this.favoriteService.isFavorite(user.email, listing.id) : false;
  });

  toggleFeaturedFavorite() {
    const listing = this.currentFeatured();
    const user = this.authService.currentUser();
    if (!listing) return;
    if (!user) { this.router.navigate(['/login']); return; }
    this.favoriteService.toggleFavorite(user.email, listing.id);
  }

  // Carousel
  featuredListings = computed(() => this.listings().filter(l => l.featured));
  carouselIndex = signal(0);
  currentFeatured = computed(() => {
    const featured = this.featuredListings();
    return featured.length ? featured[this.carouselIndex() % featured.length] : null;
  });

  prevSlide() {
    const len = this.featuredListings().length;
    if (len) this.carouselIndex.set((this.carouselIndex() - 1 + len) % len);
  }

  nextSlide() {
    const len = this.featuredListings().length;
    if (len) this.carouselIndex.set((this.carouselIndex() + 1) % len);
  }

  // Search & filter
  searchTerm = signal('');
  selectedLocation = signal('');
  maxPrice = signal<number | null>(null);
  furnishedOnly = signal(false);

  locations = computed(() => Array.from(new Set(this.listings().map(l => l.location))));

  filteredListings = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const location = this.selectedLocation();
    const max = this.maxPrice();
    const furnished = this.furnishedOnly();

    return this.listings().filter(l =>
      (!term || l.title.toLowerCase().includes(term) || l.description.toLowerCase().includes(term)) &&
      (!location || l.location === location) &&
      (max == null || l.price <= max) &&
      (!furnished || l.furnished)
    );
  });

  onSearchChange(value: string) { this.searchTerm.set(value); }
  onLocationChange(value: string) { this.selectedLocation.set(value); }
  onMaxPriceChange(value: string) { this.maxPrice.set(value ? Number(value) : null); }
  onFurnishedChange(checked: boolean) { this.furnishedOnly.set(checked); }
}