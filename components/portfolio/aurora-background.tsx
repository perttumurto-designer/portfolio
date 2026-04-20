"use client"

import { useEffect, useRef, type CSSProperties } from "react"

/**
 * AuroraBackground — full-viewport B/W plasma-aurora. Two-pass WebGL:
 * aurora renders to a half-res FBO, then upscales with linear filtering.
 * Idle-sleeps when the pointer is still, pauses when tab hidden / off-screen,
 * throttles on low battery, and honors prefers-reduced-motion / Save-Data.
 */

type Props = {
  intensity?: number
  speed?: number
  scale?: number
  renderScale?: number
  maxDpr?: number
  fpsCap?: number
  interactive?: boolean
  respectReducedMotion?: boolean
  respectDataSaver?: boolean
  className?: string
  style?: CSSProperties
}

const VERT_QUAD = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAG_AURORA = `
precision mediump float;
uniform vec2 u_res;
uniform float u_t;
uniform vec2 u_mouse;
uniform float u_impulse;
uniform vec2 u_click;
uniform float u_intensity;
uniform float u_speed;
uniform float u_scale;

float hash1(vec2 p){
  p = fract(p*vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
vec2 hash2(vec2 p){
  float a = hash1(p);
  float b = hash1(p + 19.19);
  return -1.0 + 2.0 * vec2(a, b);
}
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0 - 2.0*f);
  float a = dot(hash2(i),               f);
  float b = dot(hash2(i + vec2(1.0,0.0)), f - vec2(1.0,0.0));
  float c = dot(hash2(i + vec2(0.0,1.0)), f - vec2(0.0,1.0));
  float d = dot(hash2(i + vec2(1.0,1.0)), f - vec2(1.0,1.0));
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0;
  v += 0.50 * noise(p);      p = p*2.0 + 7.3;
  v += 0.25 * noise(p);      p = p*2.0 + 7.3;
  v += 0.125 * noise(p);
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float m = min(u_res.x, u_res.y);
  vec2 p = (gl_FragCoord.xy - 0.5*u_res.xy) / m;
  p *= u_scale;

  vec2 aspect = vec2(u_res.x/m, u_res.y/m);
  vec2 mp = (u_mouse - 0.5) * aspect;
  vec2 cp = (u_click - 0.5) * aspect;

  float t = u_t * 0.3 * u_speed;
  float dm = length(p - mp);
  float dc = length(p - cp);

  float L = 0.0;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float phase = fi * 1.37;
    vec2 q = p*1.1 + vec2(t*(0.6 + fi*0.1), -t*0.3 + fi);
    q += (mp - p) * 0.25 * exp(-dm*(1.5 + fi*0.2)) * u_intensity;
    float wobble = fbm(q*1.6 + phase) * 1.8;
    float yc = -0.55 + fi*0.35 + sin(p.x*1.2 + t*1.2 + phase)*0.35 + wobble*0.25;
    float dy = (p.y - yc) * (3.2 - fi*0.2);
    float band = exp(-dy*dy);
    band *= 0.6 + 0.4 * (0.5 + 0.5*sin(p.x*4.0 + t + fi*2.1));
    L += band * (0.75 + 0.25*sin(t*2.0 + fi)) * u_intensity;
  }

  L += exp(-dm*4.0) * 0.6 * u_intensity;
  L += exp(-dc*3.0) * u_impulse * 1.2;
  float r = (1.0 - u_impulse) * 1.6;
  L += smoothstep(0.04, 0.0, abs(dc - r)) * u_impulse;

  float vg = smoothstep(1.5, 0.3, length(uv - 0.5));
  L *= mix(0.55, 1.05, vg);

  L = L / (1.0 + L);
  L = pow(L, 0.85);

  gl_FragColor = vec4(vec3(L), 1.0);
}
`

const FRAG_BLIT = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform vec2 u_res;
void main(){
  vec3 c = texture2D(u_tex, v_uv).rgb;
  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233))) * 43758.5453);
  c += (g - 0.5) * 0.02;
  gl_FragColor = vec4(c, 1.0);
}
`

const isMobile = () =>
  typeof navigator !== "undefined" &&
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)

export default function AuroraBackground({
  intensity = 0.3,
  speed = 0.4,
  scale = 1.1,
  renderScale,
  maxDpr,
  fpsCap,
  interactive = true,
  respectReducedMotion = true,
  respectDataSaver = true,
  className,
  style,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const settingsRef = useRef({ intensity, speed, scale })
  settingsRef.current = { intensity, speed, scale }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const mobile = isMobile()

    if (respectDataSaver && typeof navigator !== "undefined") {
      const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection
      if (conn?.saveData || conn?.effectiveType === "2g") {
        canvas.style.background =
          "radial-gradient(ellipse at 50% 60%, #2a2a2a 0%, #000 70%)"
        return
      }
    }

    const rScale = renderScale ?? (mobile ? 0.5 : 0.6)
    const dprCap = maxDpr ?? (mobile ? 1.0 : 1.25)
    const fps = fpsCap ?? (mobile ? 24 : 30)

    const gl = canvas.getContext("webgl", {
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: "low-power",
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      alpha: false,
    }) as WebGLRenderingContext | null
    if (!gl) return

    const reduceMotion =
      respectReducedMotion &&
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s))
      }
      return s
    }
    const link = (vsSrc: string, fsSrc: string) => {
      const p = gl.createProgram()!
      const vs = compile(gl.VERTEX_SHADER, vsSrc)
      const fs = compile(gl.FRAGMENT_SHADER, fsSrc)
      gl.attachShader(p, vs)
      gl.attachShader(p, fs)
      gl.linkProgram(p)
      return { prog: p, vs, fs }
    }

    const auroraP = link(VERT_QUAD, FRAG_AURORA)
    const blitP = link(VERT_QUAD, FRAG_BLIT)

    const quad = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, quad)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )

    const auroraA = gl.getAttribLocation(auroraP.prog, "a_pos")
    const blitA = gl.getAttribLocation(blitP.prog, "a_pos")

    const au = {
      res: gl.getUniformLocation(auroraP.prog, "u_res"),
      t: gl.getUniformLocation(auroraP.prog, "u_t"),
      mouse: gl.getUniformLocation(auroraP.prog, "u_mouse"),
      impulse: gl.getUniformLocation(auroraP.prog, "u_impulse"),
      click: gl.getUniformLocation(auroraP.prog, "u_click"),
      intensity: gl.getUniformLocation(auroraP.prog, "u_intensity"),
      speed: gl.getUniformLocation(auroraP.prog, "u_speed"),
      scale: gl.getUniformLocation(auroraP.prog, "u_scale"),
    }
    const bu = {
      tex: gl.getUniformLocation(blitP.prog, "u_tex"),
      res: gl.getUniformLocation(blitP.prog, "u_res"),
    }

    const fbo = gl.createFramebuffer()!
    const tex = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    let offW = 0,
      offH = 0
    let canvasW = 0,
      canvasH = 0

    const applySize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap)
      const w = Math.max(1, Math.floor(window.innerWidth * dpr))
      const h = Math.max(1, Math.floor(window.innerHeight * dpr))
      if (w !== canvasW || h !== canvasH) {
        canvasW = w
        canvasH = h
        canvas.width = w
        canvas.height = h
      }
      const ow = Math.max(1, Math.floor(window.innerWidth * dpr * rScale))
      const oh = Math.max(1, Math.floor(window.innerHeight * dpr * rScale))
      if (ow !== offW || oh !== offH) {
        offW = ow
        offH = oh
        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, ow, oh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
      }
    }

    let resizePending = false
    const scheduleResize = () => {
      if (resizePending) return
      resizePending = true
      requestAnimationFrame(() => {
        resizePending = false
        applySize()
      })
    }
    applySize()

    const state = {
      mouse: { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 },
      click: { x: 0.5, y: 0.5, impulse: 0 },
      t0: performance.now(),
      moved: false,
      lastDrawAt: 0,
    }

    const onMove = (e: PointerEvent) => {
      state.mouse.tx = e.clientX / window.innerWidth
      state.mouse.ty = 1.0 - e.clientY / window.innerHeight
      state.moved = true
      kick()
    }
    const onClick = (e: MouseEvent) => {
      state.click.x = e.clientX / window.innerWidth
      state.click.y = 1.0 - e.clientY / window.innerHeight
      state.click.impulse = 1.0
      kick()
    }
    window.addEventListener("resize", scheduleResize, { passive: true })
    window.addEventListener("pointermove", onMove, { passive: true })
    if (interactive) canvas.addEventListener("click", onClick)

    let visible = !document.hidden
    const onVis = () => {
      visible = !document.hidden
      if (visible) kick()
    }
    document.addEventListener("visibilitychange", onVis)

    let inView = true
    let io: IntersectionObserver | null = null
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          inView = entries[0]?.isIntersecting ?? true
          if (inView) kick()
        },
        { threshold: 0 },
      )
      io.observe(canvas)
    }

    let batteryFpsScale = 1
    type BatteryManager = {
      level: number
      charging: boolean
      addEventListener: (evt: string, fn: () => void) => void
    }
    const navAny = navigator as unknown as { getBattery?: () => Promise<BatteryManager> }
    if (navAny.getBattery) {
      navAny
        .getBattery()
        .then((b) => {
          const update = () => {
            batteryFpsScale = !b.charging && b.level < 0.2 ? 0.5 : 1
          }
          update()
          b.addEventListener("levelchange", update)
          b.addEventListener("chargingchange", update)
        })
        .catch(() => {})
    }

    const drawAurora = (now: number) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
      gl.viewport(0, 0, offW, offH)
      gl.useProgram(auroraP.prog)
      gl.bindBuffer(gl.ARRAY_BUFFER, quad)
      gl.enableVertexAttribArray(auroraA)
      gl.vertexAttribPointer(auroraA, 2, gl.FLOAT, false, 0, 0)

      const tSec = (now - state.t0) / 1000
      const s = settingsRef.current
      gl.uniform2f(au.res, offW, offH)
      gl.uniform1f(au.t, tSec)
      gl.uniform2f(au.mouse, state.mouse.x, state.mouse.y)
      gl.uniform2f(au.click, state.click.x, state.click.y)
      gl.uniform1f(au.impulse, state.click.impulse)
      gl.uniform1f(au.intensity, s.intensity)
      gl.uniform1f(au.speed, s.speed)
      gl.uniform1f(au.scale, s.scale)
      gl.drawArrays(gl.TRIANGLES, 0, 6)

      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, canvasW, canvasH)
      gl.useProgram(blitP.prog)
      gl.bindBuffer(gl.ARRAY_BUFFER, quad)
      gl.enableVertexAttribArray(blitA)
      gl.vertexAttribPointer(blitA, 2, gl.FLOAT, false, 0, 0)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.uniform1i(bu.tex, 0)
      gl.uniform2f(bu.res, canvasW, canvasH)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    let raf = 0
    let running = false
    let lastTick = performance.now()

    const canSleep = (now: number) => {
      const pointerIdle =
        Math.abs(state.mouse.tx - state.mouse.x) < 0.0005 &&
        Math.abs(state.mouse.ty - state.mouse.y) < 0.0005 &&
        !state.moved
      const impulseCold = state.click.impulse < 0.002
      const freshEnough = state.lastDrawAt > 0 && now - state.lastDrawAt < 1000
      return pointerIdle && impulseCold && freshEnough
    }

    const loop = (now: number) => {
      if (!running) return
      if (!visible || !inView) {
        running = false
        return
      }

      const effectiveFps = Math.max(10, Math.floor(fps * batteryFpsScale))
      const frameMs = 1000 / effectiveFps
      const due = now - lastTick >= frameMs

      if (due) {
        const dt = Math.min(0.1, (now - lastTick) / 1000)
        state.mouse.x += (state.mouse.tx - state.mouse.x) * 0.12
        state.mouse.y += (state.mouse.ty - state.mouse.y) * 0.12
        state.click.impulse *= Math.pow(0.05, dt)

        if (!canSleep(now)) {
          drawAurora(now)
          state.lastDrawAt = now
          state.moved = false
        } else {
          running = false
          return
        }
        lastTick = now
      }
      raf = requestAnimationFrame(loop)
    }

    const kick = () => {
      if (reduceMotion) {
        drawAurora(performance.now())
        return
      }
      if (running) return
      running = true
      lastTick = performance.now() - 16
      raf = requestAnimationFrame(loop)
    }

    if (reduceMotion) {
      drawAurora(performance.now())
    } else {
      kick()
    }

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", scheduleResize)
      window.removeEventListener("pointermove", onMove)
      if (interactive) canvas.removeEventListener("click", onClick)
      document.removeEventListener("visibilitychange", onVis)
      io?.disconnect()
      gl.deleteTexture(tex)
      gl.deleteFramebuffer(fbo)
      gl.deleteBuffer(quad)
      gl.deleteProgram(auroraP.prog)
      gl.deleteShader(auroraP.vs)
      gl.deleteShader(auroraP.fs)
      gl.deleteProgram(blitP.prog)
      gl.deleteShader(blitP.vs)
      gl.deleteShader(blitP.fs)
    }
  }, [interactive, renderScale, maxDpr, fpsCap, respectReducedMotion, respectDataSaver])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        zIndex: -1,
        pointerEvents: interactive ? "auto" : "none",
        background: "#000",
        ...style,
      }}
    />
  )
}
