import {layers} from "../layer-manager";
import {stage} from "../../index";
import {fieldSize, gridOutsizePercentage} from "../../config.json";
import Konva from "konva";

// local reference of the grid layer
let layer: Konva.Layer;

// caching a line is more performant than adding new ones each time
let line = new Konva.Line({
    points: [],
    stroke: "rgba(190,190,190,0.8)",
    dash: [ 2, 10 ],
    lineCap: "round",
    strokeWidth: 2,
    listening: false
});

line.cache();

// variables contain information about the current dimension of the stage
let startX: number, endX: number, startY: number, endY: number;

export default function () {

    layer = layers.grid;

    // draw lines first time
    updateGrid();

    // redraw lines if stage was moved
    stage.on('dragend', updateGrid);

}

// calculate position of the grid lines and draw them
function updateLines() {

    // dont draw grid if zoomed out to wide
    if (Math.pow(stage.scaleX(), -1) > 10) return;

    // calculate coordinates of the top left corner of the stage
    let transform = stage.getAbsoluteTransform().copy().invert();
    let topLeftCorner = transform.point({
        x: 0,
        y: 0
    });

    // calculate the width and height of the grid
    calculatePoints(topLeftCorner);

    // draw horizontal and vertical lines
    createLines(startX, endX, true);
    createLines(startY, endY, false);

}

// calculate and save the current dimensions of the bord
function calculatePoints(corner: {x: number, y: number}) {

    startX = Math.floor((corner.x - stage.width() * gridOutsizePercentage * Math.pow(stage.scaleX(), -1)) / fieldSize) * fieldSize;
    endX = Math.floor((corner.x + stage.width() * (1 + gridOutsizePercentage) * Math.pow(stage.scaleX(), -1)) / fieldSize) * fieldSize;

    startY = Math.floor((corner.y - stage.height() * gridOutsizePercentage * Math.pow(stage.scaleY(), -1)) / fieldSize) * fieldSize;
    endY = Math.floor((corner.y + stage.height() * (1 + gridOutsizePercentage) * Math.pow(stage.scaleY(), -1)) / fieldSize) * fieldSize;

}

// draw lines
function createLines(start: number, end: number, horizontalLines: boolean) {
    let clone;

    for (let n = start; n < end; n += fieldSize) {
        clone = line.clone({
            points: horizontalLines ? [ n, startY, n, endY ] : [ startX, n, endX, n ]
        });

        // some config options to improve performance
        clone.perfectDrawEnabled(false);
        clone.shadowForStrokeEnabled(false);
        clone.transformsEnabled("position");

        layer.add(clone);
    }
}

// remove all grid lines and redraw //TODO lock if this function is still necessary
export function updateGrid() {
    layer.destroyChildren();
    updateLines();
    layer.batchDraw();
}
