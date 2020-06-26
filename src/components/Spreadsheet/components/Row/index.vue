/**
* @Author: 元实
* @Date:   2020-06-11
* @Description: Spreadsheet组件的表格行组件
*/

<template>
    <tr>
        <Cell
                v-for="(cell, idx) in row"
                :cell="cell"
                :key="`${cell.row}:${cell.col}`"
                :rowIdx="rowIdx"
                :cellIdx="idx"
                :selected="cell.selected"
                @change-value="updateValue"
                @set-selected="handleCellSelected"
        ></Cell>
    </tr>
</template>

<script>
    import Cell from '../Cell';
    import { parseRange } from '../utils.js';

    export default {
        components: {
            Cell
        },

        props: [ 'row', 'maxColsQnty', 'rowIdx' ],

        data() {
            return {
                resultingRow: [], //缺席的单元格是用空行补充的
            }
        },

        mounted() {
            //this.sortCells();
            //this.resultingRow = this.row.slice();
            //this.setIncompleteRow();
        },

        methods: {
            sortCells() {
                if (this.row.length) {
                    this.row.sort((cellOne, cellTwo) => {
                        const cellOneColNum = parseRange(cellOne.col).start;
                        const cellTwoColNum = parseRange(cellTwo.col).start;

                        return cellOneColNum - cellTwoColNum;
                    });
                }
            },

            /**
             * 如果一行缺数据，补充它
             */
            setIncompleteRow() {
                const maxCols = this.maxColsQnty;
                const rowLength = this.row.length;

                for (let i = 1; i <= maxCols; i++) {
                    if (!rowLength || !this.isCellPresent(i)) {
                        this.row.splice(i - 1, 0, { row: this.rowIdx, col: `${i}:${i}`, rowSpan: 1, colSpan: 1, width: '50px' });
                    }
                }
            },

            /**
             * 这一行是不是有这第几列的单元格
             * @param {number} colNo 第几列
             * @return {boolean} true - 有, false - 没有
             */
            isCellPresent(colNo) {
                let parsedColNo = [];
                let startColNo = 0;

                if (this.resultingRow.length) {
                    parsedColNo = parseRange(this.resultingRow[0].col);
                    startColNo = Number(parsedColNo[0])
                } else {
                    return false;
                }

                if (colNo < startColNo) {
                    return false;
                } else {
                    if (parsedColNo[1]) {
                        if (colNo === Number(parsedColNo[1])) {
                            this.rowCopy.shift();
                        }
                    } else {
                        this.rowCopy.shift();
                    }

                    return true;
                }
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
                this.$emit('set-selected', cellPosition);
            }
        }
    }
</script>

<style scoped>

</style>