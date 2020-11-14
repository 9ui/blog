module.exports = {
  types: [
    { value: '✨ new', name: 'new:     新增文档' },
    { value: '📝 edit', name: 'docs:     编辑文章' },
    { value: '🔥 del', name: 'del:      删除文章' },
    { value: '🔧chore', name: 'chore:    更改配置文件' },
  ],
  scopes: [],
  messages: {
    type: '选择更改类型:\n',
    scope: '更改的范围:\n',
    subject: '简短描述:\n',
    body: '详细描述. 使用"|"换行:\n',
    breaking: 'Breaking Changes列表:\n',
    footer: '关闭的issues列表. E.g.: #31, #34:\n',
    confirmCommit: '确认提交?',
  },
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
};
