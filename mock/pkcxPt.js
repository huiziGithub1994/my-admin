module.exports = {
  // 教学任务详情
  '/base/qryTeachingTask': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: {
      arrangeId: '001',
      schoolYear: 2018,
      termCode: '1',
      arrangeName: '高中部常规排课',
      tableHeader: ['语文', '数学', '外语'],
      tableData: [
        {
          c0: '高中',
          c1: '高一',
          c2: '高一1班',
          c3: '宁文瑞',
          c4: '3+1',
          c5: '刘敏',
          c6: '5',
          c7: '张毅',
          c8: '5'
        },
        {
          c0: '高中',
          c1: '高一',
          c2: '高一1班',
          c3: '宁文瑞',
          c4: '3+1',
          c5: '刘敏',
          c6: '5',
          c7: '张毅',
          c8: '5'
        }
      ]
    }
  },
  'post /base/uploadTeachingTask': {
    SUCCESS: true,
    MSG: '成功获取数据',
    DATA: {
      arrangeId: '001',
      schoolYear: 2018,
      termCode: '1',
      arrangeName: '高中部常规排课',
      tableHeader: ['语文', '数学', '外语', '物理'],
      'tableData|20': [
        {
          c0: '高中',
          c1: '高一',
          c2: '高一1班',
          c3: '@cstr(3)',
          c4: Math.floor(Math.random() * 10),
          c5: '@cstr(3)',
          c6: Math.floor(Math.random() * 10),
          c7: '@cstr(3)',
          c8: Math.floor(Math.random() * 10),
          c9: '@cstr(3)',
          c10: Math.floor(Math.random() * 10)
        }
      ]
    }
  },
  // 班级列表
  '/base/qryClassList': {
    DATA: {
      arrangeId: '001',
      schoolYear: 2018,
      termCode: '1',
      arrangeName: '高中部常规排课',
      tableData: [
        {
          c0: '高中',
          c1: '高一',
          c2: '高一1班',
          c3: '宁文瑞'
        },
        {
          c0: '',
          c1: '',
          c2: '高一2班',
          c3: '张理'
        },
        {
          c0: '',
          c1: '',
          c2: '高一3班',
          c3: '分户'
        },
        {
          c0: '',
          c1: '',
          c2: '高一4班',
          c3: '刘明'
        },
        {
          c0: '',
          c1: '高二',
          c2: '高二1班',
          c3: '彭丽'
        },
        {
          c0: '',
          c1: '',
          c2: '高二1班',
          c3: '黄欧力'
        }
      ]
    }
  }
}
