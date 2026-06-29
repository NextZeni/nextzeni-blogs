# Feature Plan: Blog Creation with Admin Approval + View Analytics

## Goal
- Users can write and submit blogs
- Admin reviews and approves/rejects before public display
- Users can see view counts for each of their published blogs
- Images stored in Firebase Storage; all article data in Firestore

---

## Architecture

### Storage
| Layer | Used For |
|-------|----------|
| **Firestore** (`articles` collection) | All blog data (pending, published, draft) |
| **Firebase Storage** (`covers/` bucket) | Cover image uploads |
| **localStorage** | Auth session only (unchanged) |

### Article Status Flow
```
User submits → "pending"
                  ↓
        Admin Panel Review
          ↙           ↘
    "published"     "rejected"
  (shows publicly)  (hidden, user sees rejection)
```

### Firestore Collection: `articles`
```
{
  id: string
  title: string
  description: string
  author: string           // display name
  authorId: string         // user id from AuthContext
  date: string
  readingTime: string
  category: string
  claps: number
  responses: number
  content: string
  coverImage?: string      // Firebase Storage URL
  tags?: string[]
  views: number
  status: "pending" | "published" | "draft" | "rejected"
  rejectionReason?: string // set by admin when rejecting
}
```

---

## Files to Create

### 1. `src/lib/firebase.ts`
Firebase app init + Firestore + Storage exports.

### 2. `src/app/dashboard/page.tsx`
User panel — shows the logged-in user's blogs with:
- Status badge (pending / published / rejected)
- View count for each blog
- Total views across all blogs
- Link to edit/view each blog

### 3. `src/app/admin/blogs/page.tsx`
Admin-only page — lists pending blogs with:
- Preview of title, author, category, excerpt
- Approve button → sets status = "published"
- Reject button → modal to enter reason, sets status = "rejected"

---

## Files to Modify

### 4. `src/data/dummy.ts`
Add `"pending"` and `"rejected"` to `Article.status` type.
Add optional `rejectionReason?: string` field.

### 5. `src/context/BlogContext.tsx`
- Replace localStorage read/write with Firestore `onSnapshot` listener
- `addBlog` → writes to Firestore with `status: "pending"`
- Add `approveBlog(id)` → updates Firestore status to "published"
- Add `rejectBlog(id, reason)` → updates Firestore status to "rejected"
- `incrementViews` → Firestore increment
- `updateBlog`, `deleteBlog`, `addComment` → Firestore ops
- Seed articles written to Firestore once on first load (checked via a `meta/seed` doc)

### 6. `src/app/write/page.tsx`
- Pull author name from `useAuth()` (no manual entry if logged in)
- Add cover image upload → Firebase Storage → stores URL on article
- On submit → `status: "pending"` instead of direct publish
- Show "Submitted for review" confirmation instead of redirecting to article

### 7. `src/app/page.tsx`
- Filter feed to only show articles where `status === "published"`
- Featured article also only from published set

---

## Implementation Order

1. Install `firebase` package
2. Create `src/lib/firebase.ts`
3. Update `src/data/dummy.ts` type
4. Refactor `src/context/BlogContext.tsx` → Firestore
5. Update `src/app/write/page.tsx` → image upload + pending submit
6. Create `src/app/dashboard/page.tsx`
7. Create `src/app/admin/blogs/page.tsx`
8. Update `src/app/page.tsx` to filter published only
9. Add Dashboard + Admin links to Header/nav

---

## Admin Credentials
- Email: `admin@nextzeni.com`
- Password: `admin123`
- Role check: `user?.role === "admin"` (from AuthContext)
