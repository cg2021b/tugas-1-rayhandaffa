
//Yang dipakai ambil dari util
const SELECT = document.querySelector("#seleksi");
const SCORE = document.querySelector("#score");
const PLAY_BUTTON = document.querySelector("#play-button");
const GAMEOVER = document.querySelector("#gameover");

//Canvasnya
const canvas = document.querySelector("canvas.webgl");

//Buat Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("rgb(147, 151, 153)");

//Lightingnya
scene.add(new THREE.DirectionalLight(0xffffff, 0.85));
scene.add(new THREE.AmbientLight(0xffffb, 0.6));

//Ukuran
const sizes = 
{
  width: 0.95 * window.innerWidth,
  height: 0.95 * window.innerHeight,
};

//Pengaturan Camera
const camera = new THREE.PerspectiveCamera(
  80,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 55);

//orbit control
const orbitControls = new THREE.OrbitControls(camera, canvas);
orbitControls.target.set(0, 5, 0);
orbitControls.enableZoom = false;
orbitControls.update();

//Rendernya
const renderer = new THREE.WebGLRenderer({ canvas: canvas,});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//RayCaster
const rayCast = new THREE.Raycaster();

//Mouse
const mouse = new THREE.Vector2();
mouse.x = mouse.y = -1;

//Aksinya
let gameOver = true;
let selected = [];

let spawnSpeed = 0.005;
let bufferSpeed = 0;

let visibles = [];
let notVisibles = numberInRange(2, OBJECT_TOTAL + 1);

//Aksi Mouse - Play Button
PLAY_BUTTON.addEventListener("click", () => 
{
  gameOver = false;
  selected = [];
  spawnSpeed = 0.005;
  bufferSpeed = 0;
  visibles = [];
  currentColor = 0;
  notVisibles = numberInRange(2, OBJECT_TOTAL + 1);

  for (; scene.children.length > 2; ) 
  {
    scene.remove(scene.children[2]);
  }

 //Geometry
  let copBuffer;
  for (let i = 0; i < OBJECT_TOTAL / 2; i++) 
  {
    copBuffer = createCouple();
    scene.add(copBuffer[0]);
    scene.add(copBuffer[1]);
  }

  PLAY_BUTTON.disabled = true;
  SCORE.innerHTML = 0;
  SELECT.innerHTML = 0;
  GAMEOVER.style.display = "none";
});

//resize
window.addEventListener("resize", () =>
{
  // Update sizes
  sizes.width = 0.95 * window.innerWidth;
  sizes.height = 0.95 * window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//Game Over
canvas.addEventListener("click", (e) => 
{
  if (!gameOver) 
  {
    mouse.x = (e.offsetX / sizes.width) * 2 - 1;
    mouse.y = -(e.offsetY / sizes.height) * 2 + 1;
    rayCast.setFromCamera(mouse, camera);

    let items = rayCast.intersectObjects(scene.children, false);
    let selectFirstItem = true;

    items.forEach((item) => {
      if (item.object.visible && !item.object.click && selectFirstItem) 
      {
        selected.push(item.object);
        item.object.material.color.set("rgb(0,0,255)");
        item.object.click = true;
        selectFirstItem = false;
      }
    });

    if (selected.length == 2) 
    {
      if (selected[0].coupleColor == selected[1].coupleColor) 
      {
        
        selected.forEach((select) => 
        {
            console.log("cocok");
            select.visible = false;
            select.material.color.set(select.coupleColor);
            select.click = false;
            for (let i = 2; i <= OBJECT_TOTAL + 1; i++) 
            {
                if (scene.children[i] === select) 
                    {
                        console.log("ketemu");
                        for (let j = 0; j < visibles.length; j++) 
                        {
                         if (visibles[j] == i) {
                         notVisibles.push(visibles.splice(j, 1));
                         break;
                        }
                    }
              break;
            }
          }
        });
        SCORE.innerHTML++;
      } 
      
      else 
      {
        selected.forEach((select) => {
          select.material.color.set(select.coupleColor);
          select.click = false;
        });
      }
      selected = [];
    }
    SELECT.innerHTML = selected.length;
  }
});

//Fungsi MainLoop --> kek jalan terus gitu
const mainLoop = () => {
  if (!gameOver) bufferSpeed += spawnSpeed;
  if (bufferSpeed >= 1 && notVisibles.length) 
  {
    let spawnIndex = notVisibles.splice(
      randomInRange(0, notVisibles.length - 1),
      1
    );

    visibles.push(...spawnIndex);
    scene.children[spawnIndex].visible = true;

    bufferSpeed = 0;
    spawnSpeed += 0.0001;
  }

  if (visibles.length == OBJECT_TOTAL) 
  {
    gameOver = true;
    PLAY_BUTTON.disabled = false;
    GAMEOVER.style.display = "block";
  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(mainLoop);
};

mainLoop();
