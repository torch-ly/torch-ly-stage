import {stage} from "../index";
import drawGrid from "./grid/init";
import drawCharacters from "./character/init";
import Konva from "konva";
import {moveTransformerToLayer} from "./transformer/init";

export let layers = {
    grid: new Konva.Layer(),
    character: new Konva.Layer(),
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

    drawCharacters();

    // default layer for transformer is temporary the character layer
    moveTransformerToLayer(layers.character);

}
