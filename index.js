import { ObjectPainter } from './boilerplate.js';

function Painter(){
    this.init = () => {
        const canvas = document.querySelector('#c');
        const angleInDegree = 0;
        const objectStatus = {
            geometry : [
                -150, -100,
                150, -100,
                -150,  100,
                150, -100,
                -150,  100,
                150,  100
            ],
            color : [
                Math.random(),Math.random(),Math.random(), 1,
                Math.random(),Math.random(),Math.random(), 1,
                Math.random(),Math.random(),Math.random(), 1,
                Math.random(),Math.random(),Math.random(), 1,
                Math.random(),Math.random(),Math.random(), 1,
                Math.random(),Math.random(),Math.random(), 1
            ],
            scale : [ 1, 1],
            angleInRadians : (360 - angleInDegree) * Math.PI / 180,
            translation : {
                x: 200,
                y: 150
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