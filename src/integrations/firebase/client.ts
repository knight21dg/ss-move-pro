import { auth, db } from "@/lib/firebase";
import { toast } from "sonner";

// Re-export commonly used Firebase helpers from lib/firebase for convenience
export { auth, db } from "@/lib/firebase";

// Additional auth utilities
export async function getSession() { return auth.currentUser; }
