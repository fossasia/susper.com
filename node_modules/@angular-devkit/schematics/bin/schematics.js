#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const node_1 = require("@angular-devkit/core/node");
const schematics_1 = require("@angular-devkit/schematics");
const tools_1 = require("@angular-devkit/schematics/tools");
const minimist = require("minimist");
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/ignoreElements");
/**
 * Show usage of the CLI tool, and exit the process.
 */
function usage(exitCode = 0) {
    logger.info(core_1.tags.stripIndent `
    schematics [CollectionName:]SchematicName [options, ...]

    By default, if the collection name is not specified, use the internal collection provided
    by the Schematics CLI.

    Options:
        --debug             Debug mode. This is true by default if the collection is a relative
                            path (in that case, turn off with --debug=false).
        --dry-run           Do not output anything, but instead just show what actions would be
                            performed. Default to true if debug is also true.
        --force             Force overwriting files that would otherwise be an error.
        --list-schematics   List all schematics from the collection, by name.
        --verbose           Show more information.

        --help              Show this message.

    Any additional option is passed to the Schematics depending on
  `);
    process.exit(exitCode);
    throw 0; // The node typing sometimes don't have a never type for process.exit().
}
/**
 * Parse the name of schematic passed in argument, and return a {collection, schematic} named
 * tuple. The user can pass in `collection-name:schematic-name`, and this function will either
 * return `{collection: 'collection-name', schematic: 'schematic-name'}`, or it will error out
 * and show usage.
 *
 * In the case where a collection name isn't part of the argument, the default is to use the
 * schematics package (@schematics/schematics) as the collection.
 *
 * This logic is entirely up to the tooling.
 *
 * @param str The argument to parse.
 * @return {{collection: string, schematic: (string)}}
 */
function parseSchematicName(str) {
    let collection = '@schematics/schematics';
    if (!str || str === null) {
        usage(1);
    }
    let schematic = str;
    if (schematic.indexOf(':') != -1) {
        [collection, schematic] = schematic.split(':', 2);
        if (!schematic) {
            usage(2);
        }
    }
    return { collection, schematic };
}
/** Parse the command line. */
const booleanArgs = ['debug', 'dry-run', 'force', 'help', 'list-schematics', 'verbose'];
const argv = minimist(process.argv.slice(2), {
    boolean: booleanArgs,
    default: {
        'debug': null,
        'dry-run': null,
    },
    '--': true,
});
/** Create the DevKit Logger used through the CLI. */
const logger = node_1.createConsoleLogger(argv['verbose']);
if (argv.help) {
    usage();
}
/** Get the collection an schematic name from the first argument. */
const { collection: collectionName, schematic: schematicName, } = parseSchematicName(argv._.shift() || null);
const isLocalCollection = collectionName.startsWith('.') || collectionName.startsWith('/');
/**
 * Create the SchematicEngine, which is used by the Schematic library as callbacks to load a
 * Collection or a Schematic.
 */
const engineHost = new tools_1.NodeModulesEngineHost();
const engine = new schematics_1.SchematicEngine(engineHost);
const schemaRegistry = new core_1.schema.JsonSchemaRegistry();
// Add support for schemaJson.
engineHost.registerOptionsTransform((schematic, options) => {
    if (schematic.schema && schematic.schemaJson) {
        const schemaJson = schematic.schemaJson;
        const ref = schemaJson.$id || ('/' + schematic.collection.name + '/' + schematic.name);
        schemaRegistry.addSchema(ref, schemaJson);
        const serializer = new core_1.schema.serializers.JavascriptSerializer();
        const fn = serializer.serialize(ref, schemaRegistry);
        return fn(options);
    }
    return options;
});
/**
 * The collection to be used.
 * @type {Collection|any}
 */
const collection = engine.createCollection(collectionName);
if (collection === null) {
    logger.fatal(`Invalid collection name: "${collectionName}".`);
    process.exit(3);
    throw 3; // TypeScript doesn't know that process.exit() never returns.
}
/** If the user wants to list schematics, we simply show all the schematic names. */
if (argv['list-schematics']) {
    logger.info(engineHost.listSchematics(collection).join('\n'));
    process.exit(0);
    throw 0; // TypeScript doesn't know that process.exit() never returns.
}
/** Create the schematic from the collection. */
const schematic = collection.createSchematic(schematicName);
/** Gather the arguments for later use. */
const debug = argv.debug === null ? isLocalCollection : argv.debug;
const dryRun = argv['dry-run'] === null ? debug : argv['dry-run'];
const force = argv['force'];
/** This host is the original Tree created from the current directory. */
const host = Observable_1.Observable.of(new schematics_1.FileSystemTree(new tools_1.FileSystemHost(process.cwd())));
// We need two sinks if we want to output what will happen, and actually do the work.
// Note that fsSink is technically not used if `--dry-run` is passed, but creating the Sink
// does not have any side effect.
const dryRunSink = new schematics_1.DryRunSink(process.cwd(), force);
const fsSink = new schematics_1.FileSystemSink(process.cwd(), force);
// We keep a boolean to tell us whether an error would occur if we were to commit to an
// actual filesystem. In this case we simply show the dry-run, but skip the fsSink commit.
let error = false;
const loggingQueue = [];
// Logs out dry run events.
dryRunSink.reporter.subscribe((event) => {
    switch (event.kind) {
        case 'error':
            const desc = event.description == 'alreadyExist' ? 'already exists' : 'does not exist.';
            logger.warn(`ERROR! ${event.path} ${desc}.`);
            error = true;
            break;
        case 'update':
            loggingQueue.push(core_1.tags.oneLine `
        ${core_1.terminal.white('UPDATE')} ${event.path} (${event.content.length} bytes)
      `);
            break;
        case 'create':
            loggingQueue.push(core_1.tags.oneLine `
        ${core_1.terminal.green('CREATE')} ${event.path} (${event.content.length} bytes)
      `);
            break;
        case 'delete':
            loggingQueue.push(`${core_1.terminal.yellow('DELETE')} ${event.path}`);
            break;
        case 'rename':
            loggingQueue.push(`${core_1.terminal.blue('RENAME')} ${event.path} => ${event.to}`);
            break;
    }
});
/**
 * Remove every options from argv that we support in schematics itself.
 */
const args = Object.assign({}, argv);
delete args['--'];
for (const key of booleanArgs) {
    delete args[key];
}
/**
 * Add options from `--` to args.
 */
const argv2 = minimist(argv['--']);
for (const key of Object.keys(argv2)) {
    args[key] = argv2[key];
}
delete args._;
/**
 * The main path. Call the schematic with the host. This creates a new Context for the schematic
 * to run in, then call the schematic rule using the input Tree. This returns a new Tree as if
 * the schematic was applied to it.
 *
 * We then optimize this tree. This removes any duplicated actions or actions that would result
 * in a noop (for example, creating then deleting a file). This is not necessary but will greatly
 * improve performance as hitting the file system is costly.
 *
 * Then we proceed to run the dryRun commit. We run this before we then commit to the filesystem
 * (if --dry-run was not passed or an error was detected by dryRun).
 */
schematic.call(args, host, { debug, logger: logger.asApi() })
    .map((tree) => schematics_1.Tree.optimize(tree))
    .concatMap((tree) => {
    return dryRunSink.commit(tree).ignoreElements().concat(Observable_1.Observable.of(tree));
})
    .concatMap((tree) => {
    if (!error) {
        // Output the logging queue.
        loggingQueue.forEach(log => logger.info(log));
    }
    if (dryRun || error) {
        return Observable_1.Observable.of(tree);
    }
    return fsSink.commit(tree).ignoreElements().concat(Observable_1.Observable.of(tree));
})
    .subscribe({
    error(err) {
        // Add extra processing to output better error messages.
        if (err instanceof core_1.schema.javascript.RequiredValueMissingException) {
            logger.fatal('Missing argument on the command line: ' + err.path.split('/').pop());
        }
        else if (err instanceof core_1.schema.javascript.InvalidPropertyNameException) {
            logger.fatal('A non-supported argument was passed: ' + err.path.split('/').pop());
        }
        else {
            logger.fatal(err.message);
        }
        process.exit(1);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hdGljcy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL2Jpbi9zY2hlbWF0aWNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQVFBLCtDQUE4RDtBQUM5RCxvREFBZ0U7QUFDaEUsMkRBT29DO0FBQ3BDLDREQUkwQztBQUMxQyxxQ0FBcUM7QUFDckMsZ0RBQTZDO0FBQzdDLDRDQUEwQztBQUcxQzs7R0FFRztBQUNILGVBQWUsUUFBUSxHQUFHLENBQUM7SUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFJLENBQUMsV0FBVyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQjNCLENBQUMsQ0FBQztJQUVILE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkIsTUFBTSxDQUFDLENBQUMsQ0FBRSx3RUFBd0U7QUFDcEYsQ0FBQztBQUdEOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCw0QkFBNEIsR0FBa0I7SUFDNUMsSUFBSSxVQUFVLEdBQUcsd0JBQXdCLENBQUM7SUFFMUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDekIsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELElBQUksU0FBUyxHQUFXLEdBQWEsQ0FBQztJQUN0QyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVsRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDZixLQUFLLENB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QUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNwRixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQixDQUFDO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgc2NoZW1hLCB0YWdzLCB0ZXJtaW5hbCB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IGNyZWF0ZUNvbnNvbGVMb2dnZXIgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZS9ub2RlJztcbmltcG9ydCB7XG4gIERyeVJ1bkV2ZW50LFxuICBEcnlSdW5TaW5rLFxuICBGaWxlU3lzdGVtU2luayxcbiAgRmlsZVN5c3RlbVRyZWUsXG4gIFNjaGVtYXRpY0VuZ2luZSxcbiAgVHJlZSxcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgRmlsZVN5c3RlbUhvc3QsXG4gIEZpbGVTeXN0ZW1TY2hlbWF0aWNEZXNjLFxuICBOb2RlTW9kdWxlc0VuZ2luZUhvc3QsXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzL3Rvb2xzJztcbmltcG9ydCAqIGFzIG1pbmltaXN0IGZyb20gJ21pbmltaXN0JztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9pZ25vcmVFbGVtZW50cyc7XG5cblxuLyoqXG4gKiBTaG93IHVzYWdlIG9mIHRoZSBDTEkgdG9vbCwgYW5kIGV4aXQgdGhlIHByb2Nlc3MuXG4gKi9cbmZ1bmN0aW9uIHVzYWdlKGV4aXRDb2RlID0gMCk6IG5ldmVyIHtcbiAgbG9nZ2VyLmluZm8odGFncy5zdHJpcEluZGVudGBcbiAgICBzY2hlbWF0aWNzIFtDb2xsZWN0aW9uTmFtZTpdU2NoZW1hdGljTmFtZSBbb3B0aW9ucywgLi4uXVxuXG4gICAgQnkgZGVmYXVsdCwgaWYgdGhlIGNvbGxlY3Rpb24gbmFtZSBpcyBub3Qgc3BlY2lmaWVkLCB1c2UgdGhlIGludGVybmFsIGNvbGxlY3Rpb24gcHJvdmlkZWRcbiAgICBieSB0aGUgU2NoZW1hdGljcyBDTEkuXG5cbiAgICBPcHRpb25zOlxuICAgICAgICAtLWRlYnVnICAgICAgICAgICAgIERlYnVnIG1vZGUuIFRoaXMgaXMgdHJ1ZSBieSBkZWZhdWx0IGlmIHRoZSBjb2xsZWN0aW9uIGlzIGEgcmVsYXRpdmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoIChpbiB0aGF0IGNhc2UsIHR1cm4gb2ZmIHdpdGggLS1kZWJ1Zz1mYWxzZSkuXG4gICAgICAgIC0tZHJ5LXJ1biAgICAgICAgICAgRG8gbm90IG91dHB1dCBhbnl0aGluZywgYnV0IGluc3RlYWQganVzdCBzaG93IHdoYXQgYWN0aW9ucyB3b3VsZCBiZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcmZvcm1lZC4gRGVmYXVsdCB0byB0cnVlIGlmIGRlYnVnIGlzIGFsc28gdHJ1ZS5cbiAgICAgICAgLS1mb3JjZSAgICAgICAgICAgICBGb3JjZSBvdmVyd3JpdGluZyBmaWxlcyB0aGF0IHdvdWxkIG90aGVyd2lzZSBiZSBhbiBlcnJvci5cbiAgICAgICAgLS1saXN0LXNjaGVtYXRpY3MgICBMaXN0IGFsbCBzY2hlbWF0aWNzIGZyb20gdGhlIGNvbGxlY3Rpb24sIGJ5IG5hbWUuXG4gICAgICAgIC0tdmVyYm9zZSAgICAgICAgICAgU2hvdyBtb3JlIGluZm9ybWF0aW9uLlxuXG4gICAgICAgIC0taGVscCAgICAgICAgICAgICAgU2hvdyB0aGlzIG1lc3NhZ2UuXG5cbiAgICBBbnkgYWRkaXRpb25hbCBvcHRpb24gaXMgcGFzc2VkIHRvIHRoZSBTY2hlbWF0aWNzIGRlcGVuZGluZyBvblxuICBgKTtcblxuICBwcm9jZXNzLmV4aXQoZXhpdENvZGUpO1xuICB0aHJvdyAwOyAgLy8gVGhlIG5vZGUgdHlwaW5nIHNvbWV0aW1lcyBkb24ndCBoYXZlIGEgbmV2ZXIgdHlwZSBmb3IgcHJvY2Vzcy5leGl0KCkuXG59XG5cblxuLyoqXG4gKiBQYXJzZSB0aGUgbmFtZSBvZiBzY2hlbWF0aWMgcGFzc2VkIGluIGFyZ3VtZW50LCBhbmQgcmV0dXJuIGEge2NvbGxlY3Rpb24sIHNjaGVtYXRpY30gbmFtZWRcbiAqIHR1cGxlLiBUaGUgdXNlciBjYW4gcGFzcyBpbiBgY29sbGVjdGlvbi1uYW1lOnNjaGVtYXRpYy1uYW1lYCwgYW5kIHRoaXMgZnVuY3Rpb24gd2lsbCBlaXRoZXJcbiAqIHJldHVybiBge2NvbGxlY3Rpb246ICdjb2xsZWN0aW9uLW5hbWUnLCBzY2hlbWF0aWM6ICdzY2hlbWF0aWMtbmFtZSd9YCwgb3IgaXQgd2lsbCBlcnJvciBvdXRcbiAqIGFuZCBzaG93IHVzYWdlLlxuICpcbiAqIEluIHRoZSBjYXNlIHdoZXJlIGEgY29sbGVjdGlvbiBuYW1lIGlzbid0IHBhcnQgb2YgdGhlIGFyZ3VtZW50LCB0aGUgZGVmYXVsdCBpcyB0byB1c2UgdGhlXG4gKiBzY2hlbWF0aWNzIHBhY2thZ2UgKEBzY2hlbWF0aWNzL3NjaGVtYXRpY3MpIGFzIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIFRoaXMgbG9naWMgaXMgZW50aXJlbHkgdXAgdG8gdGhlIHRvb2xpbmcuXG4gKlxuICogQHBhcmFtIHN0ciBUaGUgYXJndW1lbnQgdG8gcGFyc2UuXG4gKiBAcmV0dXJuIHt7Y29sbGVjdGlvbjogc3RyaW5nLCBzY2hlbWF0aWM6IChzdHJpbmcpfX1cbiAqL1xuZnVuY3Rpb24gcGFyc2VTY2hlbWF0aWNOYW1lKHN0cjogc3RyaW5nIHwgbnVsbCk6IHsgY29sbGVjdGlvbjogc3RyaW5nLCBzY2hlbWF0aWM6IHN0cmluZyB9IHtcbiAgbGV0IGNvbGxlY3Rpb24gPSAnQHNjaGVtYXRpY3Mvc2NoZW1hdGljcyc7XG5cbiAgaWYgKCFzdHIgfHwgc3RyID09PSBudWxsKSB7XG4gICAgdXNhZ2UoMSk7XG4gIH1cblxuICBsZXQgc2NoZW1hdGljOiBzdHJpbmcgPSBzdHIgYXMgc3RyaW5nO1xuICBpZiAoc2NoZW1hdGljLmluZGV4T2YoJzonKSAhPSAtMSkge1xuICAgIFtjb2xsZWN0aW9uLCBzY2hlbWF0aWNdID0gc2NoZW1hdGljLnNwbGl0KCc6JywgMik7XG5cbiAgICBpZiAoIXNjaGVtYXRpYykge1xuICAgICAgdXNhZ2UoMik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHsgY29sbGVjdGlvbiwgc2NoZW1hdGljIH07XG59XG5cblxuLyoqIFBhcnNlIHRoZSBjb21tYW5kIGxpbmUuICovXG5jb25zdCBib29sZWFuQXJncyA9IFsgJ2RlYnVnJywgJ2RyeS1ydW4nLCAnZm9yY2UnLCAnaGVscCcsICdsaXN0LXNjaGVtYXRpY3MnLCAndmVyYm9zZScgXTtcbmNvbnN0IGFyZ3YgPSBtaW5pbWlzdChwcm9jZXNzLmFyZ3Yuc2xpY2UoMiksIHtcbiAgYm9vbGVhbjogYm9vbGVhbkFyZ3MsXG4gIGRlZmF1bHQ6IHtcbiAgICAnZGVidWcnOiBudWxsLFxuICAgICdkcnktcnVuJzogbnVsbCxcbiAgfSxcbiAgJy0tJzogdHJ1ZSxcbn0pO1xuXG4vKiogQ3JlYXRlIHRoZSBEZXZLaXQgTG9nZ2VyIHVzZWQgdGhyb3VnaCB0aGUgQ0xJLiAqL1xuY29uc3QgbG9nZ2VyID0gY3JlYXRlQ29uc29sZUxvZ2dlcihhcmd2Wyd2ZXJib3NlJ10pO1xuXG5pZiAoYXJndi5oZWxwKSB7XG4gIHVzYWdlKCk7XG59XG5cbi8qKiBHZXQgdGhlIGNvbGxlY3Rpb24gYW4gc2NoZW1hdGljIG5hbWUgZnJvbSB0aGUgZmlyc3QgYXJndW1lbnQuICovXG5jb25zdCB7XG4gIGNvbGxlY3Rpb246IGNvbGxlY3Rpb25OYW1lLFxuICBzY2hlbWF0aWM6IHNjaGVtYXRpY05hbWUsXG59ID0gcGFyc2VTY2hlbWF0aWNOYW1lKGFyZ3YuXy5zaGlmdCgpIHx8IG51bGwpO1xuY29uc3QgaXNMb2NhbENvbGxlY3Rpb24gPSBjb2xsZWN0aW9uTmFtZS5zdGFydHNXaXRoKCcuJykgfHwgY29sbGVjdGlvbk5hbWUuc3RhcnRzV2l0aCgnLycpO1xuXG5cbi8qKlxuICogQ3JlYXRlIHRoZSBTY2hlbWF0aWNFbmdpbmUsIHdoaWNoIGlzIHVzZWQgYnkgdGhlIFNjaGVtYXRpYyBsaWJyYXJ5IGFzIGNhbGxiYWNrcyB0byBsb2FkIGFcbiAqIENvbGxlY3Rpb24gb3IgYSBTY2hlbWF0aWMuXG4gKi9cbmNvbnN0IGVuZ2luZUhvc3QgPSBuZXcgTm9kZU1vZHVsZXNFbmdpbmVIb3N0KCk7XG5jb25zdCBlbmdpbmUgPSBuZXcgU2NoZW1hdGljRW5naW5lKGVuZ2luZUhvc3QpO1xuXG5jb25zdCBzY2hlbWFSZWdpc3RyeSA9IG5ldyBzY2hlbWEuSnNvblNjaGVtYVJlZ2lzdHJ5KCk7XG5cbi8vIEFkZCBzdXBwb3J0IGZvciBzY2hlbWFKc29uLlxuZW5naW5lSG9zdC5yZWdpc3Rlck9wdGlvbnNUcmFuc2Zvcm0oKHNjaGVtYXRpYzogRmlsZVN5c3RlbVNjaGVtYXRpY0Rlc2MsIG9wdGlvbnM6IHt9KSA9PiB7XG4gIGlmIChzY2hlbWF0aWMuc2NoZW1hICYmIHNjaGVtYXRpYy5zY2hlbWFKc29uKSB7XG4gICAgY29uc3Qgc2NoZW1hSnNvbiA9IHNjaGVtYXRpYy5zY2hlbWFKc29uIGFzIHNjaGVtYS5Kc29uU2NoZW1hT2JqZWN0O1xuICAgIGNvbnN0IHJlZiA9IHNjaGVtYUpzb24uJGlkIHx8ICgnLycgKyBzY2hlbWF0aWMuY29sbGVjdGlvbi5uYW1lICsgJy8nICsgc2NoZW1hdGljLm5hbWUpO1xuICAgIHNjaGVtYVJlZ2lzdHJ5LmFkZFNjaGVtYShyZWYsIHNjaGVtYUpzb24pO1xuICAgIGNvbnN0IHNlcmlhbGl6ZXIgPSBuZXcgc2NoZW1hLnNlcmlhbGl6ZXJzLkphdmFzY3JpcHRTZXJpYWxpemVyKCk7XG4gICAgY29uc3QgZm4gPSBzZXJpYWxpemVyLnNlcmlhbGl6ZShyZWYsIHNjaGVtYVJlZ2lzdHJ5KTtcblxuICAgIHJldHVybiBmbihvcHRpb25zKTtcbiAgfVxuXG4gIHJldHVybiBvcHRpb25zO1xufSk7XG5cblxuLyoqXG4gKiBUaGUgY29sbGVjdGlvbiB0byBiZSB1c2VkLlxuICogQHR5cGUge0NvbGxlY3Rpb258YW55fVxuICovXG5jb25zdCBjb2xsZWN0aW9uID0gZW5naW5lLmNyZWF0ZUNvbGxlY3Rpb24oY29sbGVjdGlvbk5hbWUpO1xuaWYgKGNvbGxlY3Rpb24gPT09IG51bGwpIHtcbiAgbG9nZ2VyLmZhdGFsKGBJbnZhbGlkIGNvbGxlY3Rpb24gbmFtZTogXCIke2NvbGxlY3Rpb25OYW1lfVwiLmApO1xuICBwcm9jZXNzLmV4aXQoMyk7XG4gIHRocm93IDM7ICAvLyBUeXBlU2NyaXB0IGRvZXNuJ3Qga25vdyB0aGF0IHByb2Nlc3MuZXhpdCgpIG5ldmVyIHJldHVybnMuXG59XG5cblxuLyoqIElmIHRoZSB1c2VyIHdhbnRzIHRvIGxpc3Qgc2NoZW1hdGljcywgd2Ugc2ltcGx5IHNob3cgYWxsIHRoZSBzY2hlbWF0aWMgbmFtZXMuICovXG5pZiAoYXJndlsnbGlzdC1zY2hlbWF0aWNzJ10pIHtcbiAgbG9nZ2VyLmluZm8oZW5naW5lSG9zdC5saXN0U2NoZW1hdGljcyhjb2xsZWN0aW9uKS5qb2luKCdcXG4nKSk7XG4gIHByb2Nlc3MuZXhpdCgwKTtcbiAgdGhyb3cgMDsgIC8vIFR5cGVTY3JpcHQgZG9lc24ndCBrbm93IHRoYXQgcHJvY2Vzcy5leGl0KCkgbmV2ZXIgcmV0dXJucy5cbn1cblxuXG4vKiogQ3JlYXRlIHRoZSBzY2hlbWF0aWMgZnJvbSB0aGUgY29sbGVjdGlvbi4gKi9cbmNvbnN0IHNjaGVtYXRpYyA9IGNvbGxlY3Rpb24uY3JlYXRlU2NoZW1hdGljKHNjaGVtYXRpY05hbWUpO1xuXG4vKiogR2F0aGVyIHRoZSBhcmd1bWVudHMgZm9yIGxhdGVyIHVzZS4gKi9cbmNvbnN0IGRlYnVnOiBib29sZWFuID0gYXJndi5kZWJ1ZyA9PT0gbnVsbCA/IGlzTG9jYWxDb2xsZWN0aW9uIDogYXJndi5kZWJ1ZztcbmNvbnN0IGRyeVJ1bjogYm9vbGVhbiA9IGFyZ3ZbJ2RyeS1ydW4nXSA9PT0gbnVsbCA/IGRlYnVnIDogYXJndlsnZHJ5LXJ1biddO1xuY29uc3QgZm9yY2UgPSBhcmd2Wydmb3JjZSddO1xuXG4vKiogVGhpcyBob3N0IGlzIHRoZSBvcmlnaW5hbCBUcmVlIGNyZWF0ZWQgZnJvbSB0aGUgY3VycmVudCBkaXJlY3RvcnkuICovXG5jb25zdCBob3N0ID0gT2JzZXJ2YWJsZS5vZihuZXcgRmlsZVN5c3RlbVRyZWUobmV3IEZpbGVTeXN0ZW1Ib3N0KHByb2Nlc3MuY3dkKCkpKSk7XG5cbi8vIFdlIG5lZWQgdHdvIHNpbmtzIGlmIHdlIHdhbnQgdG8gb3V0cHV0IHdoYXQgd2lsbCBoYXBwZW4sIGFuZCBhY3R1YWxseSBkbyB0aGUgd29yay5cbi8vIE5vdGUgdGhhdCBmc1NpbmsgaXMgdGVjaG5pY2FsbHkgbm90IHVzZWQgaWYgYC0tZHJ5LXJ1bmAgaXMgcGFzc2VkLCBidXQgY3JlYXRpbmcgdGhlIFNpbmtcbi8vIGRvZXMgbm90IGhhdmUgYW55IHNpZGUgZWZmZWN0LlxuY29uc3QgZHJ5UnVuU2luayA9IG5ldyBEcnlSdW5TaW5rKHByb2Nlc3MuY3dkKCksIGZvcmNlKTtcbmNvbnN0IGZzU2luayA9IG5ldyBGaWxlU3lzdGVtU2luayhwcm9jZXNzLmN3ZCgpLCBmb3JjZSk7XG5cblxuLy8gV2Uga2VlcCBhIGJvb2xlYW4gdG8gdGVsbCB1cyB3aGV0aGVyIGFuIGVycm9yIHdvdWxkIG9jY3VyIGlmIHdlIHdlcmUgdG8gY29tbWl0IHRvIGFuXG4vLyBhY3R1YWwgZmlsZXN5c3RlbS4gSW4gdGhpcyBjYXNlIHdlIHNpbXBseSBzaG93IHRoZSBkcnktcnVuLCBidXQgc2tpcCB0aGUgZnNTaW5rIGNvbW1pdC5cbmxldCBlcnJvciA9IGZhbHNlO1xuXG5cbmNvbnN0IGxvZ2dpbmdRdWV1ZTogc3RyaW5nW10gPSBbXTtcblxuLy8gTG9ncyBvdXQgZHJ5IHJ1biBldmVudHMuXG5kcnlSdW5TaW5rLnJlcG9ydGVyLnN1YnNjcmliZSgoZXZlbnQ6IERyeVJ1bkV2ZW50KSA9PiB7XG4gIHN3aXRjaCAoZXZlbnQua2luZCkge1xuICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgIGNvbnN0IGRlc2MgPSBldmVudC5kZXNjcmlwdGlvbiA9PSAnYWxyZWFkeUV4aXN0JyA/ICdhbHJlYWR5IGV4aXN0cycgOiAnZG9lcyBub3QgZXhpc3QuJztcbiAgICAgIGxvZ2dlci53YXJuKGBFUlJPUiEgJHtldmVudC5wYXRofSAke2Rlc2N9LmApO1xuICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAndXBkYXRlJzpcbiAgICAgIGxvZ2dpbmdRdWV1ZS5wdXNoKHRhZ3Mub25lTGluZWBcbiAgICAgICAgJHt0ZXJtaW5hbC53aGl0ZSgnVVBEQVRFJyl9ICR7ZXZlbnQucGF0aH0gKCR7ZXZlbnQuY29udGVudC5sZW5ndGh9IGJ5dGVzKVxuICAgICAgYCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdjcmVhdGUnOlxuICAgICAgbG9nZ2luZ1F1ZXVlLnB1c2godGFncy5vbmVMaW5lYFxuICAgICAgICAke3Rlcm1pbmFsLmdyZWVuKCdDUkVBVEUnKX0gJHtldmVudC5wYXRofSAoJHtldmVudC5jb250ZW50Lmxlbmd0aH0gYnl0ZXMpXG4gICAgICBgKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2RlbGV0ZSc6XG4gICAgICBsb2dnaW5nUXVldWUucHVzaChgJHt0ZXJtaW5hbC55ZWxsb3coJ0RFTEVURScpfSAke2V2ZW50LnBhdGh9YCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdyZW5hbWUnOlxuICAgICAgbG9nZ2luZ1F1ZXVlLnB1c2goYCR7dGVybWluYWwuYmx1ZSgnUkVOQU1FJyl9ICR7ZXZlbnQucGF0aH0gPT4gJHtldmVudC50b31gKTtcbiAgICAgIGJyZWFrO1xuICB9XG59KTtcblxuXG4vKipcbiAqIFJlbW92ZSBldmVyeSBvcHRpb25zIGZyb20gYXJndiB0aGF0IHdlIHN1cHBvcnQgaW4gc2NoZW1hdGljcyBpdHNlbGYuXG4gKi9cbmNvbnN0IGFyZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBhcmd2KTtcbmRlbGV0ZSBhcmdzWyctLSddO1xuZm9yIChjb25zdCBrZXkgb2YgYm9vbGVhbkFyZ3MpIHtcbiAgZGVsZXRlIGFyZ3Nba2V5XTtcbn1cblxuLyoqXG4gKiBBZGQgb3B0aW9ucyBmcm9tIGAtLWAgdG8gYXJncy5cbiAqL1xuY29uc3QgYXJndjIgPSBtaW5pbWlzdChhcmd2WyctLSddKTtcbmZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGFyZ3YyKSkge1xuICBhcmdzW2tleV0gPSBhcmd2MltrZXldO1xufVxuZGVsZXRlIGFyZ3MuXztcblxuXG4vKipcbiAqIFRoZSBtYWluIHBhdGguIENhbGwgdGhlIHNjaGVtYXRpYyB3aXRoIHRoZSBob3N0LiBUaGlzIGNyZWF0ZXMgYSBuZXcgQ29udGV4dCBmb3IgdGhlIHNjaGVtYXRpY1xuICogdG8gcnVuIGluLCB0aGVuIGNhbGwgdGhlIHNjaGVtYXRpYyBydWxlIHVzaW5nIHRoZSBpbnB1dCBUcmVlLiBUaGlzIHJldHVybnMgYSBuZXcgVHJlZSBhcyBpZlxuICogdGhlIHNjaGVtYXRpYyB3YXMgYXBwbGllZCB0byBpdC5cbiAqXG4gKiBXZSB0aGVuIG9wdGltaXplIHRoaXMgdHJlZS4gVGhpcyByZW1vdmVzIGFueSBkdXBsaWNhdGVkIGFjdGlvbnMgb3IgYWN0aW9ucyB0aGF0IHdvdWxkIHJlc3VsdFxuICogaW4gYSBub29wIChmb3IgZXhhbXBsZSwgY3JlYXRpbmcgdGhlbiBkZWxldGluZyBhIGZpbGUpLiBUaGlzIGlzIG5vdCBuZWNlc3NhcnkgYnV0IHdpbGwgZ3JlYXRseVxuICogaW1wcm92ZSBwZXJmb3JtYW5jZSBhcyBoaXR0aW5nIHRoZSBmaWxlIHN5c3RlbSBpcyBjb3N0bHkuXG4gKlxuICogVGhlbiB3ZSBwcm9jZWVkIHRvIHJ1biB0aGUgZHJ5UnVuIGNvbW1pdC4gV2UgcnVuIHRoaXMgYmVmb3JlIHdlIHRoZW4gY29tbWl0IHRvIHRoZSBmaWxlc3lzdGVtXG4gKiAoaWYgLS1kcnktcnVuIHdhcyBub3QgcGFzc2VkIG9yIGFuIGVycm9yIHdhcyBkZXRlY3RlZCBieSBkcnlSdW4pLlxuICovXG5zY2hlbWF0aWMuY2FsbChhcmdzLCBob3N0LCB7IGRlYnVnLCBsb2dnZXI6IGxvZ2dlci5hc0FwaSgpIH0pXG4gIC5tYXAoKHRyZWU6IFRyZWUpID0+IFRyZWUub3B0aW1pemUodHJlZSkpXG4gIC5jb25jYXRNYXAoKHRyZWU6IFRyZWUpID0+IHtcbiAgICByZXR1cm4gZHJ5UnVuU2luay5jb21taXQodHJlZSkuaWdub3JlRWxlbWVudHMoKS5jb25jYXQoT2JzZXJ2YWJsZS5vZih0cmVlKSk7XG4gIH0pXG4gIC5jb25jYXRNYXAoKHRyZWU6IFRyZWUpID0+IHtcbiAgICBpZiAoIWVycm9yKSB7XG4gICAgICAvLyBPdXRwdXQgdGhlIGxvZ2dpbmcgcXVldWUuXG4gICAgICBsb2dnaW5nUXVldWUuZm9yRWFjaChsb2cgPT4gbG9nZ2VyLmluZm8obG9nKSk7XG4gICAgfVxuXG4gICAgaWYgKGRyeVJ1biB8fCBlcnJvcikge1xuICAgICAgcmV0dXJuIE9ic2VydmFibGUub2YodHJlZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZzU2luay5jb21taXQodHJlZSkuaWdub3JlRWxlbWVudHMoKS5jb25jYXQoT2JzZXJ2YWJsZS5vZih0cmVlKSk7XG4gIH0pXG4gIC5zdWJzY3JpYmUoe1xuICAgIGVycm9yKGVycjogRXJyb3IpIHtcbiAgICAgIC8vIEFkZCBleHRyYSBwcm9jZXNzaW5nIHRvIG91dHB1dCBiZXR0ZXIgZXJyb3IgbWVzc2FnZXMuXG4gICAgICBpZiAoZXJyIGluc3RhbmNlb2Ygc2NoZW1hLmphdmFzY3JpcHQuUmVxdWlyZWRWYWx1ZU1pc3NpbmdFeGNlcHRpb24pIHtcbiAgICAgICAgbG9nZ2VyLmZhdGFsKCdNaXNzaW5nIGFyZ3VtZW50IG9uIHRoZSBjb21tYW5kIGxpbmU6ICcgKyBlcnIucGF0aC5zcGxpdCgnLycpLnBvcCgpKTtcbiAgICAgIH0gZWxzZSBpZiAoZXJyIGluc3RhbmNlb2Ygc2NoZW1hLmphdmFzY3JpcHQuSW52YWxpZFByb3BlcnR5TmFtZUV4Y2VwdGlvbikge1xuICAgICAgICBsb2dnZXIuZmF0YWwoJ0Egbm9uLXN1cHBvcnRlZCBhcmd1bWVudCB3YXMgcGFzc2VkOiAnICsgZXJyLnBhdGguc3BsaXQoJy8nKS5wb3AoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2dnZXIuZmF0YWwoZXJyLm1lc3NhZ2UpO1xuICAgICAgfVxuICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgIH0sXG4gIH0pO1xuIl19