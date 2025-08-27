

import { LAppDelegate } from './lappdelegate';
import * as LAppDefine from './lappdefine';

/**
 * ===============================
 * What does this file do?
 * ===============================
 * This file sets up event listeners for the browser window.
 * - When the page finishes loading, it starts the Live2D app.
 * - When the page is about to close/refresh, it cleans up memory.
 */


/**
 * -------------------------------
 * After the browser finishes loading
 * -------------------------------
 */
window.addEventListener(
  'load',
  (): void => {
    // 1. Initialize WebGL (the graphics system used to draw the model).
    //    LAppDelegate handles all the setup for Live2D, like:
    //    - Preparing the canvas
    //    - Loading the model
    //    - Setting up rendering
    //    - Handling user input
    if (!LAppDelegate.getInstance().initialize()) {
      // If initialization fails, stop here.
      return;
    }

    // 2. If initialization succeeded, start running the Live2D app.
    //    This begins the update loop so the model is animated and interactive.
    LAppDelegate.getInstance().run();
  },
  { passive: true } // Passive: this listener won't call preventDefault(), faster for the browser.
);


/**
 * -------------------------------
 * Before the browser window is closed or refreshed
 * -------------------------------
 */
window.addEventListener(
  'beforeunload',
  (): void => {
    // Free up resources and stop processes before the page unloads.
    // This avoids memory leaks and makes sure the app shuts down cleanly.
    LAppDelegate.releaseInstance();
  },
  { passive: true }
);
