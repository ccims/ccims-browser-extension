import Vue from "vue";
import RelatedIssues from "@/components/git-hub/RelatedIssueList.vue";
import ActiveProjects from "@/components/git-hub/ActiveProjects.vue";
import ProjectList from "@/components/git-hub/ProjectList.vue";
import ComponentGraph from "@/components/git-hub/ComponentGraph.vue";
import { getCCIMSApi } from "@/data/CCIMSApi";
import { Issue } from "@/generated/graphql";

declare global {
  interface Window {
    RelatedIssues: any;
    ActiveProjects: any;
    ProjectList: any;
    ComponentGraph: any;
  }
}

import "@webcomponents/webcomponentsjs/webcomponents-bundle";
import GraphEditor from "@ustutt/grapheditor-webcomponent/lib/grapheditor";
if (!customElements.get("custom-graph-editor")) {
  customElements.define("custom-graph-editor", GraphEditor);
}

// inititialize browser storage
setActiveComponent();
setActiveProjects();
setActiveIssue();

// add components
addRelIssueList();
addActiveProjects();
addProjectList();
addComponentGraph();

function addComponentGraph(): void {
  if (document.getElementById("component-graph-container") === null) {
    let element = document.querySelector(".Layout-main .file-navigation ~ .Box");
    let issueMode = false;
    if (element === null) {
      issueMode = true;
      element = document.querySelector("#show_issue .Layout-main");
    }
    if (element !== null) {
      window.ComponentGraph = Vue.extend(ComponentGraph);
      const vue = new window.ComponentGraph();
      vue.issueMode = issueMode;
      const container = document.createElement("div");
      container.id = "component-graph-container";

      if (issueMode) {
        element.prepend(container);
      } else {
        const parent = element.parentElement!;
        parent.insertBefore(container, element);
      }

      vue.$mount("#component-graph-container");
    }
  }
}

/**
 * Adds the project list to the side bar of GitHub iff div-element with class "BorderGrid BorderGrid--spacious" exists.
 * The project list contains all projects in which the current component is included.
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
 * Adds a list of related issue to the sidebar of GitHub's issue page iff the div-element with id "partial-discussion-sidebar" exists.
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
 * Adds a filter of the active Gropius projects to the sidebar of GitHub's issue page iff the div-element with id "partial-discussion-sidebar" exists.
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
 * All Gropius projects in which the current component is included are set as active projects.
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
 * This method initializes the browser storage attribute issue.
 * If the current issue the user is visting at the moment exists in Gropius back-end it is stored in browser storage.
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
 * @returns the title of the current issue
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
    const issues = info!.issues?.nodes;
    const projects = info!.projects?.nodes;
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
 *
 * @param name the name of the component
 */
async function getComponentId(name: string): Promise<string> {
  const api = await getCCIMSApi();
  const id = await api?.getComponentIdName(name);
  return id as string;
}
