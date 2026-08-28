'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  buildGadget,
  gadgetDefinitions,
  toBinaryStl,
  validateGadget,
  type GadgetKind,
  type Parameters,
  type Triangle,
  type Vec3,
} from './modeling';

const initialValues = Object.fromEntries(
  gadgetDefinitions.map((definition) => [definition.id, { ...definition.defaults }]),
) as Record<GadgetKind, Parameters>;

export default function Home() {
  const [selected, setSelected] = useState<GadgetKind>('box');
  const [values, setValues] = useState(initialValues);
  const [downloaded, setDownloaded] = useState(false);
  const definition = gadgetDefinitions.find((item) => item.id === selected)!;
  const parameters = values[selected];
  const error = validateGadget(selected, parameters);
  const model = useMemo(() => buildGadget(selected, parameters), [selected, parameters]);
  const grams = Math.max(1, Math.round(model.volumeMm3 / 1000 * 1.24));
  const printMinutes = Math.max(12, Math.round(model.volumeMm3 / 1000 * 4.2 + 18));
  const bedWarning = Math.max(...model.dimensions) > 220;

  function updateParameter(key: string, value: number) {
    setValues((current) => ({
      ...current,
      [selected]: { ...current[selected], [key]: value },
    }));
  }

  function downloadModel() {
    if (error) return;
    const blob = toBinaryStl(model.triangles, definition.name);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = model.filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 2600);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="PrintKit Studio ホーム">
          <span className="brand-mark">P</span>
          <span>PRINTKIT <b>STUDIO</b></span>
        </a>
        <div className="topbar-copy">寸法から、すぐ印刷できる形へ。</div>
        <div className="unit-chip">単位 <strong>mm</strong></div>
      </header>

      <section className="intro" id="top">
        <div>
          <p className="eyebrow">PARAMETRIC GADGET MAKER / BETA</p>
          <h1>欲しいサイズで、<br />便利なものをつくる。</h1>
        </div>
        <p className="intro-copy">
          テンプレートを選び、寸法を入力するだけ。<br />3Dプリンタ用STLをその場で生成します。
        </p>
      </section>

      <section className="workspace" aria-label="STLモデル作成ワークスペース">
        <aside className="catalog-panel">
          <PanelHeading number="01" title="形を選ぶ" caption="GADGET LIBRARY" />
          <div className="gadget-list">
            {gadgetDefinitions.map((gadget) => (
              <button
                className={`gadget-card ${selected === gadget.id ? 'active' : ''}`}
                key={gadget.id}
                onClick={() => setSelected(gadget.id)}
                type="button"
              >
                <span className="gadget-code">{gadget.code}</span>
                <span><b>{gadget.name}</b><small>{gadget.detail}</small></span>
                <span className="arrow">↗</span>
              </button>
            ))}
          </div>
          <p className="catalog-note"><span>TIP</span> すべてサポート材なしで印刷しやすい向きに設計しています。</p>
        </aside>

        <section className="preview-panel" aria-label="モデルプレビュー">
          <div className="preview-toolbar">
            <span className="live-dot" /> LIVE 3D PREVIEW
            <span className="scale">ドラッグで回転</span>
          </div>
          <ModelCanvas triangles={model.triangles} label={`${definition.name}の3Dプレビュー`} />
          <div className="model-stats">
            <span><small>推定材料</small><b>約 {grams} g</b></span>
            <span><small>目安時間</small><b>約 {formatTime(printMinutes)}</b></span>
            <span><small>出力方向</small><b>{definition.orientation}</b></span>
          </div>
        </section>

        <aside className="settings-panel">
          <PanelHeading number="02" title="寸法を決める" caption="PARAMETERS" />
          <div className="model-title">
            <small>選択中 / {definition.code}</small>
            <strong>{definition.name}</strong>
            <p>{definition.description}</p>
          </div>
          <div className="input-grid">
            {definition.parameters.map((parameter) => (
              <Measure
                key={parameter.key}
                label={parameter.label}
                value={parameters[parameter.key]}
                min={parameter.min}
                max={parameter.max}
                step={parameter.step}
                onChange={(value) => updateParameter(parameter.key, value)}
              />
            ))}
          </div>

          <div className={`print-check ${error || bedWarning ? 'warning' : ''}`} role="status">
            <span>{error ? '!' : bedWarning ? '△' : '✓'}</span>
            <p>
              <b>{error ? '寸法を確認してください' : bedWarning ? '大型プリンタ向けです' : '印刷可能な形状です'}</b>
              <small>{error ?? (bedWarning ? '最大寸法が一般的な220 mmベッドを超えています' : `${model.triangles.length}面の閉じたSTLモデルを生成します`)}</small>
            </p>
          </div>

          <button className="generate-button" type="button" onClick={downloadModel} disabled={Boolean(error)}>
            <span>STLを生成・保存</span><small>MODEL &amp; DOWNLOAD</small><b>↓</b>
          </button>
          <p className="fine-print">生成処理はすべて端末内。寸法やモデルデータは外部へ送信されません。</p>
        </aside>
      </section>

      <section className="print-notes" aria-label="印刷のヒント">
        <article><span>01 / TOLERANCE</span><b>はめ込みには余裕を</b><p>実物に被せる部品は、測った寸法に0.2〜0.4 mmを足すのが目安です。</p></article>
        <article><span>02 / STRENGTH</span><b>壁3周以上がおすすめ</b><p>0.4 mmノズルなら、肉厚1.2 mm以上で日用品として扱いやすくなります。</p></article>
        <article><span>03 / SLICER</span><b>STLを必ず確認</b><p>スライサーで向き、充填率、サポート、ベッドとの収まりを確認してから印刷してください。</p></article>
      </section>

      <footer><b>PRINTKIT STUDIO</b><span>MAKE THE RIGHT-SIZED THING.</span><span>STL / MILLIMETERS / LOCAL ONLY</span></footer>
      {downloaded && <div className="download-toast" role="status"><b>STLを保存しました</b><span>{model.filename}</span></div>}
    </main>
  );
}

function PanelHeading({ number, title, caption }: { number: string; title: string; caption: string }) {
  return <div className="panel-heading"><span>{number}</span><div><b>{title}</b><small>{caption}</small></div></div>;
}

function Measure({ label, value, min, max, step = 1, onChange }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void;
}) {
  return (
    <label className="measure-field">
      <span>{label}</span>
      <div><input aria-label={label} type="number" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} /><b>mm</b></div>
    </label>
  );
}

function ModelCanvas({ triangles, label }: { triangles: Triangle[]; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPointer = useRef<[number, number] | null>(null);
  const [rotation, setRotation] = useState({ yaw: -0.72, pitch: 0.52 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const draw = () => drawMesh(canvas, triangles, rotation.yaw, rotation.pitch);
    const handleResize = () => window.requestAnimationFrame(draw);
    window.addEventListener('resize', handleResize);
    draw();
    return () => window.removeEventListener('resize', handleResize);
  }, [triangles, rotation]);

  return (
    <div className="canvas-wrap">
      <canvas
        ref={canvasRef}
        className="model-canvas"
        aria-label={label}
        role="img"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          lastPointer.current = [event.clientX, event.clientY];
        }}
        onPointerMove={(event) => {
          if (!lastPointer.current) return;
          const [x, y] = lastPointer.current;
          const dx = event.clientX - x, dy = event.clientY - y;
          lastPointer.current = [event.clientX, event.clientY];
          setRotation((current) => ({ yaw: current.yaw + dx * 0.012, pitch: Math.max(-1.25, Math.min(1.25, current.pitch + dy * 0.01)) }));
        }}
        onPointerUp={() => { lastPointer.current = null; }}
        onPointerCancel={() => { lastPointer.current = null; }}
      />
      <button className="reset-view" type="button" onClick={() => setRotation({ yaw: -0.72, pitch: 0.52 })}>↻ 視点を戻す</button>
      <span className="axis axis-x">X</span><span className="axis axis-y">Y</span><span className="axis axis-z">Z</span>
    </div>
  );
}

function drawMesh(canvas: HTMLCanvasElement, triangles: Triangle[], yaw: number, pitch: number) {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  const context = canvas.getContext('2d');
  if (!context) return;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, rect.width, rect.height);

  const points = triangles.flat();
  const min: Vec3 = [Infinity, Infinity, Infinity], max: Vec3 = [-Infinity, -Infinity, -Infinity];
  points.forEach((point) => point.forEach((value, index) => { min[index] = Math.min(min[index], value); max[index] = Math.max(max[index], value); }));
  const center: Vec3 = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];
  const span = Math.max(max[0] - min[0], max[1] - min[1], max[2] - min[2], 1);
  const scale = Math.min(rect.width, rect.height) * 0.62 / span;
  const cy = rect.height * 0.5;
  const transform = (point: Vec3) => {
    const x = point[0] - center[0], y = point[1] - center[1], z = point[2] - center[2];
    const x1 = x * Math.cos(yaw) - y * Math.sin(yaw);
    const y1 = x * Math.sin(yaw) + y * Math.cos(yaw);
    const y2 = y1 * Math.cos(pitch) - z * Math.sin(pitch);
    const z2 = y1 * Math.sin(pitch) + z * Math.cos(pitch);
    return { x: rect.width / 2 + x1 * scale, y: cy - z2 * scale, depth: y2, x3: x1, y3: y2, z3: z2 };
  };

  const faces = triangles.map((triangle) => {
    const transformed = triangle.map(transform);
    return { transformed, depth: transformed.reduce((sum, point) => sum + point.depth, 0) / 3 };
  }).sort((a, b) => b.depth - a.depth);

  faces.forEach(({ transformed }) => {
    const [a, b, c] = transformed;
    const ux = b.x3 - a.x3, uy = b.y3 - a.y3, uz = b.z3 - a.z3;
    const vx = c.x3 - a.x3, vy = c.y3 - a.y3, vz = c.z3 - a.z3;
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const length = Math.hypot(nx, ny, nz) || 1;
    const light = Math.max(0, (nx * -0.3 + ny * -0.5 + nz * 0.8) / length);
    const red = Math.round(205 + light * 50), green = Math.round(57 + light * 62), blue = Math.round(22 + light * 34);
    context.beginPath();
    context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.lineTo(c.x, c.y); context.closePath();
    context.fillStyle = `rgb(${red},${green},${blue})`;
    context.fill();
    context.strokeStyle = 'rgba(23,24,21,.48)';
    context.lineWidth = 0.75;
    context.stroke();
  });
}

function formatTime(minutes: number) {
  if (minutes < 60) return `${minutes}分`;
  return `${Math.floor(minutes / 60)}時間${minutes % 60}分`;
}

