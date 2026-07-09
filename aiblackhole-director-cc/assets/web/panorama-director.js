import * as THREE from "three";
import { TransformControls } from "./vendor/three/addons/controls/TransformControls.js";

const dom = {
  canvas: document.getElementById("stage"),
  viewer: document.getElementById("viewer"),
  emptyState: document.getElementById("emptyState"),
  fileInput: document.getElementById("fileInput"),
  sceneInput: document.getElementById("sceneInput"),
  fileMeta: document.getElementById("fileMeta"),
  toast: document.getElementById("toast"),
  languageButton: document.getElementById("languageButton"),
  panelToggleButton: document.getElementById("panelToggleButton"),
  hidePanelButton: document.getElementById("hidePanelButton"),
  undoButton: document.getElementById("undoButton"),
  redoButton: document.getElementById("redoButton"),
  objectSelect: document.getElementById("objectSelect"),
  layerList: document.getElementById("layerList"),
  duplicateButton: document.getElementById("duplicateButton"),
  deleteButton: document.getElementById("deleteButton"),
  selectionBadge: document.getElementById("selectionBadge"),
  colorInput: document.getElementById("colorInput"),
  lockButton: document.getElementById("lockButton"),
  scaleInput: document.getElementById("scaleInput"),
  poseSelect: document.getElementById("poseSelect"),
  partsGrid: document.getElementById("partsGrid"),
  poseSection: document.getElementById("poseSection"),
  showSkeletonInput: document.getElementById("showSkeletonInput"),
  hideOccludersInShot: document.getElementById("hideOccludersInShot"),
  transformButtons: Array.from(document.querySelectorAll("[data-transform-mode]")),
  pos: {
    x: document.getElementById("posX"),
    y: document.getElementById("posY"),
    z: document.getElementById("posZ"),
  },
  rot: {
    x: document.getElementById("rotX"),
    y: document.getElementById("rotY"),
    z: document.getElementById("rotZ"),
  },
  joints: {
    headYaw: document.getElementById("headYaw"),
    headPitch: document.getElementById("headPitch"),
    headRoll: document.getElementById("headRoll"),
    waistYaw: document.getElementById("waistYaw"),
    waistBend: document.getElementById("waistBend"),
    waistSide: document.getElementById("waistSide"),
    bodyPitch: document.getElementById("bodyPitch"),
    leftShoulder: document.getElementById("leftShoulder"),
    rightShoulder: document.getElementById("rightShoulder"),
    leftShoulderTwist: document.getElementById("leftShoulderTwist"),
    rightShoulderTwist: document.getElementById("rightShoulderTwist"),
    leftShoulderOut: document.getElementById("leftShoulderOut"),
    rightShoulderOut: document.getElementById("rightShoulderOut"),
    leftElbow: document.getElementById("leftElbow"),
    rightElbow: document.getElementById("rightElbow"),
    leftPalmTwist: document.getElementById("leftPalmTwist"),
    rightPalmTwist: document.getElementById("rightPalmTwist"),
    leftPalmPitch: document.getElementById("leftPalmPitch"),
    rightPalmPitch: document.getElementById("rightPalmPitch"),
    leftPalmSide: document.getElementById("leftPalmSide"),
    rightPalmSide: document.getElementById("rightPalmSide"),
    leftHip: document.getElementById("leftHip"),
    rightHip: document.getElementById("rightHip"),
    leftHipTwist: document.getElementById("leftHipTwist"),
    rightHipTwist: document.getElementById("rightHipTwist"),
    leftHipOut: document.getElementById("leftHipOut"),
    rightHipOut: document.getElementById("rightHipOut"),
    leftKnee: document.getElementById("leftKnee"),
    rightKnee: document.getElementById("rightKnee"),
    leftFootPitch: document.getElementById("leftFootPitch"),
    rightFootPitch: document.getElementById("rightFootPitch"),
  },
};

const APP_VERSION = "v1.4.1";
const LANGUAGE_STORAGE_KEY = "panorama-director-language";

const translations = {
  zh: {
    pageTitle: "720° 全景导演台 v1.4.1",
    canvasLabel: "720 全景导演台画面",
    emptyTitle: "全景导演台",
    emptyDescription: "先上传一张 720°/等距柱状全景图，然后添加角色、物体、遮挡物和机位构图。v1.4.1 支持批量选择、整体变换、骨骼可视化和撤销/重做。",
    emptyUpload: "上传全景图片",
    emptyHint: "也可以把图片直接拖到页面中",
    upload: "上传全景",
    screenshot: "保存当前视角为 PNG（S）",
    resetCamera: "重置机位（R）",
    fullscreen: "全画面（F）",
    exitFullscreen: "退出全画面（F）",
    fullscreenAria: "切换全画面（F）",
    languageTitle: "Switch to English",
    panelTitle: "导演台",
    hidePanel: "隐藏",
    showDirector: "显示导演台（H）",
    hideDirector: "隐藏导演台（H）",
    noImage: "未加载全景图片",
    dropLabel: "松开以上传全景图片",
    add: "添加",
    character: "角色",
    crowdArray: "群众阵列",
    cube: "正方体",
    sphere: "球体",
    occluderPlane: "遮挡平面",
    occluderCircle: "遮挡圆形",
    occluderBox: "遮挡盒",
    occluderSphere: "遮挡球体",
    occluderDefault: "遮挡物",
    objectDefault: "物体",
    addHelp: "遮挡物在编辑时半透明显示，截图时可作为不可见深度遮罩，用来挡住角色身体局部。",
    object: "对象",
    currentObject: "当前对象",
    duplicate: "复制",
    delete: "删除",
    multiSelect: "批量选择",
    multiHelp: "列表支持 Ctrl/Command 多选，Shift 选择连续范围；多选后会显示每个对象的中心 XYZ 轴，并可作为整体移动、旋转、缩放、复制和删除。",
    appearance: "外观",
    color: "颜色",
    lockObject: "锁定对象",
    lockAction: "锁定",
    unlockAction: "解锁",
    size: "大小",
    tools: "工具",
    translate: "移动",
    rotate: "旋转",
    scale: "缩放",
    toolHelp: "点击对象后可直接拖动，或使用三轴手柄精确调整。空白处拖动画面，滚轮缩放视角。",
    poseSection: "角色姿势",
    posePreset: "姿势预设",
    groupHead: "头部",
    groupUpperArm: "上臂",
    groupElbow: "肘",
    groupPalm: "手掌",
    groupWaist: "腰部",
    groupThigh: "大腿",
    groupKnee: "膝",
    groupFoot: "脚掌",
    groupBodyPitch: "身体俯仰",
    headYaw: "头部转向",
    headPitch: "低头 / 抬头",
    headRoll: "头部侧歪",
    waistYaw: "腰部左右",
    waistBend: "腰部弯挺",
    waistSide: "腰部侧弯",
    leftShoulder: "左上臂前后",
    rightShoulder: "右上臂前后",
    leftShoulderTwist: "左上臂旋转",
    rightShoulderTwist: "右上臂旋转",
    leftShoulderOut: "左上臂外侧",
    rightShoulderOut: "右上臂外侧",
    leftElbow: "左肘前后",
    rightElbow: "右肘前后",
    leftPalmTwist: "左手掌内外",
    rightPalmTwist: "右手掌内外",
    leftPalmPitch: "左手掌上下",
    rightPalmPitch: "右手掌上下",
    leftPalmSide: "左手掌侧向",
    rightPalmSide: "右手掌侧向",
    leftHip: "左大腿前后",
    rightHip: "右大腿前后",
    leftHipTwist: "左大腿旋转",
    rightHipTwist: "右大腿旋转",
    leftHipOut: "左大腿外侧",
    rightHipOut: "右大腿外侧",
    leftKnee: "左膝前后",
    rightKnee: "右膝前后",
    leftFootPitch: "左脚掌上下",
    rightFootPitch: "右脚掌上下",
    bodyPitch: "身体俯仰",
    showSkeleton: "显示角色骨骼（截图时自动隐藏）",
    position: "XYZ 平移",
    rotation: "XYZ 旋转",
    occlusionExport: "遮挡与导出",
    hideOccluders: "截图时隐藏遮挡物，仅保留遮挡效果",
    saveScene: "保存场景",
    loadScene: "加载场景",
    history: "历史",
    undo: "撤销",
    redo: "重做",
    historyHelp: "快捷键：Ctrl+Z 撤销，Ctrl+Y 或 Ctrl+Shift+Z 重做。",
    noObjects: "暂无对象",
    selected: "已选",
    locked: "已锁定",
    selectedCount: "已选择 {count} 个",
    noSelection: "未选择",
    added: "已添加 {name}",
    addedCrowd: "已添加 {count} 个角色群众阵列",
    objectLimitReached: "总对象最多 {max} 个，请删除一些对象后再添加。",
    characterLimitReached: "角色最多 {max} 个，请删除一些角色后再添加。",
    occluderLimitReached: "遮挡物最多 {max} 个，请删除一些遮挡物后再添加。",
    crowdLimitReached: "无法添加群众阵列：总对象或角色数量已达到上限。",
    crowdPartialAdded: "剩余额度不足，已添加 {count} 个角色。",
    copiedOne: "已复制 {name}",
    copiedMany: "已复制 {count} 个对象",
    deletedOne: "对象已删除",
    deletedMany: "已删除 {count} 个对象",
    cameraReset: "机位已重置",
    fullscreenDenied: "浏览器未允许进入全画面",
    chooseImage: "请选择图片文件",
    panoramaLoaded: "全景图片已加载",
    flatLoaded: "普通图片已加载，已进入固定画面导演台",
    imageLoadFailed: "图片加载失败，请换一张全景图重试",
    screenshotSaved: "当前机位截图已保存",
    screenshotCopied: "当前机位截图已保存并复制到剪贴板",
    screenshotCopyFailed: "当前机位截图已保存，但剪贴板不可用",
    sceneSaved: "场景 JSON 已保存",
    sceneLoaded: "场景 JSON 已加载",
    sceneParseFailed: "场景 JSON 解析失败",
    sceneRestored: "场景已恢复",
    undoDone: "已撤销",
    redoDone: "已重做",
    screenshotFile: "全景导演台",
    sceneFile: "全景导演台场景",
    defaultImageName: "全景图片",
  },
  en: {
    pageTitle: "720° Panorama Director v1.4.1",
    canvasLabel: "720 panorama director canvas",
    emptyTitle: "Panorama Director",
    emptyDescription: "Upload a 720°/equirectangular panorama, then add characters, objects, occluders, and camera blocking. v1.4.1 supports multi-select, group transforms, skeleton visualization, and undo/redo.",
    emptyUpload: "Upload Panorama",
    emptyHint: "You can also drag an image onto the page.",
    upload: "Upload",
    screenshot: "Save current view as PNG (S)",
    resetCamera: "Reset camera (R)",
    fullscreen: "Fullscreen (F)",
    exitFullscreen: "Exit fullscreen (F)",
    fullscreenAria: "Toggle fullscreen (F)",
    languageTitle: "切换到中文",
    panelTitle: "Director",
    hidePanel: "Hide",
    showDirector: "Show Director (H)",
    hideDirector: "Hide Director (H)",
    noImage: "No panorama loaded",
    dropLabel: "Release to upload panorama image",
    add: "Add",
    character: "Character",
    crowdArray: "Crowd Array",
    cube: "Cube",
    sphere: "Sphere",
    occluderPlane: "Occluder Plane",
    occluderCircle: "Occluder Circle",
    occluderBox: "Occluder Box",
    occluderSphere: "Occluder Sphere",
    occluderDefault: "Occluder",
    objectDefault: "Object",
    addHelp: "Occluders are translucent while editing. In screenshots, they can become invisible depth masks that block character body parts.",
    object: "Object",
    currentObject: "Current Object",
    duplicate: "Duplicate",
    delete: "Delete",
    multiSelect: "Multi-Select",
    multiHelp: "Use Ctrl/Command to multi-select, or Shift to select a range. Multi-selected objects show center XYZ axes and can move, rotate, scale, duplicate, or delete as one group.",
    appearance: "Appearance",
    color: "Color",
    lockObject: "Lock Object",
    lockAction: "Lock",
    unlockAction: "Unlock",
    size: "Size",
    tools: "Tools",
    translate: "Move",
    rotate: "Rotate",
    scale: "Scale",
    toolHelp: "Click an object to drag it, or use the three-axis handles for precise edits. Drag empty space to look around; use the mouse wheel to zoom.",
    poseSection: "Character Pose",
    posePreset: "Pose Preset",
    groupHead: "Head",
    groupUpperArm: "Upper Arm",
    groupElbow: "Elbow",
    groupPalm: "Palm",
    groupWaist: "Waist",
    groupThigh: "Thigh",
    groupKnee: "Knee",
    groupFoot: "Foot",
    groupBodyPitch: "Body Pitch",
    headYaw: "Head Turn",
    headPitch: "Head Pitch",
    headRoll: "Head Tilt",
    waistYaw: "Waist Turn",
    waistBend: "Waist Bend",
    waistSide: "Waist Side Bend",
    leftShoulder: "Left Upper Arm Forward",
    rightShoulder: "Right Upper Arm Forward",
    leftShoulderTwist: "Left Upper Arm Twist",
    rightShoulderTwist: "Right Upper Arm Twist",
    leftShoulderOut: "Left Upper Arm Out",
    rightShoulderOut: "Right Upper Arm Out",
    leftElbow: "Left Elbow Bend",
    rightElbow: "Right Elbow Bend",
    leftPalmTwist: "Left Palm In/Out",
    rightPalmTwist: "Right Palm In/Out",
    leftPalmPitch: "Left Palm Up/Down",
    rightPalmPitch: "Right Palm Up/Down",
    leftPalmSide: "Left Palm Side",
    rightPalmSide: "Right Palm Side",
    leftHip: "Left Thigh Forward",
    rightHip: "Right Thigh Forward",
    leftHipTwist: "Left Thigh Twist",
    rightHipTwist: "Right Thigh Twist",
    leftHipOut: "Left Thigh Out",
    rightHipOut: "Right Thigh Out",
    leftKnee: "Left Knee Bend",
    rightKnee: "Right Knee Bend",
    leftFootPitch: "Left Foot Up/Down",
    rightFootPitch: "Right Foot Up/Down",
    bodyPitch: "Body Pitch",
    showSkeleton: "Show character skeleton (hidden in screenshots)",
    position: "XYZ Position",
    rotation: "XYZ Rotation",
    occlusionExport: "Occlusion & Export",
    hideOccluders: "Hide occluders in screenshots and keep only their masking effect",
    saveScene: "Save Scene",
    loadScene: "Load Scene",
    history: "History",
    undo: "Undo",
    redo: "Redo",
    historyHelp: "Shortcuts: Ctrl+Z to undo, Ctrl+Y or Ctrl+Shift+Z to redo.",
    noObjects: "No objects",
    selected: "Selected",
    locked: "Locked",
    selectedCount: "{count} selected",
    noSelection: "No selection",
    added: "Added {name}",
    addedCrowd: "Added {count} crowd characters",
    objectLimitReached: "You can create up to {max} objects. Delete some objects before adding more.",
    characterLimitReached: "You can create up to {max} characters. Delete some characters before adding more.",
    occluderLimitReached: "You can create up to {max} occluders. Delete some occluders before adding more.",
    crowdLimitReached: "Cannot add a crowd array: the total object or character limit has been reached.",
    crowdPartialAdded: "Not enough remaining capacity; added {count} characters.",
    copiedOne: "Duplicated {name}",
    copiedMany: "Duplicated {count} objects",
    deletedOne: "Object deleted",
    deletedMany: "Deleted {count} objects",
    cameraReset: "Camera reset",
    fullscreenDenied: "The browser did not allow fullscreen",
    chooseImage: "Please choose an image file",
    panoramaLoaded: "Panorama image loaded",
    flatLoaded: "Regular image loaded. Fixed-frame director mode is active.",
    imageLoadFailed: "Image failed to load. Please try another panorama.",
    screenshotSaved: "Current camera view saved",
    screenshotCopied: "Current camera view saved and copied to clipboard",
    screenshotCopyFailed: "Current camera view saved, but clipboard copy is unavailable",
    sceneSaved: "Scene JSON saved",
    sceneLoaded: "Scene JSON loaded",
    sceneParseFailed: "Scene JSON parse failed",
    sceneRestored: "Scene restored",
    undoDone: "Undone",
    redoDone: "Redone",
    screenshotFile: "panorama-director",
    sceneFile: "panorama-director-scene",
    defaultImageName: "Panorama Image",
  },
};

const poseLabels = {
  zh: {
    standing: "直立",
    bowing: "弯腰",
    sitting: "坐",
    kneeling: "跪",
    squatting: "蹲",
    supine: "躺",
    prone: "趴",
    walking: "行走",
    pointing: "指向",
  },
  en: {
    standing: "Standing",
    bowing: "Bowing",
    sitting: "Sitting",
    kneeling: "Kneeling",
    squatting: "Squatting",
    supine: "Lying",
    prone: "Prone",
    walking: "Walking",
    pointing: "Pointing",
  },
};

const partLabels = {
  zh: {
    head: "头部",
    torso: "身体",
    leftArm: "左手",
    rightArm: "右手",
    leftLeg: "左腿",
    rightLeg: "右腿",
  },
  en: {
    head: "Head",
    torso: "Body",
    leftArm: "Left Arm",
    rightArm: "Right Arm",
    leftLeg: "Left Leg",
    rightLeg: "Right Leg",
  },
};

const poseNames = poseLabels.zh;

const jointMap = {
  headYaw: { part: "headPivot", axis: "y", sign: 1, min: -100, max: 100 },
  headPitch: { part: "headPivot", axis: "x", sign: -1, min: -50, max: 50 },
  headRoll: { part: "headPivot", axis: "z", sign: 1, min: -30, max: 30 },
  waistYaw: { part: "waistYawPivot", axis: "y", sign: 1, min: -90, max: 90 },
  waistBend: { part: "torsoPivot", axis: "x", sign: -1, min: -100, max: 60 },
  waistSide: { part: "torsoPivot", axis: "z", sign: 1, min: -30, max: 30 },
  bodyPitch: { part: "poseRoot", axis: "x", sign: -1, min: -90, max: 90 },
  leftShoulder: { part: "leftArm", axis: "x", sign: -1 },
  rightShoulder: { part: "rightArm", axis: "x", sign: -1 },
  leftShoulderTwist: { part: "leftArm", axis: "y", sign: 1, min: -90, max: 180 },
  rightShoulderTwist: { part: "rightArm", axis: "y", sign: -1, min: -90, max: 180 },
  leftShoulderOut: { part: "leftArm", axis: "z", sign: 1, min: 0, max: 180 },
  rightShoulderOut: { part: "rightArm", axis: "z", sign: -1, min: 0, max: 180 },
  leftElbow: { part: "leftForearm", axis: "x", sign: -1, min: 0, max: 170 },
  rightElbow: { part: "rightForearm", axis: "x", sign: -1, min: 0, max: 170 },
  leftPalmTwist: { part: "leftHand", axis: "y", sign: 1, min: -90, max: 90 },
  rightPalmTwist: { part: "rightHand", axis: "y", sign: -1, min: -90, max: 90 },
  leftPalmPitch: { part: "leftHand", axis: "x", sign: -1, min: -90, max: 90 },
  rightPalmPitch: { part: "rightHand", axis: "x", sign: -1, min: -90, max: 90 },
  leftPalmSide: { part: "leftHand", axis: "z", sign: 1, min: -90, max: 90 },
  rightPalmSide: { part: "rightHand", axis: "z", sign: -1, min: -90, max: 90 },
  leftHip: { part: "leftLegPitch", axis: "x", sign: -1, min: -120, max: 160 },
  rightHip: { part: "rightLegPitch", axis: "x", sign: -1, min: -120, max: 160 },
  leftHipTwist: { part: "leftLegTwist", axis: "y", sign: 1, min: -90, max: 90 },
  rightHipTwist: { part: "rightLegTwist", axis: "y", sign: -1, min: -90, max: 90 },
  leftHipOut: { part: "leftLegOut", axis: "z", sign: 1, min: -30, max: 160 },
  rightHipOut: { part: "rightLegOut", axis: "z", sign: -1, min: -30, max: 160 },
  leftKnee: { part: "leftShin", axis: "x", sign: 1, min: 0, max: 140 },
  rightKnee: { part: "rightShin", axis: "x", sign: 1, min: 0, max: 140 },
  leftFootPitch: { part: "leftFoot", axis: "x", sign: -1, min: -90, max: 70 },
  rightFootPitch: { part: "rightFoot", axis: "x", sign: -1, min: -90, max: 70 },
};

const MIN_SCALE = 0.05;
const MAX_OBJECTS = 100;
const MAX_CHARACTERS = 40;
const MAX_OCCLUDERS = 80;
const PANORAMA_RATIO = 2;
const PANORAMA_RATIO_TOLERANCE = 0.15;
const FLAT_IMAGE_DISTANCE = 6;
const FLAT_OBJECT_Z = -3.2;
const MANNEQUIN_CENTER_OFFSET_Y = 0.74;
const MANNEQUIN_HIP_X = 0.15;
const MANNEQUIN_HIP_Y = 0.78;
const MANNEQUIN_DEFAULT_ARM_OUT = 0.08;
const MANNEQUIN_DEFAULT_ARM_OUT_DEGREES = THREE.MathUtils.radToDeg(MANNEQUIN_DEFAULT_ARM_OUT);

function savedLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) === "en" ? "en" : "zh";
  } catch {
    return "zh";
  }
}

const state = {
  objects: [],
  selected: null,
  selectedIds: new Set(),
  lastLayerSelectionIndex: null,
  panoramaMesh: null,
  panoramaTexture: null,
  panoramaInfo: null,
  viewMode: "empty",
  flatImageSize: new THREE.Vector2(0, 0),
  yaw: 0,
  pitch: 0,
  targetYaw: 0,
  targetPitch: 0,
  fov: 72,
  targetFov: 72,
  nextId: 1,
  characterCount: 1,
  primitiveCounts: {
    cube: 1,
    sphere: 1,
  },
  occluderCounts: {
    plane: 1,
    circle: 1,
    box: 1,
    sphere: 1,
  },
  transformMode: "translate",
  isTransformDragging: false,
  isCameraDragging: false,
  isObjectDragging: false,
  previousPointer: new THREE.Vector2(),
  dragPlane: new THREE.Plane(),
  dragOffset: new THREE.Vector3(),
  pointer: new THREE.Vector2(),
  raycaster: new THREE.Raycaster(),
  multiTransformStart: null,
  showSkeleton: false,
  language: savedLanguage(),
  history: {
    undo: [],
    redo: [],
    current: "",
    paused: false,
    max: 60,
  },
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07090d);

const camera = new THREE.PerspectiveCamera(state.fov, 1, 0.01, 1200);
camera.position.set(0, 0, 0);
camera.rotation.order = "YXZ";

const renderer = new THREE.WebGLRenderer({
  canvas: dom.canvas,
  antialias: true,
  preserveDrawingBuffer: true,
  alpha: false,
});
renderer.setClearColor(0x07090d, 1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.sortObjects = true;

const transformControls = new TransformControls(camera, renderer.domElement);
transformControls.setMode(state.transformMode);
transformControls.setSpace("local");
transformControls.addEventListener("dragging-changed", (event) => {
  state.isTransformDragging = event.value;
  if (event.value) {
    beginMultiTransform();
  } else {
    applyMultiTransform();
    state.multiTransformStart = null;
    clampSelectedScale();
    updateSelectionPivot();
    updateSelectionMarkers();
    syncPanel();
    rememberHistory();
  }
});
transformControls.addEventListener("objectChange", () => {
  if (state.multiTransformStart) applyMultiTransform();
  else clampSelectedScale();
  syncPanel();
});
scene.add(transformControls);

const ambient = new THREE.HemisphereLight(0xffffff, 0x263041, 2.2);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.3);
keyLight.position.set(3, 4, 2);
scene.add(keyLight);

const selectionPivot = new THREE.Group();
selectionPivot.name = "selection-pivot";
selectionPivot.visible = false;
selectionPivot.userData.selectable = false;
scene.add(selectionPivot);

const selectionMarkerGroup = new THREE.Group();
selectionMarkerGroup.name = "selection-center-markers";
selectionMarkerGroup.userData.selectable = false;
scene.add(selectionMarkerGroup);

const skeletonLineGeometry = new THREE.BufferGeometry();
const skeletonPointGeometry = new THREE.BufferGeometry();
const skeletonLineMaterial = new THREE.LineBasicMaterial({
  color: 0xfff176,
  transparent: true,
  opacity: 0.95,
  depthTest: false,
});
const skeletonPointMaterial = new THREE.PointsMaterial({
  color: 0x80e8c8,
  size: 0.055,
  sizeAttenuation: true,
  depthTest: false,
});
const mannequinSkeletonGroup = new THREE.Group();
mannequinSkeletonGroup.name = "mannequin-skeleton-overlay";
mannequinSkeletonGroup.visible = false;
mannequinSkeletonGroup.userData.selectable = false;
const skeletonLines = new THREE.LineSegments(skeletonLineGeometry, skeletonLineMaterial);
skeletonLines.name = "mannequin-skeleton-lines";
skeletonLines.renderOrder = 1001;
skeletonLines.userData.selectable = false;
const skeletonPoints = new THREE.Points(skeletonPointGeometry, skeletonPointMaterial);
skeletonPoints.name = "mannequin-skeleton-joints";
skeletonPoints.renderOrder = 1002;
skeletonPoints.userData.selectable = false;
mannequinSkeletonGroup.add(skeletonLines, skeletonPoints);
scene.add(mannequinSkeletonGroup);

function worldPoint(object, localOffset = null) {
  if (!object) return null;
  if (localOffset) return object.localToWorld(localOffset.clone());
  return object.getWorldPosition(new THREE.Vector3());
}

function addSkeletonEdge(positions, a, b) {
  if (!a || !b) return;
  positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
}

function addSkeletonPoint(positions, point) {
  if (!point) return;
  positions.push(point.x, point.y, point.z);
}

function mannequinSkeletonPoints(item) {
  const parts = item.parts || {};
  return {
    hips: worldPoint(parts.poseRoot, new THREE.Vector3(0, MANNEQUIN_HIP_Y, 0)),
    spine: worldPoint(parts.torsoPivot),
    chest: worldPoint(parts.waistYawPivot, new THREE.Vector3(0, 0.68, 0)),
    neck: worldPoint(parts.headPivot),
    head: worldPoint(parts.headPivot, new THREE.Vector3(0, 0.33, 0)),
    leftShoulder: worldPoint(parts.leftArm),
    leftElbow: worldPoint(parts.leftForearm),
    leftWrist: worldPoint(parts.leftHand),
    rightShoulder: worldPoint(parts.rightArm),
    rightElbow: worldPoint(parts.rightForearm),
    rightWrist: worldPoint(parts.rightHand),
    leftHip: worldPoint(parts.leftLeg),
    leftKnee: worldPoint(parts.leftShin),
    leftAnkle: worldPoint(parts.leftFoot),
    rightHip: worldPoint(parts.rightLeg),
    rightKnee: worldPoint(parts.rightShin),
    rightAnkle: worldPoint(parts.rightFoot),
  };
}

function updateSkeletonOverlay() {
  if (!state.showSkeleton) {
    mannequinSkeletonGroup.visible = false;
    return;
  }

  const linePositions = [];
  const pointPositions = [];

  for (const item of state.objects) {
    if (item.type !== "mannequin") continue;
    item.group.updateMatrixWorld(true);
    const points = mannequinSkeletonPoints(item);

    addSkeletonEdge(linePositions, points.hips, points.spine);
    addSkeletonEdge(linePositions, points.spine, points.chest);
    addSkeletonEdge(linePositions, points.chest, points.neck);
    addSkeletonEdge(linePositions, points.neck, points.head);
    addSkeletonEdge(linePositions, points.leftShoulder, points.rightShoulder);
    addSkeletonEdge(linePositions, points.neck, points.leftShoulder);
    addSkeletonEdge(linePositions, points.neck, points.rightShoulder);
    addSkeletonEdge(linePositions, points.leftShoulder, points.leftElbow);
    addSkeletonEdge(linePositions, points.leftElbow, points.leftWrist);
    addSkeletonEdge(linePositions, points.rightShoulder, points.rightElbow);
    addSkeletonEdge(linePositions, points.rightElbow, points.rightWrist);
    addSkeletonEdge(linePositions, points.leftHip, points.rightHip);
    addSkeletonEdge(linePositions, points.hips, points.leftHip);
    addSkeletonEdge(linePositions, points.hips, points.rightHip);
    addSkeletonEdge(linePositions, points.leftHip, points.leftKnee);
    addSkeletonEdge(linePositions, points.leftKnee, points.leftAnkle);
    addSkeletonEdge(linePositions, points.rightHip, points.rightKnee);
    addSkeletonEdge(linePositions, points.rightKnee, points.rightAnkle);

    Object.values(points).forEach((point) => addSkeletonPoint(pointPositions, point));
  }

  skeletonLineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
  skeletonPointGeometry.setAttribute("position", new THREE.Float32BufferAttribute(pointPositions, 3));
  skeletonLineGeometry.computeBoundingSphere();
  skeletonPointGeometry.computeBoundingSphere();
  mannequinSkeletonGroup.visible = linePositions.length > 0;
}

function objectCenter(item) {
  const box = new THREE.Box3().setFromObject(item.group);
  if (Number.isFinite(box.min.x) && Number.isFinite(box.max.x)) return box.getCenter(new THREE.Vector3());
  return item.group.getWorldPosition(new THREE.Vector3());
}

function selectedBounds(items = selectedItems()) {
  const box = new THREE.Box3();
  let hasBounds = false;
  for (const item of items) {
    const itemBox = new THREE.Box3().setFromObject(item.group);
    if (Number.isFinite(itemBox.min.x) && Number.isFinite(itemBox.max.x)) {
      box.union(itemBox);
      hasBounds = true;
    }
  }
  if (!hasBounds) return null;
  return box;
}

function updateSelectionMarkers() {
  while (selectionMarkerGroup.children.length) {
    const marker = selectionMarkerGroup.children.pop();
    marker.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose?.();
    });
  }

  const items = selectedItems();
  if (items.length <= 1) return;
  for (const item of items) {
    const marker = new THREE.AxesHelper(0.45);
    marker.name = `${item.name}-center-axis`;
    marker.position.copy(objectCenter(item));
    marker.userData.selectable = false;
    marker.traverse((child) => {
      child.userData.selectable = false;
      child.renderOrder = 1000;
    });
    selectionMarkerGroup.add(marker);
  }
}

function updateSelectionPivot() {
  const items = selectedItems();
  if (items.length <= 1) {
    selectionPivot.visible = false;
    return;
  }
  const bounds = selectedBounds(items);
  selectionPivot.position.copy(bounds ? bounds.getCenter(new THREE.Vector3()) : objectCenter(items[0]));
  selectionPivot.rotation.set(0, 0, 0);
  selectionPivot.scale.set(1, 1, 1);
  selectionPivot.updateMatrixWorld(true);
  selectionPivot.visible = true;
}

function beginMultiTransform() {
  const items = selectedItems();
  if (items.length <= 1 || items.some((item) => item.locked)) {
    state.multiTransformStart = null;
    return;
  }
  selectionPivot.updateMatrixWorld(true);
  state.multiTransformStart = {
    pivotMatrix: selectionPivot.matrixWorld.clone(),
    pivotInverse: selectionPivot.matrixWorld.clone().invert(),
    items: items.map((item) => ({
      item,
      matrix: item.group.matrixWorld.clone(),
    })),
  };
}

function applyMultiTransform() {
  if (!state.multiTransformStart) return;
  selectionPivot.updateMatrixWorld(true);
  const delta = new THREE.Matrix4().multiplyMatrices(selectionPivot.matrixWorld, state.multiTransformStart.pivotInverse);
  for (const entry of state.multiTransformStart.items) {
    const matrix = new THREE.Matrix4().multiplyMatrices(delta, entry.matrix);
    matrix.decompose(entry.item.group.position, entry.item.group.quaternion, entry.item.group.scale);
    clampScaleVector(entry.item.group.scale);
  }
  updateSelectionMarkers();
}

function getViewCenterPosition(distance = 4, verticalOffset = 0) {
  if (state.viewMode === "flat") {
    return new THREE.Vector3(0, verticalOffset, FLAT_OBJECT_Z);
  }
  camera.updateMatrixWorld();
  const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
  return direction.multiplyScalar(distance).add(new THREE.Vector3(0, verticalOffset, 0));
}

function faceCameraHorizontally(object) {
  if (state.viewMode === "flat") {
    object.rotation.y = 0;
    return;
  }
  const toCamera = object.position.clone().multiplyScalar(-1);
  toCamera.y = 0;
  if (toCamera.lengthSq() > 0.0001) {
    object.rotation.y = Math.atan2(toCamera.x, toCamera.z);
  }
}

function faceCameraFully(object) {
  if (state.viewMode === "flat") {
    object.rotation.set(0, 0, 0);
    return;
  }
  const toCamera = object.position.clone().multiplyScalar(-1).normalize();
  object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), toCamera);
}

function getHorizontalCameraAxis(localAxis) {
  if (state.viewMode === "flat") return localAxis.clone().normalize();
  const axis = localAxis.clone().applyQuaternion(camera.quaternion);
  axis.y = 0;
  if (axis.lengthSq() < 0.0001) return new THREE.Vector3(1, 0, 0);
  return axis.normalize();
}

function tr(key, values = {}) {
  const table = translations[state.language] || translations.zh;
  let text = table[key] ?? translations.zh[key] ?? key;
  for (const [name, value] of Object.entries(values)) {
    text = text.replaceAll(`{${name}}`, String(value));
  }
  return text;
}

function poseLabel(pose) {
  return poseLabels[state.language]?.[pose] || poseLabels.zh[pose] || pose;
}

function partLabel(part) {
  return partLabels[state.language]?.[part] || partLabels.zh[part] || part;
}

function setText(selector, key) {
  const element = document.querySelector(selector);
  if (element) element.textContent = tr(key);
}

function setLabelText(forId, key) {
  const label = document.querySelector(`label[for="${forId}"]`);
  if (label) label.textContent = tr(key);
}

function setButtonText(id, key) {
  const button = document.getElementById(id);
  if (button) button.textContent = tr(key);
}

function setButtonTitle(id, key, ariaKey = key) {
  const button = document.getElementById(id);
  if (!button) return;
  button.title = tr(key);
  button.setAttribute("aria-label", tr(ariaKey));
}

function refreshPoseOptions() {
  for (const option of dom.poseSelect.options) {
    option.textContent = poseLabel(option.value);
  }
}

function applyLanguage() {
  document.documentElement.lang = state.language === "en" ? "en" : "zh-CN";
  document.title = tr("pageTitle");
  dom.canvas.setAttribute("aria-label", tr("canvasLabel"));
  dom.viewer.dataset.dropLabel = tr("dropLabel");

  setText(".upload-card h1", "emptyTitle");
  setText(".upload-card p", "emptyDescription");
  setButtonText("emptyUploadButton", "emptyUpload");
  setText(".upload-card .hint", "emptyHint");
  setText(".brand-title", "pageTitle");
  document.getElementById("uploadButton").textContent = tr("upload");
  setButtonTitle("screenshotButton", "screenshot");
  setButtonTitle("resetCameraButton", "resetCamera");
  setText(".panel-title h2", "panelTitle");
  dom.hidePanelButton.textContent = tr("hidePanel");

  const sectionTitles = document.querySelectorAll(".panel-body > .section > h3");
  [
    "add",
    "object",
    "appearance",
    "tools",
    "poseSection",
    "position",
    "rotation",
    "occlusionExport",
    "history",
  ].forEach((key, index) => {
    if (sectionTitles[index]) sectionTitles[index].textContent = tr(key);
  });

  setButtonText("addMannequinButton", "character");
  setButtonText("addCrowdButton", "crowdArray");
  setButtonText("addCubeButton", "cube");
  setButtonText("addSphereButton", "sphere");
  setButtonText("addOccluderPlaneButton", "occluderPlane");
  setButtonText("addOccluderCircleButton", "occluderCircle");
  setButtonText("addOccluderBoxButton", "occluderBox");
  setButtonText("addOccluderSphereButton", "occluderSphere");
  document.querySelectorAll(".help")[0].textContent = tr("addHelp");

  setLabelText("objectSelect", "currentObject");
  setButtonText("duplicateButton", "duplicate");
  setButtonText("deleteButton", "delete");
  const multiSelectLabel = dom.layerList?.closest(".field")?.querySelector("label");
  if (multiSelectLabel) multiSelectLabel.textContent = tr("multiSelect");
  document.querySelectorAll(".help")[1].textContent = tr("multiHelp");

  setLabelText("colorInput", "color");
  setLabelText("lockButton", "lockObject");
  setLabelText("scaleInput", "size");
  dom.transformButtons.forEach((button) => {
    const key = { translate: "translate", rotate: "rotate", scale: "scale" }[button.dataset.transformMode];
    if (key) button.textContent = tr(key);
  });
  document.querySelectorAll(".help")[2].textContent = tr("toolHelp");

  setLabelText("poseSelect", "posePreset");
  refreshPoseOptions();
  document.querySelectorAll("[data-joint-group]").forEach((title) => {
    const key = `group${title.dataset.jointGroup[0].toUpperCase()}${title.dataset.jointGroup.slice(1)}`;
    title.textContent = tr(key);
  });
  Object.keys(dom.joints).forEach((jointName) => setLabelText(jointName, jointName));
  dom.showSkeletonInput.closest("label").querySelector("span").textContent = tr("showSkeleton");
  dom.hideOccludersInShot.closest("label").querySelector("span").textContent = tr("hideOccluders");
  setButtonText("saveSceneButton", "saveScene");
  setButtonText("loadSceneButton", "loadScene");
  setButtonText("undoButton", "undo");
  setButtonText("redoButton", "redo");
  document.querySelectorAll(".help")[3].textContent = tr("historyHelp");

  if (!state.panoramaInfo) dom.fileMeta.textContent = tr("noImage");
  if (dom.languageButton) {
    dom.languageButton.textContent = "En/中";
    dom.languageButton.title = tr("languageTitle");
    dom.languageButton.setAttribute("aria-label", tr("languageTitle"));
  }
  updateFullscreenButton();
  setPanelCollapsed(document.body.classList.contains("panel-collapsed"));
  updateSelectionUi();
}

function setLanguage(language) {
  state.language = language === "en" ? "en" : "zh";
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, state.language);
  } catch {
    // Language persistence is optional.
  }
  applyLanguage();
}

function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add("visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => dom.toast.classList.remove("visible"), 2600);
}

function setPanelCollapsed(collapsed) {
  document.body.classList.toggle("panel-collapsed", collapsed);
  if (!dom.panelToggleButton) return;
  const label = collapsed ? tr("showDirector") : tr("hideDirector");
  dom.panelToggleButton.title = label;
  dom.panelToggleButton.setAttribute("aria-label", label);
  dom.panelToggleButton.setAttribute("aria-pressed", String(!collapsed));
}

function captureHistorySnapshot() {
  return JSON.stringify(serializeScene());
}

function updateHistoryButtons() {
  if (dom.undoButton) dom.undoButton.disabled = !state.history.undo.length;
  if (dom.redoButton) dom.redoButton.disabled = !state.history.redo.length;
}

function resetHistory() {
  state.history.undo = [];
  state.history.redo = [];
  state.history.current = captureHistorySnapshot();
  updateHistoryButtons();
}

function rememberHistory() {
  if (state.history.paused) return;
  const snapshot = captureHistorySnapshot();
  if (snapshot === state.history.current) {
    updateHistoryButtons();
    return;
  }
  if (state.history.current) {
    state.history.undo.push(state.history.current);
    if (state.history.undo.length > state.history.max) state.history.undo.shift();
  }
  state.history.current = snapshot;
  state.history.redo = [];
  updateHistoryButtons();
}

function restoreHistorySnapshot(snapshot) {
  if (!snapshot) return;
  const previousPaused = state.history.paused;
  state.history.paused = true;
  restoreScene(JSON.parse(snapshot), { silent: true });
  state.history.paused = previousPaused;
  state.history.current = snapshot;
  updateHistoryButtons();
}

function undoScene() {
  if (!state.history.undo.length) return;
  const previous = state.history.undo.pop();
  if (state.history.current) state.history.redo.push(state.history.current);
  restoreHistorySnapshot(previous);
  showToast(tr("undoDone"));
}

function redoScene() {
  if (!state.history.redo.length) return;
  const next = state.history.redo.pop();
  if (state.history.current) state.history.undo.push(state.history.current);
  restoreHistorySnapshot(next);
  showToast(tr("redoDone"));
}

function canEditItem(item = state.selected) {
  return Boolean(item && selectedItems().length <= 1 && !item.locked);
}

function selectedItems() {
  return state.objects.filter((item) => state.selectedIds.has(item.id));
}

function objectTypeCount(type) {
  return state.objects.filter((item) => item.type === type).length;
}

function remainingTotalSlots() {
  return Math.max(0, MAX_OBJECTS - state.objects.length);
}

function remainingCharacterSlots() {
  return Math.max(0, MAX_CHARACTERS - objectTypeCount("mannequin"));
}

function remainingOccluderSlots() {
  return Math.max(0, MAX_OCCLUDERS - objectTypeCount("occluder"));
}

function canCreateObjects(type, amount = 1, options = {}) {
  if (options.ignoreLimits) return true;
  if (remainingTotalSlots() < amount) {
    if (!options.silent) showToast(tr("objectLimitReached", { max: MAX_OBJECTS }));
    return false;
  }
  if (type === "mannequin" && remainingCharacterSlots() < amount) {
    if (!options.silent) showToast(tr("characterLimitReached", { max: MAX_CHARACTERS }));
    return false;
  }
  if (type === "occluder" && remainingOccluderSlots() < amount) {
    if (!options.silent) showToast(tr("occluderLimitReached", { max: MAX_OCCLUDERS }));
    return false;
  }
  return true;
}

function sanitizeSelection() {
  const validIds = new Set(state.objects.map((item) => item.id));
  state.selectedIds = new Set([...state.selectedIds].filter((id) => validIds.has(id)));
  if (state.selected && !validIds.has(state.selected.id)) state.selected = null;
  if (state.selected && !state.selectedIds.has(state.selected.id)) state.selectedIds.add(state.selected.id);
  if (!state.selected && state.selectedIds.size) {
    state.selected = state.objects.find((item) => state.selectedIds.has(item.id)) || null;
  }
}

function updateLayerOrder() {
  state.objects.forEach((item, index) => {
    const renderOrder = item.type === "occluder" ? -10 : index;
    item.group.renderOrder = renderOrder;
    item.group.traverse((child) => {
      if (child.isMesh) child.renderOrder = renderOrder;
    });
  });
}

function updateLayerList() {
  if (!dom.layerList) return;
  dom.layerList.innerHTML = "";

  if (!state.objects.length) {
    const empty = document.createElement("div");
    empty.className = "layer-empty";
    empty.textContent = tr("noObjects");
    dom.layerList.append(empty);
    return;
  }

  for (const item of [...state.objects].reverse()) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "layer-item";
    button.classList.toggle("active", state.selectedIds.has(item.id));
    button.addEventListener("click", (event) => selectLayerObject(item, event));

    const name = document.createElement("span");
    name.className = "layer-name";
    name.textContent = item.name;
    const status = document.createElement("span");
    status.className = "layer-state";
    const layerState = state.selectedIds.has(item.id) ? tr("selected") : `#${state.objects.indexOf(item) + 1}`;
    status.textContent = item.locked ? `${layerState} / ${tr("locked")}` : layerState;
    button.append(name, status);
    dom.layerList.append(button);
  }
}

function updateObjectControls() {
  const items = selectedItems();
  if (dom.duplicateButton) dom.duplicateButton.disabled = !items.length;
  if (dom.deleteButton) dom.deleteButton.disabled = !items.length;
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function updateCamera() {
  state.yaw += (state.targetYaw - state.yaw) * 0.18;
  state.pitch += (state.targetPitch - state.pitch) * 0.18;
  state.fov += (state.targetFov - state.fov) * 0.18;

  if (state.viewMode === "flat") {
    camera.position.set(0, 0, 0);
    camera.rotation.set(0, 0, 0);
  } else {
    camera.position.set(0, 0, 0);
    camera.rotation.set(state.pitch, state.yaw, 0);
  }
  camera.fov = state.fov;
  camera.updateProjectionMatrix();
}

function render() {
  requestAnimationFrame(render);
  updateCamera();
  updateSkeletonOverlay();
  renderer.render(scene, camera);
}

function normalizePointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  state.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  state.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function selectableMeshes() {
  const meshes = [];
  for (const item of state.objects) {
    item.group.traverse((child) => {
      if (child.isMesh && child.userData.selectable !== false) meshes.push(child);
    });
  }
  return meshes;
}

function pickObject(event) {
  normalizePointer(event);
  state.raycaster.setFromCamera(state.pointer, camera);
  const hits = state.raycaster.intersectObjects(selectableMeshes(), false);
  if (!hits.length) return null;
  return hits[0].object.userData.root || null;
}

function updateSelectionUi() {
  sanitizeSelection();
  transformControls.detach();

  const items = selectedItems();
  const hasLockedSelection = items.some((item) => item.locked);
  updateSelectionMarkers();
  if (items.length > 1) {
    updateSelectionPivot();
    if (!hasLockedSelection) transformControls.attach(selectionPivot);
    dom.selectionBadge.textContent = tr("selectedCount", { count: items.length });
  } else if (state.selected) {
    updateSelectionPivot();
    if (!state.selected.locked) transformControls.attach(state.selected.group);
    dom.selectionBadge.textContent = state.selected.name;
  } else {
    updateSelectionPivot();
    dom.selectionBadge.textContent = tr("noSelection");
  }

  updateObjectSelect();
  buildPartsGrid();
  syncPanel();
  updateObjectControls();
}

function selectObject(item) {
  state.selected = item || null;
  state.selectedIds = item ? new Set([item.id]) : new Set();
  state.lastLayerSelectionIndex = item ? state.objects.indexOf(item) : null;
  updateSelectionUi();
}

function selectObjects(items, primary = null) {
  state.selectedIds = new Set(items.map((item) => item.id));
  state.selected = primary || items[items.length - 1] || null;
  state.lastLayerSelectionIndex = state.selected ? state.objects.indexOf(state.selected) : null;
  updateSelectionUi();
}

function selectLayerObject(item, event) {
  const currentIndex = state.objects.indexOf(item);
  if (event.shiftKey && state.lastLayerSelectionIndex !== null) {
    const start = Math.min(state.lastLayerSelectionIndex, currentIndex);
    const end = Math.max(state.lastLayerSelectionIndex, currentIndex);
    selectObjects(state.objects.slice(start, end + 1), item);
    return;
  }

  if (event.ctrlKey || event.metaKey) {
    if (state.selectedIds.has(item.id)) {
      state.selectedIds.delete(item.id);
      if (state.selected === item) state.selected = selectedItems()[selectedItems().length - 1] || null;
    } else {
      state.selectedIds.add(item.id);
      state.selected = item;
    }
    state.lastLayerSelectionIndex = currentIndex;
    updateSelectionUi();
    return;
  }

  selectObject(item);
}

function updateObjectSelect() {
  dom.objectSelect.innerHTML = "";

  if (!state.objects.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = tr("noObjects");
    dom.objectSelect.append(option);
    updateLayerList();
    updateObjectControls();
    return;
  }

  for (const item of state.objects) {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name;
    dom.objectSelect.append(option);
  }

  if (state.selected) dom.objectSelect.value = state.selected.id;
  updateLayerList();
  updateObjectControls();
}

function setMaterialColor(item, color) {
  item.color = color;
  item.materials.forEach((mat) => mat.color.set(color));
}

function setMaterialOpacity(item, opacityPercent) {
  const opacity = THREE.MathUtils.clamp(Number(opacityPercent) / 100, 0, 1);
  item.opacity = Math.round(opacity * 100);
  [...item.materials, ...(item.detailMaterials || [])].forEach((mat) => {
    mat.opacity = opacity;
    mat.transparent = opacity < 1;
    mat.depthWrite = opacity >= 1;
  });
}

function syncPanel() {
  const item = state.selected;
  const multiSelected = selectedItems().length > 1;
  const lockDisabled = !item || multiSelected;
  const editDisabled = lockDisabled || Boolean(item.locked);

  const sharedInputs = [
    dom.colorInput,
    dom.scaleInput,
    dom.pos.x,
    dom.pos.y,
    dom.pos.z,
    dom.rot.x,
    dom.rot.y,
    dom.rot.z,
  ];

  sharedInputs.forEach((input) => {
    input.disabled = editDisabled;
  });
  dom.lockButton.disabled = lockDisabled;
  [dom.poseSelect, ...Object.values(dom.joints)].forEach((input) => {
    input.disabled = !item || multiSelected || item.type !== "mannequin" || Boolean(item.locked);
  });

  dom.poseSection.style.display = item?.type === "mannequin" ? "" : "none";
  updateObjectControls();

  const isLocked = Boolean(item?.locked);
  dom.lockButton.textContent = tr(isLocked ? "unlockAction" : "lockAction");
  dom.lockButton.classList.toggle("locked", isLocked);
  dom.lockButton.setAttribute("aria-pressed", String(isLocked));
  if (!item) return;

  dom.colorInput.value = item.color || "#4da3ff";
  dom.scaleInput.value = round(item.group.scale.x, 2);
  dom.pos.x.value = round(item.group.position.x, 2);
  dom.pos.y.value = round(item.group.position.y, 2);
  dom.pos.z.value = round(item.group.position.z, 2);
  dom.rot.x.value = round(THREE.MathUtils.radToDeg(item.group.rotation.x), 1);
  dom.rot.y.value = round(THREE.MathUtils.radToDeg(item.group.rotation.y), 1);
  dom.rot.z.value = round(THREE.MathUtils.radToDeg(item.group.rotation.z), 1);

  if (item.type === "mannequin") {
    dom.poseSelect.value = item.pose || "standing";
    syncJointPanel(item);
  }
}

function syncJointPanel(item = state.selected) {
  const angles = getJointAngles(item);
  for (const [jointName, input] of Object.entries(dom.joints)) {
    input.value = angles[jointName] ?? 0;
  }
}

function round(value, places = 2) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function makeMaterial(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.5,
    metalness: options.metalness ?? 0.08,
    transparent: options.opacity < 1,
    opacity: options.opacity ?? 1,
  });
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function numberedNameValue(name, labels) {
  for (const label of labels.filter(Boolean)) {
    const match = String(name || "").match(new RegExp(`^${escapeRegExp(label)}\\s+(\\d+)$`));
    if (match) return Number(match[1]);
  }
  return 0;
}

function labelVariants(key) {
  return [translations.zh[key], translations.en[key]];
}

function nextCharacterName() {
  const count = state.characterCount;
  state.characterCount += 1;
  return `${tr("character")} ${count}`;
}

function primitiveLabel(kind) {
  const labels = {
    cube: tr("cube"),
    sphere: tr("sphere"),
  };
  return labels[kind] || tr("objectDefault");
}

function nextPrimitiveName(kind) {
  const safeKind = state.primitiveCounts[kind] === undefined ? "cube" : kind;
  const count = state.primitiveCounts[safeKind];
  state.primitiveCounts[safeKind] += 1;
  return `${primitiveLabel(safeKind)} ${count}`;
}

function occluderLabel(kind) {
  const labels = {
    plane: tr("occluderPlane"),
    circle: tr("occluderCircle"),
    box: tr("occluderBox"),
    sphere: tr("occluderSphere"),
  };
  return labels[kind] || tr("occluderDefault");
}

function nextOccluderName(kind) {
  const safeKind = state.occluderCounts[kind] === undefined ? "plane" : kind;
  const count = state.occluderCounts[safeKind];
  state.occluderCounts[safeKind] += 1;
  return `${occluderLabel(safeKind)} ${count}`;
}

function resetCreationCounts() {
  state.characterCount = 1;
  state.primitiveCounts = {
    cube: 1,
    sphere: 1,
  };
  state.occluderCounts = {
    plane: 1,
    circle: 1,
    box: 1,
    sphere: 1,
  };
}

function inferCreationCountsFromScene() {
  resetCreationCounts();
  for (const item of state.objects) {
    if (item.type === "mannequin") {
      const number = numberedNameValue(item.name, labelVariants("character"));
      if (Number.isFinite(number)) state.characterCount = Math.max(state.characterCount, number + 1);
    } else if (item.type === "primitive" && state.primitiveCounts[item.kind] !== undefined) {
      const labelKey = item.kind === "sphere" ? "sphere" : "cube";
      const number = numberedNameValue(item.name, labelVariants(labelKey));
      if (Number.isFinite(number)) state.primitiveCounts[item.kind] = Math.max(state.primitiveCounts[item.kind], number + 1);
    } else if (item.type === "occluder" && state.occluderCounts[item.kind] !== undefined) {
      const labelKey = {
        plane: "occluderPlane",
        circle: "occluderCircle",
        box: "occluderBox",
        sphere: "occluderSphere",
      }[item.kind] || "occluderDefault";
      const number = numberedNameValue(item.name, labelVariants(labelKey));
      state.occluderCounts[item.kind] = Math.max(state.occluderCounts[item.kind], number + 1);
    }
  }
}

function assignRoot(meshOrGroup, item, partName = "") {
  meshOrGroup.traverse((child) => {
    child.userData.root = item;
    if (partName) child.userData.part = partName;
    if (child.isMesh) child.userData.selectable = true;
  });
}

function createLimbSegment(material, length, radius, name, scale = new THREE.Vector3(1, 1, 1)) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 20), material);
  mesh.name = name;
  mesh.position.y = -length / 2;
  mesh.scale.copy(scale);
  return mesh;
}

function createArticulatedArm(material, sideName) {
  const upperLength = 0.55;
  const lowerLength = 0.5;
  const arm = new THREE.Group();
  const forearm = new THREE.Group();
  const handPivot = new THREE.Group();

  arm.name = `${sideName}Arm`;
  forearm.name = `${sideName}Forearm`;
  handPivot.name = `${sideName}HandPivot`;

  const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.078, 18, 12), material);
  shoulder.name = `${sideName}Shoulder`;
  arm.add(shoulder);

  const upper = createLimbSegment(material, upperLength, 0.078, `${sideName}UpperArmMesh`, new THREE.Vector3(1, 1, 1));
  upper.position.y = -upperLength / 2;
  arm.add(upper);

  const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.074, 18, 12), material);
  elbow.name = `${sideName}Elbow`;
  elbow.position.y = -upperLength;
  arm.add(elbow);

  forearm.position.y = -upperLength;
  const lower = createLimbSegment(material, lowerLength, 0.068, `${sideName}ForearmMesh`, new THREE.Vector3(1, 1, 1));
  lower.position.y = -lowerLength / 2 - 0.04;
  forearm.add(lower);

  const hand = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.17, 0.12, 2, 4, 3), material);
  hand.name = `${sideName}Hand`;
  hand.position.y = -0.08;
  handPivot.position.y = -lowerLength - 0.05;
  handPivot.add(hand);

  for (let i = 0; i < 4; i += 1) {
    const finger = new THREE.Mesh(new THREE.BoxGeometry(0.023, 0.12, 0.019), material);
    finger.name = `${sideName}Finger${i + 1}`;
    finger.position.set(0, -0.21, -0.039 + i * 0.026);
    handPivot.add(finger);
  }

  const thumb = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.085, 0.026), material);
  thumb.name = `${sideName}Thumb`;
  thumb.position.set(0, -0.155, 0.075);
  handPivot.add(thumb);

  forearm.add(handPivot);
  arm.add(forearm);

  return { root: arm, joint: forearm, hand: handPivot };
}

function createArticulatedLeg(material, sideName) {
  const thighLength = 0.78;
  const shinLength = 0.72;
  const leg = new THREE.Group();
  const legPitch = new THREE.Group();
  const legOut = new THREE.Group();
  const legTwist = new THREE.Group();
  const shin = new THREE.Group();
  const footPivot = new THREE.Group();

  leg.name = `${sideName}Leg`;
  legPitch.name = `${sideName}LegPitch`;
  legOut.name = `${sideName}LegOut`;
  legTwist.name = `${sideName}LegTwist`;
  shin.name = `${sideName}Shin`;
  footPivot.name = `${sideName}FootPivot`;
  leg.add(legPitch);
  legPitch.add(legOut);
  legOut.add(legTwist);

  const hip = new THREE.Mesh(new THREE.SphereGeometry(0.105, 18, 12), material);
  hip.name = `${sideName}Hip`;
  legTwist.add(hip);

  const thigh = createLimbSegment(material, thighLength, 0.105, `${sideName}ThighMesh`, new THREE.Vector3(1, 1, 1));
  thigh.position.y = -thighLength / 2;
  legTwist.add(thigh);

  const knee = new THREE.Mesh(new THREE.SphereGeometry(0.09, 18, 12), material);
  knee.name = `${sideName}Knee`;
  knee.position.y = -thighLength;
  legTwist.add(knee);

  shin.position.y = -thighLength;
  const shinMesh = createLimbSegment(material, shinLength, 0.082, `${sideName}ShinMesh`, new THREE.Vector3(1, 1, 1));
  shinMesh.position.y = -shinLength / 2 - 0.02;
  shin.add(shinMesh);

  const foot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.34, 2, 2, 2), material);
  foot.name = `${sideName}Foot`;
  foot.position.set(0, -0.05, 0.13);
  footPivot.position.y = -shinLength - 0.02;
  footPivot.add(foot);
  shin.add(footPivot);
  legTwist.add(shin);

  return { root: leg, pitch: legPitch, out: legOut, twist: legTwist, joint: shin, foot: footPivot };
}

function addFaceDetails(parent, detailMaterial, bodyMaterial) {
  const faceGroup = new THREE.Group();
  faceGroup.name = "faceDetails";
  parent.add(faceGroup);

  const eyeGeometry = new THREE.SphereGeometry(0.018, 10, 8);
  const leftEye = new THREE.Mesh(eyeGeometry, detailMaterial);
  leftEye.name = "leftEye";
  leftEye.position.set(-0.055, 0.18, 0.145);
  faceGroup.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeometry.clone(), detailMaterial);
  rightEye.name = "rightEye";
  rightEye.position.set(0.055, 0.18, 0.145);
  faceGroup.add(rightEye);

  const noseGeometry = new THREE.BufferGeometry();
  noseGeometry.setAttribute("position", new THREE.Float32BufferAttribute([
    0, 0.034, 0.006,
    -0.026, -0.028, -0.01,
    0.026, -0.028, -0.01,
    0, -0.018, 0.052,
  ], 3));
  noseGeometry.setIndex([
    0, 2, 1,
    0, 1, 3,
    0, 3, 2,
    1, 2, 3,
  ]);
  noseGeometry.computeVertexNormals();
  const nose = new THREE.Mesh(noseGeometry, bodyMaterial);
  nose.name = "nose";
  nose.position.set(0, 0.1, 0.154);
  faceGroup.add(nose);

  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.012, 0.012), detailMaterial);
  mouth.name = "mouth";
  mouth.position.set(0, 0.035, 0.145);
  faceGroup.add(mouth);

  const earGeometry = new THREE.SphereGeometry(0.035, 12, 10);
  const leftEar = new THREE.Mesh(earGeometry, bodyMaterial);
  leftEar.name = "leftEar";
  leftEar.scale.set(0.55, 1, 0.32);
  leftEar.position.set(-0.178, 0.115, 0.01);
  faceGroup.add(leftEar);

  const rightEar = new THREE.Mesh(earGeometry.clone(), bodyMaterial);
  rightEar.name = "rightEar";
  rightEar.scale.set(0.55, 1, 0.32);
  rightEar.position.set(0.178, 0.115, 0.01);
  faceGroup.add(rightEar);

  return faceGroup;
}

function createMannequin(name = "", options = {}) {
  if (!canCreateObjects("mannequin", 1, options)) return null;
  const color = "#4da3ff";
  const material = makeMaterial(color, { roughness: 0.58, metalness: 0.06 });
  const faceMaterial = makeMaterial("#101820", { roughness: 0.72, metalness: 0.02 });
  const item = {
    id: `obj-${state.nextId++}`,
    type: "mannequin",
    name: name || nextCharacterName(),
    color,
    opacity: 100,
    locked: false,
    pose: "standing",
    group: new THREE.Group(),
    materials: [material],
    detailMaterials: [faceMaterial],
    parts: {},
  };

  item.group.name = item.name;
  item.group.position.copy(getViewCenterPosition(4, -0.9 + MANNEQUIN_CENTER_OFFSET_Y));
  faceCameraHorizontally(item.group);

  const poseRoot = new THREE.Group();
  poseRoot.name = "poseRoot";
  poseRoot.position.y = -MANNEQUIN_CENTER_OFFSET_Y;
  item.group.add(poseRoot);
  item.parts.poseRoot = poseRoot;

  const torsoPivot = new THREE.Group();
  torsoPivot.name = "torsoPivot";
  torsoPivot.position.y = 0.78;
  poseRoot.add(torsoPivot);
  item.parts.torsoPivot = torsoPivot;

  const waistYawPivot = new THREE.Group();
  waistYawPivot.name = "waistYawPivot";
  torsoPivot.add(waistYawPivot);
  item.parts.waistYawPivot = waistYawPivot;

  const torsoDetails = new THREE.Group();
  torsoDetails.name = "torsoDetails";
  torsoPivot.add(torsoDetails);
  item.parts.torsoDetails = torsoDetails;

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.23, 1.0, 28, 4), material);
  torso.name = "torso";
  torso.scale.set(1, 1, 0.64);
  torso.position.y = 0.66;
  waistYawPivot.add(torso);
  item.parts.torso = torso;
  item.parts.chest = torso;

  const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.22, 0.18, 24, 2), material);
  pelvis.name = "pelvis";
  pelvis.scale.set(1, 1, 0.68);
  pelvis.position.y = 0.08;
  torsoDetails.add(pelvis);
  item.parts.pelvis = pelvis;

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.075, 0.12, 16), material);
  neck.name = "neck";
  neck.position.y = 1.2;
  waistYawPivot.add(neck);
  item.parts.neck = neck;

  const headPivot = new THREE.Group();
  headPivot.name = "headPivot";
  headPivot.position.y = 1.28;
  waistYawPivot.add(headPivot);
  item.parts.headPivot = headPivot;

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 24, 16), material);
  head.name = "head";
  head.scale.set(0.92, 1.08, 0.9);
  head.position.y = 0.15;
  headPivot.add(head);
  item.parts.head = headPivot;
  item.parts.headMesh = head;
  item.parts.faceDetails = addFaceDetails(headPivot, faceMaterial, material);

  const leftArm = createArticulatedArm(material, "left");
  leftArm.root.position.set(0.285, 1.14, 0);
  waistYawPivot.add(leftArm.root);
  item.parts.leftArm = leftArm.root;
  item.parts.leftForearm = leftArm.joint;
  item.parts.leftHand = leftArm.hand;

  const rightArm = createArticulatedArm(material, "right");
  rightArm.root.position.set(-0.285, 1.14, 0);
  waistYawPivot.add(rightArm.root);
  item.parts.rightArm = rightArm.root;
  item.parts.rightForearm = rightArm.joint;
  item.parts.rightHand = rightArm.hand;

  const leftLeg = createArticulatedLeg(material, "left");
  leftLeg.root.position.set(MANNEQUIN_HIP_X, MANNEQUIN_HIP_Y, 0);
  poseRoot.add(leftLeg.root);
  item.parts.leftLeg = leftLeg.root;
  item.parts.leftLegPitch = leftLeg.pitch;
  item.parts.leftLegOut = leftLeg.out;
  item.parts.leftLegTwist = leftLeg.twist;
  item.parts.leftShin = leftLeg.joint;
  item.parts.leftFoot = leftLeg.foot;

  const rightLeg = createArticulatedLeg(material, "right");
  rightLeg.root.position.set(-MANNEQUIN_HIP_X, MANNEQUIN_HIP_Y, 0);
  poseRoot.add(rightLeg.root);
  item.parts.rightLeg = rightLeg.root;
  item.parts.rightLegPitch = rightLeg.pitch;
  item.parts.rightLegOut = rightLeg.out;
  item.parts.rightLegTwist = rightLeg.twist;
  item.parts.rightShin = rightLeg.joint;
  item.parts.rightFoot = rightLeg.foot;

  assignRoot(item.group, item);
  for (const [partName, partObject] of Object.entries(item.parts)) {
    if (partLabels.zh[partName]) assignRoot(partObject, item, partName);
  }

  item.partVisibility = Object.fromEntries(Object.keys(partLabels.zh).map((part) => [part, true]));
  scene.add(item.group);
  state.objects.push(item);
  updateLayerOrder();
  applyPose(item, "standing");
  if (options.select !== false) selectObject(item);
  if (!options.silent) showToast(tr("added", { name: item.name }));
  return item;
}

function resetPose(item) {
  if (!item || item.type !== "mannequin") return;
  for (const key of ["poseRoot", "torsoPivot", "waistYawPivot", "headPivot", "leftArm", "rightArm", "leftForearm", "rightForearm", "leftHand", "rightHand", "leftLeg", "rightLeg", "leftLegPitch", "rightLegPitch", "leftLegOut", "rightLegOut", "leftLegTwist", "rightLegTwist", "leftShin", "rightShin", "leftFoot", "rightFoot"]) {
    item.parts[key].rotation.set(0, 0, 0);
  }
  item.parts.poseRoot.position.set(0, -MANNEQUIN_CENTER_OFFSET_Y, 0);
  item.parts.torsoPivot.position.y = 0.78;
  item.parts.torsoDetails.position.set(0, 0, 0);
  item.parts.leftLeg.position.set(MANNEQUIN_HIP_X, MANNEQUIN_HIP_Y, 0);
  item.parts.rightLeg.position.set(-MANNEQUIN_HIP_X, MANNEQUIN_HIP_Y, 0);
}

function setJointAngle(item, jointName, degrees) {
  const joint = jointMap[jointName];
  if (!joint || !item?.parts?.[joint.part]) return;
  let naturalAngle = Number(degrees) || 0;
  if (Number.isFinite(joint.min)) naturalAngle = Math.max(joint.min, naturalAngle);
  if (Number.isFinite(joint.max)) naturalAngle = Math.min(joint.max, naturalAngle);
  item.parts[joint.part].rotation[joint.axis] = THREE.MathUtils.degToRad(naturalAngle * joint.sign);
  if (jointName === "bodyPitch") {
    const angle = item.parts.poseRoot.rotation.x;
    item.parts.poseRoot.position.set(
      0,
      -MANNEQUIN_CENTER_OFFSET_Y * Math.cos(angle),
      -MANNEQUIN_CENTER_OFFSET_Y * Math.sin(angle),
    );
  }
}

function getJointAngles(item) {
  if (!item || item.type !== "mannequin") return {};
  return Object.fromEntries(Object.entries(jointMap).map(([jointName, joint]) => [
    jointName,
    round(THREE.MathUtils.radToDeg(item.parts[joint.part]?.rotation[joint.axis] || 0) * joint.sign, 1),
  ]));
}

function applyJointValues(item, values = {}) {
  if (!item || item.type !== "mannequin") return;
  for (const jointName of Object.keys(jointMap)) {
    if (values[jointName] !== undefined) setJointAngle(item, jointName, values[jointName]);
  }
}

function applyPose(item, pose) {
  if (!item || item.type !== "mannequin") return;
  resetPose(item);
  const targetPose = poseNames[pose] ? pose : "standing";
  item.pose = targetPose;

  const standingValues = {
    leftShoulderOut: MANNEQUIN_DEFAULT_ARM_OUT_DEGREES,
    rightShoulderOut: MANNEQUIN_DEFAULT_ARM_OUT_DEGREES,
  };
  const poseValues = {
    standing: standingValues,
    bowing: {
      ...standingValues,
      waistBend: -47,
      leftShoulder: 11.5,
      rightShoulder: 11.5,
      leftElbow: 18,
      rightElbow: 18,
      leftKnee: 4,
      rightKnee: 4,
    },
    sitting: {
      ...standingValues,
      waistBend: 5.7,
      leftShoulder: -4.6,
      rightShoulder: -4.6,
      leftElbow: 12,
      rightElbow: 12,
      leftHip: 90,
      rightHip: 90,
      leftKnee: 95,
      rightKnee: 95,
    },
    kneeling: {
      ...standingValues,
      waistBend: -12,
      leftShoulder: 10,
      rightShoulder: 10,
      leftElbow: 18,
      rightElbow: 18,
      leftHip: 8,
      rightHip: 8,
      leftHipOut: 4,
      rightHipOut: 4,
      leftKnee: 132,
      rightKnee: 132,
    },
    squatting: {
      ...standingValues,
      waistBend: -28,
      leftShoulder: 14,
      rightShoulder: 14,
      leftElbow: 26,
      rightElbow: 26,
      leftHip: 82,
      rightHip: 82,
      leftHipOut: 8,
      rightHipOut: 8,
      leftKnee: 136,
      rightKnee: 136,
      leftFootPitch: 32,
      rightFootPitch: 32,
    },
    supine: {
      ...standingValues,
      bodyPitch: 90,
      leftShoulderOut: 11.5,
      rightShoulderOut: 11.5,
      leftKnee: 8,
      rightKnee: 8,
    },
    prone: {
      ...standingValues,
      bodyPitch: -90,
      leftShoulder: -180,
      rightShoulder: -180,
      leftPalmTwist: -90,
      rightPalmTwist: -90,
      leftKnee: 8,
      rightKnee: 8,
    },
    walking: {
      ...standingValues,
      waistBend: 4.6,
      leftShoulder: -29.8,
      rightShoulder: 29.8,
      leftElbow: 22,
      rightElbow: 28,
      leftHip: 28.6,
      rightHip: -20.1,
      leftKnee: 24,
      rightKnee: 34,
    },
    pointing: {
      ...standingValues,
      headYaw: -16,
      waistYaw: 16,
      leftShoulder: -10.3,
      rightShoulder: 88.8,
      rightShoulderOut: 10.3,
      leftElbow: 18,
      rightElbow: 0,
      leftKnee: 0,
      rightKnee: 0,
    },
  };

  applyJointValues(item, poseValues[targetPose]);
  dom.poseSelect.value = targetPose;
  syncJointPanel(item);
}

function createOccluder(kind = "plane", name = "", options = {}) {
  if (!canCreateObjects("occluder", 1, options)) return null;
  const isVolume = kind === "box" || kind === "sphere";
  const color = isVolume ? "#ffb86b" : "#80e8c8";
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.28,
    depthWrite: true,
    side: THREE.DoubleSide,
  });
  const geometry = {
    plane: new THREE.PlaneGeometry(1.8, 1.2),
    circle: new THREE.CircleGeometry(0.78, 48),
    box: new THREE.BoxGeometry(1.2, 1.2, 1.2),
    sphere: new THREE.SphereGeometry(0.72, 32, 18),
  }[kind] || new THREE.PlaneGeometry(1.8, 1.2);
  const mesh = new THREE.Mesh(geometry, material);
  const item = {
    id: `obj-${state.nextId++}`,
    type: "occluder",
    kind,
    name: name || nextOccluderName(kind),
    color,
    opacity: 28,
    locked: false,
    group: mesh,
    materials: [material],
  };

  mesh.name = item.name;
  mesh.position.copy(getViewCenterPosition(3.6, 0));
  if (kind === "plane" || kind === "circle") faceCameraFully(mesh);
  mesh.renderOrder = -10;
  assignRoot(mesh, item);
  scene.add(mesh);
  state.objects.push(item);
  updateLayerOrder();
  if (options.select !== false) selectObject(item);
  if (!options.silent) showToast(tr("added", { name: item.name }));
  return item;
}

function createPrimitive(kind = "cube", name = "", options = {}) {
  if (!canCreateObjects("primitive", 1, options)) return null;
  const color = kind === "sphere" ? "#d4a5ff" : "#91a7ff";
  const material = makeMaterial(color, { roughness: 0.52, metalness: 0.04 });
  const geometry = kind === "sphere"
    ? new THREE.SphereGeometry(0.55, 32, 18)
    : new THREE.BoxGeometry(1, 1, 1);
  const mesh = new THREE.Mesh(geometry, material);
  const item = {
    id: `obj-${state.nextId++}`,
    type: "primitive",
    kind,
    name: name || nextPrimitiveName(kind),
    color,
    opacity: 100,
    locked: false,
    group: mesh,
    materials: [material],
  };

  mesh.name = item.name;
  mesh.position.copy(getViewCenterPosition(3.6, 0));
  faceCameraHorizontally(mesh);
  assignRoot(mesh, item);
  scene.add(mesh);
  state.objects.push(item);
  updateLayerOrder();
  if (options.select !== false) selectObject(item);
  if (!options.silent) showToast(tr("added", { name: item.name }));
  return item;
}

function addCrowd() {
  const count = Math.min(6, remainingTotalSlots(), remainingCharacterSlots());
  if (count <= 0) {
    showToast(tr("crowdLimitReached"));
    return;
  }
  const center = getViewCenterPosition(4.6, -0.9 + MANNEQUIN_CENTER_OFFSET_Y);
  const right = getHorizontalCameraAxis(new THREE.Vector3(1, 0, 0));
  const forward = getHorizontalCameraAxis(new THREE.Vector3(0, 0, -1));
  const colors = ["#4da3ff", "#ff8f70", "#80e8c8", "#d4a5ff", "#ffd36e", "#91a7ff"];
  const created = [];
  for (let i = 0; i < count; i += 1) {
    const item = createMannequin(undefined, { silent: true, select: false });
    if (!item) continue;
    created.push(item);
    const col = i % 3;
    const row = Math.floor(i / 3);
    item.group.position.copy(center)
      .addScaledVector(right, (col - 1) * 0.9)
      .addScaledVector(forward, -row * 0.72);
    faceCameraHorizontally(item.group);
    item.group.rotation.y += THREE.MathUtils.degToRad((col - 1) * 8);
    item.group.scale.setScalar(0.82);
    setMaterialColor(item, colors[i % colors.length]);
    applyPose(item, "standing");
  }
  if (!created.length) {
    showToast(tr("crowdLimitReached"));
    return;
  }
  updateLayerOrder();
  selectObject(created[created.length - 1]);
  rememberHistory();
  showToast(tr(count < 6 ? "crowdPartialAdded" : "addedCrowd", { count: created.length }));
}

function buildPartsGrid() {
  dom.partsGrid.innerHTML = "";
  const item = state.selected;
  if (!item || item.type !== "mannequin") return;
  const multiSelected = selectedItems().length > 1;

  for (const part of Object.keys(partLabels.zh)) {
    const wrapper = document.createElement("label");
    wrapper.className = "part-toggle";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = item.partVisibility?.[part] !== false;
    input.disabled = multiSelected;
    input.addEventListener("change", () => {
      item.partVisibility[part] = input.checked;
      setPartVisible(item, part, input.checked);
      rememberHistory();
    });
    wrapper.append(input, document.createTextNode(partLabel(part)));
    dom.partsGrid.append(wrapper);
  }
}

function setPartVisible(item, part, visible) {
  const target = item.parts?.[part];
  if (!target) return;
  target.visible = visible;
  if (part === "torso" && item.parts.chest) item.parts.chest.visible = visible;
  if (part === "torso" && item.parts.neck) item.parts.neck.visible = visible;
  if (part === "torso" && item.parts.torsoDetails) item.parts.torsoDetails.visible = visible;
  if (part === "head" && item.parts.faceDetails) item.parts.faceDetails.visible = visible;
}

function updateTransformMode(mode) {
  state.transformMode = mode;
  transformControls.setMode(mode);
  dom.transformButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.transformMode === mode);
  });
}

function clampScaleVector(scale) {
  scale.x = Math.max(MIN_SCALE, scale.x);
  scale.y = Math.max(MIN_SCALE, scale.y);
  scale.z = Math.max(MIN_SCALE, scale.z);
}

function clampSelectedScale() {
  if (!state.selected) return;
  clampScaleVector(state.selected.group.scale);
}

function applyPanelTransform() {
  const item = state.selected;
  if (!canEditItem(item)) return;
  item.group.position.set(
    Number(dom.pos.x.value) || 0,
    Number(dom.pos.y.value) || 0,
    Number(dom.pos.z.value) || 0,
  );
  item.group.rotation.set(
    THREE.MathUtils.degToRad(Number(dom.rot.x.value) || 0),
    THREE.MathUtils.degToRad(Number(dom.rot.y.value) || 0),
    THREE.MathUtils.degToRad(Number(dom.rot.z.value) || 0),
  );
  const scale = Math.max(MIN_SCALE, Number(dom.scaleInput.value) || 1);
  item.group.scale.setScalar(scale);
}

function applyPanelTransformAndSync() {
  applyPanelTransform();
  syncPanel();
  rememberHistory();
}

function duplicateItem(item) {
  let copy;
  if (item.type === "mannequin") {
    copy = createMannequin(undefined, { silent: true, select: false });
    if (!copy) return null;
    copy.pose = item.pose;
    applyPose(copy, item.pose);
    applyJointValues(copy, getJointAngles(item));
    copy.partVisibility = { ...item.partVisibility };
    Object.entries(copy.partVisibility).forEach(([part, visible]) => setPartVisible(copy, part, visible));
  } else if (item.type === "primitive") {
    copy = createPrimitive(item.kind, undefined, { silent: true, select: false });
  } else {
    copy = createOccluder(item.kind, undefined, { silent: true, select: false });
  }
  if (!copy) return null;

  copy.group.position.copy(item.group.position).add(new THREE.Vector3(0.35, 0, -0.2));
  copy.group.rotation.copy(item.group.rotation);
  copy.group.scale.copy(item.group.scale);
  setMaterialColor(copy, item.color);
  setMaterialOpacity(copy, item.opacity);
  copy.locked = Boolean(item.locked);
  return copy;
}

function duplicateSelected() {
  const items = selectedItems();
  if (!items.length) return;

  const copies = [];
  for (const item of items) {
    const copy = duplicateItem(item);
    if (!copy) break;
    copies.push(copy);
  }
  if (!copies.length) return;
  updateLayerOrder();
  selectObjects(copies, copies[copies.length - 1]);
  rememberHistory();
  showToast(copies.length > 1 ? tr("copiedMany", { count: copies.length }) : tr("copiedOne", { name: items[0].name }));
}

function deleteSelected() {
  const items = selectedItems();
  if (!items.length) return;
  transformControls.detach();
  for (const item of items) {
    scene.remove(item.group);
    item.group.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
    });
  }
  const removedIds = new Set(items.map((item) => item.id));
  state.objects = state.objects.filter((candidate) => !removedIds.has(candidate.id));
  state.selectedIds = new Set([...state.selectedIds].filter((id) => !removedIds.has(id)));
  updateLayerOrder();
  const remainingSelected = selectedItems();
  if (remainingSelected.length) selectObjects(remainingSelected, remainingSelected[remainingSelected.length - 1]);
  else selectObject(state.objects[state.objects.length - 1] || null);
  rememberHistory();
  showToast(items.length > 1 ? tr("deletedMany", { count: items.length }) : tr("deletedOne"));
}

function resetCamera() {
  state.targetYaw = 0;
  state.targetPitch = 0;
  state.targetFov = 72;
  if (state.viewMode === "flat") {
    state.yaw = 0;
    state.pitch = 0;
  }
  showToast(tr("cameraReset"));
  rememberHistory();
}

function updateFullscreenButton() {
  const button = document.getElementById("fullscreenButton");
  if (!button) return;
  const isFullscreen = Boolean(document.fullscreenElement);
  button.title = isFullscreen ? tr("exitFullscreen") : tr("fullscreen");
  button.setAttribute("aria-label", isFullscreen ? tr("exitFullscreen") : tr("fullscreenAria"));
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  } catch (error) {
    console.error(error);
    showToast(tr("fullscreenDenied"));
  } finally {
    updateFullscreenButton();
  }
}

function loadPanoramaFromFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    showToast(tr("chooseImage"));
    return;
  }

  const url = URL.createObjectURL(file);
  loadPanorama(url, file.name, file.size, true);
}

function imageViewMode(texture) {
  const width = texture.image?.naturalWidth || texture.image?.width || 0;
  const height = texture.image?.naturalHeight || texture.image?.height || 0;
  const ratio = height ? width / height : PANORAMA_RATIO;
  return Math.abs(ratio - PANORAMA_RATIO) <= PANORAMA_RATIO_TOLERANCE ? "panorama" : "flat";
}

function disposeCurrentBackground() {
  if (state.panoramaMesh) {
    scene.remove(state.panoramaMesh);
    state.panoramaMesh.geometry.dispose();
    state.panoramaMesh.material.dispose();
  }
  if (state.panoramaTexture) state.panoramaTexture.dispose();
  state.panoramaMesh = null;
  state.panoramaTexture = null;
}

function createPanoramaBackground(texture) {
  const geometry = new THREE.SphereGeometry(500, 96, 48);
  geometry.scale(-1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  material.depthTest = false;
  material.depthWrite = false;
  const sphere = new THREE.Mesh(geometry, material);
  sphere.name = "panorama-background";
  sphere.renderOrder = -100;
  sphere.userData.selectable = false;
  scene.add(sphere);
  return sphere;
}

function createFlatBackground(texture) {
  const width = texture.image?.naturalWidth || texture.image?.width || 1;
  const height = texture.image?.naturalHeight || texture.image?.height || 1;
  const ratio = width / height;
  const planeHeight = 2 * FLAT_IMAGE_DISTANCE * Math.tan(THREE.MathUtils.degToRad(72 / 2)) * 0.82;
  const planeWidth = planeHeight * ratio;
  const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
  const material = new THREE.MeshBasicMaterial({ map: texture, depthWrite: false, depthTest: false });
  const plane = new THREE.Mesh(geometry, material);
  plane.name = "flat-image-background";
  plane.position.set(0, 0, -FLAT_IMAGE_DISTANCE);
  plane.renderOrder = -100;
  plane.userData.selectable = false;
  scene.add(plane);
  state.flatImageSize.set(planeWidth, planeHeight);
  return plane;
}

function resetViewForMode(mode) {
  state.viewMode = mode;
  document.body.dataset.viewMode = mode;
  state.targetYaw = 0;
  state.targetPitch = 0;
  state.yaw = 0;
  state.pitch = 0;
  state.targetFov = 72;
  state.fov = 72;
}

function loadPanorama(source, name = tr("defaultImageName"), size = 0, revokeAfterLoad = false) {
  const loader = new THREE.TextureLoader();
  loader.load(
    source,
    (texture) => {
      disposeCurrentBackground();

      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const mode = imageViewMode(texture);
      resetViewForMode(mode);
      const background = mode === "panorama"
        ? createPanoramaBackground(texture)
        : createFlatBackground(texture);
      const width = texture.image?.naturalWidth || texture.image?.width || 0;
      const height = texture.image?.naturalHeight || texture.image?.height || 0;

      state.panoramaMesh = background;
      state.panoramaTexture = texture;
      state.panoramaInfo = { name, size, width, height, viewMode: mode };
      document.body.classList.add("panorama-loaded");
      setPanelCollapsed(false);
      dom.emptyState.classList.add("hidden");
      dom.fileMeta.textContent = size ? `${name} · ${formatBytes(size)}` : name;
      showToast(mode === "panorama" ? tr("panoramaLoaded") : tr("flatLoaded"));
      resetHistory();
      if (revokeAfterLoad) URL.revokeObjectURL(source);
    },
    undefined,
    () => {
      showToast(tr("imageLoadFailed"));
      if (revokeAfterLoad) URL.revokeObjectURL(source);
    },
  );
}

function imageNameFromUrl(source) {
  try {
    const url = new URL(source, window.location.href);
    const parts = url.pathname.split("/").filter(Boolean);
    return decodeURIComponent(parts.at(-1) || source);
  } catch (error) {
    const parts = String(source).split(/[\\/]/).filter(Boolean);
    return decodeURIComponent(parts.at(-1) || source);
  }
}

function formatBytes(bytes) {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(size >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
}

function downloadBlob(blob, fileName) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

async function copyPngBlobToClipboard(blobPromise) {
  if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") return false;
  try {
    const clipboardItem = new ClipboardItem({ "image/png": blobPromise });
    await navigator.clipboard.write([clipboardItem]);
    return true;
  } catch (error) {
    try {
      const blob = await blobPromise;
      if (!blob) return false;
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      return true;
    } catch (fallbackError) {
      return false;
    }
  }
}

function canvasToPngBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function restoreScreenshotState(changed, wasTransformVisible, wasSelectionMarkerVisible, wasSkeletonVisible) {
  transformControls.visible = wasTransformVisible;
  selectionMarkerGroup.visible = wasSelectionMarkerVisible;
  mannequinSkeletonGroup.visible = wasSkeletonVisible;
  for (const entry of changed) {
    entry.material.colorWrite = entry.colorWrite;
    entry.material.opacity = entry.opacity;
    entry.material.transparent = entry.transparent;
    entry.material.depthWrite = entry.depthWrite;
    entry.material.depthTest = entry.depthTest;
    entry.material.needsUpdate = true;
  }
  document.body.classList.remove("is-capturing");
}

function captureScreenshot() {
  const changed = [];

  if (dom.hideOccludersInShot.checked) {
    for (const item of state.objects.filter((candidate) => candidate.type === "occluder")) {
      for (const material of item.materials) {
        changed.push({
          material,
          colorWrite: material.colorWrite,
          opacity: material.opacity,
          transparent: material.transparent,
          depthWrite: material.depthWrite,
          depthTest: material.depthTest,
        });
        material.colorWrite = false;
        material.opacity = 1;
        material.transparent = false;
        material.depthWrite = true;
        material.depthTest = true;
        material.needsUpdate = true;
      }
    }
  }

  const wasTransformVisible = transformControls.visible;
  const wasSelectionMarkerVisible = selectionMarkerGroup.visible;
  const wasSkeletonVisible = mannequinSkeletonGroup.visible;
  transformControls.visible = false;
  selectionMarkerGroup.visible = false;
  mannequinSkeletonGroup.visible = false;
  document.body.classList.add("is-capturing");
  renderer.render(scene, camera);

  const blobPromise = canvasToPngBlob(renderer.domElement);
  const clipboardPromise = copyPngBlobToClipboard(blobPromise);

  blobPromise.then(async (blob) => {
    let copied = false;
    if (blob) downloadBlob(blob, `${tr("screenshotFile")}-${timestamp()}.png`);
    restoreScreenshotState(changed, wasTransformVisible, wasSelectionMarkerVisible, wasSkeletonVisible);
    try {
      copied = await clipboardPromise;
    } catch (error) {
      copied = false;
    }
    showToast(tr(copied ? "screenshotCopied" : "screenshotCopyFailed"));
  });
}

function serializeScene() {
  return {
    version: 3,
    appVersion: APP_VERSION,
    viewMode: state.viewMode,
    panorama: state.panoramaInfo,
    selectedId: state.selected?.id || null,
    selectedIds: [...state.selectedIds],
    settings: {
      hideOccludersInShot: dom.hideOccludersInShot.checked,
      showSkeleton: state.showSkeleton,
    },
    camera: {
      yaw: state.targetYaw,
      pitch: state.targetPitch,
      fov: state.targetFov,
    },
    objects: state.objects.map((item) => ({
      id: item.id,
      type: item.type,
      kind: item.kind,
      pivot: item.type === "mannequin" ? "center" : undefined,
      name: item.name,
      color: item.color,
      opacity: item.opacity,
      locked: Boolean(item.locked),
      pose: item.pose,
      joints: item.type === "mannequin" ? getJointAngles(item) : undefined,
      partVisibility: item.partVisibility,
      position: item.group.position.toArray(),
      rotation: [item.group.rotation.x, item.group.rotation.y, item.group.rotation.z],
      scale: item.group.scale.toArray(),
    })),
  };
}

function saveScene() {
  const json = JSON.stringify(serializeScene(), null, 2);
  downloadBlob(new Blob([json], { type: "application/json" }), `${tr("sceneFile")}-${timestamp()}.json`);
  showToast(tr("sceneSaved"));
}

function clearObjects() {
  transformControls.detach();
  for (const item of state.objects) {
    scene.remove(item.group);
    item.group.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
    });
  }
  state.objects = [];
  resetCreationCounts();
  selectObject(null);
}

function loadSceneFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      restoreScene(data, { silent: true });
      rememberHistory();
      showToast(tr("sceneLoaded"));
    } catch (error) {
      showToast(tr("sceneParseFailed"));
      console.error(error);
    }
  };
  reader.readAsText(file, "utf-8");
}

function restoreScene(data, options = {}) {
  clearObjects();
  state.targetYaw = data.camera?.yaw || 0;
  state.targetPitch = data.camera?.pitch || 0;
  state.targetFov = data.camera?.fov || 72;
  if (data.settings?.hideOccludersInShot !== undefined) {
    dom.hideOccludersInShot.checked = Boolean(data.settings.hideOccludersInShot);
  }
  state.showSkeleton = Boolean(data.settings?.showSkeleton);
  dom.showSkeletonInput.checked = state.showSkeleton;

  let maxRestoredId = 0;
  state.nextId = 1;

  for (const saved of data.objects || []) {
    let item;
    if (saved.type === "mannequin") {
      item = createMannequin(saved.name || undefined, { silent: true, select: false, ignoreLimits: true });
      applyPose(item, saved.pose || "standing");
      applyJointValues(item, saved.joints || {});
      item.partVisibility = { ...item.partVisibility, ...saved.partVisibility };
      Object.entries(item.partVisibility).forEach(([part, visible]) => setPartVisible(item, part, visible));
    } else if (saved.type === "primitive") {
      item = createPrimitive(saved.kind || "cube", saved.name || undefined, { silent: true, select: false, ignoreLimits: true });
    } else {
      item = createOccluder(saved.kind || "plane", saved.name || undefined, { silent: true, select: false, ignoreLimits: true });
    }

    if (saved.id) item.id = saved.id;
    const idNumber = Number(String(item.id).match(/^obj-(\d+)$/)?.[1] || 0);
    maxRestoredId = Math.max(maxRestoredId, idNumber);
    setMaterialColor(item, saved.color || item.color);
    setMaterialOpacity(item, saved.opacity ?? item.opacity ?? 100);
    item.locked = Boolean(saved.locked);
    if (Array.isArray(saved.position)) {
      item.group.position.fromArray(saved.position);
      if (saved.type === "mannequin" && saved.pivot !== "center") {
        item.group.position.y += MANNEQUIN_CENTER_OFFSET_Y;
      }
    }
    if (Array.isArray(saved.rotation)) item.group.rotation.set(saved.rotation[0], saved.rotation[1], saved.rotation[2]);
    if (Array.isArray(saved.scale)) {
      item.group.scale.fromArray(saved.scale);
      clampScaleVector(item.group.scale);
    }
  }

  state.nextId = Math.max(state.nextId, maxRestoredId + 1);
  inferCreationCountsFromScene();
  updateLayerOrder();
  const restoredSelectedItems = Array.isArray(data.selectedIds)
    ? data.selectedIds.map((id) => state.objects.find((item) => item.id === id)).filter(Boolean)
    : [];
  const selected = state.objects.find((item) => item.id === data.selectedId) || restoredSelectedItems[restoredSelectedItems.length - 1] || state.objects[state.objects.length - 1] || null;
  if (restoredSelectedItems.length) selectObjects(restoredSelectedItems, selected);
  else selectObject(selected);
  if (!options.silent) showToast(tr("sceneRestored"));
}

function onPointerDown(event) {
  if (event.button !== 0) return;
  if (transformControls.dragging || transformControls.axis !== null) return;

  const picked = pickObject(event);
  state.previousPointer.set(event.clientX, event.clientY);
  dom.canvas.setPointerCapture(event.pointerId);

  if (picked) {
    if (event.ctrlKey || event.metaKey) {
      selectLayerObject(picked, event);
      return;
    }
    selectObject(picked);
    if (state.transformMode === "translate" && !state.isTransformDragging && selectedItems().length <= 1 && !picked.locked) {
      beginObjectDrag(event, picked);
    }
  } else {
    selectObject(null);
    if (state.viewMode !== "flat") {
      state.isCameraDragging = true;
      dom.canvas.classList.add("dragging");
    }
  }
}

function beginObjectDrag(event, item) {
  if (item.locked) return;
  normalizePointer(event);
  state.raycaster.setFromCamera(state.pointer, camera);
  const normal = new THREE.Vector3();
  camera.getWorldDirection(normal);
  state.dragPlane.setFromNormalAndCoplanarPoint(normal, item.group.position);
  const point = new THREE.Vector3();
  if (state.raycaster.ray.intersectPlane(state.dragPlane, point)) {
    state.dragOffset.copy(item.group.position).sub(point);
    state.isObjectDragging = true;
    dom.canvas.classList.add("dragging");
  }
}

function onPointerMove(event) {
  if (state.isObjectDragging && state.selected && !state.isTransformDragging) {
    normalizePointer(event);
    state.raycaster.setFromCamera(state.pointer, camera);
    const point = new THREE.Vector3();
    if (state.raycaster.ray.intersectPlane(state.dragPlane, point)) {
      state.selected.group.position.copy(point.add(state.dragOffset));
      syncPanel();
    }
    return;
  }

  if (!state.isCameraDragging || state.isTransformDragging) return;

  const dx = event.clientX - state.previousPointer.x;
  const dy = event.clientY - state.previousPointer.y;
  state.targetYaw += dx * 0.0042;
  state.targetPitch = THREE.MathUtils.clamp(state.targetPitch + dy * 0.0042, -1.48, 1.48);
  state.previousPointer.set(event.clientX, event.clientY);
}

function onPointerUp(event) {
  const wasObjectDragging = state.isObjectDragging;
  const wasCameraDragging = state.isCameraDragging;
  state.isCameraDragging = false;
  state.isObjectDragging = false;
  dom.canvas.classList.remove("dragging");
  if (dom.canvas.hasPointerCapture(event.pointerId)) dom.canvas.releasePointerCapture(event.pointerId);
  if (wasObjectDragging || wasCameraDragging) rememberHistory();
}

function onWheel(event) {
  event.preventDefault();
  state.targetFov = THREE.MathUtils.clamp(state.targetFov + Math.sign(event.deltaY) * 4, 32, 96);
  clearTimeout(onWheel.historyTimer);
  onWheel.historyTimer = setTimeout(rememberHistory, 320);
}

function onDrop(event) {
  event.preventDefault();
  document.body.classList.remove("drop-active");
  const file = event.dataTransfer.files?.[0];
  if (!file) return;
  if (file.type === "application/json" || file.name.toLowerCase().endsWith(".json")) {
    loadSceneFile(file);
  } else {
    loadPanoramaFromFile(file);
  }
}

function bindEvents() {
  window.addEventListener("resize", resize);
  dom.canvas.addEventListener("pointerdown", onPointerDown);
  dom.canvas.addEventListener("pointermove", onPointerMove);
  dom.canvas.addEventListener("pointerup", onPointerUp);
  dom.canvas.addEventListener("pointercancel", onPointerUp);
  dom.canvas.addEventListener("wheel", onWheel, { passive: false });

  document.getElementById("uploadButton").addEventListener("click", () => dom.fileInput.click());
  document.getElementById("emptyUploadButton").addEventListener("click", () => dom.fileInput.click());
  document.getElementById("screenshotButton").addEventListener("click", captureScreenshot);
  document.getElementById("resetCameraButton").addEventListener("click", resetCamera);
  document.getElementById("fullscreenButton").addEventListener("click", toggleFullscreen);
  dom.languageButton.addEventListener("click", () => setLanguage(state.language === "zh" ? "en" : "zh"));
  dom.panelToggleButton.addEventListener("click", () => {
    setPanelCollapsed(!document.body.classList.contains("panel-collapsed"));
  });
  dom.hidePanelButton.addEventListener("click", () => setPanelCollapsed(true));
  dom.undoButton.addEventListener("click", undoScene);
  dom.redoButton.addEventListener("click", redoScene);
  document.getElementById("addMannequinButton").addEventListener("click", () => {
    if (createMannequin()) rememberHistory();
  });
  document.getElementById("addCrowdButton").addEventListener("click", addCrowd);
  document.getElementById("addCubeButton").addEventListener("click", () => {
    if (createPrimitive("cube")) rememberHistory();
  });
  document.getElementById("addSphereButton").addEventListener("click", () => {
    if (createPrimitive("sphere")) rememberHistory();
  });
  document.getElementById("addOccluderPlaneButton").addEventListener("click", () => {
    if (createOccluder("plane")) rememberHistory();
  });
  document.getElementById("addOccluderCircleButton").addEventListener("click", () => {
    if (createOccluder("circle")) rememberHistory();
  });
  document.getElementById("addOccluderBoxButton").addEventListener("click", () => {
    if (createOccluder("box")) rememberHistory();
  });
  document.getElementById("addOccluderSphereButton").addEventListener("click", () => {
    if (createOccluder("sphere")) rememberHistory();
  });
  dom.duplicateButton.addEventListener("click", duplicateSelected);
  dom.deleteButton.addEventListener("click", deleteSelected);
  document.getElementById("saveSceneButton").addEventListener("click", saveScene);
  document.getElementById("loadSceneButton").addEventListener("click", () => dom.sceneInput.click());

  dom.fileInput.addEventListener("change", () => {
    loadPanoramaFromFile(dom.fileInput.files?.[0]);
    dom.fileInput.value = "";
  });
  dom.sceneInput.addEventListener("change", () => {
    loadSceneFile(dom.sceneInput.files?.[0]);
    dom.sceneInput.value = "";
  });

  dom.objectSelect.addEventListener("change", () => {
    selectObject(state.objects.find((item) => item.id === dom.objectSelect.value) || null);
  });

  dom.transformButtons.forEach((button) => {
    button.addEventListener("click", () => updateTransformMode(button.dataset.transformMode));
  });

  [dom.pos.x, dom.pos.y, dom.pos.z, dom.rot.x, dom.rot.y, dom.rot.z, dom.scaleInput].forEach((input) => {
    input.addEventListener("change", applyPanelTransformAndSync);
    input.addEventListener("blur", applyPanelTransformAndSync);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") applyPanelTransformAndSync();
    });
  });

  dom.colorInput.addEventListener("input", () => {
    if (canEditItem()) setMaterialColor(state.selected, dom.colorInput.value);
  });
  dom.colorInput.addEventListener("change", () => {
    if (canEditItem()) rememberHistory();
  });
  dom.lockButton.addEventListener("click", () => {
    if (!state.selected || selectedItems().length > 1) return;
    state.selected.locked = !state.selected.locked;
    updateSelectionUi();
    rememberHistory();
  });
  dom.poseSelect.addEventListener("change", () => {
    if (!canEditItem() || state.selected.type !== "mannequin") return;
    applyPose(state.selected, dom.poseSelect.value);
    rememberHistory();
  });

  Object.entries(dom.joints).forEach(([jointName, input]) => {
    input.addEventListener("input", () => {
      if (!canEditItem() || state.selected.type !== "mannequin") return;
      setJointAngle(state.selected, jointName, input.value);
    });
    input.addEventListener("change", () => {
      if (!canEditItem() || state.selected.type !== "mannequin") return;
      setJointAngle(state.selected, jointName, input.value);
      syncJointPanel();
      rememberHistory();
    });
  });

  dom.showSkeletonInput.addEventListener("change", () => {
    state.showSkeleton = dom.showSkeletonInput.checked;
    updateSkeletonOverlay();
    rememberHistory();
  });
  dom.hideOccludersInShot.addEventListener("change", rememberHistory);

  window.addEventListener("dragover", (event) => {
    event.preventDefault();
    document.body.classList.add("drop-active");
  });
  window.addEventListener("dragleave", (event) => {
    if (event.clientX <= 0 || event.clientY <= 0 || event.clientX >= window.innerWidth || event.clientY >= window.innerHeight) {
      document.body.classList.remove("drop-active");
    }
  });
  window.addEventListener("drop", onDrop);
  document.addEventListener("fullscreenchange", updateFullscreenButton);

  window.addEventListener("keydown", (event) => {
    if (event.target.matches("input, select, textarea")) return;
    const key = event.key.toLowerCase();
    if ((event.ctrlKey || event.metaKey) && key === "z") {
      event.preventDefault();
      if (event.shiftKey) redoScene();
      else undoScene();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && key === "y") {
      event.preventDefault();
      redoScene();
      return;
    }
    if (key === "s" && !event.ctrlKey && !event.metaKey) captureScreenshot();
    if (key === "f" && !event.ctrlKey && !event.metaKey) toggleFullscreen();
    if (key === "r" && !event.ctrlKey && !event.metaKey) resetCamera();
    if (key === "h" && !event.ctrlKey && !event.metaKey && document.body.classList.contains("panorama-loaded")) {
      setPanelCollapsed(!document.body.classList.contains("panel-collapsed"));
    }
    if (key === "delete" || key === "backspace") deleteSelected();
    if (key === "w") updateTransformMode("translate");
    if (key === "e") updateTransformMode("rotate");
    if (key === "escape") selectObject(null);
  });
}

function initFromQuery() {
  const requestedImage = new URLSearchParams(window.location.search).get("image");
  if (requestedImage) {
    loadPanorama(encodeURI(requestedImage), imageNameFromUrl(requestedImage));
  }
}

resize();
bindEvents();
applyLanguage();
updateObjectSelect();
syncPanel();
resetHistory();
render();
initFromQuery();
