<template>
<div class="footer">
    <!--========================== Footer ============================-->
      <p style="display: inline; margin-left: 20px;">{{table_name}}</p>
      <p style="display: inline; margin-left: 20px;">permissions: {{permissions}} &nbsp; permission_level: {{user_permissions.permission_level}}

       &nbsp;&nbsp; {{current_route}}: {{save_type}}

      </p>
</div>
</template>

<script>
export default {
  props: {
    table_name: {
      type: String,
      default: "Undefined Table"
    },
    query_routes: {
      type: Object

    },
    user_permissions: {
      type: Object,
      default: function () {
          return {
                'allow_read': false,
                'allow_insert': false,
                'allow_update': false,
                'allow_deactivate': false,
                'allow_delete': false,
                'is_admin': false,
                'is_assigned': false,
                'permission_level': 0
        }
      }


    },
    load_modalParams: {
      type: Object

    }



  },
  // data: function () {
  //   return {
  //     permissions: "rwuda"
  //   }
  // },
  computed: {
    permissions: function () {
      var permsx = "" //rwuda"
      if (this.user_permissions['allow_read']) {permsx += 'r'}
      if (this.user_permissions['allow_insert']) {permsx += 'i'}
      if (this.user_permissions['allow_updated']) {permsx += 'u'}
      if (this.user_permissions['allow_deactivate']) {permsx += 'h'}
      if (this.user_permissions['allow_delete']) {permsx += 'd'}
      if (this.user_permissions['is_admin']) {permsx += 'a'}
      return permsx
    },
    current_route: function () {
      return this.load_modalParams.route_name
    },
    save_type: function () {
      if (! this.load_modalParams.hasOwnProperty('route_name')) {return ""}
      var route_name = this.load_modalParams.route_name
      if (! this.query_routes.hasOwnProperty(route_name)) {return ""}
      if (! this.query_routes[route_name].hasOwnProperty('input_params')) {return ""}
      if (! this.query_routes[route_name]['input_params'].hasOwnProperty('__save_route__')) {return ""}
      return this.query_routes[route_name]['input_params']['__save_route__']

    }
  }

}
</script>

<style scoped>
.footer {
    overflow: hidden;
    height: 30px;
    background-color: #333;
    color: white;
    font-size: 16px;
}




</style>