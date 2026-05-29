import {
  initializeApp,
  getApps,
  getApp,
  type FirebaseApp,
} from "firebase/app";
import {
  getFirestore,
  type Firestore,
  doc,
  collection,
  query,
  where,
  orderBy,
  getDoc,
  getDocs,
  setDoc,
  setDoc as _setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  onSnapshot,
  runTransaction,
  writeBatch,
  limit,
  serverTimestamp as _serverTimestamp,
  FieldValue,
  type DocumentData,
  type DocumentReference,
  type Query,
  type Unsubscribe,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  type Auth,
  type User as AuthUser,
} from "firebase/auth";
import type { Timestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrCfHW2IcuRG8indUeS4l1vCIVvt6lZ68",
  authDomain: "ss-packersandmovers.firebaseapp.com",
  projectId: "ss-packersandmovers",
  storageBucket: "ss-packersandmovers.firebasestorage.app",
  messagingSenderId: "918882622042",
  appId: "1:918882622042:web:6922850765d00818d2d663",
  measurementId: "G-MN0GDZZXS7",
};

function getFirebaseApp(): FirebaseApp {
  const existing = getApps();
  if (existing.length > 0) return getApp();
  return initializeApp(firebaseConfig);
}

export const firebaseApp = getFirebaseApp();
export const db: Firestore = getFirestore(firebaseApp);
export const auth: Auth = getAuth(firebaseApp);
export const serverTimestamp = () => _serverTimestamp() as unknown as Date;

// ─── Auth convenience wrappers ─────────────────────────────────────────────────

export async function signUp(email: string, password: string) {
  await createUserWithEmailAndPassword(auth, email, password);
}

export async function signIn(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signOutUser() {
  await signOut(auth);
}

export function onAuthChange(cb: (user: AuthUser | null) => void) {
  return onAuthStateChanged(auth, cb);
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function updateUserPassword(newPassword: string) {
  if (!auth.currentUser) throw new Error("No user in session");
  await updatePassword(auth.currentUser, newPassword);
}

export function singletonId(id = "singleton"): DocumentReference<DocumentData> {
  return doc(db, "settings", id);
}

// ─── Document helpers ─────────────────────────────────────────────────────────

export function toObject<T extends DocumentData>(snap: { data: () => T }): T {
  return snap.data();
}

export function docById<T extends DocumentData>(
  ref: DocumentReference<T>,
): DocumentReference<T> {
  return ref;
}

export function col<T extends DocumentData = DocumentData>(
  path: string,
): any {
  return collection(db, path) as any;
}

// ═══════════════════════════════════════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════════════════════════════════════

const SERVICES_KEY = "services";

export async function listServices(): Promise<Service[]> {
  const snap = await getDocs(query(col(SERVICES_KEY), orderBy("sort_order", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Service, "id">) }));
}

export async function listServicesActive(): Promise<Service[]> {
  const q = query(col(SERVICES_KEY), where("is_active", "==", true), orderBy("sort_order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Service, "id">) }));
}

export async function createService(data: Omit<Service, "id">): Promise<string> {
  const ref = await addDoc(col(SERVICES_KEY), data);
  return ref.id;
}

export async function updateService(id: string, data: Partial<Omit<Service, "id">>): Promise<void> {
  await updateDoc(doc(db, SERVICES_KEY, id), data);
}

export async function deleteService(id: string): Promise<void> {
  await deleteDoc(doc(db, SERVICES_KEY, id));
}

// ═══════════════════════════════════════════════════════════════════════════════════
// GALLERY
// ═══════════════════════════════════════════════════════════════════════════════════

const GALLERY_KEY = "gallery_images";

export async function listGallery(activeOnly = false): Promise<GalleryImage[]> {
  const q = activeOnly
    ? query(col(GALLERY_KEY), where("is_active", "==", true), orderBy("sort_order", "asc"))
    : query(col(GALLERY_KEY), orderBy("sort_order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GalleryImage, "id">) }));
}

export async function createGalleryImage(data: Omit<GalleryImage, "id">): Promise<string> {
  const ref = await addDoc(col(GALLERY_KEY), data);
  return ref.id;
}

export async function updateGalleryImage(id: string, data: Partial<Omit<GalleryImage, "id">>): Promise<void> {
  await updateDoc(doc(db, GALLERY_KEY, id), data);
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await deleteDoc(doc(db, GALLERY_KEY, id));
}

// ═══════════════════════════════════════════════════════════════════════════════════
// VIDEOS
// ═══════════════════════════════════════════════════════════════════════════════════

const VIDEOS_KEY = "videos";

export async function listVideos(activeOnly = false): Promise<Video[]> {
  const q = activeOnly
    ? query(col(VIDEOS_KEY), where("is_active", "==", true), orderBy("sort_order", "asc"))
    : query(col(VIDEOS_KEY), orderBy("sort_order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Video, "id">) }));
}

export async function createVideo(data: Omit<Video, "id">): Promise<string> {
  const ref = await addDoc(col(VIDEOS_KEY), data);
  return ref.id;
}

export async function updateVideo(id: string, data: Partial<Omit<Video, "id">>): Promise<void> {
  await updateDoc(doc(db, VIDEOS_KEY, id), data);
}

export async function deleteVideo(id: string): Promise<void> {
  await deleteDoc(doc(db, VIDEOS_KEY, id));
}

// ═══════════════════════════════════════════════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════════════════════

const TESTIMONIALS_KEY = "testimonials";

export async function listTestimonials(activeOnly = false): Promise<Testimonial[]> {
  const q = activeOnly
    ? query(col(TESTIMONIALS_KEY), where("is_active", "==", true), orderBy("sort_order", "asc"))
    : query(col(TESTIMONIALS_KEY), orderBy("sort_order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Testimonial, "id">) }));
}

export async function createTestimonial(data: Omit<Testimonial, "id">): Promise<string> {
  const ref = await addDoc(col(TESTIMONIALS_KEY), data);
  return ref.id;
}

export async function updateTestimonial(id: string, data: Partial<Omit<Testimonial, "id">>): Promise<void> {
  await updateDoc(doc(db, TESTIMONIALS_KEY, id), data);
}

export async function deleteTestimonial(id: string): Promise<void> {
  await deleteDoc(doc(db, TESTIMONIALS_KEY, id));
}

// ═══════════════════════════════════════════════════════════════════════════════════
// ENQUIRIES
// ═══════════════════════════════════════════════════════════════════════════════════

const ENQUIRIES_KEY = "enquiries";

export async function listEnquiries(): Promise<Enquiry[]> {
  const snap = await getDocs(query(col(ENQUIRIES_KEY), orderBy("created_at", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Enquiry, "id">) }));
}

export async function createEnquiry(data: Omit<Enquiry, "id">): Promise<string> {
  const ref = await addDoc(col(ENQUIRIES_KEY), { ...data, created_at: new Date().toISOString() });
  return ref.id;
}

export async function updateEnquiry(id: string, data: Partial<Omit<Enquiry, "id">>): Promise<void> {
  await updateDoc(doc(db, ENQUIRIES_KEY, id), data);
}

export async function deleteEnquiry(id: string): Promise<void> {
  await deleteDoc(doc(db, ENQUIRIES_KEY, id));
}

// ═══════════════════════════════════════════════════════════════════════════════════
// USER ROLES
// ═══════════════════════════════════════════════════════════════════════════════════

const USER_ROLES_KEY = "user_roles";

export async function getUserRole(uid: string): Promise<string | null> {
  const snap = await getDoc(doc(db, USER_ROLES_KEY, uid));
  if (!snap.exists()) return null;
  const d = snap.data() as { role?: string };
  return d.role ?? null;
}

export async function setUserRole(uid: string, role: "user" | "admin"): Promise<void> {
  await setDoc(doc(db, USER_ROLES_KEY, uid), { role }, { merge: true });
}

// ═══════════════════════════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════════

const SETTINGS_KEY = "settings";

export async function getSettingsDoc(): Promise<SettingsDoc | null> {
  const snap = await getDoc(singletonId());
  if (!snap.exists()) return null;
  return snap.data() as SettingsDoc;
}

export async function saveSettingsDoc(data: SettingsDoc): Promise<void> {
  await setDoc(singletonId(), data);
}

// Why Us items
const WHY_US_KEY = "why_us_items";

export async function listWhyUs(): Promise<WhyUsItem[]> {
  const snap = await getDocs(query(col(WHY_US_KEY), orderBy("sort_order", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<WhyUsItem, "id">) }));
}

export async function saveWhyUsItems(items: WhyUsItem[]): Promise<void> {
  const sid = singletonId();
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(sid);
    tx.update(sid, { home_why_us: { eyebrow: "", title: "", items: items.map((i) => ({ id: i.id, title: i.title, description: i.description, sort_order: i.sort_order })) } });
    // clear subcollection and re-insert
    tx.delete(tx.get(sid));
  });
}

// Process items
const PROCESS_KEY = "process_items";

export async function listProcess(): Promise<ProcessItem[]> {
  const snap = await getDocs(query(col(PROCESS_KEY), orderBy("sort_order", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ProcessItem, "id">) }));
}

// FAQ items
const FAQ_KEY = "faq_items";

export async function listFaqs(): Promise<FaqItem[]> {
  const snap = await getDocs(query(col(FAQ_KEY), orderBy("sort_order", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FaqItem, "id">) }));
}

// Seo Pages
const SEO_PAGES_KEY = "seo_page_settings";

export async function listSeoPages(): Promise<SeoPage[]> {
  const snap = await getDocs(query(col(SEO_PAGES_KEY), orderBy("page_key", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SeoPage, "id">) }));
}

export function seoPageDocRef(key: string): DocumentReference<Omit<SeoPage, "id">> {
  return doc(db, SEO_PAGES_KEY, key);
}

// GA Settings — reads from the unified settings/all document
export async function getGaId(): Promise<string> {
  const snap = await getDoc(doc(db, "settings", "all"));
  const data = snap.data() as { ga?: { measurement_id?: string } } | undefined;
  return data?.ga?.measurement_id ?? "";
}

// ═══════════════════════════════════════════════════════════════════════════════════
// REALTIME LISTENERS
// ═══════════════════════════════════════════════════════════════════════════════════

const REALTIME_TABLES = [
  "services",
  "gallery_images",
  "testimonials",
  "videos",
  "enquiries",
] as const;

type QueryClientLike = {
  invalidateQueries: (opts: { queryKey: readonly unknown[]; exact?: boolean }) => void;
};

export function subscribeRealtime(qc: QueryClientLike): Unsubscribe {
  const unsubs: Unsubscribe[] = [];

  // ── content tables ────────────────────────────────────────────────────────────
  const contentTables = [
    "services",
    "gallery_images",
    "testimonials",
    "videos",
    "enquiries",
  ] as const;

  for (const table of contentTables) {
    let isInitial = true;
    const q = query(col(table), limit(1));
    const unsub = onSnapshot(q, () => {
      if (isInitial) {
        isInitial = false;
        return;
      }
      qc.invalidateQueries({ queryKey: [table], exact: false });
      qc.invalidateQueries({ queryKey: ["admin-stats"], exact: false });
    });
    unsubs.push(unsub);
  }

  // ── settings singleton doc ───────────────────────────────────────────────────
  const settingsDocRef = singletonId();
  let settingsInitial = true;
  unsubs.push(
    onSnapshot(settingsDocRef, () => {
      if (settingsInitial) {
        settingsInitial = false;
        return;
      }
      qc.invalidateQueries({ queryKey: ["settings"], exact: false });
    })
  );

  // ── settings sub-collections (home sections) ──────────────────────────────────
  // These live as sub-collections under the settings/all document.
  const homeSettingsCols = [
    "home_why_us",
    "home_process",
    "home_faqs",
  ] as const;

  for (const key of homeSettingsCols) {
    let colInitial = true;
    const q = query(collection(db, "settings", "all", key), limit(1));
    unsubs.push(
      onSnapshot(q, () => {
        if (colInitial) {
          colInitial = false;
          return;
        }
        qc.invalidateQueries({ queryKey: ["settings"], exact: false });
      })
    );
  }

  // ── seo_page_settings ────────────────────────────────────────────────────────
  let seoInitial = true;
  const seoQ = query(col("seo_page_settings"), limit(1));
  unsubs.push(
    onSnapshot(seoQ, () => {
      if (seoInitial) {
        seoInitial = false;
        return;
      }
      qc.invalidateQueries({ queryKey: ["seo_page_settings"], exact: false });
    })
  );

  return () => {
    for (const u of unsubs) u();
  };
}
