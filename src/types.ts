export interface AlgomoResponse {
  message: string;
  metadata: {
    conversationId: string;
    generatedQueries: string[];
    responseContext: {
      id: string;
      type: string;
      text: string;
    }[];
  };
}
