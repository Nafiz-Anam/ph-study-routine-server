module.exports = {
    setupFilesAfterEnv: ["./jest.setup.js"],
    globalTeardown: "./jest.teardown.js",
    testEnvironment: "node",
    verbose: true,
};
