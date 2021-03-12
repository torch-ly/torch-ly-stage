import Konva from "konva";
import {layers} from "../layer-manager";
import {torchly} from "../../index";
import {Character} from "torch-ly-js-api";
import {fieldSize} from "../../config.json";

let layer: Konva.Layer;

let konvaCharacters = <Konva.Image[]>[];

export default function () {
    layer = layers.character;

    torchly.characters.array.forEach(updateOrCreateCharacter)

    torchly.characters.subscribeChanges(updateOrCreateCharacter);
}

function updateOrCreateCharacter(character: Character) {
    let oldKonvaCharacter = layer.findOne("#" + character._id);

    if (oldKonvaCharacter) {

        oldKonvaCharacter.setPosition({x: character.pos.point.x, y: character.pos.point.y});
        oldKonvaCharacter.rotation(character.pos.rot);

    } else {

        let imageObj = new Image(character.pos.size * fieldSize, character.pos.size * fieldSize);

        // TODO: Add this code
        // imageObj.onerror = () => {
        //     imageObj.src = "/no-image.jpg";
        // };

        imageObj.onload = function () {
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

            layer.add(image);
            layer.batchDraw();

            konvaCharacters.push(image);
        };

        imageObj.src = character.token;
    }
}
