export interface CanvasLayer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    visible: boolean;
    locked: boolean;
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
        // Board wrapper
        this.boardEl = document.createElement("div");
        this.boardEl.className = "sketch-board";
        this.container.appendChild(this.boardEl);

        // Create 3 layers
        for (let i = 0; i < 3; i++) {
            const canvas = document.createElement("canvas");
            canvas.className = "sketch-layer";

            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Canvas 2D context not available");

            this.boardEl.appendChild(canvas);

            this.layers.push({
                canvas,
                ctx,
                visible: true,
                locked: false
            });
        }

        this.resize();
        this.bindResize();
    }

    bindResize() {
        window.addEventListener("resize", () => this.resize());
    }

    resize() {
        const rect = this.boardEl.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        this.layers.forEach((layer) => {
            const canvas = layer.canvas;
            const ctx = layer.ctx;

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
        });
    }

    getActiveLayer(): CanvasLayer {
        return this.layers[this.activeLayerIndex];
    }

    setActiveLayer(index: number) {
        if (index < 0 || index > 2) return;
        this.activeLayerIndex = index;
    }
}
