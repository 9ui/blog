module.exports = {
  types: [
    { value: '✨ add', name: '新增:     新增文章' },
    { value: '📝 edit', name: '编辑:     编辑文章' },
    { value: '📝 log', name: '日志:     更新日志' },
    { value: '🔥 delete', name: '删除:      删除文章' },
    { value: '🔧config', name: '配置:    更改配置文件' },
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
