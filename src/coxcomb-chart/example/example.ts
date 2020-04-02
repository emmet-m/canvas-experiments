import { Color, DataPoint, drawCoxComb } from "../CoxComb";

// if you want to change to data, do it below in 'sampleData'
// The chart will update
let sampleData: DataPoint[] = [
  [1,10],
  [3,17],
  [9,17],
  [16,20],
  [21,30],
  [2,5],
  [7,30],
  [11,3],
  [14,10],
  [19,10],
];

const colors = ['#CE84AD', '#CE96A6', '#D1A7A0', '#D4CBB3', '#D2E0BF'];
const LENGTH = 500;

const makeRow = (x, y, color?: Color, i = -1) => {
  const row = document.createElement("tr");
  const tx = document.createElement("td");
  tx.innerText = x;
  tx.width = `50px`;
  const ty = document.createElement("td");
  ty.innerText = y;
  ty.width = `50px`;
  if (i != -1) {
    tx.style.color = (color || "red") as string;
    ty.style.color = (color || "red") as string;
  } else {
    tx.style.color = "white";
    ty.style.color = "white";
  }

  row.appendChild(tx);
  row.appendChild(ty);

  return row;
}

const table = document.createElement("table");
table.appendChild(makeRow("X","Y"));

sampleData.forEach((d,i) => {
  table.appendChild(makeRow(d[0], d[1], colors[i % colors.length], i));
});

window.onload = () => {
  const tem = document.createElement('canvas');
  tem.width = LENGTH;
  tem.height = LENGTH;
  tem.id = "graphCanvas"
  document.body.appendChild(tem);
  document.body.appendChild(table);
  drawCoxComb(sampleData, "graphCanvas", LENGTH, {
    sortBy: "x",
    colorPalette: colors,
  });
};