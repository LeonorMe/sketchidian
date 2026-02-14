export interface CanvasLayer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
}

export class CanvasManager {
    container: HTMLElement;
    boardEl!: HTMLDivElement;
    layers: CanvasLayer[] = [];
    activeLayerIndex = 0;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    initialize() {
        this.boardEl = document.createElement("div");
        this.boardEl.className = "sketch-board";
        this.container.appendChild(this.boardEl);

        for (let i = 0; i < 3; i++) {
            const canvas = document.createElement("canvas");
            canvas.className = "sketch-layer";
            canvas.style.touchAction = "none";

            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("No 2D context");

            this.boardEl.appendChild(canvas);
            this.layers.push({ canvas, ctx });
        }

        this.resize();
        window.addEventListener("resize", () => this.resize());
    }

    resize() {
        const rect = this.boardEl.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        for (const layer of this.layers) {
            const { canvas, ctx } = layer;

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            canvas.style.width = rect.width + "px";
            canvas.style.height = rect.height + "px";

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = "source-over";
        }
    }

    getActiveCtx(): CanvasRenderingContext2D {
        return this.layers[this.activeLayerIndex].ctx;
    }

    getBoardRect(): DOMRect {
        return this.boardEl.getBoundingClientRect();
    }

    /** 
     * Export the strokes as a cropped PNG based on bounding box of all strokes
     * @param strokes Array of strokes from ToolManager
     */
    async exportPNG(strokes: Array<{ points: { x: number; y: number }[]; color: string; size: number }>): Promise<Blob> {
        // Return 1x1 transparent PNG if no strokes
        if (!strokes || strokes.length === 0) {
            const c = document.createElement("canvas");
            c.width = 1;
            c.height = 1;
            return new Promise((res) => c.toBlob((b) => res(b!), "image/png"));
        }

        // Calculate bounding box for all strokes
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        const margin = 6; // pixels around strokes

        for (const stroke of strokes) {
            for (const p of stroke.points) {
                if (p.x < minX) minX = p.x;
                if (p.y < minY) minY = p.y;
                if (p.x > maxX) maxX = p.x;
                if (p.y > maxY) maxY = p.y;
            }
        }

        minX = Math.max(minX - margin, 0);
        minY = Math.max(minY - margin, 0);
        maxX += margin;
        maxY += margin;

        const width = maxX - minX;
        const height = maxY - minY;

        // Create temporary canvas to draw cropped image
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = width;
        tempCanvas.height = height;
        const ctx = tempCanvas.getContext("2d")!;
        ctx.clearRect(0, 0, width, height);

        // Draw each stroke on the temporary canvas, offset by bounding box
        for (const stroke of strokes) {
            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = stroke.size;
            ctx.beginPath();
            for (let i = 1; i < stroke.points.length; i++) {
                const p0 = stroke.points[i - 1];
                const p1 = stroke.points[i];
                ctx.moveTo(p0.x - minX, p0.y - minY);
                ctx.lineTo(p1.x - minX, p1.y - minY);
                ctx.stroke();
            }
        }

        return new Promise((resolve) => tempCanvas.toBlob((b) => resolve(b!), "image/png"));
    }
}
