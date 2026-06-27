# 唐局人物视觉系统 v0.4 最终稳定基线说明

## 版本信息

- 项目版本：`0.4.0`
- 交付包：`datang-stars-v0.4-final-stable-baseline.zip`
- 归档说明：在 v0.3 默认头像体系与核心 10 人专属视觉基线之上，完成 v0.4 第一组 4 人、第二组 8 人专属视觉导入，并应用李靖数据增强补丁，形成 v0.4 最终稳定基线。

## 当前状态

- 总人物数：**890**
- 静态页面数：**899**
- 专属视觉人物数：**22**
- 使用默认头像人物数：**868**
- 头像覆盖率：**100%**

## v0.4 最终专属视觉 22 人清单

| id | 姓名 | 主分类 | 子分类 | 历史影响力 |
|---|---|---|---|---|
| anlushan | 安禄山 | 叛乱势力 |  | 95 |
| dufu | 杜甫 | 文人 |  | 82 |
| fangxuanling | 房玄龄 | 宰相/大臣 | 贞观宰相 / 凌烟阁功臣 | 82 |
| gaolishi | 高力士 | 宦官 | 玄宗内侍 / 内廷权臣 | 78 |
| gaozong | 李治 | 皇帝/皇室 | 皇帝 | 90 |
| guoziyi | 郭子仪 | 武将/将领 |  | 90 |
| huangchao | 黄巢 | 叛乱势力 | 唐末起义领袖 / 大齐政权建立者 | 88 |
| libai | 李白 | 文人 |  | 82 |
| lijing | 李靖 | 武将/将领 | 唐初名将 / 凌烟阁功臣 | 71 |
| lilinfu | 李林甫 | 宰相/大臣 | 玄宗权相 / 天宝权臣 | 69 |
| lilongji | 李隆基 | 皇帝/皇室 | 皇帝 | 95 |
| limi-2 | 李泌 | 宰相/大臣 | 宰相 | 75 |
| lishimin | 李世民 | 皇帝/皇室 | 皇帝 | 100 |
| liyuan | 李渊 | 皇帝/皇室 | 皇帝 | 92 |
| qinshubao | 秦琼 | 武将/将领 | 唐初名将 / 凌烟阁功臣 | 42 |
| shangguanwaner | 上官婉儿 | 后宫/女性 | 宫廷女官 | 78 |
| taipinggongzhu | 太平公主 | 皇帝/皇室 | 公主 | 80 |
| weizheng | 魏征 | 宰相/大臣 | 贞观谏臣 / 凌烟阁功臣 | 85 |
| wuzetian | 武则天 | 皇帝/皇室 | 女皇 | 98 |
| yangguifei | 杨贵妃 | 后宫/女性 |  | 85 |
| yuchigong | 尉迟恭 | 武将/将领 | 唐初猛将 / 凌烟阁功臣 | 66 |
| zhuwen | 朱温 | 叛乱势力 |  | 90 |

## 分组来源

### 核心 10 人

| id | 姓名 | 主分类 | 子分类 | 历史影响力 |
|---|---|---|---|---|
| lishimin | 李世民 | 皇帝/皇室 | 皇帝 | 100 |
| liyuan | 李渊 | 皇帝/皇室 | 皇帝 | 92 |
| wuzetian | 武则天 | 皇帝/皇室 | 女皇 | 98 |
| gaozong | 李治 | 皇帝/皇室 | 皇帝 | 90 |
| lilongji | 李隆基 | 皇帝/皇室 | 皇帝 | 95 |
| yangguifei | 杨贵妃 | 后宫/女性 |  | 85 |
| anlushan | 安禄山 | 叛乱势力 |  | 95 |
| zhuwen | 朱温 | 叛乱势力 |  | 90 |
| limi-2 | 李泌 | 宰相/大臣 | 宰相 | 75 |
| guoziyi | 郭子仪 | 武将/将领 |  | 90 |

### v0.4 第一组 4 人

| id | 姓名 | 主分类 | 子分类 | 历史影响力 |
|---|---|---|---|---|
| shangguanwaner | 上官婉儿 | 后宫/女性 | 宫廷女官 | 78 |
| taipinggongzhu | 太平公主 | 皇帝/皇室 | 公主 | 80 |
| libai | 李白 | 文人 |  | 82 |
| dufu | 杜甫 | 文人 |  | 82 |

### v0.4 第二组 8 人

| id | 姓名 | 主分类 | 子分类 | 历史影响力 |
|---|---|---|---|---|
| lijing | 李靖 | 武将/将领 | 唐初名将 / 凌烟阁功臣 | 71 |
| qinshubao | 秦琼 | 武将/将领 | 唐初名将 / 凌烟阁功臣 | 42 |
| yuchigong | 尉迟恭 | 武将/将领 | 唐初猛将 / 凌烟阁功臣 | 66 |
| fangxuanling | 房玄龄 | 宰相/大臣 | 贞观宰相 / 凌烟阁功臣 | 82 |
| weizheng | 魏征 | 宰相/大臣 | 贞观谏臣 / 凌烟阁功臣 | 85 |
| lilinfu | 李林甫 | 宰相/大臣 | 玄宗权相 / 天宝权臣 | 69 |
| gaolishi | 高力士 | 宦官 | 玄宗内侍 / 内廷权臣 | 78 |
| huangchao | 黄巢 | 叛乱势力 | 唐末起义领袖 / 大齐政权建立者 | 88 |

## 11 类默认头像体系

其余 868 位人物按主分类自动回退到对应默认头像：

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

## 数据修正摘要

- **秦琼（qinshubao）**
  - 确认真实 id 为 `qinshubao`；姓名统一为“秦琼”；`aliases` 补充 `秦叔宝、叔宝、胡国公、凌烟阁功臣`；分类归入 `武将/将领`。
- **尉迟恭（yuchigong）**
  - 确认真实 id 为 `yuchigong`；`aliases` 补充 `尉迟敬德、敬德、鄂国公、凌烟阁功臣`；删除重复条目 `yuchijingde`。
- **房玄龄（fangxuanling）**
  - 确认真实 id 为 `fangxuanling`；姓名/别名统一；`primaryCategory` 为 `宰相/大臣`。
- **魏征（weizheng）**
  - 确认真实 id 为 `weizheng`；`aliases` 包含 `魏征、魏徵、郑国公、直谏名臣、贞观谏臣`；分类 `宰相/大臣`。
- **李林甫（lilinfu）**
  - 确认真实 id 为 `lilinfu`；`aliases` 包含 `李林甫、晋国公、玄宗权相、口蜜腹剑`；分类 `宰相/大臣`。
- **高力士（gaolishi）**
  - 确认真实 id 为 `gaolishi`；`aliases` 包含 `高力士、冯元一、玄宗近侍、内廷权臣`；分类 `宦官`。
- **黄巢（huangchao）**
  - 确认真实 id 为 `huangchao`；`aliases` 包含 `黄巢、冲天大将军、大齐皇帝、唐末起义领袖`；分类 `叛乱势力`。
- **李靖（lijing）数据增强补丁**
  - `aliases` 更新为 `["李靖", "李药师", "卫国公", "凌烟阁功臣", "唐初名将"]`；
  - `subCategory` 更新为 `唐初名将 / 凌烟阁功臣`；
  - `role` / `summary` 完善为唐初军事统帅相关描述。

## 基线可用性声明

当前版本已完成 v0.4 全部计划内重点人物视觉导入与数据修正：

- 默认头像体系完整兜底 868 位非重点人物；
- 22 位重点人物拥有专属 clean / card / avatar 三件套；
- `npm run build` 通过，生成 899 个静态页面无报错；
- 无重复人物、无 orphan id、无已删除 id 运行时引用。

因此，当前版本可作为 **《唐局人物视觉系统 v0.4 最终稳定基线》** 使用。

## 相关文档

- `VISUAL_COVERAGE_REPORT.md`：当前视觉覆盖率统计。
- `VISUAL_SYSTEM_V0_4_GROUP2_AUDIT.md`：第二组数据完整性审查。
- 各人物导入交付说明：`LIJING_IMPORT_DELIVERY.md`、`QINQIONG_IMPORT_DELIVERY.md`、`YUCHIGONG_IMPORT_DELIVERY.md`、`FANGXUANLING_IMPORT_DELIVERY.md`、`WEIZHENG_IMPORT_DELIVERY.md`、`LILINFU_IMPORT_DELIVERY.md`、`GAOLISHI_IMPORT_DELIVERY.md`、`HUANGCHAO_IMPORT_DELIVERY.md`、`LIJING_DATA_POLISH.md`。

## 构建验证

- `npm run build` 通过。
- 静态页面生成 899 页，无报错。
