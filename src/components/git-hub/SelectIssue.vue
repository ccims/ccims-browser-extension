<!-- Component for selecting and creating an issue -->
<template>
  <div v-if="!issueCreation" class="dropdown">
    <div class="select-menu-text-filter hx_form-control-spinner-wrapper">
      <input
        v-model.trim="inputValue"
        class="form-control js-filterable-field"
        type="text"
        placeholder="Search or create an issue"
      />
    </div>
    <div class="dropdown-list" v-show="issueListVisible">
      <div
        class="dropdown-item"
        v-if="inputValue.length > 0"
        @click="setIssueCreation()"
      >
        Create new issue
      </div>
      <div
        v-for="issue in componentIssues"
        :key="issue.id"
        class="dropdown-item"
        v-show="itemVisible(issue)"
        @click="selectIssue(issue.id, issue.title)"
      >
        {{ issue.title }}
      </div>
    </div>
  </div>
  <div v-else>
    <div class="select-menu-text-filter hx_form-control-spinner-wrapper">
      Title
      <input
        v-model="inputValue"
        class="form-control js-filterable-field"
        type="text"
        placeholder="Title"
      />
    </div>
    <div class="select-menu-text-filter hx_form-control-spinner-wrapper">
      Body
      <input
        v-model="bodyCreatedIssue"
        class="form-control js-filterable-field"
        type="text"
        placeholder="Body of the issue"
      />
    </div>
    <button class="btn-primary btn mt-2 ml-2 mb-2 mr-2" @click="createIssue()">
      Create issue and specify relationship
    </button>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Issue } from "@/generated/graphql";
import { getCCIMSApi } from "@/data/CCIMSApi";

const SelectIssuePropos = Vue.extend({
  props: {
    componentId: String,
  },
});
@Component
export default class SelectIssue extends SelectIssuePropos {
  private inputValue = "";
  private issueListVisible = true;
  private componentIssues: Issue[] = [];
  private issueCreation = false;
  private bodyCreatedIssue = "";

  /**
   * Called on created, initializes the issues that concern the selected component.
   */
  async created(): Promise<void> {
    const api = await getCCIMSApi();
    this.componentIssues = await api!.getComponentIssuesBasedOnId(
      this.componentId
    );
  }

  /**
   * This method checks for the given issue if the typed string matches the name of the issue.
   *
   * @param issue the issue to compare the
   * @returns true if the typed string matches the name of the issue, false if not
   */
  public itemVisible(issue: Issue): boolean {
    let currentName = issue.title.toLowerCase();
    let currentInput = this.inputValue.toLowerCase();
    return currentName.includes(currentInput);
  }

  /**
   * This method selects a given issue.
   * The choice gets emitted to the parent component.
   *
   * @param issueId id of the issue to select
   * @param issueName name of the issue to select
   */
  public selectIssue(issueId: string, issueTitle: string): void {
    this.issueListVisible = false;
    this.inputValue = issueTitle;
    this.$emit("issueSelected", issueId, issueTitle);
  }

  /**
   * Page to create a new issue is shown.
   */
  public setIssueCreation(): void {
    this.issueCreation = true;
  }

  /**
   * Called when the user decides to create the issue.
   * The id and the name of the created issue are emitted to parent component.
   */
  async createIssue(): Promise<void> {
    const api = await getCCIMSApi();
    let issueId = await api?.createIssue({
      title: this.inputValue,
      body: this.bodyCreatedIssue,
      components: [this.componentId],
    });
    this.$emit(
      "issueSelected",
      issueId?.createIssue?.issue?.id,
      this.inputValue
    );
  }
}
</script>
<style lang="scss" scoped>
.dropdown {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}
.dropdown-input,
.dropdown-selected {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid transparent;
  background: #edf2f7;
  line-height: 1.5em;
  outline: none;
  border-radius: 8px;
}
.dropdown-input:focus,
.dropdown-selected:hover {
  background: #fff;
  border-color: #e2e8f0;
}
.dropdown-input::placeholder {
  opacity: 0.7;
}
.dropdown-selected {
  font-weight: bold;
  cursor: pointer;
}
.dropdown-list {
  width: 100%;
  max-height: 500px;
  margin-top: 4px;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 8px;
}
.dropdown-item {
  display: flex;
  width: 100%;
  padding: 11px 16px;
  cursor: pointer;
}
.dropdown-item:hover {
  background: #edf2f7;
}
</style>