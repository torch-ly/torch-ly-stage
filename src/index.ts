import initializeLayers from "./layers/layer-manager";
import startZoom from "./zoom/zoom"

import {Torchly} from "torch-ly-js-api";
import Konva from "konva";

export let stage: Konva.Stage;
export let torchly: Torchly;

export function initializeStage (pTorchly: Torchly, container: any) {

    torchly = pTorchly;

    let stageDiv = document.createElement('div');
    stageDiv.setAttribute("id", "stage");

    let containerObject = document.getElementById(container);

    containerObject?.appendChild(stageDiv);

    // prevent right click on the stage
    containerObject?.addEventListener('contextmenu', event => event.preventDefault());

    let width = document.getElementById(container)?.offsetWidth;
    let height = document.getElementById(container)?.offsetHeight;

    stage = new Konva.Stage({
        container,
        width,
        height,
        draggable: true
    });

    /*torchly.characters.add(new Character({
        name: "test",
        _id: "",
        pos: {
            point: {
                x: 0,
                y: 0
            },
            rot: 0,
            size: 1
        },
        players: [],
        details: {notes: "", ac: 0, hp: 0},
        conditions: [],
        token: "https://5e.tools/img/MM/Adult%20Gold%20Dragon.png?v=1.123.0"
    }))*/

    console.log(torchly)

    initializeLayers();
    startZoom();

}
