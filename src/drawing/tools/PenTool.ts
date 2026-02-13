import { Tool } from "./Tool";

export class PenTool implements Tool {
    name = "pen";
    color = "#f0ebe3";
    size = 2;

    private lastX = 0;
    private lastY = 0;

    onDown(ctx: CanvasRenderingContext2D, x: number, y: number) {
        this.lastX = x;
        this.lastY = y;
    }

    onMove(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;

        ctx.beginPath();
        ctx.moveTo(this.lastX, this.lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        this.lastX = x;
        this.lastY = y;
    }

    onUp() { }
}
