export const validTools = ["map", "search"] as const;
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

export type SearchToolInput = {
  query: string;
  max_tokens?: number;
};

export type SearchToolOutput = {
  results: {
    id: string;
    model: string;
    created: number;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
      search_context_size: string;
      cost: {
        input_tokens_cost: number;
        output_tokens_cost: number;
        request_cost: number;
        total_cost: number;
      };
    };
    citations: string[];
    search_results: {
      title: string;
      url: string;
      date: string;
      last_updated: string;
    }[];
    object: string;
    choices: {
      index: number;
      finish_reason: string;
      message: {
        role: string;
        content: string;
      };
      delta: {
        role: string;
        content: string;
      };
    }[];
  };
};

type ToolInputMap = {
  map: MapToolInput;
  search: SearchToolInput;
};

type ToolOutputMap = {
  map: MapToolOutput;
  search: SearchToolOutput;
};

export type ToolInput<ToolName extends ValidTool> =
  ToolInputMap[ToolName];
export type ToolOutput<ToolName extends ValidTool> =
  ToolOutputMap[ToolName];

export type ToolCall<ToolName extends ValidTool> = {
  type: "tool-result";
  name: ToolName;
  input: ToolInput<ToolName>;
  output: ToolOutput<ToolName>;
};
