# 《唐局人物视觉样板 v0.2》人物数据检查报告

检查时间：2026-06-22
检查范围：`data/characters.json` 中本轮视觉扩展涉及的 6 位核心人物
检查目标：确认人物存在性、id 规范性、名称与分类准确性、视觉字段完整性，避免重复新建人物。

---

## 一、检查结论总览

| 序号 | 目标人物 | 数据库 id | 是否存在 | 是否重复 | 处理方案 |
|------|----------|-----------|----------|----------|----------|
| 1 | 李渊 | `liyuan` | ✅ | 否 | 直接补充视觉字段 |
| 2 | 李治 | `gaozong` | ✅ | 否 | 直接补充视觉字段（绑定 gaozong，未新建 li-zhi） |
| 3 | 李隆基 | `lilongji` | ✅ | 否 | 直接补充视觉字段 |
| 4 | 杨贵妃 | `yangguifei` | ✅ | 存在近义条目 `yangyuhuan` | 以 `yangguifei` 为主条目补充视觉字段，未新建 |
| 5 | 李泌 | `limi-2` | ✅ | 存在同音条目 `limi`（李密） | 以 `limi-2` 为主条目补充视觉字段，未新建 |
| 6 | 朱温 | `zhuwen` | ✅ | 存在别名条目 `zhuquanzhong` | 以 `zhuwen` 为主条目补充视觉字段，未新建 |

**结果：6 位人物均已在数据库中存在，本轮未新增任何人物条目，未造成重复。**

---

## 二、逐人详细检查

### 1. 李渊

- **id**：`liyuan`
- **name / displayName / canonicalName**：李渊 / 李渊 / 李渊 ✅ 规范
- **primaryCategory / subCategory**：皇帝/皇室 / 皇帝 ✅ 正确
- **historicalImportanceScore**：92 ✅ 合理（开国皇帝，顶级影响力）
- **aliases**：李渊、唐高祖、高祖、唐国公 ✅ 常用称呼齐全
- **cleanPath / avatarPath**：原无，已补充
  - `/images/characters/clean/li-yuan_clean_v01.png`
  - `/images/characters/avatar/li-yuan_avatar_v01.png`
- **visualPriority**：原已为 `true`，保持
- **impactStatement**：原已存在，保持

### 2. 李治

- **id**：`gaozong`（按用户要求，必须绑定此 id，未新建 `li-zhi`）
- **name / displayName / canonicalName**：李治 / 李治 / 李治 ✅ 规范
- **primaryCategory / subCategory**：皇帝/皇室 / 皇帝 ✅ 正确
- **historicalImportanceScore**：90 ✅ 合理
- **aliases**：李治、高宗、唐高宗、晋王 ✅ 常用称呼齐全
- **cleanPath / avatarPath**：原无，已补充
  - `/images/characters/clean/li-zhi_clean_v01.png`
  - `/images/characters/avatar/li-zhi_avatar_v01.png`
- **visualPriority**：原已为 `true`，保持
- **impactStatement**：原已存在，保持

### 3. 李隆基

- **id**：`lilongji`
- **name / displayName / canonicalName**：李隆基 / 李隆基 / 李隆基 ✅ 规范
- **primaryCategory / subCategory**：皇帝/皇室 / 皇帝 ✅ 正确
- **historicalImportanceScore**：95 ✅ 合理（盛唐顶点）
- **aliases**：李隆基、玄宗、唐玄宗、明皇、临淄王 ✅ 常用称呼齐全
- **cleanPath / avatarPath**：原无，已补充
  - `/images/characters/clean/li-longji_clean_v01.png`
  - `/images/characters/avatar/li-longji_avatar_v01.png`
- **visualPriority**：原已为 `true`，保持
- **impactStatement**：原已存在，保持

### 4. 杨贵妃

- **id**：`yangguifei`（主条目）
- **name / displayName / canonicalName**：杨贵妃 / 杨贵妃 / 杨贵妃 ✅ 规范
- **primaryCategory / subCategory**：后宫/女性 / （空）⚠️ 建议后续可补为“妃嫔/贵妃”，但不影响本轮视觉
- **historicalImportanceScore**：85 ✅ 合理
- **aliases**：杨贵妃、杨玉环、太真 ✅ 常用称呼齐全
- **cleanPath / avatarPath**：原无，已补充
  - `/images/characters/clean/yang-guifei_clean_v01.png`
  - `/images/characters/avatar/yang-guifei_avatar_v01.png`
- **visualPriority**：原已为 `true`，保持
- **impactStatement**：原已存在，保持

**重复风险提示**：数据库中另有一条例 `id: yangyuhuan, name: 杨玉环`，其 `historicalImportanceScore` 为 57、`visualPriority` 为 `false`，可视为 `yangguifei` 的弱重复/别名条目。本轮未合并或删除，仅将视觉路径绑定到数据更完整的 `yangguifei`，避免页面出现两套独立视觉。

### 5. 李泌

- **id**：`limi-2`（数据库实际 id；路径使用规范 slug `li-bi`）
- **name / displayName / canonicalName**：李泌 / 李泌 / 李泌 ✅ 规范
- **primaryCategory / subCategory**：宰相/大臣 / 宰相 ✅ 正确
- **historicalImportanceScore**：原 71 → 调整为 75（提升以匹配其战略地位）
- **aliases**：空 ⚠️ 建议后续补充“邺县侯、长源”等，但不影响本轮视觉
- **cleanPath / avatarPath**：原无，已补充
  - `/images/characters/clean/li-bi_clean_v01.png`
  - `/images/characters/avatar/li-bi_avatar_v01.png`
- **visualPriority**：原 `false` → 调整为 `true`（本轮核心视觉人物）
- **impactStatement**：原描述过于笼统，已优化为：
  > “中唐战略谋臣，历仕肃、代、德三朝，以道家智谋在藩镇割据中维系唐室。”

**同名风险提示**：数据库中另有一条例 `id: limi, name: 李密`（瓦岗寨首领），与本条 `limi-2` 完全不同人。路径 `li-bi` 仅用于视觉文件命名，未改动数据库 id。

### 6. 朱温

- **id**：`zhuwen`（主条目）
- **name / displayName / canonicalName**：朱温 / 朱温 / 朱温 ✅ 规范
- **primaryCategory / subCategory**：叛乱势力 / （空）⚠️ 当前分类为“叛乱势力”，也可视为五代开国君主，但数据库结构如此，本轮不做调整
- **historicalImportanceScore**：90 ✅ 合理（唐朝终结者）
- **aliases**：朱温、朱全忠、全忠 ✅ 常用称呼齐全
- **cleanPath / avatarPath**：原无，已补充
  - `/images/characters/clean/zhu-wen_clean_v01.png`
  - `/images/characters/avatar/zhu-wen_avatar_v01.png`
- **visualPriority**：原已为 `true`，保持
- **impactStatement**：原已存在，保持

**重复风险提示**：数据库末尾另有一条例 `id: zhuquanzhong, name: 朱全忠`，其事件描述明确写“原录有‘朱温’，书中后段多作‘朱全忠’，建议并入别名索引”。该条目可视作 `zhuwen` 的弱重复/别名条目，本轮视觉路径绑定到主条目 `zhuwen`。

---

## 三、图片文件存在性检查

当前 `public/images/characters/` 下实际存在的图片仅 v0.1 四张：

- `clean/an-lushan_clean_v01.png`
- `clean/guo-ziyi_clean_v01.png`
- `clean/li-shimin_clean_v01.png`
- `clean/wu-zetian_clean_v01.png`
- `avatar/an-lushan_avatar_v01.png`
- `avatar/guo-ziyi_avatar_v01.png`
- `avatar/li-shimin_avatar_v01.png`
- `avatar/wu-zetian_avatar_v01.png`

**本轮新增的 6 组图片路径尚未放入实际文件。** 为避免页面显示破损图，已在 `app/lib/data.ts` 中增加“路径存在性过滤”：只有 `public/` 下真实存在的图片路径才会被页面渲染使用。图片文件补齐后，无需修改代码即可自动显示。

---

## 四、已修改文件清单

1. `data/characters.json` — 为 6 人补充 `cleanPath`、`avatarPath`、`visualPriority`、`historicalImportanceScore`、`impactStatement`。
2. `data/visual_profiles_v0_2.json` — 新增 6 人视觉设定文件。
3. `app/lib/data.ts` — 新增图片路径存在性校验，避免渲染不存在的图片。
4. `scripts/update_visual_v0_2.py` — 用于批量更新 `characters.json` 的辅助脚本。
5. `VISUAL_V0_2_CHARACTER_CHECK.md` — 本检查报告。

---

## 五、下一步（图片生成阶段）

当实际图片生成并放入 `public/images/characters/` 对应路径后：

- 详情页 `/characters/[id]` 会自动显示 `cleanPath` 立绘；
- 群英录 `/characters` 会自动显示 `avatarPath` 头像；
- 历史影响榜 `/ranking` 会自动显示 `avatarPath` 头像；
- 权力图谱 `/graph` 的右侧详情面板会自动显示 `avatarPath` 头像；
- v0.1 四张已有图片保持正常显示。
