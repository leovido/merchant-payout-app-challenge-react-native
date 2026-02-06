/**
 * MSW server tests (server is defined in server.jest.ts for Jest).
 */
import { server } from "./server.jest";

describe("MSW server", () => {
	it("exports a configured server", () => {
		expect(server).toBeDefined();
		expect(typeof server.listen).toBe("function");
	});
});
