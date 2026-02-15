import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import gsap from "gsap";

export default function HumanFigure3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = Math.max(container.clientWidth, 400);
    const height = Math.max(container.clientHeight, 400);
    const aspect = width / height;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 1000);
    camera.position.set(0, 0, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.localClippingEnabled = true;
    container.appendChild(renderer.domElement);

    // Clip plane: show only head to thigh (cut off lower legs)
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.3);

    scene.add(new THREE.AmbientLight(0xffffff, 1.4));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.7).position.set(0, 1, 4));
    scene.add(new THREE.DirectionalLight(0xa8d8ea, 0.25).position.set(-2, 0.5, 2));
    scene.add(new THREE.DirectionalLight(0x34d399, 0.12).position.set(2, -0.5, 1));

    const loader = new OBJLoader();
    loader.load("/assets/FinalBaseMesh.obj", (obj) => {
      const box = new THREE.Box3().setFromObject(obj);
      const center = box.getCenter(new THREE.Vector3());
      obj.position.sub(center);
      obj.position.y += 0.12;
      obj.scale.setScalar(0.18);

      obj.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => {
            if (m && "transparent" in m) {
              (m as THREE.MeshStandardMaterial).transparent = true;
              (m as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
              (m as THREE.MeshStandardMaterial).opacity = 0.6;
              (m as THREE.MeshStandardMaterial).clippingPlanes = [clipPlane];
              if ("color" in m && (m as THREE.MeshBasicMaterial).color) {
                (m as THREE.MeshBasicMaterial).color.setHex(0x34d399);
              }
            }
          });
        }
      });

      scene.add(obj);

      obj.position.y = -1.2;
      obj.scale.setScalar(0.14);

      gsap.to(obj.position, { y: 0, duration: 1.6, ease: "power2.out", delay: 0.4 });
      gsap.to(obj.scale, { x: 0.18, y: 0.18, z: 0.18, duration: 1.6, ease: "power2.out", delay: 0.4 });

      const rotateTween = gsap.to(obj.rotation, {
        y: Math.PI * 0.08,
        x: Math.PI * 0.015,
        duration: 6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.8,
      });

      tweenRef.current = rotateTween;
    });

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const w = Math.max(container.clientWidth, 400);
      const h = Math.max(container.clientHeight, 400);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      tweenRef.current?.kill();
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose());
          else mesh.material?.dispose();
        }
      });
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[400px]"
      style={{ background: "transparent" }}
    />
  );
}
