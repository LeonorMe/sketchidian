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
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas 2D context not available");
      this.boardEl.appendChild(canvas);
      this.layers.push({
        canvas,
        ctx,
        visible: true,
        locked: false
      });
    }
    this.resize();
    this.bindResize();
  }
  bindResize() {
    window.addEventListener("resize", () => this.resize());
  }
  resize() {
    const rect = this.boardEl.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.layers.forEach((layer) => {
      const canvas = layer.canvas;
      const ctx = layer.ctx;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    });
  }
  getActiveLayer() {
    return this.layers[this.activeLayerIndex];
  }
  setActiveLayer(index) {
    if (index < 0 || index > 2) return;
    this.activeLayerIndex = index;
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
    const container = this.containerEl.children[1];
    container.empty();
    this.canvasManager = new CanvasManager(container);
    this.canvasManager.initialize();
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
    const leaf = this.app.workspace.getLeaf(true);
    await leaf.setViewState({
      type: DRAWING_VIEW_TYPE,
      active: true
    });
  }
};
//# sourceMappingURL=main.js.map
