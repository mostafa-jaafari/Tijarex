import { db } from "@/lib/FirebaseClient";
import { collection, getDocs } from "firebase/firestore";

// دالة لتوليد username عشوائي من الاسم
function generateUsername(name: string) {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${name.toLowerCase().replace(/\s/g, '')}${randomNum}`;
}

// التحقق من عدم تكرار الـ username
export async function isUsernameUnique(username: string) {
  const querySnapshot = await getDocs(collection(db, "users"));
  let exists = false;

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data?.username === username) {
      exists = true;
    }
  });

  return !exists;
}

// الدالة الرئيسية التي تنشئ وتُخزن username
export async function genareteUniqueUsername(displayName: string) {
  let username;
  let unique = false;

  while (!unique) {
    username = generateUsername(displayName);
    unique = await isUsernameUnique(username);
  }

  return username?.toLowerCase().replace(" ","");
}