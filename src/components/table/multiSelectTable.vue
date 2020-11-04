<template>
    <el-table
        ref="multipleTable"
        :data="details"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column 
            v-for="attr in attrs"
            :key="attr.id"
            :prop="attr.prop"
            :type="attr.type"
            :label="attr.label"
            :formatter="attr.formatter">
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    name: 'MultipleSelectionTable',
    props: {
        tableData: Array,
        columns: Array,
        selectedData: Function
    },
    data: function() {
        return {
            details: [],
            attrs: [],
            multipleSelection: [],
        };
    },
    mounted: function() {
        this.details = this.$props.tableData;
        this.attrs = this.$props.columns;
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val;

            this.$props.selectedData(val);
        }
    }
}
</script>

<style scoped>

</style>