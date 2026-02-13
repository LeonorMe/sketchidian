import { ItemView, WorkspaceLeaf } from "obsidian";

export const DRAWING_VIEW_TYPE = "sketch-whiteboard-view";

export class DrawingView extends ItemView {

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
        const container = this.containerEl.children[1];
        container.empty();

        const info = document.createElement("div");
        info.setText("Sketch Whiteboard loaded.");
        container.appendChild(info);
    }
}
