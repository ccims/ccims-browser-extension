import { getSdk, Sdk, Project, Issue, Component } from "@/generated/graphql";
import { GraphQLClient } from "graphql-request";

interface ComponentInformation {
  id: string;
  issues: {
    nodes: {
      id: string;
      title: string;
    }[];
  };
  projects: {
    nodes: {
      id: string;
      name: string;
    }[];
  };
}

/**
 * The type of the CCIMSApi used for all requests
 */
function getSdkWrapper(sdk: Sdk) {
  return {
    ...sdk,

    /**
     * @returns all Gropius projects that can be found in 'http://localhost:8080/api'
     */
    async getUserProjects(): Promise<Project[]> {
      const projects = await this.getProjects();
      return projects.projects?.nodes as Project[];
    },

    /**
     * @returns all Gropius components that can be found in 'http://localhost:8080/api'
     */
    async getUserComponents(): Promise<Component[]> {
      const components = await this.getAllComponents();
      return components.components?.nodes as Component[];
    },

    /**
     * Given a specific issue, all issues the given issue is linked by are returned.
     *
     * @param id of the given issue
     * @returns list of issues the given issue is linked by
     */
    async getLinkedByIssues(id: string): Promise<Issue[]> {
      const issues = await this.getIssueData({ id });
      const linkedByIssues = (issues.node as Issue).linkedByIssues;
      return linkedByIssues!.nodes as Issue[];
    },

    /**
     * Given a specific issue, all issues the given issue links to are returned.
     *
     * @param id of the given issue
     * @returns list of issues the given issue links to
     */
    async getLinkedToIssues(id: string): Promise<Issue[]> {
      const issues = await this.getIssueData({ id });
      const linkedToIssues = (issues.node as Issue).linksToIssues;
      return linkedToIssues!.nodes as Issue[];
    },

    /**
     * This method returns the first component of the user based on the name of the component
     *
     * @param name of the given component
     */
    async getComponentIdName(name: string): Promise<string> {
      const componentPage = await this.getComponentId({ name });
      if ((componentPage.components?.nodes as Component[])[0] !== undefined) {
        return (componentPage.components?.nodes as Component[])[0].id as string;
      }
      return "";
    },

    /**
     * This method returns all issues for a given component.
     *
     * @param id id of the component the issues should be returned
     * @returns list of issues
     */
    async getComponentIssuesBasedOnId(id: string): Promise<Issue[]> {
      const nodes = await this.getComponentIssues({ id });
      return (nodes.node as Component).issues!.nodes as Issue[];
    },

    /**
     * This method returns detailed information on a given component.
     * This includes id, issues and projects.
     *
     * @param id of the given component
     * @returns component detail
     */
    async getComponentInformationBasedOnId(
      id: string
    ): Promise<ComponentInformation> {
      const nodes = await this.getComponentInformation({ id });
      const info = nodes.node as ComponentInformation;
      return info;
    },

    /**
     * This method adds an existing component to an existing Gropius project.
     *
     * @param component id of the component to be added
     * @param project id of the project the component is to be added
     */
    async addExistingComponentToProject(
      component: string,
      project: string
    ): Promise<void> {
      await this.addComponentToProject({ component, project });
    },

    /**
     * Based on the given project id all components assigned to this project are returned
     *
     * @param id project id
     * @returns array of components assigned to this project
     */
    async getComponentsForProject(id: string): Promise<Component[]> {
      const projectReturn = await this.getProjects();
      const project = projectReturn?.projects!.nodes!.filter(
        (project) => project?.id === id
      )[0];
      const components = project?.components!.nodes;
      return components as Component[];
    },
  };
}

export type CCIMSApi = ReturnType<typeof getSdkWrapper>;

/**
 * Gets a new CCIMSApi
 * @returns a new instance of the CCIMSApi
 */
export async function getCCIMSApi(): Promise<CCIMSApi | undefined> {
  const apiUrl = "http://localhost:8080/api";
  // const apiUrl = getApiUrl();
  if (apiUrl != undefined) {
    try {
      const client = new GraphQLClient(apiUrl, {
        headers: {
          authorization: `bearer test`,
        },
      });
      return getSdkWrapper(getSdk(client));
    } catch {
      return undefined;
    }
  } else {
    return undefined;
  }
}
