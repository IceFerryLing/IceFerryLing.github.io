// 站点基础信息
export const SITE_NAME = 'IceFerryLing';
export const SITE_DESCRIPTION = '以紫色星云为基调的个人博客，记录代码、生活与灵感。';
// 部署站点地址（支持通过环境变量覆盖）
export const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://iceferryling.github.io';
// 归档页分页大小
export const POSTS_PER_PAGE = 6;

// 作者资料（用于侧栏）
export const AUTHOR_PROFILE = {
	name: 'IceFerryLing',
	bio: '记录代码、灵感与生活碎片。',
	avatar: '/assets/images/avatar.png',
	github: 'https://github.com/IceFerryLing',
	email: 'mailto:your@email.com'
};

// Giscus 评论配置（通过 .env 注入）
export const GISCUS_CONFIG = {
	repo: process.env.GISCUS_REPO || '',
	repoId: process.env.GISCUS_REPO_ID || '',
	category: process.env.GISCUS_CATEGORY || 'General',
	categoryId: process.env.GISCUS_CATEGORY_ID || ''
};
