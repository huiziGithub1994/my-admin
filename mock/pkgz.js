module.exports = {
  // 教学分组
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
  },
  // 课时预排 treedata
  '/base/qryTeachHoursTree': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: [
      {
        label: '教学一组 5课时'
      },
      {
        label: '教学二组 5课时',
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
        label: '教学三组 5课时'
      }
    ]
  }
}
