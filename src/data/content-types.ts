/**
 * Blog content type configuration
 * Shared between BlogCard, FilterTabs, and any future component
 * that needs content-type metadata (icon, label, color class).
 */
export const typeConfig = {
  insight:        { label: '思想笔记', icon: '🔬', color: 'type-insight' },
  technical:      { label: '技术实录', icon: '🛠️', color: 'type-technical' },
  'member-essay': { label: '成员随笔', icon: '✍️', color: 'type-member' },
  meeting:        { label: '会议纪实', icon: '📋', color: 'type-meeting' },
} as const;

export type ContentType = keyof typeof typeConfig;

export const contentTypes: ContentType[] = ['insight', 'technical', 'member-essay', 'meeting'];
