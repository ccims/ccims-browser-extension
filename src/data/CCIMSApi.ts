import {
  getSdk,
  Sdk,
  Project,
  Maybe,
  Issue,
  Component,
} from "@/generated/graphql";
import { GraphQLClient } from "graphql-request";

/**
 * The type of the CCIMSApi used for all requests
 */
function getSdkWrapper(sdk: Sdk) {
  return {
    ...sdk,
    /**
     *
     * @param componentId the id of the Component
     */
    async getUserProjects(): Promise<Project[]> {
      const projects = await this.getProjects();
      return projects.projects?.nodes as Project[];
    },

    /**
     *
     */
    async getUserComponents(): Promise<Component[]> {
      const components = await this.getAllComponents();
      return components.components?.nodes as Component[];
    },

    /**
     *
     * @param id
     * @returns
     */
    async getLinkedByIssues(id: string): Promise<Issue[]> {
      const issues = await this.getIssueData({ id });
      const linkedByIssues = (issues.node as Issue).linkedByIssues;
      return linkedByIssues!.nodes as Issue[];
    },

    /**
     *
     * @param id
     * @returns
     */
    async getLinkedToIssues(id: string): Promise<Maybe<Issue>[]> {
      const issues = await this.getIssueData({ id });
      const linkedToIssues = (issues.node as Issue).linksToIssues;
      return linkedToIssues!.nodes as Issue[];
    },

    /**
     * This method returns the first component of the user based on the name of the component
     *
     * @param name
     */
    async getComponentIdName(name: string): Promise<string> {
      const componentPage = await this.getComponentId({ name });
      if ((componentPage.components?.nodes as Component[])[0] !== undefined) {
        return (componentPage.components?.nodes as Component[])[0].id as string;
      }
      return "";
    },

    /**
     * This method returns all components of the user based on the name of the component
     * @param id id of the component the issues should be returned
     */
    async getComponentIssuesBasedOnId(id: string): Promise<Issue[]> {
      const nodes = await this.getComponentIssues({ id });
      return (nodes.node as Component).issues!.nodes as Issue[];
    },

    /**
     * This method fetches the issues and projects of a component with given id.
     *
     * @param id of the component the information is fetched
     * @returns projects and issues
     */
    async getComponentInformationBasedOnId(id: string): Promise<any> {
      const nodes = await this.getComponentInformation({ id });
      const info = nodes.node;
      return info;
    },

    /**
     *
     */
    async addExistingComponentToProject(
      component: string,
      project: string
    ): Promise<void> {
      await this.addComponentToProject({ component, project });
    },

    /**
     * Based on the given project id all components assigned to this project are returned
     * @param id project id
     * @returns array of components assigned to this project
     */
    async getComponentsForProject(
      id: string
    ): Promise<
      | Maybe<
          Maybe<{
            __typename?: "Component" | undefined;
            name: string;
            id?: Maybe<string> | undefined;
          }>[]
        >
      | undefined
    > {
      const projects = await this.getProjects();
      return (
        projects?.projects?.nodes?.filter((project) => project?.id === id)[0]
          ?.components?.nodes ?? undefined
      );
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
