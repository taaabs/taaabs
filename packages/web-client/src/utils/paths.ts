export enum ROUTE_NAME {
  HOME = 'home',
  EXPLORE = 'explore',
  COLLECTIONS = 'collections',
  SETTINGS = 'settings',
}

export type RouteProps = {
  [key in ROUTE_NAME]: { path: () => string; displayName: string }
}

export const ROUTE: RouteProps = {
  home: { path: () => '/', displayName: 'Home' },
  explore: { path: () => '/explore', displayName: 'Explore' },
  collections: { path: () => '/collections', displayName: 'Collections' },
  settings: { path: () => '/settings', displayName: 'Settings' },
}
