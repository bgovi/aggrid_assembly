<template>
    <div style="height: calc(100vh - 79px); ">
        <!-- Need to add external filter paramaters to aggrid? -->
        <!-- Need to add function for show server error -->
        <ag-grid-vue style="width: 100%; height: 100%;"
                    class="ag-theme-balham"
                    :columnDefs="columnDefs"
                    :defaultColDef="defaultColDef"
                    :columnApi="columnApi"
                    :gridOptions="gridOptions"
                    :enableRangeSelection="true"
                    :enableFillHandle="true"
                    :isExternalFilterPresent="isExternalFilterPresent"
                    :doesExternalFilterPass="doesExternalFilterPass"
                    :getContextMenuItems="getContextMenuItems"
                    :allowContextMenuWithControlKey="true"

                    :overlayNoRowsTemplate="initialization_message_overlay"
                    :rowData="rowData">
        </ag-grid-vue>
    </div>
</template>



<script>
/*
This is the main component for ag-grid. 

*/

import {AgGridVue} from "ag-grid-vue";

import AutocompleteAg from '@/components/aggrid_main/aggrid_autocomplete.vue';
import field_functions from '@/library/app_functions/field_functions'
import grid_function from '@/library/app_functions/grid_functions'
import gpf from '@/library/app_functions/grid_param_functions'

var global_external_filter = {'external_filter': {'value':'all'} }

//message thats displayed when no rows available
const initialization_message= `<div style="background-color: #20B2AA; font-size: 14px; padding: 10px; text-align: left;"><h2 style="text-align: center;">Initialize Grid</h2>
<h3>Use Query In Navigation Bar</h3>
<h4>Quick Start: In Nav Bar goto Query -> Run Query or press &#9658; at top of page</h4>
<span style="font-weight: bold;">Filters</span>: Set what rows to filter from server<br>
<span style="font-weight: bold;">Order By</span>: Set what order to return data from server<br>
<span style="font-weight: bold;">Page</span>: Starting row and number of rows to send from server.<br>
<span style="font-weight: bold;">Type</span>: Sets how query is ran.<br>
<span style="font-weight: bold;">Run Query</span>: Runs the data pull<br>
<span style="font-weight: bold;">Next Page</span>: Pulls next group of rows. Can be ran after intial execution of Run Query.<br>
<h2>New Sheet</h2>
Create Blank Sheet With <span style="font-weight: bold;">File -> New Sheet</span> <br>
Number of rows created determined by Query->Page->Limit
(May not be available if missing insert permissions)
<h2>Help</h2>
Menu Icon In Top Right Corner -> Help
<h2>Contact</h2>
IUHPCBIA@iuhealth.org
</div>`

export default {
    props: {
        //Passed from definitions in pages folder
        rowData: {
            type: Array,
            required: true
        },
        columnDefs: {
            type: Array,
            required: true
        },
        defaultColDef: {
            type: Object,
            required: true
        },
        //Passed as object from main page api. Its sent as an empy object?
        //Aggrid will connect here? and populate the information
        columnApi: {
            type: Object,
            required: true
        },
        gridOptions: {
            type: Object,
            required: true
        },
        external_filter_params: {
            type: Object
        },
        server_fields: {
            type: Array
        },
        new_input_params: {
            type: Object
        },
        user_permissions: {
            type: Object
        }

    },

    //components for aggrid?
    components: {AgGridVue, AutocompleteAg},
    data: function () {
        return {
            initialization_message_overlay: initialization_message,
        }
    },
    mounted() {
        global_external_filter['external_filter'] = this.external_filter_params
        this.gridOptions.api.setFillHandleDirection('y')
    },
    methods: {
        getContextMenuItems(params) {
            var insert_function = this.Insert
            var delete_function  = this.Delete
            var undo_delete_function = this.UndoDelete 
            var undo_function   = this.Undo
            var remove_function = this.Remove

            var results = [ 'export']
            if (gpf.CanInsert(this.user_permissions) ) {
                results.push({name: 'Insert',action: function () { insert_function() } })
            }
            if (gpf.CanDelete(this.user_permissions) ) {
                results.push({name: 'Delete',action: function () { delete_function() } })
                results.push({name: 'Undo Delete',action: function () { undo_delete_function() } })
            }

            if (gpf.CanUpdate(this.user_permissions) || gpf.CanInsert(this.user_permissions) || gpf.CanDelete(this.user_permissions) ) {
                results.push({name: 'Clear/Undo', action: function () { undo_function() } })
            }
            results.push('separator')
            results.push({ name: 'Copy/Paste', action: function () { alert("Select Rows/Cells:\nWindows:\nCopy: Ctrl-C\nPaste:Ctrl-V\n\nMac:\nCopy: Command-C\nPaste: Command-V") } })
            results.push('separator')
            results.push({name: 'Remove', action: function () { remove_function() } })
            return results
        },
        //Check permissions before using? //disable on error also 
        Insert() {
            grid_function.InsertSelected(this.rowData, this.gridOptions, this.new_input_params)
        },
        Delete() {
            grid_function.Delete(this.gridOptions, true)
        },
        UndoDelete() {
            grid_function.Delete(this.gridOptions, false)
        },
        Undo() {
            grid_function.undo(this.gridOptions, this.server_fields)
            this.$nextTick(function() {
                this.gridOptions.api.redrawRows()
            })
        },
        Remove() {
            grid_function.RemoveSelected(this.rowData, this.gridOptions)
        },
        isExternalFilterPresent() {
            return global_external_filter.external_filter.value !== 'all'
        },
        doesExternalFilterPass(node) {
            var switch_condition = global_external_filter.external_filter.value
            switch (switch_condition) {
                case 'new_rows':
                    return node.data[field_functions.is_new_row()]
                case 'update_rows':
                    return node.data[field_functions.save_route()] === 'update'
                case 'editable_rows':
                    return node.data[field_functions.allow_update()]
                case 'delete_rows':
                    return node.data[field_functions.is_deleted()]
                case 'incomplete_rows':
                    return node.data[field_functions.is_incomplete()]
                case 'error_rows':
                    return node.data[field_functions.is_error()]
                case 'changed_rows':
                    return node.data[field_functions.is_changed()]
                case 'completed_rows':
                    return node.data[field_functions.is_complete()]
                case 'query_rows':
                    return node.data[field_functions.is_query_row()]
                case 'block_save':
                    return !node.data[field_functions.is_deleted()] &&
                        node.data[field_functions.is_changed()] && 
                        ( node.data[field_functions.is_incomplete()] || node.data[field_functions.is_error()] )
                case 'save_rows':
                    return ( node.data[field_functions.is_new_row()] && !node.data[field_functions.is_deleted()] &&
                            ( node.data[field_functions.is_changed()] && node.data[field_functions.is_complete()] 
                            && !node.data[field_functions.is_error()]  ) 
                        ) || ( !node.data[field_functions.is_new_row()] &&
                            (
                                ( node.data[field_functions.is_changed()] && node.data[field_functions.is_complete()] 
                                && !node.data[field_functions.is_error()]  ) || node.data[field_functions.is_deleted()]
                            )
                        )
                case 'server_error': 
                    return node.data[field_functions.server_error()] !== ""
                default:
                    return true
            }
        }
    }

}



</script>

<style lang="scss">
  @import "../../node_modules/ag-grid-community/dist/styles/ag-grid.css";
  @import "../../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css";

</style>