import { timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";

const STORE = getStore({ name: "ember-vine-media", consistency: "strong" });
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const SAFE_KEY = /^[a-zA-Z0-9_-]{1,140}$/;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function isAuthorized(request) {
  const expected = process.env.EV_STORAGE_ADMIN_TOKEN || "";
  const header = request.headers.get("authorization") || "";
  const supplied = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!expected || !supplied) return false;
  const expectedBytes = Buffer.from(expected);
  const suppliedBytes = Buffer.from(supplied);
  return expectedBytes.length === suppliedBytes.length && timingSafeEqual(expectedBytes, suppliedBytes);
}

function matchesImageType(type, bytes) {
  if (type === "image/png") return bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (type === "image/jpeg") return bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (type === "image/webp") return bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  return false;
}

export default async function handler(request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key") || "";
  if (!SAFE_KEY.test(key)) return json({ error: "A valid image key is required." }, 400);

  if (request.method === "GET") {
    try {
      const entry = await STORE.getWithMetadata(key, { type: "arrayBuffer", consistency: "strong" });
      if (!entry || entry.data === null) return json({ error: "Image not found." }, 404);
      const contentType = ALLOWED_TYPES.has(entry.metadata?.contentType) ? entry.metadata.contentType : "application/octet-stream";
      return new Response(entry.data, {
        headers: {
          "content-type": contentType,
          "cache-control": "public, max-age=31536000, immutable",
          "x-content-type-options": "nosniff",
        },
      });
    } catch (error) {
      console.error("Unable to read image from Netlify Blobs", error);
      return json({ error: "Image could not be loaded." }, 503);
    }
  }

  if (request.method !== "PUT") return json({ error: "Method not allowed." }, 405);
  if (!process.env.EV_STORAGE_ADMIN_TOKEN) {
    return json({ error: "Set EV_STORAGE_ADMIN_TOKEN in the Netlify environment variables." }, 503);
  }
  if (!isAuthorized(request)) return json({ error: "Unauthorized." }, 401);

  const contentType = (request.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (!ALLOWED_TYPES.has(contentType)) return json({ error: "Only JPEG, PNG, and WebP images are accepted." }, 415);
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_UPLOAD_BYTES) return json({ error: "Image must be 4 MB or smaller." }, 413);

  try {
    const data = await request.arrayBuffer();
    if (data.byteLength === 0) return json({ error: "The uploaded image is empty." }, 400);
    if (data.byteLength > MAX_UPLOAD_BYTES) return json({ error: "Image must be 4 MB or smaller." }, 413);
    const bytes = Buffer.from(data);
    if (!matchesImageType(contentType, bytes)) return json({ error: "The image contents do not match the supplied file type." }, 415);

    await STORE.set(key, data, { metadata: { contentType } });
    const version = Date.now();
    return json({ ok: true, url: `/.netlify/functions/media?key=${encodeURIComponent(key)}&v=${version}` });
  } catch (error) {
    console.error("Unable to save image to Netlify Blobs", error);
    return json({ error: "Image could not be saved." }, 503);
  }
}
