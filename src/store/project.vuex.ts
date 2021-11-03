import { Project } from "@/generated/graphql";
import {
  createModule,
  mutation,
  action,
  getter,
  Module,
  createProxy,
} from "vuex-class-component";

const VuexModule = createModule({
  namespaced: "project",
  strict: false,
});
export class ProjectStore extends VuexModule {
  private activeProjects: Project[] = [];

  get getActiveProjects(): Project[] {
    return this.activeProjects;
  }

  @mutation clearProjects(): void {
    this.activeProjects = [];
  }

  @mutation setActiveProjects(projects: Project[]): void {
    this.activeProjects = projects;
  }
}
export default ProjectStore;
