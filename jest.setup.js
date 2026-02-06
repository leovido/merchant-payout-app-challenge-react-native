// Only set up MSW when available so unit tests can run without it
let server;
try {
	server = require("./mocks/server.jest").server;
} catch {
	server = null;
}

if (server) {
	beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
	afterEach(() => server.resetHandlers());
	afterAll(() => server.close());
}
