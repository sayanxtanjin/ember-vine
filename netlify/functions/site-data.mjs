import { timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";

const STORE = getStore({ name: "ember-vine-public-content", consistency: "strong" });
const KEY = "site-content-v1";
const MAX_BODY_BYTES = 4 * 1024 * 1024;
const FIELDS = ["settings", "content", "categories", "products", "branches", "coupons", "reviews"];

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
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

function hasInlineImage(value) {
  if (typeof value === "string") return /^data:image\//i.test(value);
  if (Array.isArray(value)) return value.some(hasInlineImage);
  if (value && typeof value === "object") return Object.values(value).some(hasInlineImage);
  return false;
}

function validPayload(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;
  if (!data.settings || typeof data.settings !== "object" || Array.isArray(data.settings)) return false;
  if (!data.content || typeof data.content !== "object" || Array.isArray(data.content)) return false;
  for (const field of ["categories", "products", "branches", "coupons", "reviews"]) {
    if (!Array.isArray(data[field])) return false;
  }
  return !hasInlineImage(data);
}

export default async function handler(request) {
  if (request.method === "GET") {
    try {
      const data = await STORE.get(KEY, { type: "json", consistency: "strong" });
      return json({ data });
    } catch (error) {
      console.error("Unable to read site content from Netlify Blobs", error);
      return json({ error: "Site content could not be loaded." }, 503);
    }
  }

  if (request.method !== "PUT") return json({ error: "Method not allowed." }, 405);

  if (!process.env.EV_STORAGE_ADMIN_TOKEN) {
    return json({ error: "Set EV_STORAGE_ADMIN_TOKEN in the Netlify environment variables." }, 503);
  }
  if (!isAuthorized(request)) return json({ error: "Unauthorized." }, 401);

  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
      return json({ error: "Site content is too large. Upload images through the media endpoint." }, 413);
    }
    const body = JSON.parse(raw);
    const data = body?.data;
    if (!validPayload(data)) return json({ error: "The site content payload is incomplete or contains inline image data." }, 400);

    const publicData = Object.fromEntries(FIELDS.map((field) => [field, data[field]]));
    await STORE.setJSON(KEY, publicData);
    return json({ ok: true, data: publicData });
  } catch (error) {
    if (error instanceof SyntaxError) return json({ error: "Invalid JSON." }, 400);
    console.error("Unable to save site content to Netlify Blobs", error);
    return json({ error: "Site content could not be saved." }, 503);
  }
}
