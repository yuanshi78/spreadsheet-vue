import { shallowMount, mount } from '@vue/test-utils';
//import layoutData from './layout.js';
import Table from '@/components/Spreadsheet/components/Table/index.vue';
import Row from '@/components/Spreadsheet/components/Row/index.vue';
import Cell from '@/components/Spreadsheet/components/Cell/index.vue';

describe('Table组件', () => {
  const layout = [
    [
      { row: '3:3', col: '7:7', value: "返回地点", width: '100px' },
      { row: '3:3', col: '8:8', value: "1", editable: true, width: '100px' },
      { row: '3:3', col: '3:3', value: "发车时间", width: '100px' },
      { row: '3:3', col: '4:4', value: "2020.06.10 11:50", editable: true, width: '100px' },
    ],
    [
      { row:'1:1', col: '1:12', value: "车辆运行数据", width: '1200px'},
    ],
    [
      { row: '5:5', col: '1:1', value: '行车路线', widht: '100px' },
      { row: '5:5', col: '6:12', value: '4445', editable: true, width: '1100px' },
    ],
    [
      { row: '4:4', col: '1:1', value: "主车号", width: '100px'},
      { row: '4:4', col: '2:2', value: "晋AA8888", editable: true, width: '200px' },        
      { row: '4:5', col: '3:5', value: "总里程", width: '100px' },
      { row: '4:4', col: '6:12', value: "9177.0", editable: true, width: '100px' },
    ],
  ];
  const resultLayout = [
    [
      { row:'1:1', col: '1:12', value: "车辆运行数据", width: '1200px'},
    ],
    [
      { row: '2:2', col: '1:1', selected: false }, 
      { row: '2:2', col: '2:2', selected: false },
      { row: '2:2', col: '3:3', selected: false },
      { row: '2:2', col: '4:4', selected: false },
      { row: '2:2', col: '5:5', selected: false },
      { row: '2:2', col: '6:6', selected: false },
      { row: '2:2', col: '7:7', selected: false },
      { row: '2:2', col: '8:8', selected: false },
      { row: '2:2', col: '9:9', selected: false },
      { row: '2:2', col: '10:10', selected: false },
      { row: '2:2', col: '11:11', selected: false },
      { row: '2:2', col: '12:12', selected: false },
    ],
    [
      { row: '3:3', col: '1:1', selected: false }, 
      { row: '3:3', col: '2:2', selected: false },
      { row: '3:3', col: '3:3', value: "发车时间", width: '100px' },
      { row: '3:3', col: '4:4', value: "2020.06.10 11:50", editable: true, width: '100px' },
      { row: '3:3', col: '5:5', selected: false },
      { row: '3:3', col: '6:6', selected: false },
      { row: '3:3', col: '7:7', value: "返回地点", width: '100px' },
      { row: '3:3', col: '8:8', value: "1", editable: true, width: '100px' },
      { row: '3:3', col: '9:9', selected: false },
      { row: '3:3', col: '10:10', selected: false },
      { row: '3:3', col: '11:11', selected: false },
      { row: '3:3', col: '12:12', selected: false },
    ],
    [
      { row: '4:4', col: '1:1', value: "主车号", width: '100px'},
      { row: '4:4', col: '2:2', value: "晋AA8888", editable: true, width: '200px' },        
      { row: '4:5', col: '3:5', value: "总里程", width: '100px' },
      { row: '4:4', col: '6:12', value: "9177.0", editable: true, width: '100px' },
    ],
    [
      { row: '5:5', col: '1:1', value: '行车路线', widht: '100px' },
      { row: '5:5', col: '3:5', hidden: true},
      { row: '5:5', col: '6:12', value: '4445', editable: true, width: '1100px' },
    ]
  ];
  const wrapper = shallowMount(Table, {
    propsData: {
      layout
    }
  });
  const vm = wrapper.vm;

  it('预备布局数据：排序布局数据，补充缺少的行', () => {
    expect(vm.resultingLayout).toEqual(resultLayout);
  });

  it('算行数属性', () => {
    expect(vm.rowsQnty).toBe(5);
  });

  it('布局数据数二维组里的数组的数量', () => {
    expect(vm.resultingLayout).toHaveLength(5);
  })

  it('算列表有几列', () => {
    expect(vm.colsQnty).toBe(12);
  });
});

describe('Row组件', () => {  
});

describe('Cell组件', () => {
  const cell = {
    row: '3:3', 
    col: '4:4', 
    value: "2020.06.10 11:50", 
    editable: true,
    width: '100px',
  };

  const wrapper = shallowMount(Cell, {
    propsData: {
      cell,
      selected: true,
      rowIdx: 3,
      cellIdx: 4,
    }
  });

  it('显示可编辑的单元格', () => {
    expect(wrapper.find('input').exists()).toBe(true);
  })
});
