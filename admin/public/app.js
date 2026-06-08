let placeholders = [];
let selected = null;

const statusEl = document.querySelector("#status");
const listEl = document.querySelector("#placeholderList");
const searchInput = document.querySelector("#searchInput");
const editorContent = document.querySelector("#editorContent");
const emptyState = document.querySelector("#emptyState");
const slotTitle = document.querySelector("#slotTitle");
const typeSelect = document.querySelector("#typeSelect");
const fileInput = document.querySelector("#fileInput");
const uploadBtn = document.querySelector("#uploadBtn");
const urlInput = document.querySelector("#urlInput");
const saveUrlBtn = document.querySelector("#saveUrlBtn");
const clearBtn = document.querySelector("#clearBtn");
const previewBox = document.querySelector("#previewBox");
const resultBox = document.querySelector("#resultBox");

function log(message) {
  resultBox.textContent = `${new Date().toLocaleTimeString()} ${message}\n${resultBox.textContent || ""}`;
}

async function api(path, options) {
  const response = await fetch(path, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `请求失败：${response.status}`);
  return data;
}

function renderPreview(item) {
  const current = item?.current;
  previewBox.innerHTML = "";
  if (!current?.src) {
    previewBox.innerHTML = `<div class="placeholder">当前还没有替换素材</div>`;
    return;
  }
  if ((current.type || item.type) === "video") {
    const video = document.createElement("video");
    video.src = current.src;
    video.controls = true;
    previewBox.appendChild(video);
  } else {
    const img = document.createElement("img");
    img.src = current.src;
    img.alt = item.label;
    previewBox.appendChild(img);
  }
  urlInput.value = current.src || "";
}

function selectItem(label) {
  selected = placeholders.find((item) => item.label === label);
  if (!selected) return;
  emptyState.classList.add("hidden");
  editorContent.classList.remove("hidden");
  slotTitle.textContent = selected.label;
  typeSelect.value = selected.current?.type || selected.type || "image";
  renderPreview(selected);
  renderList();
}

function renderList() {
  const keyword = searchInput.value.trim().toLowerCase();
  listEl.innerHTML = "";
  placeholders
    .filter((item) => !keyword || item.label.toLowerCase().includes(keyword))
    .forEach((item) => {
      const button = document.createElement("button");
      button.className = `item ${selected?.label === item.label ? "active" : ""}`;
      button.type = "button";
      button.innerHTML = `${item.label}<small>${item.current?.src ? "已替换" : "未替换"} / ${item.current?.type || item.type}</small>`;
      button.addEventListener("click", () => selectItem(item.label));
      listEl.appendChild(button);
    });
}

async function refresh() {
  const health = await api("/api/health");
  statusEl.textContent = `COS：${health.cos.bucket} / ${health.cos.region} / ${health.cos.prefix}${health.cos.hasSecret ? "" : "（缺少密钥）"}`;
  const data = await api("/api/placeholders");
  placeholders = data.placeholders || [];
  if (selected) {
    selected = placeholders.find((item) => item.label === selected.label) || null;
    if (selected) {
      renderPreview(selected);
    } else {
      editorContent.classList.add("hidden");
      emptyState.classList.remove("hidden");
      slotTitle.textContent = "";
      previewBox.innerHTML = `<div class="placeholder">当前还没有替换素材</div>`;
      urlInput.value = "";
    }
  }
  renderList();
}

uploadBtn.addEventListener("click", async () => {
  if (!selected) return;
  const file = fileInput.files?.[0];
  if (!file) {
    alert("请先选择文件");
    return;
  }
  const form = new FormData();
  form.append("label", selected.label);
  form.append("file", file);
  uploadBtn.disabled = true;
  uploadBtn.textContent = "上传中...";
  try {
    const result = await api("/api/upload", { method: "POST", body: form });
    log(`上传成功：${result.url}`);
    await refresh();
  } catch (error) {
    log(`上传失败：${error.message}`);
  } finally {
    uploadBtn.disabled = false;
    uploadBtn.textContent = "上传到 COS 并替换";
  }
});

saveUrlBtn.addEventListener("click", async () => {
  if (!selected) return;
  const url = urlInput.value.trim();
  if (!url) {
    alert("请先粘贴链接");
    return;
  }
  try {
    await api("/api/media/url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: selected.label, url, type: typeSelect.value }),
    });
    log(`链接已保存：${url}`);
    await refresh();
  } catch (error) {
    log(`保存失败：${error.message}`);
  }
});

clearBtn.addEventListener("click", async () => {
  if (!selected) return;
  if (!confirm("清空这个位置的替换素材？")) return;
  try {
    await api("/api/media/clear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: selected.label }),
    });
    log("已清空此位置");
    await refresh();
  } catch (error) {
    log(`清空失败：${error.message}`);
  }
});

document.querySelector("#refreshBtn").addEventListener("click", refresh);
searchInput.addEventListener("input", renderList);

refresh().catch((error) => {
  statusEl.textContent = `后台连接失败：${error.message}`;
});
