# Live2D Cubism SDK Documentation (Beginner-Friendly)

## 1. Introduction

Live2D is a powerful SDK that lets you bring 2D illustrations to life. With Live2D, you can animate characters drawn in Photoshop or Clip Studio without turning them into 3D models. This documentation is designed to help beginners understand and use the Live2D Cubism SDK effectively.

---

## 2. What You Can Do with Live2D

* **Animate Characters**: Make eyes blink, lips move, hair sway, and clothes flow.
* **Interactive Motion**: Characters can react to mouse movement, voice input, or user interaction.
* **Game/Apps Integration**: Commonly used in games, VTuber apps, and interactive websites.
* **Cross-Platform**: Works with Web (JavaScript/TypeScript), iOS (Objective-C/Swift), Android (Java/Kotlin), and C++.

---

## 3. SDK Variants

1. **Cubism SDK for Native (C++)**

   * For desktop applications and cross-platform engines.
2. **Cubism SDK for Web**

   * JavaScript/TypeScript version for browser-based projects.
3. **Cubism SDK for Unity**

   * Widely used in games, supports Unity’s engine features.
4. **Cubism SDK for iOS/Android**

   * For mobile application development.

---

## 4. Installing the SDK

### Web (JavaScript/TypeScript)

1. Download SDK from Live2D’s official website.
2. Extract the package.
3. Place the SDK folder inside your project.
4. Import necessary scripts (`live2dcubismcore.js`, framework scripts, etc.).

### Unity

1. Import the `.unitypackage` from Live2D.
2. Drag and drop your `.moc3`, `.model3.json`, and textures into Unity.
3. Use the **Cubism Model Component** to display.

### Native (C++)

1. Download SDK.
2. Add the framework and core libraries to your project.
3. Link required dependencies (OpenGL, DirectX, etc.).

---

## 5. File Types in Live2D

* **.psd** → Original layered artwork.
* **.moc3** → Compiled model file.
* **.model3.json** → Model settings (links textures, motions, physics).
* **.motion3.json** → Motion animation data.
* **.physics3.json** → Physics configuration (hair, clothes).
* **.exp3.json** → Expression data (smile, angry, sad).
* **Textures (.png)** → Model images.

---

## 6. Basic Workflow

1. **Prepare Art**: Draw character in separate parts (eyes, hair, mouth, body).
2. **Rig in Cubism Editor**: Define deformers, parameters, physics.
3. **Export Runtime Files**: `.moc3`, `.model3.json`, `.motion3.json`, textures.
4. **Load in SDK**: Use the SDK to display and animate model in your app.

---

## 7. Example: Loading a Model (Web)

```javascript
import { LAppDelegate } from './lappdelegate.js';

window.onload = () => {
  LAppDelegate.getInstance().initialize();
  LAppDelegate.getInstance().run();
};
```

* `LAppDelegate` initializes OpenGL/WebGL.
* The model is loaded using `.model3.json`.

---

## 8. Motions & Expressions

* Load motions via `motion3.json`.
* Apply by calling `startMotion(group, index, priority)`.
* Expressions (`exp3.json`) can be switched dynamically.

Example (Web):

```javascript
model.startMotion("Idle", 0, 1);
model.setExpression("Smile");
```

---

## 9. Physics & Parameters

* Physics makes hair, clothes, and accessories move naturally.
* Parameters control model states:

  * `ParamAngleX` → Head rotation.
  * `ParamEyeLOpen` → Left eye open/close.
  * `ParamMouthOpenY` → Mouth opening.

Example:

```javascript
model.setParameterValue("ParamMouthOpenY", 1.0);
```

---

## 10. Integration Ideas

* **Games**: Character reacts when player wins or loses.
* **Streaming (VTuber)**: Sync mouth with microphone.
* **Websites**: Mascot that greets users and responds to clicks.
* **Apps**: Virtual assistant with emotions.

---

## 11. Learning Resources

* **Official Docs**: [https://docs.live2d.com/](https://docs.live2d.com/)
* **SDK Samples**: Included in SDK download.
* **Community**: Live2D forums, Discord groups.
* **YouTube Tutorials**: Many step-by-step guides.

---

## 12. Tips for Beginners

* Start with sample models before using your own.
* Always separate body parts properly in Photoshop.
* Keep motion simple at first.
* Test in Unity or Web for quick results.

---

## 13. Glossary

* **Deformer**: A tool in Cubism Editor to bend/warp parts.
* **Parameter**: Controls like sliders for eye blink, mouth open.
* **Physics**: Simulation of natural movement.
* **Expression**: A saved preset of parameters (e.g., smile).

---

## 14. Conclusion

Live2D SDK may look complex at first, but step by step you’ll learn to make your characters come alive. Begin with samples, experiment with parameters, and gradually create your own interactive models. With practice, you can build games, apps, and even your own VTuber avatar.

---

✨ **Remember**: The magic of Live2D is in transforming static art into living emotion. Start simple, and let your creativity grow with every motion.
