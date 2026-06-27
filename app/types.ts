export interface Relation {
  id: string;
  name: string;
  type: string;
}

export interface Character {
  id: string;
  /** 兼容字段，等价于 displayName */
  name: string;
  letter: string;
  role: string;
  category: string;
  primaryCategory: string;
  subCategory?: string;
  events: string[];
  eventRaw: string;
  /** 原书出场次数，仅作后台参考 */
  mentions: number;
  /** 原书出场次数别名，与 mentions 保持一致 */
  appearanceCount?: number;
  period: string;
  summary: string;
  relations: Relation[];
  source: string;
  cleanPath?: string;
  cardPath?: string;
  avatarPath?: string;
  /** 服务端解析后的实际头像路径：avatarPath 不存在时回退到分类默认头像 */
  effectiveAvatarPath?: string;
  // 名称与别名系统
  canonicalName?: string;
  displayName?: string;
  personalName?: string;
  templeName?: string;
  dynastyTitle?: string;
  reignTitle?: string;
  formerTitle?: string;
  aliases?: string[];
  // 重要性与视觉优先级
  historicalImportanceScore?: number;
  visualPriority?: boolean;
  // 一句话影响说明（可选）
  impactStatement?: string;
  // 人工覆盖校订元数据（仅运行时存在，不写入源数据文件）
  _overrideApplied?: boolean;
  _overrideSource?: string;
  _overrideNote?: string;
  _overrideOriginalCategory?: string;
}

export interface HistoricalEventCharacter {
  id?: string;
  name: string;
}

export interface HistoricalEvent {
  id: string;
  title: string;
  period: string;
  year: string;
  summary: string;
  consequences: string;
  characters: HistoricalEventCharacter[];
}

export interface BookTimelineEvent {
  id: string;
  title: string;
  year: string;
  yearRange: string | null;
  period: string;
  stage: string;
  chapter: string;
  summary: string;
  people: string[];
  places: string[];
  type: string[];
  importance: number;
  source: string;
}
