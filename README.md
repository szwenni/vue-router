# @skirtle/vue-router-perf

This is a fork of [Vue Router](https://github.com/vuejs/router) with improved performance.

The [`perf-releases`](https://github.com/skirtles-code/vue-router/tree/perf-releases) branch is used to make releases to the npm package `@skirtle/vue-router-perf`.

The package `@skirtle/vue-router-perf` is intended to be a drop-in replacement for `vue-router`. It includes performance improvements that aren't yet available in the official package.

It should be much faster for applications with large numbers of routes. The performance improvements affect both the creation of the router and the resolving of routes.
