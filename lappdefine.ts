
import { LogLevel } from '@framework/live2dcubismframework';

/**
 * ===================================================
 * Constants used for the Sample Live2D Application
 * ===================================================
 * This file defines:
 *  - Canvas settings (size, scale, limits)
 *  - Resources (background image, icons, models)
 *  - Model settings (directory, motions, hit areas)
 *  - Motion priority rules
 *  - Debug and validation options
 *  - Render target size
 * ===================================================
 */


/* ------------------------------
   Canvas (the drawing screen)
------------------------------ */

// Canvas width and height (pixels).
// Can be set as fixed numbers OR 'auto' to match screen size.
export const CanvasSize: { width: number; height: number } | 'auto' = 'auto';

// Number of canvases (usually 1).
export const CanvasNum = 1;

// Zoom level of the view.
// 1.0 = normal, 2.0 = max zoom in, 0.8 = max zoom out.
export const ViewScale = 1.0;
export const ViewMaxScale = 2.0;
export const ViewMinScale = 0.8;


/* ------------------------------
   Logical view boundaries
   (The area the model can move/scale within)
------------------------------ */

// Normal logical screen limits
export const ViewLogicalLeft = -1.0;
export const ViewLogicalRight = 1.0;
export const ViewLogicalBottom = -1.0;
export const ViewLogicalTop = 1.0;

// Maximum logical screen limits
// (when zooming or panning beyond normal range)
export const ViewLogicalMaxLeft = -2.0;
export const ViewLogicalMaxRight = 2.0;
export const ViewLogicalMaxBottom = -2.0;
export const ViewLogicalMaxTop = 2.0;


/* ------------------------------
   Resource files (images, paths)
------------------------------ */

// Path to the resource folder (models, images, motions, etc.)
export const ResourcesPath = '../../Resources/';

// Background image file (behind the model)
export const BackImageName = 'back_class_normal.png';

// Gear icon image (usually for settings)
export const GearImageName = 'icon_gear.png';

// Power/Close button image
export const PowerImageName = 'CloseNormal.png';


/* ------------------------------
   Models
------------------------------ */

// List of model directories.
// Each folder must have a matching model3.json file with the same name.
export const ModelDir: string[] = [
  'Haru',
  'Hiyori',
  'Mark',
  'Natori',
  'Rice',
  'Mao',
  'Wanko',
  'Ren'
];

// Number of models available
export const ModelDirSize: number = ModelDir.length;


/* ------------------------------
   Motions (animations)
------------------------------ */

// Motion groups must match the motion settings inside the model's JSON files.
// "Idle" = breathing/idle animation.
// "TapBody" = animation triggered when the body is tapped/clicked.
export const MotionGroupIdle = 'Idle';
export const MotionGroupTapBody = 'TapBody';


/* ------------------------------
   Hit areas (touchable parts)
------------------------------ */

// These names must match definitions in the model's JSON.
// Used to detect touches on head or body.
export const HitAreaNameHead = 'Head';
export const HitAreaNameBody = 'Body';


/* ------------------------------
   Motion priority levels
------------------------------ */

// Motion priority rules (decide which animation is stronger)
// 0 = none, 1 = idle (weakest), 2 = normal, 3 = force (strongest).
export const PriorityNone = 0;
export const PriorityIdle = 1;
export const PriorityNormal = 2;
export const PriorityForce = 3;


/* ------------------------------
   Validation and Debug settings
------------------------------ */

// Check if model files (.moc3) are valid
export const MOCConsistencyValidationEnable = true;

// Check if motion files (.motion3.json) are valid
export const MotionConsistencyValidationEnable = true;

// Enable debug logs (prints information in the console)
export const DebugLogEnable = true;

// Enable logging of touch events (false = off)
export const DebugTouchLogEnable = false;

// Logging detail level from the framework
// Verbose = most detailed (prints all logs)
export const CubismLoggingLevel: LogLevel = LogLevel.LogLevel_Verbose;


/* ------------------------------
   Render target (output resolution)
------------------------------ */

// Default size of the render target (where the model is drawn).
// Width x Height in pixels.
export const RenderTargetWidth = 1900;
export const RenderTargetHeight = 1000;
