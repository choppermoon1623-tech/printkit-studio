export type GadgetKind = 'fidget-ring' | 'hinge' | 'gear-pair' | 'flexure' | 'living-hinge' | 'gripper' | 'box' | 'clip' | 'spacer' | 'wedge';
export type Vec3 = [number, number, number];
export type Triangle = [Vec3, Vec3, Vec3];
export type Parameters = Record<string, number>;

export type ParameterDefinition = {
  key: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
};

export type GadgetDefinition = {
  id: GadgetKind;
  code: string;
  name: string;
  detail: string;
  description: string;
  orientation: string;
  category: 'PRINT-IN-PLACE' | 'UTILITY';
  printTip: string;
  material: string;
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
    id: 'fidget-ring', code: 'FJT', name: 'ネスト・スピナー', detail: '一体印刷の回転フィジェット',
    description: 'すき間を空けた同心リングを一度に印刷。プレートから外したら、指でリングを回して遊べます。',
    orientation: '平らな面を下', category: 'PRINT-IN-PLACE', material: 'PLA / PETG',
    printTip: '初回はクリアランス0.45 mm、0.2 mm積層で試してください。',
    parameters: [
      { key: 'diameter', label: '外径', min: 38, max: 130 },
      { key: 'rings', label: 'リング数', min: 2, max: 5, step: 1, unit: '個' },
      { key: 'height', label: '厚さ', min: 4, max: 12, step: 0.5 },
      { key: 'clearance', label: '可動すき間', min: 0.3, max: 0.8, step: 0.05 },
    ],
    defaults: { diameter: 72, rings: 4, height: 7, clearance: 0.45 },
  },
  {
    id: 'hinge', code: 'HNG', name: '一体型ピボット蝶番', detail: 'ピン込みで一度に完成',
    description: '縦ピンと交互のナックルを一体印刷する、平置きタイプの可動ジョイントです。',
    orientation: '葉をプレートに平置き', category: 'PRINT-IN-PLACE', material: 'PLA / PETG',
    printTip: '印刷後にゆっくり往復させ、固着した糸を切って可動させます。',
    parameters: [
      { key: 'leafLength', label: '片側長さ', min: 22, max: 70 },
      { key: 'leafWidth', label: '葉の幅', min: 14, max: 38 },
      { key: 'height', label: '蝶番高さ', min: 8, max: 24, step: 0.5 },
      { key: 'pin', label: 'ピン径', min: 3, max: 8, step: 0.2 },
      { key: 'clearance', label: '可動すき間', min: 0.3, max: 0.8, step: 0.05 },
    ],
    defaults: { leafLength: 38, leafWidth: 22, height: 14, pin: 4, clearance: 0.45 },
  },
  {
    id: 'gear-pair', code: 'GRS', name: 'かみ合い歯車ペア', detail: '異なる歯数を一体配置',
    description: 'モジュールと歯数から、すぐ回せる平歯車2枚を適切な中心距離で配置します。',
    orientation: '歯車面を下', category: 'PRINT-IN-PLACE', material: 'PLA / PETG',
    printTip: 'エレファントフット補正を有効にすると、歯元の固着を抑えやすくなります。',
    parameters: [
      { key: 'driveTeeth', label: '駆動側 歯数', min: 10, max: 30, step: 1, unit: 'T' },
      { key: 'drivenTeeth', label: '従動側 歯数', min: 10, max: 42, step: 1, unit: 'T' },
      { key: 'module', label: 'モジュール', min: 1.2, max: 3, step: 0.1, unit: 'MOD' },
      { key: 'height', label: '歯車厚さ', min: 4, max: 12, step: 0.5 },
      { key: 'bore', label: '軸穴径', min: 3, max: 12, step: 0.2 },
      { key: 'clearance', label: 'かみ合い余裕', min: 0.2, max: 0.8, step: 0.05 },
    ],
    defaults: { driveTeeth: 14, drivenTeeth: 24, module: 2, height: 7, bore: 5, clearance: 0.35 },
  },
  {
    id: 'flexure', code: 'FLX', name: '4アーム・フレクサー', detail: 'しなる一体型フィジェット',
    description: '中央ボタンを4本の斜めばねで保持。指で横へ押すと、弾性で戻るコンプライアント機構です。',
    orientation: 'リング面を下', category: 'PRINT-IN-PLACE', material: 'PETG推奨',
    printTip: '外周4周、インフィル100%にすると、ばねの感触が安定しやすくなります。',
    parameters: [
      { key: 'diameter', label: '外径', min: 46, max: 120 },
      { key: 'travel', label: '可動スペース', min: 4, max: 12, step: 0.5 },
      { key: 'beam', label: 'ばね幅', min: 0.8, max: 2.4, step: 0.1 },
      { key: 'height', label: '厚さ', min: 3, max: 8, step: 0.5 },
    ],
    defaults: { diameter: 68, travel: 7, beam: 1.2, height: 4 },
  },
  {
    id: 'living-hinge', code: 'LVH', name: 'リビングヒンジ帯', detail: '薄膜で曲がる連結パネル',
    description: '複数パネルを薄い膜で連結。ケースの折り目や試作リンクに使える、組立不要の曲がる帯です。',
    orientation: 'パネル面を下', category: 'PRINT-IN-PLACE', material: 'PETG / TPU',
    printTip: 'フィラメントの流れが折り線を横切る向きで印刷し、最初はゆっくり曲げます。',
    parameters: [
      { key: 'panels', label: 'パネル数', min: 2, max: 7, step: 1, unit: '枚' },
      { key: 'panelWidth', label: 'パネル幅', min: 14, max: 36 },
      { key: 'length', label: '帯の長さ', min: 25, max: 90 },
      { key: 'height', label: 'パネル厚', min: 2, max: 6, step: 0.5 },
      { key: 'hinge', label: '薄膜厚', min: 0.6, max: 1.6, step: 0.1 },
    ],
    defaults: { panels: 4, panelWidth: 24, length: 48, height: 3, hinge: 0.8 },
  },
  {
    id: 'gripper', code: 'GRP', name: 'フレックス・グリッパー', detail: '一体型のばねピンセット',
    description: 'U字ばねと内向きの先端を一体印刷。つまむと閉じ、離すと戻る軽作業用グリッパーです。',
    orientation: '広い面を下', category: 'PRINT-IN-PLACE', material: 'PETG推奨',
    printTip: '積層方向に沿って無理に開かず、まず数回軽く握ってばねを慣らします。',
    parameters: [
      { key: 'length', label: '全長', min: 55, max: 160 },
      { key: 'opening', label: '開口幅', min: 8, max: 30 },
      { key: 'arm', label: 'アーム幅', min: 3, max: 8, step: 0.5 },
      { key: 'height', label: '厚さ', min: 3, max: 9, step: 0.5 },
      { key: 'tip', label: '先端長さ', min: 10, max: 32 },
    ],
    defaults: { length: 105, opening: 18, arm: 5, height: 5, tip: 20 },
  },
  {
    id: 'box', code: 'BOX', name: 'オープンボックス', detail: '収納・パーツ整理',
    description: '小物整理、治具、電子工作ケースに使える、上面が開いた丈夫な箱です。',
    orientation: '底面を下', category: 'UTILITY', material: 'PLA / PETG',
    printTip: 'A1 miniでは外寸170 mm以下にするとプレート端に余裕ができます。',
    parameters: [
      { key: 'width', label: '幅 W', min: 30, max: 175 },
      { key: 'depth', label: '奥行 D', min: 30, max: 175 },
      { key: 'height', label: '高さ H', min: 15, max: 175 },
      { key: 'wall', label: '壁・底厚', min: 1.2, max: 8, step: 0.2 },
    ],
    defaults: { width: 120, depth: 80, height: 45, wall: 2.4 },
  },
  {
    id: 'clip', code: 'CLP', name: 'ケーブルクリップ', detail: '配線をすっきり固定',
    description: 'ケーブル径に合わせてパチッとはめる、横向き印刷のC型クリップです。',
    orientation: '側面を下', category: 'UTILITY', material: 'PETG推奨',
    printTip: '繰り返し着脱する場合はPETGと0.2 mm積層がおすすめです。',
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
    orientation: '円形面を下', category: 'UTILITY', material: 'PLA / PETG',
    printTip: '軸穴が小さい場合は穴の水平拡張をスライサーで調整します。',
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
    orientation: '広い底面を下', category: 'UTILITY', material: 'TPU / PETG',
    printTip: '床の滑りを抑えるならTPU、硬さ優先ならPETGが向いています。',
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
    case 'fidget-ring': return buildFidgetRing(p);
    case 'hinge': return buildHinge(p);
    case 'gear-pair': return buildGearPair(p);
    case 'flexure': return buildFlexure(p);
    case 'living-hinge': return buildLivingHinge(p);
    case 'gripper': return buildGripper(p);
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
  if (kind === 'fidget-ring' && Math.round(p.rings) !== p.rings) return 'リング数は整数で指定してください。';
  if (kind === 'living-hinge' && Math.round(p.panels) !== p.panels) return 'パネル数は整数で指定してください。';
  if (kind === 'living-hinge' && p.hinge >= p.height) return '薄膜厚はパネル厚より小さくしてください。';
  if (kind === 'flexure' && p.beam >= p.travel / 2) return 'ばね幅は可動スペースの半分未満にしてください。';
  if (kind === 'gripper' && p.tip >= p.length / 2) return '先端長さは全長の半分未満にしてください。';
  if (kind === 'gear-pair' && (Math.round(p.driveTeeth) !== p.driveTeeth || Math.round(p.drivenTeeth) !== p.drivenTeeth)) return '歯数は整数で指定してください。';
  if (kind === 'gear-pair' && p.bore >= (Math.min(p.driveTeeth, p.drivenTeeth) - 2.5) * p.module) return '軸穴が歯元径に対して大きすぎます。';
  if ((kind === 'fidget-ring' || kind === 'hinge' || kind === 'gear-pair') && p.clearance < 0.3) return 'A1 miniの0.4 mmノズルでは、可動すき間0.30 mm以上を推奨します。';
  return undefined;
}

function buildFidgetRing(p: Parameters): Mesh {
  const outerRadius = p.diameter / 2;
  const rings = Math.round(p.rings);
  const centerRadius = Math.max(5, outerRadius * 0.18);
  const available = outerRadius - centerRadius - p.clearance * rings;
  const ringWidth = available / rings;
  const triangles = cylinderZ(centerRadius, p.height, 0, 0, 80);
  let inner = centerRadius + p.clearance;
  for (let index = 0; index < rings; index++) {
    const outer = inner + ringWidth;
    triangles.push(...annularZ(inner, outer, p.height, 0, 0, 96));
    inner = outer + p.clearance;
  }
  const solidArea = Math.PI * centerRadius * centerRadius + Math.PI * rings * ringWidth * (outerRadius + centerRadius);
  return mesh(triangles, solidArea * p.height, `a1mini-nested-spinner-d${round(p.diameter)}-gap${round(p.clearance)}.stl`, [p.diameter, p.diameter, p.height]);
}

function buildHinge(p: Parameters): Mesh {
  const pinRadius = p.pin / 2;
  const sleeveInner = pinRadius + p.clearance;
  const sleeveOuter = sleeveInner + Math.max(2.2, p.pin * 0.65);
  const verticalGap = p.clearance;
  const section = (p.height - verticalGap * 2) / 3;
  const cx = p.leafLength + sleeveOuter + p.clearance;
  const cy = p.leafWidth / 2;
  const totalWidth = p.leafLength * 2 + sleeveOuter * 2 + p.clearance * 4;
  const triangles: Triangle[] = [];

  // Captive vertical pin and a small bridged head above the upper knuckle.
  triangles.push(...cylinderZ(pinRadius, p.height + p.clearance + 0.8, cx, cy, 64));
  triangles.push(...cylinderZ(pinRadius + 1.1, 0.8, cx, cy, 64, p.height + p.clearance));

  // Fixed leaf: lower and upper knuckles.
  triangles.push(...annularZ(sleeveInner, sleeveOuter, section, cx, cy, 72, 0));
  triangles.push(...annularZ(sleeveInner, sleeveOuter, section, cx, cy, 72, section * 2 + verticalGap * 2));
  triangles.push(...boxTriangles(0, 0, 0, p.leafLength, p.leafWidth, p.height));
  triangles.push(...boxTriangles(p.leafLength - 0.6, cy - sleeveOuter * 0.7, 0, cx - sleeveOuter + 0.4, cy + sleeveOuter * 0.7, section));
  triangles.push(...boxTriangles(p.leafLength - 0.6, cy - sleeveOuter * 0.7, section * 2 + verticalGap * 2, cx - sleeveOuter + 0.4, cy + sleeveOuter * 0.7, p.height));

  // Moving leaf: middle knuckle, isolated vertically from the fixed knuckles.
  const middleZ = section + verticalGap;
  triangles.push(...annularZ(sleeveInner, sleeveOuter, section, cx, cy, 72, middleZ));
  const rightStart = cx + sleeveOuter + p.clearance;
  triangles.push(...boxTriangles(rightStart, 0, 0, totalWidth, p.leafWidth, p.height));
  triangles.push(...boxTriangles(cx + sleeveOuter - 0.4, cy - sleeveOuter * 0.7, middleZ, rightStart + 0.6, cy + sleeveOuter * 0.7, middleZ + section));

  const leafVolume = p.leafLength * p.leafWidth * p.height * 2;
  const sleeveVolume = Math.PI * (sleeveOuter ** 2 - sleeveInner ** 2) * section * 3;
  const pinVolume = Math.PI * pinRadius ** 2 * (p.height + p.clearance + 0.8);
  return mesh(triangles, leafVolume + sleeveVolume + pinVolume, `a1mini-print-in-place-hinge-${round(totalWidth)}mm.stl`, [totalWidth, p.leafWidth, p.height + p.clearance + 0.8]);
}

function buildGearPair(p: Parameters): Mesh {
  const driveTeeth = Math.round(p.driveTeeth);
  const drivenTeeth = Math.round(p.drivenTeeth);
  const pitchA = driveTeeth * p.module / 2;
  const pitchB = drivenTeeth * p.module / 2;
  const outerA = pitchA + p.module;
  const outerB = pitchB + p.module;
  const centerDistance = pitchA + pitchB + p.clearance;
  const maxRadius = Math.max(outerA, outerB);
  const centerA: [number, number] = [outerA, maxRadius];
  const centerB: [number, number] = [outerA + centerDistance, maxRadius];
  const triangles = gearRing(driveTeeth, p.module, p.bore / 2, p.height, centerA[0], centerA[1], 0);
  triangles.push(...gearRing(drivenTeeth, p.module, p.bore / 2, p.height, centerB[0], centerB[1], Math.PI / drivenTeeth));
  const dimensions: [number, number, number] = [outerA + centerDistance + outerB, maxRadius * 2, p.height];
  const areaA = Math.PI * (pitchA ** 2 - (p.bore / 2) ** 2) * 1.08;
  const areaB = Math.PI * (pitchB ** 2 - (p.bore / 2) ** 2) * 1.08;
  return mesh(triangles, (areaA + areaB) * p.height, `a1mini-gear-pair-${driveTeeth}t-${drivenTeeth}t-m${round(p.module)}.stl`, dimensions);
}

function buildFlexure(p: Parameters): Mesh {
  const outerRadius = p.diameter / 2;
  const rim = Math.max(3.6, p.diameter * 0.065);
  const ringInner = outerRadius - rim;
  const discRadius = ringInner - p.travel;
  const cx = outerRadius, cy = outerRadius;
  const triangles = annularZ(ringInner, outerRadius, p.height, cx, cy, 96);
  triangles.push(...cylinderZ(discRadius, p.height, cx, cy, 80));
  for (let index = 0; index < 4; index++) {
    const angle = Math.PI * 2 * index / 4;
    const innerAngle = angle + 0.48;
    const outerAngle = angle - 0.48;
    const start: [number, number] = [cx + (discRadius - 0.5) * Math.cos(innerAngle), cy + (discRadius - 0.5) * Math.sin(innerAngle)];
    const end: [number, number] = [cx + (ringInner + 0.5) * Math.cos(outerAngle), cy + (ringInner + 0.5) * Math.sin(outerAngle)];
    triangles.push(...beamPrism(start[0], start[1], end[0], end[1], p.beam, p.height));
  }
  const ringArea = Math.PI * (outerRadius ** 2 - ringInner ** 2);
  const discArea = Math.PI * discRadius ** 2;
  const beamLength = Math.hypot(ringInner - discRadius, p.travel * 0.9);
  return mesh(triangles, (ringArea + discArea + beamLength * p.beam * 4) * p.height, `a1mini-flexure-fidget-d${round(p.diameter)}.stl`, [p.diameter, p.diameter, p.height]);
}

function buildLivingHinge(p: Parameters): Mesh {
  const panels = Math.round(p.panels);
  const gap = 1.2;
  const totalWidth = panels * p.panelWidth + (panels - 1) * gap;
  const triangles: Triangle[] = [];
  for (let index = 0; index < panels; index++) {
    const x0 = index * (p.panelWidth + gap);
    triangles.push(...boxTriangles(x0, 0, 0, x0 + p.panelWidth, p.length, p.height));
    if (index < panels - 1) {
      const jointStart = x0 + p.panelWidth - 0.6;
      triangles.push(...boxTriangles(jointStart, 0, 0, jointStart + gap + 1.2, p.length, p.hinge));
    }
  }
  const panelVolume = panels * p.panelWidth * p.length * p.height;
  const hingeVolume = (panels - 1) * (gap + 1.2) * p.length * p.hinge;
  return mesh(triangles, panelVolume + hingeVolume, `a1mini-living-hinge-${panels}panel.stl`, [totalWidth, p.length, p.height]);
}

function buildGripper(p: Parameters): Mesh {
  const totalWidth = p.opening + p.arm * 2;
  const baseLength = Math.max(12, p.arm * 2.4);
  const tipReach = p.opening * 0.36;
  const triangles: Triangle[] = [];
  triangles.push(...boxTriangles(0, 0, 0, baseLength, totalWidth, p.height));
  triangles.push(...boxTriangles(baseLength - 0.6, 0, 0, p.length, p.arm, p.height));
  triangles.push(...boxTriangles(baseLength - 0.6, p.arm + p.opening, 0, p.length, totalWidth, p.height));
  triangles.push(...boxTriangles(p.length - p.tip, p.arm - 0.2, 0, p.length, p.arm + tipReach, p.height));
  triangles.push(...boxTriangles(p.length - p.tip, p.arm + p.opening - tipReach, 0, p.length, p.arm + p.opening + 0.2, p.height));
  const volume = baseLength * totalWidth * p.height + (p.length - baseLength) * p.arm * p.height * 2 + p.tip * tipReach * p.height * 2;
  return mesh(triangles, volume, `a1mini-flex-gripper-${round(p.length)}mm.stl`, [p.length, totalWidth, p.height]);
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

function cylinderZ(radius: number, height: number, cx: number, cy: number, segments: number, z0 = 0): Triangle[] {
  const triangles: Triangle[] = [];
  const bottomCenter: Vec3 = [cx, cy, z0];
  const topCenter: Vec3 = [cx, cy, z0 + height];
  for (let index = 0; index < segments; index++) {
    const angle0 = Math.PI * 2 * index / segments;
    const angle1 = Math.PI * 2 * (index + 1) / segments;
    const b0: Vec3 = [cx + radius * Math.cos(angle0), cy + radius * Math.sin(angle0), z0];
    const b1: Vec3 = [cx + radius * Math.cos(angle1), cy + radius * Math.sin(angle1), z0];
    const t0: Vec3 = [b0[0], b0[1], z0 + height];
    const t1: Vec3 = [b1[0], b1[1], z0 + height];
    triangles.push([bottomCenter, b1, b0], [topCenter, t0, t1]);
    addQuad(triangles, b0, b1, t1, t0);
  }
  return triangles;
}

function annularZ(inner: number, outer: number, height: number, cx: number, cy: number, segments: number, z0 = 0): Triangle[] {
  const triangles: Triangle[] = [];
  for (let index = 0; index < segments; index++) {
    const angle0 = Math.PI * 2 * index / segments;
    const angle1 = Math.PI * 2 * (index + 1) / segments;
    const point = (radius: number, angle: number, z: number): Vec3 => [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle), z];
    const ob0 = point(outer, angle0, z0), ob1 = point(outer, angle1, z0);
    const ot0 = point(outer, angle0, z0 + height), ot1 = point(outer, angle1, z0 + height);
    const ib0 = point(inner, angle0, z0), ib1 = point(inner, angle1, z0);
    const it0 = point(inner, angle0, z0 + height), it1 = point(inner, angle1, z0 + height);
    addQuad(triangles, ob0, ob1, ot1, ot0);
    addQuad(triangles, ib1, ib0, it0, it1);
    addQuad(triangles, ib0, ib1, ob1, ob0);
    addQuad(triangles, ot0, ot1, it1, it0);
  }
  return triangles;
}

function gearRing(teeth: number, moduleSize: number, boreRadius: number, height: number, cx: number, cy: number, rotation: number): Triangle[] {
  const triangles: Triangle[] = [];
  const pitchRadius = teeth * moduleSize / 2;
  const tipRadius = pitchRadius + moduleSize;
  const rootRadius = Math.max(boreRadius + 1.8, pitchRadius - moduleSize * 1.25);
  const steps = teeth * 4;
  const outerPoints: [number, number][] = [];
  const innerPoints: [number, number][] = [];
  for (let index = 0; index < steps; index++) {
    const phase = index % 4;
    const radius = phase === 1 || phase === 2 ? tipRadius : rootRadius;
    const angle = rotation + Math.PI * 2 * index / steps;
    outerPoints.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
    innerPoints.push([cx + boreRadius * Math.cos(angle), cy + boreRadius * Math.sin(angle)]);
  }
  for (let index = 0; index < steps; index++) {
    const next = (index + 1) % steps;
    const ob0: Vec3 = [outerPoints[index][0], outerPoints[index][1], 0];
    const ob1: Vec3 = [outerPoints[next][0], outerPoints[next][1], 0];
    const ot0: Vec3 = [outerPoints[index][0], outerPoints[index][1], height];
    const ot1: Vec3 = [outerPoints[next][0], outerPoints[next][1], height];
    const ib0: Vec3 = [innerPoints[index][0], innerPoints[index][1], 0];
    const ib1: Vec3 = [innerPoints[next][0], innerPoints[next][1], 0];
    const it0: Vec3 = [innerPoints[index][0], innerPoints[index][1], height];
    const it1: Vec3 = [innerPoints[next][0], innerPoints[next][1], height];
    addQuad(triangles, ob0, ob1, ot1, ot0);
    addQuad(triangles, ib1, ib0, it0, it1);
    addQuad(triangles, ib0, ib1, ob1, ob0);
    addQuad(triangles, ot0, ot1, it1, it0);
  }
  return triangles;
}

function beamPrism(x0: number, y0: number, x1: number, y1: number, width: number, height: number): Triangle[] {
  const length = Math.hypot(x1 - x0, y1 - y0) || 1;
  const px = -(y1 - y0) / length * width / 2;
  const py = (x1 - x0) / length * width / 2;
  const points: [number, number][] = [[x0 + px, y0 + py], [x1 + px, y1 + py], [x1 - px, y1 - py], [x0 - px, y0 - py]];
  const bottom = points.map(([x, y]) => [x, y, 0] as Vec3);
  const top = points.map(([x, y]) => [x, y, height] as Vec3);
  const triangles: Triangle[] = [[bottom[0], bottom[2], bottom[1]], [bottom[0], bottom[3], bottom[2]], [top[0], top[1], top[2]], [top[0], top[2], top[3]]];
  for (let index = 0; index < 4; index++) addQuad(triangles, bottom[index], bottom[(index + 1) % 4], top[(index + 1) % 4], top[index]);
  return triangles;
}

function boxTriangles(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): Triangle[] {
  const triangles: Triangle[] = [];
  const a: Vec3 = [x0, y0, z0], b: Vec3 = [x1, y0, z0], c: Vec3 = [x1, y1, z0], d: Vec3 = [x0, y1, z0];
  const e: Vec3 = [x0, y0, z1], f: Vec3 = [x1, y0, z1], g: Vec3 = [x1, y1, z1], h: Vec3 = [x0, y1, z1];
  addQuad(triangles, a, d, c, b);
  addQuad(triangles, e, f, g, h);
  addQuad(triangles, a, b, f, e);
  addQuad(triangles, b, c, g, f);
  addQuad(triangles, c, d, h, g);
  addQuad(triangles, d, a, e, h);
  return triangles;
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

