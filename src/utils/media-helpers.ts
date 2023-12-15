//  Helper function to get an HTML audio element
export const getAudioElement = (id: string): HTMLAudioElement => {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLAudioElement)) {
    throw new Error(`Element "${id}" not found or not an audio element.`);
  }
  return el;
};

//  Helper function to get an HTML video element
export const getVideoElement = (id: string): HTMLVideoElement => {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLVideoElement)) {
    throw new Error(`Element "${id}" not found or not a video element.`);
  }
  return el;
};
