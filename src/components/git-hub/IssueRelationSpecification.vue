<!-- Component to specify the issue relationship between two related issues -->
<template>
  <div class="issue-rel-spec">
    <div class="select-menu-text-filter hx_form-control-spinner-wrapper">
      Source Issue
      <input
        readonly
        v-model="sourceName"
        class="form-control js-filterable-field"
        type="text"
        placeholder="Title"
      />
    </div>
    <div>
      <button
        class="btn-secondary btn mt-2 ml-2 mb-2 mr-2"
        @click="changeSourceTarget()"
      >
        Change relation
      </button>
    </div>
    <div class="select-menu-text-filter hx_form-control-spinner-wrapper">
      Target Issue
      <input
        readonly
        v-model="targetName"
        class="form-control js-filterable-field"
        type="text"
        placeholder="Title"
      />
    </div>
    <button class="btn-primary btn mt-2 ml-2 mb-2 mr-2" @click="linkIssues()">
      Link issues
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getCCIMSApi } from "@/data/CCIMSApi";

const IssueRelationSpecificationProps = Vue.extend({
  props: {
    sourceIssueId: String,
    sourceIssueName: String,
    targetIssueId: String,
    targetIssueName: String,
    componentId: String,
  },
});
@Component
export default class IssueRelationSpecification extends IssueRelationSpecificationProps {
  private sourceName = this.sourceIssueName;
  private sourceId = this.sourceIssueId;
  private targetId = this.targetIssueId;
  private targetName = this.targetIssueName;

  /**
   * Called on create.
   * If the current issue does not exist for the current component in the Gropius back-end, a new one will be created.
   */
  async created(): Promise<void> {
    if (this.sourceId === "") {
      let component = await browser.storage.local.get("component");
      let componentIdRepo = component.component.id;
      const api = await getCCIMSApi();
      let createdIssue = await api?.createIssue({
        title: this.sourceName,
        components: [componentIdRepo],
      });
      this.sourceId = createdIssue?.createIssue?.issue?.id as string;
      component.component.issues.push({
        id: this.sourceId,
        title: this.sourceName,
      });
      await browser.storage.local.set({ component: component.component });
      await browser.storage.local.set({
        issue: { id: this.sourceId, title: this.sourceName },
      });
      console.log(
        "component, issue",
        await browser.storage.local.get("component"),
        await browser.storage.local.get("component")
      );
    }
  }

  /**
   * This method changes source and target issue of the issue relationship.
   */
  public changeSourceTarget(): void {
    let oldSourceId = this.sourceId;
    let oldSourceName = this.sourceName;
    this.sourceId = this.targetId;
    this.sourceName = this.targetName;
    this.targetId = oldSourceId;
    this.targetName = oldSourceName;
  }

  /**
   * This method links the source issue to the target issue.
   */
  async linkIssues(): Promise<void> {
    const api = await getCCIMSApi();
    await api?.linkIssues({
      sourceIssueId: this.sourceId,
      targetIssueId: this.targetId,
    });
    this.$emit("closeDetails");
  }
}
</script>