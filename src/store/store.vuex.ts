import Vue from "vue";
import Vuex from "vuex";
import { createProxy, extractVuexModule } from "vuex-class-component";
import ProjectStore from "./project.vuex";
Vue.use(Vuex);
export const store = new Vuex.Store({
  modules: {
    ...extractVuexModule(ProjectStore),
  },
});
export const vxm = {
  activeProjects: createProxy(store, ProjectStore),
};
