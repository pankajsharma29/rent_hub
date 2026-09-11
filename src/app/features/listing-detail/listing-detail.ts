import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ListingService } from '../../core/services/listing.service';
import { CommentService } from '../../core/services/comment.service';
import { AuthService } from '../../core/services/auth.service';
import { Navbar } from '../../shared/components/navbar/navbar';
import { FavoriteService } from '../../core/services/favorite.service';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [RouterLink, FormsModule, Navbar],
  templateUrl: './listing-detail.html',
  styleUrl: './listing-detail.scss'
})
export class ListingDetail {
  private route = inject(ActivatedRoute);
  private listingService = inject(ListingService);
  private commentService = inject(CommentService);
  authService = inject(AuthService);

  private favoriteService = inject(FavoriteService);
  private router = inject(Router);

  isFavorite = computed(() => {
    const user = this.authService.currentUser();
    const listing = this.listing();
    return user && listing ? this.favoriteService.isFavorite(user.email, listing.id) : false;
  });

  toggleFavorite() {
    const listing = this.listing();
    const user = this.authService.currentUser();
    if (!listing) return;
    if (!user) { this.router.navigate(['/login']); return; }
    this.favoriteService.toggleFavorite(user.email, listing.id);
  }

  listingId = Number(this.route.snapshot.paramMap.get('id'));
  listing = computed(() => this.listingService.getListingById(this.listingId));
  comments = computed(() =>
    this.commentService.getCommentsForListing(this.listingId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );

  commentText = signal('');
  errorMessage = signal('');

  submitComment() {
    const text = this.commentText().trim();
    if (!text) {
      this.errorMessage.set('Comment cannot be empty.');
      return;
    }
    const user = this.authService.currentUser();
    if (!user) {
      this.errorMessage.set('Please log in to comment.');
      return;
    }
    this.commentService.addComment(this.listingId, user.name, text);
    this.commentText.set('');
    this.errorMessage.set('');
  }
}