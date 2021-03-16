import {stage} from "../index";
import {zoomEnabled, zoomScaleFactor} from "../config/config.json"
import {getCenter, getDistance, setZoomFactor} from "./functions";

export default function () {

    // zoom with mouse wheel
    stage.on("wheel", (e) => {
        e.evt.preventDefault();

        // dont zoom if it is disabled or stage cant be dragged
        if (!stage.draggable() || !zoomEnabled) return;

        // check if zomming in or out
        if (e.evt.deltaY > 0)
            // zoom in
            setZoomFactor(zoomScaleFactor);
        else
            // zoom out
            setZoomFactor(2 - zoomScaleFactor);

    });

    // last center point between fingers
    let lastCenter: { x: any; y: any; } | null;

    // distance between fingers
    let lastDist = 0;

    // zoom with pitch to zoom
    stage.on("touchmove", function (e) {
        e.evt.preventDefault();

        // dont zoom if it is disabled or stage cant be dragged
        if (!stage.draggable() || !zoomEnabled) return;

        // save position of both fingers
        let touch1 = e.evt.touches[0];
        let touch2 = e.evt.touches[1];

        // dont zoom if only one finger is on stage
        if (touch1 && touch2) {

            if (stage.isDragging())
                stage.stopDrag();

            let p1 = {
                x: touch1.clientX,
                y: touch1.clientY,
            };
            let p2 = {
                x: touch2.clientX,
                y: touch2.clientY,
            };

            if (!lastCenter) {
                lastCenter = getCenter(p1, p2);
                return;
            }

            let newCenter = getCenter(p1, p2);

            let dist = getDistance(p1, p2);

            if (!lastDist)
                lastDist = dist;

            // local coordinates of center point
            let pointTo = {
                x: (newCenter.x - stage.x()) / stage.scaleX(),
                y: (newCenter.y - stage.y()) / stage.scaleX(),
            };

            let scale = stage.scaleX() * (dist / lastDist);

            stage.scaleX(scale);
            stage.scaleY(scale);

            // calculate new position of the stage
            let dx = newCenter.x - lastCenter.x;
            let dy = newCenter.y - lastCenter.y;

            let newPos = {
                x: newCenter.x - pointTo.x * scale + dx,
                y: newCenter.y - pointTo.y * scale + dy,
            };

            stage.position(newPos);
            stage.batchDraw();

            lastDist = dist;
            lastCenter = newCenter;
        }
    });

    stage.on("touchend", function () {
        lastDist = 0;
        lastCenter = null;
    });
}
