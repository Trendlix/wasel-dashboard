# Dashboard Notifications Socket Guide

This document explains the frontend realtime notification flow used in dashboard.

## Where It Lives

- Store: `src/shared/hooks/store/useDashboardNotificationsStore.ts`
- Sidebar consumer: `src/shared/components/layout/Sidebar.tsx`
- Notifications page consumer: `src/shared/components/pages/notifications/RecentNotifications.tsx`
- Sound file: `public/sound/mixkit-digital-quick-tone-2866.wav`

## Socket Namespace

- Socket.IO namespace: `/admin`
- Unified namespace (new): `/notifications`
- Base URL source:
  - `VITE_API_BASE_URL` (origin part is used)
  - fallback: `window.location.origin`

## Events We Listen To

### 1) `dashboard:notifications:count`

Purpose:
- Update unread/total counters in real time (sidebar badge + tabs logic).

Payload:
```ts
{
  total: number;
  unread_total: number;
  by_type: { user: number; driver: number; trip: number };
  unread_by_type: { user: number; driver: number; trip: number };
}
```

### 2) `dashboard:notification:user:new`
### 3) `dashboard:notification:driver:new`
### 4) `dashboard:notification:trip:new`

Purpose:
- Show toast
- Play notification sound
- Refresh notifications list + count

Expected payload shape (from backend consumers):
```ts
{
  id: number;
  title: string;
  description: string;
  created_at: string;
  // one of:
  user_id?: number;
  driver_id?: number;
  trip_id?: number;
}
```

### 5) `notifications:new` (Unified)

Purpose:
- Receive unified backend events without breaking old dashboard channels.
- Trigger same UX behavior: toast + sound + list/count refresh.

Handshake used:
```ts
{
  recipient_type: "admin",
  recipient_id: adminId,
  presence_state: "foreground"
}
```

Payload:
```ts
{
  id: number;
  event_key: string;
  title: string;
  body: string;
  payload?: Record<string, unknown>;
  created_at: string;
}
```

## Unified Event Mapping

Mapping helpers live in:
- `src/shared/core/notifications/notification-events.ts`

Current bucket mapping examples:
- Offers: `offer.campaign.by_admin`, `offer.quoted.by_driver`, `offer.accepted.by_user`
- Updates: `update.campaign.by_admin`, `driver.verification.approved`, `user.status.changed`
- Support: `ticket.created`, `ticket.reply.by_admin`, `chat.message.new`
- General: any unmatched event key

The store uses a dedupe key (`id` fallback to event+created+entity) to avoid duplicate handling.

## Store API (Zustand)

Main actions:
- `initializeRealtime()`
- `teardownRealtime()`
- `fetchNotifications()`
- `fetchNotificationsCount()`
- `markAllNotificationsAsRead()`
- `markTabNotificationsAsRead(tab)`
- `markNotificationItemAsRead(tab, id)`

Main state:
- `notifications: { user: []; driver: []; trip: [] }`
- `counts` with `total`, `unread_total`, `by_type`, `unread_by_type`
- `activeTab`, `loading`, `error`

## Current Mounting Pattern

- `Sidebar` initializes socket once via `initializeRealtime()`.
- `RecentNotifications` only fetches list data, and does not open a second socket connection.

This avoids duplicate connect/disconnect behavior in development.

## Toast + Sound Behavior

On `*:new` events:
- toast shown via `showToast(...)`
- sound played from `/sound/mixkit-digital-quick-tone-2866.wav`

Audio notes:
- Browser may block autoplay until first user interaction.
- Store includes unlock logic on first pointer interaction.

## Debug Helpers

For debugging in browser console:
```js
window.__dashboardSocket
window.__dashboardSocket?.connected
window.__dashboardSocket?.io?.uri
```

## Backend Endpoints Used by Frontend

- `GET /dashboard/notifications`
- `GET /dashboard/notifications/count`
- `PATCH /dashboard/notifications/mark-all-as-read`
- `PATCH /dashboard/notifications/:type/mark-all-as-read`
- `PATCH /dashboard/notifications/:type/:id/mark-as-read`

## Quick QA Checklist

1. Open dashboard with sidebar visible.
2. Trigger any backend producer (`user`, `driver`, `trip`).
3. Confirm:
   - Toast appears
   - Sound plays
   - New row appears in recent notifications
   - Sidebar unread count updates

## Common Issues

### WebSocket warning in dev console

`WebSocket is closed before the connection is established`

Usually seen in development due to React StrictMode mount/unmount cycles.
If `window.__dashboardSocket?.connected === true`, realtime is working.

### No socket connection

Check:
- backend is reachable on configured host/port
- `VITE_API_BASE_URL` is correct
- Socket.IO endpoint responds:  
  `GET /socket.io/?EIO=4&transport=polling`

