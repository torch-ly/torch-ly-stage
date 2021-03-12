import initializeLayers from "./layers/layer-manager";
import startZoom from "./zoom/zoom"

import {Torchly} from "torch-ly-js-api/dist/src/dataTypes/Torchly";
import {Stage} from "konva/types/Stage";

export let stage: Stage;
export let torchly: Torchly;

export function initializeStage (pTorchly: Torchly, container: any) {

    torchly = pTorchly;

    let stageDiv = document.createElement('div');
    stageDiv.setAttribute("id", "stage");

    document.getElementById(container)?.appendChild(stageDiv);

    let width = document.getElementById(container)?.offsetWidth;
    let height = document.getElementById(container)?.offsetHeight;

    stage = new Stage({
        container,
        width,
        height,
        draggable: true
    });

    initializeLayers();
    startZoom();

}
