import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ListingService } from '../../core/services/listing.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { Navbar } from '../../shared/components/navbar/navbar';
import { ListingCardComponent } from '../../shared/components/listing-card/listing-card';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [Navbar, ListingCardComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  authService = inject(AuthService);
  private listingService = inject(ListingService);
  private favoriteService = inject(FavoriteService);
  private router = inject(Router);

  user = computed(() => this.authService.currentUser());

  myListings = computed(() => {
    const email = this.user()?.email;
    return email ? this.listingService.getListingsByEmail(email) : [];
  });

  myFavorites = computed(() => {
    const email = this.user()?.email;
    if (!email) return [];
    const ids = this.favoriteService.getFavoriteListingIds(email);
    return this.listingService.getListingsByIds(ids);
  });

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}