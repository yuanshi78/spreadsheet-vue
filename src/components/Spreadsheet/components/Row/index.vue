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

        props: [ 'row', 'maxcols', 'rowIdx' ],

        data() {
            return {
                rowCopy: [], //行的复制本
            }
        },

        mounted() {
            this.sortCells();
            this.rowCopy = this.row.slice();
            this.setIncompleteRow();

        },

        methods: {
            /**
             * 排序单元格
             */
            sortCells() {
                this.row.sort((cell1, cell2) => {
                    return Number(parseRange(cell1.col)[0]) - Number(parseRange(cell2.col)[0]);
                });
            },

            /**
             * 如果一行缺数据，补充它
             */
            setIncompleteRow() {
                const maxCols = this.maxcols;
                const rowLength = this.row.length;

                for (let i = 1; i <= maxCols; i++) {
                    if (!rowLength || !this.isCellPresent(i)) {
                        this.row.splice(i - 1, 0, { row: this.rowIdx, col: `${i}`, rowSpan: 1, colSpan: 1, width: '50px' });
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

                if (this.rowCopy.length) {
                    parsedColNo = parseRange(this.rowCopy[0].col);
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