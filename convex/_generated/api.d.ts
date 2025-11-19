/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as bids from "../bids.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as items from "../items.js";
import type * as notifications from "../notifications.js";
import type * as provider from "../provider.js";
import type * as realtime from "../realtime.js";
import type * as router from "../router.js";
import type * as storage from "../storage.js";
import type * as users from "../users.js";
import type * as watchlist from "../watchlist.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  auth: typeof auth;
  bids: typeof bids;
  crons: typeof crons;
  http: typeof http;
  items: typeof items;
  notifications: typeof notifications;
  provider: typeof provider;
  realtime: typeof realtime;
  router: typeof router;
  storage: typeof storage;
  users: typeof users;
  watchlist: typeof watchlist;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
