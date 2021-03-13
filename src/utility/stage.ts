import {stage} from "../index";
import Konva from "konva";

// returns the point of the current mouse position relative to (0,0)
export function getRelativePosition(): Konva.Vector2d {
    // the function will return pointer position relative to the passed node
    let transform = stage.getAbsoluteTransform().copy();

    // to detect relative position we need to invert transform
    transform.invert();

    // get pointer (say mouse or touch) position
    let pos = stage.getStage().getPointerPosition();

    // now we find relative point
    return transform.point(<Konva.Vector2d>pos);
}
