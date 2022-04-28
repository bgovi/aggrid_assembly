<!--
This is the vue script for the popup window that is displayed to prevent a user from
editing/adding to multiple components.

imported from paramsModal
in, equals , greater_equal, greater, less, less_equal, between, not_between

['value']['value_list']
['value']['value_1']
['value']['value_2']

Add border ?

true
false
null

if null. dont send to server side.
-->
<template>

        <div  class="containerClass">
          <h4 v-bind:class="{bottomBorder: filter_data.filter_show }" class="headerClass"> {{filter_data.variable_name}}
            <input type="checkbox" id="hide" name="hide" v-model="filter_data.filter_show" class="hideFilterClass">
            <span v-if="filter_data.filter_show" @click="toggleHelp()" style="float: right;" v-bind:class="{helpClass: true, helpActiveClass:filter_data.help_active}">&#63;</span>
          </h4>


            <template v-if="filter_data.filter_show">

            <div style="padding-bottom: 5px; padding-left: 10px;">
                <div>
                <label for="allowUpdate">allowUpdate:</label>
                <select name="allowUpdate" v-model="filter_data.value.allow_update" style="padding: 0px;">
                    <option value="true">True</option>
                    <option value="false">False</option>
                    <option value="null">Either</option>
                </select>
                    

                </div>
                <div>
                    <label for="allowDelete">allowDelete:&nbsp;</label>
                    <select name="allowDelete" v-model="filter_data.value.allow_delete" style=" padding: 0px;">
                        <option value="true">True</option>
                        <option value="false">False</option>
                        <option value="null">Either</option>
                    </select>

                </div>
                <div v-if="filter_data.is_assigned_filter" >
                    <label for="isAssigned">isAssigned:  &nbsp;</label>
                    <select name="isAssigned" v-model="filter_data.value.is_assigned" style=" padding: 0px;">
                        <option value="true">True</option>
                        <option value="false">False</option>
                        <option value="null">Either</option>
                    </select>
                </div>
            </div>
            <!-- template for hiding -->
            <help-filter-window v-if="filter_data.help_active" :data_description="filter_data.data_describe" :filter_description="filter_description"
              :data_type="filter_data.data_type" />

            </template>
        </div>

</template>
<script>
import HelpFilterWindow from '@/components/modal_windows/filters/help_filter_window.vue'
const permissions_filter_description = "this is a description of the permissions filter"

export default {
  name: 'Permissions_Filter_Entry',
  components: {HelpFilterWindow},
  props: {
    filter_data: {
      default: function () {
        return {'data_type': 'permissions',
        'query_type': "permissions",
        'filter_active': true,
        'filter_show': true,
        'help_active': false,
        'allow_update': 'true',
        'allow_delete': 'true',
        'is_assigned': 'true',
        'is_assigned_filter': false,
        'data_describe': "",
        'variable_name': 'permissions'
        } 
      },
      type: Object
    }

  },


  data () {
    return {
    //before, after, between or on
     filter_description: permissions_filter_description,
    //  data_type: "boolean",
    //  variable_name: "permissions",
    //  filter_description: permissions_filter_description,
    //  allowUpdate: true,
    //  allowDelete: true,
    //  isAssigned: true,
    //  isShow: true,
    //  helpActive: false
    }
  },

  methods: {
    toggleHelp() {
      this.filter_data.help_active = !this.filter_data.help_active
    }

  }
}
</script>

<style scoped>
@import '@/assets/filterStyle.css';

</style>
