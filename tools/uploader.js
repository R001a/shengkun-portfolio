const config = window.COS_LOCAL_CONFIG || {};

const fields = {
  bucket: document.querySelector("#bucket"),
  region: document.querySelector("#region"),
  prefix: document.querySelector("#prefix"),
  publicBaseUrl: document.querySelector("#publicBaseUrl"),
  secretId: document.querySelector("#secretId"),
  secretKey: document.querySelector("#secretKey"),
};

const fileInput = document.querySelector("#fileInput");
const fileList = document.querySelector("#fileList");
const uploadBtn = document.querySelector("#uploadBtn");
const resultBox = document.querySelector("#resultBox");
const copyAllBtn = document.querySelector("#copyAllBtn");

for (const [key, input] of Object.entries(fields)) {
  input.value = config[key] || "";
}

function normalizePrefix(prefix) {
  if (!prefix) return "";
  return prefix.endsWith("/") ? prefix : `${prefix}/`;
}

function safeName(name) {
  const dot = name.lastIndexOf(".");
  const base = dot > -1 ? name.slice(0, dot) : name;
  const ext = dot > -1 ? name.slice(dot).toLowerCase() : "";
  const cleaned = base
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5-]/g, "")
    .slice(0, 80);
  return `${Date.now()}-${cleaned || "asset"}${ext}`;
}

function currentConfig() {
  return {
    bucket: fields.bucket.value.trim(),
    region: fields.region.value.trim(),
    prefix: normalizePrefix(fields.prefix.value.trim()),
    publicBaseUrl: fields.publicBaseUrl.value.trim().replace(/\/$/, ""),
    secretId: fields.secretId.value.trim(),
    secretKey: fields.secretKey.value.trim(),
  };
}

function validate(cfg) {
  const missing = Object.entries(cfg)
    .filter(([key, value]) => key !== "prefix" && !value)
    .map(([key]) => key);
  if (missing.length) {
    throw new Error(`缺少配置：${missing.join(", ")}`);
  }
  if (!window.COS) {
    throw new Error("COS SDK 没有加载成功，请检查网络后刷新页面。");
  }
}

fileInput.addEventListener("change", () => {
  const files = Array.from(fileInput.files || []);
  fileList.innerHTML = files.length
    ? files.map((file) => `<div>${file.name} / ${(file.size / 1024 / 1024).toFixed(2)} MB</div>`).join("")
    : "";
});

uploadBtn.addEventListener("click", async () => {
  const files = Array.from(fileInput.files || []);
  if (!files.length) {
    alert("请先选择文件。");
    return;
  }

  const cfg = currentConfig();
  try {
    validate(cfg);
  } catch (error) {
    alert(error.message);
    return;
  }

  uploadBtn.disabled = true;
  uploadBtn.textContent = "上传中...";

  const cos = new COS({
    SecretId: cfg.secretId,
    SecretKey: cfg.secretKey,
  });

  const urls = [];

  for (const file of files) {
    const key = `${cfg.prefix}${safeName(file.name)}`;
    resultBox.value += `开始上传：${file.name}\n`;

    try {
      await new Promise((resolve, reject) => {
        cos.putObject(
          {
            Bucket: cfg.bucket,
            Region: cfg.region,
            Key: key,
            Body: file,
            onProgress(progressData) {
              const percent = Math.round((progressData.percent || 0) * 100);
              uploadBtn.textContent = `上传中 ${percent}%`;
            },
          },
          (err) => {
            if (err) reject(err);
            else resolve();
          },
        );
      });

      const url = `${cfg.publicBaseUrl}/${key}`;
      urls.push(url);
      resultBox.value += `上传成功：${url}\n\n`;
    } catch (error) {
      resultBox.value += `上传失败：${file.name}\n${error.message || JSON.stringify(error)}\n\n`;
    }
  }

  if (urls.length) {
    resultBox.value += "可复制链接：\n" + urls.join("\n") + "\n";
  }

  uploadBtn.disabled = false;
  uploadBtn.textContent = "上传到 COS";
});

copyAllBtn.addEventListener("click", async () => {
  await navigator.clipboard.writeText(resultBox.value);
  copyAllBtn.textContent = "已复制";
  setTimeout(() => {
    copyAllBtn.textContent = "复制全部链接";
  }, 1200);
});
