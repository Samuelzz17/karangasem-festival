import fs from "fs";
import path from "path";
import admin from "firebase-admin";

// 1. Manually parse .env file
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?$/);
    if (match) {
      const key = match[1];
      let value = (match[2] || "").trim();
      // Remove surrounding quotes
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

// 2. Initialize Firebase Admin
const serviceAccountJson = process.env.FB_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!serviceAccountJson) {
  console.error("Error: FB_SERVICE_ACCOUNT_JSON is not defined in .env file.");
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountJson);
} catch (err) {
  console.error("Error parsing FB_SERVICE_ACCOUNT_JSON:", err.message);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

const db = admin.firestore();

// 3. Define the real merchandise data mapping to local filenames
const merchDir = path.resolve(process.cwd(), "MERCH-KARFEST");
const destDir = path.resolve(process.cwd(), "public", "merchandise");

// Ensure public/merchandise directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const realProducts = [
  {
    id: "tee-karfest-white",
    name: "Karangasem Festival 2026 Tee - White Edition",
    price: 185000,
    stock: 50,
    type: "Apparel",
    tag: "Official Merch",
    accent1: "#FFFFFF",
    accent2: "#A22D43",
    variants: ["S", "M", "L", "XL"],
    description: "Official t-shirt of Karangasem Festival 2026. Made from 100% premium cotton combed 30s. White color edition with special graphic design on front.",
    filename: "tshirt-1-white.png",
  },
  {
    id: "tee-karfest-black",
    name: "Karangasem Festival 2026 Tee - Black Edition",
    price: 185000,
    stock: 50,
    type: "Apparel",
    tag: "Official Merch",
    accent1: "#123657",
    accent2: "#F2663A",
    variants: ["S", "M", "L", "XL", "XXL"],
    description: "Official t-shirt of Karangasem Festival 2026. Made from 100% premium cotton combed 30s. Black color edition with vibrant screen printing.",
    filename: "tshirt-1.png",
  },
  {
    id: "tee-cultural-heritage",
    name: "Cultural Heritage Tee",
    price: 195000,
    stock: 40,
    type: "Apparel",
    tag: "Cultural Series",
    accent1: "#5A361A",
    accent2: "#E5C5A2",
    variants: ["S", "M", "L", "XL"],
    description: "Special edition t-shirt featuring Balinese cultural elements of Karangasem. Highly detailed illustration printed on heavy-weight cotton.",
    filename: "tshirt-2.png",
  },
  {
    id: "tee-agung-majesty",
    name: "Agung Majesty Tee",
    price: 195000,
    stock: 45,
    type: "Apparel",
    tag: "Limited Edition",
    accent1: "#1F6098",
    accent2: "#3388EB",
    variants: ["S", "M", "L", "XL", "XXL"],
    description: "Stunning illustration of Mount Agung under the stars. Perfect for high-comfort wear during day-to-night festival concerts.",
    filename: "tshirt-3.png",
  },
  {
    id: "tee-harmony-karfest",
    name: "Harmony of Karangasem Tee",
    price: 190000,
    stock: 35,
    type: "Apparel",
    tag: "Festival Exclusive",
    accent1: "#2ADEB3",
    accent2: "#082B91",
    variants: ["S", "M", "L", "XL"],
    description: "Featuring modern fusion art representing the energy and harmony of Karangasem Festival. Standard retail fit.",
    filename: "tshirt-4.png",
  },
];

async function seed() {
  try {
    console.log("Starting seeding process...");

    // A. Delete existing products to clear out dummy items
    console.log("Clearing existing products in 'products' collection...");
    const snapshot = await db.collection("products").get();
    const batchDelete = db.batch();
    snapshot.docs.forEach((doc) => {
      batchDelete.delete(doc.ref);
    });
    await batchDelete.commit();
    console.log(`Deleted ${snapshot.size} old products.`);

    // B. Copy images and save new products
    for (const prod of realProducts) {
      const srcPath = path.join(merchDir, prod.filename);
      const destPath = path.join(destDir, prod.filename);

      if (!fs.existsSync(srcPath)) {
        console.warn(`Warning: Image file not found for ${prod.name} at: ${srcPath}. Skipping image copy.`);
        prod.imageData = "";
        prod.imageName = "";
      } else {
        // Copy image file to public/merchandise/
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${prod.filename} to public/merchandise/`);
        
        // Use relative URL path for serving via Next.js
        prod.imageData = `/merchandise/${prod.filename}`;
        prod.imageName = prod.filename;
      }

      // Remove filename from document structure
      const { filename, ...dbPayload } = prod;

      console.log(`Uploading product to Firestore: ${prod.name}...`);
      await db.collection("products").doc(prod.id).set({
        ...dbPayload,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    console.log("Database seeded successfully with real merchandise!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
