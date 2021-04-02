import { ObjectPainter } from './boilerplate.js';

function Painter(){
    this.init = () => {
        const canvas = document.querySelector('#c');
        const angleInDegree = 0;
        const objectStatus = {
            geometry : [
                // left column
                0, 0, 0,
                30, 0, 0,
                0, 150, 0,
                0, 150, 0,
                30, 0, 0,
                30, 150, 0,

                // top rung
                30, 150, 0,
                30, 120, 0,
                100, 120, 0,
                100, 120, 0,
                100, 150, 0,
                30, 150, 0,

                // middle rung
                30, 60, 0,
                67, 60, 0,
                30, 90, 0,
                30, 90, 0,
                67, 60, 0,
                67, 90, 0,
            ],
            color : [
                Math.random(),Math.random(),Math.random(), 1,
                Math.random(),Math.random(),Math.random(), 1,
                Math.random(),Math.random(),Math.random(), 1,
                Math.random(),Math.random(),Math.random(), 1,
                Math.random(),Math.random(),Math.random(), 1,
                Math.random(),Math.random(),Math.random(), 1,
                Math.random(),Math.random(),Math.random(), 1,
                Math.random(),Math.random(),Math.random(), 1,
                Math.random(),Math.random(),Math.random(), 1,
                Math.random(),Math.random(),Math.random(), 1,
                Math.random(),Math.random(),Math.random(), 1,
                Math.random(),Math.random(),Math.random(), 1,
                Math.random(),Math.random(),Math.random(), 1,
                Math.random(),Math.random(),Math.random(), 1,
                Math.random(),Math.random(),Math.random(), 1,
                Math.random(),Math.random(),Math.random(), 1,
                Math.random(),Math.random(),Math.random(), 1,
                Math.random(),Math.random(),Math.random(), 1,
            ],
            scale : [ 1, 1],
            angleInRadians : ( angleInDegree) * Math.PI / 180,
            //setting center on screen
            centeringPosition : {
                x: canvas.clientWidth/2 ,
                y: canvas.clientHeight/2
            },
            //setting center of rotation
            centeringRotation : {
                x: -50,
                y: -75
            },
            rotation: {
    
            }
        };

        
        const objectPainter = new ObjectPainter(canvas, objectStatus);
        objectPainter.init();
        objectPainter.drawScene();
    };

}

const painter = new Painter();
painter.init();

document.querySelector('#translateZ').addEventListener('input', e=> {
    const value = e.target.value;
    const label = e.target.nextElementSibling;
    label.textContent = value;
})