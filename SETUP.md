# Firebase & Cloudinary Setup — SS Packers & Movers

This document outlines the steps required to initialize and configure the backend (Firebase Firestore + Auth) and storage (Cloudinary) for the project.

---

## 1. Firebase Configuration

The application is configured to connect to the Firebase project **`ss-packersandmovers`** (App ID: `1:918882622042:web:6922850765d00818d2d663`).

### Step A: Enable Firestore API
1. Visit the [Google Cloud APIs Console](https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=ss-packersandmovers).
2. Click **Enable** to enable the Cloud Firestore API for your project. Without this step, Firestore queries will fail with a `PERMISSION_DENIED` error.

### Step B: Create a Firestore Database in Test Mode
1. Go to the [Firebase Console](https://console.firebase.google.com/) and select the **ss-packersandmovers** project.
2. In the left-hand navigation menu, click **Firestore Database** and then click **Create database**.
3. Choose your database location and select **Start in test mode** (this allows public read/write access temporarily so you can seed the default data).

### Step C: Enable Firebase Authentication
1. In the Firebase Console, select **Authentication** from the left-hand menu.
2. Click **Get Started** if it's your first time setting it up.
3. Under the **Sign-in method** tab, click **Add new provider** and choose **Email/Password**.
4. Enable the **Email/Password** provider and save.

---

## 2. Seed default content to Firestore

Once the Firestore database is created in Test Mode, populate it with default site settings, initial services list, and page-level SEO data.

Run the seeding script from the root of the project:
```bash
npm run seed:firestore
```

This script will insert:
* Services list (Home Relocation, Office Relocation, etc.)
* Page-level SEO defaults (Home, About, Services, Gallery, etc.)
* Site configurations (Hero text, FAQ, process, contact info, etc.) under the `settings/all` document.

---

## 3. Deploy Firestore Security Rules

After seeding is complete, secure your database by deploying the production security rules to restrict write access to authenticated admin users:

1. In the Firebase Console under **Firestore Database**, click on the **Rules** tab.
2. Copy the contents of the local [firestore.rules](file:///c:/knight21/ss/ss-move-pro/firestore.rules) file.
3. Paste the rules into the rules editor in the Firebase console and click **Publish**.

Alternatively, if you have the Firebase CLI installed and configured locally:
```bash
firebase deploy --only firestore:rules
```

---

## 4. Create & Promote the First Admin Account

1. Start your local development server:
   ```bash
   npm run dev
   ```
2. Navigate to [http://localhost:5173/signin](http://localhost:5173/signin) and click on **Sign Up** to create a new user account with your email and password.
3. Open the Firestore Database console.
4. Locate or create a collection named `user_roles`.
5. Create a document in the `user_roles` collection where:
   * **Document ID**: The `uid` of the user you just created (you can find this `uid` in the Firebase Authentication console or by inspecting the created auth session).
   * **Fields**:
     * `role` (string): `admin`
6. Once this document is created, the user will have full access to the Admin Dashboard (`/admin`).

---

## 5. Cloudinary Setup

Images and other media files are uploaded directly from the browser to Cloudinary.

### Configuration Settings
* **Cloud Name**: `dp9pbu8wr`
* **API Key**: `258446663253845`
* **API environment variable**: `CLOUDINARY_URL=cloudinary://258446663253845:m6oGaYxeITwoDAhA0HoCXxGK1aw@dp9pbu8wr`

### Unsigned Upload Preset
The frontend uses direct client-side unsigned uploads using a preset name.
1. Sign in to your [Cloudinary Dashboard](https://cloudinary.com/).
2. Go to **Settings** (gear icon) -> **Upload** tab.
3. Scroll down to **Upload presets** and click **Add upload preset**.
4. Set the following options:
   * **Upload preset name**: `unsigned_preset`
   * **Signing Mode**: `Unsigned`
   * **Folder**: `uploads` (or configure as desired)
5. Save the preset. Direct uploads will now function seamlessly from the admin page.
