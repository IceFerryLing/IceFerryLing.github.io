export const SITE_NAME = 'IceFerryLing';
export const SITE_DESCRIPTION = '以紫色星云为基调的个人博客，记录代码、生活与灵感。';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://iceferryling.github.io';
export const POSTS_PER_PAGE = 6;

export const AUTHOR_PROFILE = {
	name: 'IceFerryLing',
	bio: '记录代码、灵感与生活碎片。',
	avatar: '/assets/images/avatar.png',
	github: 'https://github.com/IceFerryLing',
	email: 'mailto:your@email.com'
};

export const GISCUS_CONFIG = {
	repo: process.env.GISCUS_REPO || '',
	repoId: process.env.GISCUS_REPO_ID || '',
	category: process.env.GISCUS_CATEGORY || 'General',
	categoryId: process.env.GISCUS_CATEGORY_ID || ''
};
