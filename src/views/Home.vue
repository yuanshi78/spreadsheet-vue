<template>
    <div>
        <spreadsheet :layout="layout" @change-value="changeValue"></spreadsheet>
    </div>
</template>

<script>
    import Spreadsheet from '@/components/Spreadsheet';
    import layout from '../../tests/layout'

    export default {
        components: {
            Spreadsheet
        },

        data() {
            return {
                layout,
            };
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