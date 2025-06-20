/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-01 00:54:04
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-01 15:56:28
 * @FilePath      : /server/src/common/utils/serialize.util.ts
 * @Description   : Utility to safely serialize objects for logging, avoiding circular references
 */

/**
 * Safe Object Serialization Utilities
 * 
 * This module provides utilities to safely serialize complex JavaScript objects for logging
 * and data transfer purposes. It solves several common problems:
 *
 *  Circular References: When calling Winston logger with objects that reference each other or contain
 * self-references, JSON.stringify() would throw "Converting circular structure to JSON" errors.
 * 
 * This file is designed to safely serialize such objects for logging purposes by preventing 
 * circular references and avoiding issues during JSON.stringify().
 */

/**
 * Configuration interface for serialization options
 * 
 * @interface ISerializeConfig
 * @property {number} [maxDepth=5] - Maximum depth to traverse when serializing an object
 * @property {number} [maxArrayLength=10] - Maximum number of array items to include
 * @property {number} [maxObjectKeys=20] - Maximum number of object properties to include
 * @property {number} [maxStackLines=5] - Maximum number of stack trace lines to include for errors
 */
export interface ISerializeConfig {
  maxDepth?: number
  maxArrayLength?: number
  maxObjectKeys?: number
  maxStackLines?: number
}

/**
 * Default configuration values for serialization
 * Used when specific configuration is not provided (Ensure all properties are required)
 */
const DEFAULT_CONFIG: Required<ISerializeConfig> = {
  maxDepth: 5,
  maxArrayLength: 10,
  maxObjectKeys: 20,
  maxStackLines: 5,
}

/**
 * Safely serialize any object for logging - handles circular references, functions, errors and special types
 * 
 * This function traverses the object and replaces problematic values with safe representations:
 * - Circular references are replaced with "[Circular Reference]"
 * - Functions are replaced with "[Function: name]"
 * - Error objects have their stack traces limited
 * - Arrays and objects are truncated based on configuration
 * - Special objects like Date, RegExp, Buffer, Map, Set are handled appropriately
 *
 * @param {any} obj - Object to serialize
 * @param {ISerializeConfig} config - Configuration options for serialization
 * @returns {any} Safe serialized object ready for logging
 */
export const safeSerialize = (obj: any, config: ISerializeConfig): any => {
  // Merge user config with defaults to ensure all required properties are available
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }

  // Use a WeakSet to track seen objects and prevent circular references
  const seen = new WeakSet()

  /**
   * Internal recursive function to handle serialization at each level
   * 
   * @param {any} value - Value to serialize
   * @param {number} depth - Current depth in the traversal
   * @returns {any} Serialized value
   */
  const serialize = (value: any, depth: number): any => {
    // Prevent excessive recursion by limiting depth
    if (depth > mergedConfig.maxDepth) return '[Max Depth Reached]'

    // Handle null and undefined values
    if (value === null || typeof value === 'undefined') return null

    // Handle functions by returning their names rather than the actual code
    if (typeof value === 'function') return `[Function: ${value.name || 'anonymous'}]`

    // Primitive values can be returned as-is (string, number, boolean)
    if (typeof value !== 'object') return value

    // Circular reference check
    if (seen.has(value)) {
      return '[Circular Reference]'
    }

    // Add the current value to the seen set to track circular references
    seen.add(value)

    try {
      // Handle arrays and limit their length to prevent excessive output
      if (Array.isArray(value)) {
        // Take only the first N elements based on configuration
        const limitedArray = value.slice(0, mergedConfig.maxArrayLength)
        
        // Recursively serialize each array element
        const result = limitedArray.map(item => serialize(item, depth + 1))

        // Add indicator if array was truncated
        if (value.length > mergedConfig.maxArrayLength) {
          result.push(`[... ${value.length - mergedConfig.maxArrayLength} more items]`)
        }
        
        return result
      }

      // Handle special object types with custom serialization logic
      
      // Convert Date objects to ISO string format for consistent timestamp representation
      if (value instanceof Date) return value.toISOString()
      
      // Convert RegExp objects to their string representation for readability
      if (value instanceof RegExp) return value.toString()

      // Handle Error objects by extracting key properties and limiting stack trace
      if (value instanceof Error) {
        return { 
          name: value.name,
          message: value.message,
          // Limit stack trace lines to prevent excessive output in logs
          stack: value.stack?.split('\n').slice(0, mergedConfig.maxStackLines).join('\n')
        }
      }

      // Show Buffer size rather than raw binary content which would be unreadable
      if (value instanceof Buffer) return `[Buffer: ${value.length} bytes]`

      // Handle Set
      if (value instanceof Set) {
        // Show Set size and limited preview of contents
        // Convert to array and take only first 5 items for preview
        return `[Set: ${value.size} items] ${JSON.stringify([...value].slice(0, 5))}${
          value.size > 5 ? ` ... and ${value.size - 5} more` : ''
        }`
      }
      
      // Handle Map
      if (value instanceof Map) {
        // Show Map size and limited preview of entries
        // Convert Map to object entries for preview, showing only first 5 key-value pairs
        return `[Map: ${value.size} entries] ${JSON.stringify(Object.fromEntries([...value].slice(0, 5)))}${
          value.size > 5 ? ` ... and ${value.size - 5} more` : ''
        }`
      }

      // Handle regular objects (Plain Objects)
      const result: Record<string, any> = {}
      
      // Get limited set of keys to avoid excessive output
      const limitedKeys = Object.keys(value).slice(0, mergedConfig.maxObjectKeys)
      
      // Process each key in the limited set
      for (const key of limitedKeys) {
        // Only serialize own properties (not inherited) to avoid prototype pollution
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          // Recursively serialize each property value, increasing depth
          result[key] = serialize(value[key], depth + 1)
        }
      }

      // Add indication if object was truncated due to having too many keys
      if (Object.keys(value).length > mergedConfig.maxObjectKeys) {
        result['[truncated]'] = `[... ${Object.keys(value).length - mergedConfig.maxObjectKeys} more keys]`
      }

      return result
    } catch (error) {
      return `[Serialization Error: ${error instanceof Error ? error.message : String(error)}]`
    }
  }

  return serialize(obj, 0)
}

/**
 * Enhanced function for safely logging metadata from an object.
 * This function is particularly useful for API logging or audit logs where you want
 * to include only specific fields from a larger object (like a user or request object).
 * 
 * @template T - Object type with string keys
 * @param {T} obj - Source object to extract metadata from
 * @param {(keyof T)[]} allowedKeys - Array of keys to include in the result
 * @param {ISerializeConfig} [config] - Optional configuration for serialization
 * @returns {Partial<T>} Object containing only the allowed keys with safely serialized values
 */
export function safeLogMetadata<T extends Record<string, any>>(
  obj: T,
  allowedKeys: (keyof T)[],
  config?: ISerializeConfig
): Partial<T> {
  // Initialize empty result object
  const result: Partial<T> = {}
  
  // Process each allowed key from the input object
  for (const key of allowedKeys) {
    // Include the key in the result only if it exists in the source object
    // Use null for missing or undefined values to maintain consistent structure
    result[key] = (key in obj && obj[key] !== undefined)
      ? safeSerialize(obj[key], config || { maxDepth: 5 }) as T[keyof T]
      : null as T[keyof T]
  }
  
  return result
}

/**
 * Utility to check if an object might cause circular reference issues (Pre-check).
 * 
 * @param {any} obj - Object to check for circular references
 * @returns {boolean} True if circular references are detected, false otherwise
 */
export const hasCircularReference = (obj: any): boolean => {
  // Use WeakSet to track seen objects
  const seen = new WeakSet()
  
  /**
   * Internal recursive function to check for circular references
   * Traverses the object graph to find any self-references
   * 
   * @param {any} value - Value to check
   * @returns {boolean} True if circular reference is found, false otherwise
   */
  const check = (value: any): boolean => {
    // Non-objects cannot be circular references (primitives, null, undefined)
    if (value === null || typeof value !== 'object') return false
    
    // If we've seen this object before in this traversal path, it's a circular reference
    if (seen.has(value)) return true
    
    // Mark this object as seen in the current traversal path
    seen.add(value)
    
    try {
      // For arrays, check if any element has circular reference
      if (Array.isArray(value)) {
        return value.some(item => check(item))
      }
      
      // For objects, check if any property value has circular reference
      return Object.values(value).some(val => check(val))
    } catch (error) {
      // If we can't access the properties (e.g., due to getters that throw), 
      // assume it's safe to avoid false positives
      // This happens with some DOM objects, Proxies with traps, etc.
      return false
    }
  }
  
  // Start the recursive check on the root object
  return check(obj)
}

// Example of serialize circular references
// const configService = {
//   validatedConfig: null,
//   loggerService: {
//     logger: {
//       transports: [], // Assume that transport references to logger instances
//     },
//   },
//   settings: {
//     port: 3000,
//     env: 'development',
//   },
//   createdAt: new Date('2025-06-01T00:00:00Z'),
//   onError: function handleError() {},
//   nested: {
//     a: [1, 2, 3],
//     b: { c: 4 },
//   },
// }

// Result of safeSerialize(configService) <=> serialize(configService, 5)
// {
//   validatedConfig: null,
//   loggerService: {
//     logger: {
//       transports: ['[Circular Reference]']
//     }
//   },
//   settings: {
//     port: 3000,
//     env: 'development'
//   },
//   createdAt: '2025-06-01T00:00:00.000Z',
//   onError: '[Function: handleError]',
//   nested: {
//     a: [1, 2, 3],
//     b: { c: 4 }
//   }
// }

/**
 * Logger create transport (console, dailyRotateFile, etc.)
 * Transports keep references to logger instances, which can create circular references.
 * When log an object containing a logger instance -> it will try to serialize the whole object
 * JSON.stringify() meet circular references -> throw error
 * 
 * Object -> Logger -> Transports -> Logger -> Transport -> Logger -> ...
 */
