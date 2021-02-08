export const getInitEjectArea = (canvasWidth: number, canvasHeight: number) => {
  const scaledWidth = Math.round((50 * canvasWidth) / 375);
  const scaledHeight = Math.round((200 * canvasWidth) / 375);
  return {
    x: canvasWidth - scaledWidth,
    y: canvasHeight - scaledHeight,
    width: scaledWidth,
    height: scaledHeight,
  };
};
