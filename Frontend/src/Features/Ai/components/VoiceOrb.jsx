import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export const VoiceOrb = ({ isAwake, isListening }) => {
  const mountRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const materialRef = useRef(null);
  const animationFrameId = useRef(null);
  const uniformsRef = useRef(null);

  useEffect(() => {
    // 1. SCENE SETUP
    const currentMount = mountRef.current;
    if (!currentMount) return;
    
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // Clear any existing canvases (Fix for React StrictMode double-mounting)
    currentMount.innerHTML = '';

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 6.5; // Moved back to prevent square clipping at edges

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // 2. SHADERS (GLSL)
    const vertexShader = `
      uniform float time;
      uniform float audioFreq;
      uniform bool isAwake;
      
      varying vec2 vUv;
      varying vec3 vNormal;
      
      // Simplex 3D Noise function (Classic Perlin)
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      float snoise(vec3 v) {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute( permute( permute(
                   i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        float n_ = 0.142857142857;
        vec3  ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
      }

      void main() {
        vUv = uv;
        vNormal = normal;
        
        // Base displacement based on time (idle breathing)
        float noise = snoise(vec3(position.x * 2.0 + time, position.y * 2.0 + time, position.z * 2.0));
        float displacement = noise * 0.02; // Very subtle idle movement
        
        // Audio reactive displacement
        if (isAwake) {
           // Create sharp, aggressive spikes when audio frequency is high
           displacement += (audioFreq * 0.8) * snoise(vec3(position.x * 4.0, position.y * 4.0, time * 3.0));
        }

        vec3 newPosition = position + normal * displacement;
        
        vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
        
        // Make dots larger when they are closer, smaller when further away
        gl_PointSize = 8.0 * (1.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform float time;
      uniform float audioFreq;
      uniform bool isAwake;
      
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        // Convert square gl_Points into perfect circular dots
        vec2 coord = gl_PointCoord - vec2(0.5);
        if(length(coord) > 0.5) discard;

        // Create an organic neon glow
        vec3 baseColor = isAwake ? vec3(0.0, 0.8, 1.0) : vec3(0.4, 0.4, 0.4); // Cyan when awake, dull grey when idle
        vec3 highlightColor = isAwake ? vec3(0.8, 0.2, 1.0) : vec3(0.6, 0.6, 0.6); // Purple highlight when awake
        
        // Combine colors based on normals
        vec3 finalColor = mix(baseColor, highlightColor, vNormal.y);
        
        // Add brightness based on audio volume
        float glowIntensity = isAwake ? 0.8 + (audioFreq * 1.5) : 0.5;
        finalColor *= glowIntensity;
        
        // Alpha transparency for holograpic feel (More transparent)
        gl_FragColor = vec4(finalColor, 0.8);
      }
    `;

    // 3. GEOMETRY & MATERIAL
    // Increased detail massively so we get a huge swarm of dots!
    const geometry = new THREE.IcosahedronGeometry(2.5, 64);
    
    const uniforms = {
      time: { value: 0.0 },
      audioFreq: { value: 0.0 },
      isAwake: { value: false }
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: uniformsRef.current,
      transparent: true,
      blending: THREE.AdditiveBlending, // Glowing particle effect
      depthWrite: false, // Prevents particles from blocking each other
    });
    materialRef.current = material;

    // Use THREE.Points to render the geometry as a swarm of dots instead of a solid mesh!
    const sphere = new THREE.Points(geometry, material);
    scene.add(sphere);

    // 4. ANIMATION LOOP
    const clock = new THREE.Clock();
    
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();
      const currentFreq = uniformsRef.current.audioFreq.value;
      
      // Dynamic Scale (Expand & Compress) based on frequency
      const targetScale = 1.0 + (currentFreq * 0.5); // Expands up to 50% larger when speaking
      sphere.scale.set(targetScale, targetScale, targetScale);

      // Rotate sphere dynamically (very slow when silent, fast when speaking)
      sphere.rotation.y += 0.002 + (currentFreq * 0.05);
      sphere.rotation.x += 0.001 + (currentFreq * 0.03);
      
      // Update Uniforms
      uniformsRef.current.time.value = elapsedTime;
      uniformsRef.current.isAwake.value = isAwake;

      // Update Audio Frequency
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        
        // Calculate average frequency volume
        let sum = 0;
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          sum += dataArrayRef.current[i];
        }
        const avg = sum / dataArrayRef.current.length;
        
        // Normalize between 0 and 1
        let normalizedFreq = avg / 256.0;
        
        // Smooth out the movement so it's fluid, not jumpy
        uniformsRef.current.audioFreq.value += (normalizedFreq - uniformsRef.current.audioFreq.value) * 0.2;
      } else {
        // Gradually return to 0 when not listening
        uniformsRef.current.audioFreq.value += (0.0 - uniformsRef.current.audioFreq.value) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 5. WINDOW RESIZE HANDLING
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId.current);
      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // 6. MICROPHONE AUDIO SETUP
  useEffect(() => {
    let activeStream = null;

    if (isListening && isAwake) {
      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(stream => {
          activeStream = stream;
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          audioContextRef.current = new AudioContext();
          const source = audioContextRef.current.createMediaStreamSource(stream);
          
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 64; // Low resolution for smooth generic volume
          
          source.connect(analyserRef.current);
          
          const bufferLength = analyserRef.current.frequencyBinCount;
          dataArrayRef.current = new Uint8Array(bufferLength);
        })
        .catch(err => console.error("Mic access denied for WebGL Orb", err));
    } else {
      // Clean up audio context if listening stops
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
        analyserRef.current = null;
      }
      // Force kill the hardware microphone to remove the red dot
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isListening, isAwake]);

  return (
    <div 
      ref={mountRef} 
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 10 }}
    />
  );
};
