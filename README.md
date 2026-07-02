# Awab Portfolio & Admin Dashboard

Modern single-page portfolio site bundled with an authenticated admin workspace.  
The public site showcases projects fetched from Firestore, while the admin area lets you manage projects, messages, and notifications directly through Firebase services.

---

## ✨ Features

- **Portfolio UI**
  - Responsive landing pages with motion reveals and CTA sections.
  - `WebProjects` page loads project cards from Firestore in real-time.
  - Contact form that stores messages in Firestore and pushes admin notifications.

- **Admin Dashboard**
  - Firebase email/password authentication with password visibility toggle.
  - Dashboard metrics (projects, messages, unread notifications) sourced from Firestore.
  - Manage projects: add, edit, delete with tech presets & Firestore sync.
  - Messages centre with search, filtering, shadcn sheets, and contact replies.
  - Notifications dialog fed from Firestore with read/unread state and deletion.
  - Theme toggle (light/dark), Firebase-backed account settings (name/email/password).

- **UI System**
  - Tailwind 4 setup with shadcn-inspired components (button, select, popover, dropdown).
  - Animation helpers with `Reveal` component based on Framer Motion.

---

## 🧱 Tech Stack

| Layer          | Tools                                                                 |
| -------------- | --------------------------------------------------------------------- |
| Front-end      | React 19, Vite 6, TypeScript, Tailwind 4, Framer Motion, shadcn/ui    |
| Authentication | Firebase Authentication (Email/Password)                              |
| Data           | Cloud Firestore (projects, messages, notifications collections)       |
| Hosting-ready  | SPA compatible `.htaccess` for Apache environments                    |

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js 18+** (with npm or pnpm/yarn).
- **Firebase project** with Auth & Firestore enabled.
- Optional: Firebase CLI if you plan to emulate or deploy.

### 1. Clone & Install
```bash
git clone https://github.com/<your-user>/<your-repo>.git
cd <your-repo>
npm install
```

### 2. Configure Firebase
The Firebase web config is currently in `src/lib/firebase.ts`.  
Update the config block with your project credentials (or, preferably, load from environment variables if you decide to externalise secrets).

Ensure these services are enabled:
1. **Authentication** → Sign-in method → enable **Email/Password** and create admin users.
2. **Firestore Database** → Create collections:
   - `projects` documents with fields: `title`, `description`, `tech` (comma string), `url`, `createdAt`, `updatedAt`.
   - `messages` documents with `name`, `email`, `text`, `category`, `createdAt`.
   - `notifications` documents with `title`, `body`, `read`, `createdAt`, `type`, `messageId`, `email`, `category`.

### 3. Firestore Security Rules (example)
Adjust rules to your needs; below allows the public contact form to create messages/notifications, and restricts other operations to authenticated admins.

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /projects/{id} {
      allow read, write: if request.auth != null;
    }

    match /messages/{id} {
      allow read: if request.auth != null;
      allow create: if request.resource.data.keys().hasOnly(["name","email","text","category","createdAt"])
                    && request.resource.data.createdAt == request.time;
    }

    match /notifications/{id} {
      allow read, update, delete: if request.auth != null;
      allow create: if request.resource.data.keys().hasOnly(
                      ["title","body","read","createdAt","type","messageId","email","category"]
                    ) && request.resource.data.read == false
                      && request.resource.data.createdAt == request.time;
    }
  }
}
```

### 4. Run Locally
```bash
npm run dev
```
Open the logged URL (default `http://localhost:5173`). The admin area lives at `/admin`.

### 5. Build & Preview
```bash
npm run build    # compile for production
npm run preview  # serve the built files locally
```

For Apache hosting, the generated `.htaccess` in `public/` ensures SPA routes resolve to `index.html`.

---

## 🔑 Admin Workflow

- **Login:** `/admin/login` with an email/password configured in Firebase Auth.
- **Dashboard cards:** automatically load counts from Firestore (projects, messages, notifications).
- **Projects:** Add/edit forms write to the `projects` collection. Tech presets use Popover & Select components.
- **Messages:** The contact form feeds new docs into `messages` and pushes a corresponding notification.
- **Notifications:** Accessible from the bell icon; opening marks unread items as read, and you can delete individual alerts.
- **Settings:** Update display name, email (with verification if required), and password. Current password is required for re-authentication.

---

## 🧪 Useful Scripts

| Script             | Description                           |
| ------------------ | ------------------------------------- |
| `npm run dev`      | Start Vite dev server                 |
| `npm run build`    | Type-check and bundle for production  |
| `npm run preview`  | Preview the production bundle         |
| `npm run lint`     | Run ESLint                            |

---

## 📁 Notable Structure

```
src/
├─ admin/
│  ├─ components/      # Admin-specific components (layout, forms)
│  ├─ context/         # Firebase-backed contexts (auth, projects)
│  └─ pages/           # Admin pages: dashboard, login, projects, settings, messages
├─ components/ui/      # shadcn-inspired UI primitives
├─ pages/              # Public-facing pages (Home, WebProjects, Contact, etc.)
├─ lib/firebase.ts     # Firebase initialisation (app, auth, firestore)
└─ components/animations/Reveal.tsx  # motion helper
```

---

## 🚀 Deployment Notes

- For static hosting (Netlify, Vercel, Firebase Hosting, Apache), ensure single-page rewrites point to `index.html`. Use the provided `.htaccess` for Apache or configure rewrites in your hosting platform.
- Never commit actual production secrets; move Firebase config to environment variables when possible.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-feature`.
3. Commit changes: `git commit -m "Add awesome feature"`.
4. Push and open a pull request.

---

## 📝 License

This project is released for personal portfolio use. If you plan to reuse or extend it commercially, please credit the original author or reach out for permission.
