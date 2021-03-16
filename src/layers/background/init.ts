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

    // initial creation of konva objects
    torchly.background.array.forEach((obj) => updateOrCreateBackgroundObject(obj));

    // update konva objects on change
    torchly.background.subscribeChanges((obj: Background) => updateOrCreateBackgroundObject(obj));
}

function updateOrCreateBackgroundObject(object: Background) {

    // background objects can have different types and therefore different creation methods
    if (object.type === "image")
        updateOrCreateBackgroundImage(<TImage>object);
}

function updateOrCreateBackgroundImage(image: TImage) {

    // find old image if it exists
    let oldKonvaImage = <Konva.Image>layer.findOne("#" + image._id);

    if (oldKonvaImage) { // update existing character

        // reset transformations to make updating attributes more easy
        oldKonvaImage.setAttrs({
            rotation: 0,
            scaleX: 1,
            scaleY: 1
        });

        // update attributes
        oldKonvaImage.setAttrs({
            x: image.point.x * fieldSize,
            y: image.point.y * fieldSize,
            width: image.width,
            height: image.height,
            rotation: image.rot,
        });

        layer.batchDraw();

    } else { // create new konva character

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

            // manage transformer on click
            konvaObject.on("click", (ev) => {

                // if the current layer is not this layer do not activate the transformer
                if (currentLayer !== backgroundLayer) return;

                ev.cancelBubble = true;
                setTransformerNodes([konvaObject]);
            });

            // update image position when dropped
            konvaObject.on("dragend", () => {
                image.setPosition({
                    x: Math.round(konvaObject.x() / fieldSize),
                    y: Math.round(konvaObject.y() / fieldSize)
                });
            });

            // update object when rotated or resized
            konvaObject.on("transformend", () => {

                // this makes the following calculation of the width much more easy
                let pastRot = konvaObject.rotation();
                konvaObject.rotation(0);

                // save the current width and of the object
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
