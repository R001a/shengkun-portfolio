import COS from "cos-nodejs-sdk-v5";
import dotenv from "dotenv";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const contentPath = path.join(rootDir, "public", "content", "portfolio-content.json");
const portfolioPath = path.join(rootDir, "src", "Portfolio.jsx");
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 1024 } });

dotenv.config({ path: path.join(rootDir, ".env.local") });
dotenv.config({ path: path.join(rootDir, ".env") });

function readLegacyCosConfig() {
  const localConfigPath = path.join(rootDir, "tools", "cos-config.local.js");
  if (!fs.existsSync(localConfigPath)) return {};
  const source = fs.readFileSync(localConfigPath, "utf8");
  const pick = (key) => {
    const match = source.match(new RegExp(`${key}\\s*:\\s*["']([^"']+)["']`));
    return match?.[1] || "";
  };
  return {
    bucket: pick("bucket"),
    region: pick("region"),
    prefix: pick("prefix"),
    publicBaseUrl: pick("publicBaseUrl"),
    secretId: pick("secretId"),
    secretKey: pick("secretKey"),
  };
}

function cosConfig() {
  const legacy = readLegacyCosConfig();
  return {
    bucket: process.env.COS_BUCKET || legacy.bucket || "rock-1392994282",
    region: process.env.COS_REGION || legacy.region || "ap-shanghai",
    prefix: normalizePrefix(process.env.COS_PREFIX || legacy.prefix || "portfolio/"),
    publicBaseUrl: (process.env.COS_PUBLIC_BASE_URL || legacy.publicBaseUrl || "https://rock-1392994282.cos.ap-shanghai.myqcloud.com").replace(/\/$/, ""),
    secretId: process.env.COS_SECRET_ID || legacy.secretId || "",
    secretKey: process.env.COS_SECRET_KEY || legacy.secretKey || "",
  };
}

function normalizePrefix(prefix) {
  if (!prefix) return "";
  return prefix.endsWith("/") ? prefix : `${prefix}/`;
}

function ensureContentFile() {
  const dir = path.dirname(contentPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(contentPath)) {
    fs.writeFileSync(contentPath, JSON.stringify({ media: {}, text: {}, updatedAt: null }, null, 2), "utf8");
  }
}

function readContent() {
  ensureContentFile();
  try {
    const content = JSON.parse(fs.readFileSync(contentPath, "utf8"));
    return {
      media: content.media || {},
      text: content.text || {},
      updatedAt: content.updatedAt || null,
    };
  } catch {
    return { media: {}, text: {}, updatedAt: null };
  }
}

function writeContent(nextContent) {
  ensureContentFile();
  const content = {
    media: nextContent.media || {},
    text: nextContent.text || {},
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(contentPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  return content;
}

function inferType(label = "", fileName = "") {
  const fileValue = String(fileName || "").toLowerCase();
  if (/\.(mp4|mov|webm|m4v)(?:$|\?)/.test(fileValue)) return "video";
  if (/\.(png|jpe?g|webp|gif|avif)(?:$|\?)/.test(fileValue)) return "image";
  const labelValue = String(label || "").toLowerCase();
  if (labelValue.includes("视频") || labelValue.includes("录屏")) return "video";
  return "image";
}

function safeName(name) {
  const ext = path.extname(name).toLowerCase();
  const base = path.basename(name, ext)
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5-]/g, "")
    .slice(0, 80) || "asset";
  return `${Date.now()}-${base}${ext}`;
}

function scanPlaceholders() {
  const source = fs.readFileSync(portfolioPath, "utf8");
  const labels = new Map();
  const staticRegex = /<ImagePlaceholder[\s\S]*?label="([^"]+)"[\s\S]*?\/>/g;
  for (const match of source.matchAll(staticRegex)) {
    const block = match[0];
    const label = match[1];
    labels.set(label, { label, type: block.includes('type="video"') ? "video" : inferType(label) });
  }

  for (let i = 1; i <= 6; i += 1) {
    labels.set(`AI视频竖屏展示 ${i} / assets/ai-video-vertical-${i}.png`, {
      label: `AI视频竖屏展示 ${i} / assets/ai-video-vertical-${i}.png`,
      type: i === 3 ? "video" : "image",
    });
  }
  [
    "AI视频横版分镜图 1 / assets/ai-video-horizontal-storyboard-1.png",
    "AI视频横版展示 2 / assets/ai-video-horizontal-2.mp4",
    "AI视频横版分镜图 3 / assets/ai-video-horizontal-storyboard-3.png",
    "AI视频横版展示 4 / assets/ai-video-horizontal-4.mp4",
  ].forEach((label) => {
    labels.set(label, { label, type: "image" });
  });
  for (let i = 2; i <= 5; i += 1) {
    labels.set(`帧 ${i}`, { label: `帧 ${i}`, type: "image" });
  }
  ["弹窗长图 1", "弹窗长图 2", "会场长图 1", "会场长图 2", "KV长图 1", "3D动画长图 1"].forEach((label) => {
    labels.set(label, { label, type: "image" });
  });
  ["衍生周边/延展 3", "衍生周边/延展 4", "衍生周边/延展 5", "衍生周边/延展 6"].forEach((label) => {
    labels.set(label, { label, type: "image" });
  });
  ["场景细部 2", "场景细部 3", "场景细部 4", "场景细部 5"].forEach((label) => {
    labels.set(label, { label, type: "image" });
  });
  ["竖屏视频展示 1", "竖屏视频展示 2", "竖屏视频展示 3"].forEach((label, index) => {
    labels.set(label, { label, type: index === 1 ? "video" : "image" });
  });

  return Array.from(labels.values()).sort((a, b) => a.label.localeCompare(b.label, "zh-CN"));
}

function assertCosReady(cfg) {
  const missing = [];
  if (!cfg.bucket) missing.push("COS_BUCKET");
  if (!cfg.region) missing.push("COS_REGION");
  if (!cfg.secretId) missing.push("COS_SECRET_ID");
  if (!cfg.secretKey) missing.push("COS_SECRET_KEY");
  if (missing.length) throw new Error(`缺少 COS 配置：${missing.join(", ")}`);
}

const app = express();
app.use(express.json({ limit: "20mb" }));
app.use("/admin", express.static(path.join(__dirname, "public")));

app.get("/", (_req, res) => res.redirect("/admin"));

app.get("/api/health", (_req, res) => {
  const cfg = cosConfig();
  res.json({
    ok: true,
    cos: {
      bucket: cfg.bucket,
      region: cfg.region,
      prefix: cfg.prefix,
      publicBaseUrl: cfg.publicBaseUrl,
      hasSecret: Boolean(cfg.secretId && cfg.secretKey),
    },
  });
});

app.get("/api/placeholders", (_req, res) => {
  const content = readContent();
  res.json({
    placeholders: scanPlaceholders().map((item) => ({
      ...item,
      current: content.media[item.label] || null,
    })),
  });
});

app.get("/api/content", (_req, res) => {
  res.json(readContent());
});

app.post("/api/content/text", (req, res) => {
  const content = readContent();
  content.text = req.body?.text || {};
  res.json(writeContent(content));
});

app.post("/api/media/url", (req, res) => {
  const { label, url, type } = req.body || {};
  if (!label || !url) return res.status(400).json({ error: "缺少 label 或 url" });
  const content = readContent();
  content.media[label] = {
    src: url,
    type: type || inferType(label, url),
    name: path.basename(url),
    updatedAt: new Date().toISOString(),
    source: "manual-url",
  };
  res.json(writeContent(content));
});

app.post("/api/media/clear", (req, res) => {
  const { label } = req.body || {};
  if (!label) return res.status(400).json({ error: "缺少 label" });
  const content = readContent();
  delete content.media[label];
  res.json(writeContent(content));
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const label = req.body?.label;
    if (!label) return res.status(400).json({ error: "缺少素材位置 label" });
    if (!req.file) return res.status(400).json({ error: "没有收到文件" });

    const cfg = cosConfig();
    assertCosReady(cfg);
    const key = `${cfg.prefix}${safeName(req.file.originalname)}`;
    const cos = new COS({ SecretId: cfg.secretId, SecretKey: cfg.secretKey });

    await new Promise((resolve, reject) => {
      cos.putObject(
        {
          Bucket: cfg.bucket,
          Region: cfg.region,
          Key: key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        },
        (error) => (error ? reject(error) : resolve()),
      );
    });

    const url = `${cfg.publicBaseUrl}/${key}`;
    const content = readContent();
    content.media[label] = {
      src: url,
      type: inferType(label, req.file.originalname),
      name: req.file.originalname,
      cosKey: key,
      updatedAt: new Date().toISOString(),
      source: "cos-upload",
    };
    writeContent(content);
    res.json({ ok: true, label, url, key, type: content.media[label].type });
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

const port = Number(process.env.ADMIN_PORT || 8787);
app.listen(port, "127.0.0.1", () => {
  console.log(`Portfolio admin running at http://127.0.0.1:${port}/admin`);
});
