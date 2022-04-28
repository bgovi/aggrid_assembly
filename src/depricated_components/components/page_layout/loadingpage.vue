<template>

<div>
  <div v-if="no_loading_error" class="container">
      <h1>Loading Rules And Grid</h1>
      <div class="loader"></div>
      <!-- vif error esle -->
  </div>


  <div style="padding-left: 20px; padding-top: 20px;" v-else>
    <h3>An Error Occured: Please send the system admin the error message below</h3>
    <div style="fint-size: 16px;">{{initial_loading_error}}</div>
    <!-- vif error esle -->
  </div>


</div>

</template>

<script>
//on error remove loader
//display error message
export default {
  props: {
    initial_loading_error: {
      type: String
    }
  },
  computed: {
    no_loading_error: function () {
      if (this.initial_loading_error === "") { return true }
      return false
    }
  }

}
</script>

<style>
/* .container {
  position: absolute;
  left: 40%;
  top: 30%; */

  /* margin: 0 auto;
  min-height: 100vh;
  display: flex; */
  /* justify-content: center;
  align-items: center;
  text-align: center; */
/* } */


.container {
  position: absolute;
  left: 40%;
  top: 30%;
}



/* .break {
  flex-basis: 100%;
  height: 0;
} */

.loader {
  margin-left: 100px;
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>