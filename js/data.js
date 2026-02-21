// ============================================================
// DATA.JS — 52 Food Cards
// ============================================================

export const SUITS = {
  HEART:   { symbol: '♥', name: 'Heart',   cls: 'heart',   colorCls: 'heart-color',   emoji: '❤️' },
  SPADE:   { symbol: '♠', name: 'Spade',   cls: 'spade',   colorCls: 'spade-color',   emoji: '⚫' },
  DIAMOND: { symbol: '♦', name: 'Diamond', cls: 'diamond', colorCls: 'diamond-color', emoji: '💎' },
  CLUB:    { symbol: '♣', name: 'Club',    cls: 'club',    colorCls: 'club-color',    emoji: '🍀' },
};

export const RANKS = ['A','K','Q','J','10','9','8','7','6','5','4','3','2'];

// Power 13 (Ace) → 1 (Two)
// desc: mô tả ngắn gợi ý ăn gì
export const CARDS = [
  // ── ACE (Power 13) ─────────────────────────────────
  { suit:'HEART',   rank:'A', power:13, food:'Phở Bò',      emoji:'🍜', desc:'Tô phở nóng hổi, nước dùng ngọt thanh, bánh phở dai mềm' },
  { suit:'SPADE',   rank:'A', power:13, food:'Cơm Tấm',     emoji:'🍛', desc:'Sườn nướng thơm lừng, bì chả, trứng ốp, nước mắm pha' },
  { suit:'DIAMOND', rank:'A', power:13, food:'Bánh Mỳ',     emoji:'🥖', desc:'Bánh mỳ giòn tan, nhân đa dạng, ăn nhanh no lâu' },
  { suit:'CLUB',    rank:'A', power:13, food:'Hủ Tiếu',     emoji:'🍝', desc:'Hủ tiếu nam vang, nước lèo trong vắt, thịt bằm thơm' },

  // ── KING (Power 12) ────────────────────────────────
  { suit:'HEART',   rank:'K', power:12, food:'Bún Bò Huế',  emoji:'🥣', desc:'Bún bò cay nồng, chả lụa, móng heo, mắm ruốc đặc trưng' },
  { suit:'SPADE',   rank:'K', power:12, food:'Cơm Rang',    emoji:'🍚', desc:'Cơm chiên vàng ruộm, trứng, rau củ, dễ ăn mọi bữa' },
  { suit:'DIAMOND', rank:'K', power:12, food:'Bánh Cuốn',   emoji:'🌯', desc:'Bánh cuốn mỏng mịn, nhân thịt nấm, chả quế, chấm nước mắm' },
  { suit:'CLUB',    rank:'K', power:12, food:'Mì Quảng',    emoji:'🍜', desc:'Mì quảng đặc sánh, tôm thịt, bánh tráng nướng giòn' },

  // ── QUEEN (Power 11) ───────────────────────────────
  { suit:'HEART',   rank:'Q', power:11, food:'Bún Riêu',    emoji:'🦀', desc:'Bún riêu cua đồng, cà chua, đậu hũ chiên, mắm tôm' },
  { suit:'SPADE',   rank:'Q', power:11, food:'Cơm Chiên DL',emoji:'🍳', desc:'Cơm chiên Dương Châu, tôm thịt, trứng, ngò rí thơm' },
  { suit:'DIAMOND', rank:'Q', power:11, food:'Bánh Ướt',    emoji:'🫔', desc:'Bánh ướt tươi mềm, chả lụa, hành phi, tương ớt' },
  { suit:'CLUB',    rank:'Q', power:11, food:'Cao Lầu',     emoji:'🍝', desc:'Cao lầu Hội An, sợi mì dai, thịt xá xíu, bánh đa giòn' },

  // ── JACK (Power 10) ────────────────────────────────
  { suit:'HEART',   rank:'J', power:10, food:'Bún Mắm',     emoji:'🍲', desc:'Bún mắm miền Tây, hải sản, thịt quay, rau ghém tươi' },
  { suit:'SPADE',   rank:'J', power:10, food:'Cơm Niêu',    emoji:'🪔', desc:'Cơm cháy niêu đất, canh chua, thịt kho trứng' },
  { suit:'DIAMOND', rank:'J', power:10, food:'Bánh Khọt',   emoji:'🧇', desc:'Bánh khọt nhỏ xinh, tôm, mỡ hành, ăn kèm rau sống' },
  { suit:'CLUB',    rank:'J', power:10, food:'Phở Xào',     emoji:'🥘', desc:'Phở xào giòn, hải sản hoặc bò, giá trụng, nước sốt đặm' },

  // ── 10 (Power 9) ───────────────────────────────────
  { suit:'HEART',   rank:'10', power:9, food:'Súp Cua',     emoji:'🦀', desc:'Súp cua béo ngậy, trứng cút, nấm, miến mềm' },
  { suit:'SPADE',   rank:'10', power:9, food:'Lẩu Thái',    emoji:'🫕', desc:'Lẩu thái chua cay, tôm, mực, bông lau thơm' },
  { suit:'DIAMOND', rank:'10', power:9, food:'Bánh Canh',   emoji:'🍲', desc:'Bánh canh sợi tươi, giò heo, chả cá, nước trong' },
  { suit:'CLUB',    rank:'10', power:9, food:'Miến Gà',     emoji:'🍜', desc:'Miến gà trong vắt, thịt gà xé, hành phi, tiêu xay' },

  // ── 9 (Power 8) ────────────────────────────────────
  { suit:'HEART',   rank:'9', power:8, food:'Bún Thái',     emoji:'🍜', desc:'Bún thái chua ngọt, hải sản, sả, ớt, rau thơm' },
  { suit:'SPADE',   rank:'9', power:8, food:'Cơm Gà HN',    emoji:'🍗', desc:'Cơm gà ta nấu chuẩn, nước mắm gừng, rau sống' },
  { suit:'DIAMOND', rank:'9', power:8, food:'Xôi Mặn',      emoji:'🍱', desc:'Xôi xéo, xôi gà, hay xôi lạp xưởng béo bùi' },
  { suit:'CLUB',    rank:'9', power:8, food:'Hủ Tiếu Khô',  emoji:'🍝', desc:'Hủ tiếu khô trộn, thịt bằm, tôm, giá mỡ hành' },

  // ── 8 (Power 7) ────────────────────────────────────
  { suit:'HEART',   rank:'8', power:7, food:'Mì Tôm Trứng', emoji:'🥚', desc:'Mì tôm xào trứng nhanh gọn, rau cải, xúc xích' },
  { suit:'SPADE',   rank:'8', power:7, food:'Cơm Sườn Cọng',emoji:'🥩', desc:'Cơm sườn non kho mềm, dưa leo, canh chua nóng' },
  { suit:'DIAMOND', rank:'8', power:7, food:'Bánh Bèo',     emoji:'🫙', desc:'Bánh bèo Huế, nước mắm tôm chấy, mỡ hành thơm' },
  { suit:'CLUB',    rank:'8', power:7, food:'Cháo Lòng',    emoji:'🍵', desc:'Cháo lòng heo mềm mịn, quẩy, hành ngò, tiêu' },

  // ── 7 (Power 6) ────────────────────────────────────
  { suit:'HEART',   rank:'7', power:6, food:'Bún Chả HN',   emoji:'🥢', desc:'Bún chả Hà Nội, chả nướng thơm, nước chấm ngọt' },
  { suit:'SPADE',   rank:'7', power:6, food:'Cơm Tứ Xuyên', emoji:'🌶️', desc:'Cơm rang kiểu Tứ Xuyên cay mê, rau củ, thịt' },
  { suit:'DIAMOND', rank:'7', power:6, food:'Xôi Xéo',      emoji:'🌽', desc:'Xôi xéo đậu xanh béo ngậy, hành phi vàng ruộm' },
  { suit:'CLUB',    rank:'7', power:6, food:'Cháo Gà',      emoji:'🐓', desc:'Cháo gà ta nấu gừng, thịt xé, hành lá, tiêu trắng' },

  // ── 6 (Power 5) ────────────────────────────────────
  { suit:'HEART',   rank:'6', power:5, food:'Mì Hoành Thánh',emoji:'🥟', desc:'Mì sợi vàng, hoành thánh nhân tôm thịt, xá xíu' },
  { suit:'SPADE',   rank:'6', power:5, food:'Cơm Trắng Kho', emoji:'🍽️', desc:'Cơm trắng kho cá, thịt kho tàu, canh rau đơn giản' },
  { suit:'DIAMOND', rank:'6', power:5, food:'Bánh Tráng Trộn',emoji:'🌶️', desc:'Bánh tráng trộn, xoài xanh, khô bò, tương ớt' },
  { suit:'CLUB',    rank:'6', power:5, food:'Cháo Trắng',    emoji:'🍚', desc:'Cháo trắng húp nóng, ăn với mắm, trứng chiên, dưa' },

  // ── 5 (Power 4) ────────────────────────────────────
  { suit:'HEART',   rank:'5', power:4, food:'Bún Thịt Nướng',emoji:'🥗', desc:'Bún thịt nướng sả ớt, chả giò, rau sống, nước mắm' },
  { suit:'SPADE',   rank:'5', power:4, food:'Cơm Tấm Sườn', emoji:'🍖', desc:'Cơm tấm sườn đặc biệt, bì, chả, nước mắm tỏi ớt' },
  { suit:'DIAMOND', rank:'5', power:4, food:'Sandwich',      emoji:'🥪', desc:'Sandwich nhân thịt nguội, phô mai, rau tươi, sốt' },
  { suit:'CLUB',    rank:'5', power:4, food:'Cháo Đậu',      emoji:'🫘', desc:'Cháo đậu xanh bí đỏ, thanh mát, dễ tiêu' },

  // ── 4 (Power 3) ────────────────────────────────────
  { suit:'HEART',   rank:'4', power:3, food:'Súp Nui',       emoji:'🍝', desc:'Súp nui gà béo nhẹ, cà rốt, khoai tây, thịt bằm' },
  { suit:'SPADE',   rank:'4', power:3, food:'Cơm Hến',       emoji:'🐚', desc:'Cơm hến Huế, hến xào, rau sống, mắm ruốc, ớt' },
  { suit:'DIAMOND', rank:'4', power:3, food:'Bánh Tiêu',     emoji:'🥯', desc:'Bánh tiêu giòn phồng, ăn sáng nhanh, chấm sữa đặc' },
  { suit:'CLUB',    rank:'4', power:3, food:'Nui Xào',       emoji:'🍝', desc:'Nui xào thịt bò, cà chua, hành tây, sốt cà đặm' },

  // ── 3 (Power 2) ────────────────────────────────────
  { suit:'HEART',   rank:'3', power:2, food:'Tokbokki',      emoji:'🌶️', desc:'Tokbokki cay ngọt, chả cá, trứng luộc, phô mai' },
  { suit:'SPADE',   rank:'3', power:2, food:'Cơm Trộn',      emoji:'🥗', desc:'Cơm trộn kiểu Hàn, kimchi, trứng, rong biển' },
  { suit:'DIAMOND', rank:'3', power:2, food:'Bánh Bao',      emoji:'🥟', desc:'Bánh bao nhân thịt trứng cút, ăn sáng tiện lợi' },
  { suit:'CLUB',    rank:'3', power:2, food:'Nui Sốt Bò',    emoji:'🥩', desc:'Nui sốt bò băm kiểu Ý, phô mai, húng quế' },

  // ── 2 (Power 1) ────────────────────────────────────
  { suit:'HEART',   rank:'2', power:1, food:'Salad',         emoji:'🥗', desc:'Salad rau tươi, ức gà, sốt mè rang, healthy' },
  { suit:'SPADE',   rank:'2', power:1, food:'Ăn Kiêng',      emoji:'🥦', desc:'Rau luộc, ức gà hấp, thanh mát, nhẹ bụng' },
  { suit:'DIAMOND', rank:'2', power:1, food:'Granola',       emoji:'🥣', desc:'Granola sữa chua, trái cây tươi, ăn sáng nhanh' },
  { suit:'CLUB',    rank:'2', power:1, food:'Yến Mạch',      emoji:'🌾', desc:'Yến mạch nấu sữa, chuối, mật ong, thanh đạm' },
];

export function getRandomCard() {
  return CARDS[Math.floor(Math.random() * CARDS.length)];
}

export function getPowerStars(power) {
  const maxStars = 5;
  const filledStars = Math.ceil((power / 13) * maxStars);
  let s = '';
  for (let i = 0; i < maxStars; i++) {
    s += i < filledStars ? '⭐' : '☆';
  }
  return s;
}

export function getPowerLabel(power) {
  if (power === 13) return '👑 Tối Thượng';
  if (power >= 11) return '🔥 Mạnh Mẽ';
  if (power >= 8)  return '💪 Khá Mạnh';
  if (power >= 5)  return '😊 Bình Thường';
  if (power >= 3)  return '🌿 Nhẹ Nhàng';
  return '🌱 Thanh Đạm';
}
