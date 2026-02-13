/**
 * Input validation functions
 * Patterns match those used in the API
 */

const SEMVER_REGEX = /^\d+\.\d+\.\d+$/;
const AGENT_NAME_REGEX = /^[a-z][a-z0-9-]*$/;
const ORG_NAME_REGEX = /^[a-z][a-z0-9-]*$/;

/**
 * Validate semantic version (e.g., 1.0.0)
 */
export function validateSemver(version: string): string | undefined {
  if (!version) {
    return "Version is required";
  }
  if (!SEMVER_REGEX.test(version)) {
    return "Version must be in semver format (e.g., 1.0.0)";
  }
  return undefined;
}

/**
 * Validate agent name
 */
export function validateAgentName(name: string): string | undefined {
  if (!name) {
    return "Agent name is required";
  }
  if (!AGENT_NAME_REGEX.test(name)) {
    return "Agent name must start with a letter and contain only lowercase letters, numbers, and hyphens";
  }
  if (name.length < 3) {
    return "Agent name must be at least 3 characters";
  }
  return undefined;
}

/**
 * Validate organization name
 */
export function validateOrgName(name: string): string | undefined {
  if (!name) {
    return "Organization name is required";
  }
  if (!ORG_NAME_REGEX.test(name)) {
    return "Organization name must start with a letter and contain only lowercase letters, numbers, and hyphens";
  }
  if (name.length < 3) {
    return "Organization name must be at least 3 characters";
  }
  return undefined;
}
