# 唐局人物视觉系统 v0.3 稳定基线总结

> 版本：`datang-stars@0.3.0`  
> 说明：本文档是《唐局人物视觉系统 v0.3》的稳定基线说明，用于记录当前已验收的视觉体系。Kimi Code 在本轮只负责数据结构、路径映射、页面接入与构建验证；所有视觉图片（核心 10 人专属图与 11 类默认头像）均由 ChatGPT 统一设计并交付。

---

## 1. 总体数据

| 指标 | 数值 |
|---|---|
| 总人物数 | 891 |
| 有专属 `cardPath`（详情页主视觉卡牌图） | 10 |
| 有专属 `cleanPath`（无卡牌时的详情页大图） | 10 |
| 有专属 `avatarPath`（头像图） | 10 |
| 使用分类默认头像 | 881 |
| 有任意有效头像 | 891 |

---

## 2. 核心 10 人专属视觉体系

以下 10 位人物拥有完整的 `cardPath` / `cleanPath` / `avatarPath` 三件套，优先于默认头像显示。

| id | 姓名 | primaryCategory | cardPath | cleanPath | avatarPath |
|---|---|---|---|---|---|
| `lishimin` | 李世民 | 皇帝/皇室 | `card/li-shimin_card_v01.png` | `clean/li-shimin_clean_v01.png` | `avatar/li-shimin_avatar_v01.png` |
| `wuzetian` | 武则天 | 皇帝/皇室 | `card/wu-zetian_card_v01.png` | `clean/wu-zetian_clean_v01.png` | `avatar/wu-zetian_avatar_v01.png` |
| `anlushan` | 安禄山 | 叛乱势力 | `card/an-lushan_card_v01.png` | `clean/an-lushan_clean_v01.png` | `avatar/an-lushan_avatar_v01.png` |
| `guoziyi` | 郭子仪 | 武将/将领 | `card/guo-ziyi_card_v01.png` | `clean/guo-ziyi_clean_v01.png` | `avatar/guo-ziyi_avatar_v01.png` |
| `liyuan` | 李渊 | 皇帝/皇室 | `card/li-yuan_card_v01.png` | `clean/li-yuan_clean_v01.png` | `avatar/li-yuan_avatar_v01.png` |
| `gaozong` | 李治 | 皇帝/皇室 | `card/li-zhi_card_v01.png` | `clean/li-zhi_clean_v01.png` | `avatar/li-zhi_avatar_v01.png` |
| `lilongji` | 李隆基 | 皇帝/皇室 | `card/li-longji_card_v01.png` | `clean/li-longji_clean_v01.png` | `avatar/li-longji_avatar_v01.png` |
| `yangguifei` | 杨贵妃 | 后宫/女性 | `card/yang-guifei_card_v01.png` | `clean/yang-guifei_clean_v01.png` | `avatar/yang-guifei_avatar_v01.png` |
| `limi-2` | 李泌 | 宰相/大臣 | `card/li-bi_card_v01.png` | `clean/li-bi_clean_v01.png` | `avatar/li-bi_avatar_v01.png` |
| `zhuwen` | 朱温 | 叛乱势力 | `card/zhu-wen_card_v01.png` | `clean/zhu-wen_clean_v01.png` | `avatar/zhu-wen_avatar_v01.png` |

所有路径前缀均为 `/images/characters/`。

---

## 3. 11 类默认头像体系

对没有专属 `avatarPath` 的 881 位人物，系统按 `primaryCategory` 自动匹配默认头像。

| 分类 | 人数 | 默认头像文件 |
|---|---|---|
| 皇帝/皇室 | 35 | `imperial-default.png` |
| 宰相/大臣 | 267 | `minister-default.png` |
| 武将/将领 | 90 | `general-default.png` |
| 节度使/藩镇 | 160 | `jiedushi-default.png` |
| 宦官 | 19 | `eunuch-default.png` |
| 后宫/女性 | 29 | `female-default.png` |
| 外族 | 54 | `foreign-default.png` |
| 文人 | 27 | `literati-default.png` |
| 叛乱势力 | 26 | `rebel-default.png` |
| 宗教人物 | 22 | `religion-default.png` |
| 其他 | 162 | `other-default.png` |

默认头像存放位置：`public/images/characters/defaults/`。

---

## 4. 图片路径规范

### 4.1 目录结构

```text
public/images/characters/
├── card/           # 详情页主视觉卡牌图（核心 10 人）
├── clean/          # 无卡牌时的详情页大图（核心 10 人）
├── avatar/         # 人物头像图（核心 10 人）
└── defaults/       # 11 类分类默认头像
```

### 4.2 路径字段

| 字段 | 用途 | 示例 |
|---|---|---|
| `cardPath` | 详情页主视觉 | `/images/characters/card/li-shimin_card_v01.png` |
| `cleanPath` | 详情页大图回退 | `/images/characters/clean/li-shimin_clean_v01.png` |
| `avatarPath` | 人物专属头像 | `/images/characters/avatar/li-shimin_avatar_v01.png` |
| `effectiveAvatarPath` | 服务端解析后的实际头像 | 专属头像或默认头像，不存在时为 `undefined` |

### 4.3 解析规则

1. 专属 `avatarPath` 文件存在 → 使用专属头像；
2. 否则按 `primaryCategory` 查找对应默认头像，文件存在 → 使用默认头像；
3. 否则返回 `undefined`，页面回退到文字布局或姓名首字占位；
4. 不渲染任何不存在的图片路径，避免破图。

---

## 5. 页面调用规则

### 5.1 详情页（`app/characters/[id]/page.tsx`）

- 主视觉：优先 `cardPath` → 其次 `cleanPath` → 无图则显示文字头部。
- 头部小头像：使用 `getCharacterAvatar(character)`，可为专属头像或默认头像。
- 默认头像**不会**作为详情页大图使用。

### 5.2 群英录（`app/characters/page.tsx`）

- 人物卡片头像：使用 `getCharacterAvatar(c)`。
- 有专属头像显示专属图；无专属头像显示分类默认头像；默认头像也不存在时隐藏头像区，保留文字布局。

### 5.3 人物榜（`app/ranking/page.tsx`）

- 表格人物列头像：使用 `getCharacterAvatar(c)`。
- 有头像显示圆形图片；无有效头像时显示姓名首字占位圆圈。

### 5.4 权力图谱右侧面板（`app/components/GraphPageClient.tsx`）

- 选中人物的头像：使用 `effectiveAvatarPath`（已由服务端解析）。
- 无头像时隐藏头像区，仅显示文字信息。

### 5.5 统一入口

- `app/lib/defaultAvatar.ts` 提供 `categoryToDefaultAvatar` 映射与 `getCharacterAvatar(c)` / `resolveCharacterAvatar(c)` 函数。
- `app/lib/data.ts` 在 `getCharacters()` 中为每个人物计算 `effectiveAvatarPath`，确保所有页面拿到的是经存在性校验的安全路径。

---

## 6. 职责边界

- **ChatGPT**：负责视觉图片的设计与生成，包括核心 10 人三件套与 11 类默认头像。
- **Kimi Code**：负责数据结构、路径映射、服务端存在性校验、页面接入、构建验证与打包交付；不设计图片、不修改图片、不前端叠字。

---

## 7. 构建验证

```text
npm run build
✓ Generating static pages using 11 workers (900/900)
```

当前稳定基线已通过构建验证。
