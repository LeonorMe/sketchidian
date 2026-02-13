import { CanvasManager } from "./CanvasManager";

export class ToolManager {
    cm: CanvasManager;
    drawing = false;
    lastX = 0;
    lastY = 0;

    constructor(cm: CanvasManager) {
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

    onDown = (e: PointerEvent) => {
        if (e.button !== 0) return;

        const rect = this.cm.getBoardRect();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;

        this.drawing = true;
    };

    onMove = (e: PointerEvent) => {
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

    onUp = () => {
        this.drawing = false;
    };
}
