/* eslint-disable @typescript-eslint/no-explicit-any */
// Type definitions for A-Frame and AR.js integration
declare module "aframe" {
  namespace aframe {
    interface Entity extends THREE.Object3D {
      components: { [key: string]: any };
      getAttribute(attribute: string): any;
      setAttribute(attribute: string, value: any): void;
      addEventListener(event: string, handler: (event: any) => void): void;
      removeEventListener(event: string, handler: (event: any) => void): void;
      emit(event: string, detail?: any): void;
    }

    interface Scene extends Entity {
      camera: Entity;
      canvas: HTMLCanvasElement;
      renderer: THREE.WebGLRenderer;
      time: number;
      delta: number;
    }

    interface System {
      el: Scene;
      data: any;
      init?(): void;
      tick?(time: number, timeDelta: number): void;
      pause?(): void;
      play?(): void;
      remove?(): void;
    }

    interface Component {
      el: Entity;
      data: any;
      system?: System;
      init?(): void;
      update?(oldData: any): void;
      tick?(time: number, timeDelta: number): void;
      tock?(time: number, timeDelta: number): void;
      remove?(): void;
      pause?(): void;
      play?(): void;
      updateSchema?(data: any): void;
    }

    interface ComponentDescriptor {
      schema?: any;
      multiple?: boolean;
      init?(): void;
      update?(oldData: any): void;
      tick?(time: number, timeDelta: number): void;
      tock?(time: number, timeDelta: number): void;
      remove?(): void;
      pause?(): void;
      play?(): void;
      updateSchema?(data: any): void;
    }

    interface Geometry {
      name: string;
      data: any;
    }

    interface Material {
      name: string;
      data: any;
    }

    interface Shader {
      name: string;
      data: any;
    }
  }

  // Global A-Frame object
  interface AFrame {
    components: { [key: string]: aframe.ComponentDescriptor };
    geometries: { [key: string]: aframe.Geometry };
    materials: { [key: string]: aframe.Material };
    primitives: { [key: string]: any };
    shaders: { [key: string]: aframe.Shader };
    systems: { [key: string]: aframe.System };
    version: string;

    registerComponent(
      name: string,
      definition: aframe.ComponentDescriptor
    ): void;
    registerGeometry(name: string, definition: aframe.Geometry): void;
    registerMaterial(name: string, definition: aframe.Material): void;
    registerPrimitive(name: string, definition: any): void;
    registerShader(name: string, definition: aframe.Shader): void;
    registerSystem(name: string, definition: aframe.System): void;
  }

  const AFRAME: AFrame;
  export = AFRAME;
}

// Extend global window object for A-Frame
declare global {
  interface Window {
    AFRAME: typeof import("aframe");
  }
}

// AR.js specific declarations
declare module "ar.js" {
  interface ARjsContext {
    arController: any;
    initialized: boolean;
  }

  interface ARjsMarker {
    id: number;
    type: string;
    patternUrl?: string;
    barcodeValue?: number;
  }
}
