export const Tools = [
  {
    group: '基本形状',
    id: '1',
    children: [
      {
        name: 'text',
        icon: 'icon-text',
        data: {
          text: '时光绘图',
          rect: {
            width: 160,
            height: 30,
          },
          name: 'text',
        },
      },
      {
        name: '正方形',
        icon: 'icon-rect',
        data: {
          text: '正方形',
          rect: {
            width: 100,
            height: 100,
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          name: 'square',
        },
      },
      // {
      //   name: "jichuang",
      //   icon: "icon-jichuang",
      //   data: {
      //     text: "",
      //     rect: {
      //       width: 100,
      //       height: 100,
      //     },
      //     name: "cube",
      //     // icon: "\ue609",
      //     iconFamily: "iconfont",
      //     iconColor: "#2f54eb",
      //     is3D: true,
      //     z: 10,
      //     zRotate: 15,
      //   },
      // },
      {
        name: 'rectangle',
        icon: 'icon-rectangle',
        data: {
          text: '圆角矩形',
          rect: {
            width: 200,
            height: 50,
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          borderRadius: 0.1,
          name: 'rectangle',
        },
      },
      {
        name: 'circle',
        icon: 'icon-circle',
        data: {
          text: '圆',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'circle',
          textMaxLine: 1,
        },
      },
      {
        name: 'triangle',
        icon: 'icon-triangle',
        data: {
          text: '三角形',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'triangle',
        },
      },
      {
        name: 'diamond',
        icon: 'icon-diamond',
        data: {
          text: '菱形',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'diamond',
        },
      },
      {
        name: 'pentagon',
        icon: 'icon-pentagon',
        data: {
          text: '五边形',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'pentagon',
        },
      },
      {
        name: 'hexagon',
        icon: 'icon-hexagon',
        data: {
          text: '六边形',
          rect: {
            width: 100,
            height: 100,
          },
          paddingTop: 10,
          paddingBottom: 10,
          name: 'hexagon',
        },
      },
      {
        name: 'pentagram',
        icon: 'icon-pentagram',
        data: {
          text: '五角星',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'pentagram',
        },
      },
      {
        name: 'leftArrow',
        icon: 'icon-arrow-left',
        data: {
          text: '左箭头',
          rect: {
            width: 200,
            height: 100,
          },
          name: 'leftArrow',
        },
      },
      {
        name: 'rightArrow',
        icon: 'icon-arrow-right',
        data: {
          text: '右箭头',
          rect: {
            width: 200,
            height: 100,
          },
          name: 'rightArrow',
        },
      },
      {
        name: 'twowayArrow',
        icon: 'icon-twoway-arrow',
        data: {
          text: '双向箭头',
          rect: {
            width: 200,
            height: 100,
          },
          name: 'twowayArrow',
        },
      },
      {
        name: 'line',
        icon: 'icon-line',
        data: {
          text: '直线',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'line',
        },
      },
      {
        name: 'cloud',
        icon: 'icon-cloud',
        data: {
          text: '云',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'cloud',
        },
      },
      {
        name: 'message',
        icon: 'icon-msg',
        data: {
          text: '消息框',
          rect: {
            width: 100,
            height: 100,
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          name: 'message',
        },
      },
      {
        name: 'file',
        icon: 'icon-file',
        data: {
          text: '文档',
          rect: {
            width: 80,
            height: 100,
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          name: 'file',
        },
      },

      {
        name: 'image',
        icon: 'icon-image',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'image',
          image: require('./agv.jpg'),
        },
      },
      // {
      //   name: "jichuang",
      //   icon: "icon-jichuang",
      //   data: {
      //     rect: {
      //       width: 50,
      //       height: 70,
      //     },
      //     // is3D: true,
      //     z: 10,
      //     // zRotate: 15,
      //     // fillStyle: '#ddd',
      //     name: "icon-jichuang",
      //     // icon: '\ue63c',
      //     iconFamily: "iconfont",
      //     iconColor: "#777",
      //     iconSize: 30,
      //   },
      // },
      {
        name: 'people',
        icon: 'icon-people',
        data: {
          rect: {
            width: 70,
            height: 100,
          },
          name: 'people',
        },
      },
      {
        name: '图标组件',
        icon: 'icon-pc',
        data: {
          rect: {
            width: 100,
            height: 100,
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          // strokeStyle: 'transparent',
          name: 'div',
          icon: String.fromCharCode(59025),
          iconFamily: 'Topology',
          iconColor: '#000000',
          strokeStyle: 'rgba(255, 255, 255, 0)',
        },
      } /* {
        name: '火车',
        icon: 'icon-huoche',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'rectangle',
          icon: '\ue669',
          iconFamily: 'iconfont',
          
        },
      },  {
        name: '西装',
        icon: 'icon-xizhuang',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'square',
          icon: '\ue608',
          iconFamily: 'iconfont',
         
        },
      },  */,
      /* {
        name: '视频/网页',
        icon: 'icon-pc',
        data: {
          text: '视频/网页',
          rect: {
            width: 200,
            height: 200,
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          // strokeStyle: 'transparent',
          name: 'div',
        },
      }, */
    ],
  },
  {
    group: '流程图',
    id: '2',
    children: [
      {
        name: '开始/结束',
        icon: 'icon-flow-start',
        data: {
          text: '开始',
          rect: {
            width: 120,
            height: 40,
          },
          borderRadius: 0.5,
          name: 'rectangle',
        },
      },
      {
        name: '流程',
        icon: 'icon-rectangle',
        data: {
          text: '流程',
          rect: {
            width: 120,
            height: 40,
          },
          name: 'rectangle',
        },
      },
      {
        name: '判定',
        icon: 'icon-diamond',
        data: {
          text: '判定',
          rect: {
            width: 120,
            height: 60,
          },
          name: 'diamond',
        },
      },
      {
        name: '数据',
        icon: 'icon-flow-data',
        data: {
          text: '数据',
          rect: {
            width: 120,
            height: 50,
          },
          name: 'flowData',
        },
      },
      {
        name: '准备',
        icon: 'icon-flow-ready',
        data: {
          text: '准备',
          rect: {
            width: 120,
            height: 50,
          },
          name: 'hexagon',
        },
      },
      {
        name: '子流程',
        icon: 'icon-flow-subprocess',
        data: {
          text: '子流程',
          rect: {
            width: 120,
            height: 50,
          },
          name: 'flowSubprocess',
        },
      },
      {
        name: '数据库',
        icon: 'icon-db',
        data: {
          text: '数据库',
          rect: {
            width: 80,
            height: 120,
          },
          name: 'flowDb',
        },
      },
      {
        name: '文档',
        icon: 'icon-flow-document',
        data: {
          text: '文档',
          rect: {
            width: 120,
            height: 100,
          },
          name: 'flowDocument',
        },
      },
      {
        name: '内部存储',
        icon: 'icon-internal-storage',
        data: {
          text: '内部存储',
          rect: {
            width: 120,
            height: 80,
          },
          name: 'flowInternalStorage',
        },
      },
      {
        name: '外部存储',
        icon: 'icon-extern-storage',
        data: {
          text: '外部存储',
          rect: {
            width: 120,
            height: 80,
          },
          name: 'flowExternStorage',
        },
      },
      {
        name: '队列',
        icon: 'icon-flow-queue',
        data: {
          text: '队列',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'flowQueue',
        },
      },
      {
        name: '手动输入',
        icon: 'icon-flow-manually',
        data: {
          text: '手动输入',
          rect: {
            width: 120,
            height: 80,
          },
          name: 'flowManually',
        },
      },
      {
        name: '展示',
        icon: 'icon-flow-display',
        data: {
          text: '展示',
          rect: {
            width: 120,
            height: 80,
          },
          name: 'flowDisplay',
        },
      },
      {
        name: '并行模式',
        icon: 'icon-flow-parallel',
        data: {
          text: '并行模式',
          rect: {
            width: 120,
            height: 50,
          },
          name: 'flowParallel',
        },
      },
      {
        name: '注释',
        icon: 'icon-flow-comment',
        data: {
          text: '注释',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'flowComment',
        },
      },
    ],
  },
  {
    group: '活动图',
    id: '3',
    children: [
      {
        name: '开始',
        icon: 'icon-inital',
        data: {
          text: '',
          rect: {
            width: 30,
            height: 30,
          },
          name: 'circle',
          fillStyle: '#555',
          strokeStyle: 'transparent',
        },
      },
      {
        name: '结束',
        icon: 'icon-final',
        data: {
          text: '',
          rect: {
            width: 30,
            height: 30,
          },
          name: 'activityFinal',
        },
      },
      {
        name: '活动',
        icon: 'icon-action',
        data: {
          text: '活动',
          rect: {
            width: 120,
            height: 50,
          },
          borderRadius: 0.25,
          name: 'rectangle',
        },
      },
      {
        name: '决策/合并',
        icon: 'icon-diamond',
        data: {
          text: '决策',
          rect: {
            width: 120,
            height: 50,
          },
          name: 'diamond',
        },
      },
      {
        name: '垂直泳道',
        icon: 'icon-swimlane-v',
        data: {
          text: '垂直泳道',
          rect: {
            width: 200,
            height: 500,
          },
          name: 'swimlaneV',
        },
      },
      {
        name: '水平泳道',
        icon: 'icon-swimlane-h',
        data: {
          text: '水平泳道',
          rect: {
            width: 500,
            height: 200,
          },
          name: 'swimlaneH',
        },
      },
      {
        name: '垂直分岔/汇合',
        icon: 'icon-fork-v',
        data: {
          text: '',
          rect: {
            width: 10,
            height: 150,
          },
          name: 'forkV',
          fillStyle: '#555',
          strokeStyle: 'transparent',
        },
      },
      {
        name: '水平分岔/汇合',
        icon: 'icon-fork',
        data: {
          text: '',
          rect: {
            width: 150,
            height: 10,
          },
          name: 'forkH',
          fillStyle: '#555',
          strokeStyle: 'transparent',
        },
      },
    ],
  },
  {
    group: '时序图和类图',
    id: '4',
    children: [
      {
        name: '生命线',
        icon: 'icon-lifeline',
        data: {
          text: '生命线',
          rect: {
            width: 150,
            height: 400,
          },
          name: 'lifeline',
        },
      },
      {
        name: '激活',
        icon: 'icon-focus',
        data: {
          text: '',
          rect: {
            width: 12,
            height: 200,
          },
          name: 'sequenceFocus',
        },
      },
      {
        name: '简单类',
        icon: 'icon-simple-class',
        data: {
          text: 'Topolgoy',
          rect: {
            width: 270,
            height: 200,
          },
          paddingTop: 40,
          font: {
            fontFamily: 'Arial',
            color: '#222',
            fontWeight: 'bold',
          },
          fillStyle: 'white',
          strokeStyle: 'black',
          name: 'simpleClass',
          children: [
            {
              text: '- name: string\n+ setName(name: string): void',
              name: 'text',
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 10,
              paddingBottom: 10,
              rectInParent: {
                x: 0,
                y: 0,
                width: '100%',
                height: '100%',
                rotate: 0,
              },
              font: {
                fontFamily: 'Arial',
                color: '#222',
                textAlign: 'left',
                textBaseline: 'top',
              },
            },
          ],
        },
      },
      {
        name: '类',
        icon: 'icon-class',
        data: {
          text: 'Topolgoy',
          rect: {
            width: 270,
            height: 200,
          },
          paddingTop: 40,
          font: {
            fontFamily: 'Arial',
            color: '#222',
            fontWeight: 'bold',
          },
          fillStyle: 'white',
          strokeStyle: 'black',
          name: 'interfaceClass',
          children: [
            {
              text: '- name: string',
              name: 'text',
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 10,
              paddingBottom: 10,
              rectInParent: {
                x: 0,
                y: 0,
                width: '100%',
                height: '50%',
                rotate: 0,
              },
              font: {
                fontFamily: 'Arial',
                color: '#222',
                textAlign: 'left',
                textBaseline: 'top',
              },
            },
            {
              text: '+ setName(name: string): void',
              name: 'text',
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 10,
              paddingBottom: 10,
              rectInParent: {
                x: 0,
                y: '50%',
                width: '100%',
                height: '50%',
                rotate: 0,
              },
              font: {
                fontFamily: 'Arial',
                color: '#222',
                textAlign: 'left',
                textBaseline: 'top',
              },
            },
          ],
        },
      },
    ],
  },
  {
    group: '自定义canvas组件',
    id: '5',
    children: [
      {
        name: '测试自定义组件',
        icon: 'icon-jiansudai',
        data: {
          text: '自定义组件',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'myShape',
          /* icon: '\ue662',
          iconFamily: 'iconfont', */
          iconColor: '#2f54eb',
          // rotate: 60,
        },
      },
    ],
  },
  /* {
    group: '物流调度',
    id: '5',
    children: [
      {
        name: '减速带',
        icon: 'icon-jiansudai',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'rectangle',
          icon: '\ue662',
          iconFamily: 'iconfont',
          iconColor: '#2f54eb',
          rotate: 60,
        },
      },
      {
        name: 'fangxiangbiao',
        icon: 'icon-fangxiangbiao',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'rectangle',
          icon: '\ue60b',
          iconFamily: 'iconfont',
          iconColor: '#2f54eb',
          is3D: true,
          z: 10,
          zRotate: 15,
        },
      },
      {
        name: 'chongdianzhuang',
        icon: 'icon-chongdianzhuang',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'rectangle',
          icon: '\ue645',
          iconFamily: 'iconfont',
          iconColor: '#2f54eb',
          is3D: true,
          z: 10,
          zRotate: 15,
        },
      },
      {
        name: 'jichuang',
        icon: 'icon-jichuang',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'rectangle',
          icon: '\ue609',
          iconFamily: 'iconfont',
          iconColor: '#2f54eb',
          is3D: true,
          z: 10,
          zRotate: 15,
        },
      },
      {
        name: 'tubiaozhizuomoban-',
        icon: 'icon-tubiaozhizuomoban-',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'rectangle',
          icon: '\ue6e0',
          iconFamily: 'iconfont',
          iconColor: '#2f54eb',
          is3D: true,
          z: 10,
          zRotate: 15,
        },
      },
      {
        name: 'icon_xiaoche',
        icon: 'icon-icon_xiaoche',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'rectangle',
          icon: '\ue678',
          iconFamily: 'iconfont',
          iconColor: '#2f54eb',
        },
      },
      {
        name: 'icon-two-agv-white-green-yellow-red-2',
        icon: 'icon-icon-two-agv-white-green-yellow-red-2',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'rectangle',
          icon: '\ue64e',
          iconFamily: 'iconfont',
          iconColor: '#2f54eb',
        },
      },
      {
        name: 'site',
        icon: 'icon-site',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'rectangle',
          icon: '\ue610',
          iconFamily: 'iconfont',
          iconColor: '#2f54eb',
        },
      },
    ],
  }, */
];

export const IconList = [
  { class: 'topology-upload', unicode: '59295' },
  { class: 'topology-download', unicode: '59292' },
  { class: 'topology-analytics', unicode: '59045' },
  { class: 'topology-stop1', unicode: '58914' },
  { class: 'topology-stop', unicode: '58905' },
  { class: 'topology-kefu', unicode: '58968' },
  { class: 'topology-exit1', unicode: '59051' },
  { class: 'topology-exit', unicode: '58945' },
  { class: 'topology-enter', unicode: '58941' },
  { class: 'topology-share', unicode: '58912' },
  { class: 'topology-message', unicode: '59177' },
  { class: 'topology-weibo', unicode: '58942' },
  { class: 'topology-pay3', unicode: '59025' },
  { class: 'topology-pay6', unicode: '59023' },
  { class: 'topology-wechat', unicode: '58950' },
  { class: 'topology-app', unicode: '58904' },
  { class: 'topology-shoppingcart', unicode: '58926' },
  { class: 'topology-people4geren', unicode: '59018' },
  { class: 'topology-people2geren', unicode: '58995' },
  { class: 'topology-people', unicode: '58961' },
  { class: 'topology-jiankong', unicode: '58910' },
  { class: 'topology-cpu', unicode: '58911' },
  { class: 'topology-iot2', unicode: '58903' },
  { class: 'topology-iot1', unicode: '58897' },
  { class: 'topology-iot', unicode: '58919' },
  { class: 'topology-success', unicode: '59059' },
  { class: 'topology-error', unicode: '59057' },
  { class: 'topology-warning', unicode: '59049' },
  { class: 'topology-list', unicode: '58896' },
  { class: 'topology-folder', unicode: '59150' },
  { class: 'topology-document', unicode: '59143' },
  { class: 'topology-kaiguan', unicode: '59007' },
  { class: 'topology-search', unicode: '58895' },
  { class: 'topology-streamSQL', unicode: '59091' },
  { class: 'topology-record', unicode: '58893' },
  { class: 'topology-streaming', unicode: '59641' },
  { class: 'topology-data-stream', unicode: '60371' },
  { class: 'topology-sync', unicode: '58967' },
  { class: 'topology-settings', unicode: '58964' },
  { class: 'topology-dashboard', unicode: '58963' },
  { class: 'topology-umbrella', unicode: '58955' },
  { class: 'topology-link', unicode: '58938' },
  { class: 'topology-sound', unicode: '58929' },
  { class: 'topology-map', unicode: '58909' },
  { class: 'topology-house', unicode: '58908' },
  { class: 'topology-185055paintingpalletstreamline', unicode: '58907' },
  { class: 'topology-browser', unicode: '58891' },
  { class: 'topology-remote-control', unicode: '58887' },
  { class: 'topology-locked', unicode: '59281' },
  { class: 'topology-unlocked', unicode: '59515' },
  { class: 'topology-api2', unicode: '59229' },
  { class: 'topology-api1', unicode: '58883' },
  { class: 'topology-apiassembly', unicode: '59005' },
  { class: 'topology-email', unicode: '59004' },
  { class: 'topology-api', unicode: '58902' },
  { class: 'topology-ks', unicode: '59013' },
  { class: 'topology-golang', unicode: '58901' },
  { class: 'topology-docker', unicode: '59017' },
  { class: 'topology-python', unicode: '58894' },
  { class: 'topology-html', unicode: '58886' },
  { class: 'topology-safe', unicode: '59175' },
  { class: 'topology-java', unicode: '59206' },
  { class: 'topology-nodejs', unicode: '59785' },
  { class: 'topology-cloud-code', unicode: '59024' },
  { class: 'topology-rabbitmq', unicode: '58906' },
  { class: 'topology-fuwuqi', unicode: '58900' },
  { class: 'topology-kafka', unicode: '58884' },
  { class: 'topology-rocketmq', unicode: '59050' },
  { class: 'topology-cassandra', unicode: '58913' },
  { class: 'topology-pgsql', unicode: '59142' },
  { class: 'topology-mysql', unicode: '58962' },
  { class: 'topology-sql', unicode: '59160' },
  { class: 'topology-redis', unicode: '59010' },
  { class: 'topology-hbase', unicode: '59003' },
  { class: 'topology-MongoDB', unicode: '59120' },
  { class: 'topology-data', unicode: '58953' },
  { class: 'topology-data2', unicode: '58892' },
  { class: 'topology-data3', unicode: '58889' },
  { class: 'topology-data1', unicode: '59233' },
  { class: 'topology-db', unicode: '58949' },
  { class: 'topology-parallel', unicode: '59208' },
  { class: 'topology-bub', unicode: '60531' },
  { class: 'topology-zuoji', unicode: '59022' },
  { class: 'topology-earch', unicode: '58888' },
  { class: 'topology-cloud-server', unicode: '58981' },
  { class: 'topology-cloud-firewall', unicode: '58923' },
  { class: 'topology-firewall', unicode: '58928' },
  { class: 'topology-printer', unicode: '59006' },
  { class: 'topology-satelite2', unicode: '60743' },
  { class: 'topology-satelite', unicode: '60744' },
  { class: 'topology-router2', unicode: '58899' },
  { class: 'topology-router', unicode: '58898' },
  { class: 'topology-antenna3', unicode: '59028' },
  { class: 'topology-antenna2', unicode: '59001' },
  { class: 'topology-antenna', unicode: '58882' },
  { class: 'topology-building', unicode: '58881' },
  { class: 'topology-office', unicode: '58885' },
  { class: 'topology-ipad', unicode: '58980' },
  { class: 'topology-wifi', unicode: '58935' },
  { class: 'topology-network', unicode: '58939' },
  { class: 'topology-network1', unicode: '58957' },
  { class: 'topology-home', unicode: '59052' },
  { class: 'topology-cloud', unicode: '58890' },
  { class: 'topology-mobile', unicode: '58940' },
  { class: 'topology-pc', unicode: '58880' },
  { class: 'topology-up-down', unicode: '58915' },
  { class: 'topology-website', unicode: '59151' },
  { class: 'topology-github', unicode: '59645' },
  { class: 'topology-dashboard1', unicode: '59507' },
  { class: 'topology-flow', unicode: '59482' },
  { class: 'topology-camera', unicode: '59274' },
  { class: 'topology-clock', unicode: '59228' },
  // 自定义字体图标: 先在fonticon选图标,然后导入,unicode码前+0x
  { class: 'icon-zcpt-wangzhanguanli', unicode: '0xe6ba' },
  { class: 'icon-zcpt-shujutongji', unicode: '0xe6b7' },
];

export const imgTool = [
  {
    group: '自定义图片组件',
    id: '1',
    children: [
      {
        name: 'logo',
        url: '/icon/logo.svg',
        icon: 'icon-image',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100,
          },
          name: 'image',
          image: '/icon/logo.svg',
        },
      },
      {
        name: 'mindcute',
        url: '/icon/mindcute2.svg',
        icon: 'icon-image',
        data: {
          text: '',
          rect: {
            width: 300,
            height: 100,
          },
          name: 'image',
          image: '/icon/mindcute2.svg',
        },
      },
    ],
  },
];
