<!-- Component to create a new component in the Gropius back-end -->
<template>
  <div>
    <p class="note">Create a new component for the selected Gropius project.</p>
    <div class="select-menu-text-filter hx_form-control-spinner-wrapper">
      Name of the component
      <input
        v-model="componentName"
        class="form-control js-filterable-field"
        type="text"
        placeholder="Name of the component"
      />
    </div>
    <div class="select-menu-text-filter hx_form-control-spinner-wrapper">
      Repository URL
      <input
        v-model="repositoryURL"
        class="form-control js-filterable-field"
        type="text"
        placeholder="Repository URL"
      />
    </div>
    <div class="select-menu-text-filter hx_form-control-spinner-wrapper">
      Description
      <input
        v-model="description"
        class="form-control js-filterable-field"
        type="text"
        placeholder="Add a description"
      />
    </div>
    <button class="btn-primary btn mt-2 ml-2" @click="createComponent()">
      Create Component
    </button>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getCCIMSApi } from "@/data/CCIMSApi";
import { Component as GropiusComponent } from "@/generated/graphql";

const CreateComponentProps = Vue.extend({
  props: {
    projectId: String,
  },
});

@Component
export default class CreateComponent extends CreateComponentProps {
  private componentName = "";
  private description = "";
  private repositoryURL: string | undefined;
  private existingComponent: GropiusComponent | undefined;

  /**
   * Called on create, initializes the component name as well as the repository URL.
   */
  created(): void {
    let target = document
      .querySelector('meta[name="go-import"]')
      ?.getAttribute("content");
    let splittedTarget = target?.split(" ") ?? [""];
    let names = splittedTarget[0].split("/");
    this.componentName = names[names.length - 1];
    this.repositoryURL = splittedTarget[2];
  }

  /**
   * This method is called when the user wants to create the component.
   * A new component is created in the Gropius back-end.
   */
  async createComponent(): Promise<void> {
    const componentExists = await this.checkComponentExists();

    if (!componentExists) {
      const api = await getCCIMSApi();
      let componentId = await api?.createComponent({
        name: this.componentName,
        description: this.description,
        repositoryURL: this.repositoryURL,
        projects: [this.projectId],
      });
      this.$emit("componentCreated", componentId, this.componentName, false);
    } else {
      const api = await getCCIMSApi();
      const componentId = this.existingComponent!.id as string;
      const projectId = this.projectId;
      await api?.addExistingComponentToProject(componentId, projectId);
      this.$emit("componentCreated", componentId, this.componentName, true);
    }
  }

  /**
   * Based on the repositoryURL of the component that is to be created it is decided whether the component already exists.
   */
  async checkComponentExists(): Promise<boolean> {
    let exists = false;
    const api = await getCCIMSApi();
    const allUserComponents = await api?.getUserComponents();
    allUserComponents?.forEach((component) => {
      if (component.repositoryURL === this.repositoryURL) {
        this.existingComponent = component;
        exists = true;
      }
    });
    return exists;
  }
}
</script>