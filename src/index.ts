import Konva from "konva";

export let stage: Konva.Stage;

export function initializeStage (torchly: any, container: any) {

    let stageDiv = document.createElement('div');
    stageDiv.setAttribute("id", "stage");

    document.getElementById(container)?.appendChild(stageDiv);

    let width = document.getElementById(container)?.offsetWidth;
    let height = document.getElementById(container)?.offsetHeight;

    stage = new Konva.Stage({
        container,
        width,
        height,
        draggable: true
    });

}
