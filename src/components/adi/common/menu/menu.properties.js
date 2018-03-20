export default {
  data: [
    {
      name: '菜单1',
      link: 'http://keepwork.com'
    },
    {
      name: '菜单2',
      link: 'http://keepwork.com',
      child: [
        {
          name: '菜单2.1',
          link: 'http://keepwork.com'
        },
        {
          name: '菜单2.2',
          link: 'http://keepwork.com',
          child: [
            {
              name: '菜单2.2.1',
              link: 'http://keepwork.com'
            },
            {
              name: '菜单2.2.2',
              link: 'http://keepwork.com',
              child: [
                {
                  name: '菜单2.2.2.1',
                  link: 'http://keepwork.com'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
