---
name: Angular JIT under Vite
description: Angular 17 standalone components running through Vite need local template and style resources resolved before bootstrap.
---

When Angular 17 runs through the existing Vite dev server without the Angular CLI compiler, standalone components should import external HTML and CSS with Vite's `?raw` query and pass them as `template` and `styles`.

**Why:** The CLI-style `templateUrl` and `styleUrl` metadata caused runtime resource-resolution failures, and `resolveComponentResources` is not a public export from the installed `@angular/core` package.

**How to apply:** Keep the app's HTML/CSS in separate files for maintainability, but import them into the component metadata at build time instead of relying on Angular CLI resource processing.