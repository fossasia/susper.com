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
 * In the case where a collection name isn't part of the argument, the default is to use this
 * package (@schematics/angular) as the collection.
 *
 * This logic is entirely up to the tooling.
 *
 * @param str The argument to parse.
 * @return {{collection: string, schematic: (string)}}
 */
function parseSchematicName(str) {
    let collection = '@schematics/angular';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hdGljcy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL2Jpbi9zY2hlbWF0aWNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQVFBLCtDQUE4RDtBQUM5RCxvREFBZ0U7QUFDaEUsMkRBT29DO0FBQ3BDLDREQUkwQztBQUMxQyxxQ0FBcUM7QUFDckMsZ0RBQTZDO0FBQzdDLDRDQUEwQztBQUcxQzs7R0FFRztBQUNILGVBQWUsUUFBUSxHQUFHLENBQUM7SUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFJLENBQUMsV0FBVyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQjNCLENBQUMsQ0FBQztJQUVILE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkIsTUFBTSxDQUFDLENBQUMsQ0FBRSx3RUFBd0U7QUFDcEYsQ0FBQztBQUdEOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCw0QkFBNEIsR0FBa0I7SUFDNUMsSUFBSSxVQUFVLEdBQUcscUJBQXFCLENBQUM7SUFFdkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDekIsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELElBQUksU0FBUyxHQUFXLEdBQWEsQ0FBQztJQUN0QyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVsRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDZixLQUFLLENB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Q0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQixDQUFDO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgc2NoZW1hLCB0YWdzLCB0ZXJtaW5hbCB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IGNyZWF0ZUNvbnNvbGVMb2dnZXIgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZS9ub2RlJztcbmltcG9ydCB7XG4gIERyeVJ1bkV2ZW50LFxuICBEcnlSdW5TaW5rLFxuICBGaWxlU3lzdGVtU2luayxcbiAgRmlsZVN5c3RlbVRyZWUsXG4gIFNjaGVtYXRpY0VuZ2luZSxcbiAgVHJlZSxcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgRmlsZVN5c3RlbUhvc3QsXG4gIEZpbGVTeXN0ZW1TY2hlbWF0aWNEZXNjLFxuICBOb2RlTW9kdWxlc0VuZ2luZUhvc3QsXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzL3Rvb2xzJztcbmltcG9ydCAqIGFzIG1pbmltaXN0IGZyb20gJ21pbmltaXN0JztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9pZ25vcmVFbGVtZW50cyc7XG5cblxuLyoqXG4gKiBTaG93IHVzYWdlIG9mIHRoZSBDTEkgdG9vbCwgYW5kIGV4aXQgdGhlIHByb2Nlc3MuXG4gKi9cbmZ1bmN0aW9uIHVzYWdlKGV4aXRDb2RlID0gMCk6IG5ldmVyIHtcbiAgbG9nZ2VyLmluZm8odGFncy5zdHJpcEluZGVudGBcbiAgICBzY2hlbWF0aWNzIFtDb2xsZWN0aW9uTmFtZTpdU2NoZW1hdGljTmFtZSBbb3B0aW9ucywgLi4uXVxuXG4gICAgQnkgZGVmYXVsdCwgaWYgdGhlIGNvbGxlY3Rpb24gbmFtZSBpcyBub3Qgc3BlY2lmaWVkLCB1c2UgdGhlIGludGVybmFsIGNvbGxlY3Rpb24gcHJvdmlkZWRcbiAgICBieSB0aGUgU2NoZW1hdGljcyBDTEkuXG5cbiAgICBPcHRpb25zOlxuICAgICAgICAtLWRlYnVnICAgICAgICAgICAgIERlYnVnIG1vZGUuIFRoaXMgaXMgdHJ1ZSBieSBkZWZhdWx0IGlmIHRoZSBjb2xsZWN0aW9uIGlzIGEgcmVsYXRpdmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoIChpbiB0aGF0IGNhc2UsIHR1cm4gb2ZmIHdpdGggLS1kZWJ1Zz1mYWxzZSkuXG4gICAgICAgIC0tZHJ5LXJ1biAgICAgICAgICAgRG8gbm90IG91dHB1dCBhbnl0aGluZywgYnV0IGluc3RlYWQganVzdCBzaG93IHdoYXQgYWN0aW9ucyB3b3VsZCBiZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcmZvcm1lZC4gRGVmYXVsdCB0byB0cnVlIGlmIGRlYnVnIGlzIGFsc28gdHJ1ZS5cbiAgICAgICAgLS1mb3JjZSAgICAgICAgICAgICBGb3JjZSBvdmVyd3JpdGluZyBmaWxlcyB0aGF0IHdvdWxkIG90aGVyd2lzZSBiZSBhbiBlcnJvci5cbiAgICAgICAgLS1saXN0LXNjaGVtYXRpY3MgICBMaXN0IGFsbCBzY2hlbWF0aWNzIGZyb20gdGhlIGNvbGxlY3Rpb24sIGJ5IG5hbWUuXG4gICAgICAgIC0tdmVyYm9zZSAgICAgICAgICAgU2hvdyBtb3JlIGluZm9ybWF0aW9uLlxuXG4gICAgICAgIC0taGVscCAgICAgICAgICAgICAgU2hvdyB0aGlzIG1lc3NhZ2UuXG5cbiAgICBBbnkgYWRkaXRpb25hbCBvcHRpb24gaXMgcGFzc2VkIHRvIHRoZSBTY2hlbWF0aWNzIGRlcGVuZGluZyBvblxuICBgKTtcblxuICBwcm9jZXNzLmV4aXQoZXhpdENvZGUpO1xuICB0aHJvdyAwOyAgLy8gVGhlIG5vZGUgdHlwaW5nIHNvbWV0aW1lcyBkb24ndCBoYXZlIGEgbmV2ZXIgdHlwZSBmb3IgcHJvY2Vzcy5leGl0KCkuXG59XG5cblxuLyoqXG4gKiBQYXJzZSB0aGUgbmFtZSBvZiBzY2hlbWF0aWMgcGFzc2VkIGluIGFyZ3VtZW50LCBhbmQgcmV0dXJuIGEge2NvbGxlY3Rpb24sIHNjaGVtYXRpY30gbmFtZWRcbiAqIHR1cGxlLiBUaGUgdXNlciBjYW4gcGFzcyBpbiBgY29sbGVjdGlvbi1uYW1lOnNjaGVtYXRpYy1uYW1lYCwgYW5kIHRoaXMgZnVuY3Rpb24gd2lsbCBlaXRoZXJcbiAqIHJldHVybiBge2NvbGxlY3Rpb246ICdjb2xsZWN0aW9uLW5hbWUnLCBzY2hlbWF0aWM6ICdzY2hlbWF0aWMtbmFtZSd9YCwgb3IgaXQgd2lsbCBlcnJvciBvdXRcbiAqIGFuZCBzaG93IHVzYWdlLlxuICpcbiAqIEluIHRoZSBjYXNlIHdoZXJlIGEgY29sbGVjdGlvbiBuYW1lIGlzbid0IHBhcnQgb2YgdGhlIGFyZ3VtZW50LCB0aGUgZGVmYXVsdCBpcyB0byB1c2UgdGhpc1xuICogcGFja2FnZSAoQHNjaGVtYXRpY3MvYW5ndWxhcikgYXMgdGhlIGNvbGxlY3Rpb24uXG4gKlxuICogVGhpcyBsb2dpYyBpcyBlbnRpcmVseSB1cCB0byB0aGUgdG9vbGluZy5cbiAqXG4gKiBAcGFyYW0gc3RyIFRoZSBhcmd1bWVudCB0byBwYXJzZS5cbiAqIEByZXR1cm4ge3tjb2xsZWN0aW9uOiBzdHJpbmcsIHNjaGVtYXRpYzogKHN0cmluZyl9fVxuICovXG5mdW5jdGlvbiBwYXJzZVNjaGVtYXRpY05hbWUoc3RyOiBzdHJpbmcgfCBudWxsKTogeyBjb2xsZWN0aW9uOiBzdHJpbmcsIHNjaGVtYXRpYzogc3RyaW5nIH0ge1xuICBsZXQgY29sbGVjdGlvbiA9ICdAc2NoZW1hdGljcy9hbmd1bGFyJztcblxuICBpZiAoIXN0ciB8fCBzdHIgPT09IG51bGwpIHtcbiAgICB1c2FnZSgxKTtcbiAgfVxuXG4gIGxldCBzY2hlbWF0aWM6IHN0cmluZyA9IHN0ciBhcyBzdHJpbmc7XG4gIGlmIChzY2hlbWF0aWMuaW5kZXhPZignOicpICE9IC0xKSB7XG4gICAgW2NvbGxlY3Rpb24sIHNjaGVtYXRpY10gPSBzY2hlbWF0aWMuc3BsaXQoJzonLCAyKTtcblxuICAgIGlmICghc2NoZW1hdGljKSB7XG4gICAgICB1c2FnZSgyKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4geyBjb2xsZWN0aW9uLCBzY2hlbWF0aWMgfTtcbn1cblxuXG4vKiogUGFyc2UgdGhlIGNvbW1hbmQgbGluZS4gKi9cbmNvbnN0IGJvb2xlYW5BcmdzID0gWyAnZGVidWcnLCAnZHJ5LXJ1bicsICdmb3JjZScsICdoZWxwJywgJ2xpc3Qtc2NoZW1hdGljcycsICd2ZXJib3NlJyBdO1xuY29uc3QgYXJndiA9IG1pbmltaXN0KHByb2Nlc3MuYXJndi5zbGljZSgyKSwge1xuICBib29sZWFuOiBib29sZWFuQXJncyxcbiAgZGVmYXVsdDoge1xuICAgICdkZWJ1Zyc6IG51bGwsXG4gICAgJ2RyeS1ydW4nOiBudWxsLFxuICB9LFxuICAnLS0nOiB0cnVlLFxufSk7XG5cbi8qKiBDcmVhdGUgdGhlIERldktpdCBMb2dnZXIgdXNlZCB0aHJvdWdoIHRoZSBDTEkuICovXG5jb25zdCBsb2dnZXIgPSBjcmVhdGVDb25zb2xlTG9nZ2VyKGFyZ3ZbJ3ZlcmJvc2UnXSk7XG5cbmlmIChhcmd2LmhlbHApIHtcbiAgdXNhZ2UoKTtcbn1cblxuLyoqIEdldCB0aGUgY29sbGVjdGlvbiBhbiBzY2hlbWF0aWMgbmFtZSBmcm9tIHRoZSBmaXJzdCBhcmd1bWVudC4gKi9cbmNvbnN0IHtcbiAgY29sbGVjdGlvbjogY29sbGVjdGlvbk5hbWUsXG4gIHNjaGVtYXRpYzogc2NoZW1hdGljTmFtZSxcbn0gPSBwYXJzZVNjaGVtYXRpY05hbWUoYXJndi5fLnNoaWZ0KCkgfHwgbnVsbCk7XG5jb25zdCBpc0xvY2FsQ29sbGVjdGlvbiA9IGNvbGxlY3Rpb25OYW1lLnN0YXJ0c1dpdGgoJy4nKSB8fCBjb2xsZWN0aW9uTmFtZS5zdGFydHNXaXRoKCcvJyk7XG5cblxuLyoqXG4gKiBDcmVhdGUgdGhlIFNjaGVtYXRpY0VuZ2luZSwgd2hpY2ggaXMgdXNlZCBieSB0aGUgU2NoZW1hdGljIGxpYnJhcnkgYXMgY2FsbGJhY2tzIHRvIGxvYWQgYVxuICogQ29sbGVjdGlvbiBvciBhIFNjaGVtYXRpYy5cbiAqL1xuY29uc3QgZW5naW5lSG9zdCA9IG5ldyBOb2RlTW9kdWxlc0VuZ2luZUhvc3QoKTtcbmNvbnN0IGVuZ2luZSA9IG5ldyBTY2hlbWF0aWNFbmdpbmUoZW5naW5lSG9zdCk7XG5cbmNvbnN0IHNjaGVtYVJlZ2lzdHJ5ID0gbmV3IHNjaGVtYS5Kc29uU2NoZW1hUmVnaXN0cnkoKTtcblxuLy8gQWRkIHN1cHBvcnQgZm9yIHNjaGVtYUpzb24uXG5lbmdpbmVIb3N0LnJlZ2lzdGVyT3B0aW9uc1RyYW5zZm9ybSgoc2NoZW1hdGljOiBGaWxlU3lzdGVtU2NoZW1hdGljRGVzYywgb3B0aW9uczoge30pID0+IHtcbiAgaWYgKHNjaGVtYXRpYy5zY2hlbWEgJiYgc2NoZW1hdGljLnNjaGVtYUpzb24pIHtcbiAgICBjb25zdCBzY2hlbWFKc29uID0gc2NoZW1hdGljLnNjaGVtYUpzb24gYXMgc2NoZW1hLkpzb25TY2hlbWFPYmplY3Q7XG4gICAgY29uc3QgcmVmID0gc2NoZW1hSnNvbi4kaWQgfHwgKCcvJyArIHNjaGVtYXRpYy5jb2xsZWN0aW9uLm5hbWUgKyAnLycgKyBzY2hlbWF0aWMubmFtZSk7XG4gICAgc2NoZW1hUmVnaXN0cnkuYWRkU2NoZW1hKHJlZiwgc2NoZW1hSnNvbik7XG4gICAgY29uc3Qgc2VyaWFsaXplciA9IG5ldyBzY2hlbWEuc2VyaWFsaXplcnMuSmF2YXNjcmlwdFNlcmlhbGl6ZXIoKTtcbiAgICBjb25zdCBmbiA9IHNlcmlhbGl6ZXIuc2VyaWFsaXplKHJlZiwgc2NoZW1hUmVnaXN0cnkpO1xuXG4gICAgcmV0dXJuIGZuKG9wdGlvbnMpO1xuICB9XG5cbiAgcmV0dXJuIG9wdGlvbnM7XG59KTtcblxuXG4vKipcbiAqIFRoZSBjb2xsZWN0aW9uIHRvIGJlIHVzZWQuXG4gKiBAdHlwZSB7Q29sbGVjdGlvbnxhbnl9XG4gKi9cbmNvbnN0IGNvbGxlY3Rpb24gPSBlbmdpbmUuY3JlYXRlQ29sbGVjdGlvbihjb2xsZWN0aW9uTmFtZSk7XG5pZiAoY29sbGVjdGlvbiA9PT0gbnVsbCkge1xuICBsb2dnZXIuZmF0YWwoYEludmFsaWQgY29sbGVjdGlvbiBuYW1lOiBcIiR7Y29sbGVjdGlvbk5hbWV9XCIuYCk7XG4gIHByb2Nlc3MuZXhpdCgzKTtcbiAgdGhyb3cgMzsgIC8vIFR5cGVTY3JpcHQgZG9lc24ndCBrbm93IHRoYXQgcHJvY2Vzcy5leGl0KCkgbmV2ZXIgcmV0dXJucy5cbn1cblxuXG4vKiogSWYgdGhlIHVzZXIgd2FudHMgdG8gbGlzdCBzY2hlbWF0aWNzLCB3ZSBzaW1wbHkgc2hvdyBhbGwgdGhlIHNjaGVtYXRpYyBuYW1lcy4gKi9cbmlmIChhcmd2WydsaXN0LXNjaGVtYXRpY3MnXSkge1xuICBsb2dnZXIuaW5mbyhlbmdpbmVIb3N0Lmxpc3RTY2hlbWF0aWNzKGNvbGxlY3Rpb24pLmpvaW4oJ1xcbicpKTtcbiAgcHJvY2Vzcy5leGl0KDApO1xuICB0aHJvdyAwOyAgLy8gVHlwZVNjcmlwdCBkb2Vzbid0IGtub3cgdGhhdCBwcm9jZXNzLmV4aXQoKSBuZXZlciByZXR1cm5zLlxufVxuXG5cbi8qKiBDcmVhdGUgdGhlIHNjaGVtYXRpYyBmcm9tIHRoZSBjb2xsZWN0aW9uLiAqL1xuY29uc3Qgc2NoZW1hdGljID0gY29sbGVjdGlvbi5jcmVhdGVTY2hlbWF0aWMoc2NoZW1hdGljTmFtZSk7XG5cbi8qKiBHYXRoZXIgdGhlIGFyZ3VtZW50cyBmb3IgbGF0ZXIgdXNlLiAqL1xuY29uc3QgZGVidWc6IGJvb2xlYW4gPSBhcmd2LmRlYnVnID09PSBudWxsID8gaXNMb2NhbENvbGxlY3Rpb24gOiBhcmd2LmRlYnVnO1xuY29uc3QgZHJ5UnVuOiBib29sZWFuID0gYXJndlsnZHJ5LXJ1biddID09PSBudWxsID8gZGVidWcgOiBhcmd2WydkcnktcnVuJ107XG5jb25zdCBmb3JjZSA9IGFyZ3ZbJ2ZvcmNlJ107XG5cbi8qKiBUaGlzIGhvc3QgaXMgdGhlIG9yaWdpbmFsIFRyZWUgY3JlYXRlZCBmcm9tIHRoZSBjdXJyZW50IGRpcmVjdG9yeS4gKi9cbmNvbnN0IGhvc3QgPSBPYnNlcnZhYmxlLm9mKG5ldyBGaWxlU3lzdGVtVHJlZShuZXcgRmlsZVN5c3RlbUhvc3QocHJvY2Vzcy5jd2QoKSkpKTtcblxuLy8gV2UgbmVlZCB0d28gc2lua3MgaWYgd2Ugd2FudCB0byBvdXRwdXQgd2hhdCB3aWxsIGhhcHBlbiwgYW5kIGFjdHVhbGx5IGRvIHRoZSB3b3JrLlxuLy8gTm90ZSB0aGF0IGZzU2luayBpcyB0ZWNobmljYWxseSBub3QgdXNlZCBpZiBgLS1kcnktcnVuYCBpcyBwYXNzZWQsIGJ1dCBjcmVhdGluZyB0aGUgU2lua1xuLy8gZG9lcyBub3QgaGF2ZSBhbnkgc2lkZSBlZmZlY3QuXG5jb25zdCBkcnlSdW5TaW5rID0gbmV3IERyeVJ1blNpbmsocHJvY2Vzcy5jd2QoKSwgZm9yY2UpO1xuY29uc3QgZnNTaW5rID0gbmV3IEZpbGVTeXN0ZW1TaW5rKHByb2Nlc3MuY3dkKCksIGZvcmNlKTtcblxuXG4vLyBXZSBrZWVwIGEgYm9vbGVhbiB0byB0ZWxsIHVzIHdoZXRoZXIgYW4gZXJyb3Igd291bGQgb2NjdXIgaWYgd2Ugd2VyZSB0byBjb21taXQgdG8gYW5cbi8vIGFjdHVhbCBmaWxlc3lzdGVtLiBJbiB0aGlzIGNhc2Ugd2Ugc2ltcGx5IHNob3cgdGhlIGRyeS1ydW4sIGJ1dCBza2lwIHRoZSBmc1NpbmsgY29tbWl0LlxubGV0IGVycm9yID0gZmFsc2U7XG5cblxuY29uc3QgbG9nZ2luZ1F1ZXVlOiBzdHJpbmdbXSA9IFtdO1xuXG4vLyBMb2dzIG91dCBkcnkgcnVuIGV2ZW50cy5cbmRyeVJ1blNpbmsucmVwb3J0ZXIuc3Vic2NyaWJlKChldmVudDogRHJ5UnVuRXZlbnQpID0+IHtcbiAgc3dpdGNoIChldmVudC5raW5kKSB7XG4gICAgY2FzZSAnZXJyb3InOlxuICAgICAgY29uc3QgZGVzYyA9IGV2ZW50LmRlc2NyaXB0aW9uID09ICdhbHJlYWR5RXhpc3QnID8gJ2FscmVhZHkgZXhpc3RzJyA6ICdkb2VzIG5vdCBleGlzdC4nO1xuICAgICAgbG9nZ2VyLndhcm4oYEVSUk9SISAke2V2ZW50LnBhdGh9ICR7ZGVzY30uYCk7XG4gICAgICBlcnJvciA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICBjYXNlICd1cGRhdGUnOlxuICAgICAgbG9nZ2luZ1F1ZXVlLnB1c2godGFncy5vbmVMaW5lYFxuICAgICAgICAke3Rlcm1pbmFsLndoaXRlKCdVUERBVEUnKX0gJHtldmVudC5wYXRofSAoJHtldmVudC5jb250ZW50Lmxlbmd0aH0gYnl0ZXMpXG4gICAgICBgKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2NyZWF0ZSc6XG4gICAgICBsb2dnaW5nUXVldWUucHVzaCh0YWdzLm9uZUxpbmVgXG4gICAgICAgICR7dGVybWluYWwuZ3JlZW4oJ0NSRUFURScpfSAke2V2ZW50LnBhdGh9ICgke2V2ZW50LmNvbnRlbnQubGVuZ3RofSBieXRlcylcbiAgICAgIGApO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnZGVsZXRlJzpcbiAgICAgIGxvZ2dpbmdRdWV1ZS5wdXNoKGAke3Rlcm1pbmFsLnllbGxvdygnREVMRVRFJyl9ICR7ZXZlbnQucGF0aH1gKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3JlbmFtZSc6XG4gICAgICBsb2dnaW5nUXVldWUucHVzaChgJHt0ZXJtaW5hbC5ibHVlKCdSRU5BTUUnKX0gJHtldmVudC5wYXRofSA9PiAke2V2ZW50LnRvfWApO1xuICAgICAgYnJlYWs7XG4gIH1cbn0pO1xuXG5cbi8qKlxuICogUmVtb3ZlIGV2ZXJ5IG9wdGlvbnMgZnJvbSBhcmd2IHRoYXQgd2Ugc3VwcG9ydCBpbiBzY2hlbWF0aWNzIGl0c2VsZi5cbiAqL1xuY29uc3QgYXJncyA9IE9iamVjdC5hc3NpZ24oe30sIGFyZ3YpO1xuZGVsZXRlIGFyZ3NbJy0tJ107XG5mb3IgKGNvbnN0IGtleSBvZiBib29sZWFuQXJncykge1xuICBkZWxldGUgYXJnc1trZXldO1xufVxuXG4vKipcbiAqIEFkZCBvcHRpb25zIGZyb20gYC0tYCB0byBhcmdzLlxuICovXG5jb25zdCBhcmd2MiA9IG1pbmltaXN0KGFyZ3ZbJy0tJ10pO1xuZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoYXJndjIpKSB7XG4gIGFyZ3Nba2V5XSA9IGFyZ3YyW2tleV07XG59XG5kZWxldGUgYXJncy5fO1xuXG5cbi8qKlxuICogVGhlIG1haW4gcGF0aC4gQ2FsbCB0aGUgc2NoZW1hdGljIHdpdGggdGhlIGhvc3QuIFRoaXMgY3JlYXRlcyBhIG5ldyBDb250ZXh0IGZvciB0aGUgc2NoZW1hdGljXG4gKiB0byBydW4gaW4sIHRoZW4gY2FsbCB0aGUgc2NoZW1hdGljIHJ1bGUgdXNpbmcgdGhlIGlucHV0IFRyZWUuIFRoaXMgcmV0dXJucyBhIG5ldyBUcmVlIGFzIGlmXG4gKiB0aGUgc2NoZW1hdGljIHdhcyBhcHBsaWVkIHRvIGl0LlxuICpcbiAqIFdlIHRoZW4gb3B0aW1pemUgdGhpcyB0cmVlLiBUaGlzIHJlbW92ZXMgYW55IGR1cGxpY2F0ZWQgYWN0aW9ucyBvciBhY3Rpb25zIHRoYXQgd291bGQgcmVzdWx0XG4gKiBpbiBhIG5vb3AgKGZvciBleGFtcGxlLCBjcmVhdGluZyB0aGVuIGRlbGV0aW5nIGEgZmlsZSkuIFRoaXMgaXMgbm90IG5lY2Vzc2FyeSBidXQgd2lsbCBncmVhdGx5XG4gKiBpbXByb3ZlIHBlcmZvcm1hbmNlIGFzIGhpdHRpbmcgdGhlIGZpbGUgc3lzdGVtIGlzIGNvc3RseS5cbiAqXG4gKiBUaGVuIHdlIHByb2NlZWQgdG8gcnVuIHRoZSBkcnlSdW4gY29tbWl0LiBXZSBydW4gdGhpcyBiZWZvcmUgd2UgdGhlbiBjb21taXQgdG8gdGhlIGZpbGVzeXN0ZW1cbiAqIChpZiAtLWRyeS1ydW4gd2FzIG5vdCBwYXNzZWQgb3IgYW4gZXJyb3Igd2FzIGRldGVjdGVkIGJ5IGRyeVJ1bikuXG4gKi9cbnNjaGVtYXRpYy5jYWxsKGFyZ3MsIGhvc3QsIHsgZGVidWcsIGxvZ2dlcjogbG9nZ2VyLmFzQXBpKCkgfSlcbiAgLm1hcCgodHJlZTogVHJlZSkgPT4gVHJlZS5vcHRpbWl6ZSh0cmVlKSlcbiAgLmNvbmNhdE1hcCgodHJlZTogVHJlZSkgPT4ge1xuICAgIHJldHVybiBkcnlSdW5TaW5rLmNvbW1pdCh0cmVlKS5pZ25vcmVFbGVtZW50cygpLmNvbmNhdChPYnNlcnZhYmxlLm9mKHRyZWUpKTtcbiAgfSlcbiAgLmNvbmNhdE1hcCgodHJlZTogVHJlZSkgPT4ge1xuICAgIGlmICghZXJyb3IpIHtcbiAgICAgIC8vIE91dHB1dCB0aGUgbG9nZ2luZyBxdWV1ZS5cbiAgICAgIGxvZ2dpbmdRdWV1ZS5mb3JFYWNoKGxvZyA9PiBsb2dnZXIuaW5mbyhsb2cpKTtcbiAgICB9XG5cbiAgICBpZiAoZHJ5UnVuIHx8IGVycm9yKSB7XG4gICAgICByZXR1cm4gT2JzZXJ2YWJsZS5vZih0cmVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnNTaW5rLmNvbW1pdCh0cmVlKS5pZ25vcmVFbGVtZW50cygpLmNvbmNhdChPYnNlcnZhYmxlLm9mKHRyZWUpKTtcbiAgfSlcbiAgLnN1YnNjcmliZSh7XG4gICAgZXJyb3IoZXJyOiBFcnJvcikge1xuICAgICAgLy8gQWRkIGV4dHJhIHByb2Nlc3NpbmcgdG8gb3V0cHV0IGJldHRlciBlcnJvciBtZXNzYWdlcy5cbiAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBzY2hlbWEuamF2YXNjcmlwdC5SZXF1aXJlZFZhbHVlTWlzc2luZ0V4Y2VwdGlvbikge1xuICAgICAgICBsb2dnZXIuZmF0YWwoJ01pc3NpbmcgYXJndW1lbnQgb24gdGhlIGNvbW1hbmQgbGluZTogJyArIGVyci5wYXRoLnNwbGl0KCcvJykucG9wKCkpO1xuICAgICAgfSBlbHNlIGlmIChlcnIgaW5zdGFuY2VvZiBzY2hlbWEuamF2YXNjcmlwdC5JbnZhbGlkUHJvcGVydHlOYW1lRXhjZXB0aW9uKSB7XG4gICAgICAgIGxvZ2dlci5mYXRhbCgnQSBub24tc3VwcG9ydGVkIGFyZ3VtZW50IHdhcyBwYXNzZWQ6ICcgKyBlcnIucGF0aC5zcGxpdCgnLycpLnBvcCgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvZ2dlci5mYXRhbChlcnIubWVzc2FnZSk7XG4gICAgICB9XG4gICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgfSxcbiAgfSk7XG4iXX0=