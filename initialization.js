"use strict";


/*** Begin Initialization ***/
function main() {
    const canvas = document.querySelector('#c');
    //create WebGL Rendering Context
    const gl = canvas.getContext("webgl");
    if (!gl) {
        alert('no webgl');
    }

    const vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
    const fragmentShaderSource = document.querySelector('#fragment-shader-2d').text;

    //Step1. create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    //Step2. link those two shaders into a program
    const program = createProgram(gl, vertexShader, fragmentShader);



    //input for GLSL program
    //Step3. look up the location of the attribute
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const matrixUniformLocation = gl.getUniformLocation(program, "u_matrix");
    const colorUniformLocation = gl.getUniformLocation(program, "u_color");

    //Step4. get data from buffers
    //to get data from buffers, create buffers
    const positionBuffer = gl.createBuffer();
    //bind points: like internal global variables inside WebGL.
    //You bind a resource to a bind point, then, all other functions refer to the resource throught the bind points.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    //put geometry data into buffer
    setGeometry();


    /**setting rectangle location && color */
    //scale
    const scale = [1.5, 1.5];
    //rotation
    // let rotation = {
    //     x: 0,
    //     y: 1,
    // }
    const angleInDegree = 180;
    const angleInRadians = (360 - angleInDegree) * Math.PI / 180;
    // rotation.x = Math.sin(angleInRadians);
    // rotation.y = Math.cos(angleInRadians);

    //translation
    let translation = {
        x: 100,
        y: 150,
    };

    let color = [Math.random(), Math.random(), Math.random(), 1];

    canvas.addEventListener('mousedown', e => {
        e.preventDefault();
        const x = e.offsetX;
        const y = e.offsetY;
        translation.x = x;
        translation.y = y;

        color = [Math.random(), Math.random(), Math.random(), 1];

        drawScene();
    })


    drawScene();

    /*** Begin Rendering ***/
    function drawScene() {

        //Step5. resize the canvas to match its display size
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
        //tell WebGL how to convert from the clip space value (gl_Position) to back into pixel(screen space)
        // -1 +1 clip space maps to 0 ~ gl.canvas.width for x && 0 ~ gl.canvas.height for y
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        //clear the canvas
        // gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        //Step6. tell WebGL to use the program
        gl.useProgram(program);

        //Step 7. tell WebGL how to take data from the buffer and supply it to the attribute
        // 7-1.turn the attribute on
        gl.enableVertexAttribArray(positionAttributeLocation);

        // 7-2. set bind buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // 7-3.tell how to get data out of positionBuffer
        {
            const size = 2;             // 2 components per iteration
            const type = gl.FLOAT;      // the data is 32 bit floats
            const normalize = false;    // don't normalize the data
            const stride = 0;           // 0 = move forward size * sizeof(type) each iteration to get the next position
            const offset = 0;           // start at the beginning of the buffer
            //'vertexAttribPointer' binds the 'current ARRAY_BUFFER' to the attribute.
            //so this attribute is bound to 'positionBuffer'
            gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
        }

        //setting resolution
        // gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
        //translation
        // gl.uniform2fv(translationUniformLocation, [translation.x, translation.y]);
        //rotation
        // gl.uniform2fv(rotationUniformLocation, [rotation.x, rotation.y]);
        //scale
        // gl.uniform2fv(scaleUniformLocation, scale);
        //coloring
        gl.uniform4fv(colorUniformLocation, color);

        //compute the matrices
        //projection: zeroToOne && zeroToTwo && clipSpace && upside down
        let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        matrix = m3.translate(matrix, translation.x, translation.y);
        matrix = m3.rotate(matrix, angleInRadians);
        matrix = m3.scale(matrix, scale[0], scale[1]);
        //set rotate with center
        matrix = m3.translate(matrix, -50, -75 )

        //set the matrix
        gl.uniformMatrix3fv(matrixUniformLocation, false, matrix);

        //tell WebGL to execute GLSL program
        {
            const primitiveType = gl.TRIANGLES;
            const offset = 0;
            const count = 18;        //how many times vertex shader should be executed
            gl.drawArrays(primitiveType, offset, count);
        }


    }

    function setGeometry() {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                // left column
                0, 0,
                30, 0,
                0, 150,
                0, 150,
                30, 0,
                30, 150,

                // top rung
                30, 0,
                100, 0,
                30, 30,
                30, 30,
                100, 0,
                100, 30,

                // middle rung
                30, 60,
                67, 60,
                30, 90,
                30, 90,
                67, 60,
                67, 90,
            ]),
            gl.STATIC_DRAW);
    }


    /**
     * Step1.
     * To get the shader on the GPU, you need
     * Fist, create shader
     * Second, upload the GLSL sources (string type)
     * Third, compile the shaders
    */
    function createShader(gl, type, source) {
        //create shader
        const shader = gl.createShader(type);
        //upload source
        gl.shaderSource(shader, source);
        //compile shader
        gl.compileShader(shader);

        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    /**
     * Step2.
     * After create 2 shaders, 
     * you need to link those 2 shaders into a program
    */
    function createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

}


main();
//put data in that buffer
// const positions = [
//    10, 20,
//    80, 20,
//    10, 30,
//    10, 30,
//    80, 20,
//    80, 30,
// ];

//'new Float32Array' part creates a new array of 32bit floating point numbers and copies the values from 'positions'.
//then, 'gl.bufferData' copies the data to the positionBuffer on the GPU.
//'gl.STATIC_DRAW' is a hint to WebGL about how we will use the data.
//so it tells to WebGL, we are not likely to change this data much.
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

/*** End Initialization ***/
