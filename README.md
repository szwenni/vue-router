# @skirtle/vue-router-perf

## Overview

This is a fork of [Vue Router](https://github.com/vuejs/router) with improved performance.

The [`perf-releases`](https://github.com/skirtles-code/vue-router/tree/perf-releases) branch is used to make releases to the npm package `@skirtle/vue-router-perf`.

The package `@skirtle/vue-router-perf` is intended to be a drop-in replacement for `vue-router`. It includes performance improvements that aren't yet available in the official package.

It should be much faster for applications with large numbers of routes. The performance improvements affect both the creation of the router and the resolving of routes.

The benchmark below compares `@skirtle/vue-router-perf` to `vue-router`:

- [Benchmark](https://play.vuejs.org/#eNq1VmFv2zYQ/SuEMMDyYkv2ku2D6wTZigzL0KyBm+6LFbSydLZZS6RAUo4Lw/+9R1Ky5MRSXBQNAoi6e3f37vhMauv8mWXeOgdn5IxlJGimiASVZ1cBo2nGhSK/klCS/3OY8FyBIHPBU9LBiL4whk4D8B7EvABfyxUVKgG/iupn6K5Ct0RAGCm6BrKrKqA/YBFnUpHJ+48PNx8+3X1893B7/+72ZkIuycVgMKgQJq9E8/RRG+dcEDcBRSiaBm/wMX6Z5A05O6Ndsg0YKeK9LJdL1xgIyUK1HJHPfi5B/LKlu889a484smbA1Ihsd6VtSZNYABuRqTUQbMom6HR6hyGkDKphRjQ+BRbGKWVtwHJRsu8kVKrO3n+cfEMDhwQFT8AN8C8+67YwOAyKQgULLr6+DKjwuF92UdjM+64bMHzHjcwZCoMzEqFEFDyAVK5dWp1hYvN2BynW+Qe7xUe5p6hkUUZaeLm3SwscHYt2u0U3VhPH6QiQPFlbPlbTRVErR8owcYrdovzucBgeYljsvtSxT4YDTK4jT9QsJWeXVf6iakFWeAUvtyZbTN8K8Ie/nb8OMtJ7Hab1dlpCg5xzbpE4XTNgOz5FU/NjLo8Fdzod9MjgsUfs89GMbL8ZC+4Wc9DjkyrEM+WS6DOGizRkEXiMP7mmjgZYToioaWp/cHmH6npuP9SZzmi4TgeP+H+sKOlbQnaPW7kd0dRBgeEPF2hrXJ/YTc3XfE0DGP7sAWCB1waAChr79hrDCwxfFKRZgqTxjZDxLFcK1XIdJTRaXQbOggfO1SRnZAYsWqahWMmxb0E2QIWzBMiMixiEsWhbudLr5dV9GK3CBYx9XNftb/WwUJsvHBPTI2WLmgeXx/PHV9WdiaD4wLXd1rXnKf433UDsDrtkt0uxkxb4sA3ewqbpKm8uZmRxOjezyadww4XeHFzjqtplp+coiWfInC68L5Iz/K4x50Lg6PuHJiDeZ3pbZODgPWRzBk6YJPzpX2NTIofi+MeYJUSrI/YvcqNtgXOPigWxhsDZ+1CJC1DWffPhP9jgeu9MeZwniG5xGn3kmqOF/YX3BtKu4QzbW/PlhDJ6kDcbBUyWTWmi5kA1+MDBnXrb0npF99y7KA9inKL9MuunYfZsjtZxmKRSg+W8VCqTI9/PWbZaeDj5ml6uL7wL79yP9elfWT2QaX8m+BOOEwvWum2SXFOlJvx3VESQH8NacZ7IfpjRxlLPgdd/YG+/48028zG7T1kMG5N7P9jdN9wUz08=)

Using a Playground as a benchmark isn't entirely reliable, but it gives a sense of the improvements that are possible.

For more details of the performance improvements implemented in this fork see <https://github.com/vuejs/router/pull/2148>.

Most projects won't have enough routes to see a significant benefit. Manually creating thousands of routes is rare, but tools such as `@nuxtjs/i18n` can automatically generate very large numbers of routes.

## Installation

While `@skirtle/vue-router-perf` can be used directly, it is intended to be used via a resolution override instead. This tells your package manager to install `@skirtle/vue-router-perf` in place of `vue-router`. Other code can continue to import from `vue-router`, unaware that it is using the replacement package.

The details depend on which package manager you're using. 

### npm

If you're using `vue-router` as a direct dependency in your project then you'll need to update that dependency to use the fork instead:

```json
{
  "dependencies": {
    "vue-router": "npm:@skirtle/vue-router-perf@^0.0.0"
  }
}
```

That previous step isn't necessary if you're using `vue-router` indirectly, e.g. via Nuxt.

You'll then need to add the [`overrides`](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#overrides) option to your `package.json`. This ensures that your other dependencies will also use the fork, rather than pulling in a separate copy of `vue-router`:

```json
{
  "overrides": {
    "vue-router": "npm:@skirtle/vue-router-perf@^0.0.0"
  }
}
```

Then run `npm install`.

### yarn

If you're using `vue-router` as a direct dependency in your project then you'll need to update that dependency to use the fork instead:

```json
{
  "dependencies": {
    "vue-router": "npm:@skirtle/vue-router-perf@^0.0.0"
  }
}
```

That previous step isn't necessary if you're using `vue-router` indirectly, e.g. via Nuxt.

You'll then need to add the [`resolutions`](https://classic.yarnpkg.com/lang/en/docs/selective-version-resolutions/) option to your `package.json`. This ensures that your other dependencies will also use the fork, rather than pulling in a separate copy of `vue-router`:

```json
{
  "resolutions": {
    "vue-router": "npm:@skirtle/vue-router-perf@^0.0.0"
  }
}
```

Then run `yarn install`.

### pnpm

Add [`pnpm.overrides`](https://pnpm.io/package_json#pnpmoverrides) to your `package.json`:

```json
{
  "pnpm": {
    "overrides": {
      "vue-router": "npm:@skirtle/vue-router-perf@^0.0.0"
    }
  }
}
```

Then run `pnpm install`.

## Why a separate package?

The changes in this fork can't currently be merged into the official Vue Router. They increase the bundle size (by about 2KB) and compromise the long-term maintainability of the code. It isn't worth it for the relatively small number of projects that would benefit.

Work is already underway to try to implement similar performance improvements in the official package. The first step is to make the *matcher* pluggable, rather than being hardcoded internally. That will allow applications to choose between extra features, performance and bundle size. See <https://github.com/vuejs/router/pull/2148#issuecomment-2270491554> for more details.

This package exists for those who need the performance improvements now, rather than waiting.

This package should be compatible with all documented functionality of Vue Router and passes all its unit tests. There are some known differences with resolving routes in undocumented edge cases, but you're very unlikely to hit those cases in practice.

The intention is to maintain this package until Vue Router achieves similar performance.

## Compatibility

The table below lists equivalent versions:

| vue-router | @skirtle/vue-router-perf |
|:----------:|:------------------------:|
|   4.4.5    |          0.0.2           |
|   4.4.4    |          0.0.1           |
|   4.4.3    |          0.0.0           |
