---
name: Generated client browser types
description: A generated API client uses iterable browser Headers APIs during workspace typechecking.
---

The shared generated React client requires `dom.iterable` alongside `dom` in its TypeScript library list.

**Why:** Orval-generated response error handling calls `Headers.entries()`, which is not included by the plain `dom` TypeScript lib.

**How to apply:** If generated client typechecking reports that `Headers.entries` is missing, check the importing package's `compilerOptions.lib` before changing generated output.