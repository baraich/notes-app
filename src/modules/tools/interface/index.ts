export const validTools = ["map"] as const;
export type ValidTool = (typeof validTools)[number];

export type MapToolInput = {
  locations: {
    location: string;
    map_centered_here: boolean;
  }[];
};

export type MapToolOutput = {
  points: {
    lat: number;
    lng: number;
    is_main: boolean;
    location: string;
  }[];
};

export type ToolInput<ToolName extends ValidTool> =
  ToolName extends "map" ? MapToolInput : never;

export type ToolOutput<ToolName extends ValidTool> =
  ToolName extends "map" ? MapToolOutput : never;

export type ToolCall<ToolName extends ValidTool> = {
  type: "tool-result";
  name: ToolName;
  input: ToolInput<ToolName>;
  output: ToolOutput<ToolName>;
};
