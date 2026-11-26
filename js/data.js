/* ============================================================================
   js/data.js — Frame-Accurate 24-Step Restoration Script for youtu.be/6Nw7Hi4Xr9s
   Episode 1 (00:00–06:35): The Prototype (Experiment 1006 Jester Spider Doll)
   Episode 2 (06:40–14:41): Abandoned CatNap Plush (Poppy Playtime 3/4)
   ============================================================================ */
(function (root) {
  'use strict';

  const I18N = {
    zh: {
      appTitle: 'Prototype & CatNap 精密修复工坊',
      epPrototype: 'EP.1 原型机 1006',
      epCatnap: 'EP.2 瞌睡猫 CatNap',
      audioOn: 'ASMR',
      audioOff: '静音',
      spookyOn: '惊悚结局',
      spookyOff: '温馨结局',
      assist: '提示',
      introHeading: '废弃原型机 & 瞌睡猫 ASMR 修复工坊',
      introSub: '极高精度还原 youtu.be/6Nw7Hi4Xr9s 完整 14:41 双篇剧情：白色瓷砖实验室换脑与 CRT 脑波同步、绿色实验舱装脊柱肋骨、经典铁柜装蜘蛛腿与利爪泡沫冲洗、Playcare 拧灯泡、SMILE BAM 洗衣机、木质裁缝台选布料彩蛋与红光觉醒！',
      startProtoTitle: '开始 EP.1：原型机 1006',
      startProtoSub: '00:00–06:35 · 12 步精密机械修复',
      startCatnapTitle: '开始 EP.2：瞌睡猫 CatNap',
      startCatnapSub: '06:40–14:41 · 12 步毛绒洗护缝补',
      resumeSave: '▶ 继续上次进度',
      replayEp: '重玩本篇',
      drawerTitle: '完整 24 步场景目录 (youtu.be/6Nw7Hi4Xr9s)',
      secProto: 'EP.1 · 原型机 1006 (00:00–06:35)',
      secCatnap: 'EP.2 · 瞌睡猫 CatNap (06:40–14:41)',
      stepComplete: '✨ 步骤完成！',
      wrongFabricYellow: '❌ 黄色布料颜色不对！试试别的颜色',
      wrongFabricBlue: '❌ 蓝色布料也不匹配！找找 CATNAP 专用紫色布',
      rightFabricPurple: '✅ 找到 CATNAP 专用紫色毛绒布！用剪刀剪下补丁',
      fridgeOpened: '🧊 冰箱已打开！发现发光绿色新鲜大脑罐',
      lockerOpened: '🔓 蓝色储物柜已打开！发现 Huggy 蓝臂与 Mommy 粉臂',
      cabinetOpened: '🚪 经典铁皮工具柜展开！',
      reportChecked: '📋 已查看实验报告！现在去拧亮头顶灯泡',
      washerLoaded: '🫧 SMILE BAM 滚筒洗衣机启动清洗！',
      finaleProtoTitle: '原型机 1006 修复完成 · 红光觉醒！',
      finaleProtoCozyTitle: '原型机 1006 修复完成 · 闪耀登场！',
      finaleProtoDesc: '全部 12 步实验室、实验舱与钢制工具柜修复工序完成！',
      finaleProtoNext: '进入 EP.2：修复瞌睡猫 CatNap →',
      finaleCatnapTitle: '瞌睡猫 CatNap 修复完成 · 暗夜降临！',
      finaleCatnapCozyTitle: '瞌睡猫 CatNap 焕然一新 · 薰衣草好梦！',
      finaleCatnapDesc: '完整通关 youtu.be/6Nw7Hi4Xr9s 全部 24 步双篇 ASMR 修复剧情！',
      finaleCatnapNext: '返回 EP.1：原型机 1006 ↺'
    },
    en: {
      appTitle: 'Prototype & CatNap ASMR Restoration Studio',
      epPrototype: 'EP.1 Prototype 1006',
      epCatnap: 'EP.2 CatNap Plush',
      audioOn: 'ASMR',
      audioOff: 'Muted',
      spookyOn: 'Spooky End',
      spookyOff: 'Cozy End',
      assist: 'Guide',
      introHeading: 'Abandoned Prototype & CatNap ASMR Workshop',
      introSub: 'Frame-accurate 24-step recreation of youtu.be/6Nw7Hi4Xr9s (14:41): White-tile lab brain transplant & CRT sync, green experiment chamber spine & ribcage, iconic steel tool cabinet spider legs, claw forge & foam wash, Playcare lightbulb, SMILE BAM washer, wooden tailor workbench fabric gag & finale!',
      startProtoTitle: 'Play EP.1: The Prototype 1006',
      startProtoSub: '00:00–06:35 · 12 Mechanical Repair Steps',
      startCatnapTitle: 'Play EP.2: Abandoned CatNap',
      startCatnapSub: '06:40–14:41 · 12 Plush Restoration Steps',
      resumeSave: '▶ Resume Saved Progress',
      replayEp: 'Replay Episode',
      drawerTitle: 'All 24 Restoration Steps (youtu.be/6Nw7Hi4Xr9s)',
      secProto: 'EP.1 · THE PROTOTYPE 1006 (00:00–06:35)',
      secCatnap: 'EP.2 · ABANDONED CATNAP (06:40–14:41)',
      stepComplete: '✨ Step Complete!',
      wrongFabricYellow: '❌ Yellow fabric does not match! Try another swatch',
      wrongFabricBlue: '❌ Blue fabric does not match either! Find CATNAP Purple',
      rightFabricPurple: '✅ Official CATNAP Purple Plush selected! Cut patches with scissors',
      fridgeOpened: '🧊 Lab fridge opened! Glowing green fresh brain vat found',
      lockerOpened: '🔓 Blue trophy locker opened! Huggy & Mommy arms retrieved',
      cabinetOpened: '🚪 Steel repair cabinet doors swung open!',
      reportChecked: '📋 Case REPORT inspected! Now screw in the overhead lightbulb',
      washerLoaded: '🫧 SMILE BAM washing machine spin cycle running!',
      finaleProtoTitle: 'The Prototype 1006 Restored · Red-Alert Awakening!',
      finaleProtoCozyTitle: 'The Prototype 1006 Restored · Shining Workshop Star!',
      finaleProtoDesc: 'All 12 lab, experiment chamber, and steel cabinet steps complete!',
      finaleProtoNext: 'Continue to EP.2: Restore CatNap →',
      finaleCatnapTitle: 'CatNap Restored · Red Smoke Shadows Awaken!',
      finaleCatnapCozyTitle: 'CatNap Restored · Sweet Lavender Dreams!',
      finaleCatnapDesc: 'You completed all 24 ASMR restoration steps from youtu.be/6Nw7Hi4Xr9s!',
      finaleCatnapNext: 'Replay EP.1: The Prototype 1006 ↺'
    }
  };

  /**
   * All 24 faithful restoration steps (12 Prototype + 12 CatNap)
   * Interaction modes:
   * - 'pull'   : press on target and drag outward (or tap-hold assist)
   * - 'multi'  : sequential sub-actions (e.g., open fridge -> scoop old brain -> implant new brain)
   * - 'hold'   : press/hold or tap repeatedly on target zone (CRT typing, washing spin)
   * - 'scrub'  : drag back and forth over target zone to reach 100%
   * - 'drag'   : drag item(s) into glowing socket(s) (or tap socket with tool equipped)
   * - 'fabric' : special Step 20 SmileBam fabric gag + scissor cut + patch stitch
   */
  const STEPS = [
    // ==================== EPISODE 1: THE PROTOTYPE (00:00 - 06:35) ====================
    {
      id: 'p01_knife',
      episode: 'prototype',
      index: 0,
      room: 'lab_desk',
      timestamp: '00:45',
      roomLabel: { zh: '白色瓷砖实验室', en: 'White-Tile Lab Desk' },
      title: { zh: '拔出额头匕首', en: 'Pull Embedded Skull Dagger' },
      hint: {
        zh: '选中手术钳，按住额头匕首向右上方拔出',
        en: 'Select Pliers and drag the dagger upward out of the skull mask'
      },
      mode: 'pull',
      target: { x: 676, y: 205, r: 78, dx: 95, dy: -85 },
      tools: [
        { id: 'pliers', emoji: '🔧', zh: '手术钳', en: 'Pliers', recommended: true }
      ],
      sound: 'metallicPull'
    },
    {
      id: 'p02_brain_extract',
      episode: 'prototype',
      index: 1,
      room: 'lab_desk',
      timestamp: '01:05',
      roomLabel: { zh: '白色瓷砖实验室', en: 'White-Tile Lab Desk' },
      title: { zh: '开冰箱取新鲜大脑并移植', en: 'Open Fridge & Transplant Fresh Brain' },
      hint: {
        zh: '① 点开右侧黄冰箱 ② 用双勺挖出旧脑 ③ 植入发光绿脑',
        en: '1) Open yellow fridge  2) Scoop dried brain with spoons  3) Implant glowing brain'
      },
      mode: 'multi',
      substeps: [
        { key: 'open_fridge', tool: 'hand', x: 1055, y: 360, r: 120, sound: 'fridgeOpen',
          zh: '点击打开右侧黄色实验冰箱', en: 'Tap the mustard lab fridge to open it' },
        { key: 'scoop_old', tool: 'spoons', x: 600, y: 180, r: 95, sound: 'brainSquish',
          zh: '用金属双勺挖出头顶破损的干枯大脑', en: 'Use metal spoons to scoop out the dried brain' },
        { key: 'implant_new', tool: 'spoons', x: 615, y: 185, r: 95, sound: 'brainGlow',
          zh: '点击/拖入发光绿色新鲜大脑完成移植', en: 'Implant the glowing green brain into the skull dome' }
      ],
      tools: [
        { id: 'hand', emoji: '🧤', zh: '手套', en: 'Glove', recommended: true },
        { id: 'spoons', emoji: '🥄', zh: '金属双勺', en: 'Brain Spoons' }
      ]
    },
    {
      id: 'p03_crt_sync',
      episode: 'prototype',
      index: 2,
      room: 'lab_desk_crt',
      timestamp: '01:35',
      roomLabel: { zh: '90年代 CRT 终端', en: '90s CRT Brain Monitor' },
      title: { zh: 'CRT 电脑脑波同步校准', en: '90s CRT Brainwave Calibration' },
      hint: {
        zh: '按住或连点键盘，将绿色双半球脑波同步至 100%',
        en: 'Hold or tap the keyboard to sync the green dual-hemisphere brainwave to 100%'
      },
      mode: 'scrub',
      target: { x: 470, y: 540, r: 220 },
      tools: [
        { id: 'gloves_type', emoji: '⌨️', zh: '青色手套打字', en: 'CRT Keyboard', recommended: true }
      ],
      sound: 'crtType'
    },
    {
      id: 'p04_hat_teeth',
      episode: 'prototype',
      index: 3,
      room: 'lab_desk',
      timestamp: '01:55',
      roomLabel: { zh: '白色瓷砖实验室', en: 'White-Tile Lab Desk' },
      title: { zh: '缝回红小丑帽角 & 清洁锯齿牙', en: 'Restore Red Jester Horn & Scrub Teeth' },
      hint: {
        zh: '① 用针线缝回缺失的红色帽角与金铃 ② 用牙科刷刷净锯齿牙',
        en: '1) Stitch back the torn red jester horn & bell  2) Scrub the jagged teeth clean'
      },
      mode: 'multi',
      substeps: [
        { key: 'stitch_horn', tool: 'needle', x: 540, y: 175, r: 105, sound: 'stitchZip',
          zh: '用针线缝合左侧红色小丑帽角与金铃铛', en: 'Stitch the left red jester horn & golden bell' },
        { key: 'scrub_teeth', tool: 'dental', x: 640, y: 315, r: 95, sound: 'dentalScrub', scrubRequired: true,
          zh: '用牙科清洁刷来回刷净锯齿大嘴', en: 'Scrub across the jagged smile with the dental tool' }
      ],
      tools: [
        { id: 'needle', emoji: '🪡', zh: '缝合针', en: 'Needle', recommended: true },
        { id: 'dental', emoji: '🪥', zh: '牙科刷', en: 'Dental Tool' }
      ]
    },
    {
      id: 'p05_spine_bolt',
      episode: 'prototype',
      index: 4,
      room: 'green_chamber',
      timestamp: '02:25',
      roomLabel: { zh: '绿色瓷砖实验舱', en: 'Green Experiment Chamber' },
      title: { zh: '吊装机械脊柱与骨盆探照灯', en: 'Mount Mechanical Spine & Pelvis Core' },
      hint: {
        zh: '① 操作蓝色吊爪降下机械脊柱 ② 用扳手拧紧脊柱与探照灯螺栓',
        en: '1) Lower the mechanical spine from the blue crane  2) Bolt the spine & headlight pelvis'
      },
      mode: 'multi',
      substeps: [
        { key: 'crane_lower', tool: 'crane', x: 930, y: 210, r: 130, sound: 'craneServo',
          zh: '点击蓝色机械吊爪，吊装机械脊柱组件', en: 'Activate the blue overhead crane to drop the spine' },
        { key: 'bolt_spine', tool: 'wrench', x: 640, y: 470, r: 115, sound: 'wrenchRatchet', scrubRequired: true,
          zh: '用扳手在腰部反复拧紧脊柱连接件', en: 'Tighten the spine & pelvis bolts with the wrench' }
      ],
      tools: [
        { id: 'crane', emoji: '🏗️', zh: '蓝吊爪', en: 'Crane', recommended: true },
        { id: 'wrench', emoji: '🔧', zh: '棘轮扳手', en: 'Wrench' }
      ]
    },
    {
      id: 'p06_ribcage_core',
      episode: 'prototype',
      index: 5,
      room: 'green_chamber',
      timestamp: '03:05',
      roomLabel: { zh: '绿色瓷砖实验舱', en: 'Green Experiment Chamber' },
      title: { zh: '激活深红培养罐 & 拼装白骨肋笼', en: 'Harvest Crimson Tank Core & Snap Ribs' },
      hint: {
        zh: '① 按下培养罐绿色手印板提取核心 ② 将弧形白骨肋条逐排装入暗红胸甲',
        en: '1) Press green hand-pad on crimson tank  2) Snap white curved ribs into the armored ribcage'
      },
      mode: 'multi',
      substeps: [
        { key: 'tank_core', tool: 'hand', x: 1020, y: 515, r: 125, sound: 'tankBubble',
          zh: '按压黄色控制台绿色手印，提取深红培养罐能量核心', en: 'Press the green GrabPack hand scanner to harvest the core' },
        { key: 'snap_ribs_1', tool: 'ribs', x: 640, y: 545, r: 130, sound: 'ribSnap',
          zh: '装入上排弧形白骨肋条', en: 'Snap the upper white ribs into the ribcage' },
        { key: 'snap_ribs_2', tool: 'ribs', x: 640, y: 600, r: 130, sound: 'ribSnap',
          zh: '装入下排白骨肋条并锁定胸甲', en: 'Snap the lower white ribs to lock the carapace' }
      ],
      tools: [
        { id: 'hand', emoji: '🖐️', zh: '手印扫描', en: 'Hand Scan', recommended: true },
        { id: 'ribs', emoji: '🦴', zh: '白骨肋条', en: 'Ribs' }
      ]
    },
    {
      id: 'p07_trophy_limbs',
      episode: 'prototype',
      index: 6,
      room: 'green_chamber',
      timestamp: '03:45',
      roomLabel: { zh: '绿色瓷砖实验舱', en: 'Green Experiment Chamber' },
      title: { zh: '收集 Huggy 蓝臂与 Mommy 粉臂', en: 'Retrieve Huggy & Mommy Trophy Limbs' },
      hint: {
        zh: '打开右侧蓝色储物柜，取出波比蓝毛绒臂与妈咪长腿粉臂',
        en: 'Open the blue locker to collect Huggy Wuggy blue arm & Mommy Long Legs pink arm'
      },
      mode: 'multi',
      substeps: [
        { key: 'open_locker', tool: 'hand', x: 1080, y: 540, r: 130, sound: 'steelDoor',
          zh: '点击打开右侧蓝色零件柜', en: 'Tap to open the blue parts locker' },
        { key: 'take_huggy', tool: 'hand', x: 1065, y: 525, r: 115, sound: 'plushGrab',
          zh: '取出 Huggy Wuggy 蓝色长毛手臂', en: 'Retrieve Huggy Wuggy furry blue arm' },
        { key: 'take_mommy', tool: 'hand', x: 1085, y: 575, r: 115, sound: 'plushGrab',
          zh: '取出 Mommy Long Legs 弹性粉手臂', en: 'Retrieve Mommy Long Legs pink stretchy arm' }
      ],
      tools: [
        { id: 'hand', emoji: '🧤', zh: '收集手套', en: 'Collect', recommended: true }
      ]
    },
    {
      id: 'p08_spider_legs',
      episode: 'prototype',
      index: 7,
      room: 'steel_cabinet',
      timestamp: '04:15',
      roomLabel: { zh: '经典钢制工具柜', en: 'Iconic Steel Repair Cabinet' },
      title: { zh: '展开钢柜 & 安装六足机械蜘蛛腿', en: 'Open Steel Cabinet & Bolt Spider Chassis' },
      hint: {
        zh: '① 拉开双扇钢门 ② 安装左右机械蜘蛛腿 ③ 降下原型机上半身合体',
        en: '1) Swing open steel doors  2) Bolt left & right spider legs  3) Dock Prototype torso'
      },
      mode: 'multi',
      substeps: [
        { key: 'open_doors', tool: 'hand', x: 640, y: 360, r: 220, sound: 'steelDoor',
          zh: '点击拉开双扇灰钢门（视频封面经典场景！）', en: 'Tap to swing open the double steel cabinet doors!' },
        { key: 'left_spider', tool: 'wrench', x: 400, y: 520, r: 140, sound: 'wrenchRatchet',
          zh: '拧紧左侧三根重型机械蜘蛛腿', en: 'Bolt the 3 heavy left spider legs onto the chassis' },
        { key: 'right_spider', tool: 'wrench', x: 880, y: 520, r: 140, sound: 'wrenchRatchet',
          zh: '拧紧右侧三根重型机械蜘蛛腿', en: 'Bolt the 3 heavy right spider legs onto the chassis' },
        { key: 'dock_torso', tool: 'hammer', x: 640, y: 350, r: 145, sound: 'metallicClank',
          zh: '用木柄羊角锤敲击锁定原型机躯干', en: 'Lock the Prototype upper torso onto the spider chassis' }
      ],
      tools: [
        { id: 'hand', emoji: '🚪', zh: '开钢门', en: 'Open Doors', recommended: true },
        { id: 'wrench', emoji: '🔧', zh: '活动扳手', en: 'Wrench' },
        { id: 'hammer', emoji: '🔨', zh: '羊角锤', en: 'Hammer' }
      ]
    },
    {
      id: 'p09_claw_hands',
      episode: 'prototype',
      index: 8,
      room: 'steel_cabinet',
      timestamp: '04:40',
      roomLabel: { zh: '经典钢制工具柜', en: 'Iconic Steel Repair Cabinet' },
      title: { zh: '锻造并装配 1006 针刺利爪手', en: 'Forge & Attach Razor Claw Hands' },
      hint: {
        zh: '激活红光蓝图炉锻造针刺金属手指，装配至左右双臂',
        en: 'Forge the iconic needle-fingered 1006 claw hands and bolt them to both arms'
      },
      mode: 'multi',
      substeps: [
        { key: 'forge_claw', tool: 'torch', x: 855, y: 290, r: 120, sound: 'furnaceSizzle', scrubRequired: true,
          zh: '按住加热红光锻造炉，成型 1006 针刺利爪', en: 'Heat the crimson blueprint forge to form the claw fingers' },
        { key: 'attach_left_claw', tool: 'wrench', x: 445, y: 490, r: 120, sound: 'metallicClank',
          zh: '装配左侧标志性长针金属利爪手', en: 'Attach the iconic left needle-finger claw hand' },
        { key: 'attach_right_claw', tool: 'wrench', x: 835, y: 490, r: 120, sound: 'metallicClank',
          zh: '装配右侧长针金属利爪手', en: 'Attach the right needle-finger claw hand' }
      ],
      tools: [
        { id: 'torch', emoji: '🔥', zh: '锻造蓝图', en: 'Forge', recommended: true },
        { id: 'wrench', emoji: '🔧', zh: '装配扳手', en: 'Attach' }
      ]
    },
    {
      id: 'p10_foam_rinse',
      episode: 'prototype',
      index: 9,
      room: 'steel_cabinet',
      timestamp: '05:05',
      roomLabel: { zh: '经典钢制工具柜', en: 'Iconic Steel Repair Cabinet' },
      title: { zh: 'ASMR 绵密白泡沫覆盖 & 高压水枪冲洗', en: 'ASMR Thick Foam Coat & Pressure Rinse' },
      hint: {
        zh: '① 用镀铬喷枪喷满绵密白泡沫 ② 切换高压水枪把泡沫、泥污与粉色涂鸦冲干净！',
        en: '1) Coat Prototype in thick white ASMR foam  2) Blast away foam, grime & pink crayon with pressure water!'
      },
      mode: 'multi',
      substeps: [
        { key: 'apply_foam', tool: 'foam_gun', x: 640, y: 365, r: 195, sound: 'foamSpray', scrubRequired: true,
          zh: '在原型机全身涂满蓬松洁白的 ASMR 清洁泡沫', en: 'Spray fluffy white ASMR cleaning foam all over Prototype' },
        { key: 'rinse_water', tool: 'water_jet', x: 640, y: 365, r: 195, sound: 'waterJet', scrubRequired: true,
          zh: '用高压金属水枪把泡沫和污渍彻底冲净！', en: 'Blast away every foam bubble & stain with the water jet!' }
      ],
      tools: [
        { id: 'foam_gun', emoji: '🫧', zh: '泡沫喷枪', en: 'Foam Gun', recommended: true },
        { id: 'water_jet', emoji: '💦', zh: '高压水枪', en: 'Water Jet' }
      ]
    },
    {
      id: 'p11_graft_limbs',
      episode: 'prototype',
      index: 10,
      room: 'steel_cabinet',
      timestamp: '05:35',
      roomLabel: { zh: '经典钢制工具柜', en: 'Iconic Steel Repair Cabinet' },
      title: { zh: '嫁接 Mommy 粉臂与 Huggy 蓝臂至蜘蛛胸腔', en: 'Graft Mommy Pink Arm & Huggy Blue Arm' },
      hint: {
        zh: '将右侧工具柜挂着的粉手臂与蓝毛绒臂嫁接到蜘蛛肋笼下方',
        en: 'Graft Mommy pink arm & Huggy blue arm from the cabinet rack into the ribcage'
      },
      mode: 'multi',
      substeps: [
        { key: 'graft_mommy', tool: 'mommy_arm', x: 610, y: 565, r: 135, sound: 'ribSnap',
          zh: '安装 Mommy Long Legs 粉色长臂至胸腔左侧', en: 'Graft Mommy Long Legs pink arm into the spider ribcage' },
        { key: 'graft_huggy', tool: 'huggy_arm', x: 685, y: 565, r: 135, sound: 'ribSnap',
          zh: '安装 Huggy Wuggy 蓝色毛绒臂至胸腔右侧', en: 'Graft Huggy Wuggy blue furry arm beside it' }
      ],
      tools: [
        { id: 'mommy_arm', emoji: '🩷', zh: 'Mommy 粉臂', en: 'Pink Arm', recommended: true },
        { id: 'huggy_arm', emoji: '💙', zh: 'Huggy 蓝臂', en: 'Blue Arm' }
      ]
    },
    {
      id: 'p12_cassette_boot',
      episode: 'prototype',
      index: 11,
      room: 'steel_cabinet',
      timestamp: '06:05',
      roomLabel: { zh: '经典钢制工具柜 → 觉醒终章', en: 'Steel Cabinet → Awakening Finale' },
      title: { zh: '插入 PROTOTYPE 磁带 & 启动红光觉醒', en: 'Insert PROTOTYPE Cassette & Boot System' },
      hint: {
        zh: '① 插入左侧红字 PROTOTYPE 磁带 ② 抛光面具金铃 ③ 启动 CRT 100% 唤醒！',
        en: '1) Insert red PROTOTYPE cassette  2) Polish skull mask  3) Boot CRT to 100%!'
      },
      mode: 'multi',
      substeps: [
        { key: 'insert_cassette', tool: 'cassette', x: 640, y: 300, r: 125, sound: 'cassetteClick',
          zh: '将 PROTOTYPE 黑磁带插入核心记忆槽', en: 'Click the PROTOTYPE cassette tape into the memory slot' },
        { key: 'polish_mask', tool: 'cloth', x: 640, y: 270, r: 135, sound: 'polishBuff', scrubRequired: true,
          zh: '抛光小丑面具与金色帽铃，准备开机唤醒', en: 'Buff the jester mask & golden bells until gleaming' }
      ],
      tools: [
        { id: 'cassette', emoji: '📼', zh: 'PROTOTYPE磁带', en: 'Cassette', recommended: true },
        { id: 'cloth', emoji: '✨', zh: '抛光布', en: 'Polish' }
      ],
      triggersFinale: 'prototype'
    },

    // ==================== EPISODE 2: ABANDONED CATNAP (06:40 - 14:41) ====================
    {
      id: 'c01_lightbulb',
      episode: 'catnap',
      index: 12,
      room: 'playcare_room',
      timestamp: '06:50',
      roomLabel: { zh: '废弃 Playcare 玩具房', en: 'Abandoned Playcare Workshop' },
      title: { zh: '查看实验报告 & 拧亮头顶白炽灯泡', en: 'Inspect REPORT & Screw In Lightbulb' },
      hint: {
        zh: '① 点击查看纸板 REPORT 档案 ② 拧紧头顶灯泡点亮昏暗的 Playcare 房间',
        en: '1) Inspect the faded REPORT clipboard  2) Screw in the bare lightbulb to light the room'
      },
      mode: 'multi',
      substeps: [
        { key: 'check_report', tool: 'hand', x: 640, y: 360, r: 185, sound: 'paperFlip',
          zh: '点击查看实验档案 REPORT 剪贴板', en: 'Tap to inspect the case REPORT clipboard' },
        { key: 'screw_bulb', tool: 'bulb', x: 640, y: 125, r: 105, sound: 'bulbScrew', scrubRequired: true,
          zh: '旋转拧紧头顶吊灯白炽灯泡，照亮废弃瞌睡猫', en: 'Twist & screw in the overhead lightbulb to illuminate CatNap' }
      ],
      tools: [
        { id: 'hand', emoji: '📋', zh: '查看报告', en: 'Report', recommended: true },
        { id: 'bulb', emoji: '💡', zh: '白炽灯泡', en: 'Lightbulb' }
      ]
    },
    {
      id: 'c02_debris_eye',
      episode: 'catnap',
      index: 13,
      room: 'playcare_room',
      timestamp: '07:15',
      roomLabel: { zh: '废弃 Playcare 玩具房', en: 'Abandoned Playcare Workshop' },
      title: { zh: '镊子清除碎屑、脱出眼球与脸颊卡刃', en: 'Extract Debris, Dangling Eye & Cheek Blade' },
      hint: {
        zh: '用精密镊子依次清理左耳木刺、垂落红线眼球与右颊卡住的刀片标签',
        en: 'Use surgical tweezers to clear ear splinters, dangling eyeball & stuck cheek tag'
      },
      mode: 'multi',
      substeps: [
        { key: 'pull_ear_debris', tool: 'tweezers', x: 565, y: 205, r: 85, sound: 'tweezerPop',
          zh: '夹出左耳破洞里的杂物木刺', en: 'Pull debris splinters from the torn left ear' },
        { key: 'detach_eye', tool: 'tweezers', x: 590, y: 315, r: 85, sound: 'tweezerPop',
          zh: '小心取下垂挂在红线上的破损左眼球', en: 'Gently detach the dangling damaged left eye' },
        { key: 'remove_cheek_tag', tool: 'tweezers', x: 745, y: 300, r: 95, sound: 'metallicPull',
          zh: '拔出插在右脸颊的尖锐纸卡/刀片', en: 'Extract the stuck sharp tag/blade from the right cheek' }
      ],
      tools: [
        { id: 'tweezers', emoji: '🥢', zh: '精密镊子', en: 'Tweezers', recommended: true }
      ]
    },
    {
      id: 'c03_snip_spray',
      episode: 'catnap',
      index: 14,
      room: 'playcare_room',
      timestamp: '07:55',
      roomLabel: { zh: '废弃 Playcare 玩具房', en: 'Abandoned Playcare Workshop' },
      title: { zh: '剪除破线头、红罐去污喷雾 & 拆锈铁丝臂', en: 'Snip Threads, Red Aerosol Spray & Clear Wires' },
      hint: {
        zh: '① 黄柄剪刀剪去破损线头 ② 红黄喷雾罐喷洒去污泡沫 ③ 钳子清理锈铁丝右臂',
        en: '1) Snip frayed threads  2) Spray red-yellow aerosol cleaner  3) Pull rusty wires from right arm'
      },
      mode: 'multi',
      substeps: [
        { key: 'snip_threads', tool: 'scissors', x: 640, y: 470, r: 120, sound: 'scissorSnip',
          zh: '用黄柄剪刀剪除腹部散落破线头', en: 'Snip the loose frayed threads around CatNap’s torso' },
        { key: 'aerosol_spray', tool: 'aerosol', x: 640, y: 365, r: 165, sound: 'aerosolMist', scrubRequired: true,
          zh: '用红黄气雾罐向全身污渍喷洒清洁雾', en: 'Spray cleaning mist from the red-yellow can over CatNap' },
        { key: 'pull_arm_wires', tool: 'pliers', x: 755, y: 490, r: 105, sound: 'metallicPull',
          zh: '用尖嘴钳拔出破损机械铁丝右臂上的锈钉', en: 'Pull rusty wire pins out of the broken right arm' }
      ],
      tools: [
        { id: 'scissors', emoji: '✂️', zh: '黄柄剪刀', en: 'Scissors', recommended: true },
        { id: 'aerosol', emoji: '🧯', zh: '红罐喷雾', en: 'Spray Can' },
        { id: 'pliers', emoji: '🔧', zh: '尖嘴钳', en: 'Pliers' }
      ]
    },
    {
      id: 'c04_wash_spin',
      episode: 'catnap',
      index: 15,
      room: 'laundry_room',
      timestamp: '08:45',
      roomLabel: { zh: 'SMILE BAM 洗衣房', en: 'SMILE BAM Laundry Room' },
      title: { zh: '放入 SMILE BAM 滚筒洗衣机 & 倒蓝洗衣液', en: 'Load SMILE BAM Washer & Spin Suds Cycle' },
      hint: {
        zh: '① 将瞌睡猫放进洗衣机滚筒 ② 倒入蓝色洗衣液 ③ 启动滚筒泡泡深层洗净！',
        en: '1) Place CatNap in the drum  2) Pour blue liquid detergent  3) Run bubbly spin cycle!'
      },
      mode: 'multi',
      substeps: [
        { key: 'load_catnap', tool: 'hand', x: 640, y: 405, r: 155, sound: 'plushGrab',
          zh: '把脏兮兮的瞌睡猫放进 SMILE BAM 滚筒', en: 'Load muddy CatNap into the SMILE BAM drum' },
        { key: 'pour_detergent', tool: 'detergent', x: 640, y: 390, r: 155, sound: 'liquidPour',
          zh: '倒入蓝色液体洗衣液', en: 'Pour the blue liquid laundry detergent' },
        { key: 'spin_cycle', tool: 'wash_start', x: 640, y: 395, r: 165, sound: 'washerSpin', scrubRequired: true,
          zh: '按住滚筒高速旋转泡泡清洗，冲掉全部泥渍！', en: 'Hold/spin the bubbly SMILE BAM wash cycle to 100%!' }
      ],
      tools: [
        { id: 'hand', emoji: '🐱', zh: '放入玩偶', en: 'Load Doll', recommended: true },
        { id: 'detergent', emoji: '🧴', zh: '蓝洗衣液', en: 'Detergent' },
        { id: 'wash_start', emoji: '🫧', zh: '滚筒清洗', en: 'Spin Wash' }
      ]
    },
    {
      id: 'c05_hairdryer',
      episode: 'catnap',
      index: 16,
      room: 'laundry_room',
      timestamp: '09:15',
      roomLabel: { zh: 'SMILE BAM 洗衣房', en: 'SMILE BAM Laundry Room' },
      title: { zh: '暖风吹风机吹干蓬松紫毛', en: 'Blow-Dry Fluffy Purple Plush Fur' },
      hint: {
        zh: '用吹风机来回轻吹湿漉漉的瞌睡猫，吹走水汽恢复蓬松！',
        en: 'Sweep the warm hair dryer across wet CatNap until fluffy and dry!'
      },
      mode: 'scrub',
      target: { x: 640, y: 390, r: 175 },
      tools: [
        { id: 'hairdryer', emoji: '💨', zh: '暖风吹风机', en: 'Hair Dryer', recommended: true }
      ],
      sound: 'hairDryer'
    },
    {
      id: 'c06_sew_cassette',
      episode: 'catnap',
      index: 17,
      room: 'tailor_bench',
      timestamp: '09:45',
      roomLabel: { zh: '木质裁缝工作台', en: 'Wooden Tailor Workbench' },
      title: { zh: '缝合头部裂口 & 装入红色语音磁带盒', en: 'Stitch Head Tears & Install Red Voice Cassette' },
      hint: {
        zh: '① 剪修毛边 ② 紫线缝合头顶裂缝 ③ 往胸口装入崭新的红色语音磁带机芯',
        en: '1) Trim loose edges  2) Stitch forehead seam  3) Insert red voice-box cassette inside torso'
      },
      mode: 'multi',
      substeps: [
        { key: 'trim_edges', tool: 'tailor_scissors', x: 640, y: 350, r: 125, sound: 'scissorSnip',
          zh: '用银色裁缝剪修齐破损毛边', en: 'Trim tattered seam edges with silver tailor scissors' },
        { key: 'sew_forehead', tool: 'needle', x: 640, y: 205, r: 110, sound: 'stitchZip', scrubRequired: true,
          zh: '用紫色丝线仔细缝合额头与左耳裂口', en: 'Stitch the forehead & ear tear closed with purple thread' },
        { key: 'insert_red_tape', tool: 'red_cassette', x: 640, y: 475, r: 120, sound: 'cassetteClick',
          zh: '将红色语音磁带盒装入胸腔内部', en: 'Insert the clean red cassette voice box inside CatNap' }
      ],
      tools: [
        { id: 'tailor_scissors', emoji: '✂️', zh: '银裁缝剪', en: 'Tailor Shears', recommended: true },
        { id: 'needle', emoji: '🪡', zh: '紫线缝针', en: 'Purple Needle' },
        { id: 'red_cassette', emoji: '📼', zh: '红语音磁带', en: 'Red Cassette' }
      ]
    },
    {
      id: 'c07_cotton_stuff',
      episode: 'catnap',
      index: 18,
      room: 'tailor_bench',
      timestamp: '10:25',
      roomLabel: { zh: '木质裁缝工作台', en: 'Wooden Tailor Workbench' },
      title: { zh: '填充蓬松白棉花（微笑萌宠棉袋）', en: 'Stuff Fresh Fluffy White Cotton' },
      hint: {
        zh: '用棉花在胸腹破口处来回塞满，让瞌睡猫变得圆滚滚超好抱！',
        en: 'Stuff clouds of fluffy white cotton into CatNap’s torso until plump!'
      },
      mode: 'scrub',
      target: { x: 640, y: 485, r: 155 },
      tools: [
        { id: 'cotton', emoji: '☁️', zh: '蓬松白棉', en: 'White Cotton', recommended: true }
      ],
      sound: 'cottonPuff'
    },
    {
      id: 'c08_fabric_cut',
      episode: 'catnap',
      index: 19,
      room: 'tailor_bench',
      timestamp: '10:50',
      roomLabel: { zh: '木质裁缝工作台', en: 'Wooden Tailor Workbench' },
      title: { zh: '选布料彩蛋（黄❌→蓝❌→CATNAP紫✅）& 裁剪缝补', en: 'Fabric Color Gag (Yellow❌ Blue❌ → CATNAP Purple✅) & Cut' },
      hint: {
        zh: '先试试黄布/蓝布看看经典摇头彩蛋，再选 CATNAP 紫色毛绒布剪出补丁缝上！',
        en: 'Try Yellow/Blue swatches for the classic gag, then choose CATNAP Purple, cut & stitch!'
      },
      mode: 'fabric',
      substeps: [
        { key: 'pick_purple', tool: 'swatch_purple', x: 640, y: 450, r: 170, sound: 'plushGrab',
          zh: '选择下方布料比对颜色（试试黄/蓝再选 CATNAP 紫！）', en: 'Test fabric swatches (try Yellow/Blue or pick CATNAP Purple!)' },
        { key: 'cut_patches', tool: 'tailor_scissors', x: 875, y: 365, r: 150, sound: 'scissorSnip', scrubRequired: true,
          zh: '在右侧 CATNAP 紫布上裁剪耳朵与身体补丁', en: 'Cut ear & torso patches from the CATNAP purple cloth sheet' },
        { key: 'sew_patches', tool: 'needle', x: 655, y: 465, r: 145, sound: 'stitchZip', scrubRequired: true,
          zh: '把裁剪好的紫毛绒补丁严密缝合到耳尖和右胸', en: 'Stitch the purple plush patches cleanly onto ear & torso' }
      ],
      tools: [
        { id: 'swatch_yellow', emoji: '🟨', zh: '黄色布料', en: 'Yellow Cloth', wrongSwatch: 'yellow' },
        { id: 'swatch_blue', emoji: '🟦', zh: '蓝色布料', en: 'Blue Cloth', wrongSwatch: 'blue' },
        { id: 'swatch_purple', emoji: '🟪', zh: 'CATNAP紫布', en: 'CATNAP Purple', recommended: true },
        { id: 'tailor_scissors', emoji: '✂️', zh: '裁缝剪', en: 'Scissors' },
        { id: 'needle', emoji: '🪡', zh: '紫线缝补', en: 'Stitch' }
      ]
    },
    {
      id: 'c09_button_eyes',
      episode: 'catnap',
      index: 20,
      room: 'tailor_bench_closeup',
      timestamp: '12:05',
      roomLabel: { zh: '木质裁缝台 · 面部特写', en: 'Tailor Bench · Face Close-Up' },
      title: { zh: '十字针缝上乌黑亮泽纽扣双眼', en: 'Cross-Stitch Glossy Black Button Eyes' },
      hint: {
        zh: '先装上左眼黑纽扣，再缝好右眼黑纽扣，让双眸亮晶晶！',
        en: 'Place and cross-stitch both glossy black button eyes neatly into the sockets!'
      },
      mode: 'multi',
      substeps: [
        { key: 'left_eye', tool: 'button_eye', x: 565, y: 325, r: 95, sound: 'stitchZip',
          zh: '缝上左侧亮黑纽扣眼', en: 'Cross-stitch the left glossy black button eye' },
        { key: 'right_eye', tool: 'button_eye', x: 715, y: 325, r: 95, sound: 'stitchZip',
          zh: '缝上右侧亮黑纽扣眼', en: 'Cross-stitch the right glossy black button eye' }
      ],
      tools: [
        { id: 'button_eye', emoji: '⚫', zh: '黑纽扣眼', en: 'Button Eyes', recommended: true }
      ]
    },
    {
      id: 'c10_arm_airbrush',
      episode: 'catnap',
      index: 21,
      room: 'tailor_bench',
      timestamp: '12:30',
      roomLabel: { zh: '木质裁缝工作台', en: 'Wooden Tailor Workbench' },
      title: { zh: '换装新紫毛绒右臂 & 喷笔均匀补色', en: 'Attach New Plush Right Arm & Purple Airbrush' },
      hint: {
        zh: '① 装上崭新的毛绒右臂替换铁丝臂 ② 用银色喷笔将缝线补色得天衣无缝',
        en: '1) Attach the new stuffed purple right arm  2) Mist seams smooth with the silver airbrush'
      },
      mode: 'multi',
      substeps: [
        { key: 'attach_arm', tool: 'plush_arm', x: 745, y: 470, r: 115, sound: 'stitchZip',
          zh: '缝装崭新蓬松的紫色毛绒右臂', en: 'Attach the brand-new plush purple right arm' },
        { key: 'airbrush_dye', tool: 'airbrush', x: 650, y: 430, r: 165, sound: 'airbrushHiss', scrubRequired: true,
          zh: '用装有紫染料瓶的喷笔均匀补色，消除全部色差！', en: 'Mist purple dye evenly with the airbrush to hide every seam!' }
      ],
      tools: [
        { id: 'plush_arm', emoji: '🟣', zh: '新紫毛绒臂', en: 'Plush Arm', recommended: true },
        { id: 'airbrush', emoji: '🖌️', zh: '紫色喷笔', en: 'Airbrush' }
      ]
    },
    {
      id: 'c11_brush_tail',
      episode: 'catnap',
      index: 22,
      room: 'tailor_bench',
      timestamp: '12:55',
      roomLabel: { zh: '木质裁缝工作台', en: 'Wooden Tailor Workbench' },
      title: { zh: '木柄椭圆形毛刷顺毛 & 装回长猫尾', en: 'Brush Silky Plush Fur & Reattach Tail' },
      hint: {
        zh: '① 用木柄毛刷把全身紫毛梳得丝滑蓬松 ② 装回卷曲长猫尾',
        en: '1) Stroke the wooden oval hairbrush to groom fur silky smooth  2) Attach curled purple tail'
      },
      mode: 'multi',
      substeps: [
        { key: 'brush_fur', tool: 'hairbrush', x: 640, y: 425, r: 175, sound: 'hairBrush', scrubRequired: true,
          zh: '用木柄椭圆形刷子轻柔梳顺全身毛绒', en: 'Brush CatNap’s plush fur silky smooth with the wooden brush' },
        { key: 'attach_tail', tool: 'tail', x: 525, y: 585, r: 120, sound: 'stitchZip',
          zh: '装回标志性修长紫色猫尾', en: 'Stitch the long curled purple cat tail back on' }
      ],
      tools: [
        { id: 'hairbrush', emoji: '🪮', zh: '木柄毛刷', en: 'Hairbrush', recommended: true },
        { id: 'tail', emoji: '〰️', zh: '紫色长尾', en: 'Cat Tail' }
      ]
    },
    {
      id: 'c12_pendant_finale',
      episode: 'catnap',
      index: 23,
      room: 'playcare_room',
      timestamp: '13:25',
      roomLabel: { zh: 'Playcare 玩具房 · 终章', en: 'Playcare Workshop · Finale' },
      title: { zh: '抛光金色弯月吊坠 & 口中置入红烟胶囊', en: 'Polish Moon Pendant & Insert Scent Capsule' },
      hint: {
        zh: '① 用白色抛光膏管把金色弯月擦亮 ② 用镊子把黑色红烟胶囊放进微笑大嘴深处',
        en: '1) Polish the golden Crescent Moon charm with the white tube  2) Place the dark Scent Capsule in CatNap’s mouth'
      },
      mode: 'multi',
      substeps: [
        { key: 'polish_moon', tool: 'polish_tube', x: 640, y: 465, r: 105, sound: 'polishBuff', scrubRequired: true,
          zh: '涂抹白色抛光膏，让胸前金色弯月熠熠生辉', en: 'Apply polish tube to make the golden Crescent Moon gleam' },
        { key: 'insert_capsule', tool: 'capsule', x: 640, y: 345, r: 100, sound: 'capsuleClick',
          zh: '用精密镊子将黑色红烟香氛胶囊置入口腔深处', en: 'Use tweezers to place the dark Red-Smoke Scent Capsule inside the mouth' }
      ],
      tools: [
        { id: 'polish_tube', emoji: '🌙', zh: '弯月抛光膏', en: 'Moon Polish', recommended: true },
        { id: 'capsule', emoji: '⚫', zh: '红烟胶囊', en: 'Scent Capsule' }
      ],
      triggersFinale: 'catnap'
    }
  ];

  const EXPORT = { I18N, STEPS };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = EXPORT;
  } else {
    root.ASMRData = EXPORT;
  }
})(typeof window !== 'undefined' ? window : globalThis);
