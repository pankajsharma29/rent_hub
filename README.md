# RentHub

A web-based apartment rental platform where users can browse listings, post apartments for rent, mark favorites, and comment on listings. Built with Angular 22, using local JSON data and browser storage (no backend server required).

**Live demo:** https://renthubb.netlify.app/

## Demo Login Credentials

Since this is a demo project using local storage (not a real backend), you can log in with either of these seeded accounts:

| Email | Password |
|---|---|
| `john@example.com` | `password123` |
| `jane@example.com` | `password123` |

You can also click **Register** to create your own account — it will be saved in your browser's local storage and will persist across visits on the same browser/device.

> **Note:** This is a demo/prototype application. Data (users, listings, comments, favorites) is stored in your browser's `localStorage`, not on a server — so accounts and posts won't sync across different browsers or devices, and clearing your browser data will reset the app.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
