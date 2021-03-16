
"use strict";

/*** Begin Initialization ***/
export function ObjectPainter(canvas, objectStatus) {
    const locationNames = {
        aPosition: "a_position",
        aColor: "a_color",
        uMatrix: "u_matrix"
    };

    let vertexShader = null;
    let fragmentShader = null;
    let program = null;
    let location = null;
    let positionBuffer = null;
    let colorBuffer = null;
    
    const gl = canvas.getContext("webgl");

    
    this.init = () => {
        //create WebGL Rendering Context
        if (!gl) {
            alert('no webgl');
        }
    
        //Step1. create shaders
        vertexShader = this.createShader("#vertex-shader-2d", gl.VERTEX_SHADER);
        fragmentShader = this.createShader('#fragment-shader-2d', gl.FRAGMENT_SHADER);
        
        //Step2. link those two shaders into a program
        program = this.createProgram();
    
        //Step3. look up the location of the attribute && uniforms && varying
        location = this.createLocations(locationNames),
        //Step4. create buffer
        positionBuffer = this.createBuffer(objectStatus.geometry),
        colorBuffer = this.createBuffer(objectStatus.color)
    };
    
    /**
     * Step1.
     * To get the shader on the GPU, you need
     * Fist, create shader
     * Second, upload the GLSL sources (string type)
     * Third, compile the shaders
     * 
     * @param {string} scriptId - nonjs script id of GLSL source code for the shader
     * @param {string} opt_shaderType - the type of shader between VERTEX_SHADER or FRAGMENT_SHADER
    */
    this.createShader = (scriptId, $opt_shaderType) => {
        //look up the script tag
        const shaderScript = document.querySelector(scriptId);
        if (!shaderScript) {
            console.error("unknown script element" + scriptId);
        }

        const shaderSource = shaderScript.text;
        const opt_shaderType = $opt_shaderType;

        if (!opt_shaderType) {
            if (shaderScript.type === "x-shader/x-vertex") {
                opt_shaderType = gl.VERTEX_SHADER;
            } else if (shaderScript.type === "x-shader/x-fragment") {
                opt_shaderType = gl.FRAGMENT_SHADER;
            } else {
                console.error('check your shader type');
                return;
            }
        }

        //create shader
        const shader = gl.createShader(opt_shaderType);
        //upload source
        gl.shaderSource(shader, shaderSource);
        //compile shader
        gl.compileShader(shader);

        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    };

    /**
     * Step2.
     * After create 2 shaders, 
     * you need to link those 2 shaders into a program
     * 
    */
    this.createProgram = () => {
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

    /**
     * Step3. 
     * look up the location of the attribute & uniform & etc you need
     * 
     * @param {Object} locationNames - location names you defined in shaders
     * 
    */
    this.createLocations = ( locationNames ) => {
        const positionLocation = gl.getAttribLocation( program, locationNames.aPosition);
        const colorLocation = gl.getAttribLocation( program, locationNames.aColor);
        const matrixLocation = gl.getUniformLocation( program, locationNames.uMatrix);

        return {
            positionLocation,
            colorLocation,
            matrixLocation
        }
    }

    /**
        * Step4.
        * to get data from buffers, create buffers.
        * bind points: like internal global variables inside WebGL.
        * You bind a resource to a bind point, then, all other functions refer to the resource throught the bind points.
        * put geometry data into buffer
        * 
        * 'new Float32Array' part creates a new array of 32bit floating point numbers and copies the values from 'positions'.
        * then, 'gl.bufferData' copies the data to the positionBuffer on the GPU.
        * 'gl.STATIC_DRAW' is a hint to WebGL about how we will use the data.
        * so it tells to WebGL, we are not likely to change this data much.
        * 
        * @param {Array} bufferData - an array of data
        */
    this.createBuffer = (bufferData) => {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                ...bufferData
            ]),
            gl.STATIC_DRAW);

        return buffer;
    }

    /*** Begin Rendering ***/
    this.drawScene = () => {

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
        gl.enableVertexAttribArray(location.positionLocation);

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
            gl.vertexAttribPointer(location.positionLocation, size, type, normalize, stride, offset);
        }

        gl.enableVertexAttribArray(location.colorLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        {
            const size = 4;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            //'vertexAttribPointer' binds the 'current ARRAY_BUFFER' to the attribute.
            //so this attribute is bound to 'positionBuffer'
            gl.vertexAttribPointer(location.colorLocation, size, type, normalize, stride, offset);
        }


        //compute the matrices
        //projection: zeroToOne && zeroToTwo && clipSpace && upside down
        let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        matrix = m3.translate(matrix, objectStatus.translation.x, objectStatus.translation.y);
        matrix = m3.rotate(matrix, objectStatus.angleInRadians);
        matrix = m3.scale(matrix, objectStatus.scale[0], objectStatus.scale[1]);
        //set rotate with center

        //set the matrix
        gl.uniformMatrix3fv(location.matrixLocation, false, matrix);

        //tell WebGL to execute GLSL program
        {
            const primitiveType = gl.TRIANGLES;
            const offset = 0;
            const count = 6;        //how many times vertex shader should be executed
            gl.drawArrays(primitiveType, offset, count);
        }


    }
};

