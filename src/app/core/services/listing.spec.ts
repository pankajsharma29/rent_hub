import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ListingService } from './listing.service';
import { Listing } from '../models/listing.model';

describe('ListingService', () => {
  let service: ListingService;
  let httpMock: HttpTestingController;

  const mockListings: Listing[] = [
    { id: 1, title: 'Apartment 1', description: 'Desc 1', price: 1200, location: 'Downtown', amenities: [], furnished: true, imageUrl: 'img1', featured: true },
    { id: 2, title: 'Apartment 2', description: 'Desc 2', price: 800, location: 'Uptown', amenities: [], furnished: false, imageUrl: 'img2', featured: false }
  ];

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ListingService);
    httpMock = TestBed.inject(HttpTestingController);

    const req = httpMock.expectOne('/data/listings.json');
    req.flush(mockListings);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should seed listings from JSON when localStorage is empty', () => {
    expect(service.listings().length).toBe(2);
    expect(service.listings()[0].title).toBe('Apartment 1');
  });

  it('should persist seeded listings into localStorage', () => {
    const stored = JSON.parse(localStorage.getItem('renthub_listings')!);
    expect(stored.length).toBe(2);
  });

  it('should add a new listing to the front of the list', () => {
    service.addListing({
      title: 'New Apartment',
      description: 'Brand new listing',
      price: 1000,
      location: 'Downtown',
      amenities: [],
      furnished: true,
      imageUrl: 'new-img',
      featured: false
    });

    const listings = service.listings();
    expect(listings.length).toBe(3);
    expect(listings[0].title).toBe('New Apartment');
  });

  it('should find a listing by id', () => {
    const found = service.getListingById(1);
    expect(found?.title).toBe('Apartment 1');
  });

  it('should return undefined for a non-existent listing id', () => {
    expect(service.getListingById(999)).toBeUndefined();
  });
});