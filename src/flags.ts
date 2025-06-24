/**
 * @file Feature flag utilities for build-time feature toggling.
 *
 * This file provides helper functions and utilities for working with feature flags
 * that are configured at build time and baked into the compiled code. All feature
 * flags are defined in the Configuration.features object.
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Logging library
import consola from "consola";

// Configuration
import { Configuration } from "./configuration";

/**
 * Feature flag utility class for type-safe feature checking
 */
export class Flags {
  /**
   * Check if a specific feature is enabled
   * @param featureName - The name of the feature to check
   * @returns boolean indicating if the feature is enabled
   */
  static isEnabled(featureName: keyof typeof Configuration.features): boolean {
    return Configuration.features[featureName] === true;
  }

  /**
   * Get the value of a feature flag (useful for non-boolean flags)
   * @param featureName - The name of the feature to get
   * @returns The value of the feature flag
   */
  static getValue<T>(featureName: keyof typeof Configuration.features): T {
    return Configuration.features[featureName] as T;
  }

  /**
   * Execute a function only if a feature is enabled
   * @param featureName - The name of the feature to check
   * @param callback - Function to execute if feature is enabled
   * @param fallback - Optional function to execute if feature is disabled
   */
  static whenEnabled<T>(
    featureName: keyof typeof Configuration.features,
    callback: () => T,
    fallback?: () => T
  ): T | undefined {
    if (this.isEnabled(featureName)) {
      return callback();
    }
    return fallback ? fallback() : undefined;
  }

  /**
   * Render a component only if a feature is enabled
   * @param featureName - The name of the feature to check
   * @param component - Component to render if feature is enabled
   * @param fallback - Optional component to render if feature is disabled
   */
  static renderIfEnabled(
    featureName: keyof typeof Configuration.features,
    component: React.ReactNode,
    fallback?: React.ReactNode
  ): React.ReactNode {
    if (this.isEnabled(featureName)) {
      return component;
    }
    return fallback || null;
  }

  /**
   * Get all enabled features as an array
   * @returns Array of enabled feature names
   */
  static getEnabledFeatures(): (keyof typeof Configuration.features)[] {
    return Object.keys(Configuration.features).filter(
      (key) => Configuration.features[key as keyof typeof Configuration.features]
    ) as (keyof typeof Configuration.features)[];
  }

  /**
   * Get all disabled features as an array
   * @returns Array of disabled feature names
   */
  static getDisabledFeatures(): (keyof typeof Configuration.features)[] {
    return Object.keys(Configuration.features).filter(
      (key) => !Configuration.features[key as keyof typeof Configuration.features]
    ) as (keyof typeof Configuration.features)[];
  }

  /**
   * Log the current feature flag state (useful for debugging)
   */
  static logFeatureState(): void {
    consola.info("Feature Flags State");
    consola.info("Enabled features:", this.getEnabledFeatures());
    consola.info("Disabled features:", this.getDisabledFeatures());
  }
}
