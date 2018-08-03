export default function remapFunction(genItem, getMapping) {
	const mapping = getMapping(genItem.loc);

	if (!mapping) {
		return null;
	}

	const srcItem = {
		name: genItem.name,
		line: mapping.loc.start.line,
		loc: mapping.loc,
	};

	if (genItem.skip) {
		srcItem.skip = genItem.skip;
	}

	return { srcItem, source: mapping.source };
}
