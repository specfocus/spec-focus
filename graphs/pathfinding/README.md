# Centrality

Centrality is all about understanding which nodes are more important in a network. But what do we mean by importance? There are different types of centrality algorithms created to measure different things, such as the ability to quickly spread information versus bridging distinct groups. In this book, we’ll focus on how nodes and relationships are structured.

Graph search algorithms explore a graph either for general discovery or explicit search. These algorithms carve paths through the graph, but there is no expectation that those paths are computationally optimal. We will cover Breadth First Search and Depth First Search because they are fundamental for traversing a graph and are often a required first step for many other types of analysis.

Pathfinding algorithms build on top of graph search algorithms and explore routes between nodes, starting at one node and traversing through relationships until the destination has been reached. These algorithms are used to identify optimal routes through a graph for uses such as logistics planning, least cost call or IP routing, and gaming simulation.

Specifically, the pathfinding algorithms we’ll cover are:

*Shortest Path, with two useful variations (A* and Yen’s)*
Finding the shortest path or paths between two chosen nodes

*All Pairs Shortest Path and Single Source Shortest Path*
For finding the shortest paths between all pairs or from a chosen node to all others

*Minimum Spanning Tree*
For finding a connected tree structure with the smallest cost for visiting all nodes from a chosen node

*Random Walk*
Because it’s a useful preprocessing/sampling step for machine learning workflows and other graph algorithms

In this chapter we’ll explain how these algorithms work and show examples in Spark and Neo4j. In cases where an algorithm is only available in one platform, we’ll provide just that one example or illustrate how you can customize our implementation.