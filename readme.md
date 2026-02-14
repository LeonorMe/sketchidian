# Sketchidian – Simple Whiteboard Plugin for Obsidian

**Sketchidian** is an open-source Obsidian community plugin that provides a minimal, intuitive whiteboard interface for quick sketches and notes. Draw lines with adjustable color and size, save them as cropped PNG images directly in your vault, and automatically copy a markdown link to the clipboard for seamless embedding in your documents.

---

## Features

- Simple pen tool with adjustable **color** and **size**.
- **Undo** support for the last stroke (Ctrl+Z).
- Auto-cropped PNG export: only the area containing your strokes is saved.
- Automatic creation of a `Sketches` folder in your vault if it doesn’t exist.
- Copies the markdown image link to clipboard for direct pasting.
- Works with mouse, touch, and tablet pens (e.g., Wacom Intuos).
- Minimal toolbar integrated inside Obsidian.

---

## Installation

1. Clone or download this repository into your Obsidian plugins folder:
```

/.obsidian/plugins/sketchidian

````
2. Build the plugin (if using TypeScript):
```bash
npm install
npm run build
````

3. Enable the plugin in **Settings → Community Plugins → Installed Plugins → Sketchidian**.
    

---

## Usage

1. Click the **pencil icon** in the Obsidian sidebar to open a new whiteboard.
    
2. Draw using your mouse or pen tablet.
    
3. Use the toolbar to select **color** and **line size**.
    
4. Press **Ctrl+Z** (or Cmd+Z on Mac) to undo the last stroke.
    
5. Click **Save** to export your drawing as a PNG in the `Sketches` folder.
    
6. The markdown link (`![[sketch-<timestamp>.png]]`) is automatically copied to your clipboard. Paste it in any note to embed the image.
    

---

## Development

### Project Structure

- `main.ts` – Plugin entry point; registers commands, ribbon icon, and whiteboard view.
    
- `DrawingView.ts` – Implements the whiteboard view and toolbar.
    
- `CanvasManager.ts` – Handles canvas creation, resizing, and export logic.
    
- `ToolManager.ts` – Manages strokes, drawing state, and undo functionality.
    
- `tools/` – Defines tools like `PenTool` and shared `ToolState`.
    
- `styles.css` – Minimal CSS for toolbar and canvas styling.
    

### Building

```bash
npm install
npm run build
```

The compiled plugin will be placed in `dist/` (or your configured output folder).

---

## Contributing

Contributions are welcome. Suggestions for new features, improvements to stroke smoothing, multiple tools, or layer support are highly appreciated.

Steps to contribute:

1. Fork the repository.
    
2. Create a branch for your feature/fix:
    
    ```bash
    git checkout -b feature/awesome-feature
    ```
    
3. Make changes and commit:
    
    ```bash
    git commit -m "Add awesome feature"
    ```
    
4. Push to your fork and open a pull request.
    

Please follow the existing **TypeScript structure** and **English comments**.

---

## License

MIT License. See [LICENSE]() for details.

---

## Notes

- Currently only a **single pen tool** is available.
    
- Future improvements could include:
    
    - Smoothing lines for natural strokes.
        
    - Layer support.
        
    - Additional tools like eraser or highlighter.
        
    - Customizable export folder and file naming.
        
