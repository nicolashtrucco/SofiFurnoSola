/** Detección simple de dispositivo para elegir modelo 3D y efectos. */
export const isMobileViewport = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

export const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
