/**
 * MSW Server for Jest/Node.js (uses msw/node).
 * Used by jest.setup.js and by test files that need the server.
 */
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
