<!-- Component for the list and management of related issues -->
<template>
  <div
    id="related-issue-list"
    class="discussion-sidebar-item js-discussion-sidebar-item"
  >
    <form
      class="js-issue-sidebar-form"
      aria-label="Select projects"
      accept-charset="UTF-8"
      method="post"
    >
      <details
        class="details-reset details-overlay select-menu hx_rsm"
        id="issues-select-menu"
      >
        <summary
          class="
            text-bold
            discussion-sidebar-heading discussion-sidebar-toggle
            hx_rsm-trigger
          "
          aria-haspopup="menu"
          data-hotkey="p"
          role="button"
        >
          <svg
            v-if="isGropiusComponent"
            aria-hidden="true"
            viewBox="0 0 16 16"
            version="1.1"
            data-view-component="true"
            height="16"
            width="16"
            class="octicon octicon-gear"
          >
            <path
              fill-rule="evenodd"
              d="M7.429 1.525a6.593 6.593 0 011.142 0c.036.003.108.036.137.146l.289 1.105c.147.56.55.967.997 1.189.174.086.341.183.501.29.417.278.97.423 1.53.27l1.102-.303c.11-.03.175.016.195.046.219.31.41.641.573.989.014.031.022.11-.059.19l-.815.806c-.411.406-.562.957-.53 1.456a4.588 4.588 0 010 .582c-.032.499.119 1.05.53 1.456l.815.806c.08.08.073.159.059.19a6.494 6.494 0 01-.573.99c-.02.029-.086.074-.195.045l-1.103-.303c-.559-.153-1.112-.008-1.529.27-.16.107-.327.204-.5.29-.449.222-.851.628-.998 1.189l-.289 1.105c-.029.11-.101.143-.137.146a6.613 6.613 0 01-1.142 0c-.036-.003-.108-.037-.137-.146l-.289-1.105c-.147-.56-.55-.967-.997-1.189a4.502 4.502 0 01-.501-.29c-.417-.278-.97-.423-1.53-.27l-1.102.303c-.11.03-.175-.016-.195-.046a6.492 6.492 0 01-.573-.989c-.014-.031-.022-.11.059-.19l.815-.806c.411-.406.562-.957.53-1.456a4.587 4.587 0 010-.582c.032-.499-.119-1.05-.53-1.456l-.815-.806c-.08-.08-.073-.159-.059-.19a6.44 6.44 0 01.573-.99c.02-.029.086-.075.195-.045l1.103.303c.559.153 1.112.008 1.529-.27.16-.107.327-.204.5-.29.449-.222.851-.628.998-1.189l.289-1.105c.029-.11.101-.143.137-.146zM8 0c-.236 0-.47.01-.701.03-.743.065-1.29.615-1.458 1.261l-.29 1.106c-.017.066-.078.158-.211.224a5.994 5.994 0 00-.668.386c-.123.082-.233.09-.3.071L3.27 2.776c-.644-.177-1.392.02-1.82.63a7.977 7.977 0 00-.704 1.217c-.315.675-.111 1.422.363 1.891l.815.806c.05.048.098.147.088.294a6.084 6.084 0 000 .772c.01.147-.038.246-.088.294l-.815.806c-.474.469-.678 1.216-.363 1.891.2.428.436.835.704 1.218.428.609 1.176.806 1.82.63l1.103-.303c.066-.019.176-.011.299.071.213.143.436.272.668.386.133.066.194.158.212.224l.289 1.106c.169.646.715 1.196 1.458 1.26a8.094 8.094 0 001.402 0c.743-.064 1.29-.614 1.458-1.26l.29-1.106c.017-.066.078-.158.211-.224a5.98 5.98 0 00.668-.386c.123-.082.233-.09.3-.071l1.102.302c.644.177 1.392-.02 1.82-.63.268-.382.505-.789.704-1.217.315-.675.111-1.422-.364-1.891l-.814-.806c-.05-.048-.098-.147-.088-.294a6.1 6.1 0 000-.772c-.01-.147.039-.246.088-.294l.814-.806c.475-.469.679-1.216.364-1.891a7.992 7.992 0 00-.704-1.218c-.428-.609-1.176-.806-1.82-.63l-1.103.303c-.066.019-.176.011-.299-.071a5.991 5.991 0 00-.668-.386c-.133-.066-.194-.158-.212-.224L10.16 1.29C9.99.645 9.444.095 8.701.031A8.094 8.094 0 008 0zm1.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11 8a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
          Related Issues
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
              <button
                class="SelectMenu-closeButton"
                v-if="stepNumber > 0"
                @click="decreaseStepNumber()"
              >
                <span class="text-bold Link--primary lock-toggle-link">
                  <svg
                    aria-hidden="true"
                    height="16"
                    viewBox="0 0 16 16"
                    version="1.1"
                    width="16"
                    data-view-component="true"
                    class="octicon octicon-arrow-left"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.78 12.53a.75.75 0 01-1.06 0L2.47 8.28a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L4.81 7h7.44a.75.75 0 010 1.5H4.81l2.97 2.97a.75.75 0 010 1.06z"
                    ></path>
                  </svg>
                </span>
              </button>
              <span class="SelectMenu-title">{{ stepDescription }}</span>
            </header>
            <select-project
              v-if="stepNumber === 0"
              @projectSelected="setActiveProject"
            ></select-project>
            <select-component
              v-else-if="stepNumber === 1"
              @componentSelected="setActiveComponent"
              :projectId="activeProjectId"
            ></select-component>
            <select-issue
              v-else-if="stepNumber === 2"
              :componentId="activeComponentId"
              @issueSelected="setActiveIssue"
            ></select-issue>
            <issue-rel
              v-else-if="stepNumber === 3"
              :sourceIssueName="currentIssueTitle"
              :sourceIssueId="currentIssueId"
              :targetIssueName="selectedIssueName"
              :targetIssueId="selectedIssueId"
              :componentId="activeComponentId"
              @closeDetails="closeDetails()"
            ></issue-rel>
          </div>
        </div>
      </details>
      <div v-if="relatedIssuesLinkedBy.length || relatedIssuesLinksTo.length">
        <div
          :id="issue.title + '-link-to'"
          v-for="(issue, index) in relatedIssuesLinksTo"
          :key="issue.id"
        >
          <span
            class="css-truncate js-issue-assignees"
            @mouseover="showIssuePopup(issue.id)"
            @mouseleave="hideIssuePopup(issue.id)"
          >
            <p>
              <span class="d-flex min-width-0 flex-1 js-hovercard-left">
                <a
                  class="no-underline"
                  :href="issue.components.nodes[0].repositoryURL"
                >
                  <img :src="getIconPath(issue)" />
                </a>
                <a
                  class="assignee Link--primary css-truncate-target width-fit"
                  :href="issue.components.nodes[0].repositoryURL"
                >
                  <span
                    class="
                      css-truncate-target
                      width-fit
                      v-align-middle
                      text-bold
                    "
                    >{{ issue.title }}</span
                  >
                  <br />
                  <span class="css-truncate-target width-fit v-align-middle">{{
                    getComponentNames(issue)
                  }}</span>
                </a>
              </span>
            </p>
          </span>
          <issue-detail
            v-if="isIssuePopupVisible(issue.id)"
            :left="getLeft(index, issue.title, '-link-to')"
            :top="getTop(index, issue.title, '-link-to')"
            :issueTitle="issue.title"
            :issueComponents="getIssueComponents(issue)"
            :iconPath="getIconPath(issue)"
          ></issue-detail>
        </div>
        <div
          :id="issue.title + '-linked-by'"
          v-for="(issue, index) in relatedIssuesLinkedBy"
          :key="issue.id"
        >
          <span
            class="css-truncate js-issue-assignees"
            @mouseover="showIssuePopup(issue.id)"
            @mouseleave="hideIssuePopup(issue.id)"
          >
            <p>
              <span class="d-flex min-width-0 flex-1 js-hovercard-left">
                <a
                  class="no-underline"
                  :href="issue.components.nodes[0].repositoryURL"
                >
                  <img :src="getIconPath(issue)" />
                </a>
                <a
                  class="assignee Link--primary css-truncate-target width-fit"
                  :href="issue.components.nodes[0].repositoryURL"
                >
                  <span
                    class="
                      css-truncate-target
                      width-fit
                      v-align-middle
                      text-bold
                    "
                    >{{ issue.title }}</span
                  >
                  <br />
                  <span class="css-truncate-target width-fit v-align-middle">{{
                    getComponentNames(issue)
                  }}</span>
                </a>
              </span>
            </p>
          </span>
          <issue-detail
            v-if="isIssuePopupVisible(issue.id)"
            :left="getLeft(index, issue.title, '-linked-by')"
            :top="getTop(index, issue.title, '-linked-by')"
            :issueTitle="issue.title"
            :issueComponents="getIssueComponents(issue)"
            :iconPath="getIconPath(issue)"
          ></issue-detail>
        </div>
      </div>
      <div v-else-if="isGropiusComponent">
        <span class="css-truncate sidebar-progress-bar"> None yet </span>
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
import { Component, Vue } from "vue-property-decorator";
import IssueRelationSpecification from "./IssueRelationSpecification.vue";
import SelectProject from "./SelectProject.vue";
import SelectComponent from "./SelectComponent.vue";
import {
  Issue,
  Project,
  Component as GropiusComponent,
} from "@/generated/graphql";
import { getCCIMSApi } from "@/data/CCIMSApi";
import IssueDetail from "./IssueDetail.vue";
import SelectIssue from "./SelectIssue.vue";
import { getIconForIssue } from "@/data/Icons";

interface ShowIssuePopup {
  issues: [
    {
      visible: boolean;
      id: string;
    }?
  ];
}

@Component({
  components: {
    "issue-rel": IssueRelationSpecification,
    "select-project": SelectProject,
    "select-component": SelectComponent,
    "issue-detail": IssueDetail,
    "select-issue": SelectIssue,
  },
})
export default class RelatedIssueList extends Vue {
  private stepNumber = 0;
  private activeProjectId = "";
  private activeComponentId = "";
  private currentIssueId = "";
  private currentIssueTitle = "";
  private selectedIssueId = "";
  private selectedIssueName = "";
  private relatedIssuesLinkedBy: any = [];
  private relatedIssuesLinksTo: any = [];
  private issuePopup: ShowIssuePopup = { issues: [] };
  private activeProjects: string[] = [];
  private isGropiusComponent = true;

  /**
   * Called when initialized, adds a listener when browser storage is updated.
   * Current issue and its related issues are initialized.
   */
  async created(): Promise<void> {
    browser.storage.onChanged.addListener(this.logStorageChange);
    await this.setCurrentIssueDetails();
    await this.initActiveProjectIds();
    this.setIsGropiusComponent();
    if (this.currentIssueId !== "") {
      await this.initRelatedIssuesLinkedBy();
      await this.initRelatedIssuesLinksTo();
      this.initIssuePopup();
    }
  }

  /**
   * Get the description of the current step when a related issue is added.
   */
  get stepDescription(): string {
    switch (this.stepNumber) {
      case 0:
        return "Select a Project";
      case 1:
        return "Select a Component";
      case 2:
        return "Select or Create an Issue";
      default:
        return "Specify the Issue Relationship";
    }
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
   * This method initializes the issuePopup object.
   * For each related issue an object consisting of the fields visible and id is inserted.
   * Id is the id of the corresponding issue and visible is initially false.
   */
  public initIssuePopup(): void {
    for (var i = 0; i < this.relatedIssuesLinksTo.length; i++) {
      this.issuePopup.issues.push({
        visible: false,
        id: this.relatedIssuesLinksTo[i].id,
      });
    }
    for (var j = 0; j < this.relatedIssuesLinkedBy.length; j++) {
      this.issuePopup.issues.push({
        visible: false,
        id: this.relatedIssuesLinkedBy[j].id,
      });
    }
  }

  /**
   * This method fetches all ids of Gropius projects in which the current component is included.
   */
  async initActiveProjectIds(): Promise<void> {
    this.activeProjects = [];
    const storageProjects = await browser.storage.local.get("project");
    storageProjects.project.forEach((project: Project) =>
      this.activeProjects.push(project.id as string)
    );
  }

  /**
   * This method initilaizes an array of all related issues that link to the current issues.
   * Only related issues that are assigned to components of the active projects are inserted.
   */
  async initRelatedIssuesLinkedBy(): Promise<void> {
    this.relatedIssuesLinkedBy = [];
    const api = await getCCIMSApi();
    if (this.currentIssueId !== "") {
      const allLinkedByIssues = await api!.getLinkedByIssues(
        this.currentIssueId
      );
      for (var i = 0; i < allLinkedByIssues.length; i++) {
        const components = allLinkedByIssues[i].components!
          .nodes as GropiusComponent[];
        for (var j = 0; j < components.length; j++) {
          const projects = components[j].projects!.nodes as Project[];
          for (var k = 0; k < projects.length; k++) {
            if (
              this.activeProjects.includes(projects[k].id!) &&
              !this.issueExist(allLinkedByIssues[i].id!, "linked-by")
            ) {
              this.relatedIssuesLinkedBy.push(allLinkedByIssues[i]);
              break;
            }
          }
        }
      }
    }
  }

  /**
   * This method initilaizes an array of all related issues that link to the current issues.
   * Only related issues that are assigned to components of the active projects are inserted.
   */
  async initRelatedIssuesLinksTo(): Promise<void> {
    this.relatedIssuesLinksTo = [];
    const api = await getCCIMSApi();
    if (this.currentIssueId !== "") {
      const allLinksToIssues = (await api?.getLinkedToIssues(
        this.currentIssueId
      )) as any;
      for (var i = 0; i < allLinksToIssues.length; i++) {
        for (var j = 0; j < allLinksToIssues[i].components.nodes.length; j++) {
          for (
            var k = 0;
            k < allLinksToIssues[i].components.nodes[j].projects.nodes.length;
            k++
          ) {
            if (
              this.activeProjects.includes(
                allLinksToIssues[i].components.nodes[j].projects.nodes[k].id
              ) &&
              !this.issueExist(allLinksToIssues[i].id, "link-to")
            ) {
              this.relatedIssuesLinksTo.push(allLinksToIssues[i]);
              break;
            }
          }
        }
      }
    }
  }

  /**
   * Checks if the issue that is to be added to one of the related issues list does already exist.
   *
   * @param id of the issue
   * @param type issue links to or linked by the current issue
   * @returns true if it exists, false otherwise.
   */
  issueExist(id: string, type: string): boolean {
    switch (type) {
      case "linked-by":
        for (var i = 0; i < this.relatedIssuesLinkedBy.length; i++) {
          if (this.relatedIssuesLinkedBy[i].id === id) {
            return true;
          }
        }
        return false;
      case "link-to":
        for (var j = 0; j < this.relatedIssuesLinksTo.length; j++) {
          if (this.relatedIssuesLinksTo[j].id === id) {
            return true;
          }
        }
        return false;
      default:
        return true;
    }
  }

  /**
   * This method is called when a project in component "select-project" is selected.
   * Now components of the project with the given projectId are shown.
   */
  public setActiveProject(projectId: string): void {
    this.activeProjectId = projectId;
    this.stepNumber++;
  }

  /**
   * This method is called when a project in component "select-component" is selected.
   * Now existing issues of the component with the given componentId are shown.
   */
  public setActiveComponent(componentId: string): void {
    this.activeComponentId = componentId;
    this.stepNumber++;
  }

  /**
   * This method is called when an issue in component "select-issue" is selected.
   * Now the issue relationship is to be specified.
   */
  public setActiveIssue(issueId: string, issueTitle: string): void {
    this.selectedIssueId = issueId;
    this.selectedIssueName = issueTitle;
    this.stepNumber++;
  }

  /**
   * This method decreases stepNumber to go one step back in the process of adding a new issue relationship.
   */
  public decreaseStepNumber(): void {
    this.stepNumber--;
  }

  /**
   * This method initializes the current issue.
   * It checks whether the issue is already stored in the Gropius back-end by checking the current issue in browser storage.
   * The issue title is initialized and if issue already exists in Gropius back-end also the current issue id is initialized.
   */
  async setCurrentIssueDetails(): Promise<void> {
    const issue = await browser.storage.local.get("issue");
    if (issue !== undefined && issue.issue.id !== "") {
      this.currentIssueId = issue.issue.id;
      this.currentIssueTitle = issue.issue.title;
      if (this.currentIssueId !== "") {
        await this.initRelatedIssuesLinkedBy();
        await this.initRelatedIssuesLinksTo();
        this.initIssuePopup();
      }
    } else {
      this.currentIssueTitle = this.getIssueTitle();
    }
  }

  /**
   * @returns the title of the current issue
   */
  public getIssueTitle(): string {
    const element = document.querySelector(".js-issue-title.markdown-title");
    return element?.innerHTML ?? "";
  }

  /**
   * If browser storage changes this method is called and fetches user projects, sets current issue details and linked issues
   */
  public logStorageChange(): void {
    this.setCurrentIssueDetails();

    if (this.currentIssueId !== "") {
      this.initRelatedIssuesLinkedBy();
      this.initRelatedIssuesLinksTo();
      this.initIssuePopup();
    }
    this.initActiveProjectIds();
  }

  /**
   * Style attribut is created by this method.
   * The position of the issue popup with a given index is set according to position of the issue element.
   * This method returns the left value for the style.
   *
   * @param index index of the issue to show the issue popup
   * @param name name of the issue
   * @param className either 'links-to' or 'linked-by'
   */
  public getLeft(index: number, name: string, className: string): number {
    const idName = name + className;
    const issueElement = document.getElementById(idName);

    const left = issueElement?.offsetLeft ?? 0;
    return left;
  }

  /**
   * Style attribut is created by this method.
   * The position of the issue popup with a given index is set according to position of the issue element.
   * This method returns the left value for the style.
   *
   * @param index index of the issue to show the issue popup
   * @param name name of the issue
   * @param className either 'links-to' or 'linked-by'
   */
  public getTop(index: number, name: string, className: string): number {
    const idName = name + className;
    const issueElement = document.getElementById(idName);

    const top = issueElement?.offsetTop ?? 0;
    return top;
  }

  /**
   * @param issue the icon path should be returned
   * @returns path of the icon for the given issue
   */
  public getIconPath(issue: Issue): string {
    return getIconForIssue(issue);
  }

  /**
   * This method sets the visible property of the issue with given id to true.
   * Thus, the issue popup with information of the issue is shown.
   *
   * @param id id of the issue
   */
  public showIssuePopup(id: string): void {
    const issue = this.issuePopup.issues.filter((item) => item?.id === id)[0];
    if (issue !== undefined && issue !== null) {
      issue.visible = true;
    }
  }

  /**
   * This method sets the visible property of the issue with given id to false.
   * Thus, the issue popup with information of the issue is hidden.
   *
   * @param id id of the issue
   */
  public hideIssuePopup(id: string): void {
    const issue = this.issuePopup.issues.filter((item) => item?.id === id)[0];
    if (issue !== undefined && issue !== null) {
      issue.visible = false;
    }
  }

  /**
   * This method returns if the issue detail popup is visible for the given issue.
   *
   * @param id of the issue
   * @returns true if the popup is visible, false if not
   */
  public isIssuePopupVisible(id: string): boolean {
    const issue = this.issuePopup.issues.filter((item) => item?.id === id)[0];
    if (issue !== undefined && issue !== null) {
      return issue.visible;
    }
    return false;
  }

  /**
   * This method returns the names of all components a given issue is assigned to.
   *
   * @param issue given issue
   * @returns all components a given issue is assigned to
   */
  public getIssueComponents(issue: Issue): any[] {
    let components: any[] = [];
    let projects: any[] = [];
    issue.components?.nodes?.forEach((component) => {
      let addComponent = false;
      component?.projects?.nodes?.forEach((project) => {
        if (this.activeProjects.includes(project?.id as string)) {
          addComponent = true;
          projects.push(project?.name);
        }
      });
      if (addComponent) {
        components.push({
          name: component?.name as string,
          projects: projects,
        });
      }
    });
    return components;
  }

  /**
   * This method closes all the details on the current page.
   */
  public closeDetails(): void {
    this.setCurrentIssueDetails();
    this.stepNumber = 0;
    const details = document.querySelectorAll("details");
    details.forEach((detail) => {
      detail.removeAttribute("open");
    });
  }

  /**
   * This method returns a string consisting of all components the issue is assigned to
   *
   * @param issue given issue
   * @returns string of components separated by a comma
   */
  getComponentNames(issue: Issue): string {
    let componentNames = "Component(s): ";
    let count = 0;
    const issueComponents =
      (issue.components?.nodes as GropiusComponent[]) ?? [];
    for (var j = 0; j < issueComponents.length; j++) {
      if (count == 0) {
        componentNames = componentNames + issueComponents[j].name;
        count++;
      } else {
        componentNames = componentNames + ", " + issueComponents[j].name;
      }
      break;
    }
    return componentNames;
  }
}
</script>
