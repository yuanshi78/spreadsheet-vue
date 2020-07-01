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
                :key="`cell${idx}`"
                :rowIdx="rowIdx"
                :cellIdx="idx"
                :selected="cell.selected"
                @change-value="updateValue"
                @set-selected="handleCellSelected"
                @edit-mode="handleEditMode"
        ></Cell>
    </tr>
</template>

<script>
    import Cell from '../Cell';

    export default {
        components: {
            Cell
        },

        props: [ 'row', 'colsQnty', 'rowIdx', 'selectedCell' ],

        data() {
            return {
                currIdx: 0, //单元格的索引
            }
        },

        watch: {
            selectedCell(cell) {
                this.clearSelection();

                if (cell.row !== -1 && cell.col !== -1) {
                    if (cell.row === this.rowIdx) {
                        this.row.splice( cell.col, 1, { ...this.row[cell.col], selected: true });
                    }
                }
            }
        },

        mounted() {
        },

        methods: {
            /**
             * 修改值的时候发出事件
             * @param {Object} cell 修改的单元格
             * @private
             */
            updateValue(cell) {
                this.$emit('change-value', cell);
            },

            /**
             * 处理set-edit事件
             * @param {Object} cellPosition 单元格的座位(row行，col列)
             * @private
             */
            handleCellSelected(cellPosition) {
                this.$emit('set-selected', cellPosition);
            },

            /**
             * 取消单元格的选择
             * @private
             */
            clearSelection() {
                this.row.forEach(cell => {
                    cell.selected = false;
                    cell.editMode = false;
                });     
            },

            /**
             * 发出改变可编辑模式的状态
             * @private
             */
            handleEditMode() {
                this.$emit('edit-mode');
            }
        }
    }
</script>

<style scoped>

</style>