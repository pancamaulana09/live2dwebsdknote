import * as LAppDefine from './lappdefine';
import { LAppGlManager } from './lappglmanager';          // Handles WebGL context
import { LAppLive2DManager } from './lapplive2dmanager';  // Manages Live2D models
import { LAppPal } from './lapppal';                      // Utility/logging
import { LAppTextureManager } from './lapptexturemanager';// Manages textures
import { LAppView } from './lappview';                    // Controls rendering view

/**
 * This class ties everything together:
 * - It owns the canvas
 * - Initializes managers (GL, textures, models, view)
 * - Handles resize and update loop
 * - Handles touch/mouse input
 */
export class LAppSubdelegate {
  /**
   * Constructor
   * Initializes managers and sets default values.
   */
  public constructor() {
    this._canvas = null;
    this._glManager = new LAppGlManager();
    this._textureManager = new LAppTextureManager();
    this._live2dManager = new LAppLive2DManager();
    this._view = new LAppView();
    this._frameBuffer = null;
    this._captured = false;
  }

  /**
   * Release (like a destructor).
   * Cleans up memory and removes observers.
   */
  public release(): void {
    this._resizeObserver.unobserve(this._canvas);
    this._resizeObserver.disconnect();
    this._resizeObserver = null;

    this._live2dManager.release();
    this._live2dManager = null;

    this._view.release();
    this._view = null;

    this._textureManager.release();
    this._textureManager = null;

    this._glManager.release();
    this._glManager = null;
  }

  /**
   * Initialize everything needed for the app.
   * - Setup WebGL context
   * - Set canvas size
   * - Enable transparency
   * - Initialize view and model managers
   */
  public initialize(canvas: HTMLCanvasElement): boolean {
    if (!this._glManager.initialize(canvas)) {
      return false; // WebGL failed
    }

    this._canvas = canvas;

    // If canvas size is 'auto', match it to screen size
    if (LAppDefine.CanvasSize === 'auto') {
      this.resizeCanvas();
    } else {
      canvas.width = LAppDefine.CanvasSize.width;
      canvas.height = LAppDefine.CanvasSize.height;
    }

    // Connect texture manager to GL
    this._textureManager.setGlManager(this._glManager);

    const gl = this._glManager.getGl();

    // Store default frame buffer (used for rendering)
    if (!this._frameBuffer) {
      this._frameBuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
    }

    // Enable transparency (so model blends with background)
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Initialize view (controls rendering, hit areas, etc.)
    this._view.initialize(this);

    // Set offscreen size for model rendering
    this._live2dManager.setOffscreenSize(this._canvas.width, this._canvas.height);

    // Initialize sprites (icons, background, buttons)
    this._view.initializeSprite();

    // Initialize Live2D models
    this._live2dManager.initialize(this);

    // Watch for canvas resizing
    this._resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[], observer: ResizeObserver) =>
        this.resizeObserverCallback.call(this, entries, observer)
    );
    this._resizeObserver.observe(this._canvas);

    return true;
  }

  /**
   * Resize canvas and re-initialize view.
   */
  public onResize(): void {
    this.resizeCanvas();
    this._view.initialize(this);
    this._view.initializeSprite();
  }

  /**
   * Callback for ResizeObserver.
   * Marks that resizing is needed.
   */
  private resizeObserverCallback(
    entries: ResizeObserverEntry[],
    observer: ResizeObserver
  ): void {
    if (LAppDefine.CanvasSize === 'auto') {
      this._needResize = true;
    }
  }

  /**
   * Main update loop.
   * Called every frame.
   */
  public update(): void {
    if (this._glManager.getGl().isContextLost()) {
      return; // Stop if WebGL context is lost
    }

    // If resize was requested, resize now
    if (this._needResize) {
      this.onResize();
      this._needResize = false;
    }

    const gl = this._glManager.getGl();

    // Clear screen (black background)
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Enable depth test (near objects hide far ones)
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // Clear color + depth buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearDepth(1.0);

    // Enable transparency again
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Finally, render the view (this draws the model)
    this._view.render();
  }

  /**
   * Create a simple shader program.
   * Shader = GPU program for rendering graphics.
   */
  public createShader(): WebGLProgram {
    const gl = this._glManager.getGl();

    // Compile vertex shader (handles positions)
    const vertexShaderId = gl.createShader(gl.VERTEX_SHADER);
    if (vertexShaderId == null) {
      LAppPal.printMessage('failed to create vertexShader');
      return null;
    }
    const vertexShader: string =
      'precision mediump float;' +
      'attribute vec3 position;' +
      'attribute vec2 uv;' +
      'varying vec2 vuv;' +
      'void main(void){' +
      '   gl_Position = vec4(position, 1.0);' +
      '   vuv = uv;' +
      '}';
    gl.shaderSource(vertexShaderId, vertexShader);
    gl.compileShader(vertexShaderId);

    // Compile fragment shader (handles pixel colors)
    const fragmentShaderId = gl.createShader(gl.FRAGMENT_SHADER);
    if (fragmentShaderId == null) {
      LAppPal.printMessage('failed to create fragmentShader');
      return null;
    }
    const fragmentShader: string =
      'precision mediump float;' +
      'varying vec2 vuv;' +
      'uniform sampler2D texture;' +
      'void main(void){' +
      '   gl_FragColor = texture2D(texture, vuv);' +
      '}';
    gl.shaderSource(fragmentShaderId, fragmentShader);
    gl.compileShader(fragmentShaderId);

    // Create program and attach shaders
    const programId = gl.createProgram();
    gl.attachShader(programId, vertexShaderId);
    gl.attachShader(programId, fragmentShaderId);

    // Delete shaders after attaching (saves memory)
    gl.deleteShader(vertexShaderId);
    gl.deleteShader(fragmentShaderId);

    // Link and use program
    gl.linkProgram(programId);
    gl.useProgram(programId);

    return programId;
  }

  /**
   * Getters (provide access to private properties).
   */
  public getTextureManager(): LAppTextureManager {
    return this._textureManager;
  }
  public getFrameBuffer(): WebGLFramebuffer {
    return this._frameBuffer;
  }
  public getCanvas(): HTMLCanvasElement {
    return this._canvas;
  }
  public getGlManager(): LAppGlManager {
    return this._glManager;
  }
  public getLive2DManager(): LAppLive2DManager {
    return this._live2dManager;
  }

  /**
   * Resize canvas to match screen/device pixel ratio.
   */
  private resizeCanvas(): void {
    this._canvas.width = this._canvas.clientWidth * window.devicePixelRatio;
    this._canvas.height = this._canvas.clientHeight * window.devicePixelRatio;

    const gl = this._glManager.getGl();
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  }

  /**
   * Mouse/touch input functions.
   * They convert page coordinates → local canvas coordinates
   * then send the input to the view.
   */
  public onPointBegan(pageX: number, pageY: number): void {
    if (!this._view) {
      LAppPal.printMessage('view not found');
      return;
    }
    this._captured = true;
    const localX: number = pageX - this._canvas.offsetLeft;
    const localY: number = pageY - this._canvas.offsetTop;
    this._view.onTouchesBegan(localX, localY);
  }

  public onPointMoved(pageX: number, pageY: number): void {
    if (!this._captured) {
      return;
    }
    const localX: number = pageX - this._canvas.offsetLeft;
    const localY: number = pageY - this._canvas.offsetTop;
    this._view.onTouchesMoved(localX, localY);
  }

  public onPointEnded(pageX: number, pageY: number): void {
    this._captured = false;
    if (!this._view) {
      LAppPal.printMessage('view not found');
      return;
    }
    const localX: number = pageX - this._canvas.offsetLeft;
    const localY: number = pageY - this._canvas.offsetTop;
    this._view.onTouchesEnded(localX, localY);
  }

  public onTouchCancel(pageX: number, pageY: number): void {
    this._captured = false;
    if (!this._view) {
      LAppPal.printMessage('view not found');
      return;
    }
    const localX: number = pageX - this._canvas.offsetLeft;
    const localY: number = pageY - this._canvas.offsetTop;
    this._view.onTouchesEnded(localX, localY);
  }

  /**
   * Check if WebGL context is lost.
   */
  public isContextLost(): boolean {
    return this._glManager.getGl().isContextLost();
  }

  /**
   * ============================
   * Private Properties
   * ============================
   */
  private _canvas: HTMLCanvasElement;          // The HTML canvas
  private _view: LAppView;                     // Handles rendering
  private _textureManager: LAppTextureManager; // Manages textures
  private _frameBuffer: WebGLFramebuffer;      // Stores frame buffer
  private _glManager: LAppGlManager;           // Manages WebGL context
  private _live2dManager: LAppLive2DManager;   // Manages Live2D models
  private _resizeObserver: ResizeObserver;     // Watches for resize
  private _captured: boolean;                  // If mouse/touch is pressed
  private _needResize: boolean;                // Flag for resize
}
