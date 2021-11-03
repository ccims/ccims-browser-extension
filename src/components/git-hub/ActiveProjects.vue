<!-- Component that displays the active projects in relation to which the related issues are displayed.  -->
<template>
  <div
    id="active-projects"
    class="discussion-sidebar-item js-discussion-sidebar-item"
  >
    <form
      class="js-issue-sidebar-form"
      aria-label="Active Gropius Projects"
      accept-charset="UTF-8"
    >
      <details
        class="details-reset details-overlay select-menu hx_rsm"
        id="active-projects-menu"
      >
        <summary
          class="
            text-bold
            discussion-sidebar-heading discussion-sidebar-toggle
            hx_rsm-trigger
          "
          aria-haspopup="menu"
          role="button"
        >
          <svg
            v-if="isGropiusComponent"
            aria-hidden="true"
            viewBox="0 0 16 16"
            version="1.1"
            height="16"
            width="16"
            class="octicon octicon-gear"
          >
            <path
              fill-rule="evenodd"
              d="M7.429 1.525a6.593 6.593 0 011.142 0c.036.003.108.036.137.146l.289 1.105c.147.56.55.967.997 1.189.174.086.341.183.501.29.417.278.97.423 1.53.27l1.102-.303c.11-.03.175.016.195.046.219.31.41.641.573.989.014.031.022.11-.059.19l-.815.806c-.411.406-.562.957-.53 1.456a4.588 4.588 0 010 .582c-.032.499.119 1.05.53 1.456l.815.806c.08.08.073.159.059.19a6.494 6.494 0 01-.573.99c-.02.029-.086.074-.195.045l-1.103-.303c-.559-.153-1.112-.008-1.529.27-.16.107-.327.204-.5.29-.449.222-.851.628-.998 1.189l-.289 1.105c-.029.11-.101.143-.137.146a6.613 6.613 0 01-1.142 0c-.036-.003-.108-.037-.137-.146l-.289-1.105c-.147-.56-.55-.967-.997-1.189a4.502 4.502 0 01-.501-.29c-.417-.278-.97-.423-1.53-.27l-1.102.303c-.11.03-.175-.016-.195-.046a6.492 6.492 0 01-.573-.989c-.014-.031-.022-.11.059-.19l.815-.806c.411-.406.562-.957.53-1.456a4.587 4.587 0 010-.582c.032-.499-.119-1.05-.53-1.456l-.815-.806c-.08-.08-.073-.159-.059-.19a6.44 6.44 0 01.573-.99c.02-.029.086-.075.195-.045l1.103.303c.559.153 1.112.008 1.529-.27.16-.107.327-.204.5-.29.449-.222.851-.628.998-1.189l.289-1.105c.029-.11.101-.143.137-.146zM8 0c-.236 0-.47.01-.701.03-.743.065-1.29.615-1.458 1.261l-.29 1.106c-.017.066-.078.158-.211.224a5.994 5.994 0 00-.668.386c-.123.082-.233.09-.3.071L3.27 2.776c-.644-.177-1.392.02-1.82.63a7.977 7.977 0 00-.704 1.217c-.315.675-.111 1.422.363 1.891l.815.806c.05.048.098.147.088.294a6.084 6.084 0 000 .772c.01.147-.038.246-.088.294l-.815.806c-.474.469-.678 1.216-.363 1.891.2.428.436.835.704 1.218.428.609 1.176.806 1.82.63l1.103-.303c.066-.019.176-.011.299.071.213.143.436.272.668.386.133.066.194.158.212.224l.289 1.106c.169.646.715 1.196 1.458 1.26a8.094 8.094 0 001.402 0c.743-.064 1.29-.614 1.458-1.26l.29-1.106c.017-.066.078-.158.211-.224a5.98 5.98 0 00.668-.386c.123-.082.233-.09.3-.071l1.102.302c.644.177 1.392-.02 1.82-.63.268-.382.505-.789.704-1.217.315-.675.111-1.422-.364-1.891l-.814-.806c-.05-.048-.098-.147-.088-.294a6.1 6.1 0 000-.772c-.01-.147.039-.246.088-.294l.814-.806c.475-.469.679-1.216.364-1.891a7.992 7.992 0 00-.704-1.218c-.428-.609-1.176-.806-1.82-.63l-1.103.303c-.066.019-.176.011-.299-.071a5.991 5.991 0 00-.668-.386c-.133-.066-.194-.158-.212-.224L10.16 1.29C9.99.645 9.444.095 8.701.031A8.094 8.094 0 008 0zm1.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11 8a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
          Active Gropius Projects
        </summary>

        <div
          v-if="isGropiusComponent"
          class="
            select-menu-modal
            position-absolute
            right-0
            hx_rsm-modal
            js-discussion-sidebar-menu
          "
          style="z-index: 99; overflow: visible"
        >
          <div class="select-menu-header rounded-top-2">
            <header class="SelectMenu-header">
              <span class="SelectMenu-title">Select Active Projects</span>
            </header>
            <div class="js-filterable-issue-labels">
              <div
                v-for="project in allUserProjects"
                :key="project.id"
                @click="changeStatus(project.id)"
              >
                <label
                  class="select-menu-item label-select-menu-item text-normal"
                  aria-checked="true"
                  tabindex="0"
                >
                  <svg
                    aria-hidden="true"
                    height="16"
                    viewBox="0 0 16 16"
                    version="1.1"
                    width="16"
                    class="checkbox"
                    :style="
                      projectActive(project.id)
                        ? 'visibility: visible'
                        : 'visibility: hidden'
                    "
                  >
                    <path
                      fill-rule="evenodd"
                      d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
                    ></path>
                  </svg>
                  <div class="select-menu-item-text">
                    <div>
                      <svg
                        aria-hidden="true"
                        height="16"
                        viewBox="0 0 16 16"
                        version="1.1"
                        width="16"
                        class="octicon ml-2"
                        :style="
                          projectActive(project.id)
                            ? 'visibility: visible'
                            : 'visibility: hidden'
                        "
                      >
                        <path
                          fill-rule="evenodd"
                          d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"
                        ></path>
                      </svg>
                      <div class="css-truncate">
                        <span class="name">{{ project.name }}</span>
                        <div
                          class="
                            description
                            d-block
                            color-text-secondary
                            css-truncate-target
                            m-0
                          "
                        >
                          {{ project.description }}
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </details>
      <div
        class="js-issue-labels d-flex flex-wrap"
        v-if="activeProjects.length > 0"
      >
        <div v-for="project in activeProjects" :key="project.id">
          <a
            style="
              --label-r: 0;
              --label-g: 117;
              --label-b: 202;
              --label-h: 205;
              --label-s: 100;
              --label-l: 39;
            "
            class="IssueLabel hx_IssueLabel width-fit mb-1 mr-1"
          >
            <span class="css-truncate css-truncate-target width-fit">{{
              project.name
            }}</span>
          </a>
        </div>
      </div>
      <div v-else-if="isGropiusComponent">
        <span class="css-truncate sidebar-progress-bar">
          No active projects
        </span>
      </div>
      <div v-else>
        <span class="css-truncate sidebar-progress-bar">
          Component is not in a Gropius project yet
        </span>
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import { Project } from "@/generated/graphql";
import { Component, Vue } from "vue-property-decorator";
import { getCCIMSApi } from "@/data/CCIMSApi";

@Component
export default class ActiveProjects extends Vue {
  private activeProjects: Project[] = [];
  private allUserProjects: Project[] = [];
  private isGropiusComponent = true;

  /**
   * Called on create, adds listeners when browser storage changes and fetches user projects
   */
  async created(): Promise<void> {
    this.fetchUserProjects();
    this.setIsGropiusComponent();
    browser.storage.onChanged.addListener(this.storageChange);
  }

  /**
   * Sets isGropiusComponent to true if the current respository is a Gropius component, false if not
   */
  async setIsGropiusComponent(): Promise<void> {
    let activeComponent = await browser.storage.local.get("component");
    if (
      activeComponent.component !== undefined &&
      activeComponent.component.id !== ""
    ) {
      this.isGropiusComponent = true;
    } else {
      this.isGropiusComponent = false;
    }
  }

  /**
   * This method initializes the current active projects with the corresponding value from browser storage.
   * Additionally, it initializes all Gropius projects in which the current component is included.
   */
  async fetchUserProjects(): Promise<void> {
    let storageReturn = await browser.storage.local.get("project");
    this.activeProjects = storageReturn.project;

    let activeComponent = await browser.storage.local.get("component");
    if (
      activeComponent.component !== undefined &&
      activeComponent.component.id !== ""
    ) {
      this.allUserProjects = activeComponent.component.projects;
    }
  }

  /**
   * When browser storage changes then this method is called.
   * Active projects are initialized with the new value.
   */
  public storageChange(): void {
    this.fetchUserProjects();
  }

  /**
   * This method checks for a given project if it is active or not.
   *
   * @param projectId id of the project to check
   * @returns true if the project is active, false if not
   */
  public projectActive(projectId: string): boolean {
    if (this.activeProjects.filter((x) => x.id === projectId).length === 0) {
      return false;
    }
    return true;
  }

  /**
   * This method changes the status of a given project.
   * That means if it is active then it is set to inactive and if it is inactive it is set to active.
   *
   * @param projectId id of the project to change
   */
  public changeStatus(projectId: string): void {
    if (this.projectActive(projectId)) {
      for (var i = 0; i < this.activeProjects.length; i++) {
        if (this.activeProjects[i].id == projectId) {
          this.activeProjects.splice(i, 1);
        }
      }
    } else {
      this.activeProjects.push(
        this.allUserProjects.filter((x) => x.id === projectId)[0]
      );
    }
    browser.storage.local.set({ project: this.activeProjects });
  }
}
</script>
<style lang="scss" scoped>
svg.checkbox {
  float: left;
  margin-left: -20px;
}
</style>