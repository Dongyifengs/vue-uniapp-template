import { describe, expect, it, vi } from 'vitest'
import generateReleaseNotes from '../../.github/scripts/release-notes.cjs'

const commit = (sha, message) => ({ sha, commit: { message } })
const pullRequest = (number, overrides = {}) => ({
  number,
  title: `功能 ${number}`,
  html_url: `https://github.com/owner/project/pull/${number}`,
  merged_at: '2026-10-08T00:00:00Z',
  base: { ref: 'main', repo: { full_name: 'owner/project' } },
  ...overrides,
})

function setup(commits, associated = []) {
  const context = {
    repo: { owner: 'owner', repo: 'project' },
    payload: { before: 'before-sha' },
    sha: 'release-sha',
    serverUrl: 'https://github.com',
    runNumber: 42,
    runId: 123,
  }
  const github = {
    rest: {
      repos: {
        compareCommitsWithBasehead: vi.fn().mockResolvedValue({ data: { commits } }),
        listPullRequestsAssociatedWithCommit: vi.fn(),
        listCommits: vi.fn(),
      },
    },
    paginate: vi.fn().mockResolvedValue(associated),
  }
  return { github, context }
}

describe('Release 更新说明', () => {
  it('直接 push 时包含本次全部提交、下载说明与构建来源', async () => {
    const input = setup([
      commit('123456789', 'feat(pages): 新增页面\n\n实现细节'),
      commit('abcdef123', 'fix(request): 修复超时'),
    ])
    const notes = await generateReleaseNotes(input)

    expect(notes).toContain('feat(pages): 新增页面')
    expect(notes).toContain('fix(request): 修复超时')
    expect(notes).not.toContain('实现细节')
    expect(notes).toContain('没有关联的已合并 PR')
    expect(notes).toContain('h5.zip')
    expect(notes).toContain('mp-weixin.zip')
    expect(notes).toContain('SHA256SUMS.txt')
    expect(notes).toContain('https://github.com/owner/project/actions/runs/123')
    expect(input.github.rest.repos.compareCommitsWithBasehead).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'project',
      basehead: 'before-sha...release-sha',
      per_page: 100,
      page: 1,
    })
  })

  it('合并提交、squash 或 rebase 的关联 PR 去重并保留实际地址', async () => {
    const input = setup(
      [commit('aaa', '提交一'), commit('bbb', '提交二')],
      [
        pullRequest(7),
        pullRequest(8),
        pullRequest(9, { merged_at: null }),
        pullRequest(10, { base: { ref: 'develop', repo: { full_name: 'owner/project' } } }),
        pullRequest(11, { base: { ref: 'main', repo: { full_name: 'other/project' } } }),
      ],
    )
    const notes = await generateReleaseNotes(input)

    expect(notes.match(/\/pull\/7/g)).toHaveLength(1)
    expect(notes).toContain('[#8](https://github.com/owner/project/pull/8)')
    expect(notes).not.toContain('/pull/9')
    expect(notes).not.toContain('/pull/10')
    expect(notes).not.toContain('/pull/11')
    expect(notes).not.toContain('没有关联的已合并 PR')
    expect(input.github.paginate).toHaveBeenCalledTimes(2)
  })

  it('跨页读取一次 push 的全部提交', async () => {
    const input = setup([])
    input.github.rest.repos.compareCommitsWithBasehead
      .mockResolvedValueOnce({
        data: { commits: Array.from({ length: 100 }, (_, i) => commit(`sha-${i}`, `更新 ${i}`)) },
      })
      .mockResolvedValueOnce({ data: { commits: [commit('last-sha', '最后一项更新')] } })

    expect(await generateReleaseNotes(input)).toContain('最后一项更新')
    expect(input.github.rest.repos.compareCommitsWithBasehead).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 2 }),
    )
    expect(input.github.paginate).toHaveBeenCalledTimes(101)
  })

  it('首次 push 的零 SHA 从提交历史生成说明', async () => {
    const input = setup([])
    input.context.payload.before = '0'.repeat(40)
    input.github.paginate.mockImplementation(async (endpoint) =>
      endpoint === input.github.rest.repos.listCommits
        ? [commit('bbb', '第二次更新'), commit('aaa', '初始提交')]
        : [],
    )
    const notes = await generateReleaseNotes(input)

    expect(notes.indexOf('初始提交')).toBeLessThan(notes.indexOf('第二次更新'))
    expect(input.github.rest.repos.compareCommitsWithBasehead).not.toHaveBeenCalled()
  })

  it('转义提交和 PR 标题中的 Markdown', async () => {
    const input = setup(
      [commit('aaa', 'feat: [下载](evil) <script>')],
      [pullRequest(1, { title: '*标题*' })],
    )
    const notes = await generateReleaseNotes(input)

    expect(notes).toContain('\\[下载\\](evil) \\<script\\>')
    expect(notes).toContain('\\*标题\\*')
  })

  it('关联 PR 查询失败时终止发版，避免丢失来源', async () => {
    const input = setup([commit('aaa', '更新')])
    input.github.paginate.mockRejectedValue(new Error('GitHub API unavailable'))

    await expect(generateReleaseNotes(input)).rejects.toThrow('GitHub API unavailable')
  })
})
