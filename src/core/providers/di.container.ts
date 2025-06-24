/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-31 11:35:11
 * @FilePath      : /server/src/core/providers/di.container.ts
 * @Description   : Dependency Injection Container using InversifyJS
 */

import { Container } from 'inversify'

/**
 * Type definition for a binding callback function.
 * A callback function that defines how to bind a specific `DI_TYPES` to an instance or implementation 
 * for Dependency Injection. This callback is executed during container initialization.
 * @callback BindingCallback
 * @param {Container} container - The inversify container instance.
 * @returns {void}
 */
export type BindingCallback = (container: Container) => void // <=> (container: Container): void => {...}

/**
 * Dependency Injection Container using InversifyJS.
 * @class DIContainer
 * @description Implements the Singleton pattern to ensure only one container instance exists
 * throughout the application. Manages dependency registration and resolution.
 */
export class DIContainer {
  /**
   * Singleton instance of the DIContainer.
   * @private
   * @static
   * @type {DIContainer | null}
   */
  private static instance: DIContainer | null = null

  /**
   * The InversifyJS container instance.
   * @private
   * @type {Container}
   */
  private container: Container
  
  /**
   * Array of module binding callbacks to be executed during initialization.
   * @private
   * @type {BindingCallback[]}
   */
  private moduleBindings: BindingCallback[] = []
  
  /**
   * Flag indicating whether the container has been initialized.
   * @private
   * @type {boolean} Defaults to false.
   * @default false
   */
  private isInitialized: boolean = false

  /**
   * Private constructor to prevent direct instantiation.
   * @constructor
   * @private
   */
  private constructor() {
    this.container = new Container({
      defaultScope: 'Singleton'
    })
  }

  /**
   * Get the singleton instance of the DIContainer.
   * @static
   * @returns {DIContainer} The singleton DIContainer instance.
   */
  public static getInstance(): DIContainer {
    // Init DIContainer if it doesn't exist
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer()
    }

    // Return the existing instance
    return DIContainer.instance
  }

  /**
   * Registers a callback function to define Dependency Injection bindings for a module.
   * The callback specifies how to bind a `DI_TYPES` identifier to a specific instance or implementation.
   * The callback is stored and executed later during container initialization.
   * @param {BindingCallback} bindingCallback - The callback function containing binding logic for Dependency Injection.
   * @throws {Error} If the container has already been initialized.
   * @returns {void}
   */
  public registerModule(bindingCallback: BindingCallback): void {
    // Check if the container is already initialized
    if (this.isInitialized) {
      throw new Error('Cannot register module after initialization')
    }

    // Register the binding callback if it's not already registered
    if (!this.moduleBindings.includes(bindingCallback)) {
      this.moduleBindings.push(bindingCallback)
    }
  }

  /**
   * Registers a batch of callback functions to define Dependency Injection bindings for multiple modules.
   * Each callback specifies how to bind a `DI_TYPES` identifier to a specific instance or implementation.
   * The callbacks are stored and executed later during container initialization.
   * @param {BindingCallback[]} batch - An array of callback functions containing binding logic for Dependency Injection.
   * @throws {Error} If the container has already been initialized.
   * @returns {void}
   */
  public registerModuleBatch(batch: BindingCallback[]): void {
    if (this.isInitialized) {
      throw new Error('Cannot register module batch after initialization')
    }

    // Register each binding callback in the batch
    for (const callback of batch) {
      this.registerModule(callback)
    }
  }

  /**
   * Initializes the container by executing all registered module bindings.
   * @returns {Container} The initialized InversifyJS container.
   * @throws {Error} If there's an error during initialization.
   */
  public initialize() {
    // Check if the container is already initialized
    if (this.isInitialized) {
      return this.container
    }

    // Execute all registered module bindings if the container is not initialized
    try {
      this.moduleBindings.forEach((bindingCallback: BindingCallback) => {
        bindingCallback(this.container)
      })
      this.isInitialized = true
    } catch (error) {
      throw new Error(`Error initializing container: ${error}`)
    }

    return this.container
  }

  /**
   * Gets the InversifyJS container instance.
   * @returns {Container} The InversifyJS container.
   * @throws {Error} If the container has not been initialized.
   */
  public getContainer(): Container {
    if (!this.isInitialized) {
      throw new Error('Container is not initialized')
    }
    return this.container
  }

  /**
   * Resets the singleton container instance and clears all module bindings.
   * @static
   * @returns {void}
   */
  public static reset(): void {
    DIContainer.instance = null
  }
}

// Example usage
// const exampleModuleBinding: BindingCallback = (container: Container): void => {
//   console.log('Binding example module...')
//   // container.bind<IExampleService>(DI_TYPES.IExampleService).to(ExampleServiceImpl)
// }

// console.log('Creating/ Getting DIContainer singleton instance...')
// const container: DIContainer = DIContainer.getInstance()
// console.log('Container singleton instance: ', container)

// console.log('Registering module...')
// container.registerModule(exampleModuleBinding)

// console.log('Initializing container & Bind module... (Execute all registered callbacks): ')
// container.initialize()

// console.log('Container initialized:', container.getContainer())

// const otherInstance = DIContainer.getInstance()
// console.log('Compare DIContainer Instance: ', container == otherInstance) // True
// console.log('Compare container: ', container.getContainer() === otherInstance.getContainer()) // True

// Example of binding callback, binding a module
// container.bind(...).to(...)
// container.registerModuleBatch([
//   userModule,
//   authModule,
//   postModule,
// ])
