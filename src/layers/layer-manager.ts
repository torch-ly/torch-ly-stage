import {stage} from "../index";
import drawGrid from "./grid/init";
import {Layer} from "konva/types/Layer";

export let layers = {
    grid: new Layer(),
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
