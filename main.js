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
    const info = document.createElement("div");
    info.setText("Sketch Whiteboard loaded.");
    container.appendChild(info);
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
