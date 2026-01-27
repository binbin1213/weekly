import fs from 'fs'
import path from 'path'

interface SidebarItem {
  text: string
  link?: string
  items?: SidebarItem[]
  collapsed?: boolean
}

/**
 * 从文件内容中提取年份
 * 优先级：
 * 1. 从图片URL中提取 (支持 YYMMDD 和 YYYYMMDD 两种格式)
 * 2. 从链接URL中提取 (2026-01/15 → 2026)
 * 3. 回退到期号估算（不推荐，但作为兜底）
 */
function extractYearFromFile(content: string, issueNumber: number): string {
  // 方法1: 从图片URL提取
  // 早期格式: YYMMDD (如 220204 → 22年04月 → 2022年)
  // 新格式: YYYYMMDD (如 202601 → 2026年01月)
  const imagePattern = /blogimg\/asset\/(\d{6})\//i
  const imageMatch = content.match(imagePattern)
  if (imageMatch) {
    const dateStr = imageMatch[1]
    const yearPart = parseInt(dateStr.substring(0, 4))

    // 如果前4位 > 2200，说明是 YYMMDD 格式 (如 220204)
    // 否则是 YYYYMMDD 格式 (如 202601)
    if (yearPart > 2200) {
      // YYMMDD 格式：22 → 2022
      const twoDigitYear = parseInt(dateStr.substring(0, 2))
      return (2000 + twoDigitYear).toString()
    } else {
      // YYYYMMDD 格式：直接取前4位
      return dateStr.substring(0, 4)
    }
  }

  // 方法2: 从链接URL提取 (2026-01/15 → 2026)
  const linkPattern = /(\d{4})-\d{2}\//i
  const linkMatch = content.match(linkPattern)
  if (linkMatch) {
    return linkMatch[1]
  }

  // 方法3: 回退到期号估算（不太准确，仅作兜底）
  // 假设第1期是2018年4月，每周一期
  const estimatedDate = new Date('2018-04-20')
  const weeksToAdd = issueNumber - 1
  estimatedDate.setDate(estimatedDate.getDate() + weeksToAdd * 7)
  return estimatedDate.getFullYear().toString()
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

    // 尝试读取文件内容和标题
    let title = `第 ${num} 期`
    let year = '2018' // 默认年份

    try {
      const content = fs.readFileSync(filePath, 'utf-8')

      // 提取标题
      const titleMatch = content.match(/^#\s+(.+)$/m)
      if (titleMatch) {
        title = titleMatch[1].replace(/科技爱好者周刊（第\s*\d+\s*期）：?\s*/i, '')
        title = `第 ${num} 期：${title}`
      }

      // 智能提取年份
      year = extractYearFromFile(content, num)
    } catch (e) {
      // 读取失败，使用默认年份
      console.warn(`无法读取文件 ${file}，使用默认年份`)
    }

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

