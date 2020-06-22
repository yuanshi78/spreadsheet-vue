/**
* @Author: 元实
* @Date:   2020-06-11
* @Description: Spreadsheet组件的表格单元格组件
*/
<template>
    <td v-if="!cell.hidden"
        :colspan="cell.colSpan"
        :rowspan="cell.rowSpan"
        :style="style"
        :class="{ 'edit-mode': isEditMode }"
        @click="toggleSelected"
        @dblclick="toggleEditMode">
        <div v-show="cell.editable && !isEditMode">{{ editableValue }}</div>
        <div v-show="!cell.editable">{{ cell.value }}</div>
        <div v-show="cell.editable && isEditMode" class="editable-cell">
            <input
                    ref="input"
                    type="text"
                    v-model="editableValue"
                    @dblclick="toggleEditMode"
                    @blur="isEditMode = false"
                    @change="updateValue"
            >
        </div>
        <div v-show="selected" class="selected"></div>
    </td>
</template>

<script>
    //import { parseRange } from '../utils.js';

    export default {
        props: [ 'cell', 'selected', 'rowIdx', 'cellIdx' ],

        data() {
            return {
                isEditMode: false,
                isClicked: false,
                editableValue: this.cell.value,
            }
        },

        computed: {
            style() {
                return Object.assign({}, { width: this.cell.width }, this.cell.style);
            },
        },

        watch: {
            isEditMode(value) {
                if (value) {
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
                this.isEditMode = !this.isEditMode;
            },

            /**
             * 修改值的时候发出事件
             * @param {Object} cell 修改的单元格
             */
            updateValue() {
                this.$emit('change-value', Object.assign(this.cell, { value: this.editableValue }));
                this.isEditMode = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    td {
        position: relative;
        padding: 5px;
        border: solid 1px #ccc;

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
            border: solid 2px #eeca00;
        }

        div {
            width: 100%;
            height: 100%;
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
            -webkit-transform: scale(1.1);
            -moz-transform: scale(1.1);
            -ms-transform: scale(1.1);
            -o-transform: scale(1.1);
            transform: scale(1.1);
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