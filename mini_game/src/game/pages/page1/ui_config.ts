export const getInitEjectArea = (canvasWidth: number, canvasHeight: number) => {
  const scaledWidth = Math.round((50 * canvasWidth) / 375);
  const scaledHeight = Math.round((200 * canvasHeight) / 667);
  return {
    x: canvasWidth - scaledWidth,
    y: canvasHeight - scaledHeight,
    width: scaledWidth,
    height: scaledHeight,
  };
};

export const getPlayButtonArea = (
  canvasWidth: number,
  canvasHeight: number
) => {
  const scaledWidth = Math.round((40 * canvasWidth) / 375);
  const scaledHeight = Math.round((40 * canvasHeight) / 667);

  const scaledWDistance = Math.round((5 * canvasHeight) / 667);
  const scaledHDistance = Math.round((220 * canvasHeight) / 667);

  return {
    x: canvasWidth - scaledWidth - scaledWDistance,
    y: canvasHeight - scaledHeight - scaledHDistance,
    width: scaledWidth,
    height: scaledHeight,
  };
};
