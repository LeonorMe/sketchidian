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
        // Get strokes from ToolManager
        const strokes = this.toolManager.strokes;

        // Export PNG with bounding box crop
        const blob = await this.canvasManager.exportPNG(strokes);
        const arrayBuffer = await blob.arrayBuffer();

        // Folder and file path
        const folderPath = "Sketches";
        const fileName = `sketch-${Date.now()}.png`;
        const fullPath = `${folderPath}/${fileName}`;

        // Create folder if it does not exist
        if (!this.app.vault.getAbstractFileByPath(folderPath)) {
            await this.app.vault.createFolder(folderPath);
        }

        // Save PNG in vault
        await this.app.vault.createBinary(fullPath, arrayBuffer);

        // Copy markdown image link to clipboard
        await navigator.clipboard.writeText(`![[${fullPath}]]`);
    }


}

