# 唐局 v0.4 第一组重点人物视觉稳定归档说明

## 版本信息

- 项目版本：`0.4.0`
- 交付包：`datang-stars-v0.4-group1-stable-baseline.zip`
- 归档说明：在 v0.3 稳定基线之上，完成 v0.4 第一组 4 位重点人物专属视觉资产导入并验收通过。

## 当前专属视觉人物总数：14 人

### 核心 10 人

| id | 姓名 | 主分类 | 子分类 | 历史影响力 |
|---|---|---|---|---|
| anlushan | 安禄山 | 叛乱势力 |  | 95 |
| yuchigong | 尉迟恭 | 武将/将领 | 唐初猛将 / 凌烟阁功臣 | 66 |
| fangxuanling | 房玄龄 | 宰相/大臣 | 贞观宰相 / 凌烟阁功臣 | 82 |
| zhuwen | 朱温 | 叛乱势力 |  | 90 |
| lishimin | 李世民 | 皇帝/皇室 | 皇帝 | 100 |
| limi-2 | 李泌 | 宰相/大臣 | 宰相 | 75 |
| liyuan | 李渊 | 皇帝/皇室 | 皇帝 | 92 |
| lilongji | 李隆基 | 皇帝/皇室 | 皇帝 | 95 |
| lijing | 李靖 | 武将/将领 | 将领 | 71 |
| yangguifei | 杨贵妃 | 后宫/女性 |  | 85 |
| wuzetian | 武则天 | 皇帝/皇室 | 女皇 | 98 |
| qinshubao | 秦琼 | 武将/将领 | 唐初名将 / 凌烟阁功臣 | 42 |
| guoziyi | 郭子仪 | 武将/将领 |  | 90 |
| gaozong | 李治 | 皇帝/皇室 | 皇帝 | 90 |

### v0.4 第一组 4 人

| id | 姓名 | 主分类 | 子分类 | 历史影响力 |
|---|---|---|---|---|
| shangguanwaner | 上官婉儿 | 后宫/女性 | 宫廷女官 | 78 |
| taipinggongzhu | 太平公主 | 皇帝/皇室 | 公主 | 80 |
| libai | 李白 | 文人 |  | 82 |
| dufu | 杜甫 | 文人 |  | 82 |

## 11 类默认头像覆盖

其余人物按主分类自动回退到对应默认头像：

- `imperial-default.png` → 皇帝/皇室
- `minister-default.png` → 宰相/大臣
- `general-default.png` → 武将/将领
- `jiedushi-default.png` → 节度使/藩镇
- `eunuch-default.png` → 宦官
- `female-default.png` → 后宫/女性
- `foreign-default.png` → 外族
- `literati-default.png` → 文人
- `rebel-default.png` → 叛乱势力
- `religion-default.png` → 宗教人物
- `other-default.png` → 其他

## 图片路径规范

```
public/images/characters/clean/<slug>_clean_v01.png
public/images/characters/card/<slug>_card_v01.png
public/images/characters/avatar/<slug>_avatar_v01.png
public/images/characters/defaults/<category>-default.png
```

- `clean`：人物全身/半身原画，用于详情页主视觉兜底。
- `card`：带边框/题签的卡牌，用于详情页主视觉优先展示。
- `avatar`：圆形头像裁切图，用于群英录、人物榜、权力图谱侧栏、详情页顶部小头像。
- `defaults`：按 11 类主分类提供的默认头像。

## 页面调用规则

- 群英录 / 人物榜 / 权力图谱侧栏 / 详情页顶部小头像：
  - 优先 `avatarPath`；不存在时回退到分类默认头像；再不存在则安全回退文字/首字占位。
- 详情页主视觉大图：
  - 优先 `cardPath` → 其次 `cleanPath` → 无图时仅显示文字头部。
  - 默认头像**不**作为详情页主视觉。
- 服务端过滤：
  - `app/lib/data.ts` 在 `getCharacters()` 中校验图片文件存在性，不存在则置空，避免破图。

## ChatGPT / Kimi / Codex 职责边界

- **ChatGPT**：负责生成人物专属视觉资产（clean / card / avatar 三件套）与素材验收。
- **Kimi（本助手）**：负责将素材导入项目、绑定 `characters.json`、生成文档、构建验证、截图与打包交付。
- **Codex / 其他工具**：按项目约定读取 `AGENTS.md`，在已有 `defaultAvatar.ts` 与 `data.ts` 逻辑下消费 `effectiveAvatarPath` / `getCharacterAvatar()`，不重复实现头像回退。

## 验收截图

截图位于 `screenshots/` 目录：

- `group1-characters-<id>-desktop.png`：群英录中上官婉儿 / 太平公主 / 李白 / 杜甫
- `group1-ranking-<id>-desktop.png`：人物榜中对应分类下的四人
- `group1-detail-libai-desktop.png`：李白详情页
- `group1-graph-libai-desktop.png`：权力图谱李白侧栏
- `group1-core10-desktop.png`：核心人物头像展示
- `group1-default-avatars-desktop.png`：默认头像人物展示

## 构建验证

- `npm run build` 通过。
- 静态页面生成 900 页，无报错。