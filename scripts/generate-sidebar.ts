import fs from 'fs'
import path from 'path'

/**
 * 生成侧边栏配置（独立脚本版本）
 * 这个脚本可以单独运行来预生成侧边栏配置
 */

interface SidebarItem {
  text: string
  link?: string
  items?: SidebarItem[]
  collapsed?: boolean
}

function generateSidebar(): SidebarItem[] {
  const docsDir = path.resolve(process.cwd(), 'docs')
  
  const files = fs.readdirSync(docsDir)
  const issueFiles = files
    .filter(file => file.startsWith('issue-') && file.endsWith('.md'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/issue-(\d+)\.md/)?.[1] || '0')
      const numB = parseInt(b.match(/issue-(\d+)\.md/)?.[1] || '0')
      return numB - numA
    })

  const issuesByYear: { [year: string]: { num: number; file: string; title: string }[] } = {}
  
  issueFiles.forEach(file => {
    const num = parseInt(file.match(/issue-(\d+)\.md/)?.[1] || '0')
    const filePath = path.join(docsDir, file)
    
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

  const sidebar: SidebarItem[] = [
    {
      text: '关于周刊',
      items: [
        { text: '介绍', link: '/README' },
        { text: 'RSS 订阅', link: '/feed.xml' }
      ]
    }
  ]

  const years = Object.keys(issuesByYear).sort((a, b) => parseInt(b) - parseInt(a))
  
  years.forEach((year, index) => {
    const issues = issuesByYear[year]
    sidebar.push({
      text: `${year} 年 (${issues.length} 期)`,
      collapsed: index > 0,
      items: issues.map(issue => ({
        text: issue.title,
        link: `/docs/${issue.file.replace('.md', '')}`
      }))
    })
  })

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

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  const sidebar = generateSidebar()
  console.log('生成的侧边栏配置:')
  console.log(JSON.stringify(sidebar, null, 2))
}

export { generateSidebar }

