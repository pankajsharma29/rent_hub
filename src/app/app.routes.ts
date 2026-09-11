import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { CreatePost } from './features/create-post/create-post';
import { authGuard } from './core/guards/auth-guard';
import { ListingDetail } from './features/listing-detail/listing-detail';
import { Profile } from './features/profile/profile';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'create-post', component: CreatePost, canActivate: [authGuard] },
    { path: 'listing/:id', component: ListingDetail },
    { path: 'profile', component: Profile, canActivate: [authGuard] },
];
