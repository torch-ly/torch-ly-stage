import {transformerNodes} from "./layers/transformer/init";
import {fieldSize} from "./config/config.json";
import {torchly} from "./index";

export function keyevent(event: KeyboardEvent) {
    console.log(event)

    switch (event.code) {
        case "ArrowRight":
            transformerNodes.forEach(node => torchly.characters.getByID(node.id())?.moveRelative({x: 1, y: 0}));
            break;
        case "ArrowLeft":
            transformerNodes.forEach(node => torchly.characters.getByID(node.id())?.moveRelative({x: -1, y: 0}));
            break;
        case "ArrowUp":
            transformerNodes.forEach(node => torchly.characters.getByID(node.id())?.moveRelative({x: 0, y: -1}));
            break;
        case "ArrowDown":
            transformerNodes.forEach(node => torchly.characters.getByID(node.id())?.moveRelative({x: 0, y: 1}));
            break;
        case "Backspace":
        case "Delete":
            transformerNodes.forEach(node => torchly.characters.getByID(node.id())?.delete());
            break;
    }

}
