# 唐局 v0.1 人物卡牌 cardPath 回补补丁交付

## 本轮目标

为 v0.1 四位核心人物补齐 `cardPath`（详情页主视觉卡牌图），不修改图片、不做前端叠字。

## 涉及人物

| id | 姓名 | cardPath |
|---|---|---|
| lishimin | 李世民 | `/images/characters/card/li-shimin_card_v01.png` |
| wuzetian | 武则天 | `/images/characters/card/wu-zetian_card_v01.png` |
| anlushan | 安禄山 | `/images/characters/card/an-lushan_card_v01.png` |
| guoziyi | 郭子仪 | `/images/characters/card/guo-ziyi_card_v01.png` |

## 交付文件

- `data/characters.json` — 已绑定四人 `cardPath`，原 `cleanPath` / `avatarPath` 保持不变。
- `public/images/characters/card/` — 4 张 v0.1 卡牌图（原样导入，未压缩、未叠字）。
- `app/types.ts` — `Character` 类型已含 `cardPath?: string`。
- `app/lib/data.ts` — 服务端对 `cleanPath / cardPath / avatarPath` 做存在性过滤，防止破图。
- `app/characters/[id]/page.tsx` — 详情页 Hero 优先 `cardPath`，否则回退 `cleanPath`，无图则显示文字头部；不调用 `CharacterHero` 前端叠字。
- `screenshots/*-card-backfill-*` — 桌面/移动端验收截图。
- `DELIVERY_v0.2.1_v01_card_backfill.md` — 本交付说明。

## 构建结果

```text
npm run build
✓ Generating static pages using 11 workers (900/900)
```

## 截图清单（桌面端）

- `characters-v01-four-card-backfill-desktop.png` — 群英录前 8（含 v0.1 四人头像）。
- `ranking-top10-card-backfill-desktop.png` — 历史影响榜 TOP10（含 v0.1 四人头像）。
- `lishimin-detail-card-backfill-desktop.png` — 李世民详情页显示卡牌大图。
- `wuzetian-detail-card-backfill-desktop.png` — 武则天详情页显示卡牌大图。
- `anlushan-detail-card-backfill-desktop.png` — 安禄山详情页显示卡牌大图。
- `guoziyi-detail-card-backfill-desktop.png` — 郭子仪详情页显示卡牌大图。

## 打包信息

- 交付包：`datang-stars-v0.2.1-v01-card-backfill.zip`
- 已排除：`node_modules/`、`.next/`、`.next.zip`、所有旧 `.zip`、`scripts/venv/`、`__pycache__/`。
