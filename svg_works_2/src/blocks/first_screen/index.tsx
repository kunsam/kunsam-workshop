import { debounce } from "lodash";
import Head from "next/head";
import React, { useEffect } from "react";
import * as THREE from "three";
import styles from "./index.module.scss";

function Component() {
  useEffect(() => {
    const SEPARATION = 100,
      AMOUNTX = 150,
      AMOUNTY = 150;

    let camera: THREE.PerspectiveCamera,
      scene: THREE.Scene,
      renderer: THREE.WebGLRenderer;
    let particles: THREE.Points<THREE.BufferGeometry>,
      count = 0;
    let mouseX = 0,
      mouseY = 0;

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    let scrollY = window.scrollY;

    function init() {
      const container = document.getElementById("PointsWaveContainer");
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      camera.position.z = 3000;
      camera.position.y = 500;
      camera.position.x = 110;

      scene = new THREE.Scene();
      const numParticles = AMOUNTX * AMOUNTY;
      const positions = new Float32Array(numParticles * 3);
      const scales = new Float32Array(numParticles);
      let i = 0,
        j = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2; // x
          positions[i + 1] = 0; // y
          positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // z

          scales[j] = 1;

          i += 3;
          j++;
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

      const vertexShaderText = `attribute float scale;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = scale * ( 300.0 / - mvPosition.z );
        gl_Position = projectionMatrix * mvPosition;
      }`;
      const fragmentShaderText = `uniform vec3 color;

      void main() {
      
        if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
      
        gl_FragColor = vec4( color, 1.0 );
      
      }`;
      const material = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(0x5618eb) },
        },
        vertexShader: vertexShaderText,
        fragmentShader: fragmentShaderText,
      });
      particles = new THREE.Points(geometry, material);
      scene.add(particles);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);
      container.style.touchAction = "none";
      container.addEventListener("pointermove", onPointerMove, false);
      document.addEventListener("scroll", onscroll, false);
      window.addEventListener("resize", onWindowResize, false);
    }

    function onscroll(e) {
      console.log("window.scrollY", window.scrollY);
      scrollY = window.scrollY;
    }

    function onPointerMove(event) {
      if (event.isPrimary === false) return;

      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    }
    function onWindowResize() {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      requestAnimationFrame(debounce(animate, 30));
      render();
    }

    function render() {
      // camera.position.x += (mouseX - camera.position.x) * 0.05;
      // camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.position.y = 300 - scrollY;
      camera.position.z = 3000 - scrollY * 10;
      // camera.lookAt(scene.position);

      // console.log(scrollY, camera.position.y, "camera.position.y");

      const positions = particles.geometry.attributes.position
        .array as number[];
      const scales = particles.geometry.attributes.scale.array as number[];

      let i = 0,
        j = 0;

      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          positions[i + 1] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;
          scales[j] =
            (Math.sin((ix + count) * 0.3) + 1) * 20 +
            (Math.sin((iy + count) * 0.5) + 1) * 20;
          i += 3;
          j++;
        }
      }

      particles.geometry.attributes.position.needsUpdate = true;
      particles.geometry.attributes.scale.needsUpdate = true;

      renderer.render(scene, camera);

      count += 0.1;
    }

    init();
    animate();
  }, []);
  return (
    <div>
      <div
        id="PointsWaveContainer"
        style={{ position: "relative", width: "100vw", height: 667 }}
      >
        <div
          style={{
            position: "absolute",
            top: 100,
            left: 0,
            width: "100%",
            height: 667,
          }}
        >
          <svg className={styles.svgText}>
            <text x="50" y="50" dy=".35em" textAnchor="left">
              Sam Design
            </text>
          </svg>
        </div>
      </div>
      <div style={{ height: 800 }}></div>
    </div>
  );
}
const FirstScreenSection = React.memo(Component);
export default FirstScreenSection;
