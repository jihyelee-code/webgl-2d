import { ObjectPainter } from './boilerplate.js';

function Painter(){
    this.init = () => {
        const canvas = document.querySelector('#c');
        const angleInDegree = 0;
        const objectStatus = {
            geometry : [
                // // left column
                // 0, 0, 0,
                // 30, 0, 0,
                // 0, 150, 0,
                // 0, 150, 0,
                // 30, 0, 0,
                // 30, 150, 0,

                // // top rung
                // 30, 150, 0,
                // 30, 120, 0,
                // 100, 120, 0,
                // 100, 120, 0,
                // 100, 150, 0,
                // 30, 150, 0,

                // // middle rung
                // 30, 60, 0,
                // 67, 60, 0,
                // 30, 90, 0,
                // 30, 90, 0,
                // 67, 60, 0,
                // 67, 90, 0,

                -1.0, -1.0,  1.0,
                1.0, -1.0,  1.0,
                1.0,  1.0,  1.0,
               -1.0,  1.0,  1.0,
             
               // 뒤면(Back face)
               -1.0, -1.0, -1.0,
               -1.0,  1.0, -1.0,
                1.0,  1.0, -1.0,
                1.0, -1.0, -1.0,
             
               // 위면(Top face)
               -1.0,  1.0, -1.0,
               -1.0,  1.0,  1.0,
                1.0,  1.0,  1.0,
                1.0,  1.0, -1.0,
             
               // 아래면(Bottom face)
               -1.0, -1.0, -1.0,
                1.0, -1.0, -1.0,
                1.0, -1.0,  1.0,
               -1.0, -1.0,  1.0,
             
               // 오른쪽면(Right face)
                1.0, -1.0, -1.0,
                1.0,  1.0, -1.0,
                1.0,  1.0,  1.0,
                1.0, -1.0,  1.0,
             
               // 왼쪽면(Left face)
               -1.0, -1.0, -1.0,
               -1.0, -1.0,  1.0,
               -1.0,  1.0,  1.0,
               -1.0,  1.0, -1.0
            ] ,
            color : [
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


        var colors = [
            [1.0,  1.0,  1.0,  1.0],    // 앞면 : 흰색
            [1.0,  0.0,  0.0,  1.0],    // 뒤면 : 빨간색
            [0.0,  1.0,  0.0,  1.0],    // 위면 : 녹색
            [0.0,  0.0,  1.0,  1.0],    // 아래면 : 파란색
            [1.0,  1.0,  0.0,  1.0],    // 오른쪽면 : 노란색
            [1.0,  0.0,  1.0,  1.0]     // 왼쪽면 : 보라색
          ];
          
          
        //   for (var j=0; j<6; j++) {
        //     var c = colors[j];
          
        //     for (var i=0; i<4; i++) {
        //       objectStatus.color = objectStatus.color.concat(c);
        //     }
        //   }
          
        
        const objectPainter = new ObjectPainter(canvas, objectStatus);
        objectPainter.init();
        objectPainter.drawScene();
    };

}

const painter = new Painter();
painter.init();