import fs from 'fs'
import path from 'path'

/**
 * 获取最新一期的期号
 * @returns 最新期号
 */
export function getLatestIssueNumber(): number {
  const docsDir = path.resolve(process.cwd(), 'docs')
  
  if (!fs.existsSync(docsDir)) {
    console.warn('docs 目录不存在，返回默认期号 368')
    return 368
  }

  const files = fs.readdirSync(docsDir)
  const issueFiles = files
    .filter(file => file.startsWith('issue-') && file.endsWith('.md'))
    .map(file => {
      const match = file.match(/issue-(\d+)\.md/)
      return match ? parseInt(match[1]) : 0
    })
    .filter(num => num > 0)

  if (issueFiles.length === 0) {
    console.warn('没有找到 issue 文件，返回默认期号 368')
    return 368
  }

  const latestIssue = Math.max(...issueFiles)
  console.log(`✅ 找到最新一期：issue-${latestIssue}`)
  return latestIssue
}

/**
 * 获取最新一期的标题
 * @param issueNumber 期号
 * @returns 标题
 */
export function getIssueTitle(issueNumber: number): string {
  const docsDir = path.resolve(process.cwd(), 'docs')
  const filePath = path.join(docsDir, `issue-${issueNumber}.md`)
  
  if (!fs.existsSync(filePath)) {
    return `第 ${issueNumber} 期`
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const titleMatch = content.match(/^#\s+(.+)$/m)
    
    if (titleMatch) {
      let title = titleMatch[1].trim()
      // 移除可能的"科技爱好者周刊（第 XX 期）："前缀
      title = title.replace(/科技爱好者周刊（第\s*\d+\s*期）：?\s*/i, '')
      return title
    }
  } catch (error) {
    console.error(`读取 ${filePath} 失败:`, error)
  }
  
  return `第 ${issueNumber} 期`
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  const latestIssue = getLatestIssueNumber()
  const title = getIssueTitle(latestIssue)
  
  console.log('\n📊 最新一期信息:')
  console.log(`期号: ${latestIssue}`)
  console.log(`标题: ${title}`)
  console.log(`链接: /docs/issue-${latestIssue}`)
}

