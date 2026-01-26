export type AlgorithmCategory =
  | "Arrays & Sorting"
  | "Searching"
  | "Data Structures"
  | "Graphs"
  | "Dynamic Programming";

export interface AlgorithmMetadata {
  slug: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
}

export const algorithms: AlgorithmMetadata[] = [
  // Arrays & Sorting
  {
    slug: "bubble-sort",
    name: "Bubble Sort",
    category: "Arrays & Sorting",
    description:
      "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
  },
  {
    slug: "selection-sort",
    name: "Selection Sort",
    category: "Arrays & Sorting",
    description:
      "Divides the input list into two parts: a sorted sublist of items which is built up from left to right...",
  },
  {
    slug: "insertion-sort",
    name: "Insertion Sort",
    category: "Arrays & Sorting",
    description: "Builds the final sorted array (or list) one item at a time.",
  },
  {
    slug: "merge-sort",
    name: "Merge Sort",
    category: "Arrays & Sorting",
    description:
      "An efficient, stable, comparison-based, divide and conquer sorting algorithm.",
  },
  {
    slug: "quick-sort",
    name: "Quick Sort",
    category: "Arrays & Sorting",
    description: "An efficient, general-purpose sorting algorithm.",
  },
  {
    slug: "heap-sort",
    name: "Heap Sort",
    category: "Arrays & Sorting",
    description:
      "A comparison-based sorting technique based on Binary Heap data structure.",
  },

  // Searching
  {
    slug: "linear-search",
    name: "Linear Search",
    category: "Searching",
    description:
      "Sequentially checks each element of the list until a match is found or the whole list has been searched.",
  },
  {
    slug: "binary-search",
    name: "Binary Search",
    category: "Searching",
    description: "Finds the position of a target value within a sorted array.",
  },

  // Data Structures
  {
    slug: "stack",
    name: "Stack",
    category: "Data Structures",
    description:
      "Abstract data type that serves as a collection of elements, with two main principal operations: Push and Pop.",
  },
  {
    slug: "queue",
    name: "Queue",
    category: "Data Structures",
    description:
      "A collection of entities that are maintained in a sequence and can be modified by the addition of entities at one end of the sequence and the removal of entities from the other end.",
  },
  {
    slug: "linked-list",
    name: "Linked List",
    category: "Data Structures",
    description:
      "A linear collection of data elements whose order is not given by their physical placement in memory.",
  },

  // Graphs
  {
    slug: "bfs",
    name: "Breadth-First Search (BFS)",
    category: "Graphs",
    description:
      "An algorithm for traversing or searching tree or graph data structures.",
  },
  {
    slug: "dfs",
    name: "Depth-First Search (DFS)",
    category: "Graphs",
    description:
      "An algorithm for traversing or searching tree or graph data structures.",
  },
];
