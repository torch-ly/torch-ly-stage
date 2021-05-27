import Konva from "konva";
import {layers} from "../layer-manager";
import {stage, torchly} from "../../index";
import {fieldSize} from "../../config/config.json";
import {getRelativePosition} from "../../utility/stage";

let layer: Konva.Layer;

export default function () {
    layer = layers.info;

    torchly.measurement.on("pointTo", () => {
        if (torchly.measurement.pointToData)
            point(torchly.measurement.pointToData);
    });

    stage.on("dblclick", () => {
        torchly.measurement.pointTo({point: getRelativePosition(), color: "green"})
    });
}

function point(data: {point: {x: number, y: number}, color: string}) {
    let circle = new Konva.Circle({
        x: data.point.x,
        y: data.point.y,
        radius: 0,
        strokeWidth: 4,
        stroke: data.color,
        listening: false
    });

    layer.add(circle);

    let radius = 1;

    let animation = new Konva.Animation(() => {

        if (radius >= fieldSize * 0.833) {
            animation.stop();
            circle.destroy();
        }

        circle.radius(radius);
        radius++;
    }, layer);

    animation.start();
}
