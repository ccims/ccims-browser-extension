<!-- Component for the overview of Gropius projects the current component is included -->
<template>
  <div id="project-list-container" class="BorderGrid-cell">
    <h2 class="h4 mb-3">Gropius Projects</h2>
    <div v-if="userProjects.length > 0">
      <div
        class="text-small color-text-secondary"
        v-for="project in userProjects"
        :key="project.id"
      >
        {{ project.name }}
      </div>
    </div>
    <div v-else>
      <span class="css-truncate sidebar-progress-bar"> None yet </span>
    </div>
    <div class="text-small color-text-secondary">
      <a @click="openPopup()">Add Component to a Gropius Project</a>
    </div>
    <add-to-project @close="closePopup()" v-show="showPopup"></add-to-project>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AddComponentToProject from "./AddComponentToProject.vue";
import { Project } from "@/generated/graphql";

@Component({
  components: {
    "add-to-project": AddComponentToProject,
  },
})
export default class ProjectList extends Vue {
  private showPopup = false;
  private userProjects: Project[] = [];

  /**
   * Called when initialized, adds a listener when browser storage is updated.
   * Gropius projects in which the current component is are fetched.
   */
  async mounted(): Promise<void> {
    browser.storage.onChanged.addListener(this.logStorageChange);
    this.fetchUserProjects();
  }

  /**
   * All projects the the current component is included in are fetched and stored in userProjects.
   */
  async fetchUserProjects(): Promise<void> {
    let activeComponent = await browser.storage.local.get("component");
    if (
      activeComponent.component !== undefined &&
      activeComponent.component.id !== ""
    ) {
      this.userProjects = activeComponent.component.projects;
    } else {
      this.userProjects = [];
    }
  }

  /**
   * If browser storage changes this method is called and fetches user projects.
   */
  public logStorageChange(): void {
    this.fetchUserProjects();
  }

  /**
   * This method opens a popup to add the component to another project.
   */
  public openPopup(): void {
    this.showPopup = true;
  }

  /**
   * This method closes the popup to add the component to another project.
   */
  public closePopup(): void {
    this.showPopup = false;
  }
}
</script>

<style lang="scss">
a:hover {
  cursor: pointer;
}
</style>