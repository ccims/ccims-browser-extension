<!-- Component for a popup that shows detailed information on an issue -->
<template>
  <div
    class="Popover js-hovercard-content position-absolute"
    style="outline: none; z-index: 100; display: block"
    :style="myStyle"
  >
    <div
      class="
        Popover-message Popover-message--large
        Box
        color-shadow-large
        Popover-message--right-bottom
      "
      style="width: 360px; height: max-content"
    >
      <div>
        <div class="pb-3 px-3">
          <div class="d-flex mt-3">
            <div class="flex-self-start text-center">
              <div class="rounded-1 overflow-hidden">
                <img :src="iconPath" />
              </div>
            </div>

            <div class="overflow-hidden ml-3 f5 text-bold">
              {{ issueTitle }}
              <div class="mt-1">
                <div></div>
              </div>
            </div>
          </div>

          <hr class="ml-n3 mr-n3" />

          <div class="d-flex flex-items-baseline f6 mt-1 color-text-secondary">
            <span class="lh-condensed">
              {{ issueBody }}
            </span>
          </div>
          <div
            class="
              d-flex
              flex-items-baseline
              f6
              mt-1
              color-text-secondary
              text-bold
            "
          >
            <span class="lh-condensed">
              Components concerned by the issue
            </span>
          </div>
          <div
            v-for="component in issueComponents"
            :key="component.name"
            class="d-flex flex-items-baseline f6 mt-1 color-text-secondary"
          >
            <span class="lh-condensed">
              {{ component.name }}
            </span>
            <span class="lh-condensed text-bold">
              {{ getProjectNames(component.projects) }}
            </span>
          </div>
          <br />
          <div
            class="
              d-flex
              flex-items-baseline
              f6
              mt-1
              color-text-secondary
              text-bold
            "
          >
            <span class="lh-condensed"> Projects concerned by the issue </span>
          </div>
          <div
            v-for="(project, index) in issueProjects"
            :key="index"
            class="d-flex flex-items-baseline f6 mt-1 color-text-secondary"
          >
            <span class="lh-condensed">
              {{ project }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

const IssueDetailProps = Vue.extend({
  props: {
    iconPath: String,
    issueTitle: String,
    issueCategory: String,
    issueBody: String,
    relationship: String,
    issueComponents: Array,
    left: Number,
    top: Number,
  },
});

@Component
export default class IssueDetail extends IssueDetailProps {
  private myStyle = "";

  /**
   * Called when initialized.
   * Calls the function to set the style of the issue popup.
   */
  mounted(): void {
    this.initMyStyle();
  }

  /**
   * Get all the Gropius projects that are concerned by the issue.
   */
  get issueProjects(): string[] {
    let issueProjects: string[] = [];
    this.issueComponents.forEach((component: any) => {
      component.projects.forEach((project: string) => {
        if (!issueProjects.includes(project)) {
          issueProjects.push(project);
        }
      });
    });
    return issueProjects;
  }

  /**
   * Initializes myStyle attribute which is the css style of the issue popup.
   */
  public initMyStyle(): void {
    const element = document.getElementsByClassName(
      "Popover js-hovercard-content position-absolute"
    )[0] as HTMLElement;
    const height = element.offsetHeight;
    const width = element.offsetWidth;
    this.myStyle =
      "left: " +
      (this.left - width - 10) +
      "px; top: " +
      (this.top - height + 30) +
      "px;";
  }

  /**
   * This method returns a string consisting of all active projects that are concerned by the issue.
   *
   * @param projects array of Gropius project names
   * @returns a string with the names of all Gropius projects, separated by a comma
   */
  getProjectNames(projects: string[]): string {
    let projectNames = " (";
    let count = 0;
    projects.forEach((project) => {
      if (count === 0) {
        projectNames = projectNames + project;
        count++;
      } else {
        projectNames = projectNames + ", " + project;
      }
    });
    return projectNames + ")";
  }
}
</script>