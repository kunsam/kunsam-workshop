import React, { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "../../../library/threejs/GLTFLoader";
import { OrbitControls } from "../../../library/threejs/OrbitControls";
// import { RGBELoader } from "../../../library/threejs/RGBELoader";
function Component() {
  useEffect(() => {
    const dom = document.getElementById("OrbitSection3DModel");
    const width = dom.clientWidth;
    const height = dom.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    var controls = new OrbitControls(camera, dom);
    controls.update();
    renderer.setSize(width, height);
    dom.appendChild(renderer.domElement);
    camera.position.z = 50;
    // camera.position.x = -5
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    // new RGBELoader()
    //   .setDataType(THREE.UnsignedByteType)
    //   .setPath(`/3d/textures/equirectangular/`)
    //   .load("quarry_01_1k.hdr", function (texture) {
    //     const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    //     scene.background = envMap;
    //     scene.environment = envMap;
    //     texture.dispose();
    //     pmremGenerator.dispose();
    //   });
    const light = new THREE.AmbientLight(0x404040, 1); // soft white light
    scene.add(light);
    const light2 = new THREE.AmbientLight(0xfff, 10); // soft white light
    scene.add(light2);
    pmremGenerator.dispose();
    let model1scene: THREE.Group;
    const state = { variant: "midnight" };
    const loader = new GLTFLoader().setPath(`/3d/glTF/`);
    loader.load(
      `MaterialsVariantsShoe.gltf`,
      function (gltf) {
        gltf.scene.scale.set(150, 150, 150);
        const parser = gltf.parser;
        const variantsExtension =
          gltf.userData.gltfExtensions["KHR_materials_variants"];
        selectVariant(scene, parser, variantsExtension, state.variant);
        scene.add(gltf.scene);
        console.log(gltf, "gltf");
        model1scene = gltf.scene;
      },
      undefined,
      function (error) {
        console.log(error, "error");
        console.error(error);
      }
    );

    function selectVariant(scene, parser, extension, variantName) {
      const variantIndex = extension.variants.findIndex((v) =>
        v.name.includes(variantName)
      );

      scene.traverse(async (object) => {
        if (!object.isMesh || !object.userData.gltfExtensions) return;

        const meshVariantDef =
          object.userData.gltfExtensions["KHR_materials_variants"];

        if (!meshVariantDef) return;

        if (!object.userData.originalMaterial) {
          object.userData.originalMaterial = object.material;
        }

        const mapping = meshVariantDef.mappings.find((mapping) =>
          mapping.variants.includes(variantIndex)
        );

        if (mapping) {
          object.material = await parser.getDependency(
            "material",
            mapping.material
          );
        } else {
          object.material = object.originalMaterial;
        }
      });
    }

    function animate() {
      // cube.position.y += 0.1
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      controls.update();
      if (model1scene) {
        model1scene.rotation.y += 0.01;
      }
      // console.log(camera.position, camera.up, 'camera')
    }
    animate();
  }, []);

  return <div id="OrbitSection3DModel" style={{ height: 300 }}></div>;
}
const OrbitSection3DModel = React.memo(Component);
export default OrbitSection3DModel;
