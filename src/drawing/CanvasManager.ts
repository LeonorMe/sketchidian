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


    async exportPNG(): Promise<Blob> {
        const layer = this.layers[0]; // simples por agora
        return new Promise((resolve) => {
            layer.canvas.toBlob((blob) => {
                if (!blob) throw new Error("Failed to export PNG");
                resolve(blob);
            }, "image/png");
        });
    }

}
