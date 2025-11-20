# project-description.md

This is an Astro-based personal blog project called "aMIrmxc-blogg Blog" built with modern web technologies. The site is designed as a developer's blog to share ideas, experiments, and practical lessons related to JavaScript ecosystem technologies.

Core Technology Stack
Framework: Astro v5.10.1 - A modern static site builder that uses the "Islands Architecture" for optimal performance
Language: TypeScript for type safety throughout the project
Styling: Tailwind CSS for utility-first styling approach
Content Format: Markdown and MDX for blog posts and notes

src/
├── components/ # Reusable UI components
├── content/ # Content collections (posts, notes, tags)
├── layouts/ # Page layouts (Base, BlogPost)
├── pages/ # File-based routing system
├── plugins/ # Custom remark/rehype plugins
├── styles/ # Global and component-specific CSS
└── utils/ # Utility functions

"dependencies": {
"@astrojs/markdown-remark": "^6.3.2",
"@astrojs/mdx": "4.3.0",
"@astrojs/rss": "4.0.12",
"@astrojs/sitemap": "3.4.1",
"@tailwindcss/vite": "4.1.11",
"astro": "5.10.1",
"astro-expressive-code": "^0.41.2",
"astro-icon": "^1.1.5",
"astro-robots-txt": "^1.0.0",
"astro-webmanifest": "^1.0.0",
"cssnano": "^7.0.7",
"hastscript": "^9.0.0",
"mdast-util-directive": "^3.0.0",
"mdast-util-to-markdown": "^2.1.2",
"mdast-util-to-string": "^4.0.0",
"rehype-autolink-headings": "^7.1.0",
"rehype-external-links": "^3.0.0",
"rehype-unwrap-images": "^1.0.0",
"remark-directive": "^4.0.0",
"satori": "0.15.2",
"satori-html": "^0.3.2",
"sharp": "^0.34.2",
"unified": "^11.0.5",
"unist-util-visit": "^5.0.0"
}
