<template>
    <div id="component-graph-container" :class="issueMode ? `ml-0 pl-0 ml-md-6 pl-md-3` : ``">
        <div class="mb-3 Box filled-div"
            :class="{ expanded: isExpanded }">
            <div class="Box-header position-relative d-flex graph-title" @click="onTitleClick()">
                <button type="button" class="btn-octicon toggle-button" aria-label="Toggle diff contents"
                    aria-expanded="true" style="width: 22px;">
                    <svg height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"
                        class="octicon octicon-chevron-down Details-content--hidden">
                        <path fill-rule="evenodd"
                            :d="isExpanded ? `M12.78 6.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.22 7.28a.75.75 0 011.06-1.06L8 9.94l3.72-3.72a.75.75 0 011.06 0z` : `M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z`">
                        </path>
                    </svg>
                </button>
                <h2 class="Box-title">
                    Gropius Component Graph
                </h2>
            </div>
            <div class="graph-wrapper">
                <ComponentGraphComponent :graphData="graphData"/>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Project } from "@/generated/graphql";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ComponentGraphComponent from "@/components/issue-graph/ComponentGraphComponent.vue";
import { getCCIMSApi } from "@/data/CCIMSApi";
import { GraphData, GraphDataFactory } from "../issue-graph/data/graph-data"

@Component({
  components: {
    ComponentGraphComponent,
  },
})
export default class GraphComponent extends Vue {
    isExpanded = false
    graphData: GraphData | null = null;
    tempGraphData: GraphData | null = null;

    @Prop({ default: false })
    issueMode!: boolean

    @Watch("issueMode")
    issueModeChange(): void {
        this.updateGraph();
    }

    async created(): Promise<void> {
        browser.storage.onChanged.addListener(this.updateGraph);
        await this.updateGraph();
    }

    async updateGraph(): Promise<void> {
        //TODO fancy algorithm that allows to select
        const activeProjects: string[] = [];
        const storageProjects = await browser.storage.local.get("project");
        storageProjects.project.forEach((project: Project) =>
        activeProjects.push(project.id as string));
        const projectId = activeProjects[0]
        if (!projectId) {
            return;
        }
        if (this.issueMode) {
            const issueId = (await browser.storage.local.get("issue"))?.issue?.id ?? null;
            if (!issueId) {
                return;
            }
            const api = await getCCIMSApi();
            //TODO
            this.tempGraphData = GraphDataFactory.graphDataFromGQL(await api.getIssueGraphData(projectId));
        }
    }

    async onTitleClick(): Promise<void> {
        this.isExpanded = !this.isExpanded;
        if (this.isExpanded) {
            this.graphData = this.tempGraphData;
        }
    }
}
</script>
<style scoped>
.Box:not(.expanded) .Box-header {
    border-radius: 6px;
    margin-bottom: -1px;
}

.graph-wrapper {
    aspect-ratio: 2.5/1;
}

.Box:not(.expanded) .graph-wrapper {
    max-height: 0px;
}

.Box.expanded .graph-wrapper {
    max-height: unset;
}

.toggle-button {
    margin-left: -5px;
    margin-right: 15px;
}

.graph-title {
    align-items: center;
    cursor: pointer
}
</style>