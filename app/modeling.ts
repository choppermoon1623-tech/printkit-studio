export type GadgetKind = 'box' | 'clip' | 'spacer' | 'wedge';
export type Vec3 = [number, number, number];
export type Triangle = [Vec3, Vec3, Vec3];
export type Parameters = Record<string, number>;

export type ParameterDefinition = {
  key: string;
  label: string;
  min: number;
  max: number;
  step?: number;
};

export type GadgetDefinition = {
  id: GadgetKind;
  code: string;
  name: string;
  detail: string;
  description: string;
  orientation: string;
  parameters: ParameterDefinition[];
  defaults: Parameters;
};

export type Mesh = {
  triangles: Triangle[];
  volumeMm3: number;
  filename: string;
  dimensions: [number, number, number];
  warning?: string;
};

export const gadgetDefinitions: GadgetDefinition[] = [
  {
    id: 'box', code: 'BOX', name: 'オープンボックス', detail: '収納・パーツ整理',
    description: '小物整理、治具、電子工作ケースに使える、上面が開いた丈夫な箱です。',
    orientation: '底面を下',
    parameters: [
      { key: 'width', label: '幅 W', min: 30, max: 300 },
      { key: 'depth', label: '奥行 D', min: 30, max: 300 },
      { key: 'height', label: '高さ H', min: 15, max: 200 },
      { key: 'wall', label: '壁・底厚', min: 1.2, max: 8, step: 0.2 },
    ],
    defaults: { width: 120, depth: 80, height: 45, wall: 2.4 },
  },
  {
    id: 'clip', code: 'CLP', name: 'ケーブルクリップ', detail: '配線をすっきり固定',
    description: 'ケーブル径に合わせてパチッとはめる、横向き印刷のC型クリップです。',
    orientation: '側面を下',
    parameters: [
      { key: 'diameter', label: 'ケーブル径', min: 2, max: 30, step: 0.2 },
      { key: 'thickness', label: '肉厚', min: 1.2, max: 6, step: 0.2 },
      { key: 'width', label: 'クリップ幅', min: 5, max: 35, step: 0.5 },
      { key: 'gap', label: '開口角', min: 35, max: 140, step: 5 },
    ],
    defaults: { diameter: 8, thickness: 2.4, width: 12, gap: 70 },
  },
  {
    id: 'spacer', code: 'SPC', name: 'スペーサー', detail: '内径・外径を指定',
    description: 'ネジ、棚、基板などの高さ調整に使える中空円筒スペーサーです。',
    orientation: '円形面を下',
    parameters: [
      { key: 'inner', label: '内径', min: 1, max: 50, step: 0.2 },
      { key: 'outer', label: '外径', min: 4, max: 80, step: 0.2 },
      { key: 'height', label: '高さ', min: 1, max: 100, step: 0.5 },
    ],
    defaults: { inner: 5, outer: 12, height: 8 },
  },
  {
    id: 'wedge', code: 'WDG', name: 'ドアストッパー', detail: '角度と高さを調整',
    description: '必要な高さに合わせられる、サポート材不要のシンプルなくさびです。',
    orientation: '広い底面を下',
    parameters: [
      { key: 'length', label: '長さ', min: 35, max: 180 },
      { key: 'width', label: '幅', min: 20, max: 100 },
      { key: 'height', label: '最大高さ', min: 8, max: 60 },
    ],
    defaults: { length: 80, width: 40, height: 20 },
  },
];

export function buildGadget(kind: GadgetKind, p: Parameters): Mesh {
  switch (kind) {
    case 'box': return buildBox(p);
    case 'clip': return buildClip(p);
    case 'spacer': return buildSpacer(p);
    case 'wedge': return buildWedge(p);
  }
}

export function validateGadget(kind: GadgetKind, p: Parameters): string | undefined {
  if (Object.values(p).some((value) => !Number.isFinite(value) || value <= 0)) return 'すべての寸法を正の数で入力してください。';
  if (kind === 'box' && (p.wall * 2 >= p.width || p.wall * 2 >= p.depth || p.wall >= p.height)) return '壁厚は幅・奥行きの半分未満、かつ高さ未満にしてください。';
  if (kind === 'spacer' && p.outer <= p.inner + 2.4) return '十分な強度のため、外径は内径より2.4 mm以上大きくしてください。';
  if (kind === 'clip' && p.thickness < 1.2) return 'クリップの肉厚は1.2 mm以上にしてください。';
  return undefined;
}

function buildBox(p: Parameters): Mesh {
  const { width: w, depth: d, height: h, wall: t } = p;
  const triangles: Triangle[] = [];
  const q = (a: Vec3, b: Vec3, c: Vec3, e: Vec3) => addQuad(triangles, a, b, c, e);

  q([0, 0, 0], [0, d, 0], [w, d, 0], [w, 0, 0]);
  q([0, 0, 0], [w, 0, 0], [w, 0, h], [0, 0, h]);
  q([w, 0, 0], [w, d, 0], [w, d, h], [w, 0, h]);
  q([w, d, 0], [0, d, 0], [0, d, h], [w, d, h]);
  q([0, d, 0], [0, 0, 0], [0, 0, h], [0, d, h]);

  q([t, t, t], [w - t, t, t], [w - t, d - t, t], [t, d - t, t]);
  q([t, t, t], [t, t, h], [w - t, t, h], [w - t, t, t]);
  q([w - t, t, t], [w - t, t, h], [w - t, d - t, h], [w - t, d - t, t]);
  q([w - t, d - t, t], [w - t, d - t, h], [t, d - t, h], [t, d - t, t]);
  q([t, d - t, t], [t, d - t, h], [t, t, h], [t, t, t]);

  q([0, 0, h], [w, 0, h], [w - t, t, h], [t, t, h]);
  q([w, 0, h], [w, d, h], [w - t, d - t, h], [w - t, t, h]);
  q([w, d, h], [0, d, h], [t, d - t, h], [w - t, d - t, h]);
  q([0, d, h], [0, 0, h], [t, t, h], [t, d - t, h]);

  const volumeMm3 = w * d * h - (w - 2 * t) * (d - 2 * t) * (h - t);
  return mesh(triangles, volumeMm3, `open-box-${round(w)}x${round(d)}x${round(h)}.stl`, [w, d, h]);
}

function buildSpacer(p: Parameters): Mesh {
  const inner = p.inner / 2;
  const outer = p.outer / 2;
  const h = p.height;
  const triangles = annularExtrusion(inner, outer, h, 0, Math.PI * 2, 72, false);
  const volumeMm3 = Math.PI * (outer * outer - inner * inner) * h;
  return mesh(triangles, volumeMm3, `spacer-id${round(p.inner)}-od${round(p.outer)}-h${round(h)}.stl`, [p.outer, p.outer, h]);
}

function buildClip(p: Parameters): Mesh {
  const inner = p.diameter / 2;
  const outer = inner + p.thickness;
  const gap = p.gap * Math.PI / 180;
  const start = Math.PI / 2 + gap / 2;
  const end = Math.PI / 2 + Math.PI * 2 - gap / 2;
  const triangles = annularExtrusion(inner, outer, p.width, start, end, 64, true);
  const fraction = (end - start) / (Math.PI * 2);
  const volumeMm3 = Math.PI * (outer * outer - inner * inner) * fraction * p.width;
  return mesh(triangles, volumeMm3, `cable-clip-d${round(p.diameter)}-w${round(p.width)}.stl`, [outer * 2, p.width, outer * 2]);
}

function buildWedge(p: Parameters): Mesh {
  const l = p.length, w = p.width, h = p.height;
  const a: Vec3 = [0, 0, 0], b: Vec3 = [l, 0, 0], c: Vec3 = [0, 0, h];
  const d: Vec3 = [0, w, 0], e: Vec3 = [l, w, 0], f: Vec3 = [0, w, h];
  const triangles: Triangle[] = [[a, c, b], [d, e, f]];
  addQuad(triangles, a, b, e, d);
  addQuad(triangles, c, f, e, b);
  addQuad(triangles, a, d, f, c);
  return mesh(triangles, l * w * h / 2, `door-wedge-${round(l)}x${round(w)}x${round(h)}.stl`, [l, w, h]);
}

function annularExtrusion(inner: number, outer: number, width: number, start: number, end: number, segments: number, capEnds: boolean): Triangle[] {
  const triangles: Triangle[] = [];
  const offsetZ = outer;
  const point = (radius: number, angle: number, y: number): Vec3 => [radius * Math.cos(angle), y, radius * Math.sin(angle) + offsetZ];
  for (let i = 0; i < segments; i++) {
    const a0 = start + (end - start) * i / segments;
    const a1 = start + (end - start) * (i + 1) / segments;
    const o0f = point(outer, a0, 0), o1f = point(outer, a1, 0);
    const i0f = point(inner, a0, 0), i1f = point(inner, a1, 0);
    const o0b = point(outer, a0, width), o1b = point(outer, a1, width);
    const i0b = point(inner, a0, width), i1b = point(inner, a1, width);
    addQuad(triangles, o0f, o1f, o1b, o0b);
    addQuad(triangles, i1f, i0f, i0b, i1b);
    addQuad(triangles, i0f, i1f, o1f, o0f);
    addQuad(triangles, o0b, o1b, i1b, i0b);
  }
  if (capEnds) {
    const osf = point(outer, start, 0), isf = point(inner, start, 0);
    const osb = point(outer, start, width), isb = point(inner, start, width);
    const oef = point(outer, end, 0), ief = point(inner, end, 0);
    const oeb = point(outer, end, width), ieb = point(inner, end, width);
    addQuad(triangles, isf, osf, osb, isb);
    addQuad(triangles, oef, ief, ieb, oeb);
  }
  return triangles;
}

function addQuad(target: Triangle[], a: Vec3, b: Vec3, c: Vec3, d: Vec3) {
  target.push([a, b, c], [a, c, d]);
}

function mesh(triangles: Triangle[], volumeMm3: number, filename: string, dimensions: [number, number, number], warning?: string): Mesh {
  return { triangles, volumeMm3, filename, dimensions, warning };
}

function round(value: number) { return Number(value.toFixed(1)); }

export function toBinaryStl(triangles: Triangle[], label: string): Blob {
  const buffer = new ArrayBuffer(84 + triangles.length * 50);
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  const header = new TextEncoder().encode(`PrintKit Studio / ${label}`.slice(0, 80));
  bytes.set(header, 0);
  view.setUint32(80, triangles.length, true);
  let offset = 84;
  for (const triangle of triangles) {
    const normal = normalOf(triangle);
    for (const value of normal) { view.setFloat32(offset, value, true); offset += 4; }
    for (const vertex of triangle) {
      for (const value of vertex) { view.setFloat32(offset, value, true); offset += 4; }
    }
    view.setUint16(offset, 0, true);
    offset += 2;
  }
  return new Blob([buffer], { type: 'model/stl' });
}

function normalOf([a, b, c]: Triangle): Vec3 {
  const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
  const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
  const x = uy * vz - uz * vy, y = uz * vx - ux * vz, z = ux * vy - uy * vx;
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length];
}

