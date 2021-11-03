<template>
  <div v-if="!projectCreation" class="dropdown">
    <div class="select-menu-text-filter hx_form-control-spinner-wrapper">
      <input
        v-model.trim="inputValue"
        class="form-control js-filterable-field"
        type="text"
        placeholder="Search for a Gropius project or create a new one"
      />
    </div>
    <div class="dropdown-list" v-show="projectListVisible">
      <div
        class="dropdown-item"
        v-if="inputValue.length > 0"
        @click="setProjectCreation()"
      >
        Create new project
      </div>
      <div v-if="userProjects.length > 0">
        <div
          v-for="project in userProjects"
          :key="project.id"
          class="dropdown-item"
          v-show="itemVisible(project)"
          @click="selectProject(project.id, project.name)"
        >
          {{ project.name }}
        </div>
      </div>
      <div v-else-if="inputValue.length == 0">
        <span class="css-truncate sidebar-progress-bar center-text">
          None yet
        </span>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="select-menu-text-filter hx_form-control-spinner-wrapper">
      Name of the project
      <input
        v-model="inputValue"
        class="form-control js-filterable-field"
        type="text"
        placeholder="Name of the project"
      />
    </div>
    <div class="select-menu-text-filter hx_form-control-spinner-wrapper">
      Description
      <input
        v-model="projectDescription"
        class="form-control js-filterable-field"
        type="text"
        placeholder="Description of the project"
      />
    </div>
    <button class="btn-primary btn mt-2 ml-2" @click="createProject()">
      Create Project
    </button>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Project } from "@/generated/graphql";
import { getCCIMSApi } from "@/data/CCIMSApi";

@Component
export default class SelectProject extends Vue {
  private inputValue = "";
  private projectListVisible = true;
  private api = getCCIMSApi();
  private userProjects: Project[] = [];
  private shownProjects: Project[] = [];
  private projectCreation = false;
  private projectDescription = "";

  async created(): Promise<void> {
    this.fetchUserProjects();
  }

  /**
   * All projects the current user is assigned to are fetched
   */
  async fetchUserProjects(): Promise<void> {
    const api = await getCCIMSApi();
    this.userProjects = (await api?.getUserProjects()) ?? [];
  }

  /**
   * This method is needed for the suggestions when the user types a project name and
   *
   * It checks for the given project if the typed string matches the name of the project
   */
  public itemVisible(project: Project): boolean {
    let currentName = project.name.toLowerCase();
    let currentInput = this.inputValue.toLowerCase();
    if (currentName.includes(currentInput)) {
      if (!this.shownProjects?.includes(project)) {
        this.shownProjects.push(project);
      }
      return true;
    }
    return false;
  }

  /**
   * This method selects one of the user's projects based on the given projectId.
   * The choice gets emitted to the parent component.
   */
  public selectProject(projectId: string, projectName: string): void {
    this.projectListVisible = false;
    this.inputValue = projectName;
    this.$emit("projectSelected", projectId, projectName);
  }

  /**
   * Page to set name and description for the new project is shown.
   */
  public setProjectCreation(): void {
    this.projectCreation = true;
  }

  /**
   * New project is created with name as the current inputValue and description as the current projectDescription.
   */
  async createProject(): Promise<void> {
    const api = await getCCIMSApi();
    const createdProject = await api?.createProject({
      name: this.inputValue,
      description: this.projectDescription,
    });
    const projectId = createdProject?.createProject?.project?.id;
    const projectName = createdProject?.createProject?.project?.name;

    this.fetchUserProjects();
    this.projectCreation = false;
    this.$emit("projectSelected", projectId, projectName);
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
.center-text {
  display: flex;
  justify-content: center;
}
</style>