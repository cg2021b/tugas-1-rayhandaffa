//pertambahan bentuknya
const numberInRange = (from, to, increment = 1) => {
    let arr = [];
    for (let i = from; i <= to; i += increment) {
      arr.push(i);
    }
    return arr;
  };
  
//random posisinya
  const randomInRange = (from, to, convertInt = false) => {
    let x = Math.random() * (to - from);
  
    if (convertInt) return Math.floor(x + from);
    return x + from;
  };
  
//cube
  const createCube = (color = Math.random() * 0xffffff) => {
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(3, 3, 3),
      new THREE.MeshPhongMaterial({ color: color })
    );
    cube.click = false;
    cube.name = "cube";
    cube.visible = false;
    cube.coupleColor = color;
    cube.position.x = randomInRange(-20, 20);
    cube.position.y = randomInRange(-20, 20);
    cube.position.z = randomInRange(-20, 20);
    return cube;
  };
  
  //total objectnya di umpamain ada 75 
  const OBJECT_TOTAL = 75;
  let colorSet = numberInRange(0, 1, 1 / (OBJECT_TOTAL / 2));
  let currentColor = 0;
  
//kembarannya pas di click
  const createCouple = () => {
    const randomColor = colorSet[currentColor] * 0xffffff;
    currentColor++;
    const couple = [];
    couple.push(createCube(randomColor), createCube(randomColor));
    return couple;
  };
  