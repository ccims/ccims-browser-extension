<template>
  <div>
    <div class="select-menu-text-filter hx_form-control-spinner-wrapper">
      {{ text }}
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

const SuccessMessageProps = Vue.extend({
  props: {
    text: String,
  },
});

@Component
export default class SuccessMessage extends SuccessMessageProps {
  
}
</script>