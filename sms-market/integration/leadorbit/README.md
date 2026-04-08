# LeadOrbit SMS Integration (Twilio -> Plivo)

This folder provides a small adapter so your LeadOrbit project can send SMS through Plivo instead of Twilio.

## Important

SMS is never fully free in production because carriers charge delivery fees.
You can reduce cost or move provider, but there is no unlimited free SMS route for real traffic.

## Files

- `plivoSmsAdapter.js`: Provider adapter with `sendSms(...)`
- `expressRouteExample.js`: Example API route for your app

## Environment Variables

Set these in your LeadOrbit environment:

- `PLIVO_AUTH_ID`
- `PLIVO_AUTH_TOKEN`
- `PLIVO_SOURCE_NUMBER` (default sender)

## Quick Start

1. Copy this folder into your LeadOrbit repository.
2. Install dependencies in LeadOrbit:
   - `npm install plivo express body-parser`
3. Mount the route (or copy the route handler) in your server.
4. Send a POST request to `/api/sms/send` with:
   - `to`
   - `from` (optional if `PLIVO_SOURCE_NUMBER` is set)
   - `body` or `message`

## Example Request

```bash
curl -X POST http://localhost:5001/api/sms/send \
  -H "Content-Type: application/json" \
  -d '{"to":"+14151112222","from":"+14151113333","body":"Hello from LeadOrbit"}'
```
