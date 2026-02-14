import { CanvasManager } from "./CanvasManager";
import { Tool } from "./tools/Tool";
import { PenTool } from "./tools/PenTool";
import { ToolState } from "./tools/ToolState";


export class ToolManager {
    cm: CanvasManager;
    toolState: ToolState;
    tool: Tool;
    drawing = false; 

    strokes: Array<{ points: { x: number; y: number }[]; color: string; size: number }> = [];
    currentStroke: { points: { x: number; y: number }[]; color: string; size: number } | null = null;


    constructor(cm: CanvasManager) {
        this.cm = cm;
        this.toolState = new ToolState();
        this.tool = new PenTool(this.toolState);
    }


    bindEvents() {
        const board = this.cm.boardEl;

        board.addEventListener("pointerdown", this.onDown);
        board.addEventListener("pointermove", this.onMove);
        board.addEventListener("pointerup", this.onUp);
        board.addEventListener("pointerleave", this.onUp);
        board.addEventListener("pointercancel", this.onUp);
        
        document.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "z") {
                e.preventDefault();
                this.undo();
            }
        });

    }

    onDown = (e: PointerEvent) => {
        if (e.button !== 0) return;
        const rect = this.cm.getBoardRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.drawing = true;

        // criar stroke novo
        this.currentStroke = {
            points: [{ x, y }],
            color: this.toolState.color,
            size: this.toolState.size,
        };

        this.tool.onDown(this.cm.getActiveCtx(), x, y);
    };

    onMove = (e: PointerEvent) => {
        if (!this.drawing || !this.currentStroke) return;
        const rect = this.cm.getBoardRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.currentStroke.points.push({ x, y });
        this.tool.onMove(this.cm.getActiveCtx(), x, y);
    };

    onUp = () => {
        if (!this.drawing || !this.currentStroke) return;
        this.strokes.push(this.currentStroke);
        this.currentStroke = null;
        this.drawing = false;
    };

    undo() {
        if (this.strokes.length === 0) return;

        // remove last stroke
        this.strokes.pop();

        // clean canvas
        const ctx = this.cm.getActiveCtx();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // redraw all remaining strokes 
        for (const stroke of this.strokes) {
            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = stroke.size;
            ctx.beginPath();
            for (let i = 1; i < stroke.points.length; i++) {
                const p0 = stroke.points[i - 1];
                const p1 = stroke.points[i];
                ctx.moveTo(p0.x, p0.y);
                ctx.lineTo(p1.x, p1.y);
                ctx.stroke();
            }
        }
    }


    getBoundingBox(margin = 6) {
        if (this.strokes.length === 0) return null;

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        for (const stroke of this.strokes) {
            for (const p of stroke.points) {
                if (p.x < minX) minX = p.x;
                if (p.y < minY) minY = p.y;
                if (p.x > maxX) maxX = p.x;
                if (p.y > maxY) maxY = p.y;
            }
        }

        // add margin
        minX = Math.max(minX - margin, 0);
        minY = Math.max(minY - margin, 0);
        maxX += margin;
        maxY += margin;

        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    }

}
