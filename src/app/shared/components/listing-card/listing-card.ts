import { Component, input, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Listing } from '../../../core/models/listing.model';
import { AuthService } from '../../../core/services/auth.service';
import { FavoriteService } from '../../../core/services/favorite.service';

@Component({
  selector: 'app-listing-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './listing-card.html',
  styleUrl: './listing-card.scss'
})
export class ListingCardComponent {
  listing = input.required<Listing>();

  private authService = inject(AuthService);
  private favoriteService = inject(FavoriteService);
  private router = inject(Router);

  isFavorite = computed(() => {
    const user = this.authService.currentUser();
    return user ? this.favoriteService.isFavorite(user.email, this.listing().id) : false;
  });

  toggleFavorite() {
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.favoriteService.toggleFavorite(user.email, this.listing().id);
  }
}