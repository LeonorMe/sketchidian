import { ItemView, WorkspaceLeaf } from "obsidian";
import { CanvasManager } from "../drawing/CanvasManager";


export const DRAWING_VIEW_TYPE = "sketch-whiteboard-view";

export class DrawingView extends ItemView {
    canvasManager?: CanvasManager;

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
        const container = this.containerEl.children[1] as HTMLElement;
        container.empty();

        this.canvasManager = new CanvasManager(container);
        this.canvasManager.initialize();
    }
}

