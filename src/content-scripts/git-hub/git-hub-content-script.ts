import Vue from "vue";
import RelatedIssues from "@/components/git-hub/RelatedIssueList.vue";
import ActiveProjects from "@/components/git-hub/ActiveProjects.vue";
import ProjectList from "@/components/git-hub/ProjectList.vue";
import { getCCIMSApi } from "@/data/CCIMSApi";
import { Project, Issue } from "@/generated/graphql";
import { createNamespacedHelpers } from "vuex";

declare global {
  interface Window {
    RelatedIssues: any;
    ActiveProjects: any;
    ProjectList: any;
  }
}

// inititialize browser storage
setActiveComponent();
setActiveProjects();
setActiveIssue();

// add components
addRelIssueList();
addActiveProjects();
addProjectList();

/**
 * Adds the project list to the side bar of GitHub iff div-element with class "BorderGrid BorderGrid--spacious" exists
 * The project list contains all projects in which the current repository is a component in
 */
function addProjectList(): void {
  if (document.getElementById("project-list-container") === null) {
    const element = document.querySelector(".BorderGrid.BorderGrid--spacious");
    if (element !== null) {
      window.ProjectList = Vue.extend(ProjectList);
      const vue = new window.ProjectList();

      const container = document.createElement("div");
      container.id = "project-list-container";
      element.appendChild(container);

      vue.$mount("#project-list-container");
    }
  }
}

/**
 * Adds a button to the top navigation bar of GitHub iff the div-element with class "file-navigation" exists
 */
function addRelIssueList(): void {
  if (document.getElementById("related-issue-list") === null) {
    const element = document.querySelector("#partial-discussion-sidebar");
    if (element !== null) {
      window.RelatedIssues = Vue.extend(RelatedIssues);
      const vue = new window.RelatedIssues();

      const container = document.createElement("div");
      container.id = "related-issues";
      element.insertBefore(container, element.children[0]);

      vue.$mount("#related-issues");
    }
  }
}

/**
 * All Gropius projects in which the current component is included are set as active projects.
 * First the user projects are fetched from the api and then they are stored in browser.storage.local.
 */
async function setActiveProjects(): Promise<void> {
  if (
    (await browser.storage.local.get("project")) !== undefined &&
    (await browser.storage.local.get("project")) !== null
  ) {
    const activeComponent = await browser.storage.local.get("component");
    if (
      activeComponent.component !== undefined &&
      activeComponent.component.id !== ""
    ) {
      browser.storage.local.set({
        project: activeComponent.component.projects,
      });
    }
  }
}

/**
 *
 */
function addActiveProjects() {
  if (document.getElementById("active-projects") === null) {
    const element = document.querySelector("#partial-discussion-sidebar");

    if (element !== null) {
      window.ActiveProjects = Vue.extend(ActiveProjects);
      const vue = new window.ActiveProjects();

      const container = document.createElement("div");
      container.id = "active-projects";
      element.insertBefore(container, element.children[0]);

      vue.$mount("#active-projects");
    }
  }
}

/**
 * This method initializes the browser storage attribute componentName
 */
async function setActiveIssue() {
  const issueTitle = getIssueTitle();
  const component = await browser.storage.local.get("component");
  const componentId = component.component.id;

  if (componentId !== "" && componentId !== undefined) {
    const componentDetails = await browser.storage.local.get("component");
    if (
      componentDetails !== null &&
      componentDetails !== undefined &&
      issueTitle !== ""
    ) {
      const currentIssueIdList = componentDetails.component.issues.filter(
        (issue: Issue) => issue.title === issueTitle
      );
      if (currentIssueIdList[0] !== undefined) {
        browser.storage.local.set({
          issue: { id: currentIssueIdList[0].id, title: issueTitle },
        });
      } else {
        resetActiveIssue();
      }
    } else {
      resetActiveIssue();
    }
  } else {
    resetActiveIssue();
  }
}

/**
 * Resets the storage key issue with initial values for id and title.
 */
function resetActiveIssue(): void {
  browser.storage.local.set({
    issue: { id: "", title: "" },
  });
}

/**
 * Returns the title of the current issue
 */
function getIssueTitle(): string {
  const element = document.querySelector(".js-issue-title.markdown-title");
  return element?.innerHTML ?? "";
}

/**
 * This method initializes the browser storage attribute component if a Gropius component for the current repository already exists.
 */
async function setActiveComponent() {
  const target = document
    .querySelector('meta[name="go-import"]')
    ?.getAttribute("content");
  const splittedTarget = target?.split(" ") ?? [""];
  const names = splittedTarget[0].split("/");

  const componentName = names[names.length - 1];
  const componentId = await getComponentId(componentName);

  if (componentId !== "" && componentId !== undefined) {
    const api = await getCCIMSApi();
    const info = await api?.getComponentInformationBasedOnId(componentId);
    const issues = info.issues?.nodes;
    const projects = info.projects?.nodes;
    browser.storage.local.set({
      component: {
        name: componentName,
        id: componentId,
        issues: issues,
        projects: projects,
      },
    });
  } else {
    browser.storage.local.set({
      component: {
        name: "",
        id: "",
        issues: [],
        projects: [],
      },
    });
    browser.storage.local.set({
      project: [],
    });
    resetActiveIssue();
  }
}

/**
 * Given a component name the id of the first component found with the same name is returned.
 * @param name the name of the component
 */
async function getComponentId(name: string): Promise<string> {
  const api = await getCCIMSApi();
  const id = await api?.getComponentIdName(name);
  return id as string;
}
