export type Color = CanvasFillStrokeStyles['fillStyle'];
export type DataPoint = [number, number, Color?];

export interface ICoxcombOptions {
  sortBy?: "x" | "y";
  reverseOrder?: boolean;
  centerPoint?: [number, number];
  colorPalette?: Color[] 
};

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
  const sumY = data.map(([_, y]) => y).reduce((y,x) => x + y);
  
  let beginAngle = 0;
  let endAngle = 0;
  const radLen = length/2;
  
  data.forEach((d,i) => {
    const x = d[0], y = d[1], color = d[2];
    beginAngle = endAngle;
    endAngle = endAngle + (y/sumY);

    ctx.beginPath();
    ctx.fillStyle = color 
      || (options && options.colorPalette && options.colorPalette[i % options.colorPalette.length])
      || "gray";
    ctx.arc(length/2, length/2, radLen*(x/maxX),
            2*Math.PI*beginAngle, 2*Math.PI*endAngle);
    ctx.lineTo(length/2, length/2);
    ctx.fill();
  });
}