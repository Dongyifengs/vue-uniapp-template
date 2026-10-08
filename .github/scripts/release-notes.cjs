// 使用 push 的真实提交范围生成说明，直接提交和不同 PR 合并方式都保留更新内容。
module.exports = async function generateReleaseNotes({ github, context }) {
  const repo = context.repo
  const before = context.payload.before
  const baseUrl = `${context.serverUrl}/${repo.owner}/${repo.repo}`
  const commits = []

  if (/^0+$/.test(before)) {
    // 首次推送没有可比较的父提交，读取该版本的完整历史。
    commits.push(
      ...(
        await github.paginate(github.rest.repos.listCommits, {
          ...repo,
          sha: context.sha,
          per_page: 100,
        })
      ).reverse(),
    )
  } else {
    // 显式分页，避免一次 push 超过 250 个提交时丢失说明。
    for (let page = 1; ; page++) {
      const { data } = await github.rest.repos.compareCommitsWithBasehead({
        ...repo,
        basehead: `${before}...${context.sha}`,
        per_page: 100,
        page,
      })
      commits.push(...data.commits)
      if (data.commits.length < 100) break
    }
  }

  const pullRequests = new Map()
  for (const commit of commits) {
    const associated = await github.paginate(
      github.rest.repos.listPullRequestsAssociatedWithCommit,
      { ...repo, commit_sha: commit.sha, per_page: 100 },
    )
    for (const pr of associated) {
      if (
        pr.merged_at &&
        pr.base.ref === 'main' &&
        pr.base.repo.full_name === `${repo.owner}/${repo.repo}`
      ) {
        pullRequests.set(pr.number, pr)
      }
    }
  }

  // 标题来自提交与 PR，按文本转义，防止它们破坏说明的 Markdown 结构。
  const text = (value) =>
    value
      .split('\n')[0]
      .replace(/[\\`*_[\]<>]/g, '\\$&')
      .replace(/\r/g, '')

  const lines = [
    '## 更新介绍',
    '',
    ...commits.map(
      (commit) =>
        `- ${text(commit.commit.message)} ([${commit.sha.slice(0, 7)}](${baseUrl}/commit/${commit.sha}))`,
    ),
    '',
    '## 关联 PR',
    '',
    ...(pullRequests.size
      ? [...pullRequests.values()].map(
          (pr) => `- ${text(pr.title)}：[#${pr.number}](${pr.html_url})`,
        )
      : ['本次更新通过直接 push 到 main 发布，没有关联的已合并 PR。']),
    '',
    '## 下载与使用',
    '',
    '| 文件 | 使用方式 |',
    '| --- | --- |',
    '| `h5.zip` | 解压后部署到静态站点服务 |',
    '| `mp-weixin.zip` | 解压后将目录导入微信开发者工具 |',
    '| `SHA256SUMS.txt` | 校验两个下载包的 SHA-256 |',
    '',
    '构建包使用仓库的生产环境配置。微信小程序需配置自己的 AppID；平台上传与审核发布由使用者执行。',
    '',
    `提交：[${context.sha}](${baseUrl}/commit/${context.sha})`,
    `构建：[GitHub Actions #${context.runNumber}](${baseUrl}/actions/runs/${context.runId})`,
    '',
  ]

  return lines.join('\n')
}
