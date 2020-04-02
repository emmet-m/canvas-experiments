export type Color = CanvasFillStrokeStyles['fillStyle'];

/**
 * A data point with an x and y value, and optionally a color
 */
export type DataPoint = [number, number, Color?];

export interface ICoxcombOptions {
  /**
   * Sort data points before rendering chart, by either the x or y data point
   */
  sortBy?: "x" | "y";

  /**
   * Sort in reverse order? False by default
   */
  reverseOrder?: boolean;

  /**
   * Specify a center point to draw the chart from
   */
  centerPoint?: [number, number];

  /**
   * A color palette to cycle over for each data point
   * If a data point has a specified color, that takes preference
   */
  colorPalette?: Color[]
};

/**
 * Draws a coxcomb chart on a HTML canvas element
 * @param data the list of data points to draw
 * @param id The id of a canvas element
 * @param length the length of the chart
 * @param options optional values for drawing the chart
 */
export const drawCoxComb = (data: DataPoint[], id: string, length: number, options?: ICoxcombOptions) => {

  // Sort data if requested
  if (options && options.sortBy) {
    const cmp = ([x1, y1], [x2, y2]) => {
      let a = options.sortBy === "x" ? x1 : y1,
        b = options.sortBy === "x" ? x2 : y2;

      if (options.reverseOrder)
        return a - b;

      return b - a;
    };

    data = data.sort(cmp);
  }

  const canvas = document.getElementById(id) as HTMLCanvasElement;
  if (!canvas) {
    console.error(`Unable to find canvas element with id '${id}'`);
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error(`Unable to fetch 2d context from canvas with id '${id}'`);
    return;
  }

  const maxX = Math.max(...data.map(([x, _]) => x));
  const sumY = data.map(([_, y]) => y).reduce((y, x) => x + y, 0);

  let beginAngle = 0;
  let endAngle = 0;
  const radLen = length / 2;

  data.forEach((d, i) => {
    const x = d[0], y = d[1], color = d[2];
    beginAngle = endAngle;
    endAngle = endAngle + (y / sumY);

    ctx.beginPath();
    ctx.fillStyle = color
      || (options && options.colorPalette && options.colorPalette[i % options.colorPalette.length])
      || "gray";

    let centerX;
    if (options?.centerPoint)
      centerX = options.centerPoint[0];
    else
      centerX = length/2;

    let centerY;
    if (options?.centerPoint)
      centerY = options.centerPoint[1];
    else
      centerY = length/2;

    ctx.arc(centerX, centerY,
      radLen * (x / maxX),
      2 * Math.PI * beginAngle,
      2 * Math.PI * endAngle);

    ctx.lineTo(centerX, centerY);
    ctx.fill();
  });
}