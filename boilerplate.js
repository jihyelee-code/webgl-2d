
"use strict";

export function ObjectPainter(canvas, objectStatus) {
    this.locationNames = {
        aPosition: "a_position",
        aColor: "a_color",
        uMatrix: "u_matrix"
    };

    this.vertexShader = null;
    this.fragmentShader = null;
    this.program = null;
    this.location = null;
    this.positionBuffer = null;
    this.colorBuffer = null;
    this.objectStatus = objectStatus;
    this.gl = canvas.getContext("webgl");
};

/*** Begin Initialization ***/
ObjectPainter.prototype = {
    init : function () {
        //create WebGL Rendering Context
        if (!this.gl) {
            alert('no webgl');
        }

        //Step1. create shaders
        this.vertexShader = this.createShader("#vertex-shader-2d", this.gl.VERTEX_SHADER);
        this.fragmentShader = this.createShader('#fragment-shader-2d', this.gl.FRAGMENT_SHADER);

        //Step2. link those two shaders into a program
        this.program = this.createProgram();

        //Step3. look up the location of the attribute && uniforms && varying
        this.location = this.createLocations(this.locationNames);
        //Step4. create buffer
        this.positionBuffer = this.createBuffer(this.objectStatus.geometry);
        this.colorBuffer = this.createBuffer(this.objectStatus.color);
    },

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
    createShader : function(scriptId, $opt_shaderType) {
        //look up the script tag
        const shaderScript = document.querySelector(scriptId);
        if (!shaderScript) {
            console.error("unknown script element" + scriptId);
        }

        const shaderSource = shaderScript.text;
        const opt_shaderType = $opt_shaderType;

        if (!opt_shaderType) {
            if (shaderScript.type === "x-shader/x-vertex") {
                opt_shaderType = this.gl.VERTEX_SHADER;
            } else if (shaderScript.type === "x-shader/x-fragment") {
                opt_shaderType = this.gl.FRAGMENT_SHADER;
            } else {
                console.error('check your shader type');
                return;
            }
        }

        //create shader
        const shader = this.gl.createShader(opt_shaderType);
        //upload source
        this.gl.shaderSource(shader, shaderSource);
        //compile shader
        this.gl.compileShader(shader);

        const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        console.log(this.gl.getShaderInfoLog(shader));
        this.gl.deleteShader(shader);
    },

    /**
     * Step2.
     * After create 2 shaders, 
     * you need to link those 2 shaders into a program
     * 
    */
    createProgram: function() {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, this.vertexShader);
        this.gl.attachShader(program, this.fragmentShader);
        this.gl.linkProgram(program);

        const success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
        if (success) {
            return program;
        }

        console.log(this.gl.getProgramInfoLog(program));
        this.gl.deleteProgram(program);
    },

    /**
    * Step3. 
    * look up the location of the attribute & uniform & etc you need
    * 
    * @param {Object} locationNames - location names you defined in shaders
    * 
   */
    createLocations: function(locationNames) {
        const positionLocation = this.gl.getAttribLocation(this.program, locationNames.aPosition);
        const colorLocation = this.gl.getAttribLocation(this.program, locationNames.aColor);
        const matrixLocation = this.gl.getUniformLocation(this.program, locationNames.uMatrix);

        return {
            positionLocation,
            colorLocation,
            matrixLocation
        }
    },

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
    createBuffer: function(bufferData) {
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array([
                ...bufferData
            ]),
            this.gl.STATIC_DRAW);

        return buffer;
    },

    /*** Begin Rendering ***/
    drawScene: function() {

        //Step5. resize the canvas to match its display size
        webglUtils.resizeCanvasToDisplaySize(this.gl.canvas);
        //tell WebGL how to convert from the clip space value (gl_Position) to back into pixel(screen space)
        // -1 +1 clip space maps to 0 ~ gl.canvas.width for x && 0 ~ gl.canvas.height for y
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        //clear the canvas
        // gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        //Step6. tell WebGL to use the program
        this.gl.useProgram(this.program);

        //Step 7. tell WebGL how to take data from the buffer and supply it to the attribute
        // 7-1.turn the attribute on
        this.gl.enableVertexAttribArray(this.location.positionLocation);

        // 7-2. set bind buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

        // 7-3.tell how to get data out of positionBuffer
        {
            const size = 2;             // 2 components per iteration
            const type = this.gl.FLOAT;      // the data is 32 bit floats
            const normalize = false;    // don't normalize the data
            const stride = 0;           // 0 = move forward size * sizeof(type) each iteration to get the next position
            const offset = 0;           // start at the beginning of the buffer
            //'vertexAttribPointer' binds the 'current ARRAY_BUFFER' to the attribute.
            //so this attribute is bound to 'positionBuffer'
            this.gl.vertexAttribPointer(this.location.positionLocation, size, type, normalize, stride, offset);
        }

        // this.gl.enableVertexAttribArray(this.location.colorLocation);

        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        // {
        //     const size = 4;
        //     const type = this.gl.FLOAT;
        //     const normalize = false;
        //     const stride = 0;
        //     const offset = 0;
        //     //'vertexAttribPointer' binds the 'current ARRAY_BUFFER' to the attribute.
        //     //so this attribute is bound to 'positionBuffer'
        //     this.gl.vertexAttribPointer(this.location.colorLocation, size, type, normalize, stride, offset);
        // }

        //compute the matrices
        //projection: zeroToOne && zeroToTwo && clipSpace && upside down
        let matrix = m3.projection(this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
        matrix = m3.translate(matrix, this.objectStatus.centeringPosition.x, this.objectStatus.centeringPosition.y);
        matrix = m3.rotate(matrix, this.objectStatus.angleInRadians);
        matrix = m3.scale(matrix, this.objectStatus.scale[0], this.objectStatus.scale[1]);
        matrix = m3.translate(matrix, this.objectStatus.centeringRotation.x, this.objectStatus.centeringRotation.y);
        //set rotate with center

        //set the matrix
        this.gl.uniformMatrix3fv(this.location.matrixLocation, false, matrix);

        //tell WebGL to execute GLSL program
        {
            const primitiveType = this.gl.TRIANGLES;
            const offset = 0;
            const count = 18;        //how many times vertex shader should be executed
            this.gl.drawArrays(primitiveType, offset, count);
        }
    }
};