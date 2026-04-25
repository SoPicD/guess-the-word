const DICTIONARY = [
  // --- NHÓM CHỮ A / Ă / Â ---
  "an", "ăn", "ân", "ấn", "ẩn", "án", "vân", "vấn", "dần", "đần", // A/Ă/Â...N
  "anh", "ách", "ạnh", "ánh", "oanh", // A...H
  "ác", "ắc", "ấc", "oóc", // A...C
  "am", "âm", "ầm", "ấm", "ậm", // A/Â...M

  // --- NHÓM CHỮ B ---
  "ba", "bà", "bố", "bẻ", "bê", "bi", "bí", "bì", "bỏ", "bò", // B...Nguyên âm
  "ban", "bàn", "bán", "bản", "bạn", "bắn", "bần", "bận", "bền", "bến", "bốn", "bùn", "bón", "buôn", "buồn", // B...N
  "bang", "bàng", "báng", "bảng", "bằng", "bóng", "bỏng", "bụng", "bưng", "bồng", "biếng", "buông", "buồng", // B...G
  "bác", "bạc", "bắc", "bấc", "bậc", "bóc", "bọc", "buộc", "bước", "biếc", // B...C
  "bát", "bạt", "bét", "bẹt", "biết", "biệt", "bít", "bịt", "buốt", "buột", "bất", "bật", // B...T
  "băm", "bằm", "bặm", "bom", "bơm", "bờm", "bấm", "bầm", "buồm", "bướm", // B...M
  "bi", "bì", "bí", "bỉ", "bị", "bai", "bài", "bái", "bãi", "bại", "bơi", "bời", "bới", "bởi", "bôi", "bồi", "bối", "bội", "buổi", "bưởi", //b...i
  // --- NHÓM CHỮ C / CH ---
  "ca", "cá", "cà", "cả", "cô", "cú", "cư", "co", "cò", // C...Nguyên âm
  "can", "càn", "cán", "cản", "cạn", "cân", "cần", "cẩn", "cận", "con", "còn", "côn", "cún", "cuốn", "cuộn", // C...N
  "càng", "cảng", "cong", "còng", "cóng", "công", "cồng", "cổng", "cộng", "cung", "cùng", "cứng", "cường", // C...G
  "các", "cạc", "cóc", "cọc", "cộc", "cúc", "cục", "cước", "cược", "cực", // C...C
  "cát", "cắt", "cất", "cốt", "cột", "cứt", "cút", "cụt", "cớt", "cợt", // C...T
  "canh", "cành", "cảnh", "cạnh", "chênh", "chỉnh", "chống", "chẳng", // C/CH...H/G

  // --- NHÓM CHỮ D / Đ ---
  "da", "dù", "dễ", "do", "đá", "đồ", "đi", "đủ", "đẻ", // D/Đ...Nguyên âm
  "dan", "dân", "dần", "dẫn", "dấn", "diên", "diện", "đan", "đàn", "đến", "đền", "điền", "điện", "đoàn", // D/Đ...N
  "dáng", "dòng", "dung", "dùng", "dâng", "dừng", "đáng", "đảng", "đặng", "đúng", "đùng", "đóng", "đồng", // D/Đ...G
  "đáp", "đập", "đút", "đạt", "đất", "đốt", "đột", "đứt", "đợt", // Đ...T/P

  // --- NHÓM CHỮ G / GI ---
  "ga", "gà", "gì", "gỗ", "gu", "gia", "già", "gió", "giữ", // G/GI...Nguyên âm
  "gang", "gắng", "gông", "gồng", "giăng", "gương", "giống", "gánh", "giọng", "gượng", // G/GI...G
  "gan", "gàn", "gần", "gián", "giàn", "giận", "gìn", "gân", "gắn", "gọn", // G/GI...N

  // --- NHÓM CHỮ H ---
  "ha", "há", "hè", "hú", "hổ", "hỗ", "hư", "hệ", // H...Nguyên âm
  "han", "hán", "hàn", "hạn", "hẳn", "hân", "hận", "hiền", "hiện", "hôn", "hồn", "hẹn", "hơn", // H...N
  "hàng", "hạng", "hồng", "hổng", "hung", "hùng", "hương", "hướng", "hưởng", "hãng", // H...G
  "hát", "hạt", "hết", "hít", "hốt", "hột", "hút", "hắt", "hất", // H...T

  // --- NHÓM CHỮ K / KH ---
  "kẻ", "kể", "kê", "kế", "kêu", "kha", "khá", "khử", "khó", "khô", // K/KH...Nguyên âm
  "kiên", "kiện", "kín", "khan", "khán", "khăn", "khẩn", "khôn", "khuyên", // K/KH...N
  "khẳng", "kháng", "khống", "khung", "khủng", "khoảng", "khương", "khướng", // KH...G

  // --- NHÓM CHỮ L ---
  "la", "là", "lẻ", "lê", "lì", "lo", "lô", "lù", "lũ", "lệ", // L...Nguyên âm
  "lan", "lán", "làn", "lần", "lên", "liền", "luôn", "luồn", "lợn", "lùn", "lộn", "lớn", // L...N
  "làng", "láng", "lặng", "linh", "lòng", "lông", "lồng", "lưng", "lượng", "lương", "lường", // L...G
  "lát", "lạt", "lết", "lịt", "lót", "lọt", "lốt", "lột", "lút", "lụt", "lướt", "lượt", // L...T

  // --- NHÓM CHỮ M ---
  "ma", "mà", "mẻ", "mê", "mì", "mô", "mù", "mũ", "mẹ", // M...Nguyên âm
  "man", "màn", "mãn", "mặn", "mền", "mến", "mịn", "món", "môn", "muôn", "muốn", "muộn", "mượn", // M...N
  "mang", "mạng", "máng", "mạnh", "miếng", "mông", "mồng", "móng", "mương", "miệng", "mừng", // M...G
  "mát", "mắt", "mất", "mật", "mốt", "một", "mứt", "mút", "mượt", "mệt", // M...T

  // --- NHÓM CHỮ N / NH ---
  "na", "nè", "nô", "nụ", "nhà", "nhẹ", "nợ", "nữ", // N/NH...Nguyên âm
  "nang", "nặng", "nàng", "nắng", "nóng", "nọng", "nông", "nồng", "nướng", "nhường", "nhàng", // N/NH...G
  "nan", "nàn", "nán", "nặn", "nên", "nền", "nến", "niên", "nôn", "nộn", "nhân", "nhận", "nhìn", // N/NH...N

  // --- NHÓM CHỮ P / PH ---
  "pha", "phá", "phù", "phú", "phê", "phế", "phụ", // P/PH...Nguyên âm
  "phan", "phản", "phân", "phấn", "phần", "phên", "phiên", "phướn", // PH...N
  "phát", "phạt", "phét", "phết", "phít", "phút", "phớt", "phụt", // PH...T

  // --- NHÓM CHỮ Q ---
  "qua", "quá", "quà", "quả", "quy", "quý", // Q...Nguyên âm
  "quan", "quán", "quần", "quận", "quên", "quyền", "quân", "quấn", // Q...N
  "quang", "quảng", "quàng", "quặng", "quanh", "quánh", "quỵt", // Q...G/H/T

  // --- NHÓM CHỮ R ---
  "ra", "rà", "rẻ", "rê", "rì", "rõ", "ru", "rổ", // R...Nguyên âm
  "ran", "ràn", "rần", "rền", "rện", "rộn", "rốn", "rùn", "rườn", // R...N
  "rang", "ràng", "rạng", "ròng", "rừng", "rồng", "rộng", "rương", "rường", "rướng", // R...G

  // --- NHÓM CHỮ S ---
  "sa", "sà", "sẻ", "sẽ", "si", "so", "số", "su", "sợ", // S...Nguyên âm
  "sang", "sáng", "sòng", "sóng", "sông", "sống", "sùng", "súng", "sướng", "siêng", // S...G
  "san", "sán", "sàn", "sân", "sần", "sên", "sườn", "sụn", // S...N

  // --- NHÓM CHỮ T / TH / TR ---
  "ta", "tà", "tè", "ti", "to", "tú", "tệ", "thế", "trà", // T/TH/TR...Nguyên âm
  "tan", "tán", "tàn", "tận", "tân", "tần", "tên", "tin", "tín", "tiền", "tiến", "toàn", "tuân", // T...N
  "tang", "tàng", "tặng", "tầng", "tiếng", "tòng", "tóng", "tông", "tồng", "tống", "tung", "tùng", // T...G
  "tát", "tạt", "tết", "tốt", "tột", "tút", "tụt", "tắt", "tất", "tật", "thật", "thốt", // T...T

  // --- NHÓM CHỮ V ---
  "va", "và", "vé", "vẽ", "vì", "vô", "vũ", "vợ", // V...Nguyên âm
  "van", "ván", "vần", "vẫn", "vặn", "vân", "vấn", "viên", "viền", "vốn", "vườn", "vịn", // V...N
  "vang", "vàng", "vắng", "vòng", "vông", "vồng", "vương", "vướng", "vũng", "vững", // V...G

  // --- NHÓM CHỮ X ---
  "xa", "xả", "xẻ", "xế", "xì", "xỏ", "xu", "xệ", // X...Nguyên âm
  "xan", "xán", "xén", "xin", "xiên", "xoăn", "xuân", "xuất", "xịn", "xốn", // X...N
  "xang", "xàng", "xáng", "xong", "xòng", "xóng", "xông", "xồng", "xung", "xùng", "xương", // X...G

  // --- NHÓM CHỮ Y ---
  "ý", "yên", "yếu", "yểu", "yêu", "yếm" // Y...
];
