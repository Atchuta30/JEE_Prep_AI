"use server";

import { db, auth } from "@/lib/firebase";
import type { JEEPaper } from "@/lib/types";
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";

// This type needs to match what's sent from client after JSON stringification for dates.
// Or handle Date object properly if possible with server actions.
interface PaperDataForFirestore extends Omit<JEEPaper, 'createdAt' | 'id' | 'userId'> {
  createdAt: string; // ISO string from client
  userId: string; // Make sure userId is always string
}


export async function savePaperToHistory(paperData: PaperDataForFirestore): Promise<string> {
  // Basic check for auth, though ideally this should be more robust (e.g. check auth().currentUser server-side if possible or pass token)
  // For server components/actions, direct access to auth.currentUser is tricky.
  // Assume `paperData.userId` is correctly populated based on client-side auth state.
  if (!paperData.userId) {
    throw new Error("User must be logged in to save history.");
  }

  try {
    const paperToSave = {
      ...paperData,
      // Convert ISO string back to Firebase Timestamp
      createdAt: Timestamp.fromDate(new Date(paperData.createdAt)), 
    };

    const docRef = await addDoc(collection(db, "userPapers"), paperToSave);
    revalidatePath("/history"); // Revalidate history page to show new entry
    return docRef.id;
  } catch (error: any) {
    console.error("Error saving paper to Firestore: ", error);
    throw new Error(error.message || "Failed to save paper to history.");
  }
}
