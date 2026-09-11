import { Injectable, signal } from '@angular/core';
import { Comment } from '../models/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private storageKey = 'renthub_comments';

  comments = signal<Comment[]>(this.loadComments());

  private loadComments(): Comment[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  getCommentsForListing(listingId: number) {
    return this.comments().filter(c => c.listingId === listingId);
  }

  addComment(listingId: number, userName: string, text: string): Comment {
    const newComment: Comment = {
      id: Date.now(),
      listingId,
      userName,
      text,
      createdAt: new Date().toISOString()
    };
    const updated = [...this.comments(), newComment];
    this.comments.set(updated);
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
    return newComment;
  }
}