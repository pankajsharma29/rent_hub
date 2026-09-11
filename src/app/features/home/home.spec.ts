import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home';
import { Listing } from '../../core/models/listing.model';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let httpMock: HttpTestingController;

  const mockListings: Listing[] = [
    { id: 1, title: 'Apartment 1', description: 'Spacious downtown apartment', price: 1200, location: 'Downtown', amenities: [], furnished: true, imageUrl: 'img1', featured: true },
    { id: 2, title: 'Apartment 2', description: 'Cozy studio for students', price: 800, location: 'Uptown', amenities: [], furnished: false, imageUrl: 'img2', featured: true },
    { id: 3, title: 'Apartment 3', description: 'Modern suburb apartment', price: 1800, location: 'Suburb', amenities: [], furnished: true, imageUrl: 'img3', featured: false }
  ];

  function flushPendingRequests() {
    httpMock.match(() => true).forEach(req => {
      if (req.request.url.includes('listings.json')) {
        req.flush(mockListings);
      } else {
        req.flush([]);
      }
    });
  }

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    flushPendingRequests();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all listings by default', () => {
    expect(component.listings().length).toBe(3);
  });

  it('filteredListings should return all listings when no filters applied', () => {
    expect(component.filteredListings().length).toBe(3);
  });

  it('should filter by search term matching the title', () => {
    component.onSearchChange('Apartment 2');
    expect(component.filteredListings().map((l: Listing) => l.id)).toEqual([2]);
  });

  it('should filter by search term matching the description', () => {
    component.onSearchChange('students');
    expect(component.filteredListings().map((l: Listing) => l.id)).toEqual([2]);
  });

  it('should filter by location', () => {
    component.onLocationChange('Suburb');
    expect(component.filteredListings().map((l: Listing) => l.id)).toEqual([3]);
  });

  it('should filter by max price', () => {
    component.onMaxPriceChange('1000');
    expect(component.filteredListings().map((l: Listing) => l.id)).toEqual([2]);
  });

  it('should filter furnished-only listings', () => {
    component.onFurnishedChange(true);
    expect(component.filteredListings().map((l: Listing) => l.id).sort()).toEqual([1, 3]);
  });

  it('should combine multiple filters (location + furnished)', () => {
    component.onLocationChange('Downtown');
    component.onFurnishedChange(true);
    expect(component.filteredListings().map((l: Listing) => l.id)).toEqual([1]);
  });

  it('should return no results when nothing matches', () => {
    component.onSearchChange('nonexistent listing xyz');
    expect(component.filteredListings().length).toBe(0);
  });

  it('should compute a unique list of locations', () => {
    expect(component.locations().sort()).toEqual(['Downtown', 'Suburb', 'Uptown']);
  });

  describe('featured carousel', () => {
    it('should only include featured listings', () => {
      expect(component.featuredListings().map((l: Listing) => l.id)).toEqual([1, 2]);
    });

    it('should start at the first featured listing', () => {
      expect(component.currentFeatured()?.id).toBe(1);
    });

    it('nextSlide should advance to the next featured listing', () => {
      component.nextSlide();
      expect(component.currentFeatured()?.id).toBe(2);
    });

    it('nextSlide should wrap around after the last featured listing', () => {
      component.nextSlide();
      component.nextSlide();
      expect(component.currentFeatured()?.id).toBe(1);
    });

    it('prevSlide should wrap around to the last featured listing from the start', () => {
      component.prevSlide();
      expect(component.currentFeatured()?.id).toBe(2);
    });
  });
});