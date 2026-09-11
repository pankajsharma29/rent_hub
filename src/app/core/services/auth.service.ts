import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private usersKey = 'renthub_users';
  private currentUserKey = 'renthub_current_user';

  users = signal<User[]>(this.loadUsers());
  currentUser = signal<User | null>(this.loadCurrentUser());
  isLoggedIn = computed(() => this.currentUser() !== null);

  constructor() {
    // Seed from JSON only the first time (when localStorage has no users yet)
    if (this.users().length === 0) {
      this.http.get<User[]>('/data/users.json').subscribe(seed => {
        this.users.set(seed);
        localStorage.setItem(this.usersKey, JSON.stringify(seed));
      });
    }
  }

  private loadUsers(): User[] {
    const raw = localStorage.getItem(this.usersKey);
    return raw ? JSON.parse(raw) : [];
  }

  private loadCurrentUser(): User | null {
    const raw = localStorage.getItem(this.currentUserKey);
    return raw ? JSON.parse(raw) : null;
  }

  login(email: string, password: string): boolean {
    const user = this.users().find(u => u.email === email && u.password === password);
    if (!user) return false;
    this.currentUser.set(user);
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    return true;
  }

  register(name: string, email: string, password: string): { success: boolean; message?: string } {
    if (this.users().some(u => u.email === email)) {
      return { success: false, message: 'Email is already registered.' };
    }
    const newUser: User = { id: Date.now(), name, email, password };
    const updated = [...this.users(), newUser];
    this.users.set(updated);
    localStorage.setItem(this.usersKey, JSON.stringify(updated));
    this.currentUser.set(newUser);
    localStorage.setItem(this.currentUserKey, JSON.stringify(newUser));
    return { success: true };
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem(this.currentUserKey);
  }
}