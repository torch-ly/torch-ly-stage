import {stage} from "../index";
import Konva from "konva";
import drawGrid from "./grid/init";

export let layers = {
    grid: new Konva.Layer(),
};

export default function () {

    // add all layers to stage
    for (const layer in layers) {
        if (layers.hasOwnProperty(layer)) {
            // @ts-ignore
            stage.add(layers[layer]);
        }
    }

    // ------------------
    // call init functions of the layers
    // ------------------

    drawGrid();
}
