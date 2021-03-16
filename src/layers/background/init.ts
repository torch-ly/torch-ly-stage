import Konva from "konva";
import {layers} from "../layer-manager";
import {Background, Image as TImage} from "torch-ly-js-api";
import {torchly} from "../../index";
import {fieldSize, layer as currentLayer} from "../../config/config.json";
import {background as backgroundLayer} from "../../config/layer.json";
import {setTransformerNodes} from "../transformer/init";

let layer: Konva.Layer;

export default function () {
    layer = layers.background;

    torchly.background.array.forEach((obj) => updateOrCreateBackgroundObject(obj));

    torchly.background.subscribeChanges((obj: Background) => updateOrCreateBackgroundObject(obj));
}

function updateOrCreateBackgroundObject(object: Background) {
    if (object.type === "image")
        updateOrCreateBackgroundImage(<TImage>object);
}

function updateOrCreateBackgroundImage(image: TImage) {

    let oldKonvaImage = <Konva.Image>layer.findOne("#" + image._id);

    if (oldKonvaImage) {

        oldKonvaImage.setAttrs({
            rotation: 0,
            scaleX: 1,
            scaleY: 1
        });

        oldKonvaImage.setAttrs({
            x: image.point.x * fieldSize,
            y: image.point.y * fieldSize,
            width: image.width,
            height: image.height,
            rotation: image.rot,
        });

        layer.batchDraw();

    } else {

        let imageObj = new Image(image.width, image.height);

        imageObj.onload = function () {
            let konvaObject = new Konva.Image({
                x: image.point.x * fieldSize,
                y: image.point.y * fieldSize,
                width: image.width,
                height: image.height,
                image: imageObj,
                rotation: image.rot,
                id: image._id
            });

            layer.add(konvaObject);
            layer.batchDraw();

            konvaObject.on("click", (ev) => {
                if (currentLayer !== backgroundLayer) return;
                ev.cancelBubble = true;
                setTransformerNodes([konvaObject]);
            });

            konvaObject.on("dragend", () => {
                image.setPosition({
                    x: Math.round(konvaObject.x() / fieldSize),
                    y: Math.round(konvaObject.y() / fieldSize)
                });
            });

            konvaObject.on("transformend", () => {

                // this makes the following calculation of the width much more easy
                let pastRot = konvaObject.rotation();
                konvaObject.rotation(0);

                // save the current width of the character
                let width = konvaObject.width() * konvaObject.getTransform().getMatrix()[0];
                let height = konvaObject.height() * konvaObject.getTransform().getMatrix()[3];

                console.log(konvaObject.getTransform().getMatrix())

                // only update rotation or size when the rely changed
                if (image.rot !== pastRot)
                    image.setRotation(pastRot)
                else if (image.width !== width || image.height !== height)
                    image.setSize(width, height);
            });

        };

        imageObj.src = image.url;
    }
}
