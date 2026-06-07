const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");

navToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
});

const canvas = document.querySelector("#spiceCanvas");

if (canvas && window.THREE) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  const shapes = [];
  const palette = [0xc58b35, 0xa34e2f, 0x214d3b, 0xf3d08a];

  camera.position.z = 22;

  const resize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };

  for (let i = 0; i < 34; i += 1) {
    const geometry = i % 2 === 0 ? new THREE.TorusGeometry(0.22, 0.055, 8, 18) : new THREE.IcosahedronGeometry(0.23, 0);
    const material = new THREE.MeshBasicMaterial({
      color: palette[i % palette.length],
      transparent: true,
      opacity: 0.18,
    });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 18, -Math.random() * 12);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    mesh.userData.speed = 0.0016 + Math.random() * 0.003;
    shapes.push(mesh);
    scene.add(mesh);
  }

  const animate = () => {
    shapes.forEach((shape, index) => {
      shape.rotation.x += shape.userData.speed;
      shape.rotation.y += shape.userData.speed * 1.4;
      shape.position.y += Math.sin(Date.now() * 0.0003 + index) * 0.0015;
    });
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
  };

  resize();
  animate();
  window.addEventListener("resize", resize);
}
