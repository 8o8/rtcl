<template>
  <div>
    <section class="section">
      <div class="container">
        <NavBar/>
        <hr>
        <div class="content">
          <slot></slot>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
    import NavBar from '~/components/NavBar'
    export default {
        components: {
            NavBar,
        }

    }
</script>

<style scoped>

</style>
