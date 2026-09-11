import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ListingService } from '../../core/services/listing.service';
import { AuthService } from '../../core/services/auth.service';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [ReactiveFormsModule, Navbar],
  templateUrl: './create-post.html',
  styleUrl: './create-post.scss'
})
export class CreatePost {
  private fb = inject(FormBuilder);
  private listingService = inject(ListingService);
  private authService = inject(AuthService);
  private router = inject(Router);

  private readonly MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  aptBuildingOptions = ['Sunrise Towers', 'Green Valley Apartments', 'Lakeview Residency', 'Other'];
  amenitiesList = [
    'Gym/Fitness Center', 'Power Backup', 'Plant Security System',
    'Swimming Pool', 'Garbage Disposal', 'Laundry Service',
    'Car Park', 'Private Lawn', 'Elevator',
    'Visitors Parking', 'Water Heater', 'Club House'
  ];

  selectedAmenities = signal<string[]>([]);
  descriptionLength = signal(0);

  // Photo upload state
  imagePreview = signal<string | null>(null);
  imageError = signal('');

  form = this.fb.group({
    aptBuilding: ['', Validators.required],
    propertyName: ['', Validators.required],
    isSharedProperty: ['', Validators.required],
    streetAddress: ['', Validators.required],
    squareFeet: [null as number | null, [Validators.required, Validators.min(1)]],
    leaseType: ['', Validators.required],
    expectedRent: [null as number | null, [Validators.required, Validators.min(1)]],
    negotiable: [false],
    priceMode: ['', Validators.required],
    furnished: ['', Validators.required],
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.maxLength(1400)]]
  });

  toggleAmenity(amenity: string, checked: boolean) {
    this.selectedAmenities.update(list =>
      checked ? [...list, amenity] : list.filter(a => a !== amenity)
    );
  }

  onDescriptionInput(value: string) {
    this.descriptionLength.set(value.length);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.imageError.set('');

    if (!file) {
      this.imagePreview.set(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.imageError.set('Please select a valid image file.');
      input.value = '';
      this.imagePreview.set(null);
      return;
    }

    if (file.size > this.MAX_FILE_SIZE) {
      this.imageError.set('Image must be smaller than 2MB.');
      input.value = '';
      this.imagePreview.set(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
    };
    reader.onerror = () => {
      this.imageError.set('Could not read the selected file. Please try another image.');
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.imagePreview.set(null);
    this.imageError.set('');
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;
    const fallbackImage = `https://loremflickr.com/500/300/apartment,interior?lock=${Date.now()}`;

    this.listingService.addListing({
      title: v.title!,
      description: v.description!,
      price: v.expectedRent!,
      location: v.aptBuilding!,
      amenities: this.selectedAmenities(),
      furnished: v.furnished === 'yes',
      imageUrl: this.imagePreview() ?? fallbackImage,
      featured: false,
      aptBuilding: v.aptBuilding!,
      propertyName: v.propertyName!,
      isSharedProperty: v.isSharedProperty === 'yes',
      streetAddress: v.streetAddress!,
      squareFeet: v.squareFeet!,
      leaseType: v.leaseType!,
      negotiable: v.negotiable!,
      priceMode: v.priceMode!,
      landlordEmail: this.authService.currentUser()?.email
    });
    this.router.navigate(['/']);
  }
}