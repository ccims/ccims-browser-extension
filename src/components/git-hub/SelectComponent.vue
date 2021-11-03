<!-- Component for selecting a Gropius component -->
<template>
  <div class="dropdown">
    <div class="select-menu-text-filter hx_form-control-spinner-wrapper">
      <input
        v-model.trim="inputValue"
        class="form-control js-filterable-field"
        type="text"
        placeholder="Search for a Component"
      />
    </div>
    <div class="dropdown-list" v-show="componentListVisible">
      <div
        v-for="component in projectComponents"
        :key="component.id"
        class="dropdown-item"
        v-show="itemVisible(component)"
        @click="selectComponent(component.id, component.name)"
      >
        {{ component.name }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Component as GropiusComponent } from "@/generated/graphql";
import { getCCIMSApi } from "@/data/CCIMSApi";

const SelectComponentProps = Vue.extend({
  props: {
    projectId: String,
  },
});

@Component
export default class SelectComponent extends SelectComponentProps {
  private inputValue = "";
  private componentListVisible = true;
  private projectComponents: GropiusComponent[] = [];

  /**
   * Called on created, initializes the components for the selected project (identified by projectId)
   */
  async created(): Promise<void> {
    const api = await getCCIMSApi();
    this.projectComponents =
      (await api?.getComponentsForProject(this.projectId)) ?? [];
  }

  /**
   * This method checks for the given component if the typed string matches the name of the component.
   *
   * @param component the component to compare the
   * @returns true if the typed string matches the name of the component, false if not
   */
  public itemVisible(component: GropiusComponent): boolean {
    let currentName = component.name.toLowerCase();
    let currentInput = this.inputValue.toLowerCase();
    return currentName.includes(currentInput);
  }

  /**
   * This method selects a given component.
   * The choice gets emitted to the parent component.
   *
   * @param componentId id of the component to select
   * @param componentName name of the component to select
   */
  public selectComponent(componentId: string, componentName: string): void {
    this.componentListVisible = false;
    this.inputValue = componentName;
    this.$emit("componentSelected", componentId);
  }
}
</script>
<style lang="scss" scoped>
.dropdown {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}
.dropdown-input,
.dropdown-selected {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid transparent;
  background: #edf2f7;
  line-height: 1.5em;
  outline: none;
  border-radius: 8px;
}
.dropdown-input:focus,
.dropdown-selected:hover {
  background: #fff;
  border-color: #e2e8f0;
}
.dropdown-input::placeholder {
  opacity: 0.7;
}
.dropdown-selected {
  font-weight: bold;
  cursor: pointer;
}
.dropdown-list {
  width: 100%;
  max-height: 500px;
  margin-top: 4px;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 8px;
}
.dropdown-item {
  display: flex;
  width: 100%;
  padding: 11px 16px;
  cursor: pointer;
}
.dropdown-item:hover {
  background: #edf2f7;
}
</style>