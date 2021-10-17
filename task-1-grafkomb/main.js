function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

let canvas = document.getElementById('myCanvas');
let gl = canvas.getContext('experimental-webgl');

let vertices = [
	...bg1_samping,
	...bg1_depan,
	...bg1_isi_depan,
	...bg1_isi_samping,
	...bg2_depan,
	...bg2_isi_depan,
	...bg2_samping
];

let vertexShaderCode = `
	attribute vec2 a_position;
	attribute vec4 a_color;
	varying vec4 v_color;
	uniform mat4 u_matrix;
	void main() {
		gl_Position = u_matrix * vec4(a_position, 0, 1.5);
		v_color = a_color;
	}
`;
let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderCode);


let fragmentShaderCode = `
	precision mediump float;
	varying vec4 v_color;
	void main() {
		gl_FragColor = v_color;
	}
`;
let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderCode);

let shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

let coords = gl.getAttribLocation(shaderProgram, "a_position");
var colorLocation = gl.getAttribLocation(shaderProgram, "a_color");

var color = [];

for (let i = 0; i < bg1_samping.length/2; i++) {
	let r = 196/255;
	let g = 192/255;
	let b = 212/255;
	color.push(r);
	color.push(g);
	color.push(b);
	color.push(1);
}
for (let i = 0; i < bg1_depan.length/2; i++) {
	let r = 219/255;
	let g = 219/255;
	let b = 219/255;
	color.push(r);
	color.push(g);
	color.push(b);
	color.push(1);
}
for (let i = 0; i < bg1_isi_samping.length/2; i++) {
	let r = 50/255;
	let g = 60/255;
	let b = 63/255;
	color.push(r);
	color.push(g);
	color.push(b);
	color.push(1);
}
for (let i = 0; i < bg1_isi_depan.length/2; i++) {
	let r = 50/255;
	let g = 60/255;
	let b = 63/255;
	color.push(r);
	color.push(g);
	color.push(b);
	color.push(1);
}
for (let i = 0; i < bg2_samping.length/2; i++) {
	let r = 196/255;
	let g = 192/255;
	let b = 212/255;
	color.push(r);
	color.push(g);
	color.push(b);
	color.push(1);
}
for (let i = 0; i < bg2_depan.length/2; i++) {
	let r = 50/255;
	let g = 60/255;
	let b = 63/255;
	color.push(r);
	color.push(g);
	color.push(b);
	color.push(1);
}
for (let i = 0; i < bg2_isi_depan.length/2; i++) {
	let r = 196/255;
	let g = 192/255;
	let b = 212/255;
	color.push(r);
	color.push(g);
	color.push(b);
	color.push(1);
}

let colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(colorLocation);

let vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
gl.vertexAttribPointer(coords, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(coords);

let dy = 0;
let speed = 0.0227;
function drawScene() {
	dy >= 0.68 ? speed = -speed : speed = speed;
	dy <= -0.72 ? speed = -speed : speed = speed;
	dy += speed;
	gl.useProgram(shaderProgram);
	const leftObject = [
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		-0.5, 0.0, 0.0, 1.0,
	]
		
	const rightObject = [
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, dy, 0.0, 1.0,
	]
		
	gl.clearColor(0.501, 0, 0.125, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	const u_matrix = gl.getUniformLocation(shaderProgram, 'u_matrix');
	gl.uniformMatrix4fv(u_matrix, false, rightObject);
    
    gl.drawArrays(
		gl.TRIANGLES, 
		(bg1_samping.length + bg1_depan.length + bg1_isi_depan.length + bg1_isi_samping.length)/2,
		(bg2_depan.length + bg2_samping.length + bg2_isi_depan.length)/2
	);
		
	gl.uniformMatrix4fv(u_matrix, false, leftObject);
    gl.drawArrays(
		gl.TRIANGLES, 
		0, 
		(bg1_samping.length + bg1_depan.length + bg1_isi_depan.length +bg1_isi_samping.length)/2
	);
	requestAnimationFrame(drawScene);
}

drawScene();