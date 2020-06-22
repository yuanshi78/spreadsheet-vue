/**
* @Author: 元实
* @Date:   2020-06-11
* @Description: Spreadsheet组件
*/

<template>
    <Table :layout="layout" :data="data" @change-value="updateValue"></Table>
</template>

<script>
    import Table from './components/Table';

    export default {
        components: {
            Table,
        },

        props: [ 'layout', 'data' ],

        data() {
          return {

          }
        },

        methods: {
            /**
             * 修改值的时候发出事件
             * @param {Object} cell 修改的单元格
             */
            updateValue(cell) {
                this.$emit('change-value', cell);
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>