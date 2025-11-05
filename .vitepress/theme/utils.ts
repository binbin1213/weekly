/**
 * VitePress 主题工具函数
 */
import { getLatestIssueNumber, getIssueTitle } from '../../scripts/get-latest-issue'

/**
 * 获取最新一期的信息
 */
export function getLatestIssueInfo() {
  const issueNumber = getLatestIssueNumber()
  const title = getIssueTitle(issueNumber)
  
  return {
    number: issueNumber,
    title: title,
    link: `/docs/issue-${issueNumber}`,
    fullTitle: `第 ${issueNumber} 期：${title}`
  }
}

export { getLatestIssueNumber, getIssueTitle }

