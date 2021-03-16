import {stage} from "../index";
import drawGrid from "./grid/init";
import drawCharacters from "./character/init";
import drawBackground from "./background/init";
import Konva from "konva";
import {moveTransformerToLayer, setTransformerNodes} from "./transformer/init";
import {layer as currentLayer} from "../config/config.json";
import * as LAYER_NAME from "../config/layer.json";

export let layers = {
    grid: new Konva.Layer(),
    background: new Konva.Layer(),
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

    drawBackground();

    // default layer for transformer is temporary the character layer
    switch (currentLayer) {
        case LAYER_NAME.character:
            moveTransformerToLayer(layers.character);
            break;
        case LAYER_NAME.background:
            moveTransformerToLayer(layers.background);
            break;
    }

    // unselect all objects when clicked on stage
    stage.on("click", () => setTransformerNodes([]));

}
