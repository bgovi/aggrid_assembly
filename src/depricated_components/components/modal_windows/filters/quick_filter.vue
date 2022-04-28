<!--
Quick Filter

Need to add max length?
-->
<template>
        <div  class="containerClass">
          <h4 v-bind:class="{bottomBorder: filter_data.filter_show }" class="headerClass"> Quick Filter
            <input type="checkbox" id="hide" name="hide" v-model="filter_data.filter_show" class="hideFilterClass">
            <span v-if="filter_data.filter_show" @click="toggleHelp()" style="float: right;" v-bind:class="{helpClass: true, helpActiveClass: filter_data.help_active}">&#63;</span>
          </h4>

            <template v-if="filter_data.filter_show">

                <div style="margin-bottom: 10px; margin-top: 10px; margin-left: auto; text-align: center;">
                    <label for="qfilter">quick filter = </label>
                    <input type="text" id="qfilter" name="qfilter" v-model="filter_data.value" size="50">
                </div>

            <!-- help -->
            <help-filter-window v-if="filter_data.help_active" :data_description="filter_data.data_describe" :filter_description="filter_description"
                :data_type="filter_data.data_type" />
            <!-- template for hiding -->
            </template>
        </div>

</template>
<script>
import HelpFilterWindow from '@/components/modal_windows/filters/help_filter_window.vue'
const quick_filter_description = "Will do a quick search against every column in every row to find possible matches. Similar to a google search"

export default {
  name: 'Quick_Filter_Entry',
  components: {HelpFilterWindow},
  props: {
    filter_data: {
      default: function () {
        return {'data_type': 'quick_filter',
        'query_type': "quick_filter",
        'filter_active': true,
        'filter_show': true,
        'help_active': false,
        'data_describe': "",
        'value': ""
        } 
      },
      type: Object
    }


  },
  data () {
    return {
    //before, after, between or on
    //  data_type: "string",
    //  query_type: "quick_filter",
    //  variable_name: "test_string", //what to call the variable??
    //  value: "",
    //  isShow: true,
    //  helpActive: false,
     filter_description: quick_filter_description,

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
