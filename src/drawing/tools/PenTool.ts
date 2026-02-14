import { Tool } from "./Tool";
import { ToolState } from "./ToolState";

export class PenTool implements Tool {
    name = "pen";
    state: ToolState;

    private lastX = 0;
    private lastY = 0;

    constructor(state: ToolState) {
        this.state = state;
    }
    color!: string;
    size!: number;

    onDown(ctx: CanvasRenderingContext2D, x: number, y: number) {
        this.lastX = x;
        this.lastY = y;
    }

    onMove(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.strokeStyle = this.state.color;
        ctx.lineWidth = this.state.size;

        ctx.beginPath();
        ctx.moveTo(this.lastX, this.lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        this.lastX = x;
        this.lastY = y;
    }

    onUp() { }
}
