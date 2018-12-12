module.exports = {
  '/base/qryTeachGroupsTree': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: [
      {
        label: '政治2选考'
      },
      {
        label: '化学1选考',
        children: [
          {
            label: '二级 1-1',
            children: [
              {
                label: '三级 1-1-1'
              }
            ]
          }
        ]
      },
      {
        label: '化学2选考'
      }
    ]
  }
}
