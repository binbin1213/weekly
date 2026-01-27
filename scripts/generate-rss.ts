import { Feed } from 'feed'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface Article {
  title: string
  link: string
  description: string
  content: string
  date: Date
  issueNumber: number
}

/**
 * 生成 RSS Feed
 */
async function generateRSS() {
  const siteUrl = process.env.SITE_URL || 'https://your-domain.com'
  const docsDir = path.resolve(process.cwd(), 'docs')
  const outputPath = path.resolve(process.cwd(), '.vitepress/dist/feed.xml')

  // 创建 Feed 实例
  const feed = new Feed({
    title: '科技爱好者周刊',
    description: '记录每周值得分享的科技内容，周五发布\n\nfeedId:201506091313074176+userId:99005074169381888',
    id: siteUrl,
    link: siteUrl,
    language: 'zh-CN',
    image: `${siteUrl}/logo.png`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: '原作者：阮一峰',
    updated: new Date(),
    generator: 'Feed for Node.js',
    feedLinks: {
      rss: `${siteUrl}/feed.xml`,
      atom: `${siteUrl}/atom.xml`,
      json: `${siteUrl}/feed.json`
    },
    author: {
      name: '阮一峰',
      link: 'https://www.ruanyifeng.com/'
    }
  })

  // 获取所有文章
  const articles = await getArticles(docsDir)
  
  // 只取最新的 20 篇文章
  const latestArticles = articles.slice(0, 20)

  // 添加文章到 Feed
  latestArticles.forEach(article => {
    feed.addItem({
      title: article.title,
      id: article.link,
      link: article.link,
      description: article.description,
      content: article.content,
      date: article.date,
      author: [{
        name: '阮一峰',
        link: 'https://www.ruanyifeng.com/'
      }]
    })
  })

  // 确保输出目录存在
  const outputDir = path.dirname(outputPath)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // 输出 RSS 文件
  fs.writeFileSync(outputPath, feed.rss2())
  console.log('✅ RSS Feed 生成成功:', outputPath)

  // 同时生成 Atom 和 JSON 格式
  fs.writeFileSync(outputPath.replace('feed.xml', 'atom.xml'), feed.atom1())
  fs.writeFileSync(outputPath.replace('feed.xml', 'feed.json'), feed.json1())
  console.log('✅ Atom 和 JSON Feed 也已生成')
}

/**
 * 获取所有文章
 */
async function getArticles(docsDir: string): Promise<Article[]> {
  const files = fs.readdirSync(docsDir)
  const issueFiles = files
    .filter(file => file.startsWith('issue-') && file.endsWith('.md'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/issue-(\d+)\.md/)?.[1] || '0')
      const numB = parseInt(b.match(/issue-(\d+)\.md/)?.[1] || '0')
      return numB - numA // 降序排列
    })

  const articles: Article[] = []
  const siteUrl = process.env.SITE_URL || 'https://your-domain.com'

  for (const file of issueFiles) {
    const filePath = path.join(docsDir, file)
    const issueNumber = parseInt(file.match(/issue-(\d+)\.md/)?.[1] || '0')
    
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(fileContent)
      
      // 提取标题
      let title = `第 ${issueNumber} 期`
      const titleMatch = content.match(/^#\s+(.+)$/m)
      if (titleMatch) {
        title = titleMatch[1].trim()
      }

      // 提取描述（取第一段内容）
      const paragraphs = content
        .split('\n\n')
        .filter(p => p.trim() && !p.startsWith('#') && !p.startsWith('!'))
      const description = paragraphs[0]?.substring(0, 200) || title

      // 获取文章日期
      const date = getArticleDate(issueNumber, filePath)

      articles.push({
        title,
        link: `${siteUrl}/docs/issue-${issueNumber}`,
        description: description.replace(/[*_`]/g, ''),
        content: convertMarkdownToHtml(content),
        date,
        issueNumber
      })
    } catch (error) {
      console.error(`处理文件 ${file} 时出错:`, error)
    }
  }

  return articles
}

/**
 * 根据期号推断发布日期
 */
function getArticleDate(issueNumber: number, filePath: string): Date {
  // 尝试从文件的修改时间获取
  try {
    const stats = fs.statSync(filePath)
    return stats.mtime
  } catch {
    // 如果失败，根据期号估算日期
    // 第1期发布于 2018-04-20，之后每周一期
    const firstIssueDate = new Date('2018-04-20')
    const weeksSinceFirst = issueNumber - 1
    const date = new Date(firstIssueDate)
    date.setDate(date.getDate() + weeksSinceFirst * 7)
    return date
  }
}

/**
 * 简单的 Markdown 到 HTML 转换
 */
function convertMarkdownToHtml(markdown: string): string {
  let html = markdown
  
  // 转换标题
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  
  // 转换链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  
  // 转换图片
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
  
  // 转换粗体
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  
  // 转换斜体
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  
  // 转换段落
  html = html.replace(/\n\n/g, '</p><p>')
  html = `<p>${html}</p>`
  
  return html
}

// 运行脚本
generateRSS().catch(console.error)

