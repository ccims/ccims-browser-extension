import {DraggedEdge, Edge, Point} from '@ustutt/grapheditor-webcomponent/lib/edge';
import GraphEditor from '@ustutt/grapheditor-webcomponent/lib/grapheditor';
import {Node} from '@ustutt/grapheditor-webcomponent/lib/node';
import {Rect} from '@ustutt/grapheditor-webcomponent/lib/util';
import {IssueGroupContainerBehaviour, IssueGroupContainerParentBehaviour} from './group-behaviours';
import {GraphData} from './data/graph-data';
import {IssueCategory} from '@/generated/graphql';
import * as issueGraphNodes from './issue-graph-nodes';
import {doGraphLayout, LayoutNode} from './automatic-layout';
import {IssueGraphClassSettersService} from './class-setters/issue-graph-class-setters.service';
import {IssueGraphLinkHandlesService} from './link-handles/issue-graph-link-handles.service';
import {IssueGraphDynamicTemplateRegistryService} from './dynamic-template-registry/issue-graph-dynamic-template-registry.service';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import networkGraphHtml from './custom-graph-editor-html';

/**
 * Interface specifying the content of the graph component local storage
 */
interface Positions {
  /** Positions of the nodes as the user arranged them */
  nodes: {[prop: string]: Point};
  /** Positions (north, south, east, west) of the issue groups */
  issueGroups: {[node: string]: string};
}

/**
 * This component creates nodes and edges in the embedded MICO GraphEditor
 * (html tag: <custom-graph-editor>) to reflect the data for the current project.
 * This data consists of the project's interfaces, components, issues and their relations and
 * is stored in this.graphData. The key method for this purpose is drawGraph().
 * This component is also responsible for registering event listeners with the GraphEditor.
 */
@Component
export default class ComponentGraphComponent extends Vue {

  declare $refs: {
    graphContainer: HTMLDivElement
  }

  @Prop()
  public graphData: GraphData;

  networkGraphHtml = networkGraphHtml

  currentVisibleArea: Rect = {x: 0, y: 0, width: 1, height: 1};

  private readonly issueGraphDynamicTemplateRegistryService = new IssueGraphDynamicTemplateRegistryService();
  private readonly issueGraphClassSettersService = new IssueGraphClassSettersService();
  private readonly issueGraphLinkHandlesService = new IssueGraphLinkHandlesService();

  readonly zeroPosition = {x: 0, y: 0};

  // reference to the GraphEditor instance of the graph
  private graph: GraphEditor;

  // indicates whether graph is initialized
  private graphInitialized = false;
  private isHandset = false;

  // contains nodes representing interfaces and components which utilize node groups for display of issue folders
  private issueGroupParents: Node[] = [];

  // local storage key for positions of graph elements
  private projectStorageKey: string;

  // The component details page moves the graph sometimes a bit,
  // so dont move back when closing the component details page
  private redrawByCloseOfComponentDetails = false;

  
  private reloadOnMouseUp = false;

  // Saved positions of the nodes and the issue groups
  private savedPositions: Positions = {nodes: {}, issueGroups: {}};

  // used in the drawGraph method true on first draw and after component creation, effects a zoom to bounding box
  private zoomOnRedraw = true;

  mounted() {
    this.graph = this.$refs.graphContainer.querySelector("custom-graph-editor");
  }

  /**
   * Setup after data is available
   */
  @Watch("graphData")
  graphDataChanged(): void {
    if (this.graphData) {
      this.initGraph();
      console.log(this.savedPositions);
      this.layoutGraph();
      console.log(this.savedPositions);
      this.drawGraph();
    }
  }


  /**
   * Sets up the graph and register event listeners
   */
  initGraph(): void {
    // case: graph already initialized
    if (this.graphInitialized) {
      return;
    }

    // Subscribe to the subject emitting node positions
    this.savedPositions = this.loadSavedPositions();

    this.graphInitialized = true;

    // Set up graph
    this.issueGraphClassSettersService.manageClassSetters(this.graph);
    this.issueGraphLinkHandlesService.manageLinkHandles(this.graph);
    this.issueGraphDynamicTemplateRegistryService.manageDynamicTemplateRegistry(this.graph);

    // Register event listeners
    this.manageEventListeners(this.graph);
  }

  /**
   * Loads positions of graph elements from the local storage.
   * @returns Parsed positions
   */
  private loadSavedPositions(): Positions {
    // gets data from the local storage
    const data = localStorage.getItem(this.projectStorageKey);

    // case: there is no data
    if (data == null) {
      return {nodes: {}, issueGroups: {}};
    }

    return JSON.parse(data);
  }

  /**
   * Method gets triggered after an edge gets dragged
   * and its target is changed:
   * ex. consumer edge gets moved away from the provider edge.
   * @param edge Edge that is handled.
   * @param sourceNode Source of the handled edge.
   * @param targetNode Target of the handled edge.
   * @returns Edge that is handled.
   */
  private onDraggedEdgeTargetChanged = (edge: DraggedEdge, sourceNode: Node, targetNode: Node): DraggedEdge => {
    // case: edge originates from a component
    if (sourceNode.type === issueGraphNodes.NodeType.Component) {
      // case: target of edge is an interface
      // => handles edge as of type consumer
      if (targetNode?.type === issueGraphNodes.NodeType.Interface) {
        // updates edge properties (default drag handle)
        edge.type = issueGraphNodes.NodeType.InterfaceConsumer;
        delete edge.dragHandles;

        // updates marker at the end of the edge
        edge.markerEnd = {
          template: 'interface-connector',
          relativeRotation: 0
        };
      }
      // case: target of edge is not an interface (aka. null)
      // => handles edge as of type provider
      else {
        // updates edge properties (no drag handles)
        edge.type = issueGraphNodes.NodeType.Interface;
        edge.dragHandles = [];

        // updates marker at the end of the edge
        // ? delete edge.markerEnd; ?
        edge.markerEnd = {
          template: 'interface-connector-initial',
          relativeRotation: 0,
          absoluteRotation: 0
        };
      }
    }

    return edge;
  };

  /**
   * Method gets triggered after an edge gets added.
   * @param event Event that is handled.
   */
  private onEdgeAdd = (event: CustomEvent): void => {
    const edge: Edge = event.detail.edge;

    // case: source of event is the API
    if (event.detail.eventSource === 'API') {
      return;
    }

    // case: edge of type interface consumer
    if (edge.type === issueGraphNodes.NodeType.InterfaceConsumer) {
      // cancels edge creation
      event.preventDefault();

      // updates the graph via the API
      const sourceNode = this.graph.getNode(edge.source);
      const targetNode = this.graph.getNode(edge.target);

      // case: edge has source and target
      // => adds edge of type interface provider
      if (sourceNode != null && targetNode != null) {
        //TODO
        //# this.gs.addConsumedInterface(sourceNode.id.toString(), targetNode.id.toString()).subscribe(() => this.reload$.next(null));
      }
    }
  };

  /**
   * Method gets triggered after an edge gets dropped.
   * @param event Event that is handled.
   */
  private onEdgeDrop = (event: CustomEvent): void => {
    const edge: DraggedEdge = event.detail.edge;

    // case: source of event is the API
    if (event.detail.eventSource === 'API') {
      return;
    }

    // case: edge created from an existing edge
    if (edge.createdFrom != null) {
      return;
    }

    // case: edge of type interface
    // => opens the interface creation dialog
    if (edge.type === issueGraphNodes.NodeType.Interface) {
      //# this.addInterfaceToComponent(event.detail.sourceNode.id, event.detail.dropPosition);
    }
  };

  /**
   * Method gets triggered after an edge gets removed.
   * @param event Event that is handled.
   */
  private onEdgeRemove = (event: CustomEvent): void => {
    const edge: Edge = event.detail.edge;

    // case: source of event is the API
    if (event.detail.eventSource === 'API') {
      return;
    }

    // case: edge of type interface consumer
    if (edge.type === issueGraphNodes.NodeType.InterfaceConsumer) {
      // cancels edge deletion
      event.preventDefault();

      // updates the graph via the API
      const sourceNode = this.graph.getNode(edge.source);
      const targetNode = this.graph.getNode(edge.target);

      // case: edge has source and target
      // => removes edge of type interface provider
      if (sourceNode != null && targetNode != null) {
        // maybe necessary in future
        //# this.gs.removeConsumedInterface(sourceNode.id.toString(), targetNode.id.toString()).subscribe(() => this.reload$.next(null));
      }
    }
  };

  /**
   * Adds event listeners to a given GraphEditor instance.
   * @param graph Reference to the GraphEditor instance of the graph that is handled.
   */
  private manageEventListeners(graph: GraphEditor): void {
    graph.addEventListener('nodeclick', this.onNodeClick);

    graph.addEventListener('nodedragend', this.onNodeDragEnd);

    graph.addEventListener('zoomchange', (event: CustomEvent) => {
      this.currentVisibleArea = event.detail.currentViewWindow;
    });
  }

  /**
   * Called when the user lets go of a node
   * @param e The event
   */
  private onNodeDragEnd = (e: CustomEvent): void => {
    const node = e.detail.node;
    // Store position of issue folders
    if (node.type === issueGraphNodes.NodeType.IssueGroupContainer) {
      this.savedPositions.issueGroups[node.id] = node.position;
    }

    // store node positioning information
    this.savedPositions.nodes[node.id] = {
      x: node.x,
      y: node.y
    };

    if (this.reloadOnMouseUp) {
      this.reloadOnMouseUp = false;
      this.zoomOnRedraw = false;
    }
  };

  /**
   * Method gets triggered after a node is clicked.
   * @param event Event that is handled.
   */
  private onNodeClick = (event: CustomEvent): void => {
    // cancels node selection
    event.preventDefault();

    const node: Node = event.detail.node;

    // doesn't allow the view of the graph to change after the Details page has been closed
    this.redrawByCloseOfComponentDetails = true;

    // Open the details in a new page if a phone is used or if shift is pressed
    if (event.detail.sourceEvent.shiftKey || this.isHandset) {
      // case: node of type Component
      // => opens View Component page
      if (node.type === issueGraphNodes.NodeType.Component) {
        //TODO route to component
        /*#
        this.router.navigate(['./component/', node.id], {
          relativeTo: this.activatedRoute.parent
        });
        #*/
        return;
      }

      // case: node of type Interface
      // => opens View Interface page
      if (node.type === issueGraphNodes.NodeType.Interface) {
        //TODO probably nothing
        /*#
        this.router.navigate(['./interface/', node.id], {
          relativeTo: this.activatedRoute.parent
        });
        #*/
        return;
      }
    } else {
      // sets the context menu type
      //TODO probably nothing
      /*#
      const contextMenuType = this.contextMenuTypeForNodeType(node);

      // case: context menu has a type
      if (contextMenuType != null) {
        this.nodeClickContextMenuHasType(node, event, contextMenuType);
        return;
      }
      #*/
    }

    // case: clicked issue folder
    // => determines issue count, opens corresponding issue page
    this.nodeClickIssueFolder(node);
  };

  /**
   * Sets the context menu type.
   * @param node Node that is handled.
   */
  /*#
  private contextMenuTypeForNodeType(node: Node): NodeDetailsType {
    // case: node of type Component
    // => sets the context menu type as Component
    if (node.type === issueGraphNodes.NodeType.Component) {
      return NodeDetailsType.Component;
    }

    // case: node of type Interface
    // => sets the context menu type as Interface
    if (node.type === issueGraphNodes.NodeType.Interface) {
      return NodeDetailsType.Interface;
    }

    return null;
  }
  #*/

  /**
   * Handles the case in which an issue folder is clicked.
   * Determines the number of issues in the issue folder
   * and opens the corresponding issue page.
   * @param node Issue folder that is handled.
   */
  private nodeClickIssueFolder(node: Node): void {
    // case: clicked issue folder
    // => determines issue count, opens corresponding issue page
    if (node.type === 'BUG' || node.type === 'UNCLASSIFIED' || node.type === 'FEATURE_REQUEST') {
      // reference to the GraphEditor instance of the graph, the root ID and the root node
      const rootId = this.graph.groupingManager.getTreeRootOf(node.id);
      const rootNode = this.graph.getNode(rootId);

      // case: only one issue inside the clicked issue folder
      // => opens Issue Details page
      if (node.issueCount === 1) {
        this.nodeClickOneIssue(rootId, rootNode, node);
        return;
      }

      // case: many issues inside the clicked issue folder
      // => opens Component Issues / Interface Issues page
      else {
        this.nodeClickManyIssues(rootNode);
        return;
      }
    }
  }

  /**
   * Handles the case in which the clicked issue folder contains only one issues.
   * @param rootNode Root node that is handled.
   * @param rootId Root id that is handled.
   * @param node Clicked node that is handled.
   */
  private nodeClickOneIssue(rootId: string, rootNode: Node, node: Node): void {
    // case: root node of type Component
    // => handles a single component issue, opens its Issue Details page
    if (rootNode.type === issueGraphNodes.NodeType.Component) {
      /*#
      this.componentStoreService.getFullComponent(rootId).subscribe((component) => {
        //TODO click on issue probably nothing
        
        const currentIssueId = this.extractIssueId(component.node.issues.nodes, node.type);
        this.router.navigate(['./', 'issues', currentIssueId], {
          relativeTo: this.activatedRoute.parent
        });
        
      });
      #*/
    }

    // case: root node of type Interface
    // => handles a single interface issue, opens its Issue Details page
    else if (rootNode.type === issueGraphNodes.NodeType.Interface) {
      /*#
      this.interfaceStoreService.getInterface(rootId).subscribe((interfaceComponent) => {
        const currentIssueId = this.extractIssueId(interfaceComponent.node.issuesOnLocation.nodes, node.type);
        //TODO click on issue probably nothing
        this.router.navigate(['./', 'issues', currentIssueId], {
          relativeTo: this.activatedRoute.parent
        });
      });
      #*/
    }
  }

  /**
   * Extracts the id of an issue in a given issue list.
   * @param issueList Ids of the issues that are handled.
   * @param category Category of issues that are handled.
   * @returns Id of the first issue (in the issue list) with matching category.
   */
  private extractIssueId(issueList, category: string): string {
    for (const issue of issueList) {
      if (issue.category === category) {
        return issue.id;
      }
    }
  }

  /**
   * Handles the case in which the clicked issue folder contains many issues.
   * @param rootNode Root node that is handled.
   */
  private nodeClickManyIssues(rootNode: Node): void {
    // case: root node of type Component
    // => handles many component issues, opens their Component Issues page
    if (rootNode.type === issueGraphNodes.NodeType.Component) {
      //TODO click on issue probably nothing
      /*#
      this.router.navigate(['./component/', rootNode.id], {
        relativeTo: this.activatedRoute.parent
      });
      #*/
    }

    // case: root node of type Interface
    // => handles many interface issues, opens their Interface Issues page
    if (rootNode.type === issueGraphNodes.NodeType.Interface) {
      //TODO click on issue probably nothing
      /*#
      this.router.navigate(['./interface/', rootNode.id], {
        relativeTo: this.activatedRoute.parent
      });
      #*/
    }
  }

  /**
   * Responsible for drawing the graph based on this.graphData.
   * Takes care of adding interfaces and components, and their connections.
   * Additionally adds issue folders attached to each component and the dashed edges
   * between them based on this.graphData.relatedFolders
   */
  drawGraph(): void {
    const boundingBox = this.calculateBoundingBox();
    // reset graph and remove all elements, gives us clean slate
    this.resetGraph();

    // create nodes corresponding to the components and interfaces of the project
    const componentNodes = Array.from(this.graphData.components.values()).map((component) =>
      issueGraphNodes.createComponentNode(component, this.findIdealComponentPosition(component.id, boundingBox))
    );
    const interfaceNodes = Array.from(this.graphData.interfaces.values()).map((intrface) =>
      issueGraphNodes.createInterfaceNode(intrface, this.savedPositions.nodes[intrface.id])
    );
    // issueNodes contains BOTH componentNodes and interfaceNodes
    const issueNodes = (componentNodes as issueGraphNodes.IssueNode[]).concat(interfaceNodes as issueGraphNodes.IssueNode[]);
    // For components AND interfaces: add the edges, issue folders and relations between folders
    issueNodes.forEach((node) => {
      this.graph.addNode(node);
      this.addIssueFolders(node);
      this.drawFolderRelations(node);
    });
    // ONLY for interfaces: create edges connecting interface to offering component and consuming components to interface
    interfaceNodes.forEach((interfaceNode) => {
      this.connectToOfferingComponent(interfaceNode);
      this.connectConsumingComponents(interfaceNode);
    });

    // render all changes
    this.graph.completeRender();
    this.setGraphToLastView();
  }

  /**
   * Resets graph state. Called at start of draw(). Enables logic in draw()
   * to assume a 'blank sheet' state avoiding complex updating logic.
   */
  resetGraph(): void {
    this.graph.edgeList = [];
    this.graph.nodeList = [];
    this.issueGroupParents = [];
    this.graph.groupingManager.clearAllGroups();
  }

  /**
   * Finds the ideal component position if none is saved.
   * @param id Id of component that is handled.
   * @param boundingBox Bounding box of the component that is handled.
   */
  findIdealComponentPosition(id: string, boundingBox: Rect): Point {
    const saved = this.savedPositions.nodes[id];
    if (saved) {
      return saved;
    }

    // Next position is right to the current bounding box, approximately at half height
    const point = {x: 0, y: 0};
    if (boundingBox) {
      point.x = boundingBox.x + boundingBox.width + 60;
      point.y = boundingBox.y + boundingBox.height / 2;
    }

    this.savedPositions.nodes[id] = point;
    return point;
  }

  /**
   * Creates and adds an edge between the node representing a component
   * an the node representing the interface itself.
   * @param node - Interface that is handled.
   */
  connectToOfferingComponent(node: issueGraphNodes.InterfaceNode): void {
    this.graph.addEdge(issueGraphNodes.createInterfaceProvisionEdge(node.offeredById, node.id));
  }

  /**
   * Adds an edge from each connected component to the interface.
   * @param interfaceNode - Interface (visualized by lollipop notation) that is handled.
   */
  connectConsumingComponents(interfaceNode: issueGraphNodes.InterfaceNode): void {
    for (const consumerId of this.graphData.interfaces.get(interfaceNode.id).consumedBy) {
      this.graph.addEdge(issueGraphNodes.createConsumptionEdge(consumerId, interfaceNode.id));
    }
  }

  /**
   * Adds the issue folders with counts for each IssueCategory (currently 3)
   * to the component or interface represented by node. The first methods call
   * sets up invisible nodes in the graph to make the folders display properly.
   * The second method takes care of actually adding the visible folders with
   * the correct counts.
   * @param node - Interface / component that is handled.
   */
  private addIssueFolders(node: issueGraphNodes.IssueNode): void {
    this.addIssueGroupContainer(node);
    this.addIssueFolderNodes(node);
  }

  /**
   * Creates the node groups necessary for displaying issue folders attached to a node.
   * A Node represents a component or an interface.
   * It also gets an issue group of IssueGroupContainerParentBehaviour,
   * issueGroupContainerNode with IssueGroupContainerBehaviour gets added to it.
   * This corresponds to the 4 'Grouping Manager' object
   * on the upper two levels in the graph_structure_documentation.png.
   * @param node - Node (component or interface) which can have issue folders attached.
   */
  private addIssueGroupContainer(node: issueGraphNodes.IssueNode): void {
    const gm = this.graph.groupingManager;
    gm.markAsTreeRoot(node.id);
    const issueGroupContainerNode = issueGraphNodes.createIssueGroupContainerNode(node);
    const initialPosition = this.savedPositions.issueGroups[issueGroupContainerNode.id];
    gm.setGroupBehaviourOf(node.id, new IssueGroupContainerParentBehaviour(initialPosition));

    // the issueGroupContainerNode has no visual representation but contains the visible issue folders
    node.issueGroupContainer = issueGroupContainerNode;
    this.graph.addNode(issueGroupContainerNode);
    gm.addNodeToGroup(node.id, issueGroupContainerNode.id);
    gm.setGroupBehaviourOf(issueGroupContainerNode.id, new IssueGroupContainerBehaviour());
    this.issueGroupParents.push(node);
  }

  /**
   * This method presumes that node has the 4 'Grouping Manager Objects'
   * depicted on the the upper levels in the graph_structure_documentation.png.
   * correctly setup.
   * @param node Interface / component that is handled.
   */
  private addIssueFolderNodes(node: issueGraphNodes.IssueNode): void {
    // get mapping from IssueCategory to number for the component or interface represented by node
    const issueCounts = this.graphData.graphLocations.get(node.id).issues;
    // iterate over issue categories and create a node if there is at least one issue of it
    Object.keys(IssueCategory).forEach((key) => {
      const issueCategory = IssueCategory[key];
      if (issueCounts.has(issueCategory)) {
        const count = issueCounts.get(issueCategory);
        // only show folders for issue categories with at least one issue
        if (count > 0) {
          const issueFolderNode = issueGraphNodes.createIssueFolderNode(node, issueCategory, count.toString());
          this.graph.addNode(issueFolderNode);
          this.graph.groupingManager.addNodeToGroup(node.issueGroupContainer.id, issueFolderNode.id);
        }
      }
    });
  }

  /**
   * Draws folder relations originating from the issue folder represented by node.
   * @param node - Issue folder (for issues of a certain type) that is handled.
   */
  private drawFolderRelations(node: issueGraphNodes.IssueNode): void {
    const folderNodes: any[] = Array.from(node.issueGroupContainer.issueGroupNodeIds).map((id: string) =>
      this.graph.getNode(id)
    );
    for (const folderNode of folderNodes) {
      const relatedFolders = this.graphData.relatedFolders.getValue([node.id.toString(), folderNode.type]);
      for (const relatedFolder of relatedFolders) {
        const [issueNodeId, category] = relatedFolder;
        const edge = issueGraphNodes.createRelationEdge(folderNode.id, issueGraphNodes.getIssueFolderId(issueNodeId, category));
        this.graph.addEdge(edge);
      }
    }
  }

  private setGraphToLastView() {
    // Only set the bounding box to the optimized bounding box for the graph when creating the first component
    const firstComponent = this.graphData.components.size === 1;

    if ((this.zoomOnRedraw && !this.redrawByCloseOfComponentDetails) || firstComponent) {
      // Zoom to the optimized bounding box if no graph view is stored from the last session or when the first component is created
      this.fitGraphInView();
      this.zoomOnRedraw = false;
    }
  }

  /**
   * Fits the graph into view.
   */
  fitGraphInView(): void {
    // calculates the bounding box of the view
    const rect = this.calculateBoundingBox();

    // case: bounding box is calculated
    // => zoom to bounding box
    if (rect) {
      this.graph.zoomToBox(rect);
    }
  }

  /**
   * Calculates the bounding box of the view.
   * @returns The calculated bounding box.
   */
  calculateBoundingBox(): Rect {
    const componentSize = {width: 100, height: 60};
    const interfaceSize = {width: 14, height: 14};
    const issueContainerSize = {width: 40, height: 30};

    // calculates bounding box
    let rect = null;
    for (const node of this.graph.nodeList) {
      let size;
      if (node.type === issueGraphNodes.NodeType.Component) {
        size = componentSize;
      } else if (node.type === issueGraphNodes.NodeType.Interface || node.type === issueGraphNodes.NodeType.InterfaceConsumer) {
        size = interfaceSize;
      } else if (node.type === issueGraphNodes.NodeType.IssueGroupContainer) {
        if (node.issueGroupNodeIds.size === 0) {
          // irrelevant for empty issue group containers
          continue;
        }

        size = issueContainerSize;
      } else {
        continue;
      }

      const nodeX = node.x - size.width / 2;
      const nodeY = node.y - size.height / 2;

      if (rect === null) {
        rect = {
          xMin: nodeX,
          yMin: nodeY,
          xMax: nodeX + size.width,
          yMax: nodeY + size.height
        };
      } else {
        rect.xMin = Math.min(nodeX, rect.xMin);
        rect.yMin = Math.min(nodeY, rect.yMin);

        rect.xMax = Math.max(nodeX + size.width, rect.xMax);
        rect.yMax = Math.max(nodeY + size.height, rect.yMax);
      }
    }

    return rect
      ? {
          x: rect.xMin,
          y: rect.yMin,
          width: rect.xMax - rect.xMin,
          height: rect.yMax - rect.yMin
        }
      : null;
  }

  /**
   * Attempts to automatically lay-out the graph in a reasonable manner
   */
  layoutGraph(): void {
    const nodes = new Map<string | number, LayoutNode>();

    for (const node of this.graph.nodeList) {
      if (node.type === issueGraphNodes.NodeType.Component || node.type === issueGraphNodes.NodeType.Interface) {
        nodes.set(node.id, new LayoutNode(node.id, node.x, node.y, node.type));
      }
    }

    for (const edge of this.graph.edgeList) {
      if (nodes.has(edge.source) && nodes.has(edge.target)) {
        nodes.get(edge.source).connectTo(nodes.get(edge.target));
        nodes.get(edge.target).connectTo(nodes.get(edge.source));
      }
    }

    const nodeList = Array.from(nodes.values());
    doGraphLayout(nodeList);

    for (const node of nodeList) {
      const layoutNode = nodes.get(node.id);
      this.savedPositions.nodes[layoutNode.id] = {
        x: layoutNode.position.x,
        y: layoutNode.position.y
      };
    }
  }

  /**
   * Sets --show-relations css variable to initial or none. It is the value
   * of the display attribute of the edges. If we set it to none the edges disappear.
   * @param showRelations - Boolean derived from the setting of the switch slider for relation edges above the graph.
   */
  setRelationVisibility(showRelations: boolean): void {
    this.graph.getSVG().style('--show-relations', showRelations ? 'initial' : 'none');
  }
}
