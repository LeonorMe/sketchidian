import { ItemView, WorkspaceLeaf } from "obsidian";
import { CanvasManager } from "../drawing/CanvasManager";
import { ToolManager } from "../drawing/ToolManager";



export const DRAWING_VIEW_TYPE = "sketch-whiteboard-view";

export class DrawingView extends ItemView {
    canvasManager!: CanvasManager;
    toolManager!: ToolManager;

    constructor(leaf: WorkspaceLeaf) {
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

}

