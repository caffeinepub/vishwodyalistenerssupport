# VishwodyaListenersSupport

## Current State
Empty project with only boilerplate frontend (shadcn components, Tailwind, React). No App.tsx, no pages, no backend.

## Requested Changes (Diff)

### Add
- Support ticket submission form (public page): Name, Email, Phone, Session ID (optional), Issue Type, Message, file attachment upload
- Unique Support Ticket ID generation: VLS + DATE + SERIAL (e.g. VLS031101)
- Ticket status tracking page: user enters Ticket ID and sees status + admin response
- Admin dashboard (login-protected): view all tickets, filter by status, assign/respond, mark resolved
- Help Center/FAQ page: 5 common questions about the platform
- Integration reference link to main platform at vishwodya.netlify.app
- Design: Deep Blue primary, Warm Orange accent, white background, spacious comfortable layouts with rounded cards

### Modify
- index.css: add Deep Blue + Warm Orange OKLCH color tokens

### Remove
- Nothing

## Implementation Plan
1. Backend: SupportTicket record (id, name, email, phone, sessionId, issueType, message, status, adminResponse, createdAt), CRUD functions, admin auth via hardcoded PIN, ticket ID generation
2. Frontend pages:
   - Homepage with hero, how-it-works, link to vishwodya.netlify.app
   - Submit Support Request form
   - Track Ticket page
   - Admin Dashboard (PIN-gated)
   - Help Center / FAQ
3. Design system: Deep Blue + Warm Orange tokens, spacious padding, rounded-2xl cards, soft shadows
