/* ============================================================================
   js/assets.js — Preloader for Painterly Studio Background Plates & RGBA Sprites
   ============================================================================ */
(function (root) {
  'use strict';

  const MANIFEST = {
    room_lab_desk: 'assets/room_lab_desk.jpg',
    room_crt_closeup: 'assets/room_crt_closeup.jpg',
    room_green_chamber: 'assets/room_green_chamber.jpg',
    room_steel_cabinet: 'assets/room_steel_cabinet.jpg',
    room_playcare: 'assets/room_playcare.jpg',
    room_laundry: 'assets/room_laundry.jpg',
    room_tailor_bench: 'assets/room_tailor_bench.jpg',
    scene_proto_finale: 'assets/scene_proto_finale.jpg',
    scene_catnap_finale: 'assets/scene_catnap_finale.jpg',
    proto_damaged: 'assets/proto_damaged.png',
    proto_restored: 'assets/proto_restored.png',
    proto_clean_upper: 'assets/proto_clean_upper.png',
    proto_chassis: 'assets/proto_chassis.png',
    catnap_damaged: 'assets/catnap_damaged.png',
    catnap_washed: 'assets/catnap_washed.png',
    catnap_restored: 'assets/catnap_restored.png',
    prop_brain: 'assets/prop_brain.png',
    prop_mommy_arm: 'assets/prop_mommy_arm.png',
    prop_huggy_arm: 'assets/prop_huggy_arm.png'
  };

  const cache = {};
  let loadedCount = 0;
  const totalCount = Object.keys(MANIFEST).length;

  function loadAll(onProgress) {
    if (typeof Image === 'undefined') return Promise.resolve(cache);
    const promises = Object.entries(MANIFEST).map(([key, src]) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          cache[key] = img;
          loadedCount += 1;
          if (onProgress) onProgress(loadedCount / totalCount);
          resolve(img);
        };
        img.onerror = () => {
          loadedCount += 1;
          if (onProgress) onProgress(loadedCount / totalCount);
          resolve(null);
        };
        img.src = src;
      });
    });
    return Promise.all(promises).then(() => cache);
  }

  function get(key) {
    const img = cache[key];
    return img && img.complete && img.naturalWidth > 0 ? img : null;
  }

  const EXPORT = { MANIFEST, loadAll, get };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = EXPORT;
  } else {
    root.ASMRAssets = EXPORT;
  }
})(typeof window !== 'undefined' ? window : globalThis);
