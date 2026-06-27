# 唐局人物视觉系统覆盖情况报告

> 统计时间：基于当前 `data/characters.json` 与 `public/images/characters/` 实际文件。
> 说明：本报告为 v0.5 网站视觉体验精修后版本。当前总人物数 890，静态页面 899，专属视觉人物 22 人，其余 868 人由 11 类默认头像兜底，头像覆盖率 100%。v0.5 未新增人物，未修改图片，仅优化页面展示体验。

## 1. 总体覆盖

| 指标 | 人数 | 占比 |
|---|---|---|
| 总人物数 | 890 | 100% |
| 有 cardPath（详情页主视觉卡牌图） | 22 | 2.5% |
| 有 cleanPath（无卡牌时的详情页大图） | 22 | 2.5% |
| 有专属 avatarPath（头像图） | 22 | 2.5% |
| 使用分类默认头像 | 868 | 97.5% |
| 有任意有效头像（专属或默认） | 890 | 100.0% |
| 仍无头像（默认头像缺失时回退文字） | 0 | 0.0% |

## 2. 已覆盖专属视觉的人物清单

当前共有 **22** 位人物拥有专属头像（同时具有 card / clean / avatar 三件套）：

| id | 姓名 | 分类 | 说明 |
|---|---|---|---|
| shangguanwaner | 上官婉儿 | 后宫/女性 | v0.4 第一组 |
| taipinggongzhu | 太平公主 | 皇帝/皇室 | v0.4 第一组 |
| anlushan | 安禄山 | 叛乱势力 | 核心 10 人 |
| huangchao | 黄巢 | 叛乱势力 | v0.4 第二组 |
| yuchigong | 尉迟恭 | 武将/将领 | v0.4 第二组 |
| fangxuanling | 房玄龄 | 宰相/大臣 | v0.4 第二组 |
| weizheng | 魏征 | 宰相/大臣 | v0.4 第二组 |
| zhuwen | 朱温 | 叛乱势力 | 核心 10 人 |
| lishimin | 李世民 | 皇帝/皇室 | 核心 10 人 |
| limi-2 | 李泌 | 宰相/大臣 | 核心 10 人 |
| lilinfu | 李林甫 | 宰相/大臣 | v0.4 第二组 |
| liyuan | 李渊 | 皇帝/皇室 | 核心 10 人 |
| libai | 李白 | 文人 | v0.4 第一组 |
| lilongji | 李隆基 | 皇帝/皇室 | 核心 10 人 |
| lijing | 李靖 | 武将/将领 | v0.4 第二组 |
| dufu | 杜甫 | 文人 | v0.4 第一组 |
| yangguifei | 杨贵妃 | 后宫/女性 | 核心 10 人 |
| wuzetian | 武则天 | 皇帝/皇室 | 核心 10 人 |
| qinshubao | 秦琼 | 武将/将领 | v0.4 第二组 |
| guoziyi | 郭子仪 | 武将/将领 | 核心 10 人 |
| gaozong | 李治 | 皇帝/皇室 | 核心 10 人 |
| gaolishi | 高力士 | 宦官 | v0.4 第二组 |

## 3. 分类统计与默认头像

| 分类 | 人数 | 专属头像 | 默认头像 | 默认头像文件 |
|---|---|---|---|---|
| 皇帝/皇室 | 35 | 6 | 29 | `imperial-default.png` |
| 宰相/大臣 | 267 | 4 | 263 | `minister-default.png` |
| 武将/将领 | 91 | 4 | 87 | `general-default.png` |
| 节度使/藩镇 | 160 | 0 | 160 | `jiedushi-default.png` |
| 宦官 | 19 | 1 | 18 | `eunuch-default.png` |
| 后宫/女性 | 29 | 2 | 27 | `female-default.png` |
| 外族 | 54 | 0 | 54 | `foreign-default.png` |
| 文人 | 27 | 2 | 25 | `literati-default.png` |
| 叛乱势力 | 26 | 3 | 23 | `rebel-default.png` |
| 宗教人物 | 22 | 0 | 22 | `religion-default.png` |
| 其他 | 160 | 0 | 160 | `other-default.png` |

## 4. 默认头像存放位置

默认头像已放入 `public/images/characters/defaults/`：

- `imperial-default.png` → 用于「皇帝/皇室」分类
- `minister-default.png` → 用于「宰相/大臣」分类
- `general-default.png` → 用于「武将/将领」分类
- `jiedushi-default.png` → 用于「节度使/藩镇」分类
- `eunuch-default.png` → 用于「宦官」分类
- `female-default.png` → 用于「后宫/女性」分类
- `foreign-default.png` → 用于「外族」分类
- `literati-default.png` → 用于「文人」分类
- `rebel-default.png` → 用于「叛乱势力」分类
- `religion-default.png` → 用于「宗教人物」分类
- `other-default.png` → 用于「其他」分类

## 5. 页面接入情况

- `app/lib/defaultAvatar.ts`：分类→默认头像映射与 `getCharacterAvatar` 解析函数。
- `app/lib/data.ts`：`getCharacters()` 输出 `effectiveAvatarPath`（专属头像优先，否则回退分类默认头像）。
- `app/characters/page.tsx`：群英录人物卡片使用 `getCharacterAvatar(c)`。
- `app/ranking/page.tsx`：人物榜使用 `getCharacterAvatar(c)`，无头像时显示姓名首字占位。
- `app/components/GraphPageClient.tsx`：权力图谱右侧面板使用 `effectiveAvatarPath`。
- `app/characters/[id]/page.tsx`：详情页头部小头像使用 `getCharacterAvatar(character)`；详情页主视觉仍优先 `cardPath` → `cleanPath`。
