import fs from 'fs'
import path from 'path'
import { getLatestIssueNumber, getIssueTitle } from './get-latest-issue'

/**
 * 更新 index.md 中的最新期号链接
 */
function updateIndexPage() {
  const indexPath = path.resolve(process.cwd(), 'index.md')
  
  if (!fs.existsSync(indexPath)) {
    console.error('❌ index.md 文件不存在')
    return
  }

  const latestIssue = getLatestIssueNumber()
  const title = getIssueTitle(latestIssue)
  const link = `/docs/issue-${latestIssue}`
  
  console.log(`\n📝 更新 index.md...`)
  console.log(`最新一期: ${latestIssue}`)
  console.log(`标题: ${title}`)
  console.log(`链接: ${link}`)

  let content = fs.readFileSync(indexPath, 'utf-8')
  let updated = false

  // 1. 更新 actions 中的链接
  const actionLinkRegex = /(\s+text: 阅读最新一期\s+link: )\/docs\/issue-\d+/
  if (actionLinkRegex.test(content)) {
    content = content.replace(actionLinkRegex, `$1${link}`)
    console.log('✅ 已更新首页按钮链接')
    updated = true
  }

  // 2. 更新"最新期刊"部分的链接和标题
  const latestIssueRegex = /查看 \[第 \d+ 期：[^\]]+\]\(\/docs\/issue-\d+\)/
  if (latestIssueRegex.test(content)) {
    content = content.replace(
      latestIssueRegex,
      `查看 [第 ${latestIssue} 期：${title}](${link})`
    )
    console.log('✅ 已更新"最新期刊"部分')
    updated = true
  }

  if (updated) {
    fs.writeFileSync(indexPath, content, 'utf-8')
    console.log('\n✅ index.md 更新成功！\n')
  } else {
    console.log('\n⚠️  没有找到需要更新的内容\n')
  }
}

// 运行脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  updateIndexPage()
}

export { updateIndexPage }

