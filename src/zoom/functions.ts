import {stage} from "../index";
import {updateGrid} from "../layers/grid/init";

export function setZoomFactor(factor: number) {
    let oldScale = stage.scaleX();

    let pointer = stage.getPointerPosition();

    if (!pointer) return;

    let newScale = oldScale * factor;

    let mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
    };

    stage.scale({
        x: newScale,
        y: newScale
    });

    let newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);

    updateGrid();
    stage.batchDraw();
}

export function getDistance(p1: {x: number, y: number}, p2: {x: number, y: number}): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

export function getCenter(p1: {x: number, y: number}, p2: {x: number, y: number}): {x: number, y: number} {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
    };
}
