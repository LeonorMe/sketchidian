export interface Tool {
    name: string;
    color: string;
    size: number;

    onDown(ctx: CanvasRenderingContext2D, x: number, y: number): void;
    onMove(ctx: CanvasRenderingContext2D, x: number, y: number): void;
    onUp(ctx: CanvasRenderingContext2D): void;
}
