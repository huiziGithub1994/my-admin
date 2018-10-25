module.exports = {
  '/api/web/category/list': {
    status: 0,
    msg: '',
    'data|1-8': [
      {
        name: '@cstr(2, 5)',
        id: '@inc',
        'children|1-10': [
          {
            name: '@cstr(2, 5)',
            id: '@inc',
            'children|10-20': [
              {
                name: '@cstr(2, 5)',
                id: '@inc'
              }
            ]
          }
        ]
      }
    ]
  },
  '/api/getRecommendCates': {
    messageId: '20180812201336839659100',
    status: 0,
    msg: 'success',
    data: [
      {
        cateId: 11138, // 类目id
        cateName: '淘宝运营', // 类目名称
        parentName: '', // 父节点类目名称
        cateCover: 'fa fa-start', // 类目图标
        level: 6002, // 类目级别 6001 一级类目, 6002 二级类目, 6003 三级类目'
        pid: 259 // 父级id 一级为0
      },
      {
        cateId: 11138,
        cateName: '淘宝运营',
        cateCover: 'fa fa-start'
      }
    ]
  }
}
