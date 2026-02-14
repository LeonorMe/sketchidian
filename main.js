"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => SketchWhiteboardPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

// src/views/DrawingView.ts
var import_obsidian = require("obsidian");

// src/drawing/CanvasManager.ts
var CanvasManager = class {
  constructor(container) {
    this.layers = [];
    this.activeLayerIndex = 0;
    this.container = container;
  }
  initialize() {
    this.boardEl = document.createElement("div");
    this.boardEl.className = "sketch-board";
    this.container.appendChild(this.boardEl);
    for (let i = 0; i < 3; i++) {
      const canvas = document.createElement("canvas");
      canvas.className = "sketch-layer";
      canvas.style.touchAction = "none";
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No 2D context");
      this.boardEl.appendChild(canvas);
      this.layers.push({ canvas, ctx });
    }
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }
  resize() {
    const rect = this.boardEl.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    for (const layer of this.layers) {
      const { canvas, ctx } = layer;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }
  }
  getActiveCtx() {
    return this.layers[this.activeLayerIndex].ctx;
  }
  getBoardRect() {
    return this.boardEl.getBoundingClientRect();
  }
  /** 
   * Export the strokes as a cropped PNG based on bounding box of all strokes
   * @param strokes Array of strokes from ToolManager
   */
  async exportPNG(strokes) {
    if (!strokes || strokes.length === 0) {
      const c = document.createElement("canvas");
      c.width = 1;
      c.height = 1;
      return new Promise((res) => c.toBlob((b) => res(b), "image/png"));
    }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const margin = 6;
    for (const stroke of strokes) {
      for (const p of stroke.points) {
        if (p.x < minX) minX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
      }
    }
    minX = Math.max(minX - margin, 0);
    minY = Math.max(minY - margin, 0);
    maxX += margin;
    maxY += margin;
    const width = maxX - minX;
    const height = maxY - minY;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const ctx = tempCanvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    for (const stroke of strokes) {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.beginPath();
      for (let i = 1; i < stroke.points.length; i++) {
        const p0 = stroke.points[i - 1];
        const p1 = stroke.points[i];
        ctx.moveTo(p0.x - minX, p0.y - minY);
        ctx.lineTo(p1.x - minX, p1.y - minY);
        ctx.stroke();
      }
    }
    return new Promise((resolve) => tempCanvas.toBlob((b) => resolve(b), "image/png"));
  }
};

// src/drawing/tools/PenTool.ts
var PenTool = class {
  constructor(state) {
    this.name = "pen";
    this.lastX = 0;
    this.lastY = 0;
    this.state = state;
  }
  onDown(ctx, x, y) {
    this.lastX = x;
    this.lastY = y;
  }
  onMove(ctx, x, y) {
    ctx.strokeStyle = this.state.color;
    ctx.lineWidth = this.state.size;
    ctx.beginPath();
    ctx.moveTo(this.lastX, this.lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    this.lastX = x;
    this.lastY = y;
  }
  onUp() {
  }
};

// src/drawing/tools/ToolState.ts
var ToolState = class {
  constructor() {
    this.color = "#ffffff";
    this.size = 2;
  }
};

// src/drawing/ToolManager.ts
var ToolManager = class {
  constructor(cm) {
    this.drawing = false;
    this.strokes = [];
    this.currentStroke = null;
    this.onDown = (e) => {
      if (e.button !== 0) return;
      const rect = this.cm.getBoardRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.drawing = true;
      this.currentStroke = {
        points: [{ x, y }],
        color: this.toolState.color,
        size: this.toolState.size
      };
      this.tool.onDown(this.cm.getActiveCtx(), x, y);
    };
    this.onMove = (e) => {
      if (!this.drawing || !this.currentStroke) return;
      const rect = this.cm.getBoardRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.currentStroke.points.push({ x, y });
      this.tool.onMove(this.cm.getActiveCtx(), x, y);
    };
    this.onUp = () => {
      if (!this.drawing || !this.currentStroke) return;
      this.strokes.push(this.currentStroke);
      this.currentStroke = null;
      this.drawing = false;
    };
    this.cm = cm;
    this.toolState = new ToolState();
    this.tool = new PenTool(this.toolState);
  }
  bindEvents() {
    const board = this.cm.boardEl;
    board.addEventListener("pointerdown", this.onDown);
    board.addEventListener("pointermove", this.onMove);
    board.addEventListener("pointerup", this.onUp);
    board.addEventListener("pointerleave", this.onUp);
    board.addEventListener("pointercancel", this.onUp);
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        this.undo();
      }
    });
  }
  undo() {
    if (this.strokes.length === 0) return;
    this.strokes.pop();
    const ctx = this.cm.getActiveCtx();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (const stroke of this.strokes) {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.beginPath();
      for (let i = 1; i < stroke.points.length; i++) {
        const p0 = stroke.points[i - 1];
        const p1 = stroke.points[i];
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }
    }
  }
  getBoundingBox(margin = 6) {
    if (this.strokes.length === 0) return null;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const stroke of this.strokes) {
      for (const p of stroke.points) {
        if (p.x < minX) minX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
      }
    }
    minX = Math.max(minX - margin, 0);
    minY = Math.max(minY - margin, 0);
    maxX += margin;
    maxY += margin;
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }
};

// src/views/DrawingView.ts
var DRAWING_VIEW_TYPE = "sketch-whiteboard-view";
var DrawingView = class extends import_obsidian.ItemView {
  constructor(leaf) {
    super(leaf);
  }
  getViewType() {
    return DRAWING_VIEW_TYPE;
  }
  getDisplayText() {
    return "Sketch Whiteboard";
  }
  async onOpen() {
    const content = this.contentEl;
    content.empty();
    content.style.width = "100%";
    content.style.height = "100%";
    content.style.position = "relative";
    const toolbar = content.createDiv("sketch-toolbar");
    const colorInput = toolbar.createEl("input");
    colorInput.type = "color";
    colorInput.value = "#ffffff";
    colorInput.onchange = () => {
      this.toolManager.toolState.color = colorInput.value;
    };
    const sizeInput = toolbar.createEl("input");
    sizeInput.type = "range";
    sizeInput.min = "1";
    sizeInput.max = "20";
    sizeInput.value = "2";
    sizeInput.oninput = () => {
      this.toolManager.toolState.size = Number(sizeInput.value);
    };
    const saveBtn = toolbar.createEl("button", { text: "Guardar" });
    saveBtn.onclick = async () => {
      await this.saveImage();
    };
    this.canvasManager = new CanvasManager(content);
    this.canvasManager.initialize();
    this.toolManager = new ToolManager(this.canvasManager);
    this.toolManager.bindEvents();
  }
  async saveImage() {
    const strokes = this.toolManager.strokes;
    const blob = await this.canvasManager.exportPNG(strokes);
    const arrayBuffer = await blob.arrayBuffer();
    const folderPath = "Sketches";
    const fileName = `sketch-${Date.now()}.png`;
    const fullPath = `${folderPath}/${fileName}`;
    if (!this.app.vault.getAbstractFileByPath(folderPath)) {
      await this.app.vault.createFolder(folderPath);
    }
    await this.app.vault.createBinary(fullPath, arrayBuffer);
    await navigator.clipboard.writeText(`![[${fullPath}]]`);
  }
};

// src/main.ts
var SketchWhiteboardPlugin = class extends import_obsidian2.Plugin {
  async onload() {
    this.registerView(
      DRAWING_VIEW_TYPE,
      (leaf) => new DrawingView(leaf)
    );
    this.addCommand({
      id: "open-sketch-whiteboard",
      name: "Open Sketch Whiteboard",
      callback: () => this.openWhiteboard()
    });
    this.addRibbonIcon("pencil", "Open Sketch Whiteboard", async () => {
      await this.openWhiteboard();
    });
  }
  async openWhiteboard() {
    const leaf = this.app.workspace.getLeaf("tab");
    await leaf.setViewState({
      type: DRAWING_VIEW_TYPE,
      active: true,
      state: {}
    });
    this.app.workspace.revealLeaf(leaf);
  }
};
//# sourceMappingURL=main.js.map
