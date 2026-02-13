import { CanvasManager } from "./CanvasManager";
import { Tool } from "./tools/Tool";
import { PenTool } from "./tools/PenTool";

export class ToolManager {
    cm: CanvasManager;
    tool: Tool;
    drawing = false;

    constructor(cm: CanvasManager) {
        this.cm = cm;
        this.tool = new PenTool();
    }

    bindEvents() {
        const board = this.cm.boardEl;

        board.addEventListener("pointerdown", this.onDown);
        board.addEventListener("pointermove", this.onMove);
        board.addEventListener("pointerup", this.onUp);
        board.addEventListener("pointerleave", this.onUp);
        board.addEventListener("pointercancel", this.onUp);
    }

    onDown = (e: PointerEvent) => {
        if (e.button !== 0) return;

        const rect = this.cm.getBoardRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.drawing = true;
        this.tool.onDown(this.cm.getActiveCtx(), x, y);
    };

    onMove = (e: PointerEvent) => {
        if (!this.drawing) return;

        const rect = this.cm.getBoardRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.tool.onMove(this.cm.getActiveCtx(), x, y);
    };

    onUp = () => {
        if (!this.drawing) return;
        this.drawing = false;
        this.tool.onUp(this.cm.getActiveCtx());
    };
}
