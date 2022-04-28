<!--
This is the vue script for the popup window that is displayed to prevent a user from
editing/adding to multiple components. Need to define expectations of each modal.


'is_loading': this is used to lock the modal window. Set to false when close should be allowed. Generally will self hide if no errors
'offset': display the beginning of row range being loaded
'limit': display the ending of the row range being loaded
'route_name': 'default' the name of the query_type
'is_load_error': boolean. if server error. Need to dislpay
'load_error_msg': raw html message to display if error occurs
'is_end': should set to true when no more rows to load or if an error occurs. Prevent running another data pull
'init_query_no_rows_pulled': set to true with is_end also set to true. This says that no rows were pulled on run query at the beginning.
  user needs to change query parameters.
'is_init': boolean flag set to true when RunQuery is ran. Used to inform that a query has been started.

The values of this module are changed in navbar. The default values are set in query_params using the modal_functions.js module.
-->
<template>
    <modal style="border: 1px solid black;"
      name="load-modal"
      transition="nice-modal-fade"
      :min-width="500"
      :delay="10"
      :min-height="100"
      classes= "modal-style"
      @before-open="beforeOpen"
      @before-close="beforeClose">
      <div style="position: relative; height: 100%;">
        <div style="text-align: center; background-color: coral; padding-top: 5px; padding-bottom: 5px; border-bottom: 2px solid black" >Loading Data
          <span v-if="showClose" @click="closeModal()" style="float: right; color: white; padding-right: 5px; cursor: pointer;" >&times;</span>

        </div>
        <!-- <div style="margin-left: 15px;"> -->
        <div v-if="!params.is_init">
          <p>Run Query must be ran first before requesting the next page. No query has been set yet. Press the play button or goto
            Query -> Run Query
          </p>

        </div>


        <div v-else-if="params.is_end">
          <div  style="width: 100%; overflow-y: auto; 1px solid black; margin-top: 5px; padding-left: 20px;">
              <p>Query Type: {{ params.route_name }}</p>
              <p>End of query reached. No more rows to load.</p>
              <div v-if="params.init_query_no_rows_pulled">
                <p>No rows were returned on the inital query. All rows may have been filtered out.</p>
                <p>You may need to change the filters, pagination or query type. <br> In the Query drop down at the top of the page.</p>
              </div>

              <div v-if="params.is_load_error" style="border-top: 1px solid black">
                <h3 style="text-align: center; color:red;">Error</h3>
                <p> An error occured loading data. This may affect the functioning of the app.</p>
                <p> Please try refreshing the app. If the error continues, send error message to admin.</p>
                <br>
                <p> <span v-html="this.params.load_error_msg"></span>  </p>
              </div>

            <div style="text-align:center; padding-top: 10px;"> <button @click="closeModal()">Close</button> </div>
          </div>
        </div>

        <div v-else>
          <div  style="width: 100%; overflow-y: auto; 1px solid black; margin-top: 5px; padding-left: 20px;">
              <p >Query Type: {{ params.route_name }}</p>
              <p>Loading Rows: {{params.offset }} - {{params.limit}} </p>
          </div>

          <div v-if="params.is_load_error" style="border-top: 1px solid black">
            <h3 style="text-align: center; color:red;">Error</h3>
            <p> An error occured loading data. This may affect the functioning of the app.</p>
            <p> Please try refreshing the app. If the error continues, send error message to admin.</p>
            <br>
            <p> <span v-html="this.params.load_error_msg"></span>  </p>
            <div style="text-align:center;"> <button @click="closeModal()">Close</button> </div>
          </div>
        </div>
        <!-- </div> -->
    </div>
    <!-- <div> HI </div> -->
  </modal>
</template>
<script>
export default {
  name: 'Load_Modal',
  props: {
    params: {
      // required: true,
      default: function () {return {
          'is_loading': true,
          'offset': 0,
          'limit': 1000,
          'route_name': 'default',
          'is_load_error': true,
          'load_error_msg': "raw html",
          'is_end': true,
          'init_query_no_rows_pulled': false, //set true if no rows found on initial query
          'is_init': false,
          'count': 0
      
        }
        //params for page limit reached.
      },
      type: Object
    }

  },
  computed: {
    showClose: function() {
      if (this.params.is_load_error) {return true}
      else if (this.params.is_end) {return true}
      else {return false}
    }
  },

  methods: {
    closeModal() {
        this.$modal.hide('load-modal')
    },

    beforeOpen() {},
    beforeClose (event) {
      if (this.params.is_loading) {
        if (this.params.count < 1) {
          this.params.count += 1
          console.log(event)
          event.cancel()
        } else {
          this.params.count = 0
        }

      }
      //Stopping close event execution if async function running
      // if (this.isRunning) { event.stop() }
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