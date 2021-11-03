import { Issue } from "@/generated/graphql";

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
    issueDetailed.linkedByIssues!.nodes as Issue[],
    issueDetailed.linksToIssues!.nodes as Issue[]
  );

  path = path + "/normal";

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
 * @param linkedByIssues
 * @returns substring of the icon path
 */
function getIssueRelations(
  linkedByIssues: Issue[],
  linksToIssues: Issue[]
): string {
  let relations = "";
  if (linkedByIssues.length > 0) {
    relations = relations + "in";
  }
  if (linksToIssues.length > 0) {
    relations = relations + "out";
  }
  return "-" + relations;
}
