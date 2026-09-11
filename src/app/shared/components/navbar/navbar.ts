import { Component, inject, signal, HostListener, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  authService = inject(AuthService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  dropdownOpen = signal(false);

  toggleDropdown() {
    this.dropdownOpen.update(open => !open);
  }

  logout() {
    this.dropdownOpen.set(false);
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // Close dropdown when clicking anywhere outside the navbar
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.dropdownOpen() && !this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownOpen.set(false);
    }
  }
}