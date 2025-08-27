

import { csmVector } from '@framework/type/csmvector';
import { CubismFramework, Option } from '@framework/live2dcubismframework';
import * as LAppDefine from './lappdefine';
import { LAppPal } from './lapppal';
import { LAppSubdelegate } from './lappsubdelegate';
import { CubismLogError } from '@framework/utils/cubismdebug';

// Singleton instance of LAppDelegate (only one app controller at a time)
export let s_instance: LAppDelegate = null;

/**
 * ===================================================
 *  LAppDelegate Class
 * ===================================================
 * This is the "main controller" of the application.
 * - Manages the Cubism SDK (initialize / dispose)
 * - Creates and manages canvases for rendering models
 * - Listens to user input (pointer events: touch/mouse)
 * - Runs the main animation loop
 */
export class LAppDelegate {
  /* ------------------------------
     Singleton Management
  ------------------------------ */

  // Return the instance (create if not already made)
  public static getInstance(): LAppDelegate {
    if (s_instance == null) {
      s_instance = new LAppDelegate();
    }
    return s_instance;
  }

  // Release the instance
  public static releaseInstance(): void {
    if (s_instance != null) {
      s_instance.release();
    }
    s_instance = null;
  }

  /* ------------------------------
     Pointer Event Handlers
     (mouse/touch input)
  ------------------------------ */

  // When pointer is pressed down
  private onPointerBegan(e: PointerEvent): void {
    for (
      let ite = this._subdelegates.begin();
      ite.notEqual(this._subdelegates.end());
      ite.preIncrement()
    ) {
      ite.ptr().onPointBegan(e.pageX, e.pageY);
    }
  }

  // When pointer moves
  private onPointerMoved(e: PointerEvent): void {
    for (
      let ite = this._subdelegates.begin();
      ite.notEqual(this._subdelegates.end());
      ite.preIncrement()
    ) {
      ite.ptr().onPointMoved(e.pageX, e.pageY);
    }
  }

  // When pointer is released
  private onPointerEnded(e: PointerEvent): void {
    for (
      let ite = this._subdelegates.begin();
      ite.notEqual(this._subdelegates.end());
      ite.preIncrement()
    ) {
      ite.ptr().onPointEnded(e.pageX, e.pageY);
    }
  }

  // When pointer action is canceled (e.g. interrupted by OS)
  private onPointerCancel(e: PointerEvent): void {
    for (
      let ite = this._subdelegates.begin();
      ite.notEqual(this._subdelegates.end());
      ite.preIncrement()
    ) {
      ite.ptr().onTouchCancel(e.pageX, e.pageY);
    }
  }

  /* ------------------------------
     Window Resize
  ------------------------------ */

  // Called when the canvas size changes
  public onResize(): void {
    for (let i = 0; i < this._subdelegates.getSize(); i++) {
      this._subdelegates.at(i).onResize();
    }
  }

  /* ------------------------------
     Main Loop
  ------------------------------ */

  // Start the app loop (updates every frame)
  public run(): void {
    const loop = (): void => {
      if (s_instance == null) return;

      // Update time (used for animations)
      LAppPal.updateTime();

      // Update each subdelegate (each canvas/model)
      for (let i = 0; i < this._subdelegates.getSize(); i++) {
        this._subdelegates.at(i).update();
      }

      // Call loop again for next frame
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ------------------------------
     Resource Cleanup
  ------------------------------ */

  // Release everything when closing the app
  private release(): void {
    this.releaseEventListener();
    this.releaseSubdelegates();

    // Dispose of Cubism SDK
    CubismF
