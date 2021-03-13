import Konva from "konva";
import {manageSelectionRectangleLayer} from "./selection";

// this is the layer on which the transformer acts
let layer: Konva.Layer;

let transformer: Konva.Transformer;

// this contains the currently selected nodes
let transformerNodes = <Konva.Node[]>[];

function createTransformer() {
    transformer = new Konva.Transformer();
}

export function moveTransformerToLayer(pLayer: Konva.Layer) {

    // create a new transformer if no one exists
    if (!transformer)
        createTransformer();

    // update the transformer layer
    layer = pLayer;

    // if the transformer is child of a layer remove it from the layer
    if (transformer.getParent())
        transformer.remove();

    layer.add(transformer);

    // add selection rectangle and selection listeners
    manageSelectionRectangleLayer(layer);

}

export function setTransformerNodes(nodes: Konva.Node[]) {

    // previously selected nodes should not be draggable any more
    for (let node of transformerNodes)
        node.draggable(false);

    // make the new ones draggable and move them in front of the layer
    for (let node of nodes) {
        node.draggable(true);
        node.moveToTop();
    }

    // transformer should be above anything else on
    transformer.moveToTop();

    // update current selected nodes variable
    transformerNodes = nodes;

    transformer.nodes(nodes);

    layer.batchDraw();
}

export function getTransformerLayer(): Konva.Layer {
    return layer;
}
