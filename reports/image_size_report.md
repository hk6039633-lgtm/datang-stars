# 图片资源体积报告

生成时间：2026-06-27 10:48:50
统计目录：`public/images`

## 总体积

- **public/images 总体积**：165.43 MB（173,469,560 字节）
- **文件总数**：154 个

## 分类体积

| 分类 | 文件数 | 体积 |
|------|--------|------|
| avatars | 44 | 35.03 MB |
| cards | 44 | 59.85 MB |
| clean | 44 | 60.38 MB |
| default avatars | 22 | 10.18 MB |

## 最大的 30 个图片文件

| 排名 | 相对路径 | 体积 |
|------|----------|------|
| 1 | `characters/card/wu-zetian_card_v01.png` | 3.33 MB |
| 2 | `characters/card/guo-ziyi_card_v01.png` | 3.16 MB |
| 3 | `characters/card/an-lushan_card_v01.png` | 3.08 MB |
| 4 | `characters/card/li-shimin_card_v01.png` | 3.01 MB |
| 5 | `characters/clean/fang-xuanling_clean_v01.png` | 2.76 MB |
| 6 | `characters/clean/li-longji_clean_v01.png` | 2.76 MB |
| 7 | `characters/card/li-bai_card_v01.png` | 2.74 MB |
| 8 | `characters/avatar/wu-zetian_avatar_v01.png` | 2.74 MB |
| 9 | `characters/clean/li-zhi_clean_v01.png` | 2.73 MB |
| 10 | `characters/card/li-longji_card_v01.png` | 2.73 MB |
| 11 | `characters/clean/li-yuan_clean_v01.png` | 2.71 MB |
| 12 | `characters/card/li-zhi_card_v01.png` | 2.70 MB |
| 13 | `characters/clean/qin-qiong_clean_v01.png` | 2.68 MB |
| 14 | `characters/card/li-yuan_card_v01.png` | 2.67 MB |
| 15 | `characters/clean/yang-guifei_clean_v01.png` | 2.62 MB |
| 16 | `characters/clean/li-bi_clean_v01.png` | 2.62 MB |
| 17 | `characters/clean/li-jing_clean_v01.png` | 2.62 MB |
| 18 | `characters/clean/li-bai_clean_v01.png` | 2.60 MB |
| 19 | `characters/card/yang-guifei_card_v01.png` | 2.60 MB |
| 20 | `characters/card/li-bi_card_v01.png` | 2.59 MB |
| 21 | `characters/card/fang-xuanling_card_v01.png` | 2.57 MB |
| 22 | `characters/avatar/guo-ziyi_avatar_v01.png` | 2.56 MB |
| 23 | `characters/clean/yuchi-gong_clean_v01.png` | 2.53 MB |
| 24 | `characters/clean/shangguan-waner_clean_v01.png` | 2.52 MB |
| 25 | `characters/clean/taiping-gongzhu_clean_v01.png` | 2.52 MB |
| 26 | `characters/clean/zhu-wen_clean_v01.png` | 2.52 MB |
| 27 | `characters/card/qin-qiong_card_v01.png` | 2.51 MB |
| 28 | `characters/card/zhu-wen_card_v01.png` | 2.49 MB |
| 29 | `characters/avatar/an-lushan_avatar_v01.png` | 2.47 MB |
| 30 | `characters/clean/wu-zetian_clean_v01.png` | 2.47 MB |

## WebP 优化效果

- **PNG 原图总体积**：154.15 MB（77 个文件）
- **新增 WebP 总体积**：11.28 MB（77 个文件）
- **WebP 相对 PNG 压缩率**：92.7%

## 压缩策略建议

1. **专属人物图**：将 PNG 转换为 WebP，avatar 缩放到 320px–512px（quality 82），card/clean 缩放到 900px–1200px（quality 85）。
2. **默认头像**：将 PNG 默认头像转换为 WebP，保持分类映射不变。
3. **加载策略**：页面优先使用 `.webp` 路径，不存在时回退到原 PNG/JPG。
4. **懒加载**：列表页头像使用 `loading="lazy"` 与 `decoding="async"`，避免首屏一次性加载过多图片。
5. **响应式**：移动端优先返回较小尺寸 avatar，详情页再加载较大 clean/card 图。
