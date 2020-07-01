/**
* @Author: 元实
* @Date:   2020-06-11
* @Description: Spreadsheet组件的表格单元格组件
*/
<template>
    <td v-if="!cell.hidden"
        ref="td"
        :colspan="colSpan"
        :rowspan="rowSpan"
        :style="style"
        :class="{ 'edit-mode': cell.editMode }"
        @click="toggleSelected"
        @dblclick="toggleEditMode">
        <div v-show="cell.editable" :style="{ visibility: cell.editMode ? 'hidden' : 'visible', width: width }">{{ editableValue }}</div>
        <div v-show="!cell.editable">{{ cell.value }}</div>
        <div v-show="cell.editable && cell.editMode" class="editable-cell">
            <input
                    ref="input"
                    :type="cell.type ? cell.type : 'text'"
                    v-model="editableValue"
                    @dblclick="toggleEditMode"
                    @change="updateValue"
            >
        </div>
        <div v-show="selected && cell.editable" class="selected"></div>
    </td>
</template>

<script>
    import { parseRange } from '../utils.js';

    export default {
        props: [ 'cell', 'selected', 'rowIdx', 'cellIdx' ],

        data() {
            return {
                isEditMode: false,
                isClicked: false,
                editableValue: this.cell.value,
                height: 0,
                width: 0,
            }
        },

        computed: {
            style() {
                return Object.assign({}, { 
                      width: this.cell.width, 
                      height: this.cell.height 
                    }, 
                    this.cell.style);
            },

            rowSpan() {
                const start = parseRange(this.cell.row).start;
                const end = parseRange(this.cell.row).end;

                return end - start + 1;
            },

            colSpan() {
                const start = parseRange(this.cell.col).start;
                const end = parseRange(this.cell.col).end;

                return end - start + 1;
            },
        },

        mounted() {
          console.log(this.$refs);
          if (this.$refs.td) {
            this.width = this.$refs.td.clientWidth + 'px';
          }
        },

        watch: {
            isEditMode(value) {
                if (value) {
                    setTimeout(() => this.$refs.input.focus(), 100);
                }
            },

            cell(value) {
                if (value.editMode) {
                     setTimeout(() => this.$refs.input.focus(), 100);
                }
            }
        },

        methods: {
            toggleSelected() {
                if (this.cell.editable) {
                    this.isClicked = !this.isClicked;
                    this.$emit('set-selected', {
                        rowIdx: this.rowIdx,
                        colIdx: this.cellIdx
                    });
                }
            },

            /**
             * 开关编辑模式
             */
            toggleEditMode() {
                this.$emit('edit-mode');
            },

            /**
             * 修改值的时候发出事件
             * @param {Object} cell 修改的单元格
             */
            updateValue() {
                this.isEditMode = false;
                this.cell.editMode = false;
                this.$emit('change-value', Object.assign(this.cell, { value: this.editableValue }));
            },
        }
    }
</script>

<style lang="scss" scoped>
    td {
        position: relative;
        padding: 5px;
        border: solid 1px #ccc;

        &.edit-mode {
            padding: 5px;
        }

        .selected {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            padding: 5px 0;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            border: solid 2px #0fb3ff85;
        }

        div {
            display: flex;
            width: 100%;
            height: 100%;
            justify-content: center;
            align-items: center;
        }


        .editable-cell {
            position: absolute;
            display: flex;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            padding: 5px 0;
            align-items: center;
            background: #fff;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            border: solid 1px #00b1ee;
            box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.596);
            z-index: 100;

            input {
                width: calc(100% - 2px);
                border: none;
                font-size: 16px;
                color: #2c3e50;
                outline: none;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
            }
        }
    }
</style>