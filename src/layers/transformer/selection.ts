import Konva from "konva";
import {getRelativePosition} from "../../utility/stage";
import {setTransformerNodes} from "./init";
import {stage} from "../../index";

let selectionRect: Konva.Rect;

let layer: Konva.Layer;

function createSelectionRectangle() {

    // create the actual rectangle
    selectionRect = new Konva.Rect({
        fill: "rgba(0,0,255,0.5)",
        visible: false
    });

    layer.add(selectionRect);

    // top left and bottom right point of the selection rect
    // which on is which depends on the mousemove
    let pointOne: Konva.Vector2d, pointTwo: Konva.Vector2d;

    // save mousedown point for selection rect
    stage.on("mousedown", e => {

        // only start selection rect if right mouse button ist pressed
        if (e.evt.button !== 2)
            return;

        // save first point of the rectangle
        pointOne = getRelativePosition();

        // manage parameters of rect
        selectionRect.visible(true);
        selectionRect.width(0);
        selectionRect.height(0);
        selectionRect.moveToTop();

    });

    // second point of the selection rect sticks to mouse
    stage.on("mousemove", () => {

        // if the rect is not visible there is no first point
        if (!selectionRect.visible())
            return;

        // save second point of the rectangle
        pointTwo = getRelativePosition();

        // create rectangle
        selectionRect.setAttrs({
            x: Math.min(pointOne.x, pointTwo.x),
            y: Math.min(pointOne.y, pointTwo.y),
            width: Math.abs(pointTwo.x - pointOne.x),
            height: Math.abs(pointTwo.y - pointOne.y),
        });

        layer.batchDraw();

    });

    // select all objects within the rectangle
    stage.on("mouseup", (e) => {

        // if the rect is not visible there is no first point
        // then clear selected objects on mouseup
        if (!selectionRect.visible())
            return setTransformerNodes([]);

        // get all shapes on the layer that are nether the transformer nor the selection rect
        let shapes = layer.children.toArray().filter((obj) => !(obj instanceof Konva.Transformer) && obj !== selectionRect);

        // get only relevant information of the selection rect
        let box = selectionRect.getClientRect();

        // get all shapes that are selectable and have at least one point inside the selection rect
        let selected = shapes.filter((shape) =>
            Konva.Util.haveIntersection(box, shape.getClientRect())
        );

        // select all of these shapes
        setTransformerNodes(selected);

        // make the rect invisible again
        selectionRect.visible(false);
        layer.batchDraw();

    });
}

// set the layer of the selection rectangle and crate a new one if no rect exists
export function manageSelectionRectangleLayer(pLayer: Konva.Layer) {
    layer = pLayer;

    if (!selectionRect)
        createSelectionRectangle();

}

