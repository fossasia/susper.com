"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core");
const from_1 = require("rxjs/observable/from");
const operators_1 = require("rxjs/operators");
const interface_1 = require("../tree/interface");
const null_1 = require("../tree/null");
const static_1 = require("../tree/static");
const collection_1 = require("./collection");
const schematic_1 = require("./schematic");
const task_1 = require("./task");
class UnknownUrlSourceProtocol extends core_1.BaseException {
    constructor(url) { super(`Unknown Protocol on url "${url}".`); }
}
exports.UnknownUrlSourceProtocol = UnknownUrlSourceProtocol;
class UnknownCollectionException extends core_1.BaseException {
    constructor(name) { super(`Unknown collection "${name}".`); }
}
exports.UnknownCollectionException = UnknownCollectionException;
class CircularCollectionException extends core_1.BaseException {
    constructor(name) {
        super(`Circular collection reference "${name}".`);
    }
}
exports.CircularCollectionException = CircularCollectionException;
class UnknownSchematicException extends core_1.BaseException {
    constructor(name, collection) {
        super(`Schematic "${name}" not found in collection "${collection.name}".`);
    }
}
exports.UnknownSchematicException = UnknownSchematicException;
class SchematicEngineConflictingException extends core_1.BaseException {
    constructor() { super(`A schematic was called from a different engine as its parent.`); }
}
exports.SchematicEngineConflictingException = SchematicEngineConflictingException;
class UnregisteredTaskException extends core_1.BaseException {
    constructor(name, schematic) {
        const addendum = schematic ? ` in schematic "${schematic.name}"` : '';
        super(`Unregistered task "${name}"${addendum}.`);
    }
}
exports.UnregisteredTaskException = UnregisteredTaskException;
class SchematicEngine {
    constructor(_host) {
        this._host = _host;
        this._collectionCache = new Map();
        this._schematicCache = new Map();
        this._taskSchedulers = new Array();
    }
    get defaultMergeStrategy() { return this._host.defaultMergeStrategy || interface_1.MergeStrategy.Default; }
    createCollection(name) {
        let collection = this._collectionCache.get(name);
        if (collection) {
            return collection;
        }
        const [description, bases] = this._createCollectionDescription(name);
        collection = new collection_1.CollectionImpl(description, this, bases);
        this._collectionCache.set(name, collection);
        this._schematicCache.set(name, new Map());
        return collection;
    }
    _createCollectionDescription(name, parentNames) {
        const description = this._host.createCollectionDescription(name);
        if (!description) {
            throw new UnknownCollectionException(name);
        }
        if (parentNames && parentNames.has(description.name)) {
            throw new CircularCollectionException(name);
        }
        const bases = new Array();
        if (description.extends) {
            parentNames = (parentNames || new Set()).add(description.name);
            for (const baseName of description.extends) {
                const [base, baseBases] = this._createCollectionDescription(baseName, new Set(parentNames));
                bases.unshift(base, ...baseBases);
            }
        }
        return [description, bases];
    }
    createContext(schematic, parent) {
        // Check for inconsistencies.
        if (parent && parent.engine && parent.engine !== this) {
            throw new SchematicEngineConflictingException();
        }
        const context = {
            debug: parent && parent.debug || false,
            engine: this,
            logger: (parent && parent.logger && parent.logger.createChild(schematic.description.name))
                || new core_1.logging.NullLogger(),
            schematic,
            strategy: (parent && parent.strategy !== undefined)
                ? parent.strategy : this.defaultMergeStrategy,
            addTask,
        };
        const taskScheduler = new task_1.TaskScheduler(context);
        const host = this._host;
        this._taskSchedulers.push(taskScheduler);
        function addTask(task, dependencies) {
            const config = task.toConfiguration();
            if (!host.hasTaskExecutor(config.name)) {
                throw new UnregisteredTaskException(config.name, schematic.description);
            }
            config.dependencies = config.dependencies || [];
            if (dependencies) {
                config.dependencies.unshift(...dependencies);
            }
            return taskScheduler.schedule(config);
        }
        return context;
    }
    createSchematic(name, collection) {
        const collectionImpl = this._collectionCache.get(collection.description.name);
        const schematicMap = this._schematicCache.get(collection.description.name);
        if (!collectionImpl || !schematicMap || collectionImpl !== collection) {
            // This is weird, maybe the collection was created by another engine?
            throw new UnknownCollectionException(collection.description.name);
        }
        let schematic = schematicMap.get(name);
        if (schematic) {
            return schematic;
        }
        let collectionDescription = collection.description;
        let description = this._host.createSchematicDescription(name, collection.description);
        if (!description) {
            if (collection.baseDescriptions) {
                for (const base of collection.baseDescriptions) {
                    description = this._host.createSchematicDescription(name, base);
                    if (description) {
                        collectionDescription = base;
                        break;
                    }
                }
            }
            if (!description) {
                // Report the error for the top level schematic collection
                throw new UnknownSchematicException(name, collection.description);
            }
        }
        const factory = this._host.getSchematicRuleFactory(description, collectionDescription);
        schematic = new schematic_1.SchematicImpl(description, factory, collection, this);
        schematicMap.set(name, schematic);
        return schematic;
    }
    listSchematicNames(collection) {
        const names = this._host.listSchematicNames(collection.description);
        if (collection.baseDescriptions) {
            for (const base of collection.baseDescriptions) {
                names.push(...this._host.listSchematicNames(base));
            }
        }
        // remove duplicates
        return [...new Set(names)];
    }
    transformOptions(schematic, options) {
        return this._host.transformOptions(schematic.description, options);
    }
    createSourceFromUrl(url, context) {
        switch (url.protocol) {
            case 'null:': return () => new null_1.NullTree();
            case 'empty:': return () => static_1.empty();
            default:
                const hostSource = this._host.createSourceFromUrl(url, context);
                if (!hostSource) {
                    throw new UnknownUrlSourceProtocol(url.toString());
                }
                return hostSource;
        }
    }
    executePostTasks() {
        const executors = new Map();
        const taskObservable = from_1.from(this._taskSchedulers)
            .pipe(operators_1.concatMap(scheduler => scheduler.finalize()), operators_1.concatMap(task => {
            const { name, options } = task.configuration;
            const executor = executors.get(name);
            if (executor) {
                return executor(options, task.context);
            }
            return this._host.createTaskExecutor(name)
                .pipe(operators_1.concatMap(executor => {
                executors.set(name, executor);
                return executor(options, task.context);
            }));
        }));
        return taskObservable;
    }
}
exports.SchematicEngine = SchematicEngine;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5naW5lLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3NyYy9lbmdpbmUvZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsK0NBQThEO0FBRTlELCtDQUE4RDtBQUM5RCw4Q0FBMkM7QUFFM0MsaURBQWtEO0FBQ2xELHVDQUF3QztBQUN4QywyQ0FBdUM7QUFDdkMsNkNBQThDO0FBVzlDLDJDQUE0QztBQUM1QyxpQ0FLZ0I7QUFHaEIsOEJBQXNDLFNBQVEsb0JBQWE7SUFDekQsWUFBWSxHQUFXLElBQUksS0FBSyxDQUFDLDRCQUE0QixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUN6RTtBQUZELDREQUVDO0FBRUQsZ0NBQXdDLFNBQVEsb0JBQWE7SUFDM0QsWUFBWSxJQUFZLElBQUksS0FBSyxDQUFDLHVCQUF1QixJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUN0RTtBQUZELGdFQUVDO0FBRUQsaUNBQXlDLFNBQVEsb0JBQWE7SUFDNUQsWUFBWSxJQUFZO1FBQ3RCLEtBQUssQ0FBQyxrQ0FBa0MsSUFBSSxJQUFJLENBQUMsQ0FBQztJQUNwRCxDQUFDO0NBQ0Y7QUFKRCxrRUFJQztBQUVELCtCQUF1QyxTQUFRLG9CQUFhO0lBQzFELFlBQVksSUFBWSxFQUFFLFVBQXFDO1FBQzdELEtBQUssQ0FBQyxjQUFjLElBQUksOEJBQThCLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO0lBQzdFLENBQUM7Q0FDRjtBQUpELDhEQUlDO0FBRUQseUNBQWlELFNBQVEsb0JBQWE7SUFDcEUsZ0JBQWdCLEtBQUssQ0FBQywrREFBK0QsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUMxRjtBQUZELGtGQUVDO0FBRUQsK0JBQXVDLFNBQVEsb0JBQWE7SUFDMUQsWUFBWSxJQUFZLEVBQUUsU0FBd0M7UUFDaEUsTUFBTSxRQUFRLEdB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QUFDO1FBRWxELE1BQU0sY0FBYyxHQUFHLFdBQWMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO2FBQ3hELElBQUksQ0FDSCxxQkFBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQzVDLHFCQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDZixNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7WUFFN0MsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNiLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QyxDQUFDO1lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDO2lCQUN2QyxJQUFJLENBQUMscUJBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDekIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRTlCLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1IsQ0FBQyxDQUFDLENBQ0gsQ0FBQztRQUVKLE1BQU0sQ0FBQyxjQUFjLENBQUM7SUFDeEIsQ0FBQztDQUNGO0FBdE1ELDBDQXNNQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IEJhc2VFeGNlcHRpb24sIGxvZ2dpbmcgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGZyb20gYXMgb2JzZXJ2YWJsZUZyb20gfSBmcm9tICdyeGpzL29ic2VydmFibGUvZnJvbSc7XG5pbXBvcnQgeyBjb25jYXRNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBVcmwgfSBmcm9tICd1cmwnO1xuaW1wb3J0IHsgTWVyZ2VTdHJhdGVneSB9IGZyb20gJy4uL3RyZWUvaW50ZXJmYWNlJztcbmltcG9ydCB7IE51bGxUcmVlIH0gZnJvbSAnLi4vdHJlZS9udWxsJztcbmltcG9ydCB7IGVtcHR5IH0gZnJvbSAnLi4vdHJlZS9zdGF0aWMnO1xuaW1wb3J0IHsgQ29sbGVjdGlvbkltcGwgfSBmcm9tICcuL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtcbiAgQ29sbGVjdGlvbixcbiAgQ29sbGVjdGlvbkRlc2NyaXB0aW9uLFxuICBFbmdpbmUsXG4gIEVuZ2luZUhvc3QsXG4gIFNjaGVtYXRpYyxcbiAgU2NoZW1hdGljRGVzY3JpcHRpb24sXG4gIFNvdXJjZSxcbiAgVHlwZWRTY2hlbWF0aWNDb250ZXh0LFxufSBmcm9tICcuL2ludGVyZmFjZSc7XG5pbXBvcnQgeyBTY2hlbWF0aWNJbXBsIH0gZnJvbSAnLi9zY2hlbWF0aWMnO1xuaW1wb3J0IHtcbiAgVGFza0NvbmZpZ3VyYXRpb25HZW5lcmF0b3IsXG4gIFRhc2tFeGVjdXRvcixcbiAgVGFza0lkLFxuICBUYXNrU2NoZWR1bGVyLFxufSBmcm9tICcuL3Rhc2snO1xuXG5cbmV4cG9ydCBjbGFzcyBVbmtub3duVXJsU291cmNlUHJvdG9jb2wgZXh0ZW5kcyBCYXNlRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcpIHsgc3VwZXIoYFVua25vd24gUHJvdG9jb2wgb24gdXJsIFwiJHt1cmx9XCIuYCk7IH1cbn1cblxuZXhwb3J0IGNsYXNzIFVua25vd25Db2xsZWN0aW9uRXhjZXB0aW9uIGV4dGVuZHMgQmFzZUV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykgeyBzdXBlcihgVW5rbm93biBjb2xsZWN0aW9uIFwiJHtuYW1lfVwiLmApOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBDaXJjdWxhckNvbGxlY3Rpb25FeGNlcHRpb24gZXh0ZW5kcyBCYXNlRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XG4gICAgc3VwZXIoYENpcmN1bGFyIGNvbGxlY3Rpb24gcmVmZXJlbmNlIFwiJHtuYW1lfVwiLmApO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBVbmtub3duU2NoZW1hdGljRXhjZXB0aW9uIGV4dGVuZHMgQmFzZUV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgY29sbGVjdGlvbjogQ29sbGVjdGlvbkRlc2NyaXB0aW9uPHt9Pikge1xuICAgIHN1cGVyKGBTY2hlbWF0aWMgXCIke25hbWV9XCIgbm90IGZvdW5kIGluIGNvbGxlY3Rpb24gXCIke2NvbGxlY3Rpb24ubmFtZX1cIi5gKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2NoZW1hdGljRW5naW5lQ29uZmxpY3RpbmdFeGNlcHRpb24gZXh0ZW5kcyBCYXNlRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IoKSB7IHN1cGVyKGBBIHNjaGVtYXRpYyB3YXMgY2FsbGVkIGZyb20gYSBkaWZmZXJlbnQgZW5naW5lIGFzIGl0cyBwYXJlbnQuYCk7IH1cbn1cblxuZXhwb3J0IGNsYXNzIFVucmVnaXN0ZXJlZFRhc2tFeGNlcHRpb24gZXh0ZW5kcyBCYXNlRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBzY2hlbWF0aWM/OiBTY2hlbWF0aWNEZXNjcmlwdGlvbjx7fSwge30+KSB7XG4gICAgY29uc3QgYWRkZW5kdW0gPSBzY2hlbWF0aWMgPyBgIGluIHNjaGVtYXRpYyBcIiR7c2NoZW1hdGljLm5hbWV9XCJgIDogJyc7XG4gICAgc3VwZXIoYFVucmVnaXN0ZXJlZCB0YXNrIFwiJHtuYW1lfVwiJHthZGRlbmR1bX0uYCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNjaGVtYXRpY0VuZ2luZTxDb2xsZWN0aW9uVCBleHRlbmRzIG9iamVjdCwgU2NoZW1hdGljVCBleHRlbmRzIG9iamVjdD5cbiAgICBpbXBsZW1lbnRzIEVuZ2luZTxDb2xsZWN0aW9uVCwgU2NoZW1hdGljVD4ge1xuXG4gIHByaXZhdGUgX2NvbGxlY3Rpb25DYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBDb2xsZWN0aW9uSW1wbDxDb2xsZWN0aW9uVCwgU2NoZW1hdGljVD4+KCk7XG4gIHByaXZhdGUgX3NjaGVtYXRpY0NhY2hlXG4gICAgPSBuZXcgTWFwPHN0cmluZywgTWFwPHN0cmluZywgU2NoZW1hdGljSW1wbDxDb2xsZWN0aW9uVCwgU2NoZW1hdGljVD4+PigpO1xuICBwcml2YXRlIF90YXNrU2NoZWR1bGVycyA9IG5ldyBBcnJheTxUYXNrU2NoZWR1bGVyPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2hvc3Q6IEVuZ2luZUhvc3Q8Q29sbGVjdGlvblQsIFNjaGVtYXRpY1Q+KSB7XG4gIH1cblxuICBnZXQgZGVmYXVsdE1lcmdlU3RyYXRlZ3koKSB7IHJldHVybiB0aGlzLl9ob3N0LmRlZmF1bHRNZXJnZVN0cmF0ZWd5IHx8IE1lcmdlU3RyYXRlZ3kuRGVmYXVsdDsgfVxuXG4gIGNyZWF0ZUNvbGxlY3Rpb24obmFtZTogc3RyaW5nKTogQ29sbGVjdGlvbjxDb2xsZWN0aW9uVCwgU2NoZW1hdGljVD4ge1xuICAgIGxldCBjb2xsZWN0aW9uID0gdGhpcy5fY29sbGVjdGlvbkNhY2hlLmdldChuYW1lKTtcbiAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgfVxuXG4gICAgY29uc3QgW2Rlc2NyaXB0aW9uLCBiYXNlc10gPSB0aGlzLl9jcmVhdGVDb2xsZWN0aW9uRGVzY3JpcHRpb24obmFtZSk7XG5cbiAgICBjb2xsZWN0aW9uID0gbmV3IENvbGxlY3Rpb25JbXBsPENvbGxlY3Rpb25ULCBTY2hlbWF0aWNUPihkZXNjcmlwdGlvbiwgdGhpcywgYmFzZXMpO1xuICAgIHRoaXMuX2NvbGxlY3Rpb25DYWNoZS5zZXQobmFtZSwgY29sbGVjdGlvbik7XG4gICAgdGhpcy5fc2NoZW1hdGljQ2FjaGUuc2V0KG5hbWUsIG5ldyBNYXAoKSk7XG5cbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZUNvbGxlY3Rpb25EZXNjcmlwdGlvbihcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgcGFyZW50TmFtZXM/OiBTZXQ8c3RyaW5nPixcbiAgKTogW0NvbGxlY3Rpb25EZXNjcmlwdGlvbjxDb2xsZWN0aW9uVD4sIEFycmF5PENvbGxlY3Rpb25EZXNjcmlwdGlvbjxDb2xsZWN0aW9uVD4+XSB7XG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSB0aGlzLl9ob3N0LmNyZWF0ZUNvbGxlY3Rpb25EZXNjcmlwdGlvbihuYW1lKTtcbiAgICBpZiAoIWRlc2NyaXB0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgVW5rbm93bkNvbGxlY3Rpb25FeGNlcHRpb24obmFtZSk7XG4gICAgfVxuICAgIGlmIChwYXJlbnROYW1lcyAmJiBwYXJlbnROYW1lcy5oYXMoZGVzY3JpcHRpb24ubmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBDaXJjdWxhckNvbGxlY3Rpb25FeGNlcHRpb24obmFtZSk7XG4gICAgfVxuXG4gICAgY29uc3QgYmFzZXMgPSBuZXcgQXJyYXk8Q29sbGVjdGlvbkRlc2NyaXB0aW9uPENvbGxlY3Rpb25UPj4oKTtcbiAgICBpZiAoZGVzY3JpcHRpb24uZXh0ZW5kcykge1xuICAgICAgcGFyZW50TmFtZXMgPSAocGFyZW50TmFtZXMgfHwgbmV3IFNldDxzdHJpbmc+KCkpLmFkZChkZXNjcmlwdGlvbi5uYW1lKTtcbiAgICAgIGZvciAoY29uc3QgYmFzZU5hbWUgb2YgZGVzY3JpcHRpb24uZXh0ZW5kcykge1xuICAgICAgICBjb25zdCBbYmFzZSwgYmFzZUJhc2VzXSA9IHRoaXMuX2NyZWF0ZUNvbGxlY3Rpb25EZXNjcmlwdGlvbihiYXNlTmFtZSwgbmV3IFNldChwYXJlbnROYW1lcykpO1xuXG4gICAgICAgIGJhc2VzLnVuc2hpZnQoYmFzZSwgLi4uYmFzZUJhc2VzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gW2Rlc2NyaXB0aW9uLCBiYXNlc107XG4gIH1cblxuICBjcmVhdGVDb250ZXh0KFxuICAgIHNjaGVtYXRpYzogU2NoZW1hdGljPENvbGxlY3Rpb25ULCBTY2hlbWF0aWNUPixcbiAgICBwYXJlbnQ/OiBQYXJ0aWFsPFR5cGVkU2NoZW1hdGljQ29udGV4dDxDb2xsZWN0aW9uVCwgU2NoZW1hdGljVD4+LFxuICApOiBUeXBlZFNjaGVtYXRpY0NvbnRleHQ8Q29sbGVjdGlvblQsIFNjaGVtYXRpY1Q+IHtcbiAgICAvLyBDaGVjayBmb3IgaW5jb25zaXN0ZW5jaWVzLlxuICAgIGlmIChwYXJlbnQgJiYgcGFyZW50LmVuZ2luZSAmJiBwYXJlbnQuZW5naW5lICE9PSB0aGlzKSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljRW5naW5lQ29uZmxpY3RpbmdFeGNlcHRpb24oKTtcbiAgICB9XG5cbiAgICBjb25zdCBjb250ZXh0ID0ge1xuICAgICAgZGVidWc6IHBhcmVudCAmJiBwYXJlbnQuZGVidWcgfHwgZmFsc2UsXG4gICAgICBlbmdpbmU6IHRoaXMsXG4gICAgICBsb2dnZXI6IChwYXJlbnQgJiYgcGFyZW50LmxvZ2dlciAmJiBwYXJlbnQubG9nZ2VyLmNyZWF0ZUNoaWxkKHNjaGVtYXRpYy5kZXNjcmlwdGlvbi5uYW1lKSlcbiAgICAgICAgICAgICAgfHwgbmV3IGxvZ2dpbmcuTnVsbExvZ2dlcigpLFxuICAgICAgc2NoZW1hdGljLFxuICAgICAgc3RyYXRlZ3k6IChwYXJlbnQgJiYgcGFyZW50LnN0cmF0ZWd5ICE9PSB1bmRlZmluZWQpXG4gICAgICAgID8gcGFyZW50LnN0cmF0ZWd5IDogdGhpcy5kZWZhdWx0TWVyZ2VTdHJhdGVneSxcbiAgICAgIGFkZFRhc2ssXG4gICAgfTtcblxuICAgIGNvbnN0IHRhc2tTY2hlZHVsZXIgPSBuZXcgVGFza1NjaGVkdWxlcihjb250ZXh0KTtcbiAgICBjb25zdCBob3N0ID0gdGhpcy5faG9zdDtcbiAgICB0aGlzLl90YXNrU2NoZWR1bGVycy5wdXNoKHRhc2tTY2hlZHVsZXIpO1xuXG4gICAgZnVuY3Rpb24gYWRkVGFzazxUPihcbiAgICAgIHRhc2s6IFRhc2tDb25maWd1cmF0aW9uR2VuZXJhdG9yPFQ+LFxuICAgICAgZGVwZW5kZW5jaWVzPzogQXJyYXk8VGFza0lkPixcbiAgICApOiBUYXNrSWQge1xuICAgICAgY29uc3QgY29uZmlnID0gdGFzay50b0NvbmZpZ3VyYXRpb24oKTtcblxuICAgICAgaWYgKCFob3N0Lmhhc1Rhc2tFeGVjdXRvcihjb25maWcubmFtZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFVucmVnaXN0ZXJlZFRhc2tFeGNlcHRpb24oY29uZmlnLm5hbWUsIHNjaGVtYXRpYy5kZXNjcmlwdGlvbik7XG4gICAgICB9XG5cbiAgICAgIGNvbmZpZy5kZXBlbmRlbmNpZXMgPSBjb25maWcuZGVwZW5kZW5jaWVzIHx8IFtdO1xuICAgICAgaWYgKGRlcGVuZGVuY2llcykge1xuICAgICAgICBjb25maWcuZGVwZW5kZW5jaWVzLnVuc2hpZnQoLi4uZGVwZW5kZW5jaWVzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRhc2tTY2hlZHVsZXIuc2NoZWR1bGUoY29uZmlnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udGV4dDtcbiAgfVxuXG4gIGNyZWF0ZVNjaGVtYXRpYyhcbiAgICAgIG5hbWU6IHN0cmluZyxcbiAgICAgIGNvbGxlY3Rpb246IENvbGxlY3Rpb248Q29sbGVjdGlvblQsIFNjaGVtYXRpY1Q+KTogU2NoZW1hdGljPENvbGxlY3Rpb25ULCBTY2hlbWF0aWNUPiB7XG4gICAgY29uc3QgY29sbGVjdGlvbkltcGwgPSB0aGlzLl9jb2xsZWN0aW9uQ2FjaGUuZ2V0KGNvbGxlY3Rpb24uZGVzY3JpcHRpb24ubmFtZSk7XG4gICAgY29uc3Qgc2NoZW1hdGljTWFwID0gdGhpcy5fc2NoZW1hdGljQ2FjaGUuZ2V0KGNvbGxlY3Rpb24uZGVzY3JpcHRpb24ubmFtZSk7XG4gICAgaWYgKCFjb2xsZWN0aW9uSW1wbCB8fCAhc2NoZW1hdGljTWFwIHx8IGNvbGxlY3Rpb25JbXBsICE9PSBjb2xsZWN0aW9uKSB7XG4gICAgICAvLyBUaGlzIGlzIHdlaXJkLCBtYXliZSB0aGUgY29sbGVjdGlvbiB3YXMgY3JlYXRlZCBieSBhbm90aGVyIGVuZ2luZT9cbiAgICAgIHRocm93IG5ldyBVbmtub3duQ29sbGVjdGlvbkV4Y2VwdGlvbihjb2xsZWN0aW9uLmRlc2NyaXB0aW9uLm5hbWUpO1xuICAgIH1cblxuICAgIGxldCBzY2hlbWF0aWMgPSBzY2hlbWF0aWNNYXAuZ2V0KG5hbWUpO1xuICAgIGlmIChzY2hlbWF0aWMpIHtcbiAgICAgIHJldHVybiBzY2hlbWF0aWM7XG4gICAgfVxuXG4gICAgbGV0IGNvbGxlY3Rpb25EZXNjcmlwdGlvbiA9IGNvbGxlY3Rpb24uZGVzY3JpcHRpb247XG4gICAgbGV0IGRlc2NyaXB0aW9uID0gdGhpcy5faG9zdC5jcmVhdGVTY2hlbWF0aWNEZXNjcmlwdGlvbihuYW1lLCBjb2xsZWN0aW9uLmRlc2NyaXB0aW9uKTtcbiAgICBpZiAoIWRlc2NyaXB0aW9uKSB7XG4gICAgICBpZiAoY29sbGVjdGlvbi5iYXNlRGVzY3JpcHRpb25zKSB7XG4gICAgICAgIGZvciAoY29uc3QgYmFzZSBvZiBjb2xsZWN0aW9uLmJhc2VEZXNjcmlwdGlvbnMpIHtcbiAgICAgICAgICBkZXNjcmlwdGlvbiA9IHRoaXMuX2hvc3QuY3JlYXRlU2NoZW1hdGljRGVzY3JpcHRpb24obmFtZSwgYmFzZSk7XG4gICAgICAgICAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBjb2xsZWN0aW9uRGVzY3JpcHRpb24gPSBiYXNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIWRlc2NyaXB0aW9uKSB7XG4gICAgICAgIC8vIFJlcG9ydCB0aGUgZXJyb3IgZm9yIHRoZSB0b3AgbGV2ZWwgc2NoZW1hdGljIGNvbGxlY3Rpb25cbiAgICAgICAgdGhyb3cgbmV3IFVua25vd25TY2hlbWF0aWNFeGNlcHRpb24obmFtZSwgY29sbGVjdGlvbi5kZXNjcmlwdGlvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZmFjdG9yeSA9IHRoaXMuX2hvc3QuZ2V0U2NoZW1hdGljUnVsZUZhY3RvcnkoZGVzY3JpcHRpb24sIGNvbGxlY3Rpb25EZXNjcmlwdGlvbik7XG4gICAgc2NoZW1hdGljID0gbmV3IFNjaGVtYXRpY0ltcGw8Q29sbGVjdGlvblQsIFNjaGVtYXRpY1Q+KGRlc2NyaXB0aW9uLCBmYWN0b3J5LCBjb2xsZWN0aW9uLCB0aGlzKTtcblxuICAgIHNjaGVtYXRpY01hcC5zZXQobmFtZSwgc2NoZW1hdGljKTtcblxuICAgIHJldHVybiBzY2hlbWF0aWM7XG4gIH1cblxuICBsaXN0U2NoZW1hdGljTmFtZXMoY29sbGVjdGlvbjogQ29sbGVjdGlvbjxDb2xsZWN0aW9uVCwgU2NoZW1hdGljVD4pOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgbmFtZXMgPSB0aGlzLl9ob3N0Lmxpc3RTY2hlbWF0aWNOYW1lcyhjb2xsZWN0aW9uLmRlc2NyaXB0aW9uKTtcblxuICAgIGlmIChjb2xsZWN0aW9uLmJhc2VEZXNjcmlwdGlvbnMpIHtcbiAgICAgIGZvciAoY29uc3QgYmFzZSBvZiBjb2xsZWN0aW9uLmJhc2VEZXNjcmlwdGlvbnMpIHtcbiAgICAgICAgbmFtZXMucHVzaCguLi50aGlzLl9ob3N0Lmxpc3RTY2hlbWF0aWNOYW1lcyhiYXNlKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIGR1cGxpY2F0ZXNcbiAgICByZXR1cm4gWy4uLm5ldyBTZXQobmFtZXMpXTtcbiAgfVxuXG4gIHRyYW5zZm9ybU9wdGlvbnM8T3B0aW9uVCBleHRlbmRzIG9iamVjdCwgUmVzdWx0VCBleHRlbmRzIG9iamVjdD4oXG4gICAgc2NoZW1hdGljOiBTY2hlbWF0aWM8Q29sbGVjdGlvblQsIFNjaGVtYXRpY1Q+LFxuICAgIG9wdGlvbnM6IE9wdGlvblQsXG4gICk6IE9ic2VydmFibGU8UmVzdWx0VD4ge1xuICAgIHJldHVybiB0aGlzLl9ob3N0LnRyYW5zZm9ybU9wdGlvbnM8T3B0aW9uVCwgUmVzdWx0VD4oc2NoZW1hdGljLmRlc2NyaXB0aW9uLCBvcHRpb25zKTtcbiAgfVxuXG4gIGNyZWF0ZVNvdXJjZUZyb21VcmwodXJsOiBVcmwsIGNvbnRleHQ6IFR5cGVkU2NoZW1hdGljQ29udGV4dDxDb2xsZWN0aW9uVCwgU2NoZW1hdGljVD4pOiBTb3VyY2Uge1xuICAgIHN3aXRjaCAodXJsLnByb3RvY29sKSB7XG4gICAgICBjYXNlICdudWxsOic6IHJldHVybiAoKSA9PiBuZXcgTnVsbFRyZWUoKTtcbiAgICAgIGNhc2UgJ2VtcHR5Oic6IHJldHVybiAoKSA9PiBlbXB0eSgpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc3QgaG9zdFNvdXJjZSA9IHRoaXMuX2hvc3QuY3JlYXRlU291cmNlRnJvbVVybCh1cmwsIGNvbnRleHQpO1xuICAgICAgICBpZiAoIWhvc3RTb3VyY2UpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVW5rbm93blVybFNvdXJjZVByb3RvY29sKHVybC50b1N0cmluZygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBob3N0U291cmNlO1xuICAgIH1cbiAgfVxuXG4gIGV4ZWN1dGVQb3N0VGFza3MoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgY29uc3QgZXhlY3V0b3JzID0gbmV3IE1hcDxzdHJpbmcsIFRhc2tFeGVjdXRvcj4oKTtcblxuICAgIGNvbnN0IHRhc2tPYnNlcnZhYmxlID0gb2JzZXJ2YWJsZUZyb20odGhpcy5fdGFza1NjaGVkdWxlcnMpXG4gICAgICAucGlwZShcbiAgICAgICAgY29uY2F0TWFwKHNjaGVkdWxlciA9PiBzY2hlZHVsZXIuZmluYWxpemUoKSksXG4gICAgICAgIGNvbmNhdE1hcCh0YXNrID0+IHtcbiAgICAgICAgICBjb25zdCB7IG5hbWUsIG9wdGlvbnMgfSA9IHRhc2suY29uZmlndXJhdGlvbjtcblxuICAgICAgICAgIGNvbnN0IGV4ZWN1dG9yID0gZXhlY3V0b3JzLmdldChuYW1lKTtcbiAgICAgICAgICBpZiAoZXhlY3V0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiBleGVjdXRvcihvcHRpb25zLCB0YXNrLmNvbnRleHQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB0aGlzLl9ob3N0LmNyZWF0ZVRhc2tFeGVjdXRvcihuYW1lKVxuICAgICAgICAgICAgLnBpcGUoY29uY2F0TWFwKGV4ZWN1dG9yID0+IHtcbiAgICAgICAgICAgICAgZXhlY3V0b3JzLnNldChuYW1lLCBleGVjdXRvcik7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIGV4ZWN1dG9yKG9wdGlvbnMsIHRhc2suY29udGV4dCk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIHJldHVybiB0YXNrT2JzZXJ2YWJsZTtcbiAgfVxufVxuIl19