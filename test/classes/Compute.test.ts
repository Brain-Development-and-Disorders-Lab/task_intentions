/**
 * @file 'Compute' class tests
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Import the Compute class
import Compute from "src/classes/Compute";

// Import configuration
import { Configuration } from "src/configuration";

// Mock WebR
import { WebR } from "webr";
jest.mock("webr");

// Mock consola with LogLevel
jest.mock("consola", () => ({
  LogLevel: {
    Verbose: 0,
    Error: 1,
  },
  start: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
}));

// Mock performance API
const mockPerformance = {
  now: jest.fn(() => Date.now()),
};
Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true,
});

// Mock WebRDataJsNode
const mockWebRDataJsNode = {
  values: [
    {
      values: [1.5, 2.3, 0.8, 1.2] // participant parameters
    },
    {
      values: ["10.5 -15.2"] // partner parameters as string
    },
    {
      values: [
        {
          values: [8, 6, 6, 8, 8, 6, 6, 8, 8, 6] // ppt1 values
        },
        {
          values: [6, 8, 8, 6, 6, 8, 8, 6, 6, 8] // par1 values
        },
        {
          values: [6, 8, 8, 6, 6, 8, 8, 6, 6, 8] // ppt2 values
        },
        {
          values: [8, 6, 6, 8, 8, 6, 6, 8, 8, 6] // par2 values
        },
        {
          values: [1, 2, 1, 2, 1, 2, 1, 2, 1, 2] // Ac values
        }
      ]
    }
  ]
};

// Mock WebR instance
const mockWebRInstance = {
  init: jest.fn().mockResolvedValue(undefined),
  evalR: jest.fn().mockResolvedValue({
    toJs: jest.fn().mockResolvedValue(mockWebRDataJsNode)
  }),
  installPackages: jest.fn().mockResolvedValue(undefined),
};

// Mock WebR constructor
(WebR as jest.MockedClass<typeof WebR>).mockImplementation(() => mockWebRInstance as unknown as WebR);

// Import consola after mocking
import consola from "consola";

// Get the mocked consola
const mockConsola = consola as jest.Mocked<typeof consola>;

describe('Compute', () => {
  let compute: Compute;
  let originalConfiguration: typeof Configuration.manipulations;

  beforeEach(() => {
    // Store original configuration
    originalConfiguration = { ...Configuration.manipulations };

    // Reset all mocks
    jest.clearAllMocks();
    mockPerformance.now.mockReturnValue(1000);

    // Reset WebR instance mock
    Object.assign(mockWebRInstance, {
      init: jest.fn().mockResolvedValue(undefined),
      evalR: jest.fn().mockResolvedValue({
        toJs: jest.fn().mockResolvedValue(mockWebRDataJsNode)
      }),
      installPackages: jest.fn().mockResolvedValue(undefined),
    });
  });

  afterEach(() => {
    // Restore original configuration
    Configuration.manipulations = originalConfiguration;
  });

  describe('Constructor', () => {
    test('should initialize with offline packages when useOfflinePackages is true', () => {
      Configuration.manipulations.useOfflinePackages = true;

      compute = new Compute();

      expect(WebR).toHaveBeenCalledWith({
        repoUrl: "http://localhost:8080/packages",
        baseUrl: "http://localhost:8080/webr-0.4.2/"
      });
      expect(compute.isReady()).toBe(false);
    });

    test('should initialize with empty config when useOfflinePackages is false', () => {
      Configuration.manipulations.useOfflinePackages = false;

      compute = new Compute();

      expect(WebR).toHaveBeenCalledWith({});
      expect(compute.isReady()).toBe(false);
    });

    test('should initialize ready state as false', () => {
      compute = new Compute();
      expect(compute.isReady()).toBe(false);
    });
  });

  describe('Setup Method', () => {
    beforeEach(() => {
      compute = new Compute();
    });

    test('should setup successfully with offline packages', async () => {
      Configuration.manipulations.useOfflinePackages = true;

      await compute.setup();

      expect(mockWebRInstance.init).toHaveBeenCalledTimes(1);
      expect(mockWebRInstance.evalR).toHaveBeenCalledTimes(2); // INSTALL_PACKAGES + FUNCTIONS
      expect(mockConsola.start).toHaveBeenCalledWith("Using offline packages...");
      expect(mockConsola.success).toHaveBeenCalledWith("Offline packages installed successfully");
      expect(compute.isReady()).toBe(true);
    });

    test('should setup successfully with online packages', async () => {
      Configuration.manipulations.useOfflinePackages = false;

      await compute.setup();

      expect(mockWebRInstance.init).toHaveBeenCalledTimes(1);
      expect(mockWebRInstance.installPackages).toHaveBeenCalledWith([
        "matlab",
        "jsonlite",
        "doParallel",
        "dplyr",
        "logger",
      ]);
      expect(mockWebRInstance.evalR).toHaveBeenCalledTimes(1); // Only FUNCTIONS
      expect(mockConsola.start).toHaveBeenCalledWith("Using online packages...");
      expect(mockConsola.success).toHaveBeenCalledWith("Online packages installed successfully");
      expect(compute.isReady()).toBe(true);
    });

    test('should handle offline package installation errors', async () => {
      Configuration.manipulations.useOfflinePackages = true;
      const error = new Error('Package installation failed');
      mockWebRInstance.evalR.mockRejectedValueOnce(error);

      await compute.setup();

      expect(mockConsola.error).toHaveBeenCalledWith(error);
      expect(compute.isReady()).toBe(true); // Should still be ready after error handling
    });

    test('should handle online package installation errors', async () => {
      Configuration.manipulations.useOfflinePackages = false;
      const error = new Error('Online package installation failed');
      mockWebRInstance.installPackages.mockRejectedValueOnce(error);

      await expect(compute.setup()).rejects.toThrow('Online package installation failed');
      expect(compute.isReady()).toBe(false);
    });

    test('should handle WebR initialization errors', async () => {
      const error = new Error('WebR initialization failed');
      mockWebRInstance.init.mockRejectedValueOnce(error);

      await expect(compute.setup()).rejects.toThrow('WebR initialization failed');
      expect(compute.isReady()).toBe(false);
    });
  });

  describe('Submit Method', () => {
    beforeEach(async () => {
      compute = new Compute();
      await compute.setup();
    });

    test('should submit with test responses successfully', async () => {
      const result = await compute.submit([], true);

      expect(mockWebRInstance.evalR).toHaveBeenCalledWith(
        expect.stringContaining('model_wrapper(fromJSON(\'[')
      );
      expect(mockConsola.success).toHaveBeenCalledWith(
        expect.stringContaining('Compute complete after')
      );

      expect(result).toEqual({
        participantParameters: [1.5, 2.3, 0.8, 1.2],
        partnerParameters: [10.5, -15.2],
        partnerChoices: expect.arrayContaining([
          expect.objectContaining({
            ppt1: expect.any(Number),
            par1: expect.any(Number),
            ppt2: expect.any(Number),
            par2: expect.any(Number),
            Ac: expect.any(Number),
          })
        ])
      });
    });

    test('should submit with real data successfully', async () => {
      const realData = [
        { ID: "REAL_001", Trial: 1, ppt1: 5, par1: 7, ppt2: 8, par2: 6, Ac: 1, Phase: 1 },
        { ID: "REAL_002", Trial: 2, ppt1: 6, par1: 6, ppt2: 7, par2: 7, Ac: 2, Phase: 1 }
      ];

      const result = await compute.submit(realData, false);

      expect(mockWebRInstance.evalR).toHaveBeenCalledWith(
        expect.stringContaining('model_wrapper(fromJSON(\'[{"ID":"REAL_001"')
      );
      expect(result).toBeDefined();
      expect(result.participantParameters).toBeDefined();
      expect(result.partnerParameters).toBeDefined();
      expect(result.partnerChoices).toBeDefined();
    });

    test('should handle WebR evaluation errors', async () => {
      const error = new Error('R evaluation failed');
      mockWebRInstance.evalR.mockRejectedValueOnce(error);

      await expect(compute.submit([], true)).rejects.toThrow('R evaluation failed');
    });

    test('should handle toJs conversion errors', async () => {
      const error = new Error('toJs conversion failed');
      mockWebRInstance.evalR.mockResolvedValueOnce({
        toJs: jest.fn().mockRejectedValue(error)
      });

      await expect(compute.submit([], true)).rejects.toThrow('toJs conversion failed');
    });

    test('should measure execution time correctly', async () => {
      mockPerformance.now
        .mockReturnValueOnce(1000) // Start time
        .mockReturnValueOnce(2500); // End time

      await compute.submit([], true);

      expect(mockConsola.success).toHaveBeenCalledWith('Compute complete after 1500ms');
    });

    test('should handle empty data array', async () => {
      const result = await compute.submit([], false);

      expect(mockWebRInstance.evalR).toHaveBeenCalledWith(
        expect.stringContaining('model_wrapper(fromJSON(\'[]\'))')
      );
      expect(result).toBeDefined();
    });

    test('should handle large data arrays', async () => {
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        ID: `LARGE_${i}`,
        Trial: i + 1,
        ppt1: Math.floor(Math.random() * 10) + 1,
        par1: Math.floor(Math.random() * 10) + 1,
        ppt2: Math.floor(Math.random() * 10) + 1,
        par2: Math.floor(Math.random() * 10) + 1,
        Ac: Math.floor(Math.random() * 2) + 1,
        Phase: 1
      }));

      const result = await compute.submit(largeData, false);

      expect(result).toBeDefined();
      expect(mockWebRInstance.evalR).toHaveBeenCalledWith(
        expect.stringContaining('model_wrapper(fromJSON(\'[{"ID":"LARGE_0"')
      );
    });
  });

  describe('ParseResponse Method (Private)', () => {
    beforeEach(async () => {
      compute = new Compute();
      await compute.setup();
    });

    test('should parse response with valid data structure', async () => {
      const result = await compute.submit([], true);

      expect(result.participantParameters).toEqual([1.5, 2.3, 0.8, 1.2]);
      expect(result.partnerParameters).toEqual([10.5, -15.2]);
      expect(result.partnerChoices).toHaveLength(10);
      expect(result.partnerChoices[0]).toEqual({
        ppt1: 8,
        par1: 6,
        ppt2: 6,
        par2: 8,
        Ac: 1
      });
    });

    test('should handle malformed partner parameters string', async () => {
      const malformedData = {
        values: [
          { values: [1.5, 2.3, 0.8, 1.2] },
          { values: ["invalid string"] }, // Invalid partner parameters
          mockWebRDataJsNode.values[2] // Valid partner choices
        ]
      };

      // Create a new mock for this specific test
      const mockEvalR = jest.fn().mockResolvedValue({
        toJs: jest.fn().mockResolvedValue(malformedData)
      });

      // Temporarily replace the mock
      const originalEvalR = mockWebRInstance.evalR;
      mockWebRInstance.evalR = mockEvalR;

      const result = await compute.submit([], true);

      // Restore original mock
      mockWebRInstance.evalR = originalEvalR;

      expect(result.partnerParameters).toEqual([NaN, NaN]); // Should handle parseFloat failure for both words
    });

    test('should handle empty partner choices', async () => {
      const emptyChoicesData = {
        values: [
          { values: [1.5, 2.3, 0.8, 1.2] },
          { values: ["10.5 -15.2"] },
          {
            values: [
              { values: [] }, // Empty arrays
              { values: [] },
              { values: [] },
              { values: [] },
              { values: [] }
            ]
          }
        ]
      };

      mockWebRInstance.evalR.mockResolvedValueOnce({
        toJs: jest.fn().mockResolvedValue(emptyChoicesData)
      });

      const result = await compute.submit([], true);

      expect(result.partnerChoices).toEqual([]);
    });
  });

  describe('Performance Scenarios', () => {
    beforeEach(async () => {
      compute = new Compute();
      await compute.setup();
    });

    test('should handle high hardware spec conditions', async () => {
      // Simulate high-performance hardware with fast execution
      mockPerformance.now
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(1050); // 50ms execution time

      const result = await compute.submit([], true);

      expect(mockConsola.success).toHaveBeenCalledWith('Compute complete after 50ms');
      expect(result).toBeDefined();
    });

    test('should handle low hardware spec conditions', async () => {
      // Simulate low-performance hardware with slow execution
      mockPerformance.now
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(10000); // 9 second execution time

      const result = await compute.submit([], true);

      expect(mockConsola.success).toHaveBeenCalledWith('Compute complete after 9000ms');
      expect(result).toBeDefined();
    });

    test('should handle memory constraints', async () => {
      // Simulate memory pressure by creating large data
      const memoryIntensiveData = Array.from({ length: 1000 }, (_, i) => ({
        ID: `MEMORY_${i}`,
        Trial: i + 1,
        ppt1: Math.floor(Math.random() * 10) + 1,
        par1: Math.floor(Math.random() * 10) + 1,
        ppt2: Math.floor(Math.random() * 10) + 1,
        par2: Math.floor(Math.random() * 10) + 1,
        Ac: Math.floor(Math.random() * 2) + 1,
        Phase: 1,
        // Add extra data to simulate memory pressure
        extraData: 'x'.repeat(1000)
      }));

      const result = await compute.submit(memoryIntensiveData, false);

      expect(result).toBeDefined();
      expect(mockWebRInstance.evalR).toHaveBeenCalledWith(
        expect.stringContaining('model_wrapper(fromJSON(\'[{"ID":"MEMORY_0"')
      );
    });

    test('should handle concurrent requests', async () => {
      // Simulate multiple concurrent requests
      const promises = Array.from({ length: 5 }, (_, i) =>
        compute.submit([{ ID: `CONCURRENT_${i}`, Trial: 1, ppt1: 5, par1: 7, ppt2: 8, par2: 6, Ac: 1, Phase: 1 }], false)
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result.participantParameters).toBeDefined();
        expect(result.partnerParameters).toBeDefined();
        expect(result.partnerChoices).toBeDefined();
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    beforeEach(async () => {
      compute = new Compute();
      await compute.setup();
    });

    test('should handle undefined data', async () => {
      const result = await compute.submit(undefined as unknown as unknown[], false);

      expect(mockWebRInstance.evalR).toHaveBeenCalledWith(
        expect.stringContaining('model_wrapper(fromJSON(\'undefined\'))')
      );
      expect(result).toBeDefined();
    });

    test('should handle null data', async () => {
      const result = await compute.submit(null as unknown as unknown[], false);

      expect(mockWebRInstance.evalR).toHaveBeenCalledWith(
        expect.stringContaining('model_wrapper(fromJSON(\'null\'))')
      );
      expect(result).toBeDefined();
    });

    test('should handle non-array data', async () => {
      const result = await compute.submit({ invalid: 'data' } as unknown as unknown[], false);

      expect(mockWebRInstance.evalR).toHaveBeenCalledWith(
        expect.stringContaining('model_wrapper(fromJSON(\'{"invalid":"data"}\'))')
      );
      expect(result).toBeDefined();
    });

    test('should handle data with missing required fields', async () => {
      const incompleteData = [
        { ID: "INCOMPLETE_001", Trial: 1 }, // Missing required fields
        { Trial: 2, ppt1: 5, par1: 7, ppt2: 8, par2: 6, Ac: 1, Phase: 1 } // Missing ID
      ];

      const result = await compute.submit(incompleteData, false);

      expect(result).toBeDefined();
      expect(mockWebRInstance.evalR).toHaveBeenCalledWith(
        expect.stringContaining('model_wrapper(fromJSON(\'[{"ID":"INCOMPLETE_001"')
      );
    });

    test('should handle WebR not initialized', async () => {
      const uninitializedCompute = new Compute();

      // Mock WebR to throw an error when not initialized
      mockWebRInstance.evalR.mockRejectedValueOnce(new Error('WebR not initialized'));

      await expect(uninitializedCompute.submit([], true)).rejects.toThrow('WebR not initialized');
    });

    test('should handle invalid JSON in R response', async () => {
      const invalidJsonData = {
        values: [
          { values: [1.5, 2.3, 0.8, 1.2] },
          { values: ["invalid json response"] },
          { values: "not an array" } // Invalid structure
        ]
      };

      mockWebRInstance.evalR.mockResolvedValueOnce({
        toJs: jest.fn().mockResolvedValue(invalidJsonData)
      });

      await expect(compute.submit([], true)).rejects.toThrow();
    });
  });

  describe('Configuration Variations', () => {
    test('should work with different offline package configurations', async () => {
      Configuration.manipulations.useOfflinePackages = true;

      const compute1 = new Compute();
      await compute1.setup();

      Configuration.manipulations.useOfflinePackages = false;

      const compute2 = new Compute();
      await compute2.setup();

      expect(compute1.isReady()).toBe(true);
      expect(compute2.isReady()).toBe(true);
    });

    test('should handle configuration changes after instantiation', async () => {
      compute = new Compute();

      // Change configuration after instantiation
      Configuration.manipulations.useOfflinePackages = !Configuration.manipulations.useOfflinePackages;

      await compute.setup();
      expect(compute.isReady()).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    test('should complete full workflow from setup to submit', async () => {
      compute = new Compute();

      // Verify initial state
      expect(compute.isReady()).toBe(false);

      // Setup
      await compute.setup();
      expect(compute.isReady()).toBe(true);

      // Submit with test data
      const result = await compute.submit([], true);

      // Verify result structure
      expect(result).toHaveProperty('participantParameters');
      expect(result).toHaveProperty('partnerParameters');
      expect(result).toHaveProperty('partnerChoices');
      expect(Array.isArray(result.participantParameters)).toBe(true);
      expect(Array.isArray(result.partnerParameters)).toBe(true);
      expect(Array.isArray(result.partnerChoices)).toBe(true);
    });

    test('should handle multiple setup calls', async () => {
      compute = new Compute();

      await compute.setup();
      expect(compute.isReady()).toBe(true);

      // Second setup call should not break anything
      await compute.setup();
      expect(compute.isReady()).toBe(true);

      // Should still work after multiple setups
      const result = await compute.submit([], true);
      expect(result).toBeDefined();
    });

    test('should handle rapid successive submissions', async () => {
      compute = new Compute();
      await compute.setup();

      const submissions = Array.from({ length: 10 }, (_, i) =>
        compute.submit([{ ID: `RAPID_${i}`, Trial: 1, ppt1: 5, par1: 7, ppt2: 8, par2: 6, Ac: 1, Phase: 1 }], false)
      );

      const results = await Promise.all(submissions);

      expect(results).toHaveLength(10);
      results.forEach(result => {
        expect(result).toBeDefined();
      });
    });
  });
});
