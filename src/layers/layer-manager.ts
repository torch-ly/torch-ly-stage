import {stage} from "../index";
import Konva from "konva";

export let layers = {
    grid: new Konva.Layer(),
};

export default function () {
    for (const layer in layers) {
        if (layers.hasOwnProperty(layer)) {
            // @ts-ignore
            stage.add(layers[layer]);
        }
    }
}
