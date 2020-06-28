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
                 :colsQnty="colsQnty"
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
                rowsQnty: 0, //行数
                colsQnty: 0, //列数
                //sortedRowsLayout: [], //排序好的列表layout数组
                prevRowNo: 0, //行的索引
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
            this.getRowsQnty();
            //this.setFullRowsLayout();
            window.addEventListener('keydown', evt => this.moveSelection(evt))
        },

        methods: {
            /**
             * 处理布局数据
             */
            processLayoutData() {
                this.sortRows();
                this.addMissingRows();
                console.log('resulting layout', this.resultingLayout);
                this.processEachRow();
            },

            /**
             * 排序列表里的行
             */
            sortRows() {
                this.layout.sort((rowOne, rowTwo) => {
                    const rowOneNum = parseRange(rowOne[0].row).start;
                    const rowTwoNum = parseRange(rowTwo[0].row).start;

                    return rowOneNum - rowTwoNum;
                });
            },

            /**
             * 补充缺少的行
             */
            addMissingRows() {
                this.layout.forEach((row, idx) => {
                    let curRowNo = parseRange(row[0].row).start;
                    let delta =  curRowNo - this.prevRowNo;

                    console.log('delta', delta, curRowNo);
                    if (delta > 1) {
                        this.insertEmpryRows(delta)
                    }
                    this.prevRowNo = curRowNo;
                    this.resultingLayout.push(row);
                });
            },

            /**
             * 加上空行
             * @param {number}　rowQntyToInsert 
             */
            insertEmpryRows(rowQntyToInsert) {
                for (let i = 0; i < rowQntyToInsert - 1; i++) {
                  this.resultingLayout.push([]);
                }
            },

            /**
             * 处理每一行的数据
             */
            processEachRow() {
                this.resultingLayout.forEach((row, idx) => {
                    this.sortCols(row);
                    this.splitSpandRows(row);
                    if (row.length) {
                        this.getColsQnty(row);
                    }
                });
            },

            /**
             * 排序每一行里的单元格
             * @param {Array} row 行
             */
            sortCols(row) {
                row.sort((cellOne, cellTwo) => {
                    const colOneNum = parseRange(cellOne.col).start; 
                    const colTwoNum = parseRange(cellTwo.col).start;

                    return colOneNum - colTwoNum;
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
                        console.log('spanned row', startRow, endRow);
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
                console.log('idx', idx, this.resultingLayout[idx], this.layout[idx]);
                const newCell = {
                    row: `${idx + 1}:${idx + 1}`,
                    col: cell.col,
                    hidden: true,
                };

                this.resultingLayout[idx].push(newCell);
            },

            /**
             * 获取列表的列数
             * @param {Array} row 列表的一行
             */
            getColsQnty(row) {
                const length = row.length;
                const maxColNum = parseRange(row[length - 1].col).end;

                if (maxColNum > this.colsQnty) {
                    this.colsQnty = maxColNum;
                }
            },

            /**
             * 获取列表的行数
             */
            getRowsQnty() {
                const length = this.resultingLayout.length;

                this.rowsQnty = parseRange(this.resultingLayout[length - 1][0].row).start;
            },

            /**
             * 用空行补充列表
             */
            setFullRowsLayout() {
                const presentRowsQnty = this.sortedRowsLayout.length;
                const rowsQntyNum = this.rowsQnty;
                
                if (presentRowsQnty < rowsQntyNum) {
                    for (let i = 0; i < rowsQntyNum; i++) {
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
                return this.sortedRowsLayout.findIndex(row => {
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