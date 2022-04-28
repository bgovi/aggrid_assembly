<!--
Used to select what query type to use

The query_route_list stores the route, input_params and descriptions for each query_route to the server. The information is saved in the
params.route_name object. This information is passed to get_route_params inorder to determine what route to send query to and how the
data should be processed via input_params.
-->
<template>
    <modal style="border: 1px solid black;"
      name="querytype-modal"
      draggable=".window-header"
      transition="nice-modal-fade"
      :min-width="400"
      :min-height="500"
      height="500px"
      :delay="10"
      classes= "modal-style"
      :resizable="true"
      @before-open="beforeOpen"
      @before-close="beforeClose">
      <div style="position: relative; height: 100%;">
        <div class="window-header window-style">Select Query Type
          <span @click="closeModal()" style="float: right; color: white; padding-right: 5px;" >&times;</span>
        </div>
        <!-- <div style="margin-left: 15px;"> -->
        <div  style="width: 100%; max-height: 95%; overflow-y: auto; 1px solid black; margin-top: 5px; padding-left: 20px;">

            <p >Select How Data Is Pulled From Server And Populates Grid</p>
            <form style="margin-bottom: 5px; margin-top: 5px;" class="margin_shift">
                   <select v-model="params.route_name" style="display: inline-block; width: 140px; padding: 0px;" class="select">
                      <option v-for="(valx, index2) in query_route_list" :key="index2" :value="valx.route_name">{{valx.route_name}}</option>
                  </select>
            </form>
        </div>
        <!-- descriptions -->
        <div style="margin-bottom: 10 px; margin-top: 10px; border-top: 1px dotted black;">
            <div style="padding-left: 20px; padding-bottom: 5px;"> <span style="font-weight: bold" >Query Description: </span>{{query_description}}  </div>
            <div style="padding-left: 20px; padding-bottom: 5px;"> <span style="font-weight: bold" >Save Type: </span> {{save_type}}  </div>
            <div style="padding-left: 20px; padding-bottom: 5px;"> <span style="font-weight: bold" >Save Description: </span> {{save_description}}  </div>
        </div>
        <!-- end descriptions -->
        <!-- </div> -->
    </div>
    <!-- <div> HI </div> -->
  </modal>
</template>
<script>
export default {
  name: 'Query_Type_Modal',
  props: {
    params: {
      type: Object
    },
    query_routes: {
      type: Object
    }
  },
  computed: {
    query_route_list: function() {
      var route_list = []
      for (let key in this.query_routes) {
        var rowx = {}
        rowx['route_name'] = key
        route_list.push(rowx)
      }
      return route_list
    },
    query_description: function () {
      var route_name = this.params.route_name
      if (this.query_routes.hasOwnProperty(route_name) ) {
        var qp = this.query_routes[route_name]
        if (qp.hasOwnProperty('description') ) {
          return qp['description']
        }
        return "No description available"
      } else {
        return "No description available"
      }
    },
    save_type: function () {
      var route_name = this.params.route_name
      if (this.query_routes.hasOwnProperty(route_name) ) {
        var qp = this.query_routes[route_name]
        if (qp['input_params'].hasOwnProperty('__save_route__') ) {
          return  qp['input_params']['__save_route__']
        }
      }

      return "No save type set. Modifications not allowed"

    },
    save_description: function () {
      var route_name = this.params.route_name
      if (this.query_routes.hasOwnProperty(route_name) ) {
        var qp = this.query_routes[route_name]
        if (qp.hasOwnProperty('save_description') ) {
          return qp['save_description']
        }
        return "No save type set. Modifications not allowed"
      } else {
        return "No save type set. Modifications not allowed"
      }
    }
  },


  methods: {
    closeModal() {
        this.$modal.hide('querytype-modal')
    },

    beforeOpen() {},
    beforeClose() {

    }
  }
}
</script>

<style scoped>
.helpClass {
    cursor: pointer;
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

.window-style:hover {
  cursor: pointer;
}

.margin_shift {
  margin-left: 15px;
}

</style>