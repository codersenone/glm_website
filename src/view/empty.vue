<template>
  <div class="page">

  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {

    }
  },
  components: {

  },
  beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.$router.replace(from.path)
      })
}
}
</script>

<style scoped >
</style>
