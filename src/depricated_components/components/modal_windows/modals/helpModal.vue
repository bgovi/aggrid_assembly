<!--
This is the vue script for the popup window that is displayed to prevent a user from
editing/adding to multiple components.
-->
<template>
    <modal style="border: 1px solid black;"
      name="help-modal"
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
        <div class="window-header window-style">Help
          <span @click="closeModal()" style="float: right; color: white; padding-right: 5px;" >&times;</span>
        </div>
        <!-- <div style="margin-left: 15px;"> -->
        <div  style="width: 100%; max-height: 95%; overflow-y: auto; 1px solid black; margin-top: 5px; padding-left: 20px;">

            <span v-html="params.help_msg"> </span>

        </div>
        <!-- </div> -->
    </div>
    <!-- <div> HI </div> -->
  </modal>
</template>
<script>
export default {
  name: 'Help_Modal',
  props: {
    params: {
      // required: true,
      default: function () {return {'help_msg': "Help statement place holder" }  },
      type: Object
    }
  },



  methods: {
    closeModal() {
        this.$modal.hide('help-modal')
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