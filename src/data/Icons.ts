import { Issue, IssuePage } from "@/generated/graphql";

/**
 * This method returns the path of icon given a specific issue.
 *
 * @param issueDetailed issue the icon path is to be returned
 * @returns path of the corresponding issue icon
 */
export function getIconForIssue(issueDetailed: Issue): string {
  let path =
    "https://raw.githubusercontent.com/ccims/gropius-icons/main/icons-md";

  const category = getIssueCategory(issueDetailed.category);

  let closed = "";
  if (!issueDetailed.isOpen) {
    closed = "-closed";
  }

  const relations = getIssueRelations(
    issueDetailed.linkedByIssues as IssuePage,
    issueDetailed.linksToIssues as IssuePage
  );

  const assignees = issueDetailed.assignees?.nodes ?? [];
  if (assignees.length > 0) {
    path = path + "/assigned";
  } else {
    path = path + "/normal";
  }

  const fileName = category + closed + relations + ".svg";
  return path + "/" + fileName;
}

/**
 * This method returns the appropriate substring for the path of the issue icon, which indicates the category of the issue.
 *
 * @return substring of the icon path
 */
function getIssueCategory(category: string): string {
  switch (category) {
    case "UNCLASSIFIED":
      return "uncategorized";
    case "BUG":
      return "bug";
    case "FEATURE_REQUEST":
      return "feature";
    default:
      return "";
  }
}

/**
 * This method returns the appropriate substring for the path of the issue icon, which indicates which relations the issue has.
 *
 * @returns substring of the icon path
 */
function getIssueRelations(
  linkedByIssues: IssuePage,
  linksToIssues: IssuePage
): string {
  let relations = "";
  const linkedBy = linkedByIssues?.nodes as Issue[];
  if (linkedBy.length > 0) {
    relations = relations + "in";
  }
  const linksTo = linksToIssues?.nodes as Issue[];
  if (linksTo.length > 0) {
    relations = relations + "out";
  }
  return "-" + relations;
}
