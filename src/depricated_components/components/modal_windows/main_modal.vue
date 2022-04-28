<!--
The main modal is the interface for all the sub modal windows.  

The majority of the modal data paraeters is initialzied by ./library/query_params.js  in the function
InitializeQueryParams.

The modalParams object will contain specialized insturctions for each modal window.

props:
where:
order_by:
pagination:
columnSortNames:
modalParams:


ModalNames
    this.$modal.show(modalName)
    this.$modal.hide(modalName)
"orderby-modal"
"where-modal"
"page-modal"
"help-modal"
"save-modal"
"init-modal"
-->
<template>
  <div>
    <orderby-modal v-bind:params="modalParams.order_by_modal" v-bind:order_by="order_by" v-bind:columnSortNames="columnSortNames"/>
    <page-modal v-bind:params="modalParams.page_modal" v-bind:pagination="pagination" />
    <where-modal v-bind:params="modalParams.where_modal" v-bind:filters_list="where" />
    <help-modal v-bind:params="modalParams.help_modal" />
    <save-modal v-bind:params="modalParams.save_modal" />
    <loading-modal v-bind:params="modalParams.load_modal" />
    <!-- load modal -->

    <querytype-modal v-bind:params="modalParams.querytype_modal" v-bind:query_routes="query_routes" />

</div>
</template>

<script>


import OrderbyModal from '@/components/modal_windows/modals/orderbyModal.vue'
import PageModal from '@/components/modal_windows/modals/pageModal.vue'
import WhereModal from '@/components/modal_windows/modals/whereModal.vue'
import HelpModal from '@/components/modal_windows/modals/helpModal.vue'
import SaveModal from '@/components/modal_windows/modals/saveModal.vue'
import LoadingModal from '@/components/modal_windows/modals/loadingModal.vue'
import QuerytypeModal from '@/components/modal_windows/modals/queryTypeModal.vue'


export default {

  components: {WhereModal, PageModal, OrderbyModal, HelpModal, SaveModal, LoadingModal, QuerytypeModal},

  props: {
    where: {
      default: function () {return [{}] },
      type: Array
    },
    order_by: {
      default: function () {return [{}] },
      type: Array
    },
    columnSortNames: {
      default: function () {return [{}] },
      type: Array
    },
    pagination: {
      default: function () {return {'offset': 0, 'limit': 1000} },
      type: Object
    },
    query_routes: {
      default: function () {return {} },
      type: Object
    },
    modalParams: {
      default: function () {return {} },
      type: Object
    }
  },
}
</script>
