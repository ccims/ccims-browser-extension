<!-- Container for the steps that have to be carried out when adding a component to a Gropius project. -->
<template>
  <div class="popup">
    <div class="popup__container">
      <header class="SelectMenu-header">
        <span class="h2">Add a new component to a Gropius project</span
        ><button
          type="button"
          class="SelectMenu-closeButton top-right"
          @click="closePopup()"
        >
          <svg
            aria-label="Close menu"
            aria-hidden="false"
            role="img"
            height="16"
            viewBox="0 0 16 16"
            version="1.1"
            width="16"
            class="octicon octicon-x"
          >
            <path
              fill-rule="evenodd"
              d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"
            ></path>
          </svg>
        </button>
      </header>
      <!-- First step: select Gropius project -->
      <select-project
        v-if="stepNumber === 0"
        @projectSelected="setActiveProject"
      ></select-project>
      <!-- Second step: create the component -->
      <create-component
        v-if="stepNumber === 1"
        :projectId="activeProjectId"
        @componentCreated="componentCreated"
      ></create-component>
      <!-- Third step: showing a succes message -->
      <success v-if="stepNumber === 2" :text="successText"></success>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SelectProject from "./SelectProject.vue";
import CreateComponent from "./CreateComponent.vue";
import SuccessMessage from "./SuccessMessage.vue";

@Component({
  components: {
    "select-project": SelectProject,
    "create-component": CreateComponent,
    success: SuccessMessage,
  },
})
export default class AddComponentToProject extends Vue {
  private activeProjectId = "";
  private activeProjectName = "";
  private stepNumber = 0;
  private successText = "";

  /**
   * By calling this method the popup is closed.
   * This is done in parent component so we have to emit this to the parent component.
   * All relevant properties are reset.
   */
  public closePopup(): void {
    this.stepNumber = 0;
    this.activeProjectId = "";
    this.$emit("close");
  }

  /**
   * This method is called when project is selected in select-project component.
   * The id of the project to add the component to is stored to activeProjectId.
   * Step number is increased to go on to the next step.
   *
   * @param projectId id of the project to add the component to
   */
  public setActiveProject(projectId: string, projectName: string): void {
    this.stepNumber++;
    this.activeProjectId = projectId;
    this.activeProjectName = projectName;
  }

  /**
   * After a component is created this method is called and the active component is initialized in the browser local storage.
   * Step number is increased to go on to the next step.
   *
   * @param componentId id of the created component
   * @param componentName name of the created component
   */
  async componentCreated(
    componentId: string,
    componentName: string,
    existingComponent: boolean
  ): Promise<void> {
    if (!existingComponent) {
      browser.storage.local.set({
        component: {
          name: componentName,
          id: componentId,
          issues: [],
          projects: [
            { id: this.activeProjectId, name: this.activeProjectName },
          ],
        },
      });
    } else {
      const component = await browser.storage.local.get("component");
      const existingProjects = component.component.projects;
      const newProject = [
        {
          id: this.activeProjectId,
          name: this.activeProjectName,
        },
      ];
      const projects = existingProjects.concat(newProject);
      browser.storage.local.set({
        component: {
          name: componentName,
          id: componentId,
          issues: [],
          projects: projects,
        },
      });
    }

    this.stepNumber++;
    this.successText =
      "You have successfully added the component '" +
      componentName +
      "' to the Gropius project '" +
      this.activeProjectName +
      "'!";
  }
}
</script>

<style lang="scss">
.popup {
  position: fixed;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  transition: opacity 500ms;
  opacity: 1;

  &__container {
    margin: 70px auto;
    padding: 20px;
    background: #fff;
    border-radius: 5px;
    width: 60%;
    position: relative;
    transition: all 5s ease-in-out;
  }
}
.top-right {
  position: absolute;
  top: 0;
  right: 0;
  margin: 5px;
}
</style>