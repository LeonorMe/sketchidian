import { Plugin } from "obsidian";
import { DrawingView, DRAWING_VIEW_TYPE } from "./views/DrawingView";

export default class SketchWhiteboardPlugin extends Plugin {

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

}
