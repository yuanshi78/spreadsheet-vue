/**
* @Author: 元实
* @Date:   2020-06-11
* @Description: Spreadsheet组件的表格组件
*/

<template>
    <table class="spread-table" @keydown="moveSelection">
        <tbody>
            <Row v-for="(row, idx) in resultingLayout"
                 :row="row" :key="`row${idx}`"
                 :rowIdx="idx"
                 :maxColsQnty="maxColsQnty"
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
                maxRowsQnty: 0, //行数
                maxColsQnty: 0, //列数
                sortedLayout: [], //排序好的列表layout数组
                resultingLayout: [], //缺席的行是用空行补充的

                //单元格座位
                cellPosition : {
                    row: -1,  //行
                    col: -1   //列
                }
            };
        },

        mounted() {
            this.processLayoutData();
            this.getMaxRowsQnty();
            this.setFullRowsLayout();
            window.addEventListener('keydown', evt => this.moveSelection(evt))
        },

        methods: {
            /**
             * 排序列表layout
             */
            processLayoutData() {
                this.sortRows();
                this.sortedLayout = this.layout.slice();
                this.processEachRow();
            },

            /**
             * 排序列表里的行
             */
            sortRows() {
                this.layout.sort((rowOne, rowTwo) => {
                    const rowOneNum = parseRange(rowOne[0].row).start;//Number(rowOne[0].row.match(/^(\d+)/)[1]);
                    const rowTwoNum = parseRange(rowTwo[0].row).start;//Number(rowTwo[0].row.match(/^(\d+)/)[1]);

                    return rowOneNum - rowTwoNum;
                });
            },

            /**
             * 处理每一行的数据
             */
            processEachRow() {
                this.layout.forEach(row => {
                    this.splitSpandRows(row);
                    row.sort((cellOne, cellTwo) => {
                        const colOneNum = parseRange(cellOne.col).start; //Number(cellOne.col.match(/^(\d+)/)[1]);
                        const colTwoNum = parseRange(cellTwo.col).start; //Number(cellTwo.col.match(/^(\d+)/)[1]);

                        return colOneNum - colTwoNum;
                    });
                    this.getMaxColsQnty(row);
                });
            },

            /**
             * 切开占几行的单元格
             */
            splitSpandRows(row) {
                row.forEach(cell => {
                    const parsedRowNum = parseRange(cell.row);
                    const startRow = parsedRowNum.start;
                    const endRow = parsedRowNum.end;

                    if (startRow < endRow) {
                        for (let i = startRow; i < endRow; i++) {
                            this.insertSplittedCellIntoRow(cell, i);
                        }
                    }
                });
            },

            /**
             * 插入切开的单元格
             */
            insertSplittedCellIntoRow(cell, idx) {
                if (!this.sortedLayout[idx]) {
                    this.sortedLayout.splice(idx, 0, []);
                }

                this.sortedLayout[idx].push({
                    row: `${idx + 1}:${idx + 1}`,
                    col: cell.col,
                    hidden: true,
                });
            },

            /**
             * 获取列表的列数
             * @param {Array} row 列表的一行
             */
            getMaxColsQnty(row) {
                const length = row.length;
                const maxColNum = parseRange(row[length - 1].col).end; //Number(row[length - 1].col.match(/(\d+)$/)[1]);

                if (maxColNum > this.maxColsQnty) {
                    this.maxColsQnty = maxColNum;
                }
            },

            /**
             * 获取列表的行数
             */
            getMaxRowsQnty() {
                const length = this.sortedLayout.length;

                this.maxRowsQnty = parseRange(this.sortedLayout[length - 1][0].row).start;//Number(this.layout[length - 1][0].row.match(/^(\d+)/)[1]);
            },

            /**
             * 用空行补充列表
             */
            setFullRowsLayout() {
                const presentRowsQnty = this.sortedLayout.length;
                const maxRowsQntyNum = this.maxRowsQnty;
                
                if (presentRowsQnty < maxRowsQntyNum) {
                    for (let i = 0; i < maxRowsQntyNum; i++) {
                        if (!this.isRowPresent(i + 1)) {
                            this.insertEmptyRow(i);
                        }
                    }
                }
            },

            /**
             * layout数组是不是有这一行
             * @param {number} num 第几行
             * @returns {boolean} true - 有, false - 没有
             */
            isRowPresent(num) {
                return this.sortedLayout.findIndex(row => {
                    const rowNum = parseRange(row[0].row).start; //Number(row[0].row.match(/^(\d+)/)[1]);

                    if (rowNum === num) {
                        return true;
                    }

                    return false;
                }) !== -1;
            },

            /**
             * 插入空行
             * @param {number} idx layout数组里的索引，指需要插入空行的地方
             */
            insertEmptyRow(idx) {
                this.resultingLayout.splice(idx, 0, []);
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