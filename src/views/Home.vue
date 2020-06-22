<template>
    <div>
        <spreadsheet :layout="layout" @change-value="changeValue"></spreadsheet>
        <input type="text">
        <input type="text">
    </div>
</template>

<script>
    import Spreadsheet from '@/components/Spreadsheet'

    export default {
        components: {
            Spreadsheet
        },

        data() {
            return {
                layout: [
                    { row:'1:1', col: '1:12', value: "车辆运行数据", width: '1200px', style: { backgroundColor: 'red' }},

                    { row: '2:2', col: '1:1', value: "主车号", width: '100px'},
                    { row: '2:2', col: '2:2', value: "晋AA8888", editable: true, width: '200px' },
                    { row: '2:2', col: '3:3', value: "发车时间", width: '100px' },
                    { row: '2:2', col: '4:4', value: "2020.06.10 11:50", editable: true, width: '100px' },
                    { row: '2:2', col: '5:5', value: "返回时间", width: '100px' },
                    { row: '2:2', col: '6:6', value: "", editable: true, width: '100px' },
                    { row: '2:2', col: '7:7', value: "返回地点", width: '100px' },
                    { row: '2:2', col: '8:8', value: "", editable: true, width: '100px' },
                    { row: '2:2', col: '9:9', value: "重车驶回基地时间", width: '100px' },
                    { row: '2:2', col: '10:10', value: "1", editable: true, width: '100px'},
                    { row: '2:2', col: '11:11', value: "总里程", width: '100px' },
                    { row: '2:2', col: '12:12', value: "9177.0", editable: true, width: '100px' },

                    { row: '3:3', col: '1:1', value: "主车号", width: '100px'},
                    { row: '3:3', col: '2:2', value: "晋AA8888", editable: true, width: '200px' },
                    { row: '3:3', col: '3:3', value: "发车时间", width: '100px' },
                    { row: '3:3', col: '4:4', value: "2020.06.10 11:50", editable: true, width: '100px' },
                    { row: '3:3', col: '5:5', value: "返回时间", width: '100px' },
                    { row: '3:3', col: '6:6', value: "1", editable: true, width: '100px' },
                    { row: '3:3', col: '7:7', value: "返回地点", width: '100px' },
                    { row: '3:3', col: '8:8', value: "1", editable: true, width: '100px' },
                    { row: '3:3', col: '9:9', value: "重车驶回基地时间", width: '100px' },
                    { row: '3:3', col: '10:10', value: "1", editable: true, width: '100px' },
                    { row: '3:3', col: '11:11', value: "总里程", width: '100px' },
                    { row: '3:3', col: '12:12', value: "9177.0", editable: true, width: '100px' },

                    { row: '4:4', col: '1:1', value: "主车号", width: '100px'},
                    { row: '4:4', col: '2:2', value: "晋AA8888", editable: true, width: '200px' },
                    { row: '4:4', col: '3:3', value: "发车时间", width: '100px' },
                    { row: '4:4', col: '4:4', value: "2020.06.10 11:50", editable: true, width: '100px' },
                    { row: '4:4', col: '5:5', value: "返回时间", width: '100px' },
                    { row: '4:4', col: '6:6', value: "1", editable: true, width: '100px' },
                    { row: '4:4', col: '7:7', value: "返回地点", width: '100px' },
                    { row: '4:4', col: '8:8', value: "1", editable: true, width: '100px' },
                    { row: '4:4', col: '9:9', value: "重车驶回基地时间", width: '100px' },
                    { row: '4:4', col: '10:10', value: "1", editable: true, width: '100px' },
                    { row: '4:4', col: '11:11', value: "总里程", width: '100px' },
                    { row: '4:4', col: '12:12', value: "9177.0", editable: true, width: '100px' },

                    { row: '5:5', col: '1:1', value: '行车路线', widht: '100px' },
                    { row: '5:5', col: '2:12', value: '4445', editable: true, width: '1100px' },
                ],

                data: {

                }
            }
        },

        methods: {
            changeValue(value) {
                console.log('changed value', value);
            }
        }
    }
</script>

<style scoped>

</style>