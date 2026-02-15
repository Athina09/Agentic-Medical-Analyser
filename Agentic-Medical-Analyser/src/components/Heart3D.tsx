import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

const HEART_IMAGE = "/assets/heart.png?v=3";

export default function Heart3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const aspect = width / height;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.set(0, 0, 3.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const map = textureLoader.load(HEART_IMAGE);
    // Keep heart aspect ratio (portrait) so it doesn’t look stretched
    const heartAspect = 1.25;
    const size = 2.85;
    const geometry = new THREE.PlaneGeometry(size, size * heartAspect);
    // Shader: discard white/near-white pixels so heart embeds with no background
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: map },
        uThreshold: { value: 0.92 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uMap;
        uniform float uThreshold;
        varying vec2 vUv;
        void main() {
          vec4 tex = texture2D(uMap, vUv);
          float l = (tex.r + tex.g + tex.b) / 3.0;
          if (l >= uThreshold) discard;
          gl_FragColor = tex;
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: true,
    });

    const heart = new THREE.Mesh(geometry, material);
    heart.position.y = 0.05;
    heart.position.z = 0;
    heart.rotation.z = -0.06;
    heart.rotation.y = 0.03;
    heart.scale.set(1, 1, 1);
    scene.add(heart);

    // Heartbeat: slow, continuous lub-dub (scale pulse)
    gsap.timeline({ repeat: -1, repeatDelay: 0.2 })
      .to(heart.scale, { x: 1.05, y: 1.05, z: 1, duration: 1, ease: "sine.inOut" })
      .to(heart.scale, { x: 1, y: 1, z: 1, duration: 1.1, ease: "sine.inOut" })
      .to(heart.scale, { x: 1.04, y: 1.04, z: 1, duration: 0.9, ease: "sine.inOut" })
      .to(heart.scale, { x: 1, y: 1, z: 1, duration: 1.2, ease: "sine.inOut" });

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frameId);
      geometry.dispose();
      material.dispose();
      map.dispose();
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full min-h-[420px]"
      style={{ background: "transparent" }}
    />
  );
}
