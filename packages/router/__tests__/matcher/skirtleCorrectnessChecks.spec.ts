import { createRouterMatcher } from '../../src/matcher'
import { MatcherLocation, RouteComponent } from '../../src/types'
import { describe, expect, it } from 'vitest'

const currentLocation = { path: '/' } as MatcherLocation
// @ts-expect-error
const component: RouteComponent = null
const cmp: RouteComponent = {}

describe('Matcher: extra correctness tests', () => {
  it('should give priority to earlier routes', () => {
    const matcher = createRouterMatcher([], {})
    matcher.addRoute({ path: '/:id(123\\d*)', component, name: 'first' })
    matcher.addRoute({ path: '/:id(12\\d*)', component, name: 'second' })
    matcher.addRoute({ path: '/:id(1\\d*)', component, name: 'third' })
    matcher.addRoute({ path: '/:id(\\d+)', component, name: 'fourth' })
    expect(matcher.resolve({ path: '/1239' }, currentLocation)).toMatchObject({
      name: 'first',
    })
    expect(matcher.resolve({ path: '/1299' }, currentLocation)).toMatchObject({
      name: 'second',
    })
    expect(matcher.resolve({ path: '/1999' }, currentLocation)).toMatchObject({
      name: 'third',
    })
    expect(matcher.resolve({ path: '/9999' }, currentLocation)).toMatchObject({
      name: 'fourth',
    })
  })

  it('should give priority to earlier child routes', () => {
    const matcher = createRouterMatcher([], {})
    matcher.addRoute({
      path: '/user',
      name: 'parent',
      children: [
        { path: '', component, name: 'root' },
        { path: ':id(123\\d*)', component, name: 'first' },
        { path: ':id(12\\d*)', component, name: 'second' },
        { path: ':id(1\\d*)', component, name: 'third' },
        { path: ':id(\\d+)', component, name: 'fourth' },
      ],
    })
    expect(matcher.resolve({ path: '/user/' }, currentLocation)).toMatchObject({
      name: 'root',
    })
    expect(
      matcher.resolve({ path: '/user/1239' }, currentLocation)
    ).toMatchObject({
      name: 'first',
    })
    expect(
      matcher.resolve({ path: '/user/1299' }, currentLocation)
    ).toMatchObject({
      name: 'second',
    })
    expect(
      matcher.resolve({ path: '/user/1999' }, currentLocation)
    ).toMatchObject({
      name: 'third',
    })
    expect(
      matcher.resolve({ path: '/user/9999' }, currentLocation)
    ).toMatchObject({
      name: 'fourth',
    })
  })

  it('aaa', () => {
    const sourceRoutes = [
      {
        path: '/user',
        sensitive: false,
        strict: false,
        component: cmp,
        name: 'user1',
      },
      {
        path: '/user',
        sensitive: false,
        strict: true,
        component: cmp,
        name: 'user2',
      },
      {
        path: '/user',
        sensitive: true,
        strict: false,
        component: cmp,
        name: 'user3',
      },
      {
        path: '/user',
        sensitive: true,
        strict: true,
        component: cmp,
        name: 'user4',
      },
    ]

    for (const routes of [sourceRoutes, [...sourceRoutes].reverse()]) {
      const matcher = createRouterMatcher(routes, {})
      expect(matcher.resolve({ path: '/user' }, currentLocation)).toMatchObject(
        {
          name: 'user4',
        }
      )
      expect(matcher.resolve({ path: '/UseR' }, currentLocation)).toMatchObject(
        {
          name: 'user2',
        }
      )
      expect(
        matcher.resolve({ path: '/user/' }, currentLocation)
      ).toMatchObject({
        name: 'user3',
      })
      expect(
        matcher.resolve({ path: '/UseR/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(matcher.getRoutes().length).toBe(4)
      matcher.removeRoute('user4')
      expect(matcher.getRoutes().length).toBe(3)
      expect(matcher.resolve({ path: '/user' }, currentLocation)).toMatchObject(
        {
          name: 'user2',
        }
      )
      matcher.removeRoute('user2')
      expect(matcher.getRoutes().length).toBe(2)
      expect(matcher.resolve({ path: '/user' }, currentLocation)).toMatchObject(
        {
          name: 'user3',
        }
      )
      expect(matcher.resolve({ path: '/UseR' }, currentLocation)).toMatchObject(
        {
          name: 'user1',
        }
      )
      expect(
        matcher.resolve({ path: '/user/' }, currentLocation)
      ).toMatchObject({
        name: 'user3',
      })
      expect(
        matcher.resolve({ path: '/UseR/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      matcher.removeRoute('user3')
      expect(matcher.getRoutes().length).toBe(1)
      expect(matcher.resolve({ path: '/user' }, currentLocation)).toMatchObject(
        {
          name: 'user1',
        }
      )
      expect(matcher.resolve({ path: '/UseR' }, currentLocation)).toMatchObject(
        {
          name: 'user1',
        }
      )
      expect(
        matcher.resolve({ path: '/user/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/UseR/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
    }
  })

  it('bbb', () => {
    const sourceRoutes = [
      {
        path: '/user/',
        sensitive: false,
        strict: false,
        component: cmp,
        name: 'user1',
      },
      {
        path: '/user/',
        sensitive: false,
        strict: true,
        component: cmp,
        name: 'user2',
      },
      {
        path: '/user/',
        sensitive: true,
        strict: false,
        component: cmp,
        name: 'user3',
      },
      {
        path: '/user/',
        sensitive: true,
        strict: true,
        component: cmp,
        name: 'user4',
      },
    ]

    for (const routes of [sourceRoutes, [...sourceRoutes].reverse()]) {
      const matcher = createRouterMatcher(routes, {})
      expect(matcher.resolve({ path: '/user' }, currentLocation)).toMatchObject(
        {
          name: 'user3',
        }
      )
      expect(matcher.resolve({ path: '/UseR' }, currentLocation)).toMatchObject(
        {
          name: 'user1',
        }
      )
      expect(
        matcher.resolve({ path: '/user/' }, currentLocation)
      ).toMatchObject({
        name: 'user4',
      })
      expect(
        matcher.resolve({ path: '/UseR/' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(matcher.getRoutes().length).toBe(4)
      matcher.removeRoute('user4')
      expect(matcher.getRoutes().length).toBe(3)
      expect(
        matcher.resolve({ path: '/user/' }, currentLocation)
      ).toMatchObject({
        name: 'user3',
      })
      matcher.removeRoute('user3')
      expect(matcher.getRoutes().length).toBe(2)
      expect(matcher.resolve({ path: '/user' }, currentLocation)).toMatchObject(
        {
          name: 'user1',
        }
      )
      expect(matcher.resolve({ path: '/UseR' }, currentLocation)).toMatchObject(
        {
          name: 'user1',
        }
      )
      expect(
        matcher.resolve({ path: '/user/' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(
        matcher.resolve({ path: '/UseR/' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      matcher.removeRoute('user2')
      expect(matcher.getRoutes().length).toBe(1)
      expect(matcher.resolve({ path: '/user' }, currentLocation)).toMatchObject(
        {
          name: 'user1',
        }
      )
      expect(matcher.resolve({ path: '/UseR' }, currentLocation)).toMatchObject(
        {
          name: 'user1',
        }
      )
      expect(
        matcher.resolve({ path: '/user/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/UseR/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
    }
  })

  it('ccc', () => {
    const sourceRoutes = [
      {
        path: '/UseR',
        sensitive: false,
        strict: false,
        component: cmp,
        name: 'user1',
      },
      {
        path: '/UseR',
        sensitive: false,
        strict: true,
        component: cmp,
        name: 'user2',
      },
      {
        path: '/UseR',
        sensitive: true,
        strict: false,
        component: cmp,
        name: 'user3',
      },
      {
        path: '/UseR',
        sensitive: true,
        strict: true,
        component: cmp,
        name: 'user4',
      },
    ]

    for (const routes of [sourceRoutes, [...sourceRoutes].reverse()]) {
      const matcher = createRouterMatcher(routes, {})
      expect(matcher.resolve({ path: '/user' }, currentLocation)).toMatchObject(
        {
          name: 'user2',
        }
      )
      expect(matcher.resolve({ path: '/USER' }, currentLocation)).toMatchObject(
        {
          name: 'user2',
        }
      )
      expect(matcher.resolve({ path: '/UseR' }, currentLocation)).toMatchObject(
        {
          name: 'user4',
        }
      )
      expect(
        matcher.resolve({ path: '/user/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/USER/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/UseR/' }, currentLocation)
      ).toMatchObject({
        name: 'user3',
      })
      expect(matcher.getRoutes().length).toBe(4)
      matcher.removeRoute('user4')
      expect(matcher.getRoutes().length).toBe(3)
      expect(matcher.resolve({ path: '/UseR' }, currentLocation)).toMatchObject(
        {
          name: 'user2',
        }
      )
      matcher.removeRoute('user2')
      expect(matcher.getRoutes().length).toBe(2)
      expect(matcher.resolve({ path: '/user' }, currentLocation)).toMatchObject(
        {
          name: 'user1',
        }
      )
      expect(matcher.resolve({ path: '/USER' }, currentLocation)).toMatchObject(
        {
          name: 'user1',
        }
      )
      expect(matcher.resolve({ path: '/UseR' }, currentLocation)).toMatchObject(
        {
          name: 'user3',
        }
      )
      expect(
        matcher.resolve({ path: '/user/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/USER/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/UseR/' }, currentLocation)
      ).toMatchObject({
        name: 'user3',
      })
      matcher.removeRoute('user3')
      expect(matcher.getRoutes().length).toBe(1)
      expect(matcher.resolve({ path: '/user' }, currentLocation)).toMatchObject(
        {
          name: 'user1',
        }
      )
      expect(matcher.resolve({ path: '/USER' }, currentLocation)).toMatchObject(
        {
          name: 'user1',
        }
      )
      expect(matcher.resolve({ path: '/UseR' }, currentLocation)).toMatchObject(
        {
          name: 'user1',
        }
      )
      expect(
        matcher.resolve({ path: '/user/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/USER/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/UseR/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
    }
  })

  it('ddd', () => {
    const sourceRoutes = [
      {
        path: '/UseR/',
        sensitive: false,
        strict: false,
        component: cmp,
        name: 'user1',
      },
      {
        path: '/UseR/',
        sensitive: false,
        strict: true,
        component: cmp,
        name: 'user2',
      },
      {
        path: '/UseR/',
        sensitive: true,
        strict: false,
        component: cmp,
        name: 'user3',
      },
      {
        path: '/UseR/',
        sensitive: true,
        strict: true,
        component: cmp,
        name: 'user4',
      },
    ]

    for (const routes of [sourceRoutes, [...sourceRoutes].reverse()]) {
      const matcher = createRouterMatcher(routes, {})
      expect(matcher.resolve({ path: '/user' }, currentLocation)).toMatchObject(
        {
          name: 'user1',
        }
      )
      expect(matcher.resolve({ path: '/USER' }, currentLocation)).toMatchObject(
        {
          name: 'user1',
        }
      )
      expect(matcher.resolve({ path: '/UseR' }, currentLocation)).toMatchObject(
        {
          name: 'user3',
        }
      )
      expect(
        matcher.resolve({ path: '/user/' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(
        matcher.resolve({ path: '/USER/' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(
        matcher.resolve({ path: '/UseR/' }, currentLocation)
      ).toMatchObject({
        name: 'user4',
      })
      expect(matcher.getRoutes().length).toBe(4)
      matcher.removeRoute('user4')
      expect(matcher.getRoutes().length).toBe(3)
      expect(
        matcher.resolve({ path: '/UseR/' }, currentLocation)
      ).toMatchObject({
        name: 'user3',
      })
      matcher.removeRoute('user3')
      expect(matcher.getRoutes().length).toBe(2)
      expect(matcher.resolve({ path: '/user' }, currentLocation)).toMatchObject(
        {
          name: 'user1',
        }
      )
      expect(matcher.resolve({ path: '/USER' }, currentLocation)).toMatchObject(
        {
          name: 'user1',
        }
      )
      expect(matcher.resolve({ path: '/UseR' }, currentLocation)).toMatchObject(
        {
          name: 'user1',
        }
      )
      expect(
        matcher.resolve({ path: '/user/' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(
        matcher.resolve({ path: '/USER/' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(
        matcher.resolve({ path: '/UseR/' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      matcher.removeRoute('user2')
      expect(matcher.getRoutes().length).toBe(1)
      expect(matcher.resolve({ path: '/user' }, currentLocation)).toMatchObject(
        {
          name: 'user1',
        }
      )
      expect(matcher.resolve({ path: '/USER' }, currentLocation)).toMatchObject(
        {
          name: 'user1',
        }
      )
      expect(matcher.resolve({ path: '/UseR' }, currentLocation)).toMatchObject(
        {
          name: 'user1',
        }
      )
      expect(
        matcher.resolve({ path: '/user/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/USER/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/UseR/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
    }
  })

  it('eee', () => {
    const sourceRoutes = [
      {
        path: '/user/:id',
        sensitive: false,
        strict: false,
        component: cmp,
        name: 'user1',
      },
      {
        path: '/user/:id',
        sensitive: false,
        strict: true,
        component: cmp,
        name: 'user2',
      },
      {
        path: '/user/:id',
        sensitive: true,
        strict: false,
        component: cmp,
        name: 'user3',
      },
      {
        path: '/user/:id',
        sensitive: true,
        strict: true,
        component: cmp,
        name: 'user4',
      },
    ]

    for (const routes of [sourceRoutes, [...sourceRoutes].reverse()]) {
      const matcher = createRouterMatcher(routes, {})
      expect(
        matcher.resolve({ path: '/user/1' }, currentLocation)
      ).toMatchObject({
        name: 'user4',
      })
      expect(
        matcher.resolve({ path: '/UseR/1' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(
        matcher.resolve({ path: '/user/1/' }, currentLocation)
      ).toMatchObject({
        name: 'user3',
      })
      expect(
        matcher.resolve({ path: '/UseR/1/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(matcher.getRoutes().length).toBe(4)
      matcher.removeRoute('user4')
      expect(matcher.getRoutes().length).toBe(3)
      expect(
        matcher.resolve({ path: '/user/1' }, currentLocation)
      ).toMatchObject({
        name: 'user3',
      })
      matcher.removeRoute('user3')
      expect(matcher.getRoutes().length).toBe(2)
      expect(
        matcher.resolve({ path: '/user/1' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(
        matcher.resolve({ path: '/UseR/1' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(
        matcher.resolve({ path: '/user/1/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/UseR/1/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      matcher.removeRoute('user2')
      expect(matcher.getRoutes().length).toBe(1)
      expect(
        matcher.resolve({ path: '/user/1' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/UseR/1' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/user/1/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/UseR/1/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
    }
  })

  it('fff', () => {
    const sourceRoutes = [
      {
        path: '/user/1',
        component: cmp,
        name: 'user1',
      },
      {
        path: '/user/:id',
        component: cmp,
        name: 'user2',
      },
      {
        path: '/user/:id(\\d+)',
        component: cmp,
        name: 'user3',
      },
    ]

    for (const routes of [sourceRoutes, [...sourceRoutes].reverse()]) {
      const matcher = createRouterMatcher(routes, {})
      expect(
        matcher.resolve({ path: '/user/1' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/user/12' }, currentLocation)
      ).toMatchObject({
        name: 'user3',
      })
      expect(
        matcher.resolve({ path: '/user/abc' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
    }
  })

  it('ggg', () => {
    const sourceRoutes = [
      {
        path: '/user',
        component: cmp,
        name: 'user2',
        end: false,
      },
      {
        path: '/user/:id(\\d+)',
        component: cmp,
        name: 'user3',
      },
      {
        path: '/user/1',
        component: cmp,
        name: 'user4',
        strict: true,
      },
      {
        path: '/user/1',
        component: cmp,
        name: 'user5',
        end: false,
      },
    ]

    for (const routes of [sourceRoutes, [...sourceRoutes].reverse()]) {
      const matcher = createRouterMatcher(routes, {})
      expect(matcher.resolve({ path: '/user' }, currentLocation)).toMatchObject(
        {
          name: 'user2',
        }
      )
      expect(
        matcher.resolve({ path: '/user/' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(
        matcher.resolve({ path: '/user1' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(
        matcher.resolve({ path: '/user1/' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(
        matcher.resolve({ path: '/user/1' }, currentLocation)
      ).toMatchObject({
        name: 'user4',
      })
      expect(
        matcher.resolve({ path: '/user/1/' }, currentLocation)
      ).toMatchObject({
        name: 'user5',
      })
      expect(
        matcher.resolve({ path: '/user/12' }, currentLocation)
      ).toMatchObject({
        name: 'user5', // * Breaks for tree branch
      })
      expect(
        matcher.resolve({ path: '/user/12/' }, currentLocation)
      ).toMatchObject({
        name: 'user5',
      })
      expect(
        matcher.resolve({ path: '/user/abc' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(
        matcher.resolve({ path: '/user/abc/' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(
        matcher.resolve({ path: '/user/1/1' }, currentLocation)
      ).toMatchObject({
        name: 'user5',
      })
      expect(
        matcher.resolve({ path: '/user/1/1/' }, currentLocation)
      ).toMatchObject({
        name: 'user5',
      })
      expect(
        matcher.resolve({ path: '/user/2' }, currentLocation)
      ).toMatchObject({
        name: 'user3',
      })
      expect(
        matcher.resolve({ path: '/user/2/' }, currentLocation)
      ).toMatchObject({
        name: 'user3',
      })
    }
  })

  it('ggg2', () => {
    const sourceRoutes = [
      {
        path: '/user/',
        component: cmp,
        name: 'user2',
        end: false,
      },
      {
        path: '/user/:id(\\d+)',
        component: cmp,
        name: 'user3',
      },
      {
        path: '/user/1',
        component: cmp,
        name: 'user4',
        strict: true,
      },
      {
        path: '/user/1',
        component: cmp,
        name: 'user5',
        end: false,
      },
    ]

    for (const routes of [sourceRoutes, [...sourceRoutes].reverse()]) {
      const matcher = createRouterMatcher(routes, {})
      expect(matcher.resolve({ path: '/user' }, currentLocation)).toMatchObject(
        {
          name: 'user2',
        }
      )
      expect(
        matcher.resolve({ path: '/user/' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(
        matcher.resolve({ path: '/user1' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(
        matcher.resolve({ path: '/user1/' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(
        matcher.resolve({ path: '/user/1' }, currentLocation)
      ).toMatchObject({
        name: 'user2', // * This has jumped from user4 to user2... why?
      })
      expect(
        matcher.resolve({ path: '/user/1/' }, currentLocation)
      ).toMatchObject({
        name: 'user2', // * This has jumped from user5 to user2... why?
      })
      expect(
        matcher.resolve({ path: '/user/12' }, currentLocation)
      ).toMatchObject({
        name: 'user2', // * This has jumped from user5 to user2... why?
      })
      expect(
        matcher.resolve({ path: '/user/12/' }, currentLocation)
      ).toMatchObject({
        name: 'user2', // * This has jumped from user5 to user2... why?
      })
      expect(
        matcher.resolve({ path: '/user/abc' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(
        matcher.resolve({ path: '/user/abc/' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(
        matcher.resolve({ path: '/user/1/1' }, currentLocation)
      ).toMatchObject({
        name: 'user2', // * This has jumped from user5 to user2... why?
      })
      expect(
        matcher.resolve({ path: '/user/1/1/' }, currentLocation)
      ).toMatchObject({
        name: 'user2', // * This has jumped from user5 to user2... why?
      })
      expect(
        matcher.resolve({ path: '/user/2' }, currentLocation)
      ).toMatchObject({
        name: 'user2', // * This has jumped from user3 to user2... why?
      })
      expect(
        matcher.resolve({ path: '/user/2/' }, currentLocation)
      ).toMatchObject({
        name: 'user2', // * This has jumped from user3 to user2... why?
      })
    }
  })

  it('hhh', () => {
    // The order matters here, but should it? The reverse order is used in the next test.
    const matcher = createRouterMatcher(
      [
        {
          path: '/user/1',
          component: cmp,
          name: 'user1',
        },
        {
          path: '/user/1',
          component: cmp,
          name: 'user2',
          end: false,
          strict: true,
        },
        {
          path: '/user/1/',
          component: cmp,
          name: 'user3',
          end: false,
          strict: true,
        },
        {
          path: '/user/1',
          component: cmp,
          name: 'user4',
          end: false,
          strict: false,
        },
      ],
      {}
    )
    expect(matcher.resolve({ path: '/user/1' }, currentLocation)).toMatchObject(
      {
        name: 'user1',
      }
    )
    expect(
      matcher.resolve({ path: '/user/1/' }, currentLocation)
    ).toMatchObject({
      name: 'user3',
    })
    expect(
      matcher.resolve({ path: '/user/12' }, currentLocation)
    ).toMatchObject({
      name: 'user4',
    })
    expect(
      matcher.resolve({ path: '/user/12/' }, currentLocation)
    ).toMatchObject({
      name: 'user4',
    })
    expect(
      matcher.resolve({ path: '/user/1/2' }, currentLocation)
    ).toMatchObject({
      // name: 'user3', // Routes with trailing slashes get higher scores. Unclear why.
      name: 'user2',
    })
    expect(
      matcher.resolve({ path: '/user/1/2/' }, currentLocation)
    ).toMatchObject({
      // name: 'user3', // Ditto.
      name: 'user2',
    })
  })

  it('iii', () => {
    // The order matters here, but should it? This is the same as the previous test but with reverse() added.
    const matcher = createRouterMatcher(
      [
        {
          path: '/user/1',
          component: cmp,
          name: 'user1',
        },
        {
          path: '/user/1',
          component: cmp,
          name: 'user2',
          end: false,
          strict: true,
        },
        {
          path: '/user/1/',
          component: cmp,
          name: 'user3',
          end: false,
          strict: true,
        },
        {
          path: '/user/1',
          component: cmp,
          name: 'user4',
          end: false,
          strict: false,
        },
      ].reverse(),
      {}
    )
    expect(matcher.resolve({ path: '/user/1' }, currentLocation)).toMatchObject(
      {
        //name: 'user4', // The static perf branch switches this
        name: 'user1',
      }
    )
    expect(
      matcher.resolve({ path: '/user/1/' }, currentLocation)
    ).toMatchObject({
      name: 'user3',
    })
    expect(
      matcher.resolve({ path: '/user/12' }, currentLocation)
    ).toMatchObject({
      name: 'user4',
    })
    expect(
      matcher.resolve({ path: '/user/12/' }, currentLocation)
    ).toMatchObject({
      name: 'user4',
    })
    expect(
      matcher.resolve({ path: '/user/1/2' }, currentLocation)
    ).toMatchObject({
      // name: 'user3',
      // name: 'user4', // The static perf branch switches this
      name: 'user2',
    })
    expect(
      matcher.resolve({ path: '/user/1/2/' }, currentLocation)
    ).toMatchObject({
      // name: 'user3',
      // name: 'user4', // The static perf branch switches this
      name: 'user2',
    })
  })

  it('jjj', () => {
    const matcher = createRouterMatcher(
      [
        {
          path: '/user',
          children: [
            {
              path: '',
              children: [
                {
                  path: '',
                  component: cmp,
                  name: 'user',
                },
              ],
            },
          ],
        },
        {
          path: '/product',
          children: [
            {
              path: '',
              children: [
                {
                  path: '/product',
                  component: cmp,
                  name: 'product',
                },
              ],
            },
          ],
        },
        {
          path: '/role',
          component: cmp,
          children: [
            {
              path: '',
              children: [
                {
                  path: '',
                  component: cmp,
                  name: 'role',
                },
              ],
            },
          ],
        },
        {
          path: '/support',
          component: cmp,
          children: [
            {
              path: '/media',
              component: cmp,
              children: [
                {
                  path: '/support',
                  component: cmp,
                  name: 'support',
                },
              ],
            },
          ],
        },
        {
          path: '/help',
          component: cmp,
          name: 'help-parent',
          children: [
            {
              path: '/docs',
              component: cmp,
              name: 'docs-parent',
              children: [
                {
                  path: '/about',
                  component: cmp,
                  name: 'about',
                },
                {
                  path: '/docs',
                  component: cmp,
                  name: 'docs',
                },
                {
                  path: '/help',
                  component: cmp,
                  name: 'help',
                },
              ],
            },
          ],
        },
      ],
      {}
    )

    expect(matcher.resolve({ path: '/user' }, currentLocation)).toMatchObject({
      name: 'user',
    })
    expect(
      matcher.resolve({ path: '/product' }, currentLocation)
    ).toMatchObject({
      name: 'product',
    })
    expect(matcher.resolve({ path: '/role' }, currentLocation)).toMatchObject({
      name: 'role',
    })
    expect(
      matcher.resolve({ path: '/support' }, currentLocation)
    ).toMatchObject({
      name: 'support',
    })
    expect(matcher.resolve({ path: '/about' }, currentLocation)).toMatchObject({
      name: 'about',
    })
    expect(matcher.resolve({ path: '/docs' }, currentLocation)).toMatchObject({
      name: 'docs',
    })
    expect(matcher.resolve({ path: '/help' }, currentLocation)).toMatchObject({
      name: 'help',
    })

    matcher.removeRoute('docs')
    matcher.removeRoute('help')

    expect(matcher.resolve({ path: '/about' }, currentLocation)).toMatchObject({
      name: 'about',
    })
    expect(matcher.resolve({ path: '/docs' }, currentLocation)).toMatchObject({
      name: 'docs-parent',
    })
    expect(matcher.resolve({ path: '/help' }, currentLocation)).toMatchObject({
      name: 'help-parent',
    })
  })

  it('kkk', () => {
    const matcher = createRouterMatcher(
      [
        {
          path: '/user',
          component: cmp,
          name: 'user',
        },
        {
          path: '/user',
          name: 'user-root',
          component: cmp,
          children: [
            {
              path: '',
              children: [
                {
                  path: 'list',
                  component: cmp,
                },
              ],
            },
          ],
        },
      ],
      {}
    )

    expect(matcher.resolve({ path: '/user' }, currentLocation)).toMatchObject({
      name: 'user',
    })
  })

  it('lll', () => {
    const matcher = createRouterMatcher(
      [
        {
          path: '/user',
          component: cmp,
          name: 'user',
        },
        {
          path: '/user',
          name: 'user-root',
          component: cmp,
          children: [
            {
              path: '',
              component: cmp,
              children: [
                {
                  path: 'list',
                  component: cmp,
                },
              ],
            },
          ],
        },
      ],
      {}
    )

    expect(matcher.resolve({ path: '/user' }, currentLocation)).toMatchObject({
      name: 'user',
    })
  })

  it('mmm', () => {
    const matcher = createRouterMatcher(
      [
        {
          path: '/user/:a(\\d+)-:b(\\d+)',
          component: cmp,
          children: [
            {
              path: '/user/:b(\\d+)-:a(\\d+)',
              component: cmp,
            },
          ],
        },
      ],
      {}
    )
    expect(
      matcher.resolve({ path: '/user/1-2' }, currentLocation)
    ).toMatchObject({
      params: {
        a: '2',
        b: '1',
      },
    })
  })

  it('nnn', () => {
    const matcher = createRouterMatcher(
      [
        {
          path: '/user/:a(\\d+)-:b(\\d+)',
          component: cmp,
          name: 'root',
        },
      ],
      {}
    )
    const parent = matcher.getRecordMatcher('root')
    matcher.addRoute(
      {
        path: '/user/:b(\\d+)-:a(\\d+)',
        component: cmp,
      },
      parent
    )
    expect(
      matcher.resolve({ path: '/user/1-2' }, currentLocation)
    ).toMatchObject({
      params: {
        // TODO: Behaviour change in the binary search branch
        // a: '1',
        // b: '2',
        a: '2',
        b: '1',
      },
    })
  })

  it('ooo', () => {
    const matcher = createRouterMatcher(
      [
        {
          path: '/user/:id(\\d+)',
          sensitive: false,
          component: cmp,
          name: 'level1',
          children: [
            {
              path: '',
              sensitive: true,
              component: cmp,
              name: 'level2',
              children: [
                {
                  path: '',
                  sensitive: false,
                  component: cmp,
                  name: 'level3',
                  children: [
                    {
                      path: '',
                      sensitive: true,
                      component: cmp,
                      name: 'level4',
                      children: [
                        {
                          path: '',
                          sensitive: false,
                          component: cmp,
                          name: 'level5',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      {}
    )
    expect(
      matcher.resolve({ path: '/user/123' }, currentLocation)
    ).toMatchObject({
      name: 'level4',
    })
    expect(
      matcher.resolve({ path: '/User/123' }, currentLocation)
    ).toMatchObject({
      name: 'level5',
    })
    matcher.removeRoute('level5')
    expect(
      matcher.resolve({ path: '/user/123' }, currentLocation)
    ).toMatchObject({
      name: 'level4',
    })
    expect(
      matcher.resolve({ path: '/User/123' }, currentLocation)
    ).toMatchObject({
      name: 'level3',
    })
    matcher.removeRoute('level4')
    expect(
      matcher.resolve({ path: '/user/123' }, currentLocation)
    ).toMatchObject({
      name: 'level2',
    })
    expect(
      matcher.resolve({ path: '/User/123' }, currentLocation)
    ).toMatchObject({
      name: 'level3',
    })
    matcher.removeRoute('level3')
    expect(
      matcher.resolve({ path: '/user/123' }, currentLocation)
    ).toMatchObject({
      name: 'level2',
    })
    expect(
      matcher.resolve({ path: '/User/123' }, currentLocation)
    ).toMatchObject({
      name: 'level1',
    })
    matcher.removeRoute('level2')
    expect(
      matcher.resolve({ path: '/user/123' }, currentLocation)
    ).toMatchObject({
      name: 'level1',
    })
    expect(
      matcher.resolve({ path: '/User/123' }, currentLocation)
    ).toMatchObject({
      name: 'level1',
    })
  })

  it('ppp', () => {
    const matcher = createRouterMatcher(
      [
        {
          path: '/user/:id(\\d+)',
          component: cmp,
          name: 'level1',
          children: [
            {
              path: '',
              children: [
                {
                  path: '',
                  component: cmp,
                  name: 'level3',
                  children: [
                    {
                      path: '',
                      children: [
                        {
                          path: '',
                          component: cmp,
                          name: 'level5',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      {}
    )
    expect(matcher.getRoutes().length).toBe(3)
    expect(
      matcher.resolve({ path: '/user/123' }, currentLocation)
    ).toMatchObject({
      name: 'level5',
    })
    matcher.removeRoute('level5')
    expect(matcher.getRoutes().length).toBe(2)
    expect(
      matcher.resolve({ path: '/user/123' }, currentLocation)
    ).toMatchObject({
      name: 'level3',
    })
    matcher.removeRoute('level3')
    expect(matcher.getRoutes().length).toBe(1)
    expect(
      matcher.resolve({ path: '/user/123' }, currentLocation)
    ).toMatchObject({
      name: 'level1',
    })
  })

  it('qqq', () => {
    const matcher1 = createRouterMatcher(
      [
        {
          path: '/a',
          name: 'parent',
          component: {},
          children: [
            {
              path: 'b',
              name: 'child',
              component: {},
            },
          ],
        },
        {
          path: '/a/b',
          name: 'other',
          component: {},
        },
      ],
      {}
    )

    const matcher2 = createRouterMatcher(
      [
        {
          path: '/a',
          name: 'parent',
          component: {},
        },
        {
          path: '/a/b',
          name: 'other',
          component: {},
        },
      ],
      {}
    )

    matcher2.addRoute(
      {
        path: 'b',
        name: 'child',
        component: {},
      },
      matcher2.getRecordMatcher('parent')
    )

    const matcher3 = createRouterMatcher(
      [
        {
          path: '/a/c',
          name: 'parent',
          component: {},
        },
        {
          path: '/a/b',
          name: 'other',
          component: {},
        },
      ],
      {}
    )

    matcher3.addRoute(
      {
        path: '/a/b',
        name: 'child',
        component: {},
      },
      matcher3.getRecordMatcher('parent')
    )

    expect(matcher1.resolve({ path: '/a/b' }, currentLocation)).toMatchObject({
      name: 'child',
    })
    expect(matcher2.resolve({ path: '/a/b' }, currentLocation)).toMatchObject({
      name: 'other',
    })
    expect(matcher3.resolve({ path: '/a/b' }, currentLocation)).toMatchObject({
      // Originally this was 'other'. It got changed to 'child' by the binary search changes.
      // The static perf branch flips it back to 'other'.
      // Addition order isn't officially a requirement, but generally the first route added takes priority, so this
      // probably should be 'other'.
      name: 'other',
    })
  })

  it('rrr', () => {
    const matcher = createRouterMatcher(
      [
        {
          path: '/a',
          component: cmp,
          name: 'a',
          end: false,
        },
      ],
      {}
    )
    expect(matcher.resolve({ path: '/a' }, currentLocation)).toMatchObject({
      name: 'a',
    })
    expect(matcher.resolve({ path: '/a/' }, currentLocation)).toMatchObject({
      name: 'a',
    })
    expect(matcher.resolve({ path: '/ab' }, currentLocation)).toMatchObject({
      name: 'a',
    })
    expect(matcher.resolve({ path: '/a/b' }, currentLocation)).toMatchObject({
      name: 'a',
    })
  })

  it('sss', () => {
    const matcher = createRouterMatcher(
      [
        {
          path: '/a/',
          component: cmp,
          name: 'a',
          end: false,
        },
      ],
      {}
    )
    expect(matcher.resolve({ path: '/a' }, currentLocation)).toMatchObject({
      name: 'a',
    })
    expect(matcher.resolve({ path: '/a/' }, currentLocation)).toMatchObject({
      name: 'a',
    })
    expect(matcher.resolve({ path: '/ab' }, currentLocation)).toMatchObject({
      name: 'a',
    })
    expect(matcher.resolve({ path: '/a/b' }, currentLocation)).toMatchObject({
      name: 'a',
    })
  })

  it('uuu', () => {
    const matcher = createRouterMatcher(
      [
        {
          path: '/a',
          component: cmp,
          name: 'a',
          end: false,
          strict: true,
        },
      ],
      {}
    )
    expect(matcher.resolve({ path: '/a' }, currentLocation)).toMatchObject({
      name: 'a',
    })
    expect(matcher.resolve({ path: '/a/' }, currentLocation)).toMatchObject({
      name: 'a',
    })
    expect(matcher.resolve({ path: '/ab' }, currentLocation)).toMatchObject({
      name: undefined,
    })
    expect(matcher.resolve({ path: '/a/b' }, currentLocation)).toMatchObject({
      name: 'a',
    })
  })

  it('vvv', () => {
    const matcher = createRouterMatcher(
      [
        {
          path: '/a/',
          component: cmp,
          name: 'a',
          end: false,
          strict: true,
        },
      ],
      {}
    )
    expect(matcher.resolve({ path: '/a' }, currentLocation)).toMatchObject({
      name: undefined,
    })
    expect(matcher.resolve({ path: '/a/' }, currentLocation)).toMatchObject({
      name: 'a',
    })
    expect(matcher.resolve({ path: '/ab' }, currentLocation)).toMatchObject({
      name: undefined,
    })
    expect(matcher.resolve({ path: '/a/b' }, currentLocation)).toMatchObject({
      // name: 'a', // TODO: This currently fails on main
      name: undefined,
    })
  })

  it('www', () => {
    const sourceRoutes = [
      {
        path: '/user/admin',
        component: cmp,
        name: 'user1',
        end: false,
        strict: true,
      },
      {
        path: '/user/:id',
        component: cmp,
        name: 'user2',
      },
    ]

    for (const routes of [sourceRoutes, [...sourceRoutes].reverse()]) {
      const matcher = createRouterMatcher(routes, {})
      expect(
        matcher.resolve({ path: '/user/admin' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/user/other' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(
        matcher.resolve({ path: '/user/admin2' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(
        matcher.resolve({ path: '/user/admin/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/user/admin/other' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
    }
  })

  it('xxx', () => {
    const sourceRoutes = [
      {
        path: '/user/admin',
        component: cmp,
        name: 'user1',
        end: false,
        strict: true,
      },
      {
        path: '/user/:id',
        component: cmp,
        name: 'user2',
        strict: true,
      },
    ]

    for (const routes of [sourceRoutes, [...sourceRoutes].reverse()]) {
      const matcher = createRouterMatcher(routes, {})
      expect(
        matcher.resolve({ path: '/user/admin' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/user/other' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(
        matcher.resolve({ path: '/user/admin2' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
      expect(
        matcher.resolve({ path: '/user/admin/' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/user/admin/other' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
    }
  })

  it('yyy', () => {
    const sourceRoutes = [
      {
        path: '/user/:id',
        component: cmp,
        name: 'user1',
        sensitive: true,
      },
      {
        path: '/user/admin',
        component: cmp,
        name: 'user2',
        sensitive: false,
      },
    ]

    for (const routes of [sourceRoutes, [...sourceRoutes].reverse()]) {
      const matcher = createRouterMatcher(routes, {})
      expect(
        matcher.resolve({ path: '/user/admin' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/user/other' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/User/admin' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
    }
  })

  it('zzz', () => {
    const sourceRoutes = [
      {
        path: '/user/:id/:sub',
        component: cmp,
        name: 'user1',
        sensitive: true,
      },
      {
        path: '/user/admin/:sub',
        component: cmp,
        name: 'user2',
        sensitive: false,
      },
    ]

    for (const routes of [sourceRoutes, [...sourceRoutes].reverse()]) {
      const matcher = createRouterMatcher(routes, {})
      expect(
        matcher.resolve({ path: '/user/admin/123' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/user/123/456' }, currentLocation)
      ).toMatchObject({
        name: 'user1',
      })
      expect(
        matcher.resolve({ path: '/User/admin/123' }, currentLocation)
      ).toMatchObject({
        name: 'user2',
      })
    }
  })

  it('aaa-aaa', () => {
    const matcher = createRouterMatcher(
      [
        {
          path: '/user/',
          component: cmp,
          name: 'user1',
          children: [
            {
              path: '/USER/',
              component: cmp,
              name: 'user2',
            },
          ],
        },
      ],
      {}
    )

    expect(matcher.resolve({ path: '/user' }, currentLocation)).toMatchObject({
      name: 'user2',
    })
    expect(matcher.resolve({ path: '/USER' }, currentLocation)).toMatchObject({
      name: 'user2',
    })
    expect(matcher.resolve({ path: '/user/' }, currentLocation)).toMatchObject({
      name: 'user2',
    })
    expect(matcher.resolve({ path: '/USER/' }, currentLocation)).toMatchObject({
      name: 'user2',
    })
  })

  it('aaa-bbb', () => {
    const matcher = createRouterMatcher(
      [
        {
          path: '/USER/',
          component: cmp,
          name: 'user1',
          children: [
            {
              path: '/user/',
              component: cmp,
              name: 'user2',
            },
          ],
        },
      ],
      {}
    )

    expect(matcher.resolve({ path: '/user' }, currentLocation)).toMatchObject({
      name: 'user2',
    })
    expect(matcher.resolve({ path: '/USER' }, currentLocation)).toMatchObject({
      name: 'user2',
    })
    expect(matcher.resolve({ path: '/user/' }, currentLocation)).toMatchObject({
      name: 'user2',
    })
    expect(matcher.resolve({ path: '/USER/' }, currentLocation)).toMatchObject({
      name: 'user2',
    })
  })

  it('aaa-ccc', () => {
    const matcher = createRouterMatcher(
      [
        {
          path: '/user',
          component: cmp,
          name: 'user1',
          children: [
            {
              path: '/USER/',
              component: cmp,
              name: 'user2',
            },
          ],
        },
      ],
      {}
    )

    expect(matcher.resolve({ path: '/user' }, currentLocation)).toMatchObject({
      name: 'user2',
    })
    expect(matcher.resolve({ path: '/USER' }, currentLocation)).toMatchObject({
      name: 'user2',
    })
    expect(matcher.resolve({ path: '/user/' }, currentLocation)).toMatchObject({
      name: 'user2',
    })
    expect(matcher.resolve({ path: '/USER/' }, currentLocation)).toMatchObject({
      name: 'user2',
    })
  })
})
