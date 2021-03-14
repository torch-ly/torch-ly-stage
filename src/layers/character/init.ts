import Konva from "konva";
import {layers} from "../layer-manager";
import {torchly} from "../../index";
import {Character} from "torch-ly-js-api";
import {fieldSize} from "../../config.json";
import {setTransformerNodes} from "../transformer/init";

let layer: Konva.Layer;

let konvaCharacters = <Konva.Image[]>[];

export default function () {
    layer = layers.character;

    // ------------------
    // update data of the konva character
    // ------------------

    // on init
    torchly.characters.array.forEach(updateOrCreateCharacter)

    // on change
    torchly.characters.subscribeChanges(updateOrCreateCharacter);
}

// updates the data of an existing konva character or creates a new one
function updateOrCreateCharacter(character: Character) {

    // get the konva object if it exists already
    let oldKonvaCharacter = <Konva.Image>layer.findOne("#" + character._id);

    if (oldKonvaCharacter) { // character already existed

        // reset previous transformation to make calculations more easy
        oldKonvaCharacter.setAttrs({
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            scaleX: 1,
            scaleY: 1
        });

        // set new properties
        oldKonvaCharacter.setAttrs({
            x: (character.pos.point.x * fieldSize) + character.pos.size * fieldSize / 2,
            y: (character.pos.point.y * fieldSize) + character.pos.size * fieldSize / 2,
            width: character.pos.size * fieldSize,
            height: character.pos.size * fieldSize,
            offsetX: character.pos.size * fieldSize / 2,
            offsetY: character.pos.size * fieldSize / 2,
            rotation: character.pos.rot,
        });

        layer.batchDraw();

    } else { // character dose not exist yet

        let imageObj = new Image(character.pos.size * fieldSize, character.pos.size * fieldSize);

        // TODO: Add this code
        // imageObj.onerror = () => {
        //     imageObj.src = "/no-image.jpg";
        // };

        imageObj.onload = function () {

            // create new token
            let image = new Konva.Image({
                x: Math.floor(character.pos.point.x * fieldSize),
                y: Math.floor(character.pos.point.y * fieldSize),
                image: imageObj,
                rotation: character.pos.rot,
                id: String(character._id)
            });

            // offsets to make snap to grid more easy
            image.x(image.x() + image.width() / 2);
            image.y(image.y() + image.height() / 2);

            image.offsetX(image.width() / 2);
            image.offsetY(image.height() / 2);

            // update position when dropped
            image.on("dragend", () => {
                character.setPosition({
                    x: Math.round((image.x() - image.width() / 2) / fieldSize),
                    y: Math.round((image.y() - image.height() / 2) / fieldSize)
                });
            });

            // select token on click and make it draggable
            image.on("click", (ev) => {
                ev.cancelBubble = true;
                setTransformerNodes([image])
            });

            image.on("transformend", () => {

                // this makes the following calculation of the width much more easy
                let pastRot = image.rotation();
                image.rotation(0);

                // save the current width of the character
                let width = image.width() * image.getTransform().getMatrix()[0];

                // only update rotation or size when the rely changed
                if (character.pos.rot !== pastRot || character.pos.size !== width)
                    character.setAttrs(pastRot, Math.round(width / fieldSize));
            });

            layer.add(image);
            layer.batchDraw();

            konvaCharacters.push(image);
        };

        // load image
        imageObj.src = character.token;
    }
}
