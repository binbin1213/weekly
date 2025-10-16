import { defineConfig } from 'vitepress'
import { generateSidebar } from './theme/sidebar'

export default defineConfig({
  title: '科技爱好者周刊',
  description: '记录每周值得分享的科技内容，周五发布',
  lang: 'zh-CN',
  
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: 'RSS Feed', href: '/feed.xml' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '科技爱好者周刊' }],
    ['meta', { property: 'og:description', content: '记录每周值得分享的科技内容' }]
  ],

  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '最新期刊', link: '/docs/issue-368' },
      { 
        text: '年份', 
        items: [
          { text: '2025', link: '/docs/issue-368' },
          { text: '2024', link: '/docs/issue-331' },
          { text: '2023', link: '/docs/issue-284' },
          { text: '2022', link: '/docs/issue-237' },
          { text: '更早', link: '/archive' }
        ]
      },
      { 
        text: '资源', 
        items: [
          { text: '免费软件', link: '/docs/free-software' },
          { text: '免费图片', link: '/docs/free-photos' },
          { text: '免费音乐', link: '/docs/free-music' }
        ]
      },
      { text: 'RSS订阅', link: '/feed.xml' }
    ],

    sidebar: generateSidebar(),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ruanyf/weekly' }
    ],

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    },

    footer: {
      message: '基于 MIT 许可发布',
      copyright: '原作者：阮一峰 | 本站自动化构建'
    },

    outline: {
      label: '页面导航',
      level: [2, 3]
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  },

  lastUpdated: true,
  cleanUrls: true,

  sitemap: {
    hostname: 'https://your-domain.com'
  },

  markdown: {
    lineNumbers: false,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  }
})

