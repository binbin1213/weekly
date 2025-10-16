import fs from 'fs'
import path from 'path'

interface SidebarItem {
  text: string
  link?: string
  items?: SidebarItem[]
  collapsed?: boolean
}

/**
 * 生成侧边栏配置
 */
export function generateSidebar(): SidebarItem[] {
  const docsDir = path.resolve(process.cwd(), 'docs')
  
  // 获取所有 issue 文件
  const files = fs.readdirSync(docsDir)
  const issueFiles = files
    .filter(file => file.startsWith('issue-') && file.endsWith('.md'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/issue-(\d+)\.md/)?.[1] || '0')
      const numB = parseInt(b.match(/issue-(\d+)\.md/)?.[1] || '0')
      return numB - numA // 降序排列，最新的在前
    })

  // 按年份分组
  const issuesByYear: { [year: string]: { num: number; file: string; title: string }[] } = {}
  
  issueFiles.forEach(file => {
    const num = parseInt(file.match(/issue-(\d+)\.md/)?.[1] || '0')
    const filePath = path.join(docsDir, file)
    
    // 尝试读取文件标题
    let title = `第 ${num} 期`
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const titleMatch = content.match(/^#\s+(.+)$/m)
      if (titleMatch) {
        title = titleMatch[1].replace(/科技爱好者周刊（第\s*\d+\s*期）：?\s*/i, '')
        title = `第 ${num} 期：${title}`
      }
    } catch (e) {
      // 忽略错误
    }

    // 根据期号推断年份
    let year = '2018'
    if (num >= 368) year = '2025'
    else if (num >= 332) year = '2024'
    else if (num >= 284) year = '2023'
    else if (num >= 237) year = '2022'
    else if (num >= 191) year = '2021'
    else if (num >= 89) year = '2020'
    else if (num >= 38) year = '2019'

    if (!issuesByYear[year]) {
      issuesByYear[year] = []
    }
    
    issuesByYear[year].push({ num, file, title })
  })

  // 生成侧边栏结构
  const sidebar: SidebarItem[] = [
    {
      text: '关于周刊',
      items: [
        { text: '介绍', link: '/README' },
        { text: 'RSS 订阅', link: '/feed.xml' }
      ]
    }
  ]

  // 按年份添加
  const years = Object.keys(issuesByYear).sort((a, b) => parseInt(b) - parseInt(a))
  
  years.forEach((year, index) => {
    const issues = issuesByYear[year]
    sidebar.push({
      text: `${year} 年 (${issues.length} 期)`,
      collapsed: index > 0, // 除了最新年份，其他都折叠
      items: issues.map(issue => ({
        text: issue.title,
        link: `/docs/${issue.file.replace('.md', '')}`
      }))
    })
  })

  // 添加资源分类
  sidebar.push({
    text: '免费资源',
    collapsed: true,
    items: [
      { text: '免费软件', link: '/docs/free-software' },
      { text: '免费图片', link: '/docs/free-photos' },
      { text: '免费音乐', link: '/docs/free-music' }
    ]
  })

  return sidebar
}

