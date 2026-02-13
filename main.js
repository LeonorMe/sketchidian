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
};

// src/drawing/ToolManager.ts
var ToolManager = class {
  constructor(cm) {
    this.drawing = false;
    this.lastX = 0;
    this.lastY = 0;
    this.onDown = (e) => {
      if (e.button !== 0) return;
      const rect = this.cm.getBoardRect();
      this.lastX = e.clientX - rect.left;
      this.lastY = e.clientY - rect.top;
      this.drawing = true;
    };
    this.onMove = (e) => {
      if (!this.drawing) return;
      const ctx = this.cm.getActiveCtx();
      const rect = this.cm.getBoardRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctx.strokeStyle = "#ff0000";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(this.lastX, this.lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      this.lastX = x;
      this.lastY = y;
    };
    this.onUp = () => {
      this.drawing = false;
    };
    this.cm = cm;
  }
  bindEvents() {
    const board = this.cm.boardEl;
    board.addEventListener("pointerdown", this.onDown);
    board.addEventListener("pointermove", this.onMove);
    board.addEventListener("pointerup", this.onUp);
    board.addEventListener("pointerleave", this.onUp);
    board.addEventListener("pointercancel", this.onUp);
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
    this.canvasManager = new CanvasManager(content);
    this.canvasManager.initialize();
    this.toolManager = new ToolManager(this.canvasManager);
    this.toolManager.bindEvents();
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
