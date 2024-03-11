"use client";
import React, { useCallback, useRef, useState } from "react";
import ReactFlow, {
  OnConnect,
  ReactFlowInstance,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";

import "reactflow/dist/style.css";

import CustomNode from "@/components/internal/CustomNode";
import {
  initialEdges,
  initialNodes,
} from "@/components/internal/initial-elements";
import { LayoutMain } from "@/components/layout-main";
import { Sidebar } from "@/components/internal/Sidebar";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { topologicalSort } from "@/lib/topologicalSort";
import { generateCodeCallback } from "@/lib/nodeToCode";
import { Node } from "reactflow";
import { Layer, Model } from "@/packages/tf";

const nodeTypes = {
  custom: CustomNode,
};

export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Layer>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  // console.log(nodes);
  // const graph = useRef<Record<string, string[]>>({});
  // const [topologicalOrder, setTopologicalOrder] = useState<string[]>([]);
  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge(connection, eds));
      console.log("onConnect", connection);

      nodes.map((node) => {
        if (node.id === connection.target) {
          const sourceNode = nodes.find((n) => n.id === connection.source);
          if (sourceNode) node.data.input_nodes.push(sourceNode.data);
        }
      });
      console.log(nodes);
    },
    [setEdges, nodes],
  );

  const generateCode = () => {
    const layers = nodes.map((node) => node.data);
    const model = Model.of({ layers }).compile();
    console.log(model);
  };

  return (
    <LayoutMain>
      <Sidebar reactFlowInstance={reactFlowInstance} setNodes={setNodes} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={setReactFlowInstance}
        fitView
        nodeTypes={nodeTypes}
      />
      <Button
        onClick={() => generateCode()}
        className="h-[70px] w-[70px] absolute bottom-10 right-10 bg-orange-400 rounded-full text-black hover:text-white"
      >
        <Zap />
      </Button>
    </LayoutMain>
  );
}
