/// <reference types="vite/client" />

declare module '*.svg?raw' {
  const value: string;
  export default value;
}

declare module '*.htm?raw' {
  const value: string;
  export default value;
}

declare module '*.cshtml?raw' {
  const value: string;
  export default value;
}

interface Window {
  setFavoriteCount: (count: string | number) => void;
  setCartCount: (count: string | number) => void;
  setState: (name: string, value: string) => void;
  renderComponents: () => void;
  getCookie: (name: string) => string | undefined;
}

declare const viteAbsoluteUrl: (path: string, addExtension?: boolean) => string;

interface BasedAtomicModel {
  modifiers?: string[];
  globalModifier?: string[];
  styleModifier?: string[];
  theme?: string;
}

declare const getModifiers: (model: BasedAtomicModel, baseClass: string) => string;

interface RequestParams {
  [key: string]: string | number | boolean | undefined;
}
