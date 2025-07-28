declare module "ar.js/aframe/build/aframe-ar" {
  interface ARContent {
    [key: string]: unknown;
  }
  const content: ARContent;
  export default content;
}
