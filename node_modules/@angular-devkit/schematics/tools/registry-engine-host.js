"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const schematics_1 = require("@angular-devkit/schematics");
const tools_1 = require("@angular-devkit/schematics/tools");
const fs_1 = require("fs");
const path_1 = require("path");
const export_ref_1 = require("./export-ref");
const file_system_engine_host_base_1 = require("./file-system-engine-host-base");
const file_system_utility_1 = require("./file-system-utility");
/**
 * A simple EngineHost that uses a registry of {name => path} to find collections. This can be
 * useful for tooling that want to load generic collections from random places.
 */
class RegistryEngineHost extends file_system_engine_host_base_1.FileSystemEngineHostBase {
    constructor() {
        super(...arguments);
        this._registry = new Map();
    }
    registerPath(path) {
        // Read the collection from the path.
        if (fs_1.existsSync(path) && fs_1.statSync(path).isFile()) {
            // Allow path to be fully qualified to a JSON file.
        }
        else if (fs_1.existsSync(path_1.join(path, 'collection.json')) && fs_1.statSync(path).isFile()) {
            // Allow path to point to a directory containing a `collection.json`.
            path = path_1.join(path, 'collection.json');
        }
        else {
            throw new Error(`Invalid path: "${path}".`);
        }
        const json = file_system_utility_1.readJsonFile(path);
        if (!json) {
            throw new Error(`Invalid path for collection: "${path}".`);
        }
        // Validate that the name is not in the registry already (and that the registry does not
        // contain this path under another name.
        const name = json.name;
        const maybePath = this._registry.get(name);
        if (maybePath && maybePath != path) {
            throw new Error(`Collection name "${name}" already registered.`);
        }
        for (const registryPath of this._registry.values()) {
            if (registryPath == path) {
                throw new Error(`Collection path "${path}" already registered under another name.`);
            }
        }
        this._registry.set(name, path);
    }
    removePath(path) {
        for (const [key, p] of this._registry.entries()) {
            if (p == path) {
                this._registry.delete(key);
            }
        }
    }
    removeName(name) {
        this._registry.delete(name);
    }
    _resolveCollectionPath(name) {
        const maybePath = this._registry.get(name);
        if (!maybePath) {
            throw new schematics_1.UnknownCollectionException(name);
        }
        return maybePath;
    }
    _resolveReferenceString(refString, parentPath) {
        // Use the same kind of export strings as NodeModule.
        const ref = new export_ref_1.ExportStringRef(refString, parentPath);
        if (!ref.ref) {
            return null;
        }
        return { ref: ref.ref, path: ref.module };
    }
    _transformCollectionDescription(name, desc) {
        if (!desc.schematics || typeof desc.schematics != 'object') {
            throw new tools_1.CollectionMissingSchematicsMapException(name);
        }
        return desc;
    }
    _transformSchematicDescription(name, _collection, desc) {
        if (!desc.factoryFn || !desc.path || !desc.description) {
            throw new tools_1.SchematicMissingFieldsException(name);
        }
        return desc;
    }
}
exports.RegistryEngineHost = RegistryEngineHost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cnktZW5naW5lLWhvc3QuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvc2NoZW1hdGljcy90b29scy9yZWdpc3RyeS1lbmdpbmUtaG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILDJEQUtvQztBQUNwQyw0REFHMEM7QUFDMUMsMkJBQTBDO0FBQzFDLCtCQUE0QjtBQUU1Qiw2Q0FBK0M7QUFDL0MsaUZBQTBFO0FBQzFFLCtEQUFxRDtBQVlyRDs7O0dBR0c7QUFDSCx3QkFBZ0MsU0FBUSx1REFBd0I7SUFBaEU7O1FBQ1ksY0FBUyxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFDO0lBcUZsRCxDQUFDO0lBbkZDLFlBQVksQ0FBQyxJQUFZO1FBQ3ZCLHFDQUFxQztRQUVyQyxFQUFFLENBQUMsQ0FBQyxlQUFVLENBQUMsSUFBSSxDQUFDLElBQUksYUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNoRCxtREFBbUQ7UUFDckQsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxlQUFVLENBQUMsV0FBSSxDQUFDLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLElBQUksYUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNoRixxRUFBcUU7WUFDckUsSUFBSSxHQUFHLFdBQUksQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixJQUFJLElBQUksQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFFRCxNQUFNLElBQUksR0FBNkIsa0NBQVksQ0FBQyxJQUFJLENBQTZCLENBQUM7UUFDdEYsRUFBRSxDQUFD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QUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDdkQsTUFBTSxJQUFJLHVDQUErQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFFRCxNQUFNLENBQUMsSUFBK0IsQ0FBQztJQUN6QyxDQUFDO0NBQ0Y7QUF0RkQsZ0RBc0ZDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtcbiAgQ29sbGVjdGlvbkRlc2NyaXB0aW9uLFxuICBSdWxlRmFjdG9yeSxcbiAgU2NoZW1hdGljRGVzY3JpcHRpb24sXG4gIFVua25vd25Db2xsZWN0aW9uRXhjZXB0aW9uLFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge1xuICBDb2xsZWN0aW9uTWlzc2luZ1NjaGVtYXRpY3NNYXBFeGNlcHRpb24sXG4gIFNjaGVtYXRpY01pc3NpbmdGaWVsZHNFeGNlcHRpb24sXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzL3Rvb2xzJztcbmltcG9ydCB7IGV4aXN0c1N5bmMsIHN0YXRTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgRmlsZVN5c3RlbUNvbGxlY3Rpb25EZXNjcmlwdGlvbiwgRmlsZVN5c3RlbVNjaGVtYXRpY0Rlc2NyaXB0aW9uIH0gZnJvbSAnLi9kZXNjcmlwdGlvbic7XG5pbXBvcnQgeyBFeHBvcnRTdHJpbmdSZWYgfSBmcm9tICcuL2V4cG9ydC1yZWYnO1xuaW1wb3J0IHsgRmlsZVN5c3RlbUVuZ2luZUhvc3RCYXNlIH0gZnJvbSAnLi9maWxlLXN5c3RlbS1lbmdpbmUtaG9zdC1iYXNlJztcbmltcG9ydCB7IHJlYWRKc29uRmlsZSB9IGZyb20gJy4vZmlsZS1zeXN0ZW0tdXRpbGl0eSc7XG5cblxuLyoqXG4gKiBVc2VkIHRvIHNpbXBsaWZ5IHR5cGluZ3MuXG4gKi9cbmV4cG9ydCBkZWNsYXJlIHR5cGUgRmlsZVN5c3RlbUNvbGxlY3Rpb25EZXNjXG4gID0gQ29sbGVjdGlvbkRlc2NyaXB0aW9uPEZpbGVTeXN0ZW1Db2xsZWN0aW9uRGVzY3JpcHRpb24+O1xuZXhwb3J0IGRlY2xhcmUgdHlwZSBGaWxlU3lzdGVtU2NoZW1hdGljRGVzY1xuICA9IFNjaGVtYXRpY0Rlc2NyaXB0aW9uPEZpbGVTeXN0ZW1Db2xsZWN0aW9uRGVzY3JpcHRpb24sIEZpbGVTeXN0ZW1TY2hlbWF0aWNEZXNjcmlwdGlvbj47XG5cblxuLyoqXG4gKiBBIHNpbXBsZSBFbmdpbmVIb3N0IHRoYXQgdXNlcyBhIHJlZ2lzdHJ5IG9mIHtuYW1lID0+IHBhdGh9IHRvIGZpbmQgY29sbGVjdGlvbnMuIFRoaXMgY2FuIGJlXG4gKiB1c2VmdWwgZm9yIHRvb2xpbmcgdGhhdCB3YW50IHRvIGxvYWQgZ2VuZXJpYyBjb2xsZWN0aW9ucyBmcm9tIHJhbmRvbSBwbGFjZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWdpc3RyeUVuZ2luZUhvc3QgZXh0ZW5kcyBGaWxlU3lzdGVtRW5naW5lSG9zdEJhc2Uge1xuICBwcm90ZWN0ZWQgX3JlZ2lzdHJ5ID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcblxuICByZWdpc3RlclBhdGgocGF0aDogc3RyaW5nKSB7XG4gICAgLy8gUmVhZCB0aGUgY29sbGVjdGlvbiBmcm9tIHRoZSBwYXRoLlxuXG4gICAgaWYgKGV4aXN0c1N5bmMocGF0aCkgJiYgc3RhdFN5bmMocGF0aCkuaXNGaWxlKCkpIHtcbiAgICAgIC8vIEFsbG93IHBhdGggdG8gYmUgZnVsbHkgcXVhbGlmaWVkIHRvIGEgSlNPTiBmaWxlLlxuICAgIH0gZWxzZSBpZiAoZXhpc3RzU3luYyhqb2luKHBhdGgsICdjb2xsZWN0aW9uLmpzb24nKSkgJiYgc3RhdFN5bmMocGF0aCkuaXNGaWxlKCkpIHtcbiAgICAgIC8vIEFsbG93IHBhdGggdG8gcG9pbnQgdG8gYSBkaXJlY3RvcnkgY29udGFpbmluZyBhIGBjb2xsZWN0aW9uLmpzb25gLlxuICAgICAgcGF0aCA9IGpvaW4ocGF0aCwgJ2NvbGxlY3Rpb24uanNvbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcGF0aDogXCIke3BhdGh9XCIuYCk7XG4gICAgfVxuXG4gICAgY29uc3QganNvbjogRmlsZVN5c3RlbUNvbGxlY3Rpb25EZXNjID0gcmVhZEpzb25GaWxlKHBhdGgpIGFzIEZpbGVTeXN0ZW1Db2xsZWN0aW9uRGVzYztcbiAgICBpZiAoIWpzb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBwYXRoIGZvciBjb2xsZWN0aW9uOiBcIiR7cGF0aH1cIi5gKTtcbiAgICB9XG5cbiAgICAvLyBWYWxpZGF0ZSB0aGF0IHRoZSBuYW1lIGlzIG5vdCBpbiB0aGUgcmVnaXN0cnkgYWxyZWFkeSAoYW5kIHRoYXQgdGhlIHJlZ2lzdHJ5IGRvZXMgbm90XG4gICAgLy8gY29udGFpbiB0aGlzIHBhdGggdW5kZXIgYW5vdGhlciBuYW1lLlxuICAgIGNvbnN0IG5hbWUgPSBqc29uLm5hbWU7XG4gICAgY29uc3QgbWF5YmVQYXRoID0gdGhpcy5fcmVnaXN0cnkuZ2V0KG5hbWUpO1xuICAgIGlmIChtYXliZVBhdGggJiYgbWF5YmVQYXRoICE9IHBhdGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ29sbGVjdGlvbiBuYW1lIFwiJHtuYW1lfVwiIGFscmVhZHkgcmVnaXN0ZXJlZC5gKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCByZWdpc3RyeVBhdGggb2YgdGhpcy5fcmVnaXN0cnkudmFsdWVzKCkpIHtcbiAgICAgIGlmIChyZWdpc3RyeVBhdGggPT0gcGF0aCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvbGxlY3Rpb24gcGF0aCBcIiR7cGF0aH1cIiBhbHJlYWR5IHJlZ2lzdGVyZWQgdW5kZXIgYW5vdGhlciBuYW1lLmApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX3JlZ2lzdHJ5LnNldChuYW1lLCBwYXRoKTtcbiAgfVxuXG4gIHJlbW92ZVBhdGgocGF0aDogc3RyaW5nKSB7XG4gICAgZm9yIChjb25zdCBba2V5LCBwXSBvZiB0aGlzLl9yZWdpc3RyeS5lbnRyaWVzKCkpIHtcbiAgICAgIGlmIChwID09IHBhdGgpIHtcbiAgICAgICAgdGhpcy5fcmVnaXN0cnkuZGVsZXRlKGtleSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlTmFtZShuYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9yZWdpc3RyeS5kZWxldGUobmFtZSk7XG4gIH1cblxuXG4gIHByb3RlY3RlZCBfcmVzb2x2ZUNvbGxlY3Rpb25QYXRoKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgbWF5YmVQYXRoID0gdGhpcy5fcmVnaXN0cnkuZ2V0KG5hbWUpO1xuICAgIGlmICghbWF5YmVQYXRoKSB7XG4gICAgICB0aHJvdyBuZXcgVW5rbm93bkNvbGxlY3Rpb25FeGNlcHRpb24obmFtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1heWJlUGF0aDtcbiAgfVxuXG4gIHByb3RlY3RlZCBfcmVzb2x2ZVJlZmVyZW5jZVN0cmluZyhyZWZTdHJpbmc6IHN0cmluZywgcGFyZW50UGF0aDogc3RyaW5nKSB7XG4gICAgLy8gVXNlIHRoZSBzYW1lIGtpbmQgb2YgZXhwb3J0IHN0cmluZ3MgYXMgTm9kZU1vZHVsZS5cbiAgICBjb25zdCByZWYgPSBuZXcgRXhwb3J0U3RyaW5nUmVmPFJ1bGVGYWN0b3J5PHt9Pj4ocmVmU3RyaW5nLCBwYXJlbnRQYXRoKTtcbiAgICBpZiAoIXJlZi5yZWYpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB7IHJlZjogcmVmLnJlZiwgcGF0aDogcmVmLm1vZHVsZSB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIF90cmFuc2Zvcm1Db2xsZWN0aW9uRGVzY3JpcHRpb24obmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjOiBQYXJ0aWFsPEZpbGVTeXN0ZW1Db2xsZWN0aW9uRGVzYz4pIHtcbiAgICBpZiAoIWRlc2Muc2NoZW1hdGljcyB8fCB0eXBlb2YgZGVzYy5zY2hlbWF0aWNzICE9ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgQ29sbGVjdGlvbk1pc3NpbmdTY2hlbWF0aWNzTWFwRXhjZXB0aW9uKG5hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiBkZXNjIGFzIEZpbGVTeXN0ZW1Db2xsZWN0aW9uRGVzYztcbiAgfVxuXG4gIHByb3RlY3RlZCBfdHJhbnNmb3JtU2NoZW1hdGljRGVzY3JpcHRpb24obmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jb2xsZWN0aW9uOiBGaWxlU3lzdGVtQ29sbGVjdGlvbkRlc2MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzYzogUGFydGlhbDxGaWxlU3lzdGVtU2NoZW1hdGljRGVzYz4pIHtcbiAgICBpZiAoIWRlc2MuZmFjdG9yeUZuIHx8ICFkZXNjLnBhdGggfHwgIWRlc2MuZGVzY3JpcHRpb24pIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNNaXNzaW5nRmllbGRzRXhjZXB0aW9uKG5hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiBkZXNjIGFzIEZpbGVTeXN0ZW1TY2hlbWF0aWNEZXNjO1xuICB9XG59XG4iXX0=