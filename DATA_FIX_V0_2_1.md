# 唐局 v0.2.1 数据修正补丁

## 一、修复重复人物：李湛

### 问题
数据库中存在两个「李湛」：

- `id: lizhan`，`role: 唐敬宗`，错误分类为「宦官」
- `id: jingzong`，`role: 唐朝皇帝`，正确为唐敬宗

### 处理
删除重复条目 `lizhan`，保留 `jingzong` 作为唐敬宗唯一主条目。

唐敬宗（`jingzong`）正确信息：

- canonicalName: 李湛
- displayName: 李湛
- templeName: 敬宗
- dynastyTitle: 唐敬宗
- formerTitle: 景王
- aliases: ["李湛", "敬宗", "唐敬宗", "景王"]
- primaryCategory: 皇帝/皇室
- subCategory: 皇帝
- historicalImportanceScore: 70

## 二、修正皇帝/皇室子分类

### 变更

| 人物 | primaryCategory | 旧 subCategory | 新 subCategory |
|------|-----------------|---------------|---------------|
| 武则天 | 皇帝/皇室 | 皇帝 | 女皇 |
| 太平公主 | 皇帝/皇室 | 公主 | 公主 |
| 安乐公主 | 皇帝/皇室 | 公主 | 公主 |
| 同安公主 | 皇帝/皇室 | 公主 | 公主 |
| 平阳公主 | 皇帝/皇室 | 公主 | 公主 |
| 桂阳公主 | 皇帝/皇室 | 公主 | 公主 |
| 文成公主 | 皇帝/皇室 | 公主 | 公主 |
| 永泰公主 | 皇帝/皇室 | 公主 | 公主 |
| 常乐公主 | 皇帝/皇室 | 公主 | 公主 |
| 李忠 | 皇帝/皇室 | 太子 | 太子 |
| 李弘 | 皇帝/皇室 | 太子 | 太子 |
| 李建成 | 皇帝/皇室 | 太子 | 太子 |
| 李孝恭 | 皇帝/皇室 | 亲王 | 亲王 |
| 武承嗣 | 皇帝/皇室 | 宗室 | 宗室 |
| 武崇训 | 皇帝/皇室 | 驸马 | 驸马 |

### 原则
皇帝/皇室分类不只包含皇帝，也包含太子、亲王、公主、重要宗室与驸马。

## 三、修正历史影响榜前 100 明显分类错误

| 人物 | 旧分类 | 新分类 | 备注 |
|------|--------|--------|------|
| 长孙无忌 | 其他 | 宰相/大臣 | 贞观凌烟阁首席功臣 |
| 李靖 | 宰相/大臣 | 武将/将领 | 卫国公，军事家 |
| 尉迟恭 | 其他 | 武将/将领 | 初唐名将 |
| 白居易 | 宰相/大臣 | 文人 | 中唐诗人 |
| 刘禹锡 | 宰相/大臣 | 文人 | 中唐诗人 |
| 韩愈 | 宰相/大臣 | 文人 | 文学家、古文运动领袖 |
| 王维 | 宰相/大臣 | 文人 | 诗人、画家 |
| 来俊臣 | 宰相/大臣 | 其他 | subCategory 改为「酷吏」 |
| 玄奘 | 宗教人物（保留） | - | score 由 46 提升至 72 |
| 上官婉儿 | 后宫/女性（保留） | - | score 由 59 提升至 78，subCategory 改为「宫廷女官」 |

## 四、补充 impactStatement

为 `historicalImportanceScore` 排名前 100 的人物补充 `impactStatement`。

- 核心人物使用人工编写的一句话说明。
- 其余人物使用基于分类、身份与事件的模板生成，不直接复用 summary。

详见 `TOP100_IMPACT_STATEMENTS.md`。

## 五、统一搜索函数

新增 `app/lib/search.ts`：

```ts
export function matchCharacterSearch(character: Character, query: string): boolean
```

统一搜索字段：

- `name` / `displayName`
- `canonicalName` / `personalName`
- `templeName` / `dynastyTitle` / `formerTitle`
- `aliases`
- `role`
- `summary`
- `events`

已接入：

- `app/characters/page.tsx`
- `app/components/GraphPageClient.tsx`
- `app/lib/graphData.ts`

## 六、群英录默认排序调整

群英录默认排序由「出场次数降序」改为「历史影响力降序」，出场次数排序仍作为可选项保留。

## 七、修改文件清单

- `data/characters.json`
- `app/types.ts`（已含 impactStatement 字段）
- `app/lib/search.ts`（新增）
- `app/characters/page.tsx`
- `app/components/GraphPageClient.tsx`
- `app/lib/graphData.ts`
- `app/ranking/page.tsx`（显示 impactStatement）
- `scripts/restructure_characters.py`
- `DATA_FIX_V0_2_1.md`
- `TOP100_IMPACT_STATEMENTS.md`
- `DELIVERY.md`

## 八、数据量变化

- v0.2 总人物数：892
- v0.2.1 总人物数：891（删除重复 `lizhan`）
- 皇帝/皇室人物数：35
