<!--
This is the vue script for the popup window that is displayed to prevent a user from
editing/adding to multiple components.

'is_saving': true used to lock the modal. When saving is done switching to false will display a final message. init value is true
'is_started': false used to display a value checking display. Should be false until right before sending the first batch of data. 
  When is_started === true. The modal will display information on the status of the saving.
'total_rows_to_save':  1,
'total_blocking_rows': 1,
'row_start': 0,
'row_end': 0,
'is_save_error': false,
'save_error_msg': "raw html",
'insert_count': 0,
'update_count': 0,
'delete_count': 0,
'upsert_count': 0,

'error_count': 1

Order is_saving = true is_started = false
check initial save conditions. If no blocking rows and rows to save change is_started to true and leave is_save to true. Otherewise switch is_saving to false
and close modal

if is_started = true and is_saving = true
updated row counts and error counts as saving is sending results. 

When all is done switch is_saving to false. A final message will display and the modal can close.
The rowData and columnDefs will be altered based on the the final state. If nothing happens rowData and columnDefs is unchanged.

If all rowData is saved without error. rowData is cleared and the modal can be closed.
Otherwise the app is switched to an error state. The last column will display an error message. And the rows will
show the error message as the last column.

The navbar options will hide everything except reset which will allow the user to clear the rowData, reset the navbar and the
error state.

-->
<template>
    <modal style="border: 1px solid black;"
      name="save-modal"
      transition="nice-modal-fade"
      :min-width="400"
      :delay="10"
      :min-height="100"
      classes= "modal-style"
      @before-open="beforeOpen"
      @before-close="beforeClose">
      <div style="position: relative; height: 100%;">
        <div style="text-align: center; background-color: coral; padding-top: 5px; padding-bottom: 5px; border-bottom: 2px solid black" >Saving Data
          <span v-if="!params.is_saving" @click="closeModal()" style="float: right; color: white; padding-right: 5px; cursor: pointer;" >&times;</span>
        </div>
        <!-- <div style="margin-left: 15px;"> -->

        <div  style="width: 100%; overflow-y: auto; 1px solid black; margin-top: 5px; padding-left: 20px;">
            <div v-if="!params.is_started"> 
              <p v-if="!is_blocking_rows && !no_rows_to_save">Checking</p>
              <p v-if="is_blocking_rows" style="padding-bottom: 10px;" >There are {{params.total_blocking_rows}} row(s) preventing saving from occuring. Please remove or fix these rows. They
                can be identified by using View -> Block Save Rows</p>
              <p v-if="no_rows_to_save" style="padding-bottom: 10px;">No rows were found ready for saving. Please check View -> (Incomplete, Changed, Deleted or Error) to make sure
                your data is correct. </p>

            </div>
            <div v-else>
                <p style="display: block; text-align: center" >Rows Sent To Server: {{ total_rows_sent }} of {{ params.total_rows_to_save}}
                  <span style="padding-left: 8px;"> Saving Rows: {{params.row_start}} - {{params.row_end}} </span>
                </p>
                <p style="text-align: center">Insert Rows: {{params.insert_count}} Update Rows: {{params.update_count}} </p>
                <p style="text-align: center">Delete Rows: {{params.delete_count}} Upsert Rows: {{params.upsert_count}} </p>
                <p style="text-align: center">Server Rejected Rows Due To Error: {{params.error_count}} </p>
              <!-- server error message -->
              <div v-if="params.is_save_error" style="border-top: 1px solid black">
                <h3 style="text-align: center; color:red;">Error</h3>
                <p> An error occured saving data. This may affect the functioning of the app.</p>
                <p> Also not all the values sent to the server may have saved. If the error continues, send error message to admin. Please export your
                  rows for backup to allow for a future attempt.
                </p>
                <br>
                <p> <span v-html="this.params.save_error_msg"></span>  </p>
              </div>
              <!-- instructions if error rows. or if all rows accepted? -->
            </div>

          
            <div v-if="!params.is_saving" > 
              <div v-if="!no_rows_to_save && params.is_started">
                  <p v-if="no_errors">All rows have been saved successful. The grid will be reset. Please run a new query or create a new sheet to make
                    futher changes </p>
                  <p v-else-if="row_errors && server_error"> Rows were rejected during saving and a server level error occured. The server error code may effect the app 
                    please export any remaining data. You can try to push the Reset option in the navbar to reset the app when complete. If the server error continues,
                    please contact the system admin
                  </p>
                  <p v-else-if="row_errors"> Rows were rejected during saving. The error codes will be the last column in the grid. 
                    When you are ready to make additional changes please press the <span style="font-weight: bold;">Reset</span> button at the top. Its advisied to export your rejected rows incase
                    you do not understand them. Please run a new query or create a new sheet to make futher changes. Reset will clear all current rows.
                  </p>
                  <p v-else> A server level error occured. The server error code may effect the app 
                    please export any remaining data. You can try to push the Reset option in the navbar to reset the app when complete. If the server error continues,
                    please contact the system admin
                  </p>
              </div>
              
              <div v-if="!params.is_saving" style="text-align:center;"> <button @click="closeModal()">Close</button>  </div>
              
              
            </div>

        </div>
        <!-- </div> -->
    </div>
    <!-- <div> HI </div> -->
  </modal>
</template>
<script>
const modal_functions  = require("@/library/app_functions/modal_functions")

export default {
  name: 'Save_Modal',
  props: {
    params: {
      // required: true,
      default: function () {return {
          'is_saving': true, //to lock modal
          'is_started': false, 
          'total_rows_to_save':  -1,
          'total_blocking_rows': -1,
          'row_start': 0,
          'row_end': 0,
          'is_save_error': false,
          'save_error_msg': "raw html",
          'insert_count': 0,
          'update_count': 0,
          'delete_count': 0,
          'upsert_count': 0,

          'error_count': 0
      
        }
      }, 

      type: Object
    },

  },
  computed: {
    total_rows_sent: function () {
      return this.params['insert_count'] + this.params['update_count'] + this.params['delete_count'] + this.params['upsert_count'] 
    },
    is_blocking_rows: function() {
      if (this.params.total_blocking_rows > 0) {return true}
      else{ return false}
    },
    no_rows_to_save: function() {
      if (this.params.total_rows_to_save === 0 ) {return true}
      else {return false}
    },
    no_errors: function () {
      if (this.params.error_count === 0 && !this.params.is_save_error) {return true}
      else {return false}
    },
    row_errors: function () {
      if (this.params.error_count > 0 ) {return true}
      else {return false}
    },
    server_error: function () {
      if (this.params.is_save_error > 0 ) {return true}
      else {return false}
    }

  },

  methods: {
    closeModal() {
        this.$modal.hide('save-modal')
    },

    beforeOpen() {},
    beforeClose (event) {
      modal_functions.SavingModalParamsReset(this.params)
      //Stopping close event execution if async function running
      // if (this.isRunning) { event.stop() }
      // reset parameters.
    }

    }
}
</script>

<style scoped>
.helpClass {
    margin-right: 5px; 
    margin-top: 0px;
}

.helpActiveClass {
    color: white;
}

.modal-style {
  border: 2px solid black;
  overflow-y: auto;
}

select {
  padding: 16px 20px;
  border: 2px solid black;
  border-radius: 4px;
  background-color: #f1f1f1;
}

.action_button {
  display: inline-block;
}

.window-style {
  background: grey;
  text-align: center;
  height: 30px;
  padding-top: 5px;
  margin-bottom: 10px;
  border-bottom: 2px solid black;
}

.margin_shift {
  margin-left: 15px;
}

</style>