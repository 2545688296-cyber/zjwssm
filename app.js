const STORAGE_KEY = "kitchen-log-v3";
const LEGACY_STORAGE_KEY = "kitchen-log-v2";
const DRAFT_STORAGE_KEY = "kitchen-log-drafts-v1";
const INTRO_SEEN_KEY = "kitchen-log-intro-seen-v1";
const SITE_TAG = "zjwssm";
const PHOTO_LIMIT = 8;
const PHOTO_MAX_DIMENSION = 1400;
const PHOTO_QUALITY = 0.82;

const nowIso = () => new Date().toISOString();

const sampleRecipes = [
  {
    "id": "ccd3f09d-5eb2-44f2-accc-8c63d5cf334d",
    "name": "番茄炒蛋",
    "source": "暑假视频课",
    "rating": 4,
    "difficulty": "入门",
    "ingredients": [
      "番茄",
      "鸡蛋",
      "葱"
    ],
    "seasonings": [
      "盐",
      "糖"
    ],
    "tools": [
      "炒锅"
    ],
    "prep": "番茄切块，鸡蛋加少量盐打散，葱切葱花。",
    "steps": "鸡蛋先炒到刚凝固后盛出。番茄下锅炒出汁，再倒回鸡蛋翻匀。",
    "tasting": "酸甜比较舒服，鸡蛋嫩度还不错。",
    "mistakes": "番茄皮有点影响口感。",
    "next": "下次番茄先去皮，最后再放葱花。",
    "learned": "鸡蛋不要在锅里等番茄，先盛出更嫩。",
    "tags": [
      "快手菜",
      "下饭"
    ],
    "photos": [],
    "date": "2026-07-30",
    "duration": 15,
    "portions": 1,
    "repeatCount": 2,
    "createdAt": "2026-07-30T01:05:50.195Z",
    "updatedAt": "2026-07-30T01:05:50.195Z"
  },
  {
    "id": "29abbafd-1c5d-4c15-a2f2-fb34afbee692",
    "name": "青椒土豆丝",
    "source": "家常菜教程",
    "rating": 3,
    "difficulty": "普通",
    "ingredients": [
      "土豆",
      "青椒",
      "蒜"
    ],
    "seasonings": [
      "醋",
      "盐"
    ],
    "tools": [
      "炒锅",
      "刨丝器"
    ],
    "prep": "土豆切丝后冲掉淀粉，青椒切细丝，蒜拍碎。",
    "steps": "蒜爆香，土豆丝大火翻炒，再放青椒，最后沿锅边淋醋。",
    "tasting": "味道可以，但口感不够脆。",
    "mistakes": "土豆丝粗细不一，炒的时间偏长。",
    "next": "下次先把丝切匀，入锅前沥干水。",
    "learned": "冲淀粉和大火快炒会直接影响脆度。",
    "tags": [
      "练刀工",
      "素菜"
    ],
    "photos": [],
    "date": "2026-07-29",
    "duration": 20,
    "portions": 1,
    "repeatCount": 1,
    "createdAt": "2026-07-29T01:05:50.195Z",
    "updatedAt": "2026-07-29T01:05:50.195Z"
  }
];

let recipes = loadRecipes();
let drafts = loadDrafts();
let selectedId = recipes[0]?.id ?? null;

const fields = {
  statRecipes: document.querySelector("#statRecipes"),
  statTries: document.querySelector("#statTries"),
  statBest: document.querySelector("#statBest"),
  statPhotos: document.querySelector("#statPhotos"),
  introOverlay: document.querySelector("#introOverlay"),
  introStartButton: document.querySelector("#introStartButton"),
  introSkipButton: document.querySelector("#introSkipButton"),
  introViewButton: document.querySelector("#introViewButton"),
  introShowcase: document.querySelector("#introShowcase"),
  introStatus: document.querySelector("#introStatus"),
  recipeList: document.querySelector("#recipeList"),
  search: document.querySelector("#searchInput"),
  form: document.querySelector("#recipeForm"),
  name: document.querySelector("#nameInput"),
  source: document.querySelector("#sourceInput"),
  rating: document.querySelector("#ratingInput"),
  ratingOutput: document.querySelector("#ratingOutput"),
  saveState: document.querySelector("#saveState"),
  difficulty: document.querySelector("#difficultyInput"),
  date: document.querySelector("#dateInput"),
  duration: document.querySelector("#durationInput"),
  portions: document.querySelector("#portionsInput"),
  repeatCount: document.querySelector("#repeatInput"),
  ingredients: document.querySelector("#ingredientsInput"),
  seasonings: document.querySelector("#seasoningsInput"),
  tools: document.querySelector("#toolsInput"),
  prep: document.querySelector("#prepInput"),
  steps: document.querySelector("#stepsInput"),
  tasting: document.querySelector("#tastingInput"),
  mistakes: document.querySelector("#mistakesInput"),
  next: document.querySelector("#nextInput"),
  learned: document.querySelector("#learnedInput"),
  tags: document.querySelector("#tagsInput"),
  voiceButton: document.querySelector("#voiceButton"),
  voiceStatus: document.querySelector("#voiceStatus"),
  applySummaryButton: document.querySelector("#applySummaryButton"),
  summaryIngredients: document.querySelector("#summaryIngredients"),
  summarySeasonings: document.querySelector("#summarySeasonings"),
  deleteButton: document.querySelector("#deleteButton"),
  newRecipeButton: document.querySelector("#newRecipeButton"),
  duplicateButton: document.querySelector("#duplicateButton"),
  photoInput: document.querySelector("#photoInput"),
  photoPreview: document.querySelector("#photoPreview"),
  pantry: document.querySelector("#pantryInput"),
  recommendButton: document.querySelector("#recommendButton"),
  clearPantryButton: document.querySelector("#clearPantryButton"),
  pantryShortcuts: document.querySelector("#pantryShortcuts"),
  recommendations: document.querySelector("#recommendations"),
  focusAdvice: document.querySelector("#focusAdvice"),
  retryList: document.querySelector("#retryList"),
  favoriteList: document.querySelector("#favoriteList"),
  lessonList: document.querySelector("#lessonList"),
  ingredientCloud: document.querySelector("#ingredientCloud"),
  exportButton: document.querySelector("#exportButton"),
  copyDataButton: document.querySelector("#copyDataButton"),
  importInput: document.querySelector("#importInput"),
  importStatus: document.querySelector("#importStatus")
};

function loadRecipes() {
  const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!raw) {
    return sampleRecipes;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return sampleRecipes;
    }
    return parsed.map(normalizeRecipe);
  } catch {
    return sampleRecipes;
  }
}

function loadDrafts() {
  const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function normalizeRecipe(recipe) {
  const createdAt = recipe.createdAt ?? nowIso();
  return {
    id: recipe.id ?? crypto.randomUUID(),
    name: recipe.name ?? "",
    source: recipe.source ?? "",
    rating: Number(recipe.rating) || 3,
    difficulty: recipe.difficulty ?? "入门",
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : splitText(recipe.ingredients ?? ""),
    seasonings: Array.isArray(recipe.seasonings) ? recipe.seasonings : splitText(recipe.seasonings ?? ""),
    tools: Array.isArray(recipe.tools) ? recipe.tools : splitText(recipe.tools ?? ""),
    prep: recipe.prep ?? "",
    steps: recipe.steps ?? "",
    tasting: recipe.tasting ?? "",
    mistakes: recipe.mistakes ?? "",
    next: recipe.next ?? "",
    learned: recipe.learned ?? "",
    tags: Array.isArray(recipe.tags) ? recipe.tags : splitText(recipe.tags ?? ""),
    photos: Array.isArray(recipe.photos) ? recipe.photos.slice(0, PHOTO_LIMIT) : [],
    date: recipe.date ?? createdAt.slice(0, 10),
    duration: Number(recipe.duration) || "",
    portions: Number(recipe.portions) || 1,
    repeatCount: Number(recipe.repeatCount) || 1,
    createdAt,
    updatedAt: recipe.updatedAt ?? createdAt
  };
}

function saveRecipes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

function saveDrafts() {
  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
}

function markDirty() {
  fields.saveState.textContent = "有未保存内容";
  fields.saveState.classList.add("dirty");
}

function markSaved() {
  fields.saveState.textContent = "已保存";
  fields.saveState.classList.remove("dirty");
}

function draftKey() {
  return selectedId || "__new__";
}

function collectFormSnapshot() {
  return {
    name: fields.name.value,
    source: fields.source.value,
    rating: fields.rating.value,
    difficulty: fields.difficulty.value,
    date: fields.date.value,
    duration: fields.duration.value,
    portions: fields.portions.value,
    repeatCount: fields.repeatCount.value,
    ingredients: fields.ingredients.value,
    seasonings: fields.seasonings.value,
    tools: fields.tools.value,
    prep: fields.prep.value,
    steps: fields.steps.value,
    tasting: fields.tasting.value,
    mistakes: fields.mistakes.value,
    next: fields.next.value,
    learned: fields.learned.value,
    tags: fields.tags.value
  };
}

function persistDraft() {
  drafts[draftKey()] = collectFormSnapshot();
  saveDrafts();
}

function clearDraft() {
  delete drafts[draftKey()];
  saveDrafts();
}

function restoreDraft(recipe) {
  const draft = drafts[recipe?.id || "__new__"];
  const source = draft || recipe;
  if (!source) {
    return;
  }

  fields.name.value = source.name ?? "";
  fields.source.value = source.source ?? "";
  fields.rating.value = source.rating ?? 3;
  fields.ratingOutput.textContent = `${fields.rating.value} 分`;
  fields.difficulty.value = source.difficulty ?? "入门";
  fields.date.value = source.date ?? new Date().toISOString().slice(0, 10);
  fields.duration.value = source.duration ?? "";
  fields.portions.value = source.portions ?? 1;
  fields.repeatCount.value = source.repeatCount ?? 1;
  fields.ingredients.value = Array.isArray(source.ingredients) ? source.ingredients.join("，") : (source.ingredients ?? "");
  fields.seasonings.value = Array.isArray(source.seasonings) ? source.seasonings.join("，") : (source.seasonings ?? "");
  fields.tools.value = Array.isArray(source.tools) ? source.tools.join("，") : (source.tools ?? "");
  fields.prep.value = source.prep ?? "";
  fields.steps.value = source.steps ?? "";
  fields.tasting.value = source.tasting ?? "";
  fields.mistakes.value = source.mistakes ?? "";
  fields.next.value = source.next ?? "";
  fields.learned.value = source.learned ?? "";
  fields.tags.value = Array.isArray(source.tags) ? source.tags.join("，") : (source.tags ?? "");
}

function splitText(value) {
  return String(value)
    .split(/[,，、\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDate(isoDate) {
  if (!isoDate) {
    return "未记录";
  }
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(isoDate));
}

function getSelectedRecipe() {
  return recipes.find((recipe) => recipe.id === selectedId) ?? null;
}

function setText(target, text) {
  target.textContent = text;
}

function createEmpty(message) {
  const node = document.createElement("div");
  node.className = "empty";
  node.textContent = message;
  return node;
}

function renderStats() {
  fields.statRecipes.textContent = recipes.length;
  const tries = recipes.reduce((sum, recipe) => sum + (Number(recipe.repeatCount) || 1), 0);
  fields.statTries.textContent = tries;
  const best = recipes.reduce((max, recipe) => Math.max(max, Number(recipe.rating) || 0), 0);
  fields.statBest.textContent = best ? `${best} 分` : "-";
  const photos = recipes.reduce((sum, recipe) => sum + (recipe.photos?.length || 0), 0);
  if (fields.statPhotos) {
    fields.statPhotos.textContent = photos;
  }
}

function recipeCompleteness(recipe) {
  const checks = [
    recipe.name,
    recipe.ingredients.length,
    recipe.steps,
    recipe.tasting,
    recipe.next,
    recipe.learned
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

function getTopRecipe() {
  return [...recipes].sort((a, b) => Number(b.rating) - Number(a.rating) || (b.photos?.length || 0) - (a.photos?.length || 0))[0] ?? null;
}

function getGalleryRecipes() {
  return [...recipes].filter((recipe) => recipe.photos?.length).slice(0, 6);
}

function renderRecipeList() {
  const query = fields.search.value.trim().toLowerCase();
  const visibleRecipes = recipes.filter((recipe) => {
    const haystack = [
      recipe.name,
      recipe.source,
      recipe.difficulty,
    recipe.tasting,
    recipe.learned,
    recipe.photos?.length,
    ...recipe.ingredients,
      ...recipe.seasonings,
      ...recipe.tags
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });

  fields.recipeList.replaceChildren();

  if (!visibleRecipes.length) {
    fields.recipeList.append(createEmpty("还没有匹配的菜。可以先新建一道。"));
    return;
  }

  const template = document.querySelector("#recipeItemTemplate");
  visibleRecipes.forEach((recipe) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.classList.toggle("active", recipe.id === selectedId);
    setText(node.querySelector("strong"), recipe.name || "未命名菜");
    setText(
      node.querySelector("span"),
      `${recipe.rating} 分 · ${recipeCompleteness(recipe)}% 完整 · ${recipe.ingredients.join("、") || "未写食材"}`
    );
    node.addEventListener("click", () => {
      selectedId = recipe.id;
      renderAll();
    });
    fields.recipeList.append(node);
  });
}

function renderForm() {
  const recipe = getSelectedRecipe();
  fields.deleteButton.disabled = !recipe;
  fields.duplicateButton.disabled = !recipe;

  restoreDraft(recipe);
  updateAutoSummary();
  renderPhotoPreview(recipe);
  markSaved();
}

function renderPhotoPreview(recipe) {
  fields.photoPreview.replaceChildren();
  if (!recipe?.photos?.length) {
    fields.photoPreview.append(createEmpty("还没有照片。做完饭后可以上传成品照，朋友打开网站会更有你的生活感。"));
    return;
  }

  recipe.photos.forEach((photo, index) => {
    const card = document.createElement("figure");
    card.className = "photo-card";
    const image = document.createElement("img");
    const caption = document.createElement("figcaption");
    const removeButton = document.createElement("button");
    image.src = photo.dataUrl;
    image.alt = `${recipe.name || "菜品"}照片 ${index + 1}`;
    image.loading = "lazy";
    caption.textContent = photo.name || `${recipe.name || "菜品"}照片`;
    removeButton.type = "button";
    removeButton.textContent = "移除";
    removeButton.addEventListener("click", () => removePhoto(index));
    card.append(image, caption, removeButton);
    fields.photoPreview.append(card);
  });
}

function removePhoto(index) {
  const current = getSelectedRecipe();
  if (!current) {
    return;
  }
  current.photos.splice(index, 1);
  current.updatedAt = nowIso();
  saveRecipes();
  renderAll();
}

function makeSummaryText() {
  const text = [
    fields.prep.value,
    fields.steps.value,
    fields.tasting.value,
    fields.mistakes.value,
    fields.next.value,
    fields.learned.value
  ]
    .join(" ")
    .replace(/\s+/g, " ");
  const ingredientCandidates = splitText([
    fields.ingredients.value,
    text.match(/番茄|鸡蛋|土豆|青椒|西兰花|蒜|葱|肉|豆腐|胡萝卜|黄瓜|米饭|面条|虾|牛肉|鸡肉|排骨|洋葱|青菜|蘑菇|香菇|豆角|茄子|莲藕|玉米|山药|白菜|菠菜|豆芽|金针菇|火腿|培根|芝士|奶酪/g)?.join("，") ?? ""
  ].join("，"));
  const seasoningCandidates = splitText([
    fields.seasonings.value,
    text.match(/盐|糖|生抽|老抽|醋|蚝油|料酒|胡椒|辣椒|辣椒粉|孜然|豆瓣酱|番茄酱|酱油|芝麻油|香油|鸡精|味精/g)?.join("，") ?? ""
  ].join("，"));
  return {
    ingredients: [...new Set(ingredientCandidates)].join("，"),
    seasonings: [...new Set(seasoningCandidates)].join("，")
  };
}

function updateAutoSummary() {
  const summary = makeSummaryText();
  if (fields.summaryIngredients) {
    fields.summaryIngredients.value = summary.ingredients;
  }
  if (fields.summarySeasonings) {
    fields.summarySeasonings.value = summary.seasonings;
  }
}

function applyAutoSummary() {
  const summary = makeSummaryText();
  if (summary.ingredients) {
    fields.ingredients.value = summary.ingredients;
  }
  if (summary.seasonings) {
    fields.seasonings.value = summary.seasonings;
  }
  markDirty();
  updateAutoSummary();
}

function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function startVoiceInput() {
  const Recognition = getSpeechRecognition();
  if (!Recognition) {
    fields.voiceStatus.textContent = "当前浏览器不支持语音识别。";
    return;
  }

  const target = document.activeElement;
  const isTextArea = target && ["TEXTAREA", "INPUT"].includes(target.tagName);
  const inputTarget = isTextArea ? target : fields.steps;
  const recognition = new Recognition();
  recognition.lang = "zh-CN";
  recognition.interimResults = false;
  recognition.continuous = false;
  fields.voiceStatus.textContent = `正在听你说话，结果会写进「${inputTarget.id === "stepsInput" ? "下锅步骤" : inputTarget.id === "prepInput" ? "准备过程" : "试吃感受"}」`;

  recognition.onresult = (event) => {
    const transcript = [...event.results].map((result) => result[0].transcript).join("");
    inputTarget.value = `${inputTarget.value}${inputTarget.value ? " " : ""}${transcript}`.trim();
    inputTarget.dispatchEvent(new Event("input", { bubbles: true }));
    fields.voiceStatus.textContent = "语音已写入。";
  };

  recognition.onerror = () => {
    fields.voiceStatus.textContent = "语音识别出错了。";
  };

  recognition.onend = () => {
    if (fields.voiceStatus.textContent.startsWith("正在听")) {
      fields.voiceStatus.textContent = "语音结束。";
    }
  };

  recognition.start();
}

async function handlePhotoFiles(files) {
  const current = getSelectedRecipe();
  if (!current || !files.length) {
    fields.importStatus.textContent = current ? "" : "先保存一道菜，再上传照片。";
    return;
  }

  const remainingSlots = PHOTO_LIMIT - (current.photos?.length || 0);
  const selectedFiles = [...files].slice(0, Math.max(remainingSlots, 0));
  if (!selectedFiles.length) {
    fields.importStatus.textContent = `每道菜最多保存 ${PHOTO_LIMIT} 张照片。`;
    return;
  }

  const photos = await Promise.all(selectedFiles.map(compressImageFile));
  current.photos = [...(current.photos ?? []), ...photos];
  current.updatedAt = nowIso();
  saveRecipes();
  renderAll();
  fields.importStatus.textContent = `已添加 ${photos.length} 张照片。`;
  fields.photoInput.value = "";
}

function compressImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const image = new Image();
      image.addEventListener("load", () => {
        const scale = Math.min(1, PHOTO_MAX_DIMENSION / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve({
          id: crypto.randomUUID(),
          name: file.name,
          type: "image/jpeg",
          dataUrl: canvas.toDataURL("image/jpeg", PHOTO_QUALITY),
          createdAt: nowIso()
        });
      });
      image.addEventListener("error", reject);
      image.src = String(reader.result);
    });
    reader.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });
}

function scoreRecipe(recipe, pantryItems) {
  const owned = new Set();
  const allNeeded = [...recipe.ingredients, ...recipe.seasonings];

  const matched = allNeeded.filter((ingredient) =>
    pantryItems.some((item) => {
      const hit = ingredient.includes(item) || item.includes(ingredient);
      if (hit) {
        owned.add(ingredient);
      }
      return hit;
    })
  );

  const missing = allNeeded.filter((ingredient) => !owned.has(ingredient));
  const matchScore = matched.length * 12;
  const ratingScore = Number(recipe.rating) * 4;
  const repeatScore = Math.min(Number(recipe.repeatCount) || 1, 5) * 2;
  const difficultyBonus = recipe.difficulty === "入门" ? 4 : recipe.difficulty === "普通" ? 2 : 0;
  const completenessBonus = recipe.steps && recipe.next ? 5 : 0;

  return {
    recipe,
    matched: [...new Set(matched)],
    missing: [...new Set(missing)],
    score: matchScore + ratingScore + repeatScore + difficultyBonus + completenessBonus
  };
}

function readiness(result) {
  const neededCount = result.matched.length + result.missing.length;
  const ratio = neededCount ? result.matched.length / neededCount : 0;
  if (ratio >= 0.75) {
    return { label: "现在就能做", className: "ready" };
  }
  if (ratio >= 0.45) {
    return { label: "补一点就能做", className: "almost" };
  }
  return { label: "只匹配到一部分", className: "partial" };
}

function renderRecommendations() {
  const pantryItems = splitText(fields.pantry.value);
  fields.recommendations.replaceChildren();

  if (!pantryItems.length) {
    fields.recommendations.append(createEmpty("输入冰箱里已有的食材，推荐会出现在这里。"));
    return;
  }

  const results = recipes
    .map((recipe) => scoreRecipe(recipe, pantryItems))
    .filter((result) => result.matched.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  if (!results.length) {
    fields.recommendations.append(createEmpty("目前没有做过能匹配这些食材的菜。可以把今天这次尝试记录下来。"));
    return;
  }

  results.forEach((result) => {
    const { recipe, matched, missing } = result;
    const state = readiness(result);
    const card = document.createElement("article");
    card.className = "recommend-card";
    const header = document.createElement("header");
    const titleWrap = document.createElement("div");
    const title = document.createElement("h2");
    const reason = document.createElement("p");
    const scorePill = document.createElement("span");
    const steps = document.createElement("p");
    const next = document.createElement("p");
    const meta = document.createElement("div");

    title.textContent = recipe.name || "未命名菜";
    reason.className = "match-line";
    reason.textContent = `匹配 ${matched.length} 项：${matched.join("、")}${missing.length ? ` ｜可能还缺：${missing.join("、")}` : " ｜食材基本齐了"}`;
    scorePill.className = `score-pill ${state.className}`;
    scorePill.textContent = state.label;
    steps.className = "match-line";
    steps.textContent = recipe.steps || "这道菜还没写步骤。";
    next.className = "match-line";
    next.textContent = `下次提醒：${recipe.next || "还没有复盘提醒。"}`;
    meta.className = "mini-meta";
    meta.textContent = `${recipe.rating} 分 · 做过 ${recipe.repeatCount || 1} 次 · ${recipe.difficulty} · 约 ${recipe.duration || "?"} 分钟`;

    titleWrap.append(title, reason);
    header.append(titleWrap, scorePill);
    card.append(header, meta, steps, next);
    fields.recommendations.append(card);
  });
}

function renderPantryShortcuts() {
  const shortcuts = ingredientCounts().slice(0, 10);
  fields.pantryShortcuts.replaceChildren();

  shortcuts.forEach(([ingredient]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "shortcut-chip";
    button.textContent = ingredient;
    button.addEventListener("click", () => {
      const current = splitText(fields.pantry.value);
      if (!current.includes(ingredient)) {
        fields.pantry.value = [...current, ingredient].join("，");
        renderRecommendations();
      }
    });
    fields.pantryShortcuts.append(button);
  });
}

function renderReview() {
  const retryRecipes = [...recipes]
    .sort((a, b) => Number(a.rating) - Number(b.rating) || new Date(a.updatedAt) - new Date(b.updatedAt))
    .slice(0, 3);
  const favoriteRecipes = [...recipes]
    .sort((a, b) => Number(b.rating) - Number(a.rating) || Number(b.repeatCount) - Number(a.repeatCount))
    .slice(0, 3);
  const lessonRecipes = [...recipes]
    .filter((recipe) => recipe.learned || recipe.mistakes || recipe.next)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 4);

  renderCompactList(fields.retryList, retryRecipes, "下次改法", "next");
  renderCompactList(fields.favoriteList, favoriteRecipes, "稳定经验", "heat");
  renderCompactList(fields.lessonList, lessonRecipes, "学到的东西", "learned");
  renderIngredientCloud();
  renderFocusAdvice(retryRecipes[0]);
}

function renderFocusAdvice(recipe) {
  fields.focusAdvice.replaceChildren();
  if (!recipes.length) {
    fields.focusAdvice.append(createEmpty("先记录几道菜，复盘建议会自动生成。"));
    return;
  }

  const title = document.createElement("strong");
  const body = document.createElement("p");
  title.textContent = recipe ? `下一次建议复做：${recipe.name}` : "下一次建议复做";
  body.textContent = recipe
    ? recipe.next || recipe.mistakes || "这道菜评分相对低，适合再做一次，把问题补成经验。"
    : "选择一两道评分不高的菜复做，比一直换新菜更容易涨厨艺。";
  fields.focusAdvice.append(title, body);
}

function renderCompactList(target, list, label, key) {
  target.replaceChildren();
  if (!list.length) {
    target.append(createEmpty("记录几道菜后这里会自动整理。"));
    return;
  }

  list.forEach((recipe) => {
    const card = document.createElement("article");
    card.className = "compact-card";
    const title = document.createElement("strong");
    const copy = document.createElement("p");
    const meta = document.createElement("small");
    title.textContent = recipe.name || "未命名菜";
    copy.textContent = `${label}：${recipe[key] || recipe.next || recipe.mistakes || "还没写，下一次做完可以补上。"}`;
    meta.textContent = `${formatDate(recipe.date)} · ${recipe.rating} 分 · 做过 ${recipe.repeatCount || 1} 次`;
    card.append(title, copy, meta);
    target.append(card);
  });
}

function renderIngredientCloud() {
  const chips = ingredientCounts().slice(0, 18);

  fields.ingredientCloud.replaceChildren();
  if (!chips.length) {
    fields.ingredientCloud.append(createEmpty("食材会自动汇总成标签。"));
    return;
  }

  chips.forEach(([ingredient, count]) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = `${ingredient} × ${count}`;
    fields.ingredientCloud.append(chip);
  });
}

function renderGalleryStrip() {
  const gallery = document.querySelector("#galleryStrip");
  if (!gallery) {
    return;
  }
  gallery.replaceChildren();
  const items = getGalleryRecipes();
  if (!items.length) {
    gallery.append(createEmpty("做菜照片会在这里变成你的生活相册。"));
    return;
  }

  const template = document.querySelector("#galleryItemTemplate");
  items.forEach((recipe) => {
    const photo = recipe.photos[0];
    if (!photo) {
      return;
    }
    const node = template.content.firstElementChild.cloneNode(true);
    const image = node.querySelector("img");
    const caption = node.querySelector("span");
    image.src = photo.dataUrl;
    image.alt = recipe.name;
    caption.textContent = recipe.name;
    node.addEventListener("click", () => {
      selectedId = recipe.id;
      renderAll();
      document.querySelector('[data-tab="record"]')?.click();
    });
    gallery.append(node);
  });
}

function ingredientCounts() {
  return [
    ...recipes
      .reduce((map, recipe) => {
      [...recipe.ingredients, ...recipe.seasonings].forEach((ingredient) => {
        map.set(ingredient, (map.get(ingredient) ?? 0) + 1);
      });
      return map;
    }, new Map())
      .entries()
  ].sort((a, b) => b[1] - a[1]);
}

function updateIntroVisibility() {
  const seen = localStorage.getItem(INTRO_SEEN_KEY) === "1";
  if (fields.introOverlay) {
    fields.introOverlay.classList.toggle("hidden", seen);
  }
}

function renderAll() {
  renderStats();
  renderRecipeList();
  renderForm();
  renderPantryShortcuts();
  renderRecommendations();
  renderReview();
  renderGalleryStrip();
  renderIntro();
  updateAutoSummary();
}

function renderIntro() {
  if (!fields.introShowcase) {
    return;
  }
  const featured = [...recipes].slice(0, 3);
  fields.introShowcase.replaceChildren();
  featured.forEach((recipe) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "intro-chip";
    item.textContent = `${recipe.name}${recipe.photos?.length ? " · 有照片" : ""}`;
    item.addEventListener("click", () => {
      selectedId = recipe.id;
      hideIntro();
      renderAll();
      document.querySelector('[data-tab="record"]')?.click();
    });
    fields.introShowcase.append(item);
  });
  if (!featured.length) {
    fields.introShowcase.append(createEmpty("还没有记录，先从第一道菜开始。"));
  }
}

function hideIntro() {
  if (fields.introOverlay) {
    fields.introOverlay.classList.add("hidden");
    localStorage.setItem(INTRO_SEEN_KEY, "1");
  }
}

function recipeFromForm(current) {
  const timestamp = nowIso();
  return {
    id: current?.id ?? crypto.randomUUID(),
    name: fields.name.value.trim(),
    source: fields.source.value.trim(),
    rating: Number(fields.rating.value),
    difficulty: fields.difficulty.value,
    ingredients: splitText(fields.ingredients.value),
    seasonings: splitText(fields.seasonings.value),
    tools: splitText(fields.tools.value),
    prep: fields.prep.value.trim(),
    steps: fields.steps.value.trim(),
    tasting: fields.tasting.value.trim(),
    mistakes: fields.mistakes.value.trim(),
    next: fields.next.value.trim(),
    learned: fields.learned.value.trim(),
    tags: splitText(fields.tags.value),
    photos: current?.photos ?? [],
    date: fields.date.value || new Date().toISOString().slice(0, 10),
    duration: Number(fields.duration.value) || "",
    portions: Number(fields.portions.value) || 1,
    repeatCount: Number(fields.repeatCount.value) || 1,
    createdAt: current?.createdAt ?? timestamp,
    updatedAt: timestamp
  };
}

function upsertRecipe(event) {
  event.preventDefault();
  const current = getSelectedRecipe();
  const recipe = recipeFromForm(current);

  if (!recipe.name) {
    fields.name.focus();
    return;
  }

  if (current) {
    recipes = recipes.map((item) => (item.id === current.id ? recipe : item));
  } else {
    recipes = [recipe, ...recipes];
  }

  selectedId = recipe.id;
  saveRecipes();
  clearDraft();
  renderAll();
  markSaved();
}

function newRecipe() {
  selectedId = null;
  renderRecipeList();
  renderForm();
  fields.saveState.textContent = "新记录";
  fields.saveState.classList.add("dirty");
  fields.name.focus();
}

function duplicateRecipe() {
  const current = getSelectedRecipe();
  if (!current) {
    return;
  }
  const duplicated = normalizeRecipe({
    ...current,
    id: crypto.randomUUID(),
    name: `${current.name} 第 ${Number(current.repeatCount || 1) + 1} 次`,
    repeatCount: Number(current.repeatCount || 1) + 1,
    rating: 3,
    tasting: "",
    mistakes: "",
    learned: "",
    date: new Date().toISOString().slice(0, 10),
    createdAt: nowIso(),
    updatedAt: nowIso(),
    photos: current.photos ?? []
  });
  recipes = [duplicated, ...recipes];
  selectedId = duplicated.id;
  saveRecipes();
  clearDraft();
  renderAll();
}

function deleteRecipe() {
  const current = getSelectedRecipe();
  if (!current) {
    return;
  }

  const confirmed = window.confirm(`删除「${current.name}」这条记录？`);
  if (!confirmed) {
    return;
  }

  recipes = recipes.filter((recipe) => recipe.id !== current.id);
  selectedId = recipes[0]?.id ?? null;
  saveRecipes();
  clearDraft();
  renderAll();
}

function exportData() {
  const data = JSON.stringify(recipes, null, 2);
  const blob = new Blob([data], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `厨房练习簿-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  fields.importStatus.textContent = "已导出当前数据。";
}

async function copyData() {
  const data = JSON.stringify(recipes, null, 2);
  await navigator.clipboard.writeText(data);
  fields.importStatus.textContent = "已复制 JSON 数据。";
}

function importData(file) {
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      if (!Array.isArray(parsed)) {
        throw new Error("数据格式不是数组");
      }
      recipes = parsed.map(normalizeRecipe);
      selectedId = recipes[0]?.id ?? null;
      saveRecipes();
      renderAll();
      fields.importStatus.textContent = `已导入 ${recipes.length} 条记录。`;
    } catch (error) {
      fields.importStatus.textContent = `导入失败：${error.message}`;
    }
  });
  reader.readAsText(file, "utf-8");
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".tab-view").forEach((view) => view.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`[data-view="${tab.dataset.tab}"]`).classList.add("active");
  });
});

fields.form.addEventListener("submit", upsertRecipe);
fields.search.addEventListener("input", renderRecipeList);
fields.rating.addEventListener("input", () => {
  fields.ratingOutput.textContent = `${fields.rating.value} 分`;
});
fields.newRecipeButton.addEventListener("click", newRecipe);
fields.duplicateButton.addEventListener("click", duplicateRecipe);
fields.deleteButton.addEventListener("click", deleteRecipe);
fields.recommendButton.addEventListener("click", renderRecommendations);
fields.clearPantryButton.addEventListener("click", () => {
  fields.pantry.value = "";
  renderRecommendations();
});
fields.pantry.addEventListener("input", renderRecommendations);
fields.exportButton.addEventListener("click", exportData);
fields.copyDataButton.addEventListener("click", copyData);
fields.importInput.addEventListener("change", (event) => importData(event.target.files[0]));
fields.form.addEventListener("input", () => {
  markDirty();
  updateAutoSummary();
  persistDraft();
});
fields.photoInput.addEventListener("change", (event) => handlePhotoFiles(event.target.files || []));
fields.voiceButton?.addEventListener("click", startVoiceInput);
fields.applySummaryButton?.addEventListener("click", applyAutoSummary);
fields.introStartButton?.addEventListener("click", hideIntro);
fields.introSkipButton?.addEventListener("click", hideIntro);
fields.introViewButton?.addEventListener("click", () => {
  fields.introStatus.textContent = `这里会记录你做过的 ${recipes.length} 道菜，还有 ${recipes.reduce((sum, recipe) => sum + (recipe.photos?.length || 0), 0)} 张照片。`;
  fields.introShowcase.scrollIntoView({ behavior: "smooth", block: "center" });
});

saveRecipes();
updateIntroVisibility();
renderAll();
