/**
* @Author: 元实
* @Date:   2020-06-11
* @Description: Spreadsheet组件的表格组件
*/

<template>
    <table class="spread-table" @keydown="moveSelection">
        <tbody>
            <Row v-for="(row, idx) in rowsSet"
                 :row="row" :key="row.row"
                 :rowIdx="idx"
                 :maxcols="maxCols"
                 @change-value="updateValue"
                 @set-selected="handleCellSelected"
            >
            </Row>
        </tbody>
    </table>
</template>

<script>
    import Row from '../Row';
    import { parseRange } from '../utils.js';


    export default {
        components: {
            Row
        },

        props: [ 'layout', 'data' ],

        data() {
            return {
                extendedLayout: [], //布局数据，加上些处理布局的过程需要的属性
                rowsSet: [], //fff
                maxCols: 0, //最大的行数
                //单元格座位
                cellPosition : {
                    row: -1,  //行
                    col: -1   //列
                }
            };
        },

        mounted() {
            //this.findSpannedCells();
            this.processLayoutCells();
            this.sortDataset();
            this.buildTableDataStructure();
            window.addEventListener('keydown', evt => this.moveSelection(evt))
        },

        methods: {
            /**
             * 处理列表单元格
             */
            processLayoutCells() {
                this.layout.forEach(cell => {
                    this.setAdditionalProperties(cell);
                    this.splitSpannedCells(cell);
                });
            },

            /**
             *
             */
            setAdditionalProperties(cell) {

            },

            /**
             * 找到
             */
            findSpannedCells() {
                this.dataset.find(cell => {
                    if (/:/.test(cell.row)) {
                        this.splitSpannedCells(cell);
                    }
                })
            },

            /**
             * 把占几列或几行的单元格分解
             */
            splitSpannedCells(cell) {
                const startRow = Number(parseRange(cell.row)[0]);
                const endRow = Number(parseRange(cell.row)[1]);

                for (let i = startRow; i <= endRow; i++) {
                    let newCell = {
                        hidden: true,
                        row: `${i}`,
                        col: cell.col
                    };

                    this.dataset.push(newCell);
                }
            },

            /**
             * 排序列表数据
             */
            sortDataset() {
                this.dataset.sort((cell1, cell2) => {
                    if (cell1.row > cell2.row) {
                        return 1;
                    } else {
                        if (cell1.row === cell2.row) {
                            if (cell1.col > cell2.col) {
                                return 1;
                            }
                             else {
                                 return -1;
                            }
                        } else {
                            return -1;
                        }
                    }
                });
            },


            /**
             * 把一维数组变成二维数组局
             */
            buildTableDataStructure() {
                let rows = [];
                let currRow = [];
                let prevCell = { row: '1', col: '0' };
                let tableCell = {};

                this.dataset.forEach(cell => {
                    tableCell = this.setCellProps(cell);
                    this.calcMaxColNum(tableCell);

                    const rowsDiff = this.notInSameRow(prevCell, tableCell);

                    if (rowsDiff) {
                        rows = this.insertRow(rows, currRow, rowsDiff);
                        currRow = [];
                    }
                    currRow.push(tableCell);
                    prevCell = tableCell;
                });
                rows.push(currRow);

                this.rowsSet = rows;
            },

            /**
             * 设置单元格的属性
             */
            setCellProps(cell) {
                let colRowSpan = {};

                if (cell.col && cell.row) {
                    colRowSpan = this.setColAndRowSpan(cell);
                }

                if (!cell.selected) {
                    cell.selected = false;
                }

                return Object.assign({}, cell, colRowSpan);
            },


            /**
             * 设置colspan和rowspan
             * @param {Object} colRow 包括行号和列号的对象
             * @returns {Object} 包括colSpan和rowSpan的对象
             */
            setColAndRowSpan(cell) {
                const rows = cell.row.split(':');
                const cols = cell.col.split(':');
                let spans = {
                    colSpan: 1,
                    rowSpan: 1
                };

                if (cols.length === 2) {
                    spans.colSpan = Number(cols[1]) - Number(cols[0]) + 1;
                }

                if (rows.length === 2) {
                    spans.rowSpan = Number(rows[1]) - Number(rows[0]) + 1;
                }

                return spans;
            },

            /**
             * 计算列表多少列
             * @param {Object} tableCell 单元格
             */
            calcMaxColNum(tableCell) {
                const parsedColsNo = parseRange(tableCell.col);
                const colNo = parsedColsNo[1] ? Number(parsedColsNo[1]) : Number(parsedColsNo[0]);

                if (colNo > this.maxCols) {
                    this.maxCols = colNo;
                }
            },

            /**
             * 是否同一行的单元格
             * @param {Object} prevCell 上个单元格
             * @param {Object} currCell 当前的单元格
             * @returns {number} 两个单元格行的差别
             */
            notInSameRow(prevCell, currCell) {
                const prevCellRowNo = Number(parseRange(prevCell.row)[0]);
                const currCellRowNo = Number(parseRange(currCell.row)[0]);

                return currCellRowNo - prevCellRowNo;
            },

            /**
             * 插入数据行
             * @param {Array} rows 表格行的数组
             * @param {}
             */
            insertRow(rows, currRow, rowsDiff) {
                let rowsCopy = rows.slice();

                if (rowsDiff > 1) {
                    rowsCopy = this.insertEmptyRows(rowsDiff, rowsCopy);
                }

                rowsCopy.push(currRow);

                return rowsCopy;
            },

            /**
             * 加上空行
             * @param {number} rowsDiff 缺几行
             * @param {Array} rows 列表数据
             * @returns {*} 全整的列表
             */
            insertEmptyRows(rowsDiff, rows) {
                const rowsCopy = rows.slice();

                for (let i = 0; i < rowsDiff; i++) {
                    rowsCopy.push([]);
                }

                return rowsCopy;
            },

            /**
             * 修改值的时候发出事件
             * @param {Object} cell 修改的单元格
             */
            updateValue(cell) {
                this.$emit('change-value', cell);
            },

            /**
             * 处理set-edit事件
             * @param {Object} cellPosition 单元格的座位(row行，col列)
             */
            handleCellSelected(cellPosition) {
                const position = this.cellPosition;

                if (position.row !== -1 && position.col !== -1) {
                    this.rowsSet[position.row][position.col].selected = false;
                }
                position.row = cellPosition.rowIdx;
                position.col = cellPosition.colIdx;
                this.rowsSet[position.row][position.col].selected = true;
            },

            /**
             * 移动选择框
             * @param {Object} evt 事件对象
             */
            moveSelection(evt) {
                switch (evt.keyCode) {
                    case 37: this.moveSelectionInRow(1); break;
                    case 39: this.moveSelectionInRow(2); break;
                    case 38: this.moveSelectionInColumn(1); break;
                    case 40: this.moveSelectionInColumn(2); break;
                }
            },

            /**
             * 横着移动选择框
             * @param {number} direction 1 - 往右，2 - 往左
             */
            moveSelectionInRow(direction) {
                const position = this.cellPosition;

                this.rowsSet[position.row][position.col].selected = false;
                position.col = direction === 1 ? this.findNearestEditableCellLeft() :
                    this.findNearestEditableCellRight();
                this.rowsSet[position.row][position.col].selected = true;
            },

            /**
             * 搜索
             * @return {number}
             */
            findNearestEditableCellLeft() {
                const position = this.cellPosition;
                const currCol = position.col;
                const row = this.rowsSet[position.row];

                for (let i = currCol - 1; i >= 0; i--) {
                    if (row[i].editable) {
                        return i;
                    }

                    if (!i) {
                        i = row.length;
                    }
                }

                return position.row;
            },

            findNearestEditableCellRight() {
                const position = this.cellPosition;
                const currCol = position.col;
                const row = this.rowsSet[position.row];
                const length = row.length;

                for (let i = currCol + 1; i < length; i++) {
                    if (row[i].editable) {
                        return i;
                    }
                }

                return position.row;
            },

            moveSelectionInColumn(direction) {
                const position = this.cellPosition;

                this.rowsSet[position.row - 1][position.col - 1].selected = false;
                position.row = direction === 1 ? this.findNearestEditableCellUp() :
                    this.findNearestEditableCellDown();
                console.log(position.row, position.col, this.rowsSet[position.row - 1]);
                this.rowsSet[position.row - 1][position.col - 1].selected = true;
            },

            findNearestEditableCellUp() {
                const position = this.cellPosition;
                const currRow = position.row;
                const col = position.col;
                const rows = this.rowsSet;

                for (let i = currRow - 2; i >= 0; i--) {
                    console.log('i', i, rows[i], col);
                    if (rows[i][col - 1].editable) {
                        return i + 1;
                    }

                    if (!i) {
                        console.log(rows.length);
                        i = rows.length - 1;
                    }
                }

                return position.col;
            },

            findNearestEditableCellDown() {
                const position = this.cellPosition;
                const currCol = position.col;
                const row = this.rowsSet[position.row - 1];
                const length = row.length;

                for (let i = currCol; i < length; i++) {
                    if (row[i].editable) {
                        return i + 1;
                    }
                }

                return position.row;
            },

        }
    }
</script>

<style lang="scss" scoped>
    .spread-table {
        /*width: 100%;*/
        border-collapse: collapse;
        table-layout: fixed;
    }
</style>