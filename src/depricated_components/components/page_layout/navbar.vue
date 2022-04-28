<!--
Nav Bar has the pull and save functionality.


gridOptions: {
  type: Object,
  // required: true
},
server_fields: {
  type: Array
},
new_input_params: {
  type: Object
},
pagination: {
  type: Object //used to set page size
},
rowData: {
  type: Array
},
external_filter_params: {
  type: Object
},
user_permissions: {
    type: Object
}

//Need to add Reset Button. Removes error state.

-->
<template>
<div>
    <div class="navbar" >
    <!--========================== File ============================-->
      <div v-if="!is_error_state" class="dropdown"  @mouseover="file_hover = true" @mouseleave="file_hover = false">
        <button class="dropbtn">File </button>
        <div ref="file_menu" class="dropdown-content" :class="{active: file_hover}">
          <a v-if="CanModify" @click="Save()">Save</a>
          <a v-if="CanInsert" @click="NewSheet()">New Sheet</a>
          <a @click="ClearRowsX()">Clear Rows</a>
          <a @click="RefreshRowsX()">Refresh Rows</a>
        </div>
      </div>

    <!--========================== RESET State ============================-->
      <div v-if="is_error_state" class="dropdown" >
        <button @click="ResetGrid()" class="dropbtn" style="cursor: pointer;">Reset</button>
      </div>



    <!--========================== View ============================-->
      <div v-if="!is_error_state" class="dropdown" @mouseover="view_hover = true" @mouseleave="view_hover = false">
        <button class="dropbtn" :class="{ underlineview : ViewActive }">View </button>
        <div class="dropdown-content" :class="{active: view_hover}">
          <a :class="{viewbold: FilterActive('all')}" @click="externalFilterChanged('all')">All</a>
          <hr>
          <a :class="{viewbold: FilterActive('error_rows')}"  @click="externalFilterChanged('error_rows')">Error Rows</a>
          <a :class="{viewbold: FilterActive('block_save')}"  @click="externalFilterChanged('block_save')">Block Save Rows</a>
          <a :class="{viewbold: FilterActive('save_rows')}" @click="externalFilterChanged('save_rows')">Save Set Rows</a>
          <hr>
          <a :class="{viewbold: FilterActive('new_rows')}" @click="externalFilterChanged('new_rows')">New Rows</a>
          <a :class="{viewbold: FilterActive('update_rows')}" @click="externalFilterChanged('update_rows')">Update Rows</a>
          <a :class="{viewbold: FilterActive('editable_rows')}"   @click="externalFilterChanged('editable_rows')">Editable Rows</a>
          <hr>
          <a :class="{viewbold: FilterActive('delete_rows')}"  @click="externalFilterChanged('delete_rows')">Deleted Rows</a>
          <a :class="{viewbold: FilterActive('incomplete_rows')}"  @click="externalFilterChanged('incomplete_rows')">Incomplete Rows</a>
          <a :class="{viewbold: FilterActive('changed_rows')}"  @click="externalFilterChanged('changed_rows')">Changed Rows</a>
          <a :class="{viewbold: FilterActive('query_rows')}"  @click="externalFilterChanged('query_rows')">Query Rows</a>
          <a :class="{viewbold: FilterActive('completed_rows')}"  @click="externalFilterChanged('completed_rows')">Completed Rows</a> 

        </div>
      </div>

    <!--========================== Actions ============================-->
      <div v-if="!is_error_state" class="dropdown" @mouseover="action_hover = true" @mouseleave="action_hover = false">
        <button class="dropbtn">Actions</button>
        <div class="dropdown-content" :class="{active: action_hover}">
          <a v-if="CanInsert" @click="InsertTenRows(true)">Insert 10 &#8593;</a>
          <a v-if="CanInsert" @click="InsertTenRows(false)">Insert 10 &#8595;</a>
          <a v-if="CanInsert" @click="InsertSelected()">Insert Selected</a>
          <hr v-if="CanInsert">
          <a v-if="CanDelete" @click="Delete()">Delete Selected</a>
          <a v-if="CanDelete" @click="UndoDelete()">Undo Delete Selected</a>
          <a v-if="CanModify" @click="UndoSelected()">Clear/Undo Selected</a>
          <hr v-if="CanModify" >
          <a @click="RemoveSelected()">Remove Selected</a>
          <hr>
          <a @click="RefreshRowsX()">Refresh Rows</a>
        </div>
      </div>

    <!--========================== Query ============================-->
      <div v-if="!is_error_state" class="dropdown" @mouseover="query_hover = true" @mouseleave="query_hover = false">
        <button class="dropbtn">Query</button>
        <div class="dropdown-content" :class="{active: query_hover}">
          <a @click="ShowWhereModal()">Filters</a>
          <a @click="ShowOrderByModal()">Order By</a>
          <a @click="ShowPageModal()">Page</a>
          <a @click="ShowQueryTypeModal()">Type</a>
          <hr>
          <a @click="NextPage()" >Next Pull</a>
          <hr>
          <a @click="RunQuery()">Run Query</a>
        </div>
      </div>


    <!--========================== Quick sort from aggrid ============================-->
    <input v-if="!is_error_state" v-model="message" placeholder="quickfilter..." class="quickfilter" v-on:input="OnQuickFilterChanged()">

    <!--========================== Run Query Icon ==========================-->
    <div v-if="!is_error_state" class="nextpage" style="display: inline;">
      <p @click="RunQuery()" class="iconx">&#9658;</p>
    </div>

    <!--========================== Next Page Icon ==========================-->
    <div v-if="!is_error_state" class="nextpage" style="display: inline;">
      <p @click="NextPage()" class="iconx">&#9112;</p>
    </div>

    <!--========================== Save Icon ==========================-->
    <div v-if="CanModify && !is_error_state" class="nextpage" style="display: inline;">
      <p @click="Save()" class="iconx">&#128190;</p>
    </div>


    <!--========================== Test Icon ==========================-->
    <div v-if="is_test" class="nextpage" style="display: inline;">
      <p @click="LogRowData()" class="iconx">&#xf02f;</p>
    </div>


    <!--========================== Menu Icon ============================ -->
      <!-- <a  id="rightalign"> &#9776; </a> -->
      <div class="dropdown" style="float: right; margin-right: 0px;" @mouseover="menu_hover = true" @mouseleave="menu_hover = false">
        <button class="dropbtn">&#9776;</button>
        <div class="dropdown-content" style="right: 0;" :class="{active: menu_hover}">
          <a @click="ShowHelpModal()">Help</a>
          <a href="/">Home</a>
          <a href="/logout">Log Out</a>
        </div>
      </div>

    </div>
</div>
</template>

<script>

// //maybe should add to nav bar decisions
// RefreshGrid
// ChangeToErrorState
// DoNothing


import {debounce} from 'lodash'
import grid_function from '@/library/app_functions/grid_functions'
import gpf from '@/library/app_functions/grid_param_functions'
import crud_functions from '@/library/app_functions/crud_functions'
import modal_functions from '@/library/app_functions/modal_functions'
import qparams from '@/library/query_params.js'
import field_functions from '@/library/app_functions/field_functions'

// field_functions.server_error()
// import _ from 'lodash'

export default {
  props: {
    gridOptions: {
      type: Object,
      // required: true
    },
    server_fields: {
      type: Array
    },
    new_input_params: {
      type: Object
    },

    rowData: {
      type: Array
    },
    external_filter_params: {
      type: Object
    },
    user_permissions: {
        type: Object
    },
    //Force RowData redraw
    ForceRowDataReset: {
      type: Function
    },

    //below are for running queries.
    field_variables: {
      type: Object
    },
    autocomplete_map: {
      type: Object,
    },

    route_name: {
      type: String
    },
    query_routes: {
      type: Object
    },
    where: {
      type: Array
    },
    order_by: {
      type: Array
    },
    pagination: {
      type: Object
    },
    get_route_params: {
      type: Object
    },
    save_route: {
      type: String
    },
    load_modalParams: {
      type: Object
    },
    save_modalParams: {
      type: Object
    },

  },

  data() {
    return {
      file_hover: false,
      view_hover: false,
      action_hover: false,
      query_hover: false,
      menu_hover: false,
      message: "",
      is_error_state: false, //used to set navbar to error state on true.
      is_test: false
    }
  },

  computed: {
    // underlineView: function () {
    //   return
    // },


    ViewActive: function () {
      return this.external_filter_params.value != 'all'
    },
    CanUpdate: function () {
      return gpf.CanUpdate(this.user_permissions)
    },
    CanInsert: function () {
      return gpf.CanInsert(this.user_permissions)  
    },
    CanDelete: function () {
      return gpf.CanDelete(this.user_permissions)
    },
    CanModify: function () {
      return gpf.CanDelete(this.user_permissions) || gpf.CanInsert(this.user_permissions) || gpf.CanUpdate(this.user_permissions)
    },
  },

  methods: {
    LogRowData() {
      console.log(this.rowData)
    },

    FilterActive: function (filter_value) {
      return this.external_filter_params.value === filter_value
    },
    externalFilterChanged(filterType) {
      // ['all', 'new_rows','update_rows',
      // 'editable_rows','delete_rows', 'incomplete_rows','error_rows',
      // 'block_save','changed_rows','query_rows']
      this.external_filter_params.value = filterType
      this.view_hover = false
      this.gridOptions.api.onFilterChanged()
    },
    ShowHelpModal() {
      this.menu_hover = false
      this.$modal.show("help-modal")
    },

    ShowWhereModal() {
      this.query_hover = false
      this.$modal.show("where-modal")
    },
    ShowOrderByModal() {
      this.query_hover = false
      this.$modal.show("orderby-modal")
    },
    ShowPageModal() {
      this.query_hover = false
      this.$modal.show("page-modal")
    },
    ShowQueryTypeModal() {
      this.query_hover = false
      this.$modal.show('querytype-modal')
    },
    Delete() {
      this.action_hover = false
      grid_function.Delete(this.gridOptions, true)
    },
    UndoDelete() {
      this.action_hover = false
      grid_function.Delete(this.gridOptions, false)
    },
    UndoSelected() {
      this.action_hover = false
      grid_function.undo(this.gridOptions, this.server_fields)
      this.$nextTick(function() {
          this.gridOptions.api.redrawRows()
      })

    },
    RemoveSelected() {
      grid_function.RemoveSelected(this.rowData, this.gridOptions)
    },

    OnQuickFilterChanged: debounce(function () {this.QuickFilter()}, 300 ) ,

    InsertTenRows(add_top) {
      this.action_hover = false
      grid_function.insert(this.rowData, 10, this.gridOptions,this.new_input_params, add_top)
    },

    InsertSelected() {
      this.action_hover = false
      grid_function.InsertSelected(this.rowData, this.gridOptions, this.new_input_params)
    },

    ClearRowsX() {
      // this.ClearRows()
      console.log("Clear Rows")
      grid_function.reset_all_row_data(this.gridOptions, this.rowData, this.server_fields)
      this.file_hover = false
    },
    QuickFilter() {
      this.gridOptions.api.setQuickFilter(this.message)
    },

    RefreshRowsX() {
      // this.RefreshRows()
      console.log("Refresh Rows")
      grid_function.redraw_rows(this.gridOptions)
      this.file_hover = false
    },
    ResetGrid() {
      this.is_error_state = false
      this.message = ""
      this.external_filter_params.value = 'all'
      let error_column_name = field_functions.server_error()
      this.gridOptions.columnApi.setColumnsVisible([error_column_name], false)
      this.ForceRowDataReset()
    },
    SetErrorState(external_filter) {
      this.is_error_state = true
      this.message = ""
      this.external_filter_params.value = external_filter
      //gridOptions.columnApi.setColumnsVisible(['name', 'last_name'], true)
      let error_column_name = field_functions.server_error()
      this.gridOptions.columnApi.setColumnsVisible([error_column_name], true)
      this.gridOptions.api.setQuickFilter(this.message)
      this.gridOptions.api.onFilterChanged()
    },

    async Save() {
      /*
      How to communicated with modal window

      */
      try{
        //reset save_modalParams
        modal_functions.SavingModalParamsReset(this.save_modalParams)

        this.file_hover = false
        this.save_modalParams['is_saving'] = true
        this.$modal.show('save-modal')
        // console.log(this.save_route)


        let numBlockRows = await crud_functions.CheckBlockingRows(this.rowData)
        if (numBlockRows > 0) {
            this.save_modalParams['total_blocking_rows'] = numBlockRows
            this.save_modalParams['is_saving'] = false
            return
        }
        let saveRows = await crud_functions.ExtractRowsForSave(this.rowData)
        // console.log(saveRows)
        if (saveRows.length === 0 ) {
            this.save_modalParams['total_rows_to_save'] = saveRows.length
            this.save_modalParams['is_saving'] = false
            return
        }
        this.save_modalParams['is_started'] = true
        this.save_modalParams['total_rows_to_save'] = saveRows.length

        // await new Promise(resolve => setTimeout(resolve, 100));
        // this.save_modalParams['insert_count'] = 1
        // this.save_modalParams['update_count'] = 1
        // await new Promise(resolve => setTimeout(resolve, 100));
        
        // this.save_modalParams['error_count'] = 1
        // await new Promise(resolve => setTimeout(resolve, 100));
        //need to finish inputs?
        //complete error state.
        let field_map = this.field_variables['field_map']
        await crud_functions.SaveData( saveRows, this.save_route, this.server_fields, field_map, this.autocomplete_map, this.$axios, this.save_modalParams )

        //In Save Funciton update modalParams
        if (this.save_modalParams['error_count'] > 0) {
          this.save_modalParams['is_saving'] = false
          this.SetErrorState('server_error')
        } else { 
          //reset grid
          this.message = ""
          this.external_filter_params.value = 'all'
          this.ForceRowDataReset() //Dont like this try to see if redraw rows works in new version of aggrid.
          this.save_modalParams['is_saving'] = false
        }

      } catch (err) {
        console.log(err)
        //show error state
        this.save_modalParams['is_saving'] = false
        this.save_modalParams['is_save_error'] = true
        this.save_modalParams['save_error_msg'] = String(err)
        this.SetErrorState('all')
        //set to error mode
      }


    },
    async NextPage() {
      /*
      This function returns the next pull of the data inititalized by RunQuery. If RunQuery was not 
      initiated this function should not run. The next page is pulled from the server and loaded to the
      grid. Messages are saved to the loading modal window.

      If the last page is reached a flag should be added to the modalParams indicated so.

      Need to determine now query was run? if New Sheet was run first init query never run?

      The data shoud be processed based on the input_params of the query pull.

      let offset_backup = get_route_params['pagination']['offset']
      let limit_backup  = get_route_params['pagination']['limit']

      qparams.NextPage( get_route_params['pagination'] )
      */


      this.query_hover = false
      try {
        //check if next pull should run?
        let offset_backup = this.get_route_params['pagination']['offset']
        if (!this.load_modalParams['is_end']) {
          qparams.NextPage( this.get_route_params['pagination'] )
        }

        this.load_modalParams['offset'] = this.get_route_params['pagination']['offset']
        // // //limit here is to last row to pull
        this.load_modalParams['limit']  = this.get_route_params['pagination']['offset'] + this.get_route_params['pagination']['limit']
        if (this.load_modalParams['is_load_error'] || this.load_modalParams['is_end'] || this.load_modalParams['init_query_no_rows_pulled']
            || !this.load_modalParams['is_init']  ) {          
          //return if any error found or if end of row reach
          this.load_modalParams['is_loading'] = false
          this.$modal.show('load-modal')
          return
        }

        this.load_modalParams['is_loading'] = true
        this.$modal.show('load-modal')
        var serverRowData = await crud_functions.RunQuery(this.get_route_params['route_name'], this.query_routes, this.where, this.order_by, this.pagination,
            this.get_route_params, this.field_variables, this.$axios, true)

        // grid_function.append_rows(this.rowData, serverRowData )
        if (serverRowData.length === 0 ) {
          this.load_modalParams['is_end'] = true
          this.load_modalParams['is_loading'] = false
          return
        } else if (serverRowData.length <  this.pagination['limit'] ) {
          this.load_modalParams['is_end'] = true
          await this.AddRowsToGrid(serverRowData)
          this.load_modalParams['is_loading'] = false
          return
        }

        await this.AddRowsToGrid(serverRowData)
        this.load_modalParams['is_loading'] = false
        await new Promise(resolve => setTimeout(resolve, 500));
        grid_function.redraw_rows(this.gridOptions)
        this.$modal.hide('load-modal')
      } catch (err) {
          console.log(err)
          this.load_modalParams['is_load_error'] = true
          this.load_modalParams['is_loading'] = false
          this.load_modalParams['load_error_msg'] = String(err)
          this.load_modalParams['is_end'] = true
          this.SetErrorState('all')
      }


    },
    async RunQuery() {
      this.query_hover = false
      try {
        modal_functions.LoadingModalParamsReset(this.load_modalParams)
        this.load_modalParams['offset'] = this.pagination['offset']
        this.load_modalParams['limit']  = this.pagination['limit']
        this.load_modalParams['route_name']  = this.route_name
        this.load_modalParams['is_init'] = true        
        this.load_modalParams['is_loading'] = true
        this.$modal.show('load-modal')
        var serverRowData = await crud_functions.RunQuery(this.route_name, this.query_routes, this.where, this.order_by, this.pagination,
            this.get_route_params, this.field_variables, this.$axios, false)
        if (serverRowData.length === 0 ) {
          this.load_modalParams['init_query_no_rows_pulled'] = true
          this.load_modalParams['is_end'] = true
          // grid_function.remove_row_data(this.rowData)
          this.ForceRowDataReset() //Dont like this try to see if redraw rows works in new version of aggrid.
          // grid_function.redraw_rows(this.gridOptions)
          this.load_modalParams['is_loading'] = false
          return
        } else if (serverRowData.length <  this.pagination['limit'] ) {
          this.load_modalParams['is_end'] = true
          await this.RebuildGrid(serverRowData)
          this.load_modalParams['is_loading'] = false
          return
        }

        await this.RebuildGrid(serverRowData)
        this.load_modalParams['is_loading'] = false
        await new Promise(resolve => setTimeout(resolve, 500));
        grid_function.redraw_rows(this.gridOptions)
        this.$modal.hide('load-modal')

      } catch (err) {
          this.load_modalParams['is_load_error'] = true
          this.load_modalParams['is_loading'] = false
          this.load_modalParams['load_error_msg'] = String(err)
          this.load_modalParams['is_end'] = true
          this.load_modalParams['is_init'] = false
          this.SetErrorState('all')
      }

    },
    async AddRowsToGrid(serverRowData) {
        grid_function.append_rows(this.rowData, serverRowData )
    },

    async RebuildGrid(serverRowData) {
      /*
      Removes old rows. Adds new rows and then refreshes grid.
      */
      grid_function.remove_row_data(this.rowData)
      grid_function.append_rows(this.rowData, serverRowData )
      grid_function.redraw_rows(this.gridOptions)
    },
    NewSheet() {
      this.load_modalParams['is_init'] = false
      grid_function.new_sheet(this.gridOptions, this.rowData, this.pagination, this.new_input_params)
      this.file_hover = false
    }
  
  }
}

</script>


<style scoped>

.underlineview {
  text-decoration: underline;
}

.viewbold {
  font-weight: bold;
  background-color: coral;
}

.navbar {
    overflow: hidden;
    height: 49px;
    background-color: #333;
}

.navbar a {
    float: left;
    font-size: 16px;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
}

.quickfilter {
    float: left;
    overflow: hidden;
    font-size: 16px;  
    border: none;
    outline: none;
    padding-top: 2px;
    padding-bottom: 2px;
    padding-left: 10px;
    margin-left: 30px;
    margin-top: 12px;
    font-family: inherit;

}
.nextpage {
    float: left;
    overflow: hidden;
    font-size: 30px;  
    border: none;
    outline: none;
    color: white;
    padding-top: 2px;
    padding-bottom: 2px;
    padding-left: 10px;
    padding-right: 10px;
    margin-left: 25px;
    margin-top: 3px;
    font-family: inherit;
}

.iconx {
  cursor: pointer;
}

.nextpage:hover {
    background-color: red;
}


.iconx:active {
  transform: translateY(5px);
}



#rightalign {

    float: right;
    overflow: hidden;
    font-size: 16px;  
    border: none;
    outline: none;
    color: white;
    padding-top: 2px;
    padding-bottom: 2px;

    padding-left: 10px;
    margin-right: 30px;
    margin-top: 12px;

    font-family: inherit;


}



.dropdown {
    float: left;
    overflow: hidden;
}

.dropdown .dropbtn {
    font-size: 16px;  
    border: none;
    outline: none;
    color: white;
    padding: 14px 16px;
    background-color: inherit;
    font-family: inherit;
    margin: 0;
}

.navbar a:hover, .dropdown:hover .dropbtn {
    background-color: red;
    cursor: default;
}

.dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
}

.dropdown-content a {
    float: none;
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    text-align: left;
}

.dropdown-content a:hover {
    background-color: #ddd;
}

.active {
  display: block;
}


</style>